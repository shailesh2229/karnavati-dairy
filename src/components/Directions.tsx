"use client";

import { useState } from "react";
import type { Store } from "@/data/stores";
import { fmtKm, fullAddress, geoUri, googleDirections, olaLink, rapidoLink, uberLink } from "@/lib/geo";

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // older browsers / non-secure contexts
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

const btn =
  "flex items-center justify-center gap-2 rounded-xl border-2 border-ink px-4 py-3 text-center font-semibold transition active:translate-y-0.5";

export default function Directions({ store, km }: { store: Store; km: number | null }) {
  const [note, setNote] = useState<string | null>(null);
  const address = fullAddress(store);
  const flash = (m: string) => {
    setNote(m);
    window.setTimeout(() => setNote(null), 3500);
  };

  const onCopy = async () => flash((await copyText(address)) ? "Address copied." : "Couldn’t copy — press and hold the address to copy it.");

  const onRapido = async () => {
    await copyText(address);
    flash("Address copied — paste it as your Rapido drop location.");
  };

  const onOtherApp = async () => {
    const data = { title: `Karnavati Dairy, ${store.name}`, text: address, url: googleDirections(store) };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return; // user closed the sheet
      }
    }
    window.location.href = geoUri(store); // Android picks any installed maps / ride app
  };

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-ink bg-milk shadow-[6px_6px_0_var(--color-ink)]">
      <div className="cloth px-5 py-4 text-milk">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-haldi">{km != null ? `${fmtKm(km)} away` : "Your shop"}</p>
        <p className="mt-1 font-display text-2xl leading-tight sm:text-3xl">Karnavati Dairy, {store.name}</p>
      </div>
      <div className="p-5">
        <address className="select-all not-italic text-ink-2">
          {[store.address !== store.name ? store.address : null, store.city, store.state, store.pincode].filter(Boolean).join(", ")}
        </address>
        {store.lat == null && (
          <p className="mt-2 rounded-lg bg-haldi/20 px-3 py-2 text-sm">
            This shop has no exact map pin yet, so apps will search by its address. Call us on the way if you can’t find it.
          </p>
        )}

        <a href={googleDirections(store)} target="_blank" rel="noopener noreferrer" className={`${btn} mt-4 w-full bg-ink text-milk shadow-[0_4px_0_var(--color-chopda)] active:shadow-none`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
          </svg>
          Open in Google Maps
        </a>

        <p className="mt-5 text-sm font-semibold">Book a ride to the shop</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <a href={uberLink(store)} target="_blank" rel="noopener noreferrer" className={`${btn} bg-black text-white`}>
            Uber
          </a>
          <a href={olaLink(store)} target="_blank" rel="noopener noreferrer" className={`${btn} bg-[#cddc39] text-black`}>
            Ola
          </a>
          <a href={rapidoLink} target="_blank" rel="noopener noreferrer" onClick={onRapido} className={`${btn} bg-[#f9c933] text-black`}>
            Rapido
          </a>
        </div>
        <p className="mt-1.5 text-xs text-ink-2">Uber and Ola open with the shop as your drop. Rapido opens with the address copied, ready to paste.</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" onClick={onOtherApp} className={`${btn} bg-milk`}>
            Choose another app
          </button>
          <button type="button" onClick={onCopy} className={`${btn} bg-milk`}>
            Copy address
          </button>
        </div>
        <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm font-semibold text-leaf">
          {note}
        </p>
      </div>
    </div>
  );
}
