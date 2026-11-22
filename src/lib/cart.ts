"use client";

import { useSyncExternalStore } from "react";
import { skuById, type Sku } from "@/data/catalogue";

import { FREE_DELIVERY_AT, NUDGE_FROM } from "@/lib/money";
export { ADVANCE, FREE_DELIVERY_AT, NUDGE_FROM, inr, rs } from "@/lib/money";

export type Lines = Record<string, number>; // skuId -> qty
const KEY = "kd-hisaab-v1";
const MAX_QTY = 99;

let lines: Lines = {};
let hydrated = false;
const listeners = new Set<() => void>();

function load() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Lines;
      // drop anything no longer in the catalogue or with a bad qty
      lines = Object.fromEntries(
        Object.entries(parsed).filter(([id, q]) => skuById.has(id) && Number.isInteger(q) && q > 0).map(([id, q]) => [id, Math.min(q, MAX_QTY)]),
      );
    }
  } catch {
    lines = {};
  }
}

function emit() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* storage unavailable: cart still works for this visit */
  }
  listeners.forEach((l) => l());
}

export const cart = {
  setQty(id: string, qty: number) {
    load();
    const q = Math.max(0, Math.min(MAX_QTY, Math.round(qty)));
    const next = { ...lines };
    if (q === 0) delete next[id];
    else next[id] = q;
    lines = next;
    emit();
  },
  add(id: string, by = 1) {
    load();
    cart.setQty(id, (lines[id] ?? 0) + by);
  },
  remove(id: string) {
    cart.setQty(id, 0);
  },
  clear() {
    lines = {};
    emit();
  },
};

function subscribe(l: () => void) {
  load();
  listeners.add(l);
  // first subscription after hydration: notify so persisted cart appears
  queueMicrotask(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    hydrated = false;
    load();
    listeners.forEach((x) => x());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

const EMPTY: Lines = {};
export function useLines(): Lines {
  return useSyncExternalStore(
    subscribe,
    () => lines,
    () => EMPTY,
  );
}

export type Line = { sku: Sku; qty: number; total: number };

export function summarise(l: Lines) {
  const items: Line[] = Object.entries(l)
    .map(([id, qty]) => {
      const sku = skuById.get(id)!;
      return { sku, qty, total: sku.price * qty };
    })
    .filter((x) => x.sku);
  const total = items.reduce((s, x) => s + x.total, 0);
  const count = items.reduce((s, x) => s + x.qty, 0);
  const free = total >= FREE_DELIVERY_AT;
  const gap = Math.max(0, FREE_DELIVERY_AT - total);
  const nudge = !free && total >= NUDGE_FROM;
  return { items, total, count, free, gap, nudge, progress: Math.min(1, total / FREE_DELIVERY_AT) };
}
