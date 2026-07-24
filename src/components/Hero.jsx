// Scroll-scrubbed construction time-lapse: a 400vh wrapper holds a sticky
// full-viewport canvas that paints a pre-rendered pool-construction frame
// sequence keyed to scroll progress, with a manual lerp so fast flicks never
// feel like a slideshow. GSAP ScrollTrigger only supplies the progress
// number here — the sticky positioning itself is plain CSS, not a GSAP pin,
// so it degrades to a normal in-flow section if JS never runs.
//
// The poster image is always in the DOM as the base layer: it's what paints
// before the frame loader finishes (no blank canvas flash, no CLS) and it's
// also the entire fallback for prefers-reduced-motion and for a frame-load
// failure — both routes render the exact same static section below.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LERP = 0.12;
const MOBILE_QUERY = "(max-width: 767px)";
const VIDEO_HANDOFF_IN = 0.98;
const VIDEO_HANDOFF_OUT = 0.965;
const MAX_CONCURRENT_LOADS = 4;

const pad3 = (n) => String(n).padStart(3, "0");
const pad2 = (n) => String(n).padStart(2, "0");

function smoothstep(p, a, b) {
  if (a === b) return p >= a ? 1 : 0;
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

// Opacity band helper: fades in over [inStart,inEnd] (or is already fully
// visible from p=0 when inStart===inEnd===0), holds at 1, then fades out
// over [outStart,outEnd] — or holds forever if outStart is null.
function band(p, inStart, inEnd, outStart, outEnd) {
  let opacity;
  if (inStart === inEnd) opacity = p >= inStart ? 1 : 0;
  else if (p <= inStart) opacity = 0;
  else if (p < inEnd) opacity = smoothstep(p, inStart, inEnd);
  else opacity = 1;

  if (opacity === 1 && outStart != null && p > outStart) {
    opacity = p < outEnd ? 1 - smoothstep(p, outStart, outEnd) : 0;
  }
  return opacity;
}

// Every scroll-driven text state (kicker/h1, the three phase captions, the
// final line) lives in the exact same anchored box and only ever crossfades
// with a 12px drift — never a position change — so the eye never has to
// re-find where to look.
function setBlock(el, opacity) {
  if (!el) return;
  gsap.set(el, { opacity, y: (1 - opacity) * 12, pointerEvents: opacity > 0.5 ? "auto" : "none" });
}

// Tunable timeline for the three construction captions — edit start/end here
// to retime against the video; everything (crossfade windows, the rail's
// marker boundaries, and its fill fraction) derives from these numbers.
const CAPTION_TIMING = [
  { num: "01", title: "Armiranobetonska školjka", subline: "Konstrukcija koja definira trajnost bazena.", start: 0.12, end: 0.3 },
  { num: "02", title: "Obloga i hidroizolacija", subline: "Završna površina za dugotrajnu čistoću vode.", start: 0.3, end: 0.48 },
  { num: "03", title: "Voda i tehnika", subline: "Nevidljivi sustavi za besprijekorno iskustvo.", start: 0.48, end: 0.72 },
];
const FINAL_START = 0.72;
const CROSSFADE_MARGIN = 0.035;

// Mobile hero shows a compact four-step phase label (three construction
// captions plus a closing "finished" state) instead of the desktop's
// poetic closing line + CTA — the progress indicator counts against these.
const MOBILE_PHASE_TITLES = [CAPTION_TIMING[0].title, CAPTION_TIMING[1].title, CAPTION_TIMING[2].title, "Završen bazen"];

// The bottom scrim is full-strength while the frames are brightest (raw
// concrete, overcast daylight) and eases down once the video's own blue-hour
// contrast starts doing the work — so the final scene never looks
// double-darkened.
function scrimOpacityForP(p) {
  if (p <= 0.3) return 1;
  if (p >= 0.7) return 0.4;
  const t = (p - 0.3) / 0.4;
  return 1 - t * 0.6;
}

function drawCover(ctx, bitmap, canvasWidth, canvasHeight) {
  const iw = bitmap.width;
  const ih = bitmap.height;
  const canvasRatio = canvasWidth / canvasHeight;
  const imgRatio = iw / ih;
  let sx, sy, sw, sh;
  if (imgRatio > canvasRatio) {
    sh = ih;
    sw = ih * canvasRatio;
    sx = (iw - sw) / 2;
    sy = 0;
  } else {
    sw = iw;
    sh = iw / canvasRatio;
    sx = 0;
    sy = (ih - sh) / 2;
  }
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, canvasWidth, canvasHeight);
}

export default function Hero() {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const introRef = useRef(null);
  const scrollHintRef = useRef(null);
  const phaseRefs = useRef([null, null, null]);
  const finalRef = useRef(null);
  const railFillRef = useRef(null);
  const railMarkerRefs = useRef([null, null, null, null]);
  const scrimRef = useRef(null);
  const mobilePhaseRefs = useRef([null, null, null, null]);
  const mobileScrimRef = useRef(null);
  const mobileProgressTextRef = useRef(null);
  const mobileProgressFillRef = useRef(null);

  const ctxRef = useRef(null);
  const basePathRef = useRef("/frames");
  const frameCountRef = useRef(0);
  const framesRef = useRef([]);
  const progressRef = useRef(0);
  const currentFrameRef = useRef(1);
  const lastDrawnRef = useRef(0);
  const videoActiveRef = useRef(false);
  const rafIdRef = useRef(null);

  // Both default false so the first client paint matches the prerendered
  // (SSG) markup; corrected in an effect right after mount, same pattern
  // Statement/Projects use for prefers-reduced-motion.
  const [reduced, setReduced] = useState(false);
  const [framesReady, setFramesReady] = useState(false);
  const [framesFailed, setFramesFailed] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Load the manifest, preload the anchor frames (1, 30, 60, 90, last),
  // paint frame 1, then lazily background-load the rest with a small
  // concurrency cap via createImageBitmap.
  useEffect(() => {
    if (reduced) return;
    let cancelled = false;

    const isMobile = window.matchMedia(MOBILE_QUERY).matches;
    const basePath = isMobile ? "/frames-mobile" : "/frames";
    basePathRef.current = basePath;

    const failTimer = setTimeout(() => {
      if (!cancelled && !framesRef.current.length) setFramesFailed(true);
    }, 3000);

    async function loadFrame(idx) {
      const frames = framesRef.current;
      const entry = frames[idx];
      if (!entry || entry.status === "loaded" || entry.status === "loading") return;
      entry.status = "loading";
      try {
        const res = await fetch(`${basePath}/hero-${pad3(idx + 1)}.webp`);
        if (!res.ok) throw new Error("frame fetch failed");
        const blob = await res.blob();
        entry.bitmap = await createImageBitmap(blob);
        entry.status = "loaded";
      } catch {
        entry.status = "error";
      }
    }

    async function backgroundLoadAll(count) {
      let next = 0;
      const worker = async () => {
        while (!cancelled) {
          while (next < count && framesRef.current[next]?.status !== "idle") next++;
          if (next >= count) return;
          const idx = next++;
          await loadFrame(idx);
        }
      };
      await Promise.all(Array.from({ length: MAX_CONCURRENT_LOADS }, worker));
    }

    fetch(`${basePath}/manifest.json`)
      .then((r) => {
        if (!r.ok) throw new Error("manifest missing");
        return r.json();
      })
      .then(async (manifest) => {
        if (cancelled) return;
        const count = manifest.count;
        frameCountRef.current = count;
        framesRef.current = Array.from({ length: count }, () => ({ status: "idle", bitmap: null }));

        const preloadNumbers = [...new Set([1, 30, 60, 90, count].filter((n) => n >= 1 && n <= count))];
        await Promise.all(preloadNumbers.map((n) => loadFrame(n - 1)));
        if (cancelled) return;

        clearTimeout(failTimer);
        setFramesReady(true);
        backgroundLoadAll(count);
      })
      .catch(() => {
        if (!cancelled) setFramesFailed(true);
      });

    return () => {
      cancelled = true;
      clearTimeout(failTimer);
    };
  }, [reduced]);

  function findNearestLoaded(idx) {
    const frames = framesRef.current;
    if (frames[idx]?.status === "loaded") return idx;
    for (let d = 1; d < frames.length; d++) {
      const lo = idx - d;
      const hi = idx + d;
      if (lo >= 0 && frames[lo]?.status === "loaded") return lo;
      if (hi < frames.length && frames[hi]?.status === "loaded") return hi;
    }
    return -1;
  }

  function drawFrameNumber(num) {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || !frameCountRef.current) return;
    const idx = Math.min(Math.max(Math.round(num) - 1, 0), frameCountRef.current - 1);
    const nearest = findNearestLoaded(idx);
    if (nearest === -1) return;
    const bitmap = framesRef.current[nearest]?.bitmap;
    if (!bitmap) return;
    drawCover(ctx, bitmap, canvas.width, canvas.height);
  }

  // Canvas sizing: cover-fit pixel buffer, DPR capped at 2 desktop / 1.5
  // mobile, redrawn on resize.
  useLayoutEffect(() => {
    if (reduced || framesFailed || !framesReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctxRef.current = canvas.getContext("2d");

    function resize() {
      const isMobile = window.matchMedia(MOBILE_QUERY).matches;
      const dprCap = isMobile ? 1.5 : 2;
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      drawFrameNumber(lastDrawnRef.current || 1);
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [reduced, framesFailed, framesReady]);

  // Scroll progress + the rAF draw/choreography loop, gated to run only
  // while the section is actually in the viewport.
  useLayoutEffect(() => {
    if (reduced || framesFailed || !framesReady) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    function applyTextChoreography(p) {
      const introOpacity = band(p, 0, 0, CAPTION_TIMING[0].start - CROSSFADE_MARGIN, CAPTION_TIMING[0].start + CROSSFADE_MARGIN);
      setBlock(introRef.current, introOpacity);
      if (scrollHintRef.current) {
        gsap.set(scrollHintRef.current, { opacity: introOpacity * (1 - smoothstep(p, 0, 0.05)) });
      }

      CAPTION_TIMING.forEach((c, i) => {
        const opacity = band(p, c.start - CROSSFADE_MARGIN, c.start + CROSSFADE_MARGIN, c.end - CROSSFADE_MARGIN, c.end + CROSSFADE_MARGIN);
        setBlock(phaseRefs.current[i], opacity);
        setBlock(mobilePhaseRefs.current[i], opacity);
      });

      const finalOpacity = band(p, FINAL_START - CROSSFADE_MARGIN, FINAL_START + CROSSFADE_MARGIN, null, null);
      setBlock(finalRef.current, finalOpacity);
      setBlock(mobilePhaseRefs.current[3], finalOpacity);

      if (scrimRef.current) gsap.set(scrimRef.current, { opacity: scrimOpacityForP(p) });
      if (mobileScrimRef.current) gsap.set(mobileScrimRef.current, { opacity: scrimOpacityForP(p) });

      // Vertical progress rail (desktop) / bottom progress bar (mobile):
      // fill grows from the first caption's start through to the very end.
      const fillFraction = Math.min(1, Math.max(0, (p - CAPTION_TIMING[0].start) / (1 - CAPTION_TIMING[0].start)));
      if (railFillRef.current) gsap.set(railFillRef.current, { scaleY: fillFraction });
      if (mobileProgressFillRef.current) gsap.set(mobileProgressFillRef.current, { scaleX: fillFraction });

      const markerBounds = [CAPTION_TIMING[0].start, CAPTION_TIMING[1].start, CAPTION_TIMING[2].start, FINAL_START, 1.001];
      let mobileActiveIndex = 0;
      railMarkerRefs.current.forEach((el, i) => {
        const active = p >= markerBounds[i] && p < markerBounds[i + 1];
        if (active) mobileActiveIndex = i;
        if (!el) return;
        gsap.set(el, { color: active ? "var(--color-acqua)" : "rgba(255,255,255,0.5)" });
      });
      if (mobileProgressTextRef.current) {
        mobileProgressTextRef.current.textContent = `${pad2(mobileActiveIndex + 1)} / 04`;
      }
    }

    function applyVideoHandoff(p) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
      if (p >= VIDEO_HANDOFF_IN && !videoActiveRef.current) {
        videoActiveRef.current = true;
        gsap.to(canvas, { opacity: 0, duration: 0.4, ease: "power1.out" });
        gsap.to(video, { opacity: 1, duration: 0.4, ease: "power1.out" });
        video.play().catch(() => {});
      } else if (p < VIDEO_HANDOFF_OUT && videoActiveRef.current) {
        videoActiveRef.current = false;
        gsap.to(video, { opacity: 0, duration: 0.4, ease: "power1.out", onComplete: () => video.pause() });
        gsap.to(canvas, { opacity: 1, duration: 0.4, ease: "power1.out" });
      } else if (videoActiveRef.current && video.paused) {
        video.play().catch(() => {});
      } else if (p > 0.9 && video.readyState < 2) {
        video.load();
      }
    }

    function tick() {
      const p = progressRef.current;
      const count = frameCountRef.current;
      const target = 1 + p * (count - 1);
      currentFrameRef.current += (target - currentFrameRef.current) * LERP;
      const rounded = Math.round(currentFrameRef.current);
      if (rounded !== lastDrawnRef.current) {
        drawFrameNumber(rounded);
        lastDrawnRef.current = rounded;
      }
      applyTextChoreography(p);
      applyVideoHandoff(p);
      rafIdRef.current = requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (rafIdRef.current == null) rafIdRef.current = requestAnimationFrame(tick);
          if (videoActiveRef.current) videoRef.current?.play().catch(() => {});
        } else {
          if (rafIdRef.current != null) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
          }
          videoRef.current?.pause();
        }
      },
      { threshold: 0 }
    );
    io.observe(wrapper);

    return () => {
      st.kill();
      io.disconnect();
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    };
  }, [reduced, framesFailed, framesReady]);

  if (reduced || framesFailed) {
    return (
      <section className="relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden bg-notte text-travertino">
        <img
          src="/hero-poster.jpg"
          alt="Tempus Pool bazen u suton, s upaljenom podvodnom rasvjetom"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="sync"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(190deg,rgba(10,24,21,0.15)_0%,rgba(10,24,21,0.6)_55%,rgba(10,24,21,0.92)_100%)]" />
        <div className="relative z-10 px-8 pb-16 lg:px-12 lg:pb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-acqua">Tempus Pool · Umag, Istra</p>
          <h1 className="mt-6 max-w-4xl font-display text-[44px] font-light leading-[1.1] tracking-tight sm:text-6xl lg:text-[5.2rem]">
            Bazen nije dodatak vrtu. <span className="italic text-acqua-soft">Razlog je da u njemu ostanete.</span>
          </h1>
          <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
            <a
              href="#kontakt"
              className="group flex items-center gap-2 border-b border-acqua/60 pb-1 text-sm font-medium tracking-wide text-acqua transition-colors hover:border-acqua"
            >
              Zatražite privatnu konzultaciju
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={wrapperRef} className="relative w-full bg-notte" style={{ height: "400vh" }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden text-travertino">
        <img
          src="/hero-poster.jpg"
          alt=""
          aria-hidden="true"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="sync"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
        >
          <source src="/hero-loop.mp4" type="video/mp4" />
        </video>

        {/* Full-bleed bottom scrim — soft, no visible edges, spans the whole
            viewport width so it never reads as a UI box behind the text. Its
            own opacity eases down through the scroll (see scrimOpacityForP)
            since the video darkens into blue hour and needs less help.
            Layered with a second, left-anchored radial pool: measured against
            the actual brightest frame (hero-001.webp), the plain linear
            gradient alone left the mint kicker at ~1.8:1 contrast — it's
            fully transparent by 45% height, but the kicker sits ~31% up from
            the bottom. The radial layer adds coverage specifically behind
            the text column (verified back to ~4.7:1) while fading out well
            before mid-screen, so the pool/tree on the right stay under only
            the light full-bleed layer. */}
        <div
          ref={scrimRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 92% at 8% 100%, rgba(8,20,17,0.72) 0%, rgba(8,20,17,0.68) 34%, rgba(8,20,17,0.28) 60%, transparent 85%), " +
              "linear-gradient(to top, rgba(10,25,20,0.55) 0%, rgba(10,25,20,0.25) 22%, transparent 45%)",
          }}
        />

        {/* Far-left vertical progress rail — four chapter markers (three
            construction phases + the closing line) with a hairline that
            fills as the story advances. A blurred dark backdrop line sits
            behind the hairline/markers so both read against bright and dark
            frames alike (a plain travertino line disappears against the
            white villa wall in phase 1). */}
        <div
          className="pointer-events-none absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-9 md:flex lg:left-8 lg:gap-11"
          aria-hidden="true"
        >
          <div className="absolute left-1/2 top-2 bottom-2 w-[3px] -translate-x-1/2 bg-black/40 blur-[2px]" />
          <div className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-white/25" />
          <div ref={railFillRef} className="absolute left-1/2 top-2 bottom-2 w-px origin-top -translate-x-1/2 scale-y-0 bg-acqua" />
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              ref={(el) => (railMarkerRefs.current[i] = el)}
              className="relative font-mono text-[10px] tracking-[0.15em]"
              style={{ color: "rgba(255,255,255,0.5)", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          ))}
        </div>

        {/* Mobile-only readability scrim behind the lower-third text block —
            simple bottom-anchored gradient (no left-radial pool needed since
            the mobile block spans full width) that eases down in strength
            with the same curve as the desktop scrim. */}
        <div
          ref={mobileScrimRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[58%] md:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(6,16,14,0.85) 0%, rgba(6,16,14,0.6) 34%, rgba(6,16,14,0.18) 68%, transparent 100%)",
          }}
        />

        {/* Dedicated mobile hero content — not a scaled-down desktop layout.
            Kicker + headline stay put in the lower third; only the active
            construction phase crossfades beneath them, and a compact "01 /
            04" + hairline bar (fed from the same scroll progress as the
            desktop rail) replaces the vertical timeline entirely. */}
        <div className="pointer-events-none absolute inset-x-0 z-10 px-8 md:hidden" style={{ bottom: "9vh" }}>
          <div className="max-w-[90%]">
            <p
              className="font-mono text-[10px] uppercase text-acqua"
              style={{ letterSpacing: "0.34em", textShadow: "0 1px 2px rgba(0,0,0,0.45), 0 8px 28px rgba(0,0,0,0.4)" }}
            >
              Tempus Pool · Umag, Istra
            </p>
            <h1
              className="mt-4 font-display text-[44px] font-light leading-[1.12] tracking-tight"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.45), 0 8px 28px rgba(0,0,0,0.4)" }}
            >
              Bazen nije dodatak vrtu.
            </h1>

            <div className="relative mt-5 min-h-[26px]">
              {MOBILE_PHASE_TITLES.map((title, i) => (
                <p
                  key={title}
                  ref={(el) => (mobilePhaseRefs.current[i] = el)}
                  className="absolute inset-x-0 top-0 font-display text-[15px] font-light uppercase leading-snug tracking-[0.08em] text-acqua-soft opacity-0"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.45), 0 6px 20px rgba(0,0,0,0.4)" }}
                >
                  {title}
                </p>
              ))}
            </div>

            <div className="mt-7 flex items-center gap-3">
              <span ref={mobileProgressTextRef} className="font-mono text-[10px] tracking-[0.2em] text-travertino/70">
                01 / 04
              </span>
              <span className="relative h-px w-14 overflow-hidden bg-white/25">
                <span ref={mobileProgressFillRef} className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-acqua" />
              </span>
            </div>
          </div>
        </div>

        {/* Single anchored text block — left edge matches the header's
            container/logo, bottom fixed at 10vh. Every scroll state
            (kicker+h1, the three captions, the final line) renders inside
            this same box and only ever crossfades in place. Desktop/tablet
            only — mobile gets its own dedicated layout above. */}
        <div className="pointer-events-none absolute inset-x-0 z-10 hidden md:block" style={{ bottom: "10vh" }}>
          <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
            <div className="relative w-full max-w-[85vw] md:max-w-[45vw]">
              <div className="relative min-h-[220px] sm:min-h-[260px] lg:min-h-[300px]">
                <div ref={introRef} className="pointer-events-auto absolute inset-0 flex flex-col justify-end">
                  <p
                    className="font-mono text-[11px] uppercase text-acqua"
                    style={{ letterSpacing: "0.37em", textShadow: "0 1px 2px rgba(0,0,0,0.45), 0 8px 32px rgba(0,0,0,0.35)" }}
                  >
                    Tempus Pool · Umag, Istra
                  </p>
                  <h1
                    className="mt-6 font-display text-[2.6rem] font-light leading-[1.05] tracking-tight sm:text-6xl lg:text-[5.2rem]"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.45), 0 8px 32px rgba(0,0,0,0.35)" }}
                  >
                    Bazen nije dodatak vrtu.
                  </h1>
                  <p
                    ref={scrollHintRef}
                    className="mt-8 font-mono text-[10px] uppercase tracking-[0.28em] text-travertino/90"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.45), 0 8px 32px rgba(0,0,0,0.35)" }}
                  >
                    Pomaknite se za više <span className="inline-block animate-hero-arrow">↓</span>
                  </p>
                </div>

                {CAPTION_TIMING.map((c, i) => (
                  <div
                    key={c.num}
                    ref={(el) => (phaseRefs.current[i] = el)}
                    className="pointer-events-auto absolute inset-0 flex flex-col justify-end opacity-0"
                  >
                    <p className="font-mono text-xs tracking-[0.4em] text-acqua">{c.num}</p>
                    <h3 className="mt-4 font-display text-[1.04rem] font-light uppercase leading-[1.15] tracking-tight text-travertino sm:text-[1.5rem] lg:text-[2.08rem]">
                      {c.title}
                    </h3>
                    <p className="mt-4 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[13px] leading-relaxed text-travertino/55 sm:text-sm">
                      {c.subline}
                    </p>
                  </div>
                ))}

                <div ref={finalRef} className="pointer-events-auto absolute inset-0 flex flex-col justify-end opacity-0">
                  <h2 className="font-display text-[1.82rem] font-light italic leading-[1.15] text-acqua-soft sm:text-[2.625rem] lg:text-[3.64rem]">
                    Razlog je da u njemu ostanete.
                  </h2>
                  <a
                    href="#kontakt"
                    className="group mt-7 flex w-fit items-center gap-2 border-b border-acqua/60 pb-1 text-sm font-medium tracking-wide text-acqua transition-colors hover:border-acqua"
                  >
                    Zatražite privatnu konzultaciju
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
