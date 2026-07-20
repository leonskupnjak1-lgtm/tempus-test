import { motion } from "motion/react";
import useInView from "./useInView";

const EASE = [0.16, 1, 0.3, 1];

export default function SplitHeading({
  lines,
  as: Tag = "h2",
  className = "",
  lineClassName = "",
  stagger = 0.09,
  delay = 0,
}) {
  const [ref, inView] = useInView();

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => {
        const text = typeof line === "string" ? line : line.text;
        const extra = typeof line === "string" ? "" : line.className || "";
        return (
          <span key={i} className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className={`block ${lineClassName} ${extra}`}
              initial={{ y: "112%" }}
              animate={inView ? { y: "0%" } : {}}
              transition={{ duration: 0.95, delay: delay + i * stagger, ease: EASE }}
            >
              {text}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
