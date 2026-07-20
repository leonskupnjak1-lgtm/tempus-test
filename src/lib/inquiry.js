// Tiny decoupled bridge between "Zatražite ponudu" CTAs (Pool Technologies,
// Projects) and the Contact form — a window CustomEvent instead of prop
// drilling or context, since the two live in unrelated sections of the page.

export const INQUIRY_EVENT = "tempus:inquiry";

export const INQUIRY_TYPES = [
  { value: "beton", label: "Betonski bazen" },
  { value: "liner", label: "Liner bazen" },
  { value: "inox", label: "INOX bazen" },
  { value: "poliester", label: "Poliesterski bazen" },
  { value: "stiropor", label: "Stiropor bazen" },
  { value: "montazni", label: "Montažni bazen" },
  { value: "servis", label: "Servis" },
  { value: "odrzavanje", label: "Održavanje" },
  { value: "ostalo", label: "Ostalo" },
];

export function inquiryLabel(value) {
  return INQUIRY_TYPES.find((t) => t.value === value)?.label ?? "";
}

export function requestInquiry(type) {
  window.dispatchEvent(new CustomEvent(INQUIRY_EVENT, { detail: { type } }));
  document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
