import { useEffect, useState } from "react";
import { IconPhone } from "./icons/BlueprintIcons";

const NAV = [
  { href: "#sustavi", label: "Sustavi" },
  { href: "#projekti", label: "Projekti" },
  { href: "#tehnika", label: "Tehnika" },
  { href: "#proces", label: "Proces" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-travertino transition-[background-color,backdrop-filter] duration-500 ${
        scrolled || open ? "bg-notte/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 lg:px-12">
        <a href="#" className="flex items-center gap-3">
          <svg width="26" height="26" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="M6 26c2.8-2.8 5.6-2.8 8.4 0s5.6 2.8 8.4 0 5.6-2.8 8.4 0" stroke="var(--color-acqua)" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M6 17c2.8-2.8 5.6-2.8 8.4 0s5.6 2.8 8.4 0 5.6-2.8 8.4 0" stroke="var(--color-travertino)" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
          </svg>
          <span className="font-display text-[17px] font-medium italic tracking-tight">Tempus Pool</span>
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-travertino/70 transition-colors hover:text-acqua"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-7 lg:flex">
          <a href="tel:+385917221000" className="flex items-center gap-2 text-[13px] text-travertino/85 transition-colors hover:text-acqua">
            <IconPhone className="h-3.5 w-3.5" />
            +385 91 722 1000
          </a>
          <a
            href="#kontakt"
            className="group flex items-center gap-2 border-b border-acqua/50 pb-0.5 font-mono text-[11px] uppercase tracking-[0.18em] text-acqua transition-colors hover:border-acqua"
          >
            Konzultacija
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Zatvori izbornik" : "Otvori izbornik"}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span className={`h-px w-6 bg-travertino transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-travertino transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="border-t border-travertino/10 px-6 pb-8 lg:hidden">
          <nav className="flex flex-col gap-1 pt-4">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 font-mono text-sm uppercase tracking-wide text-travertino/80 hover:text-acqua"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#kontakt"
              onClick={() => setOpen(false)}
              className="mt-3 border-b border-acqua/50 px-2 pb-2 font-mono text-[13px] uppercase tracking-[0.18em] text-acqua"
            >
              Zatražite konzultaciju →
            </a>
            <a href="tel:+385917221000" className="mt-4 flex items-center gap-2 px-2 text-sm text-travertino/85">
              <IconPhone className="h-4 w-4 text-acqua" />
              +385 91 722 1000
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
