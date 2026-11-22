"use client";

import { useState } from "react";
import { stores, type Store } from "@/data/stores";
import { useTr } from "@/lib/lang";
import { play } from "@/lib/sound";
import T from "@/components/T";

type View = "ahmedabad" | "north";
type Bounds = { minLat: number; maxLat: number; minLng: number; maxLng: number; w: number; h: number };

/* Map frames (equirectangular, aspect corrected for ~23.5°N). */
const AMD: Bounds = { minLat: 22.895, maxLat: 23.115, minLng: 72.355, maxLng: 72.7, w: 640, h: 440 };
const NORTH: Bounds = { minLat: 22.9, maxLat: 24.85, minLng: 71.5, maxLng: 72.75, w: 420, h: 620 };

const proj = (b: Bounds, lat: number, lng: number) => ({
  x: ((lng - b.minLng) / (b.maxLng - b.minLng)) * b.w,
  y: ((b.maxLat - lat) / (b.maxLat - b.minLat)) * b.h,
});
const path = (b: Bounds, pts: [number, number][]) =>
  pts.map(([lat, lng], i) => {
    const p = proj(b, lat, lng);
    return `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }).join(" ");

/* Approximate geography, drawn by hand — a sketch, not a survey. */
const SABARMATI: [number, number][] = [
  [23.12, 72.586], [23.09, 72.584], [23.06, 72.58], [23.04, 72.578], [23.02, 72.576], [23.0, 72.572], [22.975, 72.565], [22.95, 72.556], [22.92, 72.54], [22.895, 72.53],
];
const RING: [number, number][] = [
  [23.09, 72.54], [23.1, 72.58], [23.08, 72.64], [23.04, 72.67], [22.99, 72.66], [22.96, 72.62], [22.955, 72.56], [22.97, 72.5], [23.0, 72.47], [23.04, 72.47], [23.07, 72.49], [23.09, 72.54],
];
const AMD_LABELS: [string, string, number, number][] = [
  ["Bopal", "બોપલ", 23.034, 72.455],
  ["Shela", "શેલા", 22.99, 72.452],
  ["Sanand", "સાણંદ", 22.978, 72.382],
  ["Thaltej", "થલતેજ", 23.062, 72.505],
  ["Science City", "સાયન્સ સિટી", 23.094, 72.5],
  ["Prahladnagar", "પ્રહલાદનગર", 23.0, 72.524],
  ["Sola", "સોલા", 23.086, 72.525],
  ["Nikol", "નિકોલ", 23.055, 72.664],
  ["Old city", "જૂનું શહેર", 23.028, 72.59],
];
const BK_ROUTE: [number, number][] = [
  [23.03, 72.58], [23.24, 72.5], [23.59, 72.37], [24.17, 72.43], [24.26, 72.19], [24.51, 72.02], [24.6, 71.89],
];
const PATAN_ROAD: [number, number][] = [[23.59, 72.37], [23.85, 72.12]];
const THARAD_ROAD: [number, number][] = [[24.26, 72.19], [24.19, 72.0], [24.11, 71.77], [24.39, 71.63]];
const NORTH_LABELS: [string, string, number, number][] = [
  ["Ahmedabad", "અમદાવાદ", 23.03, 72.6],
  ["Kalol", "કલોલ", 23.25, 72.52],
  ["Mehsana", "મહેસાણા", 23.59, 72.39],
  ["Patan", "પાટણ", 23.85, 72.14],
  ["Palanpur", "પાલનપુર", 24.17, 72.45],
  ["Deesa", "ડીસા", 24.26, 72.21],
  ["Dhanera", "ધાનેરા", 24.51, 72.04],
  ["Tharad", "થરાદ", 24.39, 71.65],
];

export default function StoreMap({
  selectedId,
  onSelect,
  you,
}: {
  selectedId: string | null;
  onSelect: (s: Store) => void;
  you?: { lat: number; lng: number } | null;
}) {
  const tr = useTr();
  const sel = selectedId ? stores.find((s) => s.id === selectedId) : null;
  const [view, setView] = useState<View>(sel?.region === "North Gujarat" ? "north" : "ahmedabad");
  // when a shop is chosen elsewhere (list, PIN, GPS), turn to the map that shows it
  const [lastSel, setLastSel] = useState(selectedId);
  if (selectedId !== lastSel) {
    setLastSel(selectedId);
    if (sel) setView(sel.region === "North Gujarat" ? "north" : "ahmedabad");
  }
  const shown = view;
  const b = shown === "ahmedabad" ? AMD : NORTH;
  const pinned = stores.filter((s) => s.lat != null && s.lng != null && (shown === "ahmedabad" ? s.region === "Ahmedabad" : true));
  const inFrame = (lat: number, lng: number) => lat >= b.minLat && lat <= b.maxLat && lng >= b.minLng && lng <= b.maxLng;
  const counts = { ahmedabad: stores.filter((s) => s.region === "Ahmedabad").length, north: stores.filter((s) => s.region === "North Gujarat").length };

  return (
    <figure className="overflow-hidden rounded-3xl border-2 border-ink bg-milk shadow-[6px_6px_0_var(--color-ink)]">
      {/* map switch, like two ledger tabs */}
      <div className="flex border-b-2 border-ink" role="tablist" aria-label={tr("Map", "નકશો")}>
        {(["ahmedabad", "north"] as View[]).map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={shown === v}
            onClick={() => {
              play("page");
              setView(v);
            }}
            className={`flex flex-1 items-baseline justify-center gap-2 px-3 py-3 text-sm font-semibold transition-colors ${shown === v ? "cloth text-milk" : "bg-paper-2/60 text-ink hover:bg-paper-2"}`}
          >
            {v === "ahmedabad" ? <T en="Ahmedabad" gu="અમદાવાદ" /> : <T en="North Gujarat" gu="ઉત્તર ગુજરાત" />}
            <span className={`font-mono text-xs ${shown === v ? "text-haldi" : "text-ink-2"}`}>{counts[v]}</span>
          </button>
        ))}
      </div>

      <div className="ledger relative">
        <svg viewBox={`0 0 ${b.w} ${b.h}`} className="block h-auto w-full" role="group" aria-label={shown === "ahmedabad" ? tr("Map of our Ahmedabad shops", "અમદાવાદની દુકાનોનો નકશો") : tr("Map of our North Gujarat shops", "ઉત્તર ગુજરાતની દુકાનોનો નકશો")}>
          {shown === "ahmedabad" ? (
            <>
              <path d={path(b, RING)} fill="none" stroke="var(--color-ink)" strokeOpacity=".28" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
              <text {...proj(b, 23.1, 72.6)} fontFamily="var(--font-caveat)" fontSize="20" fill="var(--color-ink-2)">
                SP Ring Road
              </text>
              <path d={path(b, SABARMATI)} fill="none" stroke="#7fb3d9" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity=".7" />
              <text {...proj(b, 22.935, 72.556)} fontFamily="var(--font-caveat)" fontSize="20" fill="#3d7fae" transform={`rotate(-62 ${proj(b, 22.935, 72.556).x} ${proj(b, 22.935, 72.556).y})`}>
                Sabarmati
              </text>
              {AMD_LABELS.map(([en, gu, lat, lng]) => {
                const p = proj(b, lat, lng);
                return (
                  <text key={en} x={p.x} y={p.y} textAnchor="middle" fontSize="15" fontWeight="600" fill="var(--color-ink)" opacity=".45" fontFamily="var(--font-instrument)" letterSpacing="2">
                    {tr(en.toUpperCase(), gu)}
                  </text>
                );
              })}
            </>
          ) : (
            <>
              <path d={path(b, BK_ROUTE)} fill="none" stroke="var(--color-haldi)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d={path(b, PATAN_ROAD)} fill="none" stroke="var(--color-haldi)" strokeWidth="4" strokeLinecap="round" />
              <path d={path(b, THARAD_ROAD)} fill="none" stroke="var(--color-haldi)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <text {...proj(b, 23.95, 72.5)} fontFamily="var(--font-caveat)" fontSize="22" fill="var(--color-ink-2)" transform={`rotate(-80 ${proj(b, 23.95, 72.5).x} ${proj(b, 23.95, 72.5).y})`}>
                {tr("the B.K. route", "બી.કે. રૂટ")}
              </text>
              <text {...proj(b, 24.8, 71.62)} fontSize="14" fontWeight="600" letterSpacing="3" fill="var(--color-ink)" opacity=".35" fontFamily="var(--font-instrument)">
                {tr("RAJASTHAN ↑", "રાજસ્થાન ↑")}
              </text>
              {NORTH_LABELS.map(([en, gu, lat, lng]) => {
                const p = proj(b, lat, lng);
                return (
                  <text key={en} x={p.x + 12} y={p.y + 5} fontSize="16" fontWeight="600" fill="var(--color-ink)" opacity=".55" fontFamily="var(--font-instrument)">
                    {tr(en, gu)}
                  </text>
                );
              })}
            </>
          )}

          {/* compass */}
          <g transform={`translate(${b.w - 34} 36)`} opacity=".6" aria-hidden>
            <circle r="18" fill="var(--color-milk)" stroke="var(--color-ink)" strokeWidth="1.5" />
            <path d="M0 -14 L5 0 L0 14 L-5 0 Z" fill="var(--color-chopda)" />
            <text y="-20" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-ink)">
              N
            </text>
          </g>

          {/* you are here */}
          {you && inFrame(you.lat, you.lng) && (
            <g transform={`translate(${proj(b, you.lat, you.lng).x} ${proj(b, you.lat, you.lng).y})`} aria-label={tr("You are here", "તમે અહીં છો")}>
              <circle r="18" fill="#1b98d5" opacity=".18" className="you-pulse" />
              <circle r="7" fill="#1b98d5" stroke="white" strokeWidth="3" />
            </g>
          )}

          {/* shop pins */}
          {pinned.map((s) => {
            const p = proj(b, s.lat!, s.lng!);
            const on = s.id === selectedId;
            return (
              <g
                key={s.id}
                transform={`translate(${p.x} ${p.y})`}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={s.name}
                aria-pressed={on}
                onClick={() => {
                  play("tick");
                  onSelect(s);
                }}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(s))}
              >
                <title>{s.name}</title>
                <circle r="16" fill="transparent" />
                <g style={{ transform: `scale(${on ? 1.5 : 1})`, transition: "transform .25s cubic-bezier(.3,1.6,.4,1)" }}>
                  <path d="M0 0 C -7 -9 -9 -13 -9 -17 a9 9 0 0 1 18 0 c0 4 -2 8 -9 17 Z" fill={on ? "var(--color-chopda)" : "var(--color-milk)"} stroke="var(--color-chopda)" strokeWidth="2.5" />
                  <circle cy="-17" r="3.5" fill={on ? "var(--color-milk)" : "var(--color-chopda)"} />
                </g>
              </g>
            );
          })}

          {/* selected label, drawn last so it sits on top */}
          {sel && sel.lat != null && inFrame(sel.lat, sel.lng!) && (() => {
            const p = proj(b, sel.lat!, sel.lng!);
            const left = p.x > b.w * 0.62;
            return (
              <g transform={`translate(${p.x} ${p.y - 34})`} pointerEvents="none">
                <rect x={left ? -12 - sel.name.length * 8.6 : 12} y="-16" width={sel.name.length * 8.6 + 18} height="28" rx="6" fill="var(--color-ink)" />
                <text x={left ? -3 - sel.name.length * 8.6 : 21} y="3" fontSize="15" fontWeight="600" fill="var(--color-milk)" fontFamily="var(--font-instrument)">
                  {sel.name}
                </text>
              </g>
            );
          })()}
        </svg>
        <figcaption className="pointer-events-none absolute bottom-2 left-3 font-hand text-lg text-ink-2">
          <T en="tap a pin to pick a shop" gu={<span className="text-sm">દુકાન પસંદ કરવા પિન દબાવો</span>} />
        </figcaption>
      </div>
    </figure>
  );
}
