"use client";

import { useMemo, useState } from "react";
import { stores, type Store } from "@/data/stores";
import { fmtKm, haversineKm } from "@/lib/geo";

type GeoState =
  | { kind: "idle" }
  | { kind: "locating" }
  | { kind: "ok"; lat: number; lng: number }
  | { kind: "denied" }
  | { kind: "failed"; reason: string }
  | { kind: "unsupported" };

export type Picked = { store: Store; km: number | null };

const FAR_KM = 150;

export default function StorePicker({ selectedId, onPick }: { selectedId: string | null; onPick: (p: Picked) => void }) {
  const [geo, setGeo] = useState<GeoState>({ kind: "idle" });
  const [q, setQ] = useState("");
  const [showAll, setShowAll] = useState(false);

  const withKm = useMemo(() => {
    const here = geo.kind === "ok" ? geo : null;
    const list = stores.map((s) => ({
      store: s,
      km: here && s.lat != null && s.lng != null ? haversineKm(here.lat, here.lng, s.lat, s.lng) : null,
    }));
    if (here) list.sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity));
    return list;
  }, [geo]);

  const locate = () => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setGeo({ kind: "unsupported" });
      return;
    }
    setGeo({ kind: "locating" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const g = { kind: "ok" as const, lat: pos.coords.latitude, lng: pos.coords.longitude };
        setGeo(g);
        setShowAll(false);
        // preselect the nearest store that has a pin
        let best: Picked | null = null;
        for (const s of stores) {
          if (s.lat == null || s.lng == null) continue;
          const km = haversineKm(g.lat, g.lng, s.lat, s.lng);
          if (!best || km < best.km!) best = { store: s, km };
        }
        if (best) onPick(best);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setGeo({ kind: "denied" });
        else setGeo({ kind: "failed", reason: err.code === err.TIMEOUT ? "It took too long to find you." : "Your location isn’t available right now." });
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 5 * 60 * 1000 },
    );
  };

  // manual search: shop name, area, city, district, region or pincode
  const query = q.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!query) return withKm;
    const digits = query.replace(/\D/g, "");
    const exact = withKm.filter(({ store: s }) =>
      [s.name, s.address, s.city, s.region, s.state, s.pincode].join(" ").toLowerCase().includes(query),
    );
    if (exact.length || digits.length < 3) return exact;
    // pincode not served directly: fall back to shops in the same postal area (first 3 digits)
    return withKm.filter(({ store: s }) => s.pincode.startsWith(digits.slice(0, 3)));
  }, [query, withKm]);

  const pinFallback = query && /^\d{3,6}$/.test(query) && filtered.length > 0 && !filtered.some((f) => f.store.pincode.includes(query));
  const limit = geo.kind === "ok" && !query && !showAll ? 5 : Infinity;
  const visible = filtered.slice(0, limit);
  const nearest = geo.kind === "ok" ? withKm.find((x) => x.km != null) : null;
  const manualMode = geo.kind === "denied" || geo.kind === "failed" || geo.kind === "unsupported";

  return (
    <div>
      {/* location request */}
      <div className="rounded-2xl border-2 border-ink bg-milk p-4 sm:p-5">
        <button
          type="button"
          onClick={locate}
          disabled={geo.kind === "locating"}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 font-semibold text-milk shadow-[0_4px_0_var(--color-chopda)] transition active:translate-y-1 active:shadow-none disabled:opacity-70"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
          </svg>
          {geo.kind === "locating" ? "Finding you…" : geo.kind === "ok" ? "Update my location" : "Use my current location"}
        </button>
        <p className="mt-2.5 text-center text-sm text-ink-2">
          We use it once, only on your phone, to find the shop closest to you. It isn’t saved or sent anywhere.
        </p>

        {manualMode && (
          <p role="status" className="mt-3 rounded-xl bg-haldi/20 px-4 py-3 text-sm">
            {geo.kind === "denied" && "No problem — location is off. Search your city, area or pincode below, or pick a shop from the list."}
            {geo.kind === "failed" && `${geo.reason} Search your city, area or pincode below, or pick a shop from the list.`}
            {geo.kind === "unsupported" && "This browser can’t share location. Search your city, area or pincode below, or pick a shop from the list."}
          </p>
        )}
        {geo.kind === "ok" && nearest && nearest.km! > FAR_KM && (
          <p role="status" className="mt-3 rounded-xl bg-haldi/20 px-4 py-3 text-sm">
            Our shops are all in Gujarat, so the nearest is {fmtKm(nearest.km!)} away. Free delivery above ₹3,000 still reaches you anywhere in India.
          </p>
        )}
      </div>

      {/* manual search */}
      <label className="mt-5 block">
        <span className="text-sm font-semibold">{manualMode ? "Find a shop" : "Or search"}: city, area, shop or pincode</span>
        <input
          type="search"
          inputMode="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. Bopal, Palanpur, 380058"
          className="mt-1.5 w-full rounded-xl border-2 border-ink/25 bg-milk px-4 py-3 text-base outline-none focus:border-ink"
        />
      </label>
      {pinFallback && <p className="mt-2 text-sm text-ink-2">No shop at exactly that pincode — here are the shops in the same postal area.</p>}

      {/* results */}
      <ul className="mt-4 space-y-2" aria-label="Shops">
        {visible.length === 0 && (
          <li className="rounded-xl border border-dashed border-ink/30 px-4 py-5 text-sm text-ink-2">
            No shop matches “{q}”. Try a nearby city (Ahmedabad, Sanand, Palanpur, Patan…) or{" "}
            <button type="button" className="font-semibold text-chopda underline" onClick={() => setQ("")}>
              see all {stores.length} shops
            </button>
            .
          </li>
        )}
        {visible.map(({ store: s, km }, idx) => {
          const on = s.id === selectedId;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onPick({ store: s, km })}
                aria-pressed={on}
                className={`flex w-full items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition ${on ? "border-chopda bg-chopda/5 shadow-[3px_3px_0_var(--color-chopda)]" : "border-ink/15 bg-milk hover:border-ink/50"}`}
              >
                <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-chopda" : "border-ink/40"}`} aria-hidden>
                  {on && <span className="size-2.5 rounded-full bg-chopda" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-semibold">{s.name}</span>
                    {geo.kind === "ok" && idx === 0 && !query && km != null && <span className="font-hand text-lg text-leaf">nearest!</span>}
                  </span>
                  <span className="block text-sm text-ink-2">
                    {[s.address !== s.name ? s.address : null, s.city, s.pincode].filter(Boolean).join(", ")}
                  </span>
                  {s.lat == null && <span className="mt-1 inline-block rounded bg-ink/10 px-1.5 py-0.5 text-xs">No map pin · directions by address</span>}
                </span>
                {km != null && <span className="shrink-0 font-mono text-sm font-semibold text-chopda">{fmtKm(km)}</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {filtered.length > visible.length && (
        <button type="button" onClick={() => setShowAll(true)} className="mt-3 text-sm font-semibold text-chopda underline underline-offset-4">
          Show all {filtered.length} shops
        </button>
      )}
    </div>
  );
}
