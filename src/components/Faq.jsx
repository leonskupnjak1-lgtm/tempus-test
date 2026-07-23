import { useState } from "react";
import { IconPlus } from "./icons/BlueprintIcons";
import Reveal from "./common/Reveal";
import { FAQ_ITEMS as ITEMS } from "../lib/faqData";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="scroll-mt-20 bg-travertino-soft py-32 lg:py-40">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal>
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.3em] text-cemento">Prije nego se javite</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-5 text-center font-display text-5xl font-light tracking-tight text-ink sm:text-6xl">
            Česta pitanja
          </h2>
        </Reveal>

        <div className="mt-20 divide-y divide-ink/[0.08] border-t border-ink/[0.08]">
          {ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center justify-between gap-6 py-8 text-left"
                >
                  <span className="font-display text-lg font-normal text-ink transition-transform duration-500 ease-out group-hover:translate-x-1 sm:text-xl">{item.q}</span>
                  <IconPlus
                    className={`h-4 w-4 shrink-0 text-acqua transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                  />
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-500 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-xl pb-8 text-[15px] leading-[1.8] text-ink/65">{item.a}</p>
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
