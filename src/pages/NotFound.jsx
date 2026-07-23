import { Head } from "vite-react-ssg";
import Waterline from "../components/common/Waterline";
import { IconPhone } from "../components/icons/BlueprintIcons";
import { BUSINESS } from "../lib/site";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Stranica nije pronađena — Tempus Pool</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-notte px-6 text-center text-travertino">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 animate-drift rounded-full bg-acqua/10 blur-3xl" />

        <a href="/" className="relative flex items-center gap-3">
          <svg width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="M6 26c2.8-2.8 5.6-2.8 8.4 0s5.6 2.8 8.4 0 5.6-2.8 8.4 0" stroke="var(--color-acqua)" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M6 17c2.8-2.8 5.6-2.8 8.4 0s5.6 2.8 8.4 0 5.6-2.8 8.4 0" stroke="var(--color-travertino)" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
          </svg>
          <span className="font-display text-lg font-medium italic tracking-tight">Tempus Pool</span>
        </a>

        <p className="relative mt-14 font-display text-[7rem] font-light leading-none tracking-tight text-travertino/90 sm:text-[9rem]">404</p>

        <h1 className="relative mt-4 font-display text-2xl font-light leading-snug sm:text-3xl">
          Ova stranica je <span className="italic text-acqua-soft">otplovila.</span>
        </h1>
        <p className="relative mt-4 max-w-sm text-[15px] leading-relaxed text-travertino/55">
          Stranica koju tražite ne postoji ili je premještena. Vratite se na početnu ili nas nazovite izravno.
        </p>

        <div className="relative mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <a
            href="/"
            className="btn-lift group flex items-center gap-2 rounded-full bg-acqua px-6 py-3 text-sm font-medium tracking-wide text-notte transition-colors hover:bg-acqua-soft"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            Natrag na početnu
          </a>
          <a href={`tel:${BUSINESS.telephone}`} className="group flex items-center gap-2 text-sm text-travertino/70 transition-colors hover:text-acqua">
            <IconPhone className="h-4 w-4" />
            {BUSINESS.telephoneDisplay}
          </a>
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <Waterline className="text-acqua" opacity={0.5} />
        </div>
      </div>
    </>
  );
}
