import { Reveal } from "@/components/Reveal";

export interface TimelineItem {
  time: string;
  title: string;
  location?: string;
  isTransition?: boolean;
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative mx-auto max-w-xl">
      <div aria-hidden className="absolute left-[27px] sm:left-[35px] top-2 bottom-2 w-px bg-gold-500/30" />
      {items.map((item, i) => (
        <Reveal as="li" key={i} delayMs={i * 90} className="relative pl-16 sm:pl-20 pb-12 last:pb-0">
          <span
            aria-hidden
            className={
              item.isTransition
                ? "absolute left-[22px] sm:left-[30px] top-1.5 h-2.5 w-2.5 rounded-full bg-ivory-300 border border-gold-500/50"
                : "absolute left-[19px] sm:left-[27px] top-0.5 h-4 w-4 rounded-full bg-wine-600 ring-4 ring-ivory-100"
            }
          />
          {item.isTransition ? (
            <p className="italic text-ink-500 text-sm pt-0.5">{item.title}</p>
          ) : (
            <>
              <p className="font-serif text-xl sm:text-2xl text-wine-600">{item.time}</p>
              <p className="mt-1 font-serif text-lg sm:text-xl text-ink-900">{item.title}</p>
              {item.location && <p className="mt-0.5 text-sm text-ink-500">{item.location}</p>}
            </>
          )}
        </Reveal>
      ))}
    </ol>
  );
}
