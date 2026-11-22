import { GPS_MATCH_KM, isFreeDeliveryPin, PIN_TABLE } from "@/config/delivery";
import { stores, type Store } from "@/data/stores";
import { haversineKm } from "@/lib/geo";

/** Where the customer is, as far as we can tell. */
export type Detected = {
  source: "pin" | "gps";
  pin: string | null;
  area: string | null; // e.g. "Sarkhej"
  district?: string | null;
  lat: number;
  lng: number;
  free: boolean; // inside FREE_DELIVERY_AREAS
  via: "table" | "online" | "gps";
};

export type Ranked = { store: Store; km: number | null };

/** All shops sorted by distance from a point (shops without a pin go last). */
export function rankStores(lat: number, lng: number): Ranked[] {
  return stores
    .map((s) => ({ store: s, km: s.lat != null && s.lng != null ? haversineKm(lat, lng, s.lat, s.lng) : null }))
    .sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity));
}

export const validPin = (pin: string) => /^[1-9]\d{5}$/.test(pin);

/** Typed area names ("Makarba", "Sarkhej") → table row. */
export function findArea(q: string) {
  const s = q.trim().toLowerCase();
  if (s.length < 3) return null;
  const parts = (r: (typeof PIN_TABLE)[number]) => r.area.toLowerCase().split(/\s*\/\s*|\s*\(\s*/).map((p) => p.replace(/\)$/, ""));
  // prefer a row named exactly what was typed ("Makarba"), then one that starts with it
  return PIN_TABLE.find((r) => r.area.toLowerCase() === s) ?? PIN_TABLE.find((r) => parts(r).includes(s)) ?? PIN_TABLE.find((r) => parts(r).some((p) => p.startsWith(s))) ?? null;
}

async function fetchJson(url: string, ms = 8000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctl.signal, headers: { Accept: "application/json" } });
    if (!r.ok) throw new Error(String(r.status));
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

/**
 * PIN → location. 1) our table, 2) India Post (names the area) + OpenStreetMap (coordinates).
 * Returns null when the PIN can't be placed; throws "invalid" when India Post says the PIN doesn't exist.
 */
export async function lookupPin(pin: string): Promise<Detected | null> {
  const row = PIN_TABLE.find((r) => r.pin === pin);
  if (row) return { source: "pin", pin, area: row.area, lat: row.lat, lng: row.lng, free: isFreeDeliveryPin(pin), via: "table" };

  let area: string | null = null;
  let district: string | null = null;
  let state: string | null = null;
  try {
    const d = await fetchJson(`https://api.postalpincode.in/pincode/${pin}`);
    const rec = Array.isArray(d) ? d[0] : null;
    if (rec?.Status === "Error" || (rec?.Status === "Success" && !rec.PostOffice?.length)) throw new Error("invalid");
    const po = rec?.PostOffice?.[0];
    if (po) {
      area = po.Name;
      district = po.District;
      state = po.State;
    }
  } catch (e) {
    if ((e as Error).message === "invalid") throw e;
    /* India Post unreachable: carry on with OpenStreetMap alone */
  }

  const tries = [
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&postalcode=${pin}`,
    area ? `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q=${encodeURIComponent([area, district, state].filter(Boolean).join(", "))}` : null,
  ].filter(Boolean) as string[];
  for (const url of tries) {
    try {
      const res = await fetchJson(url);
      const hit = Array.isArray(res) ? res[0] : null;
      if (hit?.lat && hit?.lon) {
        return { source: "pin", pin, area: area ?? hit.display_name?.split(",")[1]?.trim() ?? null, district, lat: Number(hit.lat), lng: Number(hit.lon), free: isFreeDeliveryPin(pin), via: "online" };
      }
    } catch {
      /* try the next one */
    }
  }
  return null;
}

/** GPS → nearest known area (only if close enough), so we can name it and judge free delivery. */
export function describeCoords(lat: number, lng: number): Detected {
  let best: (typeof PIN_TABLE)[number] | null = null;
  let bestKm = Infinity;
  for (const r of PIN_TABLE) {
    const km = haversineKm(lat, lng, r.lat, r.lng);
    if (km < bestKm) {
      bestKm = km;
      best = r;
    }
  }
  const near = best && bestKm <= GPS_MATCH_KM ? best : null;
  return { source: "gps", pin: near?.pin ?? null, area: near?.area ?? null, lat, lng, free: isFreeDeliveryPin(near?.pin), via: "gps" };
}
