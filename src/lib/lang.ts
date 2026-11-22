"use client";

import { useSyncExternalStore } from "react";

export type Lang = "en" | "gu";
const KEY = "kd-lang";

/**
 * Language lives on <html data-lang>. An inline script in the layout sets it before first paint,
 * so both languages are in the HTML and CSS shows one: no flash, works on static pages.
 */
export function getLang(): Lang {
  if (typeof document === "undefined") return "en";
  return document.documentElement.dataset.lang === "gu" ? "gu" : "en";
}

export function setLang(l: Lang) {
  document.documentElement.dataset.lang = l;
  document.documentElement.lang = l === "gu" ? "gu" : "en";
  try {
    localStorage.setItem(KEY, l);
  } catch {}
  window.dispatchEvent(new Event("kd-lang"));
}

function subscribe(cb: () => void) {
  window.addEventListener("kd-lang", cb);
  return () => window.removeEventListener("kd-lang", cb);
}

/** For strings that can't be two spans (placeholders, aria-labels, alerts). */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, () => "en");
}

/** Pick a string for the current language. */
export function useTr() {
  const l = useLang();
  return (en: string, gu: string) => (l === "gu" ? gu : en);
}
