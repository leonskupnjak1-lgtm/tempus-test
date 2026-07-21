// Featured Project — a cinematic, one-image-at-a-time architectural
// presentation, not a gallery. The section pins; scrolling crossfades
// through a short curated list of villas exactly like Statement's story
// (same GSAP ScrollTrigger scrub pattern), while the image panel carries
// its own independent, purely decorative layers: a slow scroll parallax,
// a continuous ambient zoom, and a cursor-driven perspective tilt. None of
// those three ever touch the same CSS property as the crossfade, so they
// compose without fighting each other for `transform`.

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "motion/react";
import Reveal from "./common/Reveal";
import WaterBackdrop from "./common/WaterBackdrop";
import { IconPin, IconDroplet, IconRuler, IconClock, IconChevron } from "./icons/BlueprintIcons";

gsap.registerPlugin(ScrollTrigger);

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const EASE_ARR = [0.16, 1, 0.3, 1];

const FEATURED = [
  {
    key: "villa-stonehouse",
    title: "Villa Stonehouse",
    place: "Buje, Istra",
    heading: "Bazen osmišljen oko arhitekture.",
    description:
      "Tradicionalni istarski kamen susreće bazen zamišljen kao jedinstven gest — voda djeluje kao produžetak kuće, a ne dodatak uz nju.",
    poolType: "Skimmer, liner obloga",
    dimensions: "11 × 4,5 m",
    year: "2023",
    constructionType: "Liner",
    equipment: ["Grijanje toplinskom pumpom", "Automatsko doziranje", "Podvodna rasvjeta"],
    image: "/images/projects/02-villa-stonehouse.jpg",
    focal: "50% 45%",
  },
  {
    key: "villa-scala",
    title: "Villa Scala",
    place: "Umag, Istra",
    heading: "Gdje se horizont susreće s vodom.",
    description:
      "Uz siluetu Umaga u suton, prelivni rub briše granicu između terase i horizonta.",
    poolType: "Prelivni rub",
    dimensions: "12 × 5 m",
    year: "2022",
    constructionType: "Beton, lijevan na terenu",
    equipment: ["Sustav prelivnog ruba", "Protustrujni mlaznik", "LED rasvjeta"],
    image: "/images/projects/01-villa-scala.jpg",
    focal: "50% 38%",
  },
  {
    key: "villa-moon",
    title: "Villa Moon",
    place: "Rovinj, Istra",
    heading: "Rub koji nestaje u suton.",
    description: "Zrcalno polirani čelični rub pušta bazen da se stopi s horizontom zlatnog sata iznad Rovinja.",
    poolType: "Prelivni rub",
    dimensions: "14 × 5,5 m",
    year: "2023",
    constructionType: "Nehrđajući čelik",
    equipment: ["Zrcalno polirani rub", "Grijanje toplinskom pumpom", "Podvodna rasvjeta"],
    image: "/images/projects/04-villa-moon.jpg",
    focal: "50% 40%",
  },
  {
    key: "villa-roma",
    title: "Villa Roma",
    place: "Poreč, Istra",
    heading: "Lođa koja uokviruje mirnu vodu.",
    description:
      "Kamena lođa uokviruje vodu poput prostorije bez stropa — sjena, svjetlo i odraz komponirani jednako pažljivo kao i arhitektura oko njih.",
    poolType: "Skimmer",
    dimensions: "9 × 4 m",
    year: "2021",
    constructionType: "Poliesterska školjka",
    equipment: ["Kamena lođa", "Automatski prekrivač bazena", "Solarno grijanje"],
    image: "/images/projects/03-villa-roma.jpg",
    focal: "50% 50%",
  },
  {
    key: "villa-julia",
    title: "Villa Julia",
    place: "Novigrad, Istra",
    heading: "Voda kao zasebna prostorija.",
    description:
      "Bazen i spa dizajnirani su kao jedna kontinuirana površina, čiji odraz u suton preklapa arhitekturu vile samu u sebe.",
    poolType: "Skimmer",
    dimensions: "10 × 4 m",
    year: "2024",
    constructionType: "Beton, lijevan na terenu",
    equipment: ["Integrirani spa", "Automatsko doziranje", "Ambijentalna rasvjeta"],
    image: "/images/projects/05-villa-julia.jpg",
    focal: "50% 48%",
  },
];

const FRAMES = FEATURED.length;
const HOLD = 0.6;
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const pad = (n) => String(n).padStart(2, "0");

function Spec({ label, value, wide = false }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-travertino/35">{label}</dt>
      <dd className="mt-1.5 font-display text-[15px] font-light leading-snug text-travertino">{value}</dd>
    </div>
  );
}

function ProjectDetails({ p }) {
  return (
    <>
      <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-travertino/40">Odabrani projekt</span>
      <p className="mt-3 font-display text-xl italic leading-snug text-acqua-soft sm:text-2xl">{p.title}</p>
      <h3 className="mt-5 max-w-md text-balance font-display text-3xl font-light leading-[1.12] text-travertino sm:text-4xl">
        {p.heading}
      </h3>
      <p className="mt-5 max-w-sm text-[14.5px] leading-relaxed text-travertino/60">{p.description}</p>

      <dl className="mt-8 grid max-w-sm grid-cols-2 gap-x-8 gap-y-5 border-t border-travertino/10 pt-7">
        <Spec label="Lokacija" value={p.place} />
        <Spec label="Tip bazena" value={p.poolType} />
        <Spec label="Dimenzije" value={p.dimensions} />
        <Spec label="Godina" value={p.year} />
        <Spec label="Izvedba" value={p.constructionType} wide />
        <Spec label="Oprema" value={p.equipment.join(" · ")} wide />
      </dl>

      <a
        href="#kontakt"
        className="group mt-9 inline-flex w-fit items-center gap-2.5 border-b border-acqua/50 pb-1.5 text-sm font-medium tracking-wide text-acqua transition-colors hover:border-acqua"
      >
        Pogledaj cijeli projekt
        <span className="transition-transform duration-500 group-hover:translate-x-1.5" style={{ transitionTimingFunction: EASE }} aria-hidden="true">
          →
        </span>
      </a>
    </>
  );
}

function SectionEyebrow({ progressLabel }) {
  return (
    <Reveal className="mb-8 flex items-center gap-4 lg:mb-10">
      <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-acqua">Izdvojeni projekt</span>
      <span className="h-px flex-1 bg-travertino/10" />
      {progressLabel}
    </Reveal>
  );
}

// Static, unpinned fallback for prefers-reduced-motion — every project laid
// out as a normal-flow stack, no parallax, no tilt, no scroll-linked motion.
function StaticFeaturedList() {
  return (
    <section id="projekti" className="relative w-full overflow-hidden bg-notte px-6 py-24 text-travertino lg:px-12">
      <WaterBackdrop />
      <div className="relative z-10 mx-auto max-w-[1500px]">
        <SectionEyebrow progressLabel={null} />
        <div className="flex flex-col gap-20 lg:gap-28">
          {FEATURED.map((p) => (
            <div key={p.key} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-5 lg:gap-16">
              <div className="lg:col-span-3">
                <div
                  className="relative w-full overflow-hidden rounded-[32px] shadow-[0_60px_140px_-40px_rgba(0,0,0,0.75),0_0_0_1px_rgba(242,238,227,0.06)]"
                  style={{ aspectRatio: "4 / 3" }}
                >
                  <img src={p.image} alt={`${p.title}, ${p.place}`} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: p.focal }} />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "linear-gradient(0deg, rgba(10,24,21,0.5) 0%, transparent 30%, transparent 78%, rgba(10,24,21,0.25) 100%)" }}
                  />
                </div>
              </div>
              <div className="lg:col-span-2">
                <ProjectDetails p={p} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pinned, scroll-scrubbed cinematic version.
function CinematicFeatured() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null); // outer clipped box — hit area for mouse tilt
  const tiltRef = useRef(null); // rotateX/rotateY from cursor
  const parallaxRef = useRef(null); // slow scroll-driven vertical drift
  const imgFrameRefs = useRef([]); // per-project crossfade wrappers (image side)
  const textFrameRefs = useRef([]); // per-project crossfade wrappers (text side)
  const progressRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const imgFrames = imgFrameRefs.current;
    const textFrames = textFrameRefs.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const paint = (el, opacity, scale, blurPx) => {
        gsap.set(el, { opacity, scale, filter: `blur(${blurPx}px)` });
      };

      imgFrames.forEach((el, i) => paint(el, i === 0 ? 1 : 0, i === 0 ? 1 : 1.03, i === 0 ? 0 : 10));
      textFrames.forEach((el, i) => paint(el, i === 0 ? 1 : 0, i === 0 ? 1 : 0.98, i === 0 ? 0 : 6));

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${FRAMES * window.innerHeight * 1.05}`,
        pin: true,
        scrub: 0.9,
        anticipatePin: 1,
        onUpdate: (self) => {
          const pos = self.progress * FRAMES;
          const idx = Math.min(Math.floor(pos), FRAMES - 1);
          const isLast = idx === FRAMES - 1;
          const local = pos - idx;
          const t = local < HOLD ? 0 : easeInOutCubic((local - HOLD) / (1 - HOLD));

          imgFrames.forEach((el, i) => {
            if (!el) return;
            if (i === idx) paint(el, isLast ? 1 : 1 - t, isLast ? 1 : 1 - t * 0.03, isLast ? 0 : t * 10);
            else if (i === idx + 1) paint(el, t, 1.03 - t * 0.03, (1 - t) * 10);
            else paint(el, 0, 1.03, 10);
          });

          textFrames.forEach((el, i) => {
            if (!el) return;
            if (i === idx) paint(el, isLast ? 1 : 1 - t, isLast ? 1 : 1 - t * 0.02, isLast ? 0 : t * 6);
            else if (i === idx + 1) paint(el, t, 0.98 + t * 0.02, (1 - t) * 6);
            else paint(el, 0, 0.98, 6);
          });

          if (parallaxRef.current) gsap.set(parallaxRef.current, { yPercent: -4 + self.progress * 8 });

          if (progressRef.current) {
            const shown = Math.min(idx + (t > 0.5 ? 1 : 0) + 1, FRAMES);
            progressRef.current.textContent = `${pad(shown)} — ${pad(FRAMES)}`;
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  function handleMouseMove(e) {
    const el = tiltRef.current;
    const box = stageRef.current;
    if (!el || !box) return;
    const rect = box.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1400px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg) scale(1.008)`;
  }

  function handleMouseLeave() {
    const el = tiltRef.current;
    if (!el) return;
    el.style.transform = "perspective(1400px) rotateX(0deg) rotateY(0deg) scale(1)";
  }

  return (
    <section ref={sectionRef} className="relative hidden h-screen w-full overflow-hidden bg-notte text-travertino lg:block">
      <WaterBackdrop />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1500px] flex-col justify-center px-6 lg:px-12">
        <SectionEyebrow
          progressLabel={
            <span ref={progressRef} className="font-mono text-[11px] tabular-nums text-travertino/35">
              01 — {pad(FRAMES)}
            </span>
          }
        />

        <div className="grid flex-1 grid-cols-1 items-center gap-10 lg:grid-cols-5 lg:gap-16">
          {/* Image stage — 60% */}
          <div className="lg:col-span-3">
            <div
              ref={stageRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full overflow-hidden rounded-[32px] shadow-[0_60px_140px_-40px_rgba(0,0,0,0.75),0_0_0_1px_rgba(242,238,227,0.06)]"
              style={{ aspectRatio: "4 / 3" }}
            >
              <div ref={tiltRef} className="absolute inset-0 transition-transform duration-500 will-change-transform" style={{ transitionTimingFunction: EASE }}>
                <div ref={parallaxRef} className="absolute inset-x-0 -top-[10%] h-[120%] w-full">
                  {FEATURED.map((p, i) => (
                    <div key={p.key} ref={(el) => (imgFrameRefs.current[i] = el)} className="absolute inset-0 h-full w-full">
                      <img
                        src={p.image}
                        alt={`${p.title}, ${p.place}`}
                        loading={i === 0 ? "eager" : "lazy"}
                        className="h-full w-full object-cover [animation:project-zoom_9s_ease-in-out_infinite_alternate]"
                        style={{ objectPosition: p.focal }}
                      />
                    </div>
                  ))}
                </div>

                {/* Unifying warm grade + soft vignette — persistent, not per-frame */}
                <div className="pointer-events-none absolute inset-0" style={{ backgroundColor: "var(--color-notte)", opacity: 0.12, mixBlendMode: "soft-light" }} />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(0deg, rgba(10,24,21,0.5) 0%, transparent 30%, transparent 78%, rgba(10,24,21,0.25) 100%)" }}
                />
              </div>
            </div>
          </div>

          {/* Text stage — 40% */}
          <div className="relative lg:col-span-2 lg:h-[68vh]">
            {FEATURED.map((p, i) => (
              <div key={p.key} ref={(el) => (textFrameRefs.current[i] = el)} className="absolute inset-0 flex flex-col justify-center">
                <ProjectDetails p={p} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes project-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.04); }
        }
      `}</style>
    </section>
  );
}

// Dedicated phone/tablet experience — a single swipeable card per project
// instead of the desktop's pinned scroll-scrub. Purpose-built for touch:
// one large image up top, a calm reading column beneath it, then a vertical
// stack of spec cards, and an explicit "01/06" pager so it's obvious there's
// more to swipe through.
const MOBILE_SPECS = (p) => [
  { icon: IconPin, label: "Lokacija", value: p.place },
  { icon: IconDroplet, label: "Tip bazena", value: p.poolType },
  { icon: IconRuler, label: "Dimenzije", value: p.dimensions },
  { icon: IconClock, label: "Godina", value: p.year },
];

const mobileContainerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
  exit: { transition: { staggerChildren: 0.03 } },
};

const mobileImageVariants = {
  initial: { opacity: 0, scale: 1.03 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: EASE_ARR } },
  exit: { opacity: 0, scale: 1.02, transition: { duration: 0.35, ease: EASE_ARR } },
};

const mobileTextVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_ARR } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: EASE_ARR } },
};

const mobileCardVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_ARR } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

function MobileFeatured() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const p = FEATURED[index];
  const canPrev = index > 0;
  const canNext = index < FRAMES - 1;

  function goPrev() {
    if (canPrev) setIndex((i) => i - 1);
  }
  function goNext() {
    if (canNext) setIndex((i) => i + 1);
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }
  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }

  return (
    <section className="relative w-full overflow-hidden bg-notte px-5 pb-20 pt-20 text-travertino lg:hidden">
      <WaterBackdrop />
      <div className="relative z-10">
        <Reveal className="mb-8 flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-acqua">Izdvojeni projekt</span>
          <span className="h-px flex-1 bg-travertino/10" />
        </Reveal>

        <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <AnimatePresence mode="wait">
            <motion.div
              key={p.key}
              variants={mobileContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <motion.div
                variants={mobileImageVariants}
                className="relative w-full overflow-hidden rounded-[26px] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.75),0_0_0_1px_rgba(242,238,227,0.06)]"
                style={{ aspectRatio: "16 / 10" }}
              >
                <img
                  src={p.image}
                  alt={`${p.title}, ${p.place}`}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: p.focal }}
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(0deg, rgba(10,24,21,0.55) 0%, transparent 32%, transparent 78%, rgba(10,24,21,0.2) 100%)" }}
                />
              </motion.div>

              <motion.div variants={mobileTextVariants} className="mt-8">
                <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-travertino/40">{p.title}</span>
                <h3 className="mt-4 text-balance font-display text-[28px] font-light leading-[1.2] text-travertino">
                  {p.heading}
                </h3>
                <p className="mt-4 text-[15px] leading-[1.7] text-travertino/60">{p.description}</p>
              </motion.div>

              <motion.dl variants={mobileContainerVariants} className="mt-10 flex flex-col gap-3">
                {MOBILE_SPECS(p).map(({ icon: Icon, label, value }) => (
                  <motion.div
                    key={label}
                    variants={mobileCardVariants}
                    className="flex items-center gap-4 rounded-2xl border border-travertino/10 bg-travertino/[0.04] px-5 py-4 backdrop-blur-sm"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-acqua" />
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-travertino/40">{label}</dt>
                      <dd className="mt-1 font-display text-[17px] font-light leading-snug text-travertino">{value}</dd>
                    </div>
                  </motion.div>
                ))}
              </motion.dl>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-travertino/10 pt-7">
          <div className="flex items-center gap-6 font-mono text-[12px] tabular-nums text-travertino/50">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              aria-label="Prethodni projekt"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-travertino/15 text-travertino transition-opacity disabled:opacity-25"
            >
              <IconChevron className="h-4 w-4 rotate-180" />
            </button>
            <span>
              {pad(index + 1)} / {pad(FRAMES)}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              aria-label="Sljedeći projekt"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-travertino/15 text-travertino transition-opacity disabled:opacity-25"
            >
              <IconChevron className="h-4 w-4" />
            </button>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-travertino/30">
            Prijeđite prstom za sljedeći projekt
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Projects() {
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  if (reduced) return <StaticFeaturedList />;

  return (
    <div id="projekti">
      <CinematicFeatured />
      <MobileFeatured />
    </div>
  );
}
