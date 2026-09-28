"use client";

import { useEffect, useState } from "react";

interface Props {
  targetISO: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function computeTimeLeft(targetISO: string): TimeLeft {
  const diff = new Date(targetISO).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const seconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    done: false,
  };
}

const units: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

export function Countdown({ targetISO, className }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(computeTimeLeft(targetISO));
    const interval = setInterval(() => setTimeLeft(computeTimeLeft(targetISO)), 1000);
    return () => clearInterval(interval);
  }, [targetISO]);

  // Render a stable, non-flickering placeholder until hydrated so there is
  // no layout shift and no server/client mismatch.
  const display = timeLeft ?? { days: 0, hours: 0, minutes: 0, seconds: 0, done: false };

  if (timeLeft?.done) {
    return (
      <div className={className}>
        <p className="font-serif text-3xl sm:text-4xl text-ivory-100 fade-up">Today is the day.</p>
      </div>
    );
  }

  return (
    <div className={className} role="timer" aria-live="off" suppressHydrationWarning>
      <div className="flex items-start justify-center gap-4 sm:gap-8">
        {units.map((u, i) => (
          <div key={u.key} className="flex items-start">
            <div className="flex flex-col items-center min-w-[54px] sm:min-w-[76px]">
              <span
                suppressHydrationWarning
                className="font-serif text-3xl sm:text-5xl tabular-nums text-ivory-100 tracking-wide"
              >
                {String(display[u.key]).padStart(2, "0")}
              </span>
              <span className="mt-1.5 text-[0.62rem] sm:text-xs uppercase tracking-widest2 text-ivory-200/80">
                {u.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="mx-1 sm:mx-2 mt-1 font-serif text-2xl sm:text-4xl text-ivory-100/40">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
