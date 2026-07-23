import Reveal from "./common/Reveal";
import Waterline from "./common/Waterline";

const NAV = [
  { href: "/#sustavi", label: "Sustavi" },
  { href: "/#projekti", label: "Projekti" },
  { href: "/#tehnika", label: "Tehnika" },
  { href: "/#proces", label: "Proces" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#kontakt", label: "Kontakt" },
];

export default function Footer() {
  return (
    <footer className="bg-notte pt-24 text-travertino/60">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-12">
        <Reveal>
          <p className="font-display text-[13vw] font-light italic leading-[0.85] tracking-tight text-travertino sm:text-[9vw] lg:text-[7rem]">
            Tempus Pool
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 border-t border-travertino/10 py-12 sm:grid-cols-3 lg:grid-cols-4">
          <div className="sm:col-span-3 lg:col-span-2">
            <p className="max-w-xs text-sm leading-relaxed">
              Izgradnja, opremanje, servis i održavanje privatnih bazena diljem Istre —
              s preciznošću i posvećenošću koje traju dulje od jedne sezone.
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-travertino/50">Navigacija</p>
            <ul className="mt-5 space-y-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm transition-colors hover:text-acqua">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-travertino/50">Kontakt</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>Bujska ulica 28c, 52470 Umag</li>
              <li>
                <a href="tel:+385917221000" className="transition-colors hover:text-acqua">+385 91 722 1000</a>
              </li>
              <li>
                <a href="mailto:prodaja@tempus-pool.hr" className="transition-colors hover:text-acqua">prodaja@tempus-pool.hr</a>
              </li>
            </ul>
          </div>
        </div>

        <Waterline className="text-acqua/40" opacity={0.5} />

        <div className="flex flex-col gap-4 py-8 text-xs text-travertino/50 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-x-2">
            <span>© {new Date().getFullYear()} Tempus Pool d.o.o., Umag. Sva prava pridržana.</span>
            <a href="/pravila-privatnosti" className="underline decoration-travertino/20 underline-offset-2 transition-colors hover:text-acqua">
              Pravila privatnosti
            </a>
          </p>
          <p className="font-mono uppercase tracking-[0.14em]">Umag · Istra · Hrvatska</p>
        </div>
      </div>
    </footer>
  );
}
