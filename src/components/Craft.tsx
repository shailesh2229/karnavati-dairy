"use client";

import { useEffect, useRef, useState } from "react";
import { play } from "@/lib/sound";
import { useTr } from "@/lib/lang";
import T from "@/components/T";

/**
 * "Make it yourself" — a tiny hands-on moment inside each product's making-of.
 *  churn: drag around the pot (or tap the button) to churn — butter rises.
 *  press: hold to press the paneer — whey drips out.
 *  set:   hold to keep the dahi warm — it firms and stops wobbling.
 */
export type CraftKind = "churn" | "press" | "set";

export const craftFor: Record<string, { kind: CraftKind; en: [string, string]; gu: [string, string] }> = {
  butter: { kind: "churn", en: ["Churn the cream", "Makkhan! Butter separates from the buttermilk."], gu: ["મલાઈ વલોવો", "માખણ! છાશથી માખણ છૂટું પડ્યું."] },
  ghee: { kind: "churn", en: ["Churn the curd (bilona)", "Makkhan! Now it’s slowly heated into ghee."], gu: ["દહીં વલોવો (બિલોના)", "માખણ! હવે ધીમા તાપે ઘી બનશે."] },
  buttermilk: { kind: "churn", en: ["Churn the dahi", "Chaas! Light, tangy and cooling."], gu: ["દહીં વલોવો", "છાશ તૈયાર! હળવી, ખાટી, ઠંડી."] },
  lassi: { kind: "churn", en: ["Churn slowly", "Thick lassi, ready for the glass."], gu: ["ધીમેથી વલોવો", "જાડી લસ્સી, ગ્લાસ માટે તૈયાર."] },
  "ice-cream": { kind: "churn", en: ["Churn it cold", "Less air, more cream. Scoop time."], gu: ["ઠંડું વલોવો", "ઓછી હવા, વધુ ક્રીમ. સ્કૂપનો સમય."] },
  paneer: { kind: "press", en: ["Press the paneer", "Firm, soft paneer — not too hard, not too soft."], gu: ["પનીર દબાવો", "મજબૂત, નરમ પનીર — ન વધુ કઠણ, ન વધુ નરમ."] },
  dahi: { kind: "set", en: ["Keep it warm while it sets", "Set! Thick enough to hold a spoon."], gu: ["જામે ત્યાં સુધી ગરમ રાખો", "જામી ગયું! ચમચી ઊભી રહે એટલું જાડું."] },
};

export default function Craft({ slug }: { slug: string }) {
  const c = craftFor[slug];
  const tr = useTr();
  const [p, setP] = useState(0); // 0..1
  const [pressing, setPressing] = useState(false);
  const done = p >= 1;
  const prevAngle = useRef<number | null>(null);
  const hold = useRef<number | null>(null);
  const potRef = useRef<HTMLDivElement>(null);

  const pRef = useRef(0);
  const bump = (d: number) => {
    const v = pRef.current;
    const n = Math.min(1, v + d);
    pRef.current = n;
    if (n >= 1 && v < 1) play("bell");
    setP(n);
  };
  const reset = () => {
    pRef.current = 0;
    setP(0);
  };

  // churn: accumulate angle while dragging around the centre (4 turns)
  const onPointerMove = (e: React.PointerEvent) => {
    if (c.kind !== "churn" || e.buttons === 0 && e.pointerType === "mouse") return;
    const r = potRef.current!.getBoundingClientRect();
    const ang = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
    if (prevAngle.current != null) {
      let d = ang - prevAngle.current;
      if (d > Math.PI) d -= 2 * Math.PI;
      if (d < -Math.PI) d += 2 * Math.PI;
      const turn = Math.abs(d) / (2 * Math.PI);
      if (turn < 0.25) {
        bump(turn / 4);
        if (Math.random() < turn * 6) play("slosh");
      }
    }
    prevAngle.current = ang;
  };

  // press / set: hold to progress (2.5 s)
  const startHold = () => {
    if (hold.current) return;
    setPressing(true);
    const t0 = performance.now();
    let lastT = t0;
    const tick = (t: number) => {
      bump((t - lastT) / 2500);
      lastT = t;
      if (pRef.current >= 1) {
        hold.current = null;
        setPressing(false);
        return;
      }
      hold.current = requestAnimationFrame(tick);
    };
    hold.current = requestAnimationFrame(tick);
  };
  const stopHold = () => {
    if (hold.current) cancelAnimationFrame(hold.current);
    hold.current = null;
    setPressing(false);
  };
  useEffect(
    () => () => {
      if (hold.current) cancelAnimationFrame(hold.current);
    },
    [],
  );

  if (!c) return null;
  const [labelEn, doneEn] = c.en;
  const [labelGu, doneGu] = c.gu;

  return (
    <div className="mt-5 rounded-2xl border-2 border-dashed border-ink/30 bg-paper/60 p-4">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-chopda">
        <T en="Try it yourself" gu="જાતે અજમાવો" />
      </p>
      <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        <div
          ref={potRef}
          onPointerDown={(e) => {
            prevAngle.current = null;
            if (c.kind !== "churn") startHold();
            (e.target as Element).setPointerCapture?.(e.pointerId);
          }}
          onPointerMove={onPointerMove}
          onPointerUp={() => {
            prevAngle.current = null;
            stopHold();
          }}
          onPointerCancel={stopHold}
          onPointerLeave={c.kind === "churn" ? undefined : stopHold}
          className="relative size-44 shrink-0 touch-none select-none"
          role="img"
          aria-label={tr(labelEn, labelGu)}
        >
          {c.kind === "churn" && <Churn p={p} />}
          {c.kind === "press" && <Press p={p} pressing={pressing && !done} />}
          {c.kind === "set" && <SetBowl p={p} />}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="font-display text-xl">
            {done ? <T en={doneEn} gu={doneGu} /> : <T en={labelEn} gu={labelGu} />}
          </p>
          <p className="mt-1 text-sm text-ink-2">
            {done ? null : c.kind === "churn" ? (
              <T en="Drag around the pot in circles." gu="માટલાની આસપાસ ગોળ ગોળ ફેરવો." />
            ) : (
              <T en="Press and hold." gu="દબાવી રાખો." />
            )}
          </p>
          <div className="mx-auto mt-3 h-2 w-48 overflow-hidden rounded-full bg-ink/10 sm:mx-0" aria-hidden>
            <div className={`h-full ${done ? "bg-leaf" : "bg-haldi"}`} style={{ width: `${p * 100}%` }} />
          </div>
          <div className="mt-3 flex justify-center gap-2 sm:justify-start">
            {!done && c.kind === "churn" && (
              <button type="button" onClick={() => bump(1 / 8)} className="rounded-full border-2 border-ink px-3 py-1 text-sm font-semibold">
                <T en="Churn once" gu="એક વાર વલોવો" />
              </button>
            )}
            {!done && c.kind !== "churn" && (
              <button
                type="button"
                onPointerDown={startHold}
                onPointerUp={stopHold}
                onPointerLeave={stopHold}
                onKeyDown={(e) => (e.key === " " || e.key === "Enter") && bump(0.2)}
                className="touch-none rounded-full border-2 border-ink px-3 py-1 text-sm font-semibold"
              >
                <T en="Hold" gu="દબાવો" />
              </button>
            )}
            {done && (
              <button type="button" onClick={reset} className="text-sm font-semibold text-chopda underline">
                <T en="Again" gu="ફરીથી" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** A clay matla with a wooden valonu; butter lumps rise as you churn. */
function Churn({ p }: { p: number }) {
  const lumps = Math.floor(p * 7);
  return (
    <svg viewBox="0 0 160 160" className="size-full">
      <ellipse cx="80" cy="150" rx="52" ry="6" fill="rgb(0 0 0 / .12)" />
      <path d="M30 60 Q24 140 80 148 Q136 140 130 60 Z" fill="#b5652f" stroke="#1c2236" strokeWidth="3" />
      <ellipse cx="80" cy="60" rx="50" ry="13" fill="#fffaf0" stroke="#1c2236" strokeWidth="3" />
      {/* swirl */}
      <g style={{ transform: `rotate(${p * 1440}deg)`, transformOrigin: "80px 60px", transition: "transform .15s linear" }}>
        <path d="M58 60 q22 -10 44 0" stroke="#d9c9a6" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M66 64 q14 6 28 0" stroke="#e8dcc0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
      {Array.from({ length: lumps }, (_, i) => (
        <ellipse key={i} className="float-up" cx={56 + ((i * 37) % 48)} cy={56 + ((i * 13) % 9)} rx={5 + (i % 3)} ry="3.5" fill="#f6dc7a" stroke="#c9a53a" strokeWidth="1" />
      ))}
      {/* valonu stick */}
      <g style={{ transform: `rotate(${Math.sin(p * 40) * 6}deg)`, transformOrigin: "80px 60px" }}>
        <rect x="76" y="6" width="8" height="64" rx="3" fill="#8a5a2b" stroke="#1c2236" strokeWidth="2" />
        <path d="M66 70 h28" stroke="#8a5a2b" strokeWidth="6" strokeLinecap="round" />
      </g>
      <path d="M30 92 Q80 104 130 92" stroke="#1c2236" strokeOpacity=".25" strokeWidth="2" fill="none" />
    </svg>
  );
}

/** A cloth bundle under a press; whey drips while held. */
function Press({ p, pressing }: { p: number; pressing: boolean }) {
  const squash = 1 - p * 0.42;
  return (
    <svg viewBox="0 0 160 160" className="size-full">
      <rect x="20" y="132" width="120" height="10" rx="3" fill="#8a5a2b" stroke="#1c2236" strokeWidth="2" />
      <g style={{ transform: `translateY(${(1 - squash) * 52}px)`, transition: "transform .1s" }}>
        <rect x="30" y="14" width="100" height="16" rx="4" fill="#9aa3ad" stroke="#1c2236" strokeWidth="2" />
        <rect x="74" y="2" width="12" height="14" fill="#9aa3ad" stroke="#1c2236" strokeWidth="2" />
      </g>
      <g style={{ transform: `scaleY(${squash})`, transformOrigin: "80px 132px", transition: "transform .1s" }}>
        <path d="M36 132 Q30 70 80 64 Q130 70 124 132 Z" fill={p >= 1 ? "#fffdf6" : "#f4efe2"} stroke="#1c2236" strokeWidth="2.5" />
        <path d="M50 120 l60 -40 M56 84 l50 40" stroke="#1c2236" strokeOpacity=".15" strokeWidth="2" />
      </g>
      {pressing && p < 1 && (
        <g fill="#cfe3c4">
          <circle className="drip" cx="44" cy="134" r="3" />
          <circle className="drip" cx="116" cy="134" r="3" style={{ animationDelay: ".3s" }} />
          <circle className="drip" cx="80" cy="140" r="2.5" style={{ animationDelay: ".6s" }} />
        </g>
      )}
    </svg>
  );
}

/** A bowl of curd that wobbles less as it sets. */
function SetBowl({ p }: { p: number }) {
  const wobble = (1 - p) * 6;
  return (
    <svg viewBox="0 0 160 160" className="size-full">
      <path d="M22 70 Q28 140 80 144 Q132 140 138 70 Z" fill="#e8e2d4" stroke="#1c2236" strokeWidth="3" />
      <g className={p < 1 ? "slosh" : ""} style={{ animationDuration: `${0.6 + p}s` }}>
        <path d={`M28 74 Q54 ${74 - wobble} 80 74 T132 74 L132 80 Q80 ${92 + p * 4} 28 80 Z`} fill={`rgb(255 ${250 - p * 6} ${236 - p * 16})`} />
      </g>
      <ellipse cx="80" cy="72" rx="56" ry="10" fill="none" stroke="#1c2236" strokeWidth="3" />
      {p >= 1 && <rect x="77" y="20" width="6" height="56" rx="3" fill="#9aa3ad" stroke="#1c2236" strokeWidth="1.5" transform="rotate(8 80 70)" />}
      {/* warmth */}
      <g opacity={p < 1 ? 0.7 : 0} stroke="#e3a21a" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M60 40 q-6 -8 0 -16" />
        <path d="M80 36 q-6 -8 0 -16" />
        <path d="M100 40 q-6 -8 0 -16" />
      </g>
    </svg>
  );
}
