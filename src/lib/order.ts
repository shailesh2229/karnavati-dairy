import type { Store } from "@/data/stores";
import { ADVANCE, rs } from "@/lib/money";
import type { Line } from "@/lib/cart";

export type Customer = { name: string; mobile: string; address: string; pincode: string; notes: string };

/** Normalise an Indian mobile number to 10 digits, or null if invalid. */
export function cleanMobile(v: string) {
  const d = v.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}
export const validPincode = (v: string) => /^[1-9]\d{5}$/.test(v.trim());

export function paymentTerms(total: number, free: boolean) {
  if (total > ADVANCE) {
    const bal = `balance ${rs(total - ADVANCE)}${free ? "" : " plus delivery charges"} to be paid on delivery.`;
    return `${rs(ADVANCE)} advance to confirm the order, ${bal}`;
  }
  return `Full amount of ${rs(total)}${free ? "" : " plus delivery charges"} to be paid on delivery.`;
}

export function orderMessage(o: { store: Store; customer: Customer; items: Line[]; total: number; free: boolean; regular?: string | null }) {
  const { store, customer: c, items, total, free, regular } = o;
  const lines = items.map((it, i) => `${i + 1}. ${it.sku.name} (${it.sku.pack}) × ${it.qty} = ${rs(it.total)}`);
  return [
    `*New order: Karnavati Dairy*`,
    `Shop: ${store.name}, ${store.city}`,
    ...(regular ? [`Regular order (bandhi): ${regular}`] : []),
    ``,
    `*Customer*`,
    `Name: ${c.name.trim()}`,
    `Mobile: +91 ${cleanMobile(c.mobile) ?? c.mobile}`,
    `Address: ${c.address.trim().replace(/\s*\n\s*/g, ", ")}`,
    `Pincode: ${c.pincode.trim()}`,
    ...(c.notes.trim() ? [`Notes: ${c.notes.trim()}`] : []),
    ``,
    `*Order*`,
    ...lines,
    ``,
    `*Grand total: ${rs(total)}*`,
    free ? `*FREE DELIVERY*` : `*Delivery charges: to be confirmed by the shop*`,
    ``,
    `*Payment terms*`,
    paymentTerms(total, free),
  ].join("\n");
}

export const waLink = (number: string, text: string) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
