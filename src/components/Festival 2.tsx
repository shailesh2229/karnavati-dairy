"use client";

import Link from "next/link";
import { useState } from "react";
import { useFestival, type FestivalId } from "@/lib/festivals";
import T from "@/components/T";

/** A greeting strip under the cover during a festival. Dismissable for the visit. */
export function FestivalBanner() {
  const f = useFestival();
  const [hidden, setHidden] = useState(false);
  if (!f || hidden) return null;
  return (
    <div className="relative overflow-hidden text-white" style={{ background: f.tint }} role="region" aria-label="Festival">
      <FestivalStrip id={f.id} />
      <div className="relative mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <p className="flex-1 text-sm font-semibold sm:text-base">
          <T en={f.en} gu={f.gu} />
        </p>
        <Link href={f.cta.href} className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-semibold" style={{ color: f.tint }}>
          <T en={f.cta.en} gu={f.cta.gu} /> →
        </Link>
        <button type="button" onClick={() => setHidden(true)} aria-label="Close" className="shrink-0 px-1 text-lg leading-none text-white/80 hover:text-white">
          ×
        </button>
      </div>
    </div>
  );
}

/** Small repeating motif behind the banner text. */
function FestivalStrip({ id }: { id: FestivalId }) {
  const motif: Record<FestivalId, string> = {
    uttarayan: "◆",
    holi: "●",
    janmashtami: "❋",
    navratri: "✺",
    diwali: "✦",
  };
  return (
    <p aria-hidden className="drift pointer-events-none absolute inset-y-0 left-0 flex w-max items-center gap-6 whitespace-nowrap text-lg text-white/15">
      {Array.from({ length: 60 }, (_, i) => (
        <span key={i}>{motif[id]}</span>
      ))}
    </p>
  );
}

/** Decorations layered over the home hero. */
export function FestivalDecor() {
  const f = useFestival();
  if (!f) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {f.id === "uttarayan" && <Kites />}
      {f.id === "diwali" && <Diyas />}
      {f.id === "janmashtami" && <Matki />}
      {f.id === "navratri" && <Garba />}
      {f.id === "holi" && <Gulal />}
    </div>
  );
}

function Kites() {
  const kites = [
    { c: "#e1251b", t: "8%", d: "0s", s: 1 },
    { c: "#1b98d5", t: "18%", d: "-6s", s: 0.7 },
    { c: "#e3a21a", t: "4%", d: "-12s", s: 0.85 },
  ];
  return (
    <>
      {kites.map((k, i) => (
        <svg key={i} viewBox="0 0 60 120" className="kite absolute" style={{ top: k.t, animationDelay: k.d, width: `${4 * k.s}rem` }}>
          <path d="M30 2 L56 30 L30 62 L4 30 Z" fill={k.c} stroke="#1c2236" strokeWidth="1.5" />
          <path d="M30 2 V62 M4 30 H56" stroke="#1c2236" strokeOpacity=".4" />
          <path d="M30 62 q-8 14 2 26 t-4 30" stroke="#1c2236" strokeOpacity=".5" fill="none" />
        </svg>
      ))}
    </>
  );
}

function Diyas() {
  return (
    <div className="absolute inset-x-0 bottom-3 flex justify-around px-4">
      {Array.from({ length: 7 }, (_, i) => (
        <svg key={i} viewBox="0 0 40 40" className="w-9 sm:w-12">
          <path className="flame" style={{ animationDelay: `${i * 0.17}s` }} d="M20 4 C26 12 24 20 20 22 C16 20 14 12 20 4 Z" fill="#ffb627" />
          <path d="M4 24 Q20 40 36 24 Z" fill="#b5652f" stroke="#1c2236" strokeWidth="1.5" />
        </svg>
      ))}
    </div>
  );
}

function Matki() {
  return (
    <svg viewBox="0 0 80 160" className="swing absolute right-[12%] top-0 w-16 sm:w-24">
      <path d="M40 0 V50" stroke="#1c2236" strokeWidth="2" />
      <path d="M18 70 Q14 120 40 128 Q66 120 62 70 Q58 52 40 52 Q22 52 18 70 Z" fill="#b5652f" stroke="#1c2236" strokeWidth="2" />
      <path d="M20 84 H60" stroke="#e3a21a" strokeWidth="4" />
      <ellipse cx="40" cy="54" rx="16" ry="5" fill="#fffaf0" stroke="#1c2236" strokeWidth="1.5" />
    </svg>
  );
}

function Garba() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          className="garba absolute size-3 rounded-full"
          style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 70}%`, background: ["#d2462a", "#e3a21a", "#2f6b3a", "#1b98d5"][i % 4], animationDelay: `${(i % 6) * 0.3}s` }}
        />
      ))}
    </div>
  );
}

function Gulal() {
  return (
    <>
      <span className="absolute -left-16 -top-16 size-64 rounded-full bg-[#c2186b]/25 blur-2xl" />
      <span className="absolute -right-20 top-1/3 size-72 rounded-full bg-[#e3a21a]/30 blur-2xl" />
      <span className="absolute bottom-0 left-1/3 size-56 rounded-full bg-[#2f6b3a]/20 blur-2xl" />
    </>
  );
}
