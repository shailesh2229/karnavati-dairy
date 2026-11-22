"use client";

import { useMemo, useState } from "react";
import { stores, type Store } from "@/data/stores";
import { fmtKm, haversineKm } from "@/lib/geo";
import { useTr } from "@/lib/lang";
import T from "@/components/T";

type GeoState =
  | { kind: "idle" }
  | { kind: "locating" }
  | { kind: "ok"; lat: number; lng: number }
  | { kind: "denied" }
  | { kind: "failed"; reason: string }
  | { kind: "unsupported" };

export type Picked = { store: Store; km: number | null };

const FAR_KM = 150;

/** Gujarati spellings of the places we have shops in, so "બોપલ" finds Bopal. */
const GU_PLACES: [string, string][] = [
  ["અમદાવાદ", "Ahmedabad"], ["બોપલ", "Bopal"], ["સાઉથ બોપલ", "South Bopal"], ["આંબાવાડી", "Ambavadi"], ["શીલજ", "Shilaj"], ["શિલજ", "Shilaj"],
  ["રામદેવ નગર", "Ramdev Nagar"], ["નિકોલ", "Nikol"], ["શેલા", "Shela"], ["સાણંદ", "Sanand"], ["થલતેજ", "Thaltej"], ["પ્રહલાદનગર", "Prahlad"],
  ["વસ્ત્રાલ", "Vastral"], ["સાયન્સ સિટી", "Science City"], ["સોલા", "Sola"], ["ચાણક્યપુરી", "Chanakyapuri"], ["કલોલ", "Kalol"],
  ["પાલનપુર", "Palanpur"], ["દાંતીવાડા", "Dantiwada"], ["પાંથાવાડા", "Panthavada"], ["જેતાવાડા", "Jetavada"], ["દાદગામ", "Dadgam"],
  ["રાણીવાડા", "Raniwara"], ["નેનાવા", "Nenava"], ["ધાનેરા", "Dhanera"], ["થરાદ", "Tharad"], ["લાખણી", "Lakhni"], ["દિયોદર", "Diyodar"],
  ["ભીલડી", "Bhildi"], ["થરા", "Thara"], ["પાટણ", "Patan"], ["બનાસકાંઠા", "Banaskantha"], ["ગાંધીનગર", "Gandhinagar"], ["ગુજરાત", "Gujarat"],
];
const GU_DIGITS = "૦૧૨૩૪૫૬૭૮૯";
function toLatin(q: string) {
  let out = q.replace(/[૦-૯]/g, (d) => String(GU_DIGITS.indexOf(d)));
  for (const [gu, en] of [...GU_PLACES].sort((a, b) => b[0].length - a[0].length)) out = out.split(gu).join(en);
  return out;
}

export default function StorePicker({ selectedId, onPick }: { selectedId: string | null; onPick: (p: Picked) => void }) {
  const [geo, setGeo] = useState<GeoState>({ kind: "idle" });
  const [q, setQ] = useState("");
  const [showAll, setShowAll] = useState(false);
  const tr = useTr();

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
        else setGeo({ kind: "failed", reason: err.code === err.TIMEOUT ? "timeout" : "unavailable" });
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 5 * 60 * 1000 },
    );
  };

  // manual search: shop name, area, city, district, region or pincode (Gujarati place names work too)
  const query = toLatin(q.trim()).toLowerCase();
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
          {geo.kind === "locating" ? <T en="Finding you…" gu="તમને શોધી રહ્યા છીએ…" /> : geo.kind === "ok" ? <T en="Update my location" gu="મારું સ્થાન ફરી લો" /> : <T en="Use my current location" gu="મારું હાલનું સ્થાન વાપરો" />}
        </button>
        <p className="mt-2.5 text-center text-sm text-ink-2">
          <T
            en="We use it once, only on your phone, to find the shop closest to you. It isn’t saved or sent anywhere."
            gu="સૌથી નજીકની દુકાન શોધવા ફક્ત એક વાર, ફક્ત તમારા ફોનમાં વપરાય છે. ક્યાંય સાચવાતું કે મોકલાતું નથી."
          />
        </p>

        {manualMode && (
          <p role="status" className="mt-3 rounded-xl bg-haldi/20 px-4 py-3 text-sm">
            {geo.kind === "denied" && <T en="No problem — location is off." gu="કંઈ વાંધો નહીં — સ્થાન બંધ છે." />}
            {geo.kind === "failed" &&
              (geo.reason === "timeout" ? <T en="It took too long to find you." gu="તમને શોધવામાં વધુ સમય લાગ્યો." /> : <T en="Your location isn’t available right now." gu="હાલ તમારું સ્થાન મળતું નથી." />)}
            {geo.kind === "unsupported" && <T en="This browser can’t share location." gu="આ બ્રાઉઝર સ્થાન આપી શકતું નથી." />}{" "}
            <T en="Search your city, area or pincode below, or pick a shop from the list." gu="નીચે તમારું શહેર, વિસ્તાર કે પિનકોડ શોધો, અથવા યાદીમાંથી દુકાન પસંદ કરો." />
          </p>
        )}
        {geo.kind === "ok" && nearest && nearest.km! > FAR_KM && (
          <p role="status" className="mt-3 rounded-xl bg-haldi/20 px-4 py-3 text-sm">
            <T
              en={`Our shops are all in Gujarat, so the nearest is ${fmtKm(nearest.km!)} away. Free delivery above ₹3,000 still reaches you anywhere in India.`}
              gu={`અમારી બધી દુકાનો ગુજરાતમાં છે, સૌથી નજીકની ${fmtKm(nearest.km!)} દૂર છે. ₹3,000 થી વધુના ઓર્ડરની મફત ડિલિવરી તો ભારતમાં ક્યાંય પણ પહોંચે છે.`}
            />
          </p>
        )}
      </div>

      {/* manual search */}
      <label className="mt-5 block">
        <span className="text-sm font-semibold">
          {manualMode ? <T en="Find a shop" gu="દુકાન શોધો" /> : <T en="Or search" gu="અથવા શોધો" />}: <T en="city, area, shop or pincode" gu="શહેર, વિસ્તાર, દુકાન કે પિનકોડ" />
        </span>
        <input
          type="search"
          inputMode="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={tr("e.g. Bopal, Palanpur, 380058", "દા.ત. Bopal, Palanpur, 380058")}
          className="mt-1.5 w-full rounded-xl border-2 border-ink/25 bg-milk px-4 py-3 text-base outline-none focus:border-ink"
        />
      </label>
      {pinFallback && (
        <p className="mt-2 text-sm text-ink-2">
          <T en="No shop at exactly that pincode — here are the shops in the same postal area." gu="એ જ પિનકોડ પર દુકાન નથી — એ જ પોસ્ટલ વિસ્તારની દુકાનો આ રહી." />
        </p>
      )}

      {/* results */}
      <ul className="mt-4 space-y-2" aria-label="Shops">
        {visible.length === 0 && (
          <li className="rounded-xl border border-dashed border-ink/30 px-4 py-5 text-sm text-ink-2">
            <T en={`No shop matches “${q}”. Try a nearby city (Ahmedabad, Sanand, Palanpur, Patan…) or`} gu={`“${q}” માટે કોઈ દુકાન મળી નથી. નજીકનું શહેર અજમાવો (અમદાવાદ, સાણંદ, પાલનપુર, પાટણ…) અથવા`} />{" "}
            <button type="button" className="font-semibold text-chopda underline" onClick={() => setQ("")}>
              <T en={`see all ${stores.length} shops`} gu={`બધી ${stores.length} દુકાનો જુઓ`} />
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
                    {geo.kind === "ok" && idx === 0 && !query && km != null && <span className="font-hand text-lg text-leaf"><T en="nearest!" gu={<span className="text-sm">સૌથી નજીક!</span>} /></span>}
                  </span>
                  <span className="block text-sm text-ink-2">
                    {[s.address !== s.name ? s.address : null, s.city, s.pincode].filter(Boolean).join(", ")}
                  </span>
                  {s.lat == null && <span className="mt-1 inline-block rounded bg-ink/10 px-1.5 py-0.5 text-xs"><T en="No map pin · directions by address" gu="નકશા પિન નથી · સરનામાથી રસ્તો" /></span>}
                </span>
                {km != null && <span className="shrink-0 font-mono text-sm font-semibold text-chopda">{fmtKm(km)}</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {filtered.length > visible.length && (
        <button type="button" onClick={() => setShowAll(true)} className="mt-3 text-sm font-semibold text-chopda underline underline-offset-4">
          <T en={`Show all ${filtered.length} shops`} gu={`બધી ${filtered.length} દુકાનો બતાવો`} />
        </button>
      )}
    </div>
  );
}
