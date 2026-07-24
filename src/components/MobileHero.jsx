// Mobile hero: a play-once cinematic clip (portrait reframe of the same
// construction transformation used on desktop), not a scaled-down version of
// the desktop scroll-scrub. No pinning, no scroll-jacking — native scroll
// continues straight into the next section. The active construction phase is
// driven by the video's own currentTime instead of scroll progress, and once
// the clip finishes it freezes on its last frame and never restarts.
import { useEffect, useRef, useState } from "react";

function smoothstep(p, a, b) {
  if (a === b) return p >= a ? 1 : 0;
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

// Same crossfade-band shape as the desktop hero's choreography, just fed
// seconds instead of scroll progress.
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

function setBlock(el, opacity) {
  if (!el) return;
  el.style.opacity = String(opacity);
  el.style.transform = `translateY(${(1 - opacity) * 10}px)`;
  el.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
}

// Phase thresholds in seconds against the 9.04s clip — proportioned the same
// way as the desktop CAPTION_TIMING fractions, just anchored to a fixed 2s
// intro instead of a scroll fraction.
const CROSSFADE_MARGIN = 0.4;
const INTRO_END = 2.0;
const PHASES = [
  { num: "01", title: "Armiranobetonska školjka", subline: "Konstrukcija koja definira trajnost bazena.", start: 2.0, end: 3.44 },
  { num: "02", title: "Obloga i hidroizolacija", subline: "Završna površina za dugotrajnu čistoću vode.", start: 3.44, end: 4.88 },
  { num: "03", title: "Voda i tehnika", subline: "Nevidljivi sustavi za besprijekorno iskustvo.", start: 4.88, end: 6.8 },
];
const FINAL_START = 6.8;

const textShadow = "0 1px 2px rgba(0,0,0,0.45), 0 8px 28px rgba(0,0,0,0.4)";

export default function MobileHero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const introRef = useRef(null);
  const phaseRefs = useRef([null, null, null]);
  const finalRef = useRef(null);
  const hasEndedRef = useRef(false);
  const rvfcIdRef = useRef(null);

  const [staticFallback, setStaticFallback] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection?.saveData === true;
    if (reducedMotion || saveData) setStaticFallback(true);
  }, []);

  useEffect(() => {
    if (staticFallback) return;
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    function updateCaptions(t) {
      setBlock(introRef.current, band(t, 0, 0, INTRO_END - CROSSFADE_MARGIN, INTRO_END + CROSSFADE_MARGIN));
      PHASES.forEach((ph, i) => {
        setBlock(phaseRefs.current[i], band(t, ph.start - CROSSFADE_MARGIN, ph.start + CROSSFADE_MARGIN, ph.end - CROSSFADE_MARGIN, ph.end + CROSSFADE_MARGIN));
      });
      setBlock(finalRef.current, band(t, FINAL_START - CROSSFADE_MARGIN, FINAL_START + CROSSFADE_MARGIN, null, null));
    }

    const supportsRVFC = typeof video.requestVideoFrameCallback === "function";

    function frameStep() {
      updateCaptions(video.currentTime);
      rvfcIdRef.current = video.requestVideoFrameCallback(frameStep);
    }
    function onTimeUpdate() {
      updateCaptions(video.currentTime);
    }
    function startLoop() {
      video.style.opacity = "1";
      if (supportsRVFC && rvfcIdRef.current == null) rvfcIdRef.current = video.requestVideoFrameCallback(frameStep);
    }
    function stopLoop() {
      if (supportsRVFC && rvfcIdRef.current != null && video.cancelVideoFrameCallback) {
        video.cancelVideoFrameCallback(rvfcIdRef.current);
        rvfcIdRef.current = null;
      }
    }
    function onEnded() {
      hasEndedRef.current = true;
      stopLoop();
      updateCaptions(FINAL_START + 1);
    }
    function onError() {
      clearTimeout(fallbackTimer);
      setStaticFallback(true);
    }
    function onCanPlay() {
      clearTimeout(fallbackTimer);
    }

    video.addEventListener("play", startLoop);
    video.addEventListener("pause", stopLoop);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);
    video.addEventListener("canplay", onCanPlay);
    if (!supportsRVFC) video.addEventListener("timeupdate", onTimeUpdate);

    const fallbackTimer = setTimeout(() => {
      if (video.readyState < 2) setStaticFallback(true);
    }, 3000);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (hasEndedRef.current) return;
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.6 }
    );
    io.observe(section);

    function onVisibilityChange() {
      if (hasEndedRef.current) return;
      if (document.hidden) {
        video.pause();
        return;
      }
      const rect = section.getBoundingClientRect();
      const visible = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
      if (visible / rect.height >= 0.6) video.play().catch(() => {});
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    updateCaptions(0);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      video.removeEventListener("play", startLoop);
      video.removeEventListener("pause", stopLoop);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
      video.removeEventListener("canplay", onCanPlay);
      if (!supportsRVFC) video.removeEventListener("timeupdate", onTimeUpdate);
      clearTimeout(fallbackTimer);
      stopLoop();
    };
  }, [staticFallback]);

  if (staticFallback) {
    return (
      <section className="relative flex h-[100svh] min-h-[560px] w-full items-end overflow-hidden bg-notte text-travertino">
        <img
          src="/hero-mobile-poster.jpg"
          alt="Tempus Pool bazen u suton, s upaljenom podvodnom rasvjetom"
          width={1080}
          height={1920}
          fetchPriority="high"
          decoding="sync"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%]"
          style={{
            background:
              "linear-gradient(to top, rgba(6,16,14,0.85) 0%, rgba(6,16,14,0.55) 38%, rgba(6,16,14,0.15) 70%, transparent 100%)",
          }}
        />
        <div className="relative z-10 w-full px-6 pb-14">
          <p className="font-mono text-[10px] uppercase text-acqua" style={{ letterSpacing: "0.34em", textShadow }}>
            Tempus Pool · Umag, Istra
          </p>
          <h1
            className="mt-4 font-display font-light leading-[1.12] tracking-tight"
            style={{ fontSize: "clamp(2rem, 8.6vw, 2.9rem)", textShadow }}
          >
            Bazen nije dodatak vrtu.
          </h1>
          <a
            href="#kontakt"
            className="group mt-6 flex w-fit items-center gap-2 border-b border-acqua/60 pb-1 text-sm font-medium tracking-wide text-acqua transition-colors hover:border-acqua"
          >
            Zatražite privatnu konzultaciju
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-notte text-travertino">
      {/* Real <img>, not just the video's poster attribute, is the LCP
          element: Chrome doesn't reliably credit a <video poster> as an LCP
          candidate (measured — it fell back to crediting the h1 instead),
          the same reason Hero.jsx keeps an <img> base layer under its canvas. */}
      <img
        src="/hero-mobile-poster-first.jpg"
        alt=""
        aria-hidden="true"
        width={1080}
        height={1920}
        fetchPriority="high"
        decoding="sync"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      {/* Starts transparent so the <img> above is what's on screen (and what
          LCP measures) until playback actually begins — otherwise the video
          paints over the img the instant it mounts and, since <video> isn't
          itself an LCP-eligible paint here, that occludes the img's paint
          without replacing it, and LCP falls back to crediting the h1. */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300"
      >
        <source src="/hero-mobile.mp4" type="video/mp4" />
      </video>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%]"
        style={{
          background:
            "linear-gradient(to top, rgba(6,16,14,0.85) 0%, rgba(6,16,14,0.6) 34%, rgba(6,16,14,0.18) 68%, transparent 100%)",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 z-10 px-6" style={{ bottom: "10vh" }}>
        <div className="relative w-[85vw] max-w-[85vw]">
          <div className="relative min-h-[230px]">
            <div ref={introRef} className="absolute inset-0 flex flex-col justify-end">
              <p className="font-mono text-[10px] uppercase text-acqua" style={{ letterSpacing: "0.34em", textShadow }}>
                Tempus Pool · Umag, Istra
              </p>
              <h1
                className="mt-4 font-display font-light leading-[1.12] tracking-tight"
                style={{ fontSize: "clamp(2rem, 8.6vw, 2.9rem)", textShadow }}
              >
                Bazen nije dodatak vrtu.
              </h1>
            </div>

            {PHASES.map((ph, i) => (
              <div
                key={ph.num}
                ref={(el) => (phaseRefs.current[i] = el)}
                className="absolute inset-0 flex flex-col justify-end opacity-0"
                style={{ pointerEvents: "none" }}
              >
                <p className="font-mono text-xs tracking-[0.4em] text-acqua" style={{ textShadow }}>
                  {ph.num}
                </p>
                <h3
                  className="mt-4 font-display text-[1.04rem] font-light uppercase leading-[1.15] tracking-tight text-travertino"
                  style={{ textShadow }}
                >
                  {ph.title}
                </h3>
                <p className="mt-3 max-w-full text-[13px] leading-relaxed text-travertino/60" style={{ textShadow }}>
                  {ph.subline}
                </p>
              </div>
            ))}

            <div ref={finalRef} className="absolute inset-0 flex flex-col justify-end opacity-0" style={{ pointerEvents: "none" }}>
              <h2 className="font-display text-[1.82rem] font-light italic leading-[1.15] text-acqua-soft" style={{ textShadow }}>
                Razlog je da u njemu ostanete.
              </h2>
              <a
                href="#kontakt"
                className="group mt-6 flex w-fit items-center gap-2 border-b border-acqua/60 pb-1 text-sm font-medium tracking-wide text-acqua transition-colors hover:border-acqua"
              >
                Zatražite privatnu konzultaciju
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
