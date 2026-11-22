"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny synthesized sounds (no audio files): a pen tick, a rubber-stamp thump,
 * a temple-bell ding, a page rustle and a churn slosh. Off by default; the
 * choice is remembered on the device. Nothing plays until the visitor turns it on.
 */
export type Sound = "tick" | "thump" | "bell" | "page" | "slosh";
const KEY = "kd-sound";

let enabled: boolean | undefined;
let ctx: AudioContext | null = null;
const subs = new Set<() => void>();

function isOn() {
  if (enabled === undefined) {
    try {
      enabled = localStorage.getItem(KEY) === "on";
    } catch {
      enabled = false;
    }
  }
  return enabled;
}

export function setSound(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
  subs.forEach((s) => s());
  if (on) play("bell");
}

export function useSoundOn() {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    isOn,
    () => false,
  );
}

function audio() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function noise(c: AudioContext, seconds: number) {
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * seconds), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  return src;
}

function env(c: AudioContext, peak: number, attack: number, decay: number) {
  const g = c.createGain();
  const t = c.currentTime;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  g.connect(c.destination);
  return g;
}

export function play(s: Sound) {
  if (typeof window === "undefined" || !isOn()) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && s === "page") return;
  const c = audio();
  if (!c) return;
  const t = c.currentTime;

  if (s === "tick") {
    const o = c.createOscillator();
    o.type = "triangle";
    o.frequency.setValueAtTime(2200, t);
    o.frequency.exponentialRampToValueAtTime(900, t + 0.04);
    o.connect(env(c, 0.08, 0.002, 0.05));
    o.start(t);
    o.stop(t + 0.07);
  } else if (s === "thump") {
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(160, t);
    o.frequency.exponentialRampToValueAtTime(55, t + 0.15);
    o.connect(env(c, 0.35, 0.004, 0.18));
    o.start(t);
    o.stop(t + 0.22);
    const n = noise(c, 0.06);
    const f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 900;
    n.connect(f).connect(env(c, 0.12, 0.002, 0.05));
    n.start(t);
  } else if (s === "bell") {
    [880, 1320, 2215].forEach((hz, i) => {
      const o = c.createOscillator();
      o.type = "sine";
      o.frequency.value = hz;
      o.connect(env(c, 0.07 / (i + 1), 0.005, 1.6 - i * 0.4));
      o.start(t);
      o.stop(t + 1.8);
    });
  } else if (s === "page") {
    const n = noise(c, 0.35);
    const f = c.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.setValueAtTime(1200, t);
    f.frequency.exponentialRampToValueAtTime(3800, t + 0.3);
    f.Q.value = 0.8;
    n.connect(f).connect(env(c, 0.09, 0.06, 0.26));
    n.start(t);
  } else if (s === "slosh") {
    const n = noise(c, 0.4);
    const f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(500, t);
    f.frequency.linearRampToValueAtTime(220, t + 0.35);
    n.connect(f).connect(env(c, 0.14, 0.08, 0.3));
    n.start(t);
  }
}
