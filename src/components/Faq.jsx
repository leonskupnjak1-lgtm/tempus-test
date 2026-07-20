import { useState } from "react";
import { IconPlus } from "./icons/BlueprintIcons";
import Reveal from "./common/Reveal";

const ITEMS = [
  {
    q: "Koliko traje izgradnja bazena?",
    a: "Ovisno o tipu bazena i složenosti terena, izgradnja traje od nekoliko tjedana za montažne i poliesterske bazene do dva do tri mjeseca za betonske bazene po mjeri. Točan rok dobivate nakon prvog razgleda terena.",
  },
  {
    q: "Koji tip bazena je najbolji za moj vrt?",
    a: "Ovisi o obliku parcele, pristupačnosti terena, budžetu i vremenskom okviru. Na besplatnoj konzultaciji predlažemo rješenje koje odgovara vašem prostoru — bez guranja skupljeg rješenja tamo gdje jednostavnije radi jednako dobro.",
  },
  {
    q: "Radite li servis opreme koju nije ugradio Tempus Pool?",
    a: "Da. Naš servisni tim dijagnosticira i popravlja bazensku tehniku neovisno o tome tko ju je ugradio, uz nabavu originalnih rezervnih dijelova vodećih brendova.",
  },
  {
    q: "Nudite li održavanje tijekom cijele godine?",
    a: "Da, od sezonskog pokretanja i redovite kontrole kemije vode do zimske pripreme bazena. Održavanje možete ugovoriti jednokratno ili kao stalnu uslugu kroz cijelu sezonu.",
  },
  {
    q: "Koliko unaprijed treba zakazati početak radova?",
    a: "Preporučamo javljanje barem 6 do 8 tjedana prije željenog termina, osobito u proljetnim mjesecima kada je potražnja najveća. Za servisne intervencije rokovi su bitno kraći.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="scroll-mt-20 bg-travertino-soft py-28 lg:py-36">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal>
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.3em] text-cemento">Prije nego se javite</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-5 text-center font-display text-4xl font-light tracking-tight text-ink sm:text-5xl">
            Česta pitanja
          </h2>
        </Reveal>

        <div className="mt-16 divide-y divide-ink/10 border-t border-ink/10">
          {ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-7 text-left"
                >
                  <span className="font-display text-lg font-normal text-ink sm:text-xl">{item.q}</span>
                  <IconPlus
                    className={`h-4 w-4 shrink-0 text-acqua transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                  />
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-500 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-xl pb-7 text-[15px] leading-relaxed text-ink/55">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
