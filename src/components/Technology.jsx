// The technology story, told the way an engineer would tell it: one cutaway
// of the pool stays put on the left; the six systems hidden inside it scroll
// past on the right. Whichever step is centered in the viewport lights its
// matching hotspot on the blueprint — nothing else about the diagram moves.
// Not a catalog of equipment photos; a walk through what's actually beneath
// the water.

import { useEffect, useRef, useState } from "react";
import ImagePlate from "./common/ImagePlate";
import Reveal from "./common/Reveal";
import SplitHeading from "./common/SplitHeading";
import PoolSystemsBlueprint from "./PoolSystemsBlueprint";
import useInView from "./common/useInView";

const STEPS = [
  {
    key: "filtracija",
    num: "01",
    title: "Filtracija i cirkulacija",
    lead: "Srce sustava.",
    text: "Dimenzionirano prema volumenu vašeg bazena, ne uzeto s police — svaka litra vode prođe kroz sustav dovoljno često da ostane bistra bez da je ikad primijetite.",
    tags: ["Pumpe", "Filteri", "Skimmeri", "Podni ispusti"],
    image: null,
  },
  {
    key: "grijanje",
    num: "02",
    title: "Grijanje",
    lead: "Sezona koja se ne skraćuje.",
    text: "Toplinska pumpa produžuje kupanje duboko u jesen, bez da voda ikad izgubi svoju temperaturu mira — tiho, u pozadini, mjesecima.",
    tags: ["Toplinske pumpe", "Regulacija temperature"],
    image: "/images/technology/grijanje.jpg",
  },
  {
    key: "kemija",
    num: "03",
    title: "Kemija i automatika",
    lead: "Voda koja se sama pazi.",
    text: "Elektroliza i automatsko doziranje mjere i ispravljaju sastav vode iz sata u sat — bistrina bez svakodnevnog razmišljanja o njoj.",
    tags: ["Elektrolize i solinatori", "Automatsko doziranje"],
    image: "/images/technology/kemija.jpg",
  },
  {
    key: "ciscenje",
    num: "04",
    title: "Čišćenje",
    lead: "Njega koju ne vidite da se događa.",
    text: "Autonomni robot prelazi dno i stijenke dan za danom, dok ste na poslu ili spavate — bazen je spreman prije nego što i pomislite na njega.",
    tags: ["Roboti za čišćenje"],
    image: "/images/technology/ciscenje.jpg",
  },
  {
    key: "rasvjeta",
    num: "05",
    title: "Rasvjeta i wellness",
    lead: "Druga prostorija kuće, navečer.",
    text: "Podvodna rasvjeta, hidromasaža i slapovi pretvaraju bazen u prostor koji se koristi i nakon zalaska sunca — ne samo gleda.",
    tags: ["Podvodna rasvjeta", "Hidromasaža", "Slapovi"],
    image: "/images/technology/rasvjeta.jpg",
  },
  {
    key: "okolis",
    num: "06",
    title: "Okoliš i sigurnost",
    lead: "Rubovi koji dovršavaju arhitekturu.",
    text: "Obloge, ograde i sigurnosna oprema biraju se s istom pažnjom kao i sam bazen — vidljivi su jednako malo koliko i sve gore navedeno.",
    tags: ["Ljestve inox", "Pokrivači za bazen", "Sigurnosna oprema"],
    image: "/images/technology/okolis.jpg",
  },
];

const BRANDS = [
  "BWT", "Hayward", "ESPA", "Aquark", "Bayrol", "Dolphin", "Speck", "Emaux",
  "Astrapool", "Fairland", "Aquarite", "Cepex", "Renolit", "Astore", "Sugar Valley",
];

// Tracks which step is in the thin band at viewport center — the same idea
// as Header's active-nav-section tracking, just centered rather than offset,
// since these blocks are full-viewport-tall rather than short nav targets.
function useActiveStep(count) {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const nodes = refs.current.filter(Boolean);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.stepIndex);
            setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [count]);

  return [refs, active];
}

function Step({ step, index, registerRef }) {
  return (
    <div
      ref={(el) => registerRef(el, index)}
      data-step-index={index}
      className="flex min-h-[62vh] flex-col justify-center py-16 lg:min-h-screen lg:py-0"
    >
      <Reveal className="flex items-center gap-4">
        <span className="font-mono text-[11px] text-acqua">{step.num}</span>
        <span className="h-px w-8 bg-travertino/20" />
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-travertino/55">Sustav</span>
      </Reveal>

      <Reveal delay={0.05}>
        <h3 className="mt-5 max-w-md font-display text-3xl font-light leading-[1.1] text-travertino sm:text-4xl">
          {step.title}
        </h3>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-4 max-w-md font-display text-lg italic leading-snug text-acqua-soft">{step.lead}</p>
      </Reveal>

      <Reveal delay={0.15}>
        <p className="mt-4 max-w-sm text-[15px] leading-[1.75] text-travertino/60">{step.text}</p>
      </Reveal>

      <Reveal delay={0.2} className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-travertino/[0.08] pt-6">
        {step.tags.map((tag) => (
          <span key={tag} className="font-mono text-[10px] uppercase tracking-[0.14em] text-travertino/45">
            {tag}
          </span>
        ))}
      </Reveal>

      {step.image && (
        <Reveal delay={0.25} className="mt-9 w-full max-w-md overflow-hidden rounded-2xl">
          <ImagePlate src={step.image} ratio="aspect-[4/3]" alt={`${step.title} — Tempus Pool`} />
        </Reveal>
      )}
    </div>
  );
}

export default function Technology() {
  const [ref, drawn] = useInView({ threshold: 0.15 });
  const [stepRefs, activeIndex] = useActiveStep(STEPS.length);
  const activeKey = STEPS[activeIndex].key;

  function registerRef(el, index) {
    stepRefs.current[index] = el;
  }

  return (
    <section id="tehnika" className="scroll-mt-20 bg-notte text-travertino">
      <div className="mx-auto max-w-[1500px] px-6 pt-32 lg:px-12 lg:pt-44">
        <div className="max-w-2xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-acqua">Inženjerstvo ispod površine</p>
          </Reveal>
          <SplitHeading
            as="h2"
            className="mt-5 font-display text-4xl font-light leading-[1.1] tracking-tight sm:text-6xl"
            lines={["Tehnologija koju nikada nećete primijetiti.", { text: "Ali ćete je osjećati svaki dan.", className: "italic text-acqua-soft" }]}
            delay={0.1}
          />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-travertino/60">
              Šest sustava, jedna školjka. Pomicanjem prolazite kroz svaki od njih — od pumpe do ruba bazena.
            </p>
          </Reveal>
        </div>
      </div>

      <div ref={ref} className="relative mx-auto mt-20 max-w-[1500px] px-6 lg:px-12 lg:mt-28">
        <div className="grid grid-cols-1 gap-x-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
          <div className="top-24 h-[52vh] lg:sticky lg:h-screen lg:py-[8vh]">
            <PoolSystemsBlueprint activeKey={activeKey} drawn={drawn} />
          </div>

          <div>
            {STEPS.map((step, i) => (
              <Step key={step.key} step={step} index={i} registerRef={registerRef} />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-6 pb-32 pt-24 lg:px-12 lg:pb-44">
        <div className="border-t border-travertino/[0.08] pt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-travertino/50">Radimo s vodećim svjetskim brendovima</p>
          <div className="relative mt-6 overflow-hidden">
            <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-14 motion-reduce:animate-none">
              {[...BRANDS, ...BRANDS].map((b, i) => (
                <span key={`${b}-${i}`} className="font-display text-xl font-light italic text-travertino/50">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
