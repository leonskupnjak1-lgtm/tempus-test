import { Head } from "vite-react-ssg";
import Reveal from "../components/common/Reveal";
import { SITE_URL, BUSINESS } from "../lib/site";

const SECTIONS = [
  {
    title: "Koje podatke prikupljamo",
    body: "Kroz kontaktni obrazac na ovoj stranici prikupljamo isključivo podatke koje nam sami date: vrstu upita, tehniku gradnje koja vas zanima, lokaciju projekta te broj mobitela ili e-mail adresu koju unesete kao kontakt. Ne tražimo ime, adresu stanovanja ni bilo koji drugi osobni podatak koji nije nužan za odgovor na vaš upit.",
  },
  {
    title: "Zašto ih prikupljamo",
    body: "Podaci iz obrasca služe isključivo za to da vas kontaktiramo u vezi vašeg upita — telefonski poziv, SMS ili e-mail s konkretnim prijedlogom za vaš prostor i budžet. Ne koristimo ih ni za što drugo: ne šaljemo newsletter, ne prodajemo ih trećim stranama i ne koristimo ih za oglašavanje.",
  },
  {
    title: "Koliko dugo ih čuvamo",
    body: "Podatke iz upita čuvamo dok traje komunikacija oko vašeg projekta, a najdulje 24 mjeseca od zadnjeg kontakta, nakon čega ih brišemo ako između nas nije sklopljen ugovor. Ako postanete naš klijent, podaci vezani uz ugovor i garanciju čuvaju se onoliko dugo koliko to zahtijeva zakon (obično do isteka jamstvenih rokova).",
  },
  {
    title: "Tko ima pristup podacima",
    body: "Podacima iz obrasca pristupa isključivo prodajni tim Tempus Poola. Obrazac se šalje putem usluge Web3Forms (web3forms.com) koja djeluje kao tehnički posrednik za dostavu poruke na naš e-mail — poruka ne ostaje trajno pohranjena kod tog pružatelja usluge nakon isporuke.",
  },
  {
    title: "Vaša prava",
    body: "U svakom trenutku možete zatražiti uvid u podatke koje o vama imamo, njihovu izmjenu ili potpuno brisanje. Dovoljno je poslati zahtjev na e-mail ispod — odgovorit ćemo i postupiti po zahtjevu u najkraćem mogućem roku, a najkasnije u zakonskom roku od 30 dana.",
  },
  {
    title: "Kolačići i analitika",
    body: "Ova stranica koristi analitiku koja ne postavlja kolačiće i ne prati vas osobno (Vercel Analytics) — broji posjete i osnovne stranice koje se otvaraju, bez identifikacije pojedinačnih posjetitelja. Zato ova stranica ne prikazuje obavijest o kolačićima — nema ih.",
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Pravila privatnosti — Tempus Pool</title>
        <meta
          name="description"
          content="Kako Tempus Pool prikuplja, koristi i čuva podatke poslane putem kontaktnog obrasca. Jasna pravila privatnosti u skladu s GDPR-om."
        />
        <link rel="canonical" href={`${SITE_URL}/pravila-privatnosti`} />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <section className="relative bg-notte px-6 pb-28 pt-36 text-travertino lg:px-12 lg:pb-36 lg:pt-44">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-acqua">Pravna napomena</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-5 font-display text-4xl font-light leading-tight tracking-tight sm:text-5xl">
              Pravila <span className="italic text-acqua-soft">privatnosti.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-[15px] leading-[1.8] text-travertino/60">
              Ovdje jednostavnim jezikom objašnjavamo što se događa s podacima koje nam pošaljete putem kontaktnog
              obrasca na ovoj stranici — bez pravnog žargona i bez sitnog tiska.
            </p>
          </Reveal>

          <div className="mt-16 flex flex-col gap-12 border-t border-travertino/[0.08] pt-12">
            {SECTIONS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <h2 className="font-display text-xl font-normal text-travertino sm:text-2xl">{s.title}</h2>
                <p className="mt-3 max-w-xl text-[15px] leading-[1.8] text-travertino/60">{s.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-16 border-t border-travertino/[0.08] pt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-travertino/50">Kontakt za pitanja o privatnosti</p>
            <a href={`mailto:${BUSINESS.email}`} className="mt-3 inline-block text-lg text-acqua transition-colors hover:text-acqua-soft">
              {BUSINESS.email}
            </a>
            <p className="mt-6 text-[13px] text-travertino/50">
              {BUSINESS.name} · {BUSINESS.streetAddress}, {BUSINESS.postalCode} {BUSINESS.addressLocality}
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-14">
            <a href="/" className="group inline-flex items-center gap-2 text-sm tracking-wide text-travertino/60 transition-colors hover:text-acqua">
              <span className="transition-transform group-hover:-translate-x-1">←</span>
              Natrag na početnu
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
