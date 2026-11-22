"use client";

import { useEffect, useRef, useState } from "react";
import { cart, FREE_DELIVERY_AT, inr } from "@/lib/cart";
import { useTr } from "@/lib/lang";
import { play, type Sound } from "@/lib/sound";
import T from "@/components/T";

/** Fades/rises children in when they scroll into view. */
export function Reveal({ children, className = "", delay = 0, as: Tag = "div" }: { children: React.ReactNode; className?: string; delay?: number; as?: "div" | "li" | "section" }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    // @ts-expect-error polymorphic ref
    <Tag ref={ref} className={`reveal ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

/** Quantity stepper. At 0 it becomes a single "add" button. */
export function Stepper({ id, qty, label, size = "md" }: { id: string; qty: number; label: string; size?: "md" | "lg" }) {
  const tr = useTr();
  const h = size === "lg" ? "h-12" : "h-11";
  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={() => {
          play("tick");
          cart.add(id);
        }}
        aria-label={tr(`Add ${label}`, `${label} ઉમેરો`)}
        className={`${h} rounded-full border-2 border-ink bg-milk px-5 font-semibold text-ink shadow-[0_3px_0_var(--color-ink)] transition active:translate-y-[3px] active:shadow-none hover:bg-haldi`}
      >
        <T en="Add" gu="ઉમેરો" />
      </button>
    );
  }
  return (
    <div className={`${h} inline-flex items-center rounded-full border-2 border-ink bg-ink text-milk shadow-[0_3px_0_var(--color-chopda)]`} role="group" aria-label={tr(`Quantity of ${label}`, `${label} નો જથ્થો`)}>
      <button type="button" onClick={() => {
          play("tick");
          cart.setQty(id, qty - 1);
        }} aria-label={tr(`One less ${label}`, `${label} એક ઓછું`)} className={`grid ${h} w-11 place-items-center rounded-l-full text-xl hover:bg-white/10`}>
        −
      </button>
      <span key={qty} className="animate-pop min-w-7 text-center font-mono text-base font-semibold" aria-live="polite">
        {qty}
      </span>
      <button type="button" onClick={() => {
          play("tick");
          cart.add(id);
        }} aria-label={tr(`One more ${label}`, `${label} એક વધુ`)} className={`grid ${h} w-11 place-items-center rounded-r-full text-xl hover:bg-white/10`}>
        +
      </button>
    </div>
  );
}

/**
 * The free-delivery progress indicator: a steel milk can (barni) that fills toward ₹3,000.
 */
export function MilkCan({ progress, free, className = "" }: { progress: number; free: boolean; className?: string }) {
  const p = Math.max(0, Math.min(1, progress));
  const top = 34; // inside top of can body
  const bottom = 150;
  const level = bottom - (bottom - top) * p;
  return (
    <svg viewBox="0 0 120 160" className={className} role="img" aria-label={`Milk can ${Math.round(p * 100)}% full toward free delivery at ₹${FREE_DELIVERY_AT}`}>
      <defs>
        <clipPath id="can-body">
          <path d="M28 34h64l6 10v100a10 10 0 0 1-10 10H32a10 10 0 0 1-10-10V44Z" />
        </clipPath>
        <linearGradient id="steel" x1="0" x2="1">
          <stop offset="0" stopColor="#5f6872" />
          <stop offset=".35" stopColor="#b9c1c9" />
          <stop offset=".6" stopColor="#8a939d" />
          <stop offset="1" stopColor="#4d555e" />
        </linearGradient>
      </defs>
      {/* lid + neck */}
      <rect x="40" y="6" width="40" height="10" rx="3" fill="url(#steel)" stroke="#1c2236" strokeWidth="2" />
      <path d="M44 16h32l4 18H40Z" fill="url(#steel)" stroke="#1c2236" strokeWidth="2" />
      {/* body */}
      <path d="M28 34h64l6 10v100a10 10 0 0 1-10 10H32a10 10 0 0 1-10-10V44Z" fill="url(#steel)" stroke="#1c2236" strokeWidth="2.5" />
      <g clipPath="url(#can-body)">
        <g style={{ transform: `translateY(${level}px)`, transition: "transform .8s cubic-bezier(.2,.8,.2,1)" }}>
          <g className="slosh">
            <path d="M0 0 q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 V200 H0Z" fill={free ? "#ffffff" : "#fff8e6"} stroke="#1c2236" strokeOpacity=".35" strokeWidth="1.5" />
          </g>
        </g>
      </g>
      {/* bands */}
      <path d="M22 70h76M22 124h76" stroke="#1c2236" strokeOpacity=".35" strokeWidth="2" />
      {/* handles */}
      <path d="M22 52c-12 0-12 22 0 22M98 52c12 0 12 22 0 22" fill="none" stroke="#1c2236" strokeWidth="3" strokeLinecap="round" />
      {free && (
        <text x="60" y="104" textAnchor="middle" fontFamily="var(--font-plex-mono)" fontSize="13" fontWeight="700" fill="#2f6b3a">
          FREE
        </text>
      )}
    </svg>
  );
}

/** A rubber stamp that thunks onto the page. */
export function Stamp({ children, tone = "chopda", className = "", sound = "thump" }: { children: React.ReactNode; tone?: "chopda" | "leaf" | "ink"; className?: string; sound?: Sound | null }) {
  useEffect(() => {
    if (sound) play(sound);
  }, [sound]);
  const c = { chopda: "text-chopda", leaf: "text-leaf", ink: "text-ink" }[tone];
  return <span className={`stamp animate-thunk inline-block px-3 py-1.5 font-mono text-sm font-semibold ${c} ${className}`}>{children}</span>;
}

/**
 * A total written in the ledger: when it changes, the old figure is struck through
 * with a pen and fades, and the new one is inked in.
 */
export function InkTotal({ value, className = "" }: { value: number; className?: string }) {
  const [hist, setHist] = useState<{ prev: number | null; cur: number; n: number }>({ prev: null, cur: value, n: 0 });
  if (hist.cur !== value) setHist({ prev: hist.cur, cur: value, n: hist.n + 1 });
  return (
    <span className={`relative inline-flex flex-col items-end ${className}`}>
      {hist.prev !== null && (
        <span key={`p${hist.n}`} aria-hidden className="strike fade-off pointer-events-none absolute -top-[0.9em] right-0 text-[0.55em] text-chopda">
          {inr(hist.prev)}
        </span>
      )}
      <span key={`c${hist.n}`} className={hist.n ? "ink-in" : ""}>
        {inr(hist.cur)}
      </span>
    </span>
  );
}
