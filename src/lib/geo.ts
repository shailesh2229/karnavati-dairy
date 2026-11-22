import type { Store } from "@/data/stores";

/** Great-circle distance in km (Haversine). */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export const fmtKm = (km: number) => (km < 1 ? `${Math.round(km * 1000)} m` : km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`);

export const fullAddress = (s: Store) =>
  [`Karnavati Dairy, ${s.name}`, s.address !== s.name ? s.address : null, s.city, s.state, s.pincode].filter(Boolean).join(", ");

const enc = encodeURIComponent;

/** Google Maps directions. Uses the exact pin when we have one, else the written address. */
export function googleDirections(s: Store) {
  const dest = s.lat != null && s.lng != null ? `${s.lat},${s.lng}` : fullAddress(s);
  return `https://www.google.com/maps/dir/?api=1&destination=${enc(dest)}`;
}

/** Uber universal link: opens the app if installed, otherwise m.uber.com. */
export function uberLink(s: Store) {
  const p = new URLSearchParams({ action: "setPickup", pickup: "my_location", "dropoff[nickname]": `Karnavati Dairy ${s.name}`, "dropoff[formatted_address]": fullAddress(s) });
  if (s.lat != null && s.lng != null) {
    p.set("dropoff[latitude]", String(s.lat));
    p.set("dropoff[longitude]", String(s.lng));
  }
  return `https://m.uber.com/ul/?${p.toString()}`;
}

/** Ola web booking link (hands over to the app on phones where supported). */
export function olaLink(s: Store) {
  const p = new URLSearchParams({ drop_name: `Karnavati Dairy ${s.name}`, utm_source: "karnavatidairy" });
  if (s.lat != null && s.lng != null) {
    p.set("drop_lat", String(s.lat));
    p.set("drop_lng", String(s.lng));
  }
  return `https://book.olacabs.com/?${p.toString()}`;
}

/** Rapido has no public drop-off deep link, so we open the app/site and copy the address first. */
export const rapidoLink = "https://www.rapido.bike/";

/** Native geo: URI, handled by any installed maps / ride app on Android (and some iOS apps). */
export function geoUri(s: Store) {
  const label = enc(`Karnavati Dairy ${s.name}`);
  if (s.lat != null && s.lng != null) return `geo:${s.lat},${s.lng}?q=${s.lat},${s.lng}(${label})`;
  return `geo:0,0?q=${enc(fullAddress(s))}`;
}
