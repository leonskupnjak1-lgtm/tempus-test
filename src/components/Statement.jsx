import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WaterBackdrop from "./common/WaterBackdrop";

gsap.registerPlugin(ScrollTrigger);

// The story beats, in order. "0" is the deliberate false start — everything
// after it is what it grew into.
const STORY = [
  { value: "0", caption: "Nijedan početak nije savršen." },
  { value: "5", caption: "Godina kontinuiranog razvoja." },
  { value: "12", caption: "Dovršenih luksuznih projekata." },
  { value: "18+", caption: "Godina zajedničkog iskustva." },
  { value: "2022", caption: "Osnovan Tempus Pool." },
  { value: "70+", caption: "Projektiranih i izgrađenih bazena." },
  { value: "20+", caption: "Pouzdanih partnerskih brendova." },
];

// The editorial landing state the story resolves into — one hero figure,
// three supporting figures, two quiet footnotes. Typography carries the
// hierarchy; nothing here is a card.
const HERO_STAT = { value: "18+", label: "Godina zajedničkog iskustva" };
const LEVEL2 = [
  { value: "2022", label: "Osnovano" },
  { value: "70+", label: "Bazena" },
  { value: "20+", label: "Partnerskih brendova" },
];
const LEVEL3 = [
  { value: "5", label: "Godina kontinuiranog razvoja" },
  { value: "12", label: "Luksuznih projekata" },
];

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const FRAMES = STORY.length + 1; // + the closing editorial frame
const HOLD = 0.55; // fraction of each scroll segment the frame sits still before crossfading
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function Statement() {
  const sectionRef = useRef(null);
  const frameRefs = useRef([]);
  const cardsRef = useRef(null);
  const statRefs = useRef([]);
  const revealedRef = useRef(false);
  statRefs.current = [];
  const registerStat = (el) => el && statRefs.current.push(el);

  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useLayoutEffect(() => {
    if (reduced) return;

    const section = sectionRef.current;
    const frames = frameRefs.current;
    const cards = cardsRef.current;
    if (!section || !cards) return;

    const ctx = gsap.context(() => {
      const paint = (el, opacity, scale, blurPx) => {
        gsap.set(el, { opacity, scale, filter: `blur(${blurPx}px)` });
      };

      frames.forEach((el, i) => paint(el, i === 0 ? 1 : 0, i === 0 ? 1 : 0.9, i === 0 ? 0 : 8));
      paint(cards, 0, 0.96, 0);
      gsap.set(cards, { pointerEvents: "none" });
      gsap.set(statRefs.current, { opacity: 0, y: 22, filter: "blur(5px)" });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${FRAMES * window.innerHeight * 0.85}`,
        pin: true,
        scrub: 0.9,
        anticipatePin: 1,
        onUpdate: (self) => {
          const pos = self.progress * FRAMES;
          const idx = Math.min(Math.floor(pos), FRAMES - 1);
          const local = pos - idx;
          const t = local < HOLD ? 0 : easeInOutCubic((local - HOLD) / (1 - HOLD));

          frames.forEach((el, i) => {
            if (!el) return;
            if (i === idx) paint(el, 1 - t, 1 - t * 0.04, t * 6);
            else if (i === idx + 1) paint(el, t, 0.9 + t * 0.1, (1 - t) * 8);
            else paint(el, 0, 0.9, 8);
          });

          const cardsVisible = idx >= STORY.length;
          if (idx === STORY.length - 1) paint(cards, t, 0.96 + t * 0.04, 0);
          else if (cardsVisible) paint(cards, 1, 1, 0);
          else paint(cards, 0, 0.96, 0);
          gsap.set(cards, { pointerEvents: cardsVisible ? "auto" : "none" });

          if (cardsVisible && !revealedRef.current) {
            revealedRef.current = true;
            gsap.to(statRefs.current, {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1,
              ease: "power3.out",
              stagger: 0.1,
            });
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className={
        reduced
          ? "relative w-full bg-notte text-travertino"
          : "relative h-screen w-full overflow-hidden bg-notte text-travertino"
      }
    >
      <WaterBackdrop />

      {STORY.map((s, i) => (
        <div
          key={s.value}
          ref={(el) => (frameRefs.current[i] = el)}
          className={
            reduced
              ? "relative flex flex-col items-center px-6 py-20 text-center"
              : "pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          }
        >
          <span
            className="font-display font-light leading-none tracking-tight text-travertino"
            style={{ fontSize: "clamp(6rem, 24vw, 20rem)" }}
          >
            {s.value}
          </span>
          <p className="mt-6 max-w-md text-balance font-display text-xl italic leading-snug text-acqua-soft sm:text-2xl">
            {s.caption}
          </p>
        </div>
      ))}

      <div
        ref={cardsRef}
        className={
          reduced
            ? "relative flex w-full flex-col items-center px-6 py-28"
            : "absolute inset-0 flex flex-col items-center justify-center px-6"
        }
      >
        <span
          ref={registerStat}
          className="font-mono text-[11px] uppercase tracking-[0.32em] text-travertino/40"
        >
          Tempus Pool u brojkama
        </span>

        {/* Level 1 — the hero figure */}
        <Stat
          refCb={registerStat}
          value={HERO_STAT.value}
          label={HERO_STAT.label}
          className="mt-10"
          valueStyle={{ fontSize: "clamp(5.5rem, 12vw, 10rem)" }}
          labelClassName="mt-5 font-display text-lg italic leading-snug text-acqua-soft sm:text-xl"
          glow="strong"
        />

        <div className="mt-14 h-px w-10 bg-travertino/15" aria-hidden="true" />

        {/* Level 2 — three supporting figures */}
        <div className="mt-14 flex flex-wrap items-stretch justify-center gap-x-10 sm:gap-x-16">
          {LEVEL2.map((s, i) => (
            <div key={s.label} className="flex items-stretch">
              {i > 0 && <div className="mx-10 hidden w-px self-stretch bg-travertino/10 sm:mx-0 sm:block sm:w-px" aria-hidden="true" />}
              <Stat
                refCb={registerStat}
                value={s.value}
                label={s.label}
                valueStyle={{ fontSize: "clamp(2.1rem, 4vw, 3.1rem)" }}
                labelClassName="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-travertino/45"
                glow="soft"
              />
            </div>
          ))}
        </div>

        <div className="mt-14 h-px w-10 bg-travertino/10" aria-hidden="true" />

        {/* Level 3 — two quiet footnotes */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {LEVEL3.map((s) => (
            <Stat
              key={s.label}
              refCb={registerStat}
              value={s.value}
              label={s.label}
              valueStyle={{ fontSize: "clamp(1.35rem, 2vw, 1.7rem)" }}
              valueClassName="text-travertino/70"
              labelClassName="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-travertino/35"
              glow="none"
              row
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// One statistic, rendered as typography first: a number, a caption, a very
// quiet hover glow, a hairline that draws itself in under the caption. No
// border, no card, no fixed box — size and weight alone carry the hierarchy.
function Stat({ refCb, value, label, className = "", valueStyle, valueClassName = "", labelClassName = "", glow = "soft", row = false }) {
  const glowOpacity = glow === "strong" ? "group-hover:opacity-100" : glow === "soft" ? "group-hover:opacity-70" : "";

  return (
    <div
      ref={refCb}
      className={`group relative flex flex-col items-center text-center ${row ? "sm:flex-row sm:gap-3 sm:text-left" : ""} ${className}`}
    >
      <div className="relative">
        {glow !== "none" && (
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 rounded-full bg-acqua/20 opacity-0 blur-2xl transition-opacity duration-700 ${glowOpacity}`}
            style={{ transitionTimingFunction: EASE }}
          />
        )}
        <span
          className={`inline-block font-display font-light leading-none tracking-tight text-travertino transition-transform duration-500 group-hover:-translate-y-1 ${valueClassName}`}
          style={{ ...valueStyle, transitionTimingFunction: EASE }}
        >
          {value}
        </span>
      </div>

      <span className={`relative inline-block ${labelClassName}`}>
        {label}
        <span
          aria-hidden="true"
          className="absolute -bottom-1.5 left-1/2 h-px w-0 -translate-x-1/2 bg-acqua/70 transition-all duration-500 group-hover:w-full"
          style={{ transitionTimingFunction: EASE }}
        />
      </span>
    </div>
  );
}
