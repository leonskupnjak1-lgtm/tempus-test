import ImagePlate from "./common/ImagePlate";
import Reveal from "./common/Reveal";
import SplitHeading from "./common/SplitHeading";
import PoolCrossSection from "./PoolCrossSection";

const GROUPS = [
  {
    title: "Filtracija i cirkulacija",
    text: "Srce sustava — dimenzionirano prema volumenu bazena, ne uzeto s police.",
    items: ["Pumpe", "Filteri", "Skimmeri", "Podni ispusti", "PVC fitinzi"],
    caption: "PRESJEK FILTRACIJSKOG SUSTAVA",
  },
  {
    title: "Grijanje",
    text: "Produžite sezonu bez da voda ikad izgubi svoju temperaturu mira.",
    items: ["Grijanje", "Toplinske pumpe"],
    caption: "STROJARNICA · TOPLINSKA PUMPA",
    image: "/images/technology/grijanje.jpg",
  },
  {
    title: "Kemija i automatika",
    text: "Voda koja se sama pazi — bistra bez svakodnevnog razmišljanja o njoj.",
    items: ["Elektrolize i solinatori", "Automatsko doziranje", "Dozirne pumpe"],
    caption: "STROJARNICA · AUTOMATSKO DOZIRANJE",
    image: "/images/technology/kemija.jpg",
  },
  {
    title: "Čišćenje",
    text: "Tiha, autonomna njega dna i stijenki, dan za danom.",
    items: ["Roboti za čišćenje", "Oprema za čišćenje"],
    caption: "STROJARNICA · FILTRACIJSKA PUMPA",
    image: "/images/technology/ciscenje.jpg",
  },
  {
    title: "Rasvjeta i wellness",
    text: "Bazen navečer postaje druga prostorija kuće.",
    items: ["Rasvjeta", "Hidromasaža", "Slapovi", "Tuševi", "Masažne kade", "Mlaznice"],
    caption: "PODVODNA RASVJETA · VILLA STELLA, VEČER",
    image: "/images/technology/rasvjeta.jpg",
  },
  {
    title: "Okoliš i sigurnost",
    text: "Rubovi, obloge i zaštita koji dovršavaju arhitekturu prostora.",
    items: ["Ljestve inox", "Pokrivači za bazen", "Bazensko okruženje", "WPC obloge", "Sigurnosna oprema", "Osnovna oprema"],
    caption: "MOZAIK OBLOGA · RUB BAZENA",
    image: "/images/technology/okolis.jpg",
  },
];

const BRANDS = [
  "BWT", "Hayward", "ESPA", "Aquark", "Bayrol", "Dolphin", "Speck", "Emaux",
  "Astrapool", "Fairland", "Aquarite", "Cepex", "Renolit", "Astore", "Sugar Valley",
];

export default function Technology() {
  return (
    <section id="tehnika" className="scroll-mt-20 bg-notte py-28 text-travertino lg:py-40">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-12">
        <div className="max-w-2xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-acqua">Vodena tehnika</p>
          </Reveal>
          <SplitHeading
            as="h2"
            className="mt-5 font-display text-4xl font-light leading-tight tracking-tight sm:text-5xl"
            lines={["Oprema koju nikad", { text: "nećete primijetiti.", className: "italic text-acqua-soft" }]}
          />
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-travertino/60">
              24 kategorije opreme, biranih ne po katalogu nego po tome kako živite pored svog bazena.
            </p>
          </Reveal>
        </div>

        <div className="mt-24 divide-y divide-travertino/10 border-t border-travertino/10">
          {GROUPS.map((g, i) => (
            <div key={g.title} className="grid gap-10 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
              <Reveal
                as="div"
                y={20}
                className={`relative aspect-[4/3] overflow-hidden ${i % 2 === 1 ? "lg:order-2" : ""}`}
              >
                {i === 0 ? (
                  <div className="absolute inset-0 border border-travertino/10 bg-notte-soft">
                    <PoolCrossSection className="h-full w-full p-6" />
                  </div>
                ) : (
                  <ImagePlate src={g.image} ratio="" className="absolute inset-0 h-full w-full" alt={g.title} caption={g.caption} />
                )}
              </Reveal>

              <Reveal delay={0.1} className="flex flex-col justify-center">
                <span className="font-mono text-[11px] text-acqua/70">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-display text-3xl font-light leading-tight sm:text-4xl">{g.title}</h3>
                <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-travertino/55">{g.text}</p>
                <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-travertino/10 pt-6">
                  {g.items.map((item) => (
                    <li key={item} className="font-mono text-[11px] uppercase tracking-[0.1em] text-travertino/45">
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          ))}
        </div>

        <div className="mt-20 border-t border-travertino/10 pt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-travertino/35">Radimo s vodećim svjetskim brendovima</p>
          <div className="relative mt-6 overflow-hidden">
            <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-14 motion-reduce:animate-none">
              {[...BRANDS, ...BRANDS].map((b, i) => (
                <span key={`${b}-${i}`} className="font-display text-xl font-light italic text-travertino/30">
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
