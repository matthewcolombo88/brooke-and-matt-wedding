import type { ReactNode } from "react";

interface FaqItemProps {
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

/**
 * A single accordion row. Uses the native <details>/<summary> element so it
 * works with zero client-side JavaScript — progressively enhanced, keyboard
 * and screen-reader friendly out of the box.
 */
export function FaqItem({ question, children, defaultOpen }: FaqItemProps) {
  return (
    <details className="faq-item group" open={defaultOpen}>
      <summary>
        <span className="font-serif text-lg sm:text-xl text-ink-900">{question}</span>
        <ChevronIcon />
      </summary>
      <div className="faq-answer">{children}</div>
    </details>
  );
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="faq-chevron"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
