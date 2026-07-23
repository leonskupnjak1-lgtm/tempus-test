import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { IconPhone, IconRuler, IconGauge, IconTrowel, IconDroplet } from "./icons/BlueprintIcons";
import ImagePlate from "./common/ImagePlate";
import Reveal from "./common/Reveal";
import SplitHeading from "./common/SplitHeading";
import SectionFade from "./common/SectionFade";

const STEPS = [
  {
    n: "01",
    icon: IconPhone,
    title: "Konzultacija",
    text: "Dolazimo na teren, upoznajemo prostor, klimu i svakodnevne navike obitelji koja će bazen koristiti — bez obaveze, bez gotovog rješenja u ladici.",
  },
  {
    n: "02",
    icon: IconRuler,
    title: "Projektiranje",
    text: "Idejno rješenje oblikovano prema arhitekturi doma i konfiguraciji vrta, ne prema katalogu gotovih oblika.",
  },
  {
    n: "03",
    icon: IconGauge,
    title: "Inženjering",
    text: "Biramo jedan od šest sustava gradnje i dimenzioniramo filtraciju, grijanje i automatiku prema stvarnom volumenu i namjeni bazena.",
  },
  {
    n: "04",
    icon: IconTrowel,
    title: "Gradnja",
    text: "Izvedba radova pod nadzorom istog tima koji je projekt osmislio — precizan raspored, bez podizvođača koji se izgube u komunikaciji.",
  },
  {
    n: "05",
    icon: IconDroplet,
    title: "Voda",
    text: "Punjenje, baždarenje kemije i primopredaja ključeva. Odatle nastavljamo servisom i sezonskim održavanjem — koliko dugo je bazen vaš.",
  },
];

export default function Process() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 0.75", "end 0.6"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="proces" className="relative scroll-mt-20 bg-travertino-soft py-32 lg:py-44">
      <SectionFade from="var(--color-notte)" />
      <div className="relative mx-auto max-w-[1500px] px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_0.85fr] lg:gap-14">
          <div>
            <div className="max-w-2xl">
              <Reveal>
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cemento">Proces</p>
              </Reveal>
              <SplitHeading
                as="h2"
                className="mt-5 font-display text-5xl font-light leading-tight tracking-tight text-ink sm:text-6xl"
                lines={["Pet koraka od ideje", { text: "do prve zaronjene.", className: "italic" }]}
              />
            </div>

            <div ref={containerRef} className="relative mt-20 max-w-2xl">
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-ink/10 sm:left-[23px]" aria-hidden="true" />
              <motion.div
                className="absolute left-[19px] top-2 w-px origin-top bg-acqua sm:left-[23px]"
                style={{ scaleY: lineScale, height: "calc(100% - 1rem)" }}
                aria-hidden="true"
              />

              <div className="space-y-16">
                {STEPS.map(({ n, icon: Icon, title, text }, i) => (
                  <Reveal key={n} delay={i * 0.05} className="group relative flex gap-6 pl-0 sm:gap-8">
                    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-travertino-soft text-acqua transition-transform duration-700 ease-out group-hover:scale-110 sm:h-12 sm:w-12">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="pt-1">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-[11px] text-cemento">{n}</span>
                        <h3 className="font-display text-xl font-normal text-ink sm:text-2xl">{title}</h3>
                      </div>
                      <p className="mt-3 max-w-md text-[15px] leading-[1.75] text-ink/65">{text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-32 space-y-5">
              <Reveal y={20} className="relative aspect-[4/5] overflow-hidden">
                <ImagePlate
                  src="/images/process/excavation.jpg"
                  ratio=""
                  className="absolute inset-0 h-full w-full"
                  alt="Iskop i oplata za armirano-betonski bazen"
                  caption="FAZA 1 · ISKOP I OPLATA"
                  dark
                />
              </Reveal>
              <div className="grid grid-cols-2 gap-5">
                <Reveal delay={0.1} y={20} className="relative aspect-square overflow-hidden">
                  <ImagePlate
                    src="/images/process/reinforcement-night.jpg"
                    ratio=""
                    className="absolute inset-0 h-full w-full"
                    alt="Ugradnja armature, večernja izvedba"
                    caption="FAZA 1 · ARMATURA"
                    dark
                  />
                </Reveal>
                <Reveal delay={0.18} y={20} className="relative aspect-square overflow-hidden">
                  <ImagePlate
                    src="/images/process/finished-night.jpg"
                    ratio=""
                    className="absolute inset-0 h-full w-full"
                    alt="Napunjen bazen, večernje osvjetljenje"
                    caption="FAZA 4 · PUŠTANJE U POGON"
                    dark
                  />
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
