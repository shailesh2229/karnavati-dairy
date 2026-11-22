"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { skus } from "@/data/catalogue";
import { ADVANCE, cart, FREE_DELIVERY_AT, inr, NUDGE_FROM, summarise, useLines } from "@/lib/cart";
import { cleanMobile, orderMessage, paymentTerms, validPincode, waLink, type Customer } from "@/lib/order";
import { MilkCan, Stamp, Stepper } from "@/components/bits";
import StorePicker, { type Picked } from "@/components/StorePicker";
import Directions, { copyText } from "@/components/Directions";

type Step = "bill" | "visit" | "store" | "details" | "review" | "sent";
type Mode = "free" | "paid"; // free delivery (3000+) or "continue anyway"

const CUSTOMER_KEY = "kd-customer-v1";
const blank: Customer = { name: "", mobile: "", address: "", pincode: "", notes: "" };

export default function Hisaab() {
  const lines = useLines();
  const s = summarise(lines);
  const [step, setStep] = useState<Step>("bill");
  const [mode, setMode] = useState<Mode>("free");
  const [picked, setPicked] = useState<Picked | null>(null);
  const [customer, setCustomer] = useState<Customer>(blank);
  const [sentSnapshot, setSentSnapshot] = useState<{ message: string; total: number; free: boolean } | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // restore saved delivery details (per-device convenience only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CUSTOMER_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydrate from storage
      if (raw) setCustomer({ ...blank, ...JSON.parse(raw), notes: "" });
    } catch {}
  }, []);

  const go = (next: Step) => {
    setStep(next);
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  // edge cases while mid-checkout: cart emptied, or total dropped below 3000 in a free-delivery order
  const freeLost = mode === "free" && !s.free && (step === "store" || step === "details" || step === "review");
  const emptyMidway = s.count === 0 && step !== "bill" && step !== "visit" && step !== "sent";

  return (
    <div ref={topRef} className="mx-auto max-w-3xl scroll-mt-4 px-4 pt-10 sm:px-6 sm:pt-14">
      <Header step={step} mode={mode} onBack={() => go(step === "review" ? "details" : step === "details" ? "store" : "bill")} />

      {emptyMidway ? (
        <Empty />
      ) : (
        <>
          {freeLost && (
            <div role="alert" className="mb-5 rounded-2xl border-2 border-chopda bg-chopda/5 p-4">
              <p className="font-semibold">Your total is now {inr(s.total)}, below {inr(FREE_DELIVERY_AT)}, so free delivery no longer applies.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => go("bill")} className="rounded-full bg-ink px-4 py-2 font-semibold text-milk">
                  Back to the hisaab
                </button>
                <button type="button" onClick={() => setMode("paid")} className="rounded-full border-2 border-ink px-4 py-2 font-semibold">
                  Continue with delivery charges
                </button>
              </div>
            </div>
          )}

          {step === "bill" && (
            <Bill
              s={s}
              onFree={() => {
                setMode("free");
                go("store");
              }}
              onPaid={() => {
                setMode("paid");
                go("store");
              }}
              onVisit={() => go("visit")}
            />
          )}

          {step === "visit" && (
            <section aria-label="Directions to the nearest shop">
              <StorePicker selectedId={picked?.store.id ?? null} onPick={setPicked} />
              {picked && (
                <div className="mt-8">
                  <Directions store={picked.store} km={picked.km} />
                </div>
              )}
            </section>
          )}

          {step === "store" && (
            <section aria-label="Choose the shop that will deliver">
              <p className="mb-4 text-ink-2">Your order goes to this shop on WhatsApp. They’ll pack it and deliver it.</p>
              <StorePicker selectedId={picked?.store.id ?? null} onPick={setPicked} />
              <StickyAction disabled={!picked} onClick={() => go("details")}>
                {picked ? `Deliver from ${picked.store.name} →` : "Choose a shop to continue"}
              </StickyAction>
            </section>
          )}

          {step === "details" && picked && (
            <Details
              customer={customer}
              onChange={setCustomer}
              onNext={() => {
                try {
                  const { notes: _n, ...keep } = customer;
                  void _n;
                  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(keep));
                } catch {}
                go("review");
              }}
            />
          )}

          {step === "review" && picked && (
            <Review
              s={s}
              free={mode === "free" && s.free}
              store={picked.store}
              customer={customer}
              onSent={(message) => {
                setSentSnapshot({ message, total: s.total, free: mode === "free" && s.free });
                go("sent");
              }}
              onEdit={() => go("details")}
            />
          )}

          {step === "sent" && picked && sentSnapshot && (
            <Sent
              snapshot={sentSnapshot}
              storeName={picked.store.name}
              waHref={waLink(picked.store.whatsapp, sentSnapshot.message)}
              onNew={() => {
                cart.clear();
                setPicked(null);
                setSentSnapshot(null);
                go("bill");
              }}
              onDirections={() => go("visit")}
            />
          )}
        </>
      )}
    </div>
  );
}

/* ───────────────────────── header ───────────────────────── */

function Header({ step, mode, onBack }: { step: Step; mode: Mode; onBack: () => void }) {
  const titles: Record<Step, [string, string]> = {
    bill: ["Your hisaab", "હિસાબ"],
    visit: ["Your nearest shop", "નજીકની દુકાન"],
    store: ["Which shop delivers?", "દુકાન"],
    details: ["Where should it come?", "સરનામું"],
    review: ["Check & send", "તપાસો"],
    sent: ["Written in the book", "જમા"],
  };
  const flow: Step[] = ["store", "details", "review", "sent"];
  const n = flow.indexOf(step);
  return (
    <div className="mb-6">
      {step !== "bill" && step !== "sent" && (
        <button type="button" onClick={onBack} className="mb-3 text-sm font-semibold text-chopda">
          ← Back
        </button>
      )}
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-chopda">
        {n >= 0 ? `Step ${n + 1} of 4 · ${mode === "free" ? "free delivery" : "delivery"}` : <span className="font-gu text-base normal-case tracking-normal">{titles[step][1]}</span>}
      </p>
      <h1 className="mt-1 font-display text-5xl leading-[0.95] sm:text-6xl">{titles[step][0]}</h1>
      {n >= 0 && (
        <div className="mt-4 flex gap-1.5" aria-hidden>
          {flow.map((f, i) => (
            <span key={f} className={`h-1.5 flex-1 rounded-full ${i <= n ? "bg-chopda" : "bg-ink/15"}`} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── bill ───────────────────────── */

type Summary = ReturnType<typeof summarise>;

function Empty() {
  return (
    <div className="ledger rounded-3xl border-2 border-ink p-8 pl-16 text-center shadow-[6px_6px_0_var(--color-ink)] md:pl-28">
      <MilkCan progress={0} free={false} className="mx-auto h-36 w-auto" />
      <p className="mt-4 font-display text-3xl">The page is blank.</p>
      <p className="mt-2 text-ink-2">Nothing written in your hisaab yet. Fill the can to {inr(FREE_DELIVERY_AT)} and delivery is free.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/products" className="rounded-full bg-chopda px-6 py-3.5 font-semibold text-milk shadow-[0_4px_0_var(--color-chopda-dark)]">
          Open the counter
        </Link>
        <Link href="/stores" className="rounded-full border-2 border-ink px-6 py-3 font-semibold">
          Just find my nearest shop
        </Link>
      </div>
    </div>
  );
}

function ProgressBar({ s }: { s: Summary }) {
  const nudgeAt = (NUDGE_FROM / FREE_DELIVERY_AT) * 100;
  return (
    <div>
      <div className="relative mb-1 h-4 font-mono text-[11px] text-ink-2" aria-hidden>
        <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${nudgeAt}%` }}>
          ₹2,500 ↓
        </span>
      </div>
      <div className="relative h-4 overflow-hidden rounded-full border-2 border-ink bg-milk" role="progressbar" aria-valuemin={0} aria-valuemax={FREE_DELIVERY_AT} aria-valuenow={Math.min(s.total, FREE_DELIVERY_AT)} aria-label="Progress toward free delivery">
        <div className={`h-full transition-[width] duration-700 ease-out ${s.free ? "bg-leaf" : s.nudge ? "bg-haldi" : "bg-chopda"}`} style={{ width: `${s.progress * 100}%` }} />
        <span className="absolute inset-y-0 w-0.5 bg-ink/40" style={{ left: `${nudgeAt}%` }} aria-hidden />
      </div>
      <div className="relative mt-1 h-4 font-mono text-[11px] text-ink-2">
        <span className="absolute left-0">₹0</span>
        <span className="absolute right-0">₹3,000 · free</span>
      </div>
    </div>
  );
}

function Bill({ s, onFree, onPaid, onVisit }: { s: Summary; onFree: () => void; onPaid: () => void; onVisit: () => void }) {
  // quick add-ons that would cover the gap on their own (cheapest first)
  const fillers = useMemo(() => {
    if (!s.nudge) return [];
    return skus
      .filter((x) => x.price >= s.gap && x.price <= s.gap + 400)
      .sort((a, b) => a.price - b.price)
      .slice(0, 3);
  }, [s.nudge, s.gap]);

  if (s.count === 0) return <Empty />;

  return (
    <>
      {/* the bill */}
      <div className="ledger overflow-hidden rounded-3xl border-2 border-ink shadow-[6px_6px_0_var(--color-ink)]">
        <ul>
          {s.items.map((it) => (
            <li key={it.sku.id} className="relative flex items-center gap-3 border-b border-rule py-3 pl-14 pr-3 md:pl-28 md:pr-5">
              <div className="absolute left-1.5 top-1/2 grid size-11 -translate-y-1/2 -rotate-3 place-items-center overflow-hidden rounded-md border border-ink/20 bg-milk md:left-6 md:size-16">
                {it.sku.image ? <Image src={it.sku.image} alt="" width={64} height={64} sizes="64px" className="size-full object-contain p-0.5" /> : <span className="font-gu text-chopda">તેલ</span>}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg leading-tight">{it.sku.name}</p>
                <p className="text-sm text-ink-2">
                  {it.sku.pack} · <span className="font-mono">{inr(it.sku.price)}</span> each
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <Stepper id={it.sku.id} qty={it.qty} label={`${it.sku.name} ${it.sku.pack}`} />
                  <button type="button" onClick={() => cart.remove(it.sku.id)} className="text-sm font-semibold text-chopda underline underline-offset-2" aria-label={`Remove ${it.sku.name} ${it.sku.pack}`}>
                    Remove
                  </button>
                </div>
              </div>
              <p key={it.total} className="animate-pop self-start pt-1 font-mono text-lg font-semibold">{inr(it.total)}</p>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between gap-4 border-t-2 border-ink bg-paper-2/70 py-4 pl-14 pr-5 md:pl-28">
          <span className="font-semibold">
            Total <span className="font-normal text-ink-2">· {s.count} item{s.count > 1 ? "s" : ""}</span>
          </span>
          <span key={s.total} className="animate-pop font-mono text-3xl font-semibold">{inr(s.total)}</span>
        </div>
      </div>
      <Link href="/products" className="mt-3 inline-block text-sm font-semibold text-chopda underline underline-offset-4">
        + Add more from the counter
      </Link>

      {/* free delivery state */}
      <div className="mt-8 grid items-center gap-6 rounded-3xl border-2 border-ink bg-milk p-5 sm:grid-cols-[auto_1fr] sm:p-7">
        <MilkCan progress={s.progress} free={s.free} className="mx-auto h-32 w-auto sm:h-40" />
        <div>
          {s.free ? (
            <>
              <Stamp tone="leaf" className="text-base">Free delivery unlocked</Stamp>
              <p className="mt-3 text-ink-2">The can is full. We’ll deliver this order free, anywhere in India.</p>
            </>
          ) : s.nudge ? (
            <>
              <p className="font-display text-2xl leading-tight">
                Add <span className="text-chopda">{inr(s.gap)}</span> more to unlock <span className="whitespace-nowrap">FREE delivery</span>
              </p>
              <p className="mt-1 text-ink-2">You’re so close. One more thing will do it:</p>
              {fillers.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {fillers.map((f) => (
                    <li key={f.id}>
                      <button type="button" onClick={() => cart.add(f.id)} className="rounded-full border-2 border-ink bg-haldi/30 px-3.5 py-2 text-sm font-semibold hover:bg-haldi">
                        + {f.name} {f.pack} · {inr(f.price)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/products" className="mt-3 inline-block font-semibold text-chopda underline underline-offset-4">
                Back to the counter →
              </Link>
            </>
          ) : (
            <>
              <p className="font-display text-2xl leading-tight">Free delivery starts at {inr(FREE_DELIVERY_AT)}.</p>
              <p className="mt-1 text-ink-2">
                You’re {inr(s.gap)} away. For a smaller order, the quickest way is to drop by your nearest shop.
              </p>
            </>
          )}
          <div className="mt-4">
            <ProgressBar s={s} />
          </div>
        </div>
      </div>

      {/* actions */}
      <div className="mt-6 space-y-3">
        {s.free ? (
          <>
            <button type="button" onClick={onFree} className="w-full rounded-full bg-leaf px-6 py-4 text-lg font-semibold text-milk shadow-[0_5px_0_#1d4425] transition active:translate-y-1 active:shadow-none">
              Order with Free Delivery
            </button>
            <button type="button" onClick={onVisit} className="w-full rounded-full border-2 border-ink px-6 py-3.5 font-semibold">
              Prefer to visit? Get Directions
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={onVisit} className="w-full rounded-full bg-chopda px-6 py-4 text-lg font-semibold text-milk shadow-[0_5px_0_var(--color-chopda-dark)] transition active:translate-y-1 active:shadow-none">
              Get Directions to Nearest Store
            </button>
            <button type="button" onClick={onPaid} className="w-full rounded-full border-2 border-ink px-6 py-3.5 font-semibold">
              Continue the order anyway <span className="font-normal text-ink-2">(delivery charges apply)</span>
            </button>
          </>
        )}
      </div>
    </>
  );
}

/* ───────────────────────── details ───────────────────────── */

const field = "mt-1.5 w-full rounded-xl border-2 border-ink/25 bg-milk px-4 py-3 text-base outline-none focus:border-ink aria-[invalid=true]:border-chopda";

function Details({ customer: c, onChange, onNext }: { customer: Customer; onChange: (c: Customer) => void; onNext: () => void }) {
  const [touched, setTouched] = useState(false);
  const errors = {
    name: c.name.trim().length < 2 ? "Please write your name." : null,
    mobile: cleanMobile(c.mobile) ? null : "A 10-digit Indian mobile number, please.",
    address: c.address.trim().length < 10 ? "Full address with house no., street and city." : null,
    pincode: validPincode(c.pincode) ? null : "6-digit pincode.",
  };
  const ok = !Object.values(errors).some(Boolean);
  const set = (k: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...c, [k]: e.target.value });
  const err = (k: keyof typeof errors) =>
    touched && errors[k] ? (
      <span id={`e-${k}`} className="mt-1 block text-sm font-normal text-chopda">
        {errors[k]}
      </span>
    ) : null;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (ok) onNext();
      }}
      className="ledger space-y-5 rounded-3xl border-2 border-ink p-5 pl-14 shadow-[6px_6px_0_var(--color-ink)] md:p-8 md:pl-28"
    >
      <label className="block font-semibold">
        Name
        <input value={c.name} onChange={set("name")} autoComplete="name" className={field} aria-invalid={touched && !!errors.name} aria-describedby="e-name" />
        {err("name")}
      </label>
      <label className="block font-semibold">
        Mobile number
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 mt-[3px] -translate-y-1/2 font-mono text-ink-2">+91</span>
          <input value={c.mobile} onChange={set("mobile")} type="tel" inputMode="numeric" autoComplete="tel-national" className={`${field} pl-14 font-mono`} aria-invalid={touched && !!errors.mobile} aria-describedby="e-mobile" />
        </div>
        {err("mobile")}
      </label>
      <label className="block font-semibold">
        Full delivery address
        <textarea value={c.address} onChange={set("address")} rows={3} autoComplete="street-address" className={field} aria-invalid={touched && !!errors.address} aria-describedby="e-address" placeholder="House / flat, society, street, landmark, city" />
        {err("address")}
      </label>
      <label className="block font-semibold">
        Pincode
        <input value={c.pincode} onChange={set("pincode")} inputMode="numeric" maxLength={6} autoComplete="postal-code" className={`${field} max-w-40 font-mono`} aria-invalid={touched && !!errors.pincode} aria-describedby="e-pincode" />
        {err("pincode")}
      </label>
      <label className="block font-semibold">
        Notes <span className="font-normal text-ink-2">(optional)</span>
        <textarea value={c.notes} onChange={set("notes")} rows={2} className={field} placeholder="Delivery time, gate code, ‘ring twice’…" />
      </label>
      <button type="submit" className="w-full rounded-full bg-ink px-6 py-4 text-lg font-semibold text-milk shadow-[0_5px_0_var(--color-chopda)] transition active:translate-y-1 active:shadow-none">
        Review order →
      </button>
      <p className="text-center text-xs text-ink-2">Saved on this phone only, so next time is quicker.</p>
    </form>
  );
}

/* ───────────────────────── review ───────────────────────── */

function Review({ s, free, store, customer, onSent, onEdit }: { s: Summary; free: boolean; store: Picked["store"]; customer: Customer; onSent: (msg: string) => void; onEdit: () => void }) {
  const message = orderMessage({ store, customer, items: s.items, total: s.total, free });
  const [showMsg, setShowMsg] = useState(false);
  return (
    <div className="space-y-6">
      <div className="ledger overflow-hidden rounded-3xl border-2 border-ink shadow-[6px_6px_0_var(--color-ink)]">
        <div className="border-b-2 border-ink bg-paper-2/70 py-4 pl-14 pr-5 md:pl-28">
          {free ? <Stamp tone="leaf">Free delivery</Stamp> : <Stamp>Delivery charges apply</Stamp>}
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-chopda">To</p>
          <p className="font-display text-2xl">Karnavati Dairy, {store.name}</p>
          <p className="text-sm text-ink-2">{store.city} · via WhatsApp</p>
        </div>
        <ul className="py-2 pl-14 pr-5 md:pl-28">
          {s.items.map((it) => (
            <li key={it.sku.id} className="flex justify-between gap-3 py-2.5 leading-snug">
              <span>
                {it.sku.name} <span className="text-ink-2">({it.sku.pack})</span> <span className="font-mono text-ink-2">× {it.qty}</span>
              </span>
              <span className="font-mono font-semibold">{inr(it.total)}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t-2 border-ink py-4 pl-14 pr-5 md:pl-28">
          <span className="font-semibold">Grand total</span>
          <span className="font-mono text-3xl font-semibold">{inr(s.total)}</span>
        </div>
      </div>

      <div className="rounded-3xl border-2 border-ink bg-milk p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-chopda">Deliver to</p>
            <p className="mt-1 font-semibold">{customer.name}</p>
            <p className="font-mono text-sm">+91 {cleanMobile(customer.mobile)}</p>
            <p className="mt-1 text-ink-2">
              {customer.address}, {customer.pincode}
            </p>
            {customer.notes.trim() && <p className="mt-1 font-hand text-xl text-ink-2">“{customer.notes.trim()}”</p>}
          </div>
          <button type="button" onClick={onEdit} className="shrink-0 text-sm font-semibold text-chopda underline">
            Edit
          </button>
        </div>
      </div>

      {/* payment terms, clearly before sending */}
      <div className="rounded-3xl border-2 border-haldi bg-haldi/15 p-5">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-chopda-dark">Payment terms</p>
        {s.total > ADVANCE ? (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-milk p-4">
              <p className="text-sm text-ink-2">Advance to confirm</p>
              <p className="font-mono text-2xl font-semibold">{inr(ADVANCE)}</p>
            </div>
            <div className="rounded-2xl bg-milk p-4">
              <p className="text-sm text-ink-2">Balance on delivery</p>
              <p className="font-mono text-2xl font-semibold">{inr(s.total - ADVANCE)}</p>
              {!free && <p className="text-xs text-ink-2">+ delivery charges</p>}
            </div>
          </div>
        ) : null}
        <p className="mt-3 font-semibold">{paymentTerms(s.total, free)}</p>
        <p className="mt-2 text-sm text-ink-2">
          You pay the advance directly to the shop on WhatsApp after they confirm. This website never asks for or takes any payment.
        </p>
      </div>

      <button type="button" onClick={() => setShowMsg((v) => !v)} className="text-sm font-semibold text-chopda underline underline-offset-4">
        {showMsg ? "Hide" : "Preview"} the WhatsApp message
      </button>
      {showMsg && <pre className="whitespace-pre-wrap rounded-2xl border border-ink/20 bg-[#e7f6df] p-4 font-mono text-[13px] leading-relaxed">{message}</pre>}

      <a
        href={waLink(store.whatsapp, message)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onSent(message)}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1fa855] px-6 py-4 text-lg font-semibold text-white shadow-[0_5px_0_#126b35] transition active:translate-y-1 active:shadow-none"
      >
        <WhatsAppIcon /> Send order on WhatsApp
      </a>
      <p className="text-center text-sm text-ink-2">WhatsApp opens with your order written out. Press send there.</p>
    </div>
  );
}

/* ───────────────────────── sent ───────────────────────── */

function Sent({ snapshot, storeName, waHref, onNew, onDirections }: { snapshot: { message: string; total: number; free: boolean }; storeName: string; waHref: string; onNew: () => void; onDirections: () => void }) {
  const [copied, setCopied] = useState<null | boolean>(null);
  return (
    <div className="space-y-6">
      <div className="ledger relative overflow-hidden rounded-3xl border-2 border-ink p-6 pl-14 shadow-[6px_6px_0_var(--color-ink)] md:pl-28">
        <Stamp tone="leaf" className="mb-4 text-base">
          Sent · <span className="font-gu normal-case tracking-normal">જમા</span>
        </Stamp>
        <p className="max-w-[16ch] font-display text-3xl leading-tight">Your order is on its way to {storeName}.</p>
        <p className="mt-3 text-ink-2">
          Once you press send in WhatsApp, the shop will reply to confirm and share how to pay the {inr(ADVANCE)} advance.
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <dt className="text-sm text-ink-2">Grand total</dt>
            <dd className="font-mono text-2xl font-semibold">{inr(snapshot.total)}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-2">Delivery</dt>
            <dd className="font-mono text-2xl font-semibold">{snapshot.free ? "FREE" : "As quoted"}</dd>
          </div>
        </dl>
      </div>

      <pre className="whitespace-pre-wrap rounded-2xl border border-ink/20 bg-[#e7f6df] p-4 font-mono text-[13px] leading-relaxed">{snapshot.message}</pre>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={async () => setCopied(await copyText(snapshot.message))}
          className="rounded-full border-2 border-ink bg-milk px-6 py-3.5 font-semibold"
        >
          {copied === true ? "Copied ✓" : "Copy order"}
        </button>
        <a href={waHref} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-[#1fa855] px-6 py-3.5 font-semibold text-white">
          <WhatsAppIcon /> Open WhatsApp again
        </a>
      </div>
      {copied === false && <p className="text-sm text-chopda">Couldn’t copy automatically. Press and hold the message above to copy it.</p>}
      <p className="text-sm text-ink-2">WhatsApp didn’t open? Copy the order and send it to the shop yourself.</p>

      <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/15 pt-5">
        <button type="button" onClick={onNew} className="font-semibold text-chopda underline underline-offset-4">
          Start a new hisaab
        </button>
        <button type="button" onClick={onDirections} className="font-semibold text-chopda underline underline-offset-4">
          Directions to {storeName}
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────── bits ───────────────────────── */

function StickyAction({ disabled, onClick, children }: { disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <div className="sticky bottom-[calc(84px+env(safe-area-inset-bottom))] z-20 mt-6 md:bottom-4">
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="w-full rounded-full bg-ink px-6 py-4 text-lg font-semibold text-milk shadow-[0_5px_0_var(--color-chopda)] transition active:translate-y-1 active:shadow-none disabled:bg-ink/40 disabled:shadow-none"
      >
        {children}
      </button>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.8-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.3Z" />
    </svg>
  );
}
