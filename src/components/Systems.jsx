// Pool Technologies — a single-screen configurator, not a carousel and never
// a popup. Six construction technologies sit as fixed circular thumbnails on
// a decorative left-hand orbit (the path never rotates, the circles never
// move from their home slot — only the active one glows). Selecting one
// crossfades the hero photograph, the text panel and a faint ambient tint
// simultaneously, in place, inside the same fixed-height layout. Nothing
// mounts or unmounts the section's structure; only the small `key`-driven
// content blocks swap.

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { Button } from "@/components/ui/button";
import { requestInquiry } from "@/lib/inquiry";
import Reveal from "./common/Reveal";
import SectionFade from "./common/SectionFade";

const EASE = "easeInOut";
const DURATION = 0.55;

const SYSTEMS = [
  {
    key: "beton",
    code: "Beton",
    title: "Betonski bazeni",
    blurb: "Armiranobetonska školjka građena na licu mjesta — rješenje bez kompromisa u obliku, veličini i obradi.",
    advantages: [
      "Neograničen oblik, veličina i dubina",
      "Monolitna armirana konstrukcija bez spojeva",
      "Prilagodljiv zahtjevnim terenima i nagibima",
      "Izbor završne obloge: keramika, mozaik ili folija",
      "Mogućnost naknadnih prepravki i dogradnji",
    ],
    specs: [
      { label: "Vijek trajanja", value: "50+ god. (konstrukcija)" },
      { label: "Vrijeme ugradnje", value: "8–12 tj." },
      { label: "Održavanje", value: "Umjereno" },
    ],
    image: "/images/systems/beton.jpg",
    detailImage: "/images/systems/beton-detail.jpg",
    accent: "rgba(36,92,60,0.42)",
  },
  {
    key: "liner",
    code: "Liner",
    title: "Liner bazeni",
    blurb: "Bazenska školjka obložena armiranom PVC folijom — vodonepropusnost i glatka površina uz brzu izvedbu.",
    advantages: [
      "Folija je istovremeno hidroizolacija i završna obloga",
      "Glatka površina ugodna za kožu i jednostavna za čišćenje",
      "Široki izbor boja i uzoraka folije",
      "Zamjena folije obnavlja bazen bez građevinskih radova",
      "Brža i predvidljivija izvedba od klasičnih obloga",
    ],
    specs: [
      { label: "Vijek trajanja", value: "Folija 10–15 god., konstrukcija znatno dulje" },
      // TODO: [POTVRDITI s klijentom] vrijeme ugradnje za liner bazene
      { label: "Vrijeme ugradnje", value: "4–8 tj." },
      { label: "Održavanje", value: "Nisko" },
    ],
    image: "/images/systems/liner.jpg",
    detailImage: "/images/systems/liner-detail.jpg",
    accent: "rgba(32,78,128,0.4)",
  },
  {
    key: "stiropor",
    code: "Stiropor",
    title: "Stiropor bazeni",
    blurb: "Gradnja ICF blokovima ispunjenima armiranim betonom — čvrstoća betona uz ugrađenu toplinsku izolaciju.",
    advantages: [
      "Toplinska izolacija smanjuje gubitke topline i trošak grijanja",
      "Armiranobetonska jezgra kao kod klasične gradnje",
      "Brže zidanje školjke od klasične oplate",
      "Precizna geometrija stijenki",
      "Kompatibilan s folijom ili keramikom kao oblogom",
    ],
    specs: [
      { label: "Vijek trajanja", value: "50+ god. (konstrukcija)" },
      // TODO: [POTVRDITI s klijentom] vrijeme ugradnje za stiropor (ICF) bazene
      { label: "Vrijeme ugradnje", value: "6–10 tj." },
      { label: "Održavanje", value: "Umjereno" },
    ],
    image: "/images/systems/stiropor.jpg",
    detailImage: "/images/systems/stiropor-detail.jpg",
    accent: "rgba(126,106,64,0.32)",
  },
  {
    key: "montazni",
    code: "Montažni",
    title: "Montažni bazeni",
    blurb: "Panelni sustavi provjerenih proizvođača — najbrži put do bazena uz kontrolirani budžet.",
    advantages: [
      "Ugradnja u danima, ne mjesecima",
      "Predvidljiv trošak bez građevinskih iznenađenja",
      "Tvornički testirani paneli",
      "Pogodan i za nadzemnu i za ukopanu ugradnju",
      "Jednostavna demontaža ili preseljenje",
    ],
    specs: [
      // TODO: [POTVRDITI s klijentom] vijek trajanja ovisi o odabranom sustavu panela
      { label: "Vijek trajanja", value: "Ovisno o sustavu" },
      { label: "Vrijeme ugradnje", value: "1–3 tj." },
      { label: "Održavanje", value: "Nisko" },
    ],
    image: "/images/systems/montazni.jpg",
    detailImage: "/images/systems/montazni-detail.jpg",
    accent: "rgba(72,70,63,0.36)",
  },
  {
    key: "poliester",
    code: "Poliester",
    title: "Poliesterski bazeni",
    blurb: "Jednodijelna tvornička školjka od stakloplastike — kontrolirana kvaliteta i ugradnja u nekoliko dana.",
    advantages: [
      "Školjka izrađena i testirana u tvornici",
      "Glatka gel-coat površina otporna na alge",
      "Bez fuga i spojeva u unutrašnjosti",
      "Kratki radovi na parceli",
      "Standardizirani modeli poznatih dimenzija i cijena",
    ],
    specs: [
      { label: "Vijek trajanja", value: "25+ god. uz obnovu gel-coata" },
      { label: "Vrijeme ugradnje", value: "1–2 tj. nakon pripreme terena" },
      { label: "Održavanje", value: "Nisko" },
    ],
    image: "/images/systems/poliester.jpg",
    detailImage: "/images/systems/poliester-detail.jpg",
    accent: "rgba(158,144,110,0.3)",
  },
  {
    key: "inox",
    code: "Inox",
    title: "Inox bazeni",
    blurb: "Bazeni od nehrđajućeg čelika — inženjerska preciznost za krovne terase, interijere i najzahtjevnije projekte.",
    advantages: [
      "Mala vlastita masa — pogodan za krovove i etaže",
      "Vodonepropusnost zavarenih spojeva bez dodatnih obloga",
      "Higijenska površina jednostavna za održavanje",
      "Precizna izvedba preljevnih rubova",
      "Trajno stabilna geometrija konstrukcije",
    ],
    specs: [
      { label: "Vijek trajanja", value: "50+ god." },
      // TODO: [POTVRDITI s klijentom] vrijeme ugradnje za inox bazene ovisi o projektu
      { label: "Vrijeme ugradnje", value: "Ovisno o projektu" },
      { label: "Održavanje", value: "Nisko" },
    ],
    image: "/images/systems/inox.jpg",
    detailImage: "/images/systems/inox-detail.jpg",
    accent: "rgba(102,112,116,0.38)",
  },
];

const SYSTEMS_BY_KEY = Object.fromEntries(SYSTEMS.map((s) => [s.key, s]));

// Left-hand decorative orbit — a partial ellipse whose deepest point sits at
// the middle index and shallows out toward the top and bottom, so the arc
// visually "opens" toward the hero image. Nodes never move from these slots.
const ORBIT_CX = 100;
const ORBIT_CY = 50;
const ORBIT_RX = 62;
const ORBIT_RY = 44;
const ORBIT_SPAN = 78; // degrees either side of center

function orbitPoint(t) {
  const angle = -ORBIT_SPAN + t * (ORBIT_SPAN * 2);
  const rad = (angle * Math.PI) / 180;
  return {
    left: ORBIT_CX - ORBIT_RX * Math.cos(rad),
    top: ORBIT_CY + ORBIT_RY * Math.sin(rad),
  };
}

const ORBIT_POS = SYSTEMS.map((_, i) => orbitPoint(i / (SYSTEMS.length - 1)));

function buildOrbitPath() {
  const steps = 48;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const p = orbitPoint(i / steps);
    d += `${i === 0 ? "M" : "L"}${p.left.toFixed(2)},${p.top.toFixed(2)} `;
  }
  return d.trim();
}

const ORBIT_PATH = buildOrbitPath();

function useIsDesktop() {
  // Starts false on every render (server and client) so the first client
  // paint matches the prerendered HTML exactly — SSG has no viewport to read
  // from. The real value is read in an effect, after hydration completes,
  // so any correction happens as a normal post-mount update, not a mismatch.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function Specs({ system }) {
  return (
    <div className="mt-6 grid grid-cols-3 divide-x divide-travertino/10 border-y border-travertino/10 py-4">
      {system.specs.map((s) => (
        <div key={s.label} className="px-4 first:pl-0">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-travertino/50">{s.label}</p>
          <p className="mt-1.5 font-display text-[15px] font-light leading-tight text-travertino">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

function Advantages({ system }) {
  return (
    <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5">
      {system.advantages.map((a) => (
        <li key={a} className="flex items-start gap-2 text-[12.5px] leading-snug text-travertino/60">
          <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-acqua" />
          {a}
        </li>
      ))}
    </ul>
  );
}

// Static markup shared by the desktop (absolute, crossfading) and mobile
// (normal-flow) panels — only the wrapper animation differs.
function SystemDetails({ system, index }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] text-acqua">{pad(index + 1)}</span>
        <span className="h-px w-8 bg-travertino/20" />
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-travertino/55">Sustav gradnje</span>
      </div>
      <h3 className="mt-4 font-display text-3xl font-light leading-[1.05] text-travertino xl:text-4xl">{system.title}</h3>
      <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-travertino/60">{system.blurb}</p>

      <Specs system={system} />

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-travertino/50">Prednosti</p>
        <Advantages system={system} />
      </div>

      <div className="mt-7">
        <Button
          type="button"
          onClick={() => requestInquiry(system.key)}
          className="btn-lift rounded-full bg-acqua px-7 text-notte hover:bg-acqua-soft"
        >
          Zatražite ponudu za {system.code.toLowerCase()} →
        </Button>
      </div>
    </>
  );
}

function OrbitNode({ system, index, isActive, onSelect }) {
  const pos = ORBIT_POS[index];
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(system.key)}
      aria-label={system.title}
      aria-pressed={isActive}
      style={{ position: "absolute", left: `${pos.left}%`, top: `${pos.top}%` }}
      className="-translate-x-1/2 -translate-y-1/2 cursor-pointer"
      whileHover={{ scale: isActive ? 1.22 : 1.1 }}
      whileTap={{ scale: isActive ? 1.16 : 1.02 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <motion.div
        animate={{ scale: isActive ? 1.2 : 1 }}
        transition={{ duration: DURATION, ease: EASE }}
        className="relative h-14 w-14 xl:h-[4.25rem] xl:w-[4.25rem]"
      >
        {isActive && (
          <motion.span
            className="pointer-events-none absolute -inset-2 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(47,191,163,0.4) 0%, transparent 72%)" }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.96, 1.08, 0.96] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: EASE }}
          />
        )}
        <motion.div
          animate={{
            opacity: isActive ? 1 : 0.62,
            filter: isActive ? "grayscale(0) saturate(1.15)" : "grayscale(0.85) saturate(0.7) brightness(1.15)",
            borderColor: isActive ? "rgba(47,191,163,0.75)" : "rgba(242,238,227,0.15)",
            boxShadow: isActive
              ? "0 18px 40px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(47,191,163,0.35)"
              : "0 10px 24px -12px rgba(0,0,0,0.55)",
          }}
          transition={{ duration: DURATION, ease: EASE }}
          className="relative h-full w-full overflow-hidden rounded-full border-2"
        >
          <picture>
            <source srcSet={system.image.replace(/\.jpe?g$/i, ".webp")} type="image/webp" />
            <img src={system.image} alt="" width={140} height={140} loading="lazy" className="h-full w-full object-cover" />
          </picture>
        </motion.div>
      </motion.div>
    </motion.button>
  );
}

function AmbientTint({ system }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={system.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 58% 52% at 58% 44%, ${system.accent} 0%, transparent 72%)` }}
        />
      </AnimatePresence>
    </div>
  );
}

function HeroStage({ system }) {
  return (
    <div className="sheen relative mx-auto w-full max-w-[900px] overflow-hidden rounded-[28px] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.6)]" style={{ aspectRatio: "16 / 9" }}>
      <AnimatePresence>
        <motion.div
          key={system.key}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: DURATION, ease: EASE }}
          className="absolute inset-0"
        >
          <picture>
            <source srcSet={system.detailImage.replace(/\.jpe?g$/i, ".webp")} type="image/webp" />
            <motion.img
              src={system.detailImage}
              alt={`${system.title} — izvedba`}
              width={1600}
              height={900}
              loading="lazy"
              className="h-full w-full object-cover"
              animate={{ scale: [1, 1.045, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: EASE }}
            />
          </picture>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(10,24,21,0.55)_0%,transparent_38%)]" />
        </motion.div>
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-6 py-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-travertino/75">{system.code}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-travertino/55">Izvedba</span>
      </div>
    </div>
  );
}

const PANEL_HEIGHT = "h-[58vh] max-h-[560px] min-h-[380px]";

function DesktopStage({ activeSystem, activeIndex, onSelect, sectionInView }) {
  return (
    <div className="relative z-10 grid flex-1 grid-cols-[180px_minmax(0,1fr)_340px] items-center gap-x-8 xl:grid-cols-[240px_minmax(0,1fr)_420px] xl:gap-x-14 2xl:grid-cols-[260px_minmax(0,1fr)_460px] 2xl:gap-x-16">
      <div className={`relative w-full ${PANEL_HEIGHT}`}>
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-acqua" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path
            d={ORBIT_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            pathLength="1"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: sectionInView ? 0 : 1,
              opacity: 0.25,
              vectorEffect: "non-scaling-stroke",
              transition: "stroke-dashoffset 1.6s ease",
            }}
          />
        </svg>
        {SYSTEMS.map((system, i) => (
          <OrbitNode key={system.key} system={system} index={i} isActive={activeSystem.key === system.key} onSelect={onSelect} />
        ))}
      </div>

      <div className="flex items-center justify-center">
        <HeroStage system={activeSystem} />
      </div>

      <div className={`relative w-full ${PANEL_HEIGHT}`}>
        <AnimatePresence>
          <motion.div
            key={activeSystem.key}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: DURATION, ease: EASE }}
            className="absolute inset-0 flex flex-col justify-center"
          >
            <SystemDetails system={activeSystem} index={activeIndex} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function MobileStage({ activeSystem, activeIndex, onSelect }) {
  return (
    <div className="relative z-10 mt-10 flex flex-col gap-7">
      <div className="relative w-full overflow-hidden rounded-[22px] border border-travertino/10 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)]" style={{ aspectRatio: "16 / 9" }}>
        <AnimatePresence>
          <motion.img
            key={activeSystem.key}
            src={activeSystem.detailImage}
            alt={`${activeSystem.title} — izvedba`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: DURATION, ease: EASE }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-1">
        {SYSTEMS.map((s) => {
          const isActive = s.key === activeSystem.key;
          return (
            <button key={s.key} type="button" onClick={() => onSelect(s.key)} aria-label={s.title} aria-pressed={isActive} className="shrink-0 cursor-pointer">
              <span
                className="block h-14 w-14 overflow-hidden rounded-full border-2 transition-[opacity,filter] duration-500"
                style={{
                  opacity: isActive ? 1 : 0.45,
                  filter: isActive ? "none" : "grayscale(1)",
                  borderColor: isActive ? "rgba(47,191,163,0.75)" : "rgba(242,238,227,0.15)",
                }}
              >
                <img src={s.image} alt="" className="h-full w-full object-cover" />
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSystem.key}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <SystemDetails system={activeSystem} index={activeIndex} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Systems() {
  const [activeKey, setActiveKey] = useState(SYSTEMS[0].key);
  const [sectionInView, setSectionInView] = useState(false);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    SYSTEMS.forEach((s) => {
      [s.image, s.detailImage].forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    });
  }, []);

  const activeSystem = useMemo(() => SYSTEMS_BY_KEY[activeKey], [activeKey]);
  const activeIndex = useMemo(() => SYSTEMS.findIndex((s) => s.key === activeKey), [activeKey]);

  function handleSelect(key) {
    setActiveKey(key);
  }

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="sustavi"
        ref={(node) => {
          if (!node) return;
          const observer = new IntersectionObserver(([entry]) => setSectionInView(entry.isIntersecting), { threshold: 0.2 });
          observer.observe(node);
        }}
        className="relative scroll-mt-24 flex flex-col overflow-hidden bg-notte py-16 text-travertino lg:h-screen lg:justify-center lg:py-[3vh]"
      >
        <AmbientTint system={activeSystem} />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(120%_90%_at_50%_0%,transparent_0%,var(--color-notte)_88%)]" />
        <SectionFade from="var(--color-travertino)" height="14vh" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1640px] flex-1 flex-col px-6 lg:min-h-0 lg:px-10 xl:px-14">
          <div className="flex shrink-0 flex-wrap items-end justify-between gap-4">
            <div>
              <Reveal>
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-acqua">Sustavi gradnje</p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-3 font-display text-2xl font-light leading-tight tracking-tight sm:text-3xl xl:text-[2.1rem]">
                  Šest tehnika gradnje. <span className="italic text-acqua-soft">Jedan pravi izbor.</span>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.2} className="font-mono text-[11px] uppercase tracking-[0.16em] text-travertino/50">
              <span className="hidden lg:inline">Odaberite tehniku →</span>
              <span className="lg:hidden">Dodirnite za odabir →</span>
            </Reveal>
          </div>

          {isDesktop ? (
            <DesktopStage activeSystem={activeSystem} activeIndex={activeIndex} onSelect={handleSelect} sectionInView={sectionInView} />
          ) : (
            <MobileStage activeSystem={activeSystem} activeIndex={activeIndex} onSelect={handleSelect} />
          )}

          <p className="relative z-10 mt-6 text-[11px] leading-relaxed text-travertino/30 lg:absolute lg:inset-x-10 lg:bottom-3 lg:mt-0 xl:inset-x-14">
            Rasponi su okvirni i ovise o terenu, dimenzijama i odabranoj opremi. Točan plan dobivate nakon obilaska parcele.
          </p>
        </div>
      </section>
    </MotionConfig>
  );
}
