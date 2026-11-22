"use client";

import { useEffect, useSyncExternalStore } from "react";
import { daypartCopy, daypartOf } from "@/lib/daypart";
import T from "@/components/T";

let now = 0;
const subs = new Set<() => void>();
let timer: number | undefined;

function subscribe(cb: () => void) {
  subs.add(cb);
  if (!timer) {
    now = Date.now();
    timer = window.setInterval(() => {
      now = Date.now();
      subs.forEach((s) => s());
    }, 30_000);
  }
  return () => {
    subs.delete(cb);
    if (!subs.size) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

/** Current time, refreshed every 30 s. null during server render. */
export function useNow(): Date | null {
  const t = useSyncExternalStore(
    subscribe,
    () => {
      if (!now) now = Date.now();
      return now;
    },
    () => 0,
  );
  return t ? new Date(t) : null;
}

/** Keeps <html data-time> in step with the clock, so the book re-lights itself through the day. */
export function TimeKeeper() {
  const d = useNow();
  const part = d ? daypartOf(d.getHours()) : null;
  useEffect(() => {
    if (part) document.documentElement.dataset.time = part;
  }, [part]);
  return null;
}

const fmt = (d: Date) => d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).replace(/\s?(am|pm)$/i, (m) => " " + m.trim().toLowerCase().split("").join(".") + ".");

/** The hero's ledger entry line: today's real time and a line for this part of the day. */
export function HeroEntry() {
  const d = useNow();
  const part = d ? daypartOf(d.getHours()) : "dawn";
  return (
    <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
      <T en="Today’s entry" gu={<span className="font-gu text-sm normal-case tracking-normal">આજની નોંધ</span>} /> · {d ? fmt(d) : "4:00 a.m."}
      <br />
      <span className="normal-case tracking-normal">
        <T en={daypartCopy[part].en} gu={<span className="font-gu text-sm">{daypartCopy[part].gu}</span>} />
      </span>
    </p>
  );
}
