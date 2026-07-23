// A consultation request, not a generic contact form. One question per step
// keeps the commitment small at every point — a single click on step 1 is
// all it takes to start, and step 4 asks for exactly one thing: a phone
// number or email, auto-detected as you type. No name, no separate fields —
// friction is the enemy here. The "Vrsta upita" bridge from Pool
// Technologies (see src/lib/inquiry.js) still pre-fills project type +
// technique and jumps straight to the location step.

import { forwardRef, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import {
  IconPhone,
  IconMail,
  IconClock,
  IconChevron,
  IconConcrete,
  IconMembrane,
  IconShell,
  IconModular,
  IconWrench,
  IconTrowel,
  IconGauge,
  IconPlus,
  IconArrowUpRight,
} from "./icons/BlueprintIcons";
import Counter from "./common/Counter";
import Reveal from "./common/Reveal";
import SplitHeading from "./common/SplitHeading";
import Waterline from "./common/Waterline";
import SectionFade from "./common/SectionFade";
import { INQUIRY_EVENT, inquiryLabel } from "@/lib/inquiry";

const EASE = [0.16, 1, 0.3, 1];
const TOTAL_STEPS = 4;

const PROJECT_TYPES = [
  { value: "novi", label: "Novi bazen", icon: IconPlus },
  { value: "renovacija", label: "Renovacija postojećeg", icon: IconTrowel },
  { value: "servis", label: "Servis i održavanje", icon: IconWrench },
  { value: "oprema", label: "Oprema / web shop", icon: IconGauge },
];
const PROJECT_TYPE_LABEL = Object.fromEntries(PROJECT_TYPES.map((p) => [p.value, p.label]));

const TECHNIQUES = [
  { value: "beton", label: "Betonski", icon: IconConcrete },
  { value: "liner", label: "Liner", icon: IconMembrane },
  { value: "montazni", label: "Montažni", icon: IconModular },
  { value: "poliester", label: "Poliesterski", icon: IconShell },
  { value: "neznam", label: "Još ne znam — trebam savjet", icon: IconArrowUpRight, wide: true },
];
const TECHNIQUE_LABEL = Object.fromEntries(TECHNIQUES.map((t) => [t.value, t.label]));

// Techniques reachable only via the Pool Technologies CTA bridge, not shown
// as their own step-2 card — inquiryLabel() still gives them a real label.
const BRIDGE_TECHNIQUES = new Set(["beton", "liner", "montazni", "poliester", "stiropor", "inox"]);

function techniqueLabel(value) {
  return TECHNIQUE_LABEL[value] || inquiryLabel(value) || value;
}

function nextStepAfter(step, answers) {
  if (step === 1) return answers.projectType === "novi" ? 2 : 3;
  if (step === 2) return 3;
  return 4;
}

// Smart phone/email detection for the single step-4 input: "@" always wins
// (it can't appear in a phone number), otherwise a leading digit or "+"
// reads as the start of a phone number. Anything else is still ambiguous —
// e.g. someone starting to type an email's local part before the "@".
function detectContactType(raw) {
  const value = raw.trim();
  if (!value) return null;
  if (value.includes("@")) return "email";
  if (/^[+\d]/.test(value)) return "phone";
  return null;
}

function validateContact(raw) {
  const value = raw.trim();
  const type = detectContactType(value);
  if (type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Unesite ispravnu e-mail adresu.";
  if (type === "phone") return value.replace(/\D/g, "").length >= 6 ? null : "Unesite ispravan broj mobitela.";
  return "Unesite broj mobitela ili e-mail adresu.";
}

const Field = forwardRef(function Field({ label, error, className = "", ...props }, ref) {
  return (
    <label className={`block ${className}`}>
      <span className="font-mono text-[10px] uppercase tracking-wide text-travertino/55">{label}</span>
      <input
        ref={ref}
        {...props}
        className={`mt-2 w-full rounded-xl border bg-notte/40 px-4 py-3 text-sm text-travertino placeholder:text-travertino/30 transition-colors focus:outline-none ${
          error ? "border-destructive/60 focus:border-destructive" : "border-travertino/20 focus:border-acqua"
        }`}
      />
      {error && <span className="mt-1.5 block text-[12px] text-destructive/90">{error}</span>}
    </label>
  );
});

function OptionCard({ label, icon: Icon, active, wide, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all duration-500 ease-out hover:-translate-y-0.5 ${
        wide ? "col-span-2" : ""
      } ${
        active
          ? "border-acqua/60 bg-acqua/10 text-acqua"
          : "border-transparent bg-travertino/[0.04] text-travertino/80 hover:border-acqua/30 hover:text-travertino"
      }`}
    >
      {Icon && (
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
            active ? "border-acqua/50 text-acqua" : "border-travertino/15 text-travertino/50 group-hover:border-acqua/35"
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
      )}
      <span className="leading-snug">{label}</span>
    </button>
  );
}

function StepDots({ current }) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
        <span
          key={n}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            n === current ? "w-5 bg-acqua" : n < current ? "w-1.5 bg-acqua/50" : "w-1.5 bg-travertino/15"
          }`}
        />
      ))}
    </div>
  );
}

function Chip({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-acqua/25 bg-acqua/5 px-3 py-1 font-mono text-[10.5px] uppercase tracking-wide text-acqua/85 transition-colors hover:border-acqua/60 hover:text-acqua"
    >
      {label}
      <IconChevron className="h-2.5 w-2.5 rotate-90 opacity-60" />
    </button>
  );
}

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -32 : 32, opacity: 0 }),
};
const springTransition = { type: "spring", stiffness: 420, damping: 34, mass: 0.9 };

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [answers, setAnswers] = useState({
    projectType: "",
    technique: "",
    location: "",
    contactValue: "",
    contactType: null,
  });
  const [errors, setErrors] = useState({});
  const [stepStack, setStepStack] = useState([1]);
  const [direction, setDirection] = useState(1);
  const [highlight, setHighlight] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [followUpStatus, setFollowUpStatus] = useState("idle"); // idle | sent | dismissed
  const locationRef = useRef(null);
  const contactRef = useRef(null);
  const cardRef = useRef(null);

  const currentStep = stepStack[stepStack.length - 1];
  const contactType = detectContactType(answers.contactValue);

  // AnimatePresence (mode="wait") delays mounting step 4's DOM until step 3's
  // exit animation finishes, so a mount-time effect fires too early to find
  // the input — focus from the ref callback itself, right as it attaches.
  function autofocusContact(el) {
    contactRef.current = el;
    if (el) el.focus();
  }

  useEffect(() => {
    function onInquiry(e) {
      const type = e.detail?.type;
      if (!type) return;

      let patch = null;
      if (BRIDGE_TECHNIQUES.has(type)) patch = { projectType: "novi", technique: type };
      else if (type === "servis" || type === "odrzavanje") patch = { projectType: "servis" };

      if (patch) {
        setAnswers((prev) => ({ ...prev, ...patch }));
        setStepStack([1, 3]);
        setDirection(1);
      }

      setHighlight(true);
      let done = false;
      const trigger = () => {
        if (done) return;
        done = true;
        locationRef.current?.focus();
        window.setTimeout(() => setHighlight(false), 1300);
      };

      if ("onscrollend" in window) {
        const handler = () => {
          window.removeEventListener("scrollend", handler);
          trigger();
        };
        window.addEventListener("scrollend", handler);
        window.setTimeout(() => {
          window.removeEventListener("scrollend", handler);
          trigger();
        }, 1100);
      } else {
        window.setTimeout(trigger, 900);
      }
    }
    window.addEventListener(INQUIRY_EVENT, onInquiry);
    return () => window.removeEventListener(INQUIRY_EVENT, onInquiry);
  }, []);

  function goNext(patch = {}) {
    const merged = { ...answers, ...patch };
    if (merged.projectType !== "novi") merged.technique = "";
    setAnswers(merged);
    setDirection(1);
    setStepStack((stack) => [...stack, nextStepAfter(stack[stack.length - 1], merged)]);
  }

  function goBack() {
    setDirection(-1);
    setStepStack((stack) => (stack.length > 1 ? stack.slice(0, -1) : stack));
  }

  function jumpTo(step) {
    setDirection(-1);
    setStepStack((stack) => {
      const idx = stack.indexOf(step);
      return idx >= 0 ? stack.slice(0, idx + 1) : [...stack, step];
    });
  }

  function setField(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (key === "contactValue" && errors.contact) setErrors((prev) => ({ ...prev, contact: undefined }));
  }

  function handleFinalSubmit() {
    const error = validateContact(answers.contactValue);
    if (error) {
      setErrors({ contact: error });
      return;
    }
    setErrors({});

    const contactValue = answers.contactValue.trim();
    const resolvedType = detectContactType(contactValue);
    const techLabel = answers.technique ? techniqueLabel(answers.technique) : "";
    const subjectParts = [PROJECT_TYPE_LABEL[answers.projectType] || "Upit", techLabel, contactValue].filter(Boolean);
    const subject = encodeURIComponent(`Upit — ${subjectParts.join(" — ")}`);
    const body = encodeURIComponent(
      `Vrsta upita: ${PROJECT_TYPE_LABEL[answers.projectType] || "—"}\n` +
        `Tehnika: ${techLabel || "—"}\n` +
        `Lokacija projekta: ${answers.location || "—"}\n` +
        `Kontakt (${resolvedType === "email" ? "email" : "telefon"}): ${contactValue}`
    );
    window.location.href = `mailto:prodaja@tempus-pool.hr?subject=${subject}&body=${body}`;
    setAnswers((prev) => ({ ...prev, contactValue, contactType: resolvedType }));
    setSent(true);
  }

  function sendFollowUp() {
    const note = followUp.trim();
    if (!note) return;
    const subject = encodeURIComponent(`Dopuna upita — ${answers.contactValue.trim()}`);
    const body = encodeURIComponent(`Dopuna uz prethodni upit (${answers.contactValue.trim()}):\n\n${note}`);
    window.location.href = `mailto:prodaja@tempus-pool.hr?subject=${subject}&body=${body}`;
    setFollowUpStatus("sent");
  }

  const chips = [
    { step: 1, value: answers.projectType && PROJECT_TYPE_LABEL[answers.projectType] },
    { step: 2, value: answers.technique && techniqueLabel(answers.technique) },
    { step: 3, value: answers.location },
  ].filter((c) => c.value && c.step < currentStep);

  return (
    <section id="kontakt" className="relative scroll-mt-24 overflow-hidden bg-notte py-32 text-travertino lg:py-40">
      <SectionFade from="var(--color-travertino-soft)" height="16vh" />
      <Waterline className="absolute inset-x-0 top-0 text-acqua/60" opacity={0.6} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(55% 45% at 12% 15%, rgba(47,191,163,0.08) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-[1500px] px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-20 xl:gap-28">
          <div className="flex flex-col justify-center">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-acqua">Kontakt</p>
            </Reveal>
            <SplitHeading
              as="h2"
              className="mt-5 font-display text-5xl font-light leading-tight tracking-tight sm:text-6xl"
              lines={["Razgovarajmo o", { text: "vašem bazenu.", className: "italic text-acqua-soft" }]}
            />
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-travertino/60">
                Besplatna konzultacija i konkretan prijedlog za vaš prostor i budžet.
              </p>
            </Reveal>

            {/* TODO: [POTVRDITI s klijentom] "Odgovaramo unutar 24 sata" badge
                uklonjen dok se stvarno vrijeme odgovora ne potvrdi s klijentom. */}

            <Reveal delay={0.35} className="mt-11 space-y-5">
              <a href="tel:+385917221000" className="group flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-travertino/15 text-acqua transition-colors group-hover:border-acqua/50">
                  <IconPhone className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wide text-travertino/55">Telefon</div>
                  <div className="mt-0.5 text-[15px] transition-colors group-hover:text-acqua">+385 91 722 1000</div>
                </div>
              </a>
              <a href="mailto:prodaja@tempus-pool.hr" className="group flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-travertino/15 text-acqua transition-colors group-hover:border-acqua/50">
                  <IconMail className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wide text-travertino/55">Email</div>
                  <div className="mt-0.5 text-[15px] transition-colors group-hover:text-acqua">prodaja@tempus-pool.hr</div>
                </div>
              </a>
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-travertino/15 text-acqua">
                  <IconClock className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wide text-travertino/55">Radno vrijeme</div>
                  <div className="mt-0.5 text-[15px]">Pon – Pet, 08:00 – 16:00</div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.45} className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-travertino/10 pt-8">
              <div>
                <div className="font-display text-2xl font-light text-travertino">
                  <Counter to={18} suffix="+" />
                </div>
                {/* TODO: [POTVRDITI formulaciju s klijentom — tvrtka osnovana 2022.,
                    "godina iskustva u struci" odnosi se na iskustvo vodstva, ne tvrtke] */}
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-travertino/55">
                  Godina iskustva u struci
                </div>
              </div>
              <div className="h-8 w-px bg-travertino/10" />
              <div>
                <div className="font-display text-2xl font-light text-travertino">
                  <Counter to={31} />
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-travertino/55">realiziran projekt</div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <MotionConfig reducedMotion="user">
              <motion.div
                ref={cardRef}
                animate={
                  highlight
                    ? { boxShadow: ["0 0 0 0 rgba(47,191,163,0)", "0 0 0 5px rgba(47,191,163,0.28)", "0 0 0 0 rgba(47,191,163,0)"] }
                    : { boxShadow: "0 0 0 0 rgba(47,191,163,0)" }
                }
                transition={highlight ? { duration: 1.2, ease: "easeInOut" } : { duration: 0.3 }}
                className="relative overflow-hidden rounded-[28px] border border-travertino/[0.08] bg-notte-soft/40 p-7 shadow-[0_40px_100px_-50px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-10"
              >
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-acqua/10 blur-[100px]" />

                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="relative py-6 text-center"
                    >
                      <p className="font-display text-2xl font-light leading-snug text-travertino sm:text-3xl">
                        Hvala! Javljamo se u najkraćem roku.
                      </p>

                      {followUpStatus === "idle" && (
                        <div className="mx-auto mt-7 max-w-sm text-left">
                          <label className="block">
                            <span className="font-mono text-[10px] uppercase tracking-wide text-travertino/45">
                              Želite li dodati nešto o projektu? (neobavezno)
                            </span>
                            <div className="mt-2 flex gap-2">
                              <input
                                type="text"
                                name="followUp"
                                value={followUp}
                                onChange={(e) => setFollowUp(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    sendFollowUp();
                                  }
                                }}
                                placeholder="npr. veličina, rok, poseban zahtjev…"
                                className="w-full rounded-xl border border-travertino/20 bg-notte/40 px-4 py-2.5 text-sm text-travertino placeholder:text-travertino/30 transition-colors focus:border-acqua focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={sendFollowUp}
                                disabled={!followUp.trim()}
                                className="shrink-0 rounded-xl border border-acqua/40 px-4 text-sm text-acqua transition-colors hover:bg-acqua/10 disabled:opacity-30"
                              >
                                Pošalji
                              </button>
                            </div>
                          </label>
                          <button
                            type="button"
                            onClick={() => setFollowUpStatus("dismissed")}
                            className="mt-2 font-mono text-[10px] uppercase tracking-wide text-travertino/30 transition-colors hover:text-travertino/60"
                          >
                            Ne, hvala
                          </button>
                        </div>
                      )}

                      {followUpStatus === "sent" && (
                        <p className="mt-5 text-[13px] text-acqua">Hvala, dodano je vašem upitu.</p>
                      )}

                      <a
                        href="tel:+385917221000"
                        className="btn-lift group mt-7 inline-flex items-center gap-2.5 rounded-full border border-acqua/30 px-6 py-3 text-sm font-medium tracking-wide text-acqua transition-colors hover:border-acqua hover:bg-acqua/10"
                      >
                        <IconPhone className="h-4 w-4" />
                        +385 91 722 1000
                      </a>
                    </motion.div>
                  ) : (
                    <motion.div key="wizard" initial={{ opacity: 1 }} className="relative">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {currentStep !== 1 && (
                            <button
                              type="button"
                              onClick={goBack}
                              aria-label="Natrag"
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-travertino/15 text-travertino/50 transition-colors hover:border-acqua/40 hover:text-acqua"
                            >
                              <IconChevron className="h-3 w-3 rotate-180" />
                            </button>
                          )}
                          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-travertino/55">
                            Korak {currentStep} od {TOTAL_STEPS}
                          </span>
                        </div>
                        <StepDots current={currentStep} />
                      </div>

                      {chips.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {chips.map((c) => (
                            <Chip key={c.step} label={c.value} onClick={() => jumpTo(c.step)} />
                          ))}
                        </div>
                      )}

                      <motion.div layout transition={{ duration: 0.35, ease: EASE }} className="relative mt-6 overflow-hidden">
                        <AnimatePresence mode="wait" custom={direction} initial={false}>
                          <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={springTransition}
                          >
                            {currentStep === 1 && (
                              <div>
                                <h3 className="font-display text-xl font-light text-travertino sm:text-2xl">Što planirate?</h3>
                                <div className="mt-5 grid grid-cols-2 gap-3">
                                  {PROJECT_TYPES.map((p) => (
                                    <OptionCard
                                      key={p.value}
                                      label={p.label}
                                      icon={p.icon}
                                      active={answers.projectType === p.value}
                                      onClick={() => goNext({ projectType: p.value })}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            {currentStep === 2 && (
                              <div>
                                <h3 className="font-display text-xl font-light text-travertino sm:text-2xl">
                                  Koja tehnika vas zanima?
                                </h3>
                                <div className="mt-5 grid grid-cols-2 gap-3">
                                  {TECHNIQUES.map((t) => (
                                    <OptionCard
                                      key={t.value}
                                      label={t.label}
                                      icon={t.icon}
                                      wide={t.wide}
                                      active={answers.technique === t.value}
                                      onClick={() => goNext({ technique: t.value })}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            {currentStep === 3 && (
                              <div>
                                <h3 className="font-display text-xl font-light text-travertino sm:text-2xl">
                                  Gdje se nalazi projekt?
                                </h3>
                                <Field
                                  ref={locationRef}
                                  className="mt-5"
                                  name="location"
                                  type="text"
                                  autoComplete="address-level2"
                                  label="Lokacija"
                                  placeholder="npr. Umag, Poreč, Novigrad…"
                                  value={answers.location}
                                  onChange={(e) => setField("location", e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      goNext();
                                    }
                                  }}
                                />
                                <div className="mt-4 flex items-center gap-5">
                                  <button
                                    type="button"
                                    onClick={() => goNext()}
                                    className="btn-lift group inline-flex items-center gap-2 rounded-full bg-acqua px-6 py-2.5 text-sm font-medium tracking-wide text-notte transition-colors hover:bg-acqua-soft"
                                  >
                                    Dalje
                                    <span className="transition-transform group-hover:translate-x-1">→</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => goNext({ location: "" })}
                                    className="font-mono text-[11px] uppercase tracking-wide text-travertino/40 transition-colors hover:text-travertino"
                                  >
                                    Preskoči
                                  </button>
                                </div>
                              </div>
                            )}

                            {currentStep === 4 && (
                              <div>
                                <h3 className="font-display text-xl font-light text-travertino sm:text-2xl">
                                  Gdje da vam se javimo?
                                </h3>

                                <div className="relative mt-5">
                                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-travertino/35">
                                    {contactType === "phone" ? (
                                      <IconPhone className="h-4 w-4" />
                                    ) : (
                                      <IconMail className={`h-4 w-4 ${contactType === "email" ? "" : "opacity-50"}`} />
                                    )}
                                  </span>
                                  <input
                                    ref={autofocusContact}
                                    type="text"
                                    name="contact"
                                    inputMode={contactType === "phone" ? "tel" : "email"}
                                    autoComplete={contactType === "phone" ? "tel" : "email"}
                                    value={answers.contactValue}
                                    onChange={(e) => setField("contactValue", e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleFinalSubmit();
                                      }
                                    }}
                                    placeholder="Broj mobitela ili e-mail"
                                    className={`w-full rounded-xl border bg-notte/40 py-4 pl-11 pr-4 text-base text-travertino placeholder:text-travertino/30 transition-colors focus:outline-none sm:text-lg ${
                                      errors.contact ? "border-destructive/60 focus:border-destructive" : "border-travertino/20 focus:border-acqua"
                                    }`}
                                  />
                                </div>
                                {errors.contact && <p className="mt-2 text-[12px] text-destructive/90">{errors.contact}</p>}

                                <button
                                  type="button"
                                  onClick={handleFinalSubmit}
                                  className="btn-lift group relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-acqua px-7 py-3.5 text-sm font-medium tracking-wide text-notte transition-colors hover:bg-acqua-soft sm:w-auto"
                                >
                                  Pošaljite
                                  <span className="transition-transform group-hover:translate-x-1">→</span>
                                </button>
                                <p className="mt-3 text-[12px] text-travertino/55">
                                  Javljamo se s konkretnim prijedlogom. Bez obveze.
                                </p>
                                <p className="mt-2 text-[11px] leading-relaxed text-travertino/50">
                                  Slanjem pristajete da vas kontaktiramo u vezi upita.{" "}
                                  <a href="/pravila-privatnosti" className="underline decoration-travertino/25 underline-offset-2 transition-colors hover:text-acqua">
                                    Pravila privatnosti
                                  </a>
                                  .
                                </p>
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </MotionConfig>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
