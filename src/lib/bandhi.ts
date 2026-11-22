"use client";

import { useSyncExternalStore } from "react";
import { skuById } from "@/data/catalogue";
import type { Lines } from "@/lib/cart";

/**
 * "Bandhi" (બાંધી): the Gujarati word for a fixed, regular order with your dairy.
 * One saved regular order per device, plus the shop it usually goes to.
 */
export type Freq = "daily" | "weekly" | "fortnightly" | "monthly";
export type Bandhi = { lines: Lines; freq: Freq; storeId: string | null; savedAt: number };

export const freqLabel: Record<Freq, { en: string; gu: string }> = {
  daily: { en: "Every day", gu: "રોજ" },
  weekly: { en: "Every week", gu: "દર અઠવાડિયે" },
  fortnightly: { en: "Every 15 days", gu: "દર 15 દિવસે" },
  monthly: { en: "Every month", gu: "દર મહિને" },
};

const KEY = "kd-bandhi-v1";
const STORE_KEY = "kd-last-store";
let cache: Bandhi | null | undefined;
let lastStore: string | null | undefined;
const subs = new Set<() => void>();

function read(): Bandhi | null {
  if (cache !== undefined) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const b = raw ? (JSON.parse(raw) as Bandhi) : null;
    if (b) b.lines = Object.fromEntries(Object.entries(b.lines).filter(([id, q]) => skuById.has(id) && q > 0));
    cache = b && Object.keys(b.lines).length ? b : null;
  } catch {
    cache = null;
  }
  return cache;
}

function write(b: Bandhi | null) {
  cache = b;
  try {
    if (b) localStorage.setItem(KEY, JSON.stringify(b));
    else localStorage.removeItem(KEY);
  } catch {}
  subs.forEach((s) => s());
}

function subscribe(cb: () => void) {
  subs.add(cb);
  return () => subs.delete(cb);
}

export function useBandhi(): Bandhi | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

export const bandhi = {
  save(lines: Lines, freq: Freq, storeId: string | null) {
    write({ lines: { ...lines }, freq, storeId: storeId ?? read()?.storeId ?? getLastStore(), savedAt: Date.now() });
  },
  setStore(storeId: string) {
    const b = read();
    if (b) write({ ...b, storeId });
  },
  remove() {
    write(null);
  },
};

export function sameLines(a: Lines, b: Lines) {
  const ka = Object.keys(a);
  return ka.length === Object.keys(b).length && ka.every((k) => a[k] === b[k]);
}

export function getLastStore(): string | null {
  if (lastStore !== undefined) return lastStore;
  try {
    lastStore = localStorage.getItem(STORE_KEY);
  } catch {
    lastStore = null;
  }
  return lastStore;
}
export function setLastStore(id: string) {
  lastStore = id;
  try {
    localStorage.setItem(STORE_KEY, id);
  } catch {}
}
