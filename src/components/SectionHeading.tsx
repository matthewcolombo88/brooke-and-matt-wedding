import clsx from "clsx";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
  className?: string;
}

export function SectionHeading({ eyebrow, title, subtitle, align = "center", light, className }: Props) {
  return (
    <div className={clsx(align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow && (
        <p className={clsx("eyebrow mb-4", light && "!text-ivory-200/80")}>{eyebrow}</p>
      )}
      <h2
        className={clsx(
          "font-serif text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.15] text-balance",
          light ? "text-ivory-100" : "text-ink-900"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={clsx(
            "mt-5 font-sans text-[0.95rem] sm:text-base leading-relaxed text-balance",
            align === "center" && "mx-auto max-w-xl",
            light ? "text-ivory-200/85" : "text-ink-500"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
