import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import ImagePlate from "./common/ImagePlate";
import SplitHeading from "./common/SplitHeading";
import Reveal from "./common/Reveal";
import Waterline from "./common/Waterline";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const veilOpacity = useTransform(scrollYProgress, [0, 1], [0.35, 0.75]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-notte text-travertino">
      <motion.div style={{ y: imageY }} className="absolute inset-0 h-[120%] w-full">
        <ImagePlate
          src="/images/hero.jpg"
          ratio=""
          className="absolute inset-0 h-full w-full"
          priority
          alt="Moderna vila s bazenom u suton, Tempus Pool referenca"
          caption="TEMPUS POOL REFERENCA · MODERNA VILA · SUTON"
        />
      </motion.div>
      <motion.div style={{ opacity: veilOpacity }} className="absolute inset-0 bg-[linear-gradient(190deg,rgba(10,24,21,0.15)_0%,rgba(10,24,21,0.55)_55%,rgba(10,24,21,0.92)_100%)]" />

      <div className="relative flex h-full flex-col justify-end px-6 pb-16 lg:px-12 lg:pb-20">
        <Reveal delay={0.1}>
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-acqua">
            Tempus Pool · Umag, Istra
          </p>
        </Reveal>

        <SplitHeading
          as="h1"
          className="mt-6 max-w-4xl font-display text-[2.6rem] font-light leading-[1.05] tracking-tight sm:text-6xl lg:text-[5.2rem]"
          lines={["Bazen nije dodatak vrtu.", { text: "Razlog je da u njemu ostanete.", className: "italic text-acqua-soft" }]}
          lineClassName=""
          delay={0.35}
        />

        <Reveal delay={0.9} className="mt-8 max-w-md text-[15px] leading-relaxed text-travertino/70 sm:text-base">
          Osamnaest godina projektiramo i gradimo bazene kao dio arhitekture doma —
          ne kao dodatak na kraju popisa.
        </Reveal>

        <Reveal delay={1.05} className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
          <a
            href="#kontakt"
            className="group flex items-center gap-2 border-b border-acqua/60 pb-1 text-sm font-medium tracking-wide text-acqua transition-colors hover:border-acqua"
          >
            Zatražite privatnu konzultaciju
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#sustavi"
            className="text-sm tracking-wide text-travertino/60 transition-colors hover:text-travertino"
          >
            Pogledajte sustave gradnje
          </a>
        </Reveal>
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <Waterline className="text-acqua" opacity={0.7} />
      </div>
    </section>
  );
}
