"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { stores, type Store } from "@/data/stores";
import { fmtKm } from "@/lib/geo";
import { describeCoords, findArea, lookupPin, rankStores, validPin, type Detected } from "@/lib/locate";
import { useTr } from "@/lib/lang";
import T from "@/components/T";

type GeoState =
  | { kind: "idle" }
  | { kind: "locating" }
  | { kind: "slow" } // the permission prompt or GPS is taking long
  | { kind: "ok" }
  | { kind: "denied" }
  | { kind: "failed"; reason: "timeout" | "unavailable" }
  | { kind: "unsupported" }
  | { kind: "insecure" };

type PinState =
  | { kind: "idle" }
  | { kind: "short" }
  | { kind: "letters" }
  | { kind: "invalid" }
  | { kind: "looking" }
  | { kind: "ok" }
  | { kind: "notfound" };

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
  ["મકરબા", "Makarba"], ["સરખેજ", "Sarkhej"], ["વેજલપુર", "Vejalpur"], ["સેટેલાઇટ", "Satellite"], ["બોડકદેવ", "Bodakdev"], ["મણિનગર", "Maninagar"],
];
const GU_DIGITS = "૦૧૨૩૪૫૬૭૮૯";
function toLatin(q: string) {
  let out = q.replace(/[૦-૯]/g, (d) => String(GU_DIGITS.indexOf(d)));
  for (const [gu, en] of [...GU_PLACES].sort((a, b) => b[0].length - a[0].length)) out = out.split(gu).join(en);
  return out;
}

export default function StorePicker({
  selectedId,
  onPick,
  onDetect,
  showFreeInfo = false,
}: {
  selectedId: string | null;
  /** auto = chosen by PIN/GPS detection rather than tapped */
  onPick: (p: Picked, auto?: boolean) => void;
  /** called with where the customer is (from PIN or GPS), or null when cleared */
  onDetect?: (d: Detected | null) => void;
  /** checkout: say whether the detected place gets free delivery */
  showFreeInfo?: boolean;
}) {
  const tr = useTr();
  const [geo, setGeo] = useState<GeoState>({ kind: "idle" });
  const [pinState, setPinState] = useState<PinState>({ kind: "idle" });
  const [pin, setPin] = useState("");
  const [detected, setDetected] = useState<Detected | null>(null);
  const [q, setQ] = useState("");
  const [showAll, setShowAll] = useState(false);
  const reqId = useRef(0);
  const watchdog = useRef<number | undefined>(undefined);

  /** a place is known: rank shops from it and pick the nearest automatically */
  const applyDetection = (d: Detected) => {
    setDetected(d);
    setShowAll(false);
    onDetect?.(d);
    const best = rankStores(d.lat, d.lng).find((x) => x.km != null);
    if (best) onPick(best, true);
  };

  /* ── PIN code: detects as soon as 6 digits are typed ── */
  const runPin = async (value: string) => {
    const id = ++reqId.current;
    if (!validPin(value)) {
      setPinState({ kind: "invalid" });
      return;
    }
    setPinState({ kind: "looking" });
    try {
      const d = await lookupPin(value);
      if (id !== reqId.current) return; // a newer PIN was typed meanwhile
      if (d) {
        setPinState({ kind: "ok" });
        applyDetection(d);
      } else setPinState({ kind: "notfound" });
    } catch (e) {
      if (id !== reqId.current) return;
      setPinState({ kind: (e as Error).message === "invalid" ? "invalid" : "notfound" });
    }
  };

  const onPinChange = (raw: string) => {
    const typedLetters = /[^\d૦-૯\s]/.test(raw);
    const digits = raw.replace(/[૦-૯]/g, (d) => String(GU_DIGITS.indexOf(d))).replace(/\D/g, "").slice(0, 6);
    setPin(digits);
    if (typedLetters) setPinState({ kind: "letters" });
    else if (digits.length === 6) void runPin(digits);
    else {
      reqId.current++;
      setPinState({ kind: "idle" });
    }
  };

  useEffect(() => () => clearTimeout(watchdog.current), []);

  /* ── Current location: called directly from the tap (a user gesture) ── */
  const locate = () => {
    if (typeof window !== "undefined" && !window.isSecureContext) return setGeo({ kind: "insecure" });
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) return setGeo({ kind: "unsupported" });
    setGeo({ kind: "locating" });
    clearTimeout(watchdog.current);
    // if the permission prompt is left open or GPS hangs, say so instead of looking frozen
    watchdog.current = window.setTimeout(() => setGeo((g) => (g.kind === "locating" ? { kind: "slow" } : g)), 12000);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(watchdog.current);
        setGeo({ kind: "ok" });
        applyDetection(describeCoords(pos.coords.latitude, pos.coords.longitude));
      },
      (err) => {
        clearTimeout(watchdog.current);
        if (err.code === err.PERMISSION_DENIED) setGeo({ kind: "denied" });
        else setGeo({ kind: "failed", reason: err.code === err.TIMEOUT ? "timeout" : "unavailable" });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  };

  /* ── list: sorted from the detected place, else filtered by search ── */
  const query = toLatin(q.trim()).toLowerCase();
  const areaHit = useMemo(() => (query && !/^\d+$/.test(query) ? findArea(query) : null), [query]);

  const ranked = useMemo(() => {
    if (areaHit) return rankStores(areaHit.lat, areaHit.lng);
    if (detected) return rankStores(detected.lat, detected.lng);
    return stores.map((s) => ({ store: s, km: null as number | null }));
  }, [areaHit, detected]);

  const filtered = useMemo(() => {
    if (!query || areaHit) return ranked;
    const digits = query.replace(/\D/g, "");
    const exact = ranked.filter(({ store: s }) => [s.name, s.address, s.city, s.region, s.state, s.pincode].join(" ").toLowerCase().includes(query));
    if (exact.length || digits.length < 3) return exact;
    return ranked.filter(({ store: s }) => s.pincode.startsWith(digits.slice(0, 3)));
  }, [query, areaHit, ranked]);

  const sortedByDistance = !!areaHit || (!!detected && !query);
  const limit = sortedByDistance && !showAll ? 5 : Infinity;
  const visible = filtered.slice(0, limit);
  const nearest = ranked.find((x) => x.km != null) ?? null;
  const manualMode = ["denied", "failed", "unsupported", "insecure"].includes(geo.kind) || pinState.kind === "notfound";

  const placeName = detected ? detected.area ?? tr("your location", "તમારું સ્થાન") : null;

  return (
    <div>
      <div className="rounded-2xl border-2 border-ink bg-milk p-4 sm:p-5">
        {/* current location */}
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
          {geo.kind === "locating" || geo.kind === "slow" ? (
            <T en="Finding you…" gu="તમને શોધી રહ્યા છીએ…" />
          ) : geo.kind === "ok" ? (
            <T en="Update my location" gu="મારું સ્થાન ફરી લો" />
          ) : (
            <T en="Use my current location" gu="મારું હાલનું સ્થાન વાપરો" />
          )}
        </button>
        <p className="mt-2.5 text-center text-sm text-ink-2">
          <T
            en="We use it once, only on your phone, to find the shop closest to you. It isn’t saved or sent anywhere."
            gu="સૌથી નજીકની દુકાન શોધવા ફક્ત એક વાર, ફક્ત તમારા ફોનમાં વપરાય છે. ક્યાંય સાચવાતું કે મોકલાતું નથી."
          />
        </p>

        {geo.kind !== "idle" && geo.kind !== "ok" && geo.kind !== "locating" && (
          <p role="status" className="mt-3 rounded-xl bg-haldi/20 px-4 py-3 text-sm">
            {geo.kind === "slow" && <T en="Still waiting for your location — please tap “Allow” if your phone is asking." gu="હજુ સ્થાનની રાહ — ફોન પૂછતો હોય તો “Allow” દબાવો." />}
            {geo.kind === "denied" && <T en="No problem — location is off." gu="કંઈ વાંધો નહીં — સ્થાન બંધ છે." />}
            {geo.kind === "failed" && (geo.reason === "timeout" ? <T en="It took too long to find you." gu="તમને શોધવામાં વધુ સમય લાગ્યો." /> : <T en="Your location isn’t available right now." gu="હાલ તમારું સ્થાન મળતું નથી." />)}
            {geo.kind === "unsupported" && <T en="This browser can’t share location." gu="આ બ્રાઉઝર સ્થાન આપી શકતું નથી." />}
            {geo.kind === "insecure" && <T en="Location only works on a secure (https) page." gu="સ્થાન ફક્ત સુરક્ષિત (https) પેજ પર ચાલે છે." />}{" "}
            {geo.kind !== "slow" && <T en="Enter your PIN code below, or pick a shop from the list." gu="નીચે તમારો પિનકોડ લખો, અથવા યાદીમાંથી દુકાન પસંદ કરો." />}
          </p>
        )}

        {/* PIN code */}
        <div className="my-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-2" aria-hidden>
          <span className="h-px flex-1 bg-ink/15" />
          <T en="or" gu="અથવા" />
          <span className="h-px flex-1 bg-ink/15" />
        </div>
        <label className="block">
          <span className="text-sm font-semibold">
            <T en="Your PIN code" gu="તમારો પિનકોડ" />
          </span>
          <input
            value={pin}
            onChange={(e) => onPinChange(e.target.value)}
            onBlur={() => pin.length > 0 && pin.length < 6 && setPinState({ kind: "short" })}
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder={tr("e.g. 382210", "દા.ત. 382210")}
            aria-invalid={["short", "letters", "invalid"].includes(pinState.kind)}
            aria-describedby="pin-msg"
            className="mt-1.5 w-full rounded-xl border-2 border-ink/25 bg-paper/40 px-4 py-3 font-mono text-lg tracking-[0.2em] outline-none focus:border-ink aria-[invalid=true]:border-chopda"
          />
        </label>
        <p id="pin-msg" role="status" aria-live="polite" className="mt-1.5 min-h-5 text-sm">
          {pinState.kind === "short" && <span className="text-chopda"><T en="PIN codes have 6 digits." gu="પિનકોડ 6 આંકડાનો હોય છે." /></span>}
          {pinState.kind === "letters" && <span className="text-chopda"><T en="Numbers only, please." gu="ફક્ત આંકડા લખો." /></span>}
          {pinState.kind === "invalid" && <span className="text-chopda"><T en="That doesn’t look like a valid PIN code." gu="આ સાચો પિનકોડ લાગતો નથી." /></span>}
          {pinState.kind === "looking" && <span className="text-ink-2"><T en={`Finding ${pin}…`} gu={`${pin} શોધી રહ્યા છીએ…`} /></span>}
          {pinState.kind === "notfound" && (
            <span className="text-chopda">
              <T en="We couldn’t place this PIN code. Type your area below or pick a shop from the list." gu="આ પિનકોડ શોધી ન શક્યા. નીચે તમારો વિસ્તાર લખો કે યાદીમાંથી દુકાન પસંદ કરો." />
            </span>
          )}
        </p>

        {/* what we detected */}
        {detected && nearest && (
          <div className="mt-2 rounded-xl border-2 border-dashed border-leaf/60 bg-leaf/5 px-4 py-3" role="status">
            <p className="text-sm">
              📍{" "}
              <strong>
                {placeName}
                {detected.pin ? ` · ${detected.pin}` : ""}
              </strong>
            </p>
            <p className="mt-0.5 text-sm text-ink-2">
              <T en="Nearest shop:" gu="નજીકની દુકાન:" /> <strong className="text-ink">{nearest.store.name}</strong> · <span className="font-mono">{fmtKm(nearest.km!)}</span>{" "}
              <T en="(selected — you can change it below)" gu="(પસંદ કરી — નીચે બદલી શકો)" />
            </p>
            {showFreeInfo && (
              <p className={`mt-1 text-sm font-semibold ${detected.free ? "text-leaf" : "text-chopda"}`}>
                {detected.free ? <T en="✓ Free-delivery area" gu="✓ મફત ડિલિવરી વિસ્તાર" /> : <T en="Outside the free-delivery area" gu="મફત ડિલિવરી વિસ્તારની બહાર" />}
              </p>
            )}
          </div>
        )}

        {detected && nearest && nearest.km! > FAR_KM && (
          <p role="status" className="mt-3 rounded-xl bg-haldi/20 px-4 py-3 text-sm">
            <T
              en={`Our shops are all in Gujarat, so the nearest is ${fmtKm(nearest.km!)} away.`}
              gu={`અમારી બધી દુકાનો ગુજરાતમાં છે, સૌથી નજીકની ${fmtKm(nearest.km!)} દૂર છે.`}
            />
          </p>
        )}
      </div>

      {/* manual search */}
      <label className="mt-5 block">
        <span className="text-sm font-semibold">
          {manualMode ? <T en="Find a shop" gu="દુકાન શોધો" /> : <T en="Or search" gu="અથવા શોધો" />}: <T en="city, area or shop" gu="શહેર, વિસ્તાર કે દુકાન" />
        </span>
        <input
          type="search"
          inputMode="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={tr("e.g. Makarba, Bopal, Palanpur", "દા.ત. Makarba, Bopal, Palanpur")}
          className="mt-1.5 w-full rounded-xl border-2 border-ink/25 bg-milk px-4 py-3 text-base outline-none focus:border-ink"
        />
      </label>
      {areaHit && (
        <p className="mt-2 text-sm text-ink-2">
          <T en={`Shops nearest to ${areaHit.area}:`} gu={`${areaHit.area} ની સૌથી નજીકની દુકાનો:`} />
        </p>
      )}

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
                    {sortedByDistance && idx === 0 && km != null && (
                      <span className="font-hand text-lg text-leaf">
                        <T en="nearest!" gu={<span className="text-sm">સૌથી નજીક!</span>} />
                      </span>
                    )}
                  </span>
                  <span className="block text-sm text-ink-2">{[s.address !== s.name ? s.address : null, s.city, s.pincode].filter(Boolean).join(", ")}</span>
                  {s.lat == null && (
                    <span className="mt-1 inline-block rounded bg-ink/10 px-1.5 py-0.5 text-xs">
                      <T en="No map pin · directions by address" gu="નકશા પિન નથી · સરનામાથી રસ્તો" />
                    </span>
                  )}
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
