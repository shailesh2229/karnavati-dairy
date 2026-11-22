"use client";

import { useSyncExternalStore } from "react";

export type FestivalId = "uttarayan" | "holi" | "janmashtami" | "navratri" | "diwali";

export type Festival = {
  id: FestivalId;
  en: string;
  gu: string;
  cta: { en: string; gu: string; href: string };
  tint: string; // banner colour
};

export const festivals: Record<FestivalId, Festival> = {
  uttarayan: {
    id: "uttarayan",
    en: "Happy Uttarayan! Kites up, undhiyu on. Fresh chaas and ghee for the terrace.",
    gu: "ઉત્તરાયણની શુભેચ્છા! પતંગ ઉપર, ઊંધિયું તૈયાર. ધાબા માટે તાજી છાશ અને ઘી.",
    cta: { en: "Terrace order", gu: "ધાબાનો ઓર્ડર", href: "/products#buttermilk" },
    tint: "#1b98d5",
  },
  holi: {
    id: "holi",
    en: "Happy Holi! Thandai starts with full-cream milk.",
    gu: "હોળીની શુભેચ્છા! ઠંડાઈ ફુલ-ક્રીમ દૂધથી બને.",
    cta: { en: "Gold milk", gu: "ગોલ્ડ દૂધ", href: "/products#milk" },
    tint: "#c2186b",
  },
  janmashtami: {
    id: "janmashtami",
    en: "Jai Shri Krishna! Fresh makhan for the matki.",
    gu: "જય શ્રી કૃષ્ણ! મટકી માટે તાજું માખણ.",
    cta: { en: "Makhan & dahi", gu: "માખણ અને દહીં", href: "/products#butter" },
    tint: "#1f4fa3",
  },
  navratri: {
    id: "navratri",
    en: "Nine nights of garba need energy. Lassi after the last round?",
    gu: "ગરબાની નવ રાત માટે શક્તિ જોઈએ. છેલ્લા રાઉન્ડ પછી લસ્સી?",
    cta: { en: "Lassi", gu: "લસ્સી", href: "/products#lassi" },
    tint: "#d2462a",
  },
  diwali: {
    id: "diwali",
    en: "Shubh Deepavali. A new chopdo opens — sweet boxes for every visit.",
    gu: "શુભ દીપાવલી. નવો ચોપડો ખૂલે છે — દરેક મુલાકાત માટે મીઠાઈના બોક્સ.",
    cta: { en: "Sweet boxes", gu: "મીઠાઈના બોક્સ", href: "/products#sweets" },
    tint: "#b8860b",
  },
};

/**
 * When each theme shows (inclusive, local dates).
 * ⚠️ Lunar festival dates for 2027 are approximate — confirm against a panchang before relying on them.
 */
const windows: [FestivalId, string, string][] = [
  ["holi", "2026-03-01", "2026-03-05"],
  ["janmashtami", "2026-09-02", "2026-09-05"],
  ["navratri", "2026-10-10", "2026-10-20"],
  ["diwali", "2026-11-04", "2026-11-12"],
  ["uttarayan", "2027-01-10", "2027-01-15"],
  ["holi", "2027-03-19", "2027-03-23"],
  ["janmashtami", "2027-08-23", "2027-08-26"],
  ["navratri", "2027-09-29", "2027-10-09"],
  ["diwali", "2027-10-25", "2027-11-02"],
];

function current(): FestivalId | null {
  const q = new URLSearchParams(window.location.search).get("festival");
  if (q && q in festivals) return q as FestivalId;
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return windows.find(([, from, to]) => today >= from && today <= to)?.[0] ?? null;
}

let cached: FestivalId | null | undefined;
export function useFestival(): Festival | null {
  const id = useSyncExternalStore(
    () => () => {},
    () => (cached === undefined ? (cached = current()) : cached),
    () => null,
  );
  return id ? festivals[id] : null;
}
