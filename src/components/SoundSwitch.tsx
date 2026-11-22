"use client";

import { setSound, useSoundOn } from "@/lib/sound";
import { useTr } from "@/lib/lang";

/** Sounds are off unless the visitor turns them on. */
export default function SoundSwitch() {
  const on = useSoundOn();
  const tr = useTr();
  return (
    <button
      type="button"
      onClick={() => setSound(!on)}
      aria-pressed={on}
      aria-label={on ? tr("Turn sounds off", "અવાજ બંધ કરો") : tr("Turn sounds on", "અવાજ ચાલુ કરો")}
      title={on ? tr("Sounds on", "અવાજ ચાલુ") : tr("Sounds off", "અવાજ બંધ")}
      className={`grid size-9 place-items-center rounded-full border border-milk/40 transition-colors ${on ? "bg-milk text-chopda" : "bg-chopda-dark/40 text-milk/85 hover:text-milk"}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {/* a small temple bell */}
        <path d="M12 3v2" />
        <path d="M6 17c0-6 1.5-10 6-10s6 4 6 10H6Z" />
        <path d="M4 17h16" />
        <path d="M11 20a1.5 1.5 0 0 0 2 0" />
        {!on && <path d="M3 3l18 18" />}
      </svg>
    </button>
  );
}
