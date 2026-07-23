import { IconShield, IconGauge, IconWrench, IconDroplet } from "./icons/BlueprintIcons";
import ImagePlate from "./common/ImagePlate";
import Reveal from "./common/Reveal";
import SplitHeading from "./common/SplitHeading";
import SectionFade from "./common/SectionFade";

const REASONS = [
  {
    icon: IconShield,
    title: "Jedan tim, cijeli projekt",
    text: "Gradnja, oprema i servis pod istim krovom — bez podizvođača koji prebacuju odgovornost jedni na druge.",
  },
  {
    icon: IconGauge,
    title: "Precizna tehnička izvedba",
    text: "Svaki sustav filtracije, grijanja i automatike dimenzioniramo prema veličini bazena i stvarnoj namjeni, ne po katalogu.",
  },
  {
    icon: IconWrench,
    title: "Podrška tijekom cijele sezone",
    text: "Servisni tim dostupan za intervencije, dijagnostiku kvarova i nabavu originalnih rezervnih dijelova.",
  },
  {
    icon: IconDroplet,
    title: "Dugoročna briga o vodi",
    text: "Ugovori o redovitom održavanju drže vašu vodu bistrom i uravnoteženom bez da vi o tome razmišljate.",
  },
];

export default function WhyUs() {
  return (
    <section id="filozofija" className="relative scroll-mt-20 bg-travertino py-32 lg:py-44">
      <SectionFade from="var(--color-notte)" />
      <div className="relative mx-auto max-w-[1500px] px-6 lg:px-12">
        <div className="max-w-xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cemento">Filozofija</p>
          </Reveal>
          <SplitHeading
            as="h2"
            className="mt-6 font-display text-5xl font-light leading-[1.08] tracking-tight text-ink sm:text-6xl"
            lines={["Povjerenje se gradi,", { text: "sloj po sloj.", className: "italic" }]}
          />
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-sm text-[15px] leading-[1.8] text-ink/60">
              Bazen je dugoročna investicija u dom. Naš posao ne završava punjenjem vode —
              tek tada počinje odnos na koji se možete osloniti.
            </p>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-14 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
          <Reveal y={20} className="relative aspect-[4/5] overflow-hidden lg:sticky lg:top-32 lg:self-start">
            <ImagePlate
              src="/images/about/philosophy.jpg"
              ratio=""
              className="absolute inset-0 h-full w-full"
              alt="Poslijepodne uz bazen, Tempus Pool referenca"
              caption="ŽIVOT UZ BAZEN"
              dark={false}
            />
          </Reveal>

          <div className="divide-y divide-ink/[0.08] border-t border-ink/[0.08]">
            {REASONS.map(({ icon: Icon, title, text }, i) => (
              <Reveal
                key={title}
                delay={i * 0.08}
                className={`group flex flex-col gap-5 py-11 sm:flex-row sm:items-start sm:gap-10 ${
                  i % 2 === 1 ? "sm:pl-14" : ""
                }`}
              >
                <Icon className="h-8 w-8 shrink-0 text-acqua transition-transform duration-700 ease-out group-hover:-translate-y-0.5" />
                <div>
                  <h3 className="font-display text-xl font-normal text-ink transition-transform duration-700 ease-out group-hover:translate-x-1">{title}</h3>
                  <p className="mt-3 max-w-md text-[15px] leading-[1.75] text-ink/65">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
