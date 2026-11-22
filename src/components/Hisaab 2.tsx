"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { skus } from "@/data/catalogue";
import { storeById } from "@/data/stores";
import { ADVANCE, cart, FREE_DELIVERY_AT, inr, NUDGE_FROM, summarise, useLines } from "@/lib/cart";
import { cleanMobile, orderMessage, paymentTerms, validPincode, waLink, type Customer } from "@/lib/order";
import { bandhi, freqLabel, getLastStore, sameLines, setLastStore, useBandhi, type Freq } from "@/lib/bandhi";
import { useLang, useTr } from "@/lib/lang";
import { drawBill, shareOrSave } from "@/lib/billImage";
import { play } from "@/lib/sound";
import { InkTotal, MilkCan, Stamp, Stepper } from "@/components/bits";
import StorePicker, { type Picked } from "@/components/StorePicker";
import Directions, { copyText } from "@/components/Directions";
import T from "@/components/T";
import { FREE_DELIVERY_AREAS, isFreeDeliveryPin } from "@/config/delivery";
import type { Detected } from "@/lib/locate";

type Step = "bill" | "visit" | "store" | "details" | "review" | "sent";
type Mode = "free" | "paid"; // free delivery (3000+) or "continue anyway"
type Snapshot = { message: string; total: number; free: boolean; items: ReturnType<typeof summarise>["items"] };

const CUSTOMER_KEY = "kd-customer-v1";
const blank: Customer = { name: "", mobile: "", address: "", pincode: "", notes: "" };
const detailsOk = (c: Customer) => c.name.trim().length >= 2 && !!cleanMobile(c.mobile) && c.address.trim().length >= 10 && validPincode(c.pincode);

export default function Hisaab() {
  const lines = useLines();
  const s = summarise(lines);
  const saved = useBandhi();
  const [step, setStep] = useState<Step>("bill");
  const [mode, setMode] = useState<Mode>("free");
  const [picked, setPicked] = useState<Picked | null>(null);
  const [customer, setCustomer] = useState<Customer>(blank);
  const [sentSnapshot, setSentSnapshot] = useState<Snapshot | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const go = (next: Step) => {
    setStep(next);
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  // restore saved details + usual shop; "?bandhi=1" jumps a repeat order straight to review when everything is known
  useEffect(() => {
    let c = blank;
    try {
      const raw = localStorage.getItem(CUSTOMER_KEY);
      if (raw) c = { ...blank, ...JSON.parse(raw), notes: "" };
    } catch {}
    const usual = storeById(getLastStore() ?? "") ?? null;
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydrate from device storage */
    setCustomer(c);
    if (usual) setPicked({ store: usual, km: null });
    const quick = new URLSearchParams(window.location.search).get("bandhi") === "1";
    if (quick && usual && detailsOk(c) && summarise(lines).free) {
      setMode("free");
      setStep("review");
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const freeLost = mode === "free" && !s.free && (step === "store" || step === "details" || step === "review");
  const emptyMidway = s.count === 0 && step !== "bill" && step !== "visit" && step !== "sent";
  const regular = saved && sameLines(lines, saved.lines) ? freqLabel[saved.freq].en : null;
  const [detected, setDetected] = useState<Detected | null>(null);
  // free delivery needs ₹3,000+ AND a delivery PIN inside FREE_DELIVERY_AREAS (Ahmedabad)
  const freeHere = mode === "free" && s.free && isFreeDeliveryPin(customer.pincode);
  const outsideFree = mode === "free" && !!detected && !detected.free;
  const onDetect = (d: Detected | null) => {
    setDetected(d);
    if (!d) return;
    // auto-fill the delivery PIN and area from what we detected
    setCustomer((c) => ({ ...c, pincode: d.pin ?? c.pincode, address: c.address.trim() ? c.address : d.area ? `${d.area}, ` : c.address }));
  };

  return (
    <div ref={topRef} className="mx-auto max-w-3xl scroll-mt-4 px-4 pt-10 sm:px-6 sm:pt-14">
      <Header step={step} mode={mode} onBack={() => go(step === "review" ? "details" : step === "details" ? "store" : "bill")} />

      {emptyMidway ? (
        <Empty />
      ) : (
        <>
          {freeLost && (
            <div role="alert" className="mb-5 rounded-2xl border-2 border-chopda bg-chopda/5 p-4">
              <p className="font-semibold">
                <T
                  en={`Your total is now ${inr(s.total)}, below ${inr(FREE_DELIVERY_AT)}, so free delivery no longer applies.`}
                  gu={`તમારો કુલ હવે ${inr(s.total)} છે, ${inr(FREE_DELIVERY_AT)} થી ઓછો, એટલે મફત ડિલિવરી લાગુ નથી.`}
                />
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => go("bill")} className="rounded-full bg-ink px-4 py-2 font-semibold text-milk">
                  <T en="Back to the hisaab" gu="હિસાબ પર પાછા" />
                </button>
                <button type="button" onClick={() => setMode("paid")} className="rounded-full border-2 border-ink px-4 py-2 font-semibold">
                  <T en="Continue with delivery charges" gu="ડિલિવરી ચાર્જ સાથે આગળ વધો" />
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
              <p className="mb-4 text-ink-2">
                <T en="Your order goes to this shop on WhatsApp. They’ll pack it and deliver it." gu="તમારો ઓર્ડર WhatsApp પર આ દુકાને જશે. તેઓ પેક કરીને પહોંચાડશે." />
              </p>
              {picked && picked.km == null && picked.store.id === getLastStore() && (
                <p className="mb-4 font-hand text-2xl text-leaf">
                  <T en={`your usual shop: ${picked.store.name} ✓`} gu={<span className="text-lg">તમારી હંમેશની દુકાન: {picked.store.name} ✓</span>} />
                </p>
              )}
              <StorePicker selectedId={picked?.store.id ?? null} onPick={setPicked} onDetect={onDetect} showFreeInfo={mode === "free"} />
              {outsideFree && picked && (
                <div role="alert" className="mt-6 space-y-4">
                  <div className="rounded-2xl border-2 border-chopda bg-chopda/5 p-4">
                    <p className="font-semibold">
                      <T en="Free delivery is available only in Ahmedabad." gu="મફત ડિલિવરી ફક્ત અમદાવાદમાં જ છે." />
                    </p>
                    <p className="mt-1 text-sm text-ink-2">
                      <T
                        en={`${detected?.area ?? "Your location"} is outside our free-delivery area (${FREE_DELIVERY_AREAS.label.en}). Visit your nearest shop, or order on WhatsApp and the shop will tell you the delivery charge.`}
                        gu={`${detected?.area ?? "તમારું સ્થાન"} અમારા મફત ડિલિવરી વિસ્તાર (${FREE_DELIVERY_AREAS.label.gu}) ની બહાર છે. નજીકની દુકાને આવો, અથવા WhatsApp પર ઓર્ડર કરો — દુકાન ડિલિવરી ચાર્જ જણાવશે.`}
                      />
                    </p>
                  </div>
                  <Directions store={picked.store} km={picked.km} />
                </div>
              )}
              <StickyAction
                disabled={!picked}
                onClick={() => {
                  if (outsideFree) setMode("paid");
                  go("details");
                }}
              >
                {!picked ? (
                  <T en="Choose a shop to continue" gu="આગળ વધવા દુકાન પસંદ કરો" />
                ) : outsideFree ? (
                  <T en={`Order on WhatsApp from ${picked.store.name} · delivery charges apply →`} gu={`${picked.store.name} પર WhatsApp ઓર્ડર · ડિલિવરી ચાર્જ લાગશે →`} />
                ) : (
                  <T en={`Deliver from ${picked.store.name} →`} gu={`${picked.store.name} થી ડિલિવરી →`} />
                )}
              </StickyAction>
            </section>
          )}

          {step === "details" && picked && (
            <Details
              customer={customer}
              onChange={setCustomer}
              onNext={() => {
                try {
                  const keep: Partial<Customer> = { ...customer };
                  delete keep.notes;
                  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(keep));
                } catch {}
                go("review");
              }}
            />
          )}

          {step === "review" && picked && (
            <Review
              s={s}
              free={freeHere}
              wantedFree={mode === "free" && s.free}
              store={picked.store}
              customer={customer}
              regular={regular}
              onSent={(message) => {
                setLastStore(picked.store.id);
                if (regular) bandhi.setStore(picked.store.id);
                setSentSnapshot({ message, total: s.total, free: freeHere, items: s.items });
                go("sent");
              }}
              onEdit={() => go("details")}
              onShop={() => go("store")}
            />
          )}

          {step === "sent" && picked && sentSnapshot && (
            <Sent
              snapshot={sentSnapshot}
              storeName={picked.store.name}
              storeId={picked.store.id}
              waHref={waLink(picked.store.whatsapp, sentSnapshot.message)}
              onNew={() => {
                cart.clear();
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
    bill: ["Your hisaab", "તમારો હિસાબ"],
    visit: ["Your nearest shop", "નજીકની દુકાન"],
    store: ["Which shop delivers?", "કઈ દુકાન પહોંચાડશે?"],
    details: ["Where should it come?", "ક્યાં પહોંચાડવું?"],
    review: ["Check & send", "તપાસો અને મોકલો"],
    sent: ["Written in the book", "ચોપડામાં લખાઈ ગયું"],
  };
  const flow: Step[] = ["store", "details", "review", "sent"];
  const n = flow.indexOf(step);
  return (
    <div className="mb-6">
      {step !== "bill" && step !== "sent" && (
        <button type="button" onClick={onBack} className="mb-3 text-sm font-semibold text-chopda">
          ← <T en="Back" gu="પાછા" />
        </button>
      )}
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-chopda">
        {n >= 0 ? (
          <T
            en={`Step ${n + 1} of 4 · ${mode === "free" ? "free delivery" : "delivery"}`}
            gu={`પગલું ${n + 1} / 4 · ${mode === "free" ? "મફત ડિલિવરી" : "ડિલિવરી"}`}
          />
        ) : (
          <T en="Hisaab" gu="હિસાબ" />
        )}
      </p>
      <h1 className="mt-1 font-display text-5xl leading-[0.95] sm:text-6xl">
        <T en={titles[step][0]} gu={titles[step][1]} />
      </h1>
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
      <p className="mt-4 font-display text-3xl">
        <T en="The page is blank." gu="પાનું કોરું છે." />
      </p>
      <p className="mt-2 text-ink-2">
        <T
          en={`Nothing written in your hisaab yet. Fill the can to ${inr(FREE_DELIVERY_AT)} and delivery is free.`}
          gu={`તમારા હિસાબમાં હજુ કંઈ લખાયું નથી. કેન ${inr(FREE_DELIVERY_AT)} સુધી ભરો, ડિલિવરી મફત.`}
        />
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/products" transitionTypes={["turn-back"]} className="rounded-full bg-chopda px-6 py-3.5 font-semibold text-milk shadow-[0_4px_0_var(--color-chopda-dark)]">
          <T en="Open the counter" gu="દુકાન ખોલો" />
        </Link>
        <Link href="/stores" transitionTypes={["turn-fwd"]} className="rounded-full border-2 border-ink px-6 py-3 font-semibold">
          <T en="Just find my nearest shop" gu="ફક્ત નજીકની દુકાન શોધો" />
        </Link>
      </div>
    </div>
  );
}

function ProgressBar({ s }: { s: Summary }) {
  const nudgeAt = (NUDGE_FROM / FREE_DELIVERY_AT) * 100;
  const tr = useTr();
  return (
    <div>
      <div className="relative mb-1 h-4 font-mono text-[11px] text-ink-2" aria-hidden>
        <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${nudgeAt}%` }}>
          ₹2,500 ↓
        </span>
      </div>
      <div
        className="relative h-4 overflow-hidden rounded-full border-2 border-ink bg-milk"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={FREE_DELIVERY_AT}
        aria-valuenow={Math.min(s.total, FREE_DELIVERY_AT)}
        aria-label={tr("Progress toward free delivery", "મફત ડિલિવરી તરફ પ્રગતિ")}
      >
        <div className={`h-full transition-[width] duration-700 ease-out ${s.free ? "bg-leaf" : s.nudge ? "bg-haldi" : "bg-chopda"}`} style={{ width: `${s.progress * 100}%` }} />
        <span className="absolute inset-y-0 w-0.5 bg-ink/40" style={{ left: `${nudgeAt}%` }} aria-hidden />
      </div>
      <div className="relative mt-1 h-4 font-mono text-[11px] text-ink-2">
        <span className="absolute left-0">₹0</span>
        <span className="absolute right-0">
          ₹3,000 · <T en="free" gu="મફત" />
        </span>
      </div>
    </div>
  );
}

function Bill({ s, onFree, onPaid, onVisit }: { s: Summary; onFree: () => void; onPaid: () => void; onVisit: () => void }) {
  const tr = useTr();
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
      <div className="ledger overflow-hidden rounded-3xl border-2 border-ink shadow-[6px_6px_0_var(--color-ink)]">
        <ul>
          {s.items.map((it) => (
            <li key={it.sku.id} className="relative flex items-center gap-3 border-b border-rule py-3 pl-14 pr-3 md:pl-28 md:pr-5">
              <div className="absolute left-1.5 top-1/2 grid size-11 -translate-y-1/2 -rotate-3 place-items-center overflow-hidden rounded-md border border-ink/20 bg-milk md:left-6 md:size-16">
                {it.sku.image ? <Image src={it.sku.image} alt="" width={64} height={64} sizes="64px" className="size-full object-contain p-0.5" /> : <span className="font-gu text-chopda">તેલ</span>}
              </div>
              <div className="min-w-0 flex-1">
                {/* each new line is inked into the book */}
                <p className="ink-in font-display text-lg leading-tight">
                  <T en={it.sku.name} gu={it.sku.nameGu} />
                </p>
                <p className="text-sm text-ink-2">
                  <T en={it.sku.pack} gu={it.sku.packGu} /> · <span className="font-mono">{inr(it.sku.price)}</span> <T en="each" gu="દરેક" />
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <Stepper id={it.sku.id} qty={it.qty} label={tr(`${it.sku.name} ${it.sku.pack}`, `${it.sku.nameGu} ${it.sku.packGu}`)} />
                  <button
                    type="button"
                    onClick={() => {
                      play("tick");
                      cart.remove(it.sku.id);
                    }}
                    className="text-sm font-semibold text-chopda underline underline-offset-2"
                    aria-label={tr(`Remove ${it.sku.name} ${it.sku.pack}`, `${it.sku.nameGu} ${it.sku.packGu} કાઢો`)}
                  >
                    <T en="Remove" gu="કાઢો" />
                  </button>
                </div>
              </div>
              <InkTotal value={it.total} className="self-start pt-1 font-mono text-lg font-semibold" />
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between gap-4 border-t-2 border-ink bg-paper-2/70 py-4 pl-14 pr-5 md:pl-28">
          <span className="font-semibold">
            <T en="Total" gu="કુલ" />{" "}
            <span className="font-normal text-ink-2">
              · <T en={`${s.count} item${s.count > 1 ? "s" : ""}`} gu={`${s.count} વસ્તુ`} />
            </span>
          </span>
          <InkTotal value={s.total} className="pt-3 font-mono text-3xl font-semibold" />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <Link href="/products" transitionTypes={["turn-back"]} className="text-sm font-semibold text-chopda underline underline-offset-4">
          <T en="+ Add more from the counter" gu="+ દુકાનમાંથી વધુ ઉમેરો" />
        </Link>
        <SaveBandhi />
      </div>

      {/* free delivery state */}
      <div className="mt-8 grid items-center gap-6 rounded-3xl border-2 border-ink bg-milk p-5 sm:grid-cols-[auto_1fr] sm:p-7">
        <MilkCan progress={s.progress} free={s.free} className="mx-auto h-32 w-auto sm:h-40" />
        <div>
          {s.free ? (
            <>
              <Stamp tone="leaf" className="text-base" sound="bell">
                <T en="Free delivery unlocked" gu="મફત ડિલિવરી મળી" />
              </Stamp>
              <p className="mt-3 text-ink-2">
                <T en="The can is full. We’ll deliver this order free anywhere in Ahmedabad — we check your PIN code next." gu="કેન ભરાઈ ગયું. અમદાવાદમાં ક્યાંય પણ આ ઓર્ડર મફત પહોંચાડીશું — આગળ પિનકોડ તપાસીશું." />
              </p>
            </>
          ) : s.nudge ? (
            <>
              <p className="font-display text-2xl leading-tight">
                <T
                  en={<>Add <span className="text-chopda">{inr(s.gap)}</span> more to unlock <span className="whitespace-nowrap">FREE delivery</span></>}
                  gu={<>મફત ડિલિવરી માટે ફક્ત <span className="text-chopda">{inr(s.gap)}</span> વધુ ઉમેરો</>}
                />
              </p>
              <p className="mt-1 text-ink-2">
                <T en="You’re so close. One more thing will do it:" gu="બસ થોડું જ બાકી. એક વસ્તુ ઉમેરો એટલે થઈ જશે:" />
              </p>
              {fillers.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {fillers.map((f) => (
                    <li key={f.id}>
                      <button type="button" onClick={() => cart.add(f.id)} className="rounded-full border-2 border-ink bg-haldi/30 px-3.5 py-2 text-sm font-semibold hover:bg-haldi">
                        + <T en={`${f.name} ${f.pack}`} gu={`${f.nameGu} ${f.packGu}`} /> · {inr(f.price)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/products" transitionTypes={["turn-back"]} className="mt-3 inline-block font-semibold text-chopda underline underline-offset-4">
                <T en="Back to the counter →" gu="દુકાન પર પાછા →" />
              </Link>
            </>
          ) : (
            <>
              <p className="font-display text-2xl leading-tight">
                <T en={`Free delivery starts at ${inr(FREE_DELIVERY_AT)}.`} gu={`મફત ડિલિવરી ${inr(FREE_DELIVERY_AT)} થી શરૂ થાય છે.`} />
              </p>
              <p className="mt-1 text-ink-2">
                <T
                  en={`You’re ${inr(s.gap)} away. For a smaller order, the quickest way is to drop by your nearest shop.`}
                  gu={`હજુ ${inr(s.gap)} બાકી. નાના ઓર્ડર માટે સૌથી ઝડપી રસ્તો છે નજીકની દુકાને આવી જવું.`}
                />
              </p>
            </>
          )}
          <div className="mt-4">
            <ProgressBar s={s} />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {s.free ? (
          <>
            <button type="button" onClick={onFree} className="w-full rounded-full bg-leaf px-6 py-4 text-lg font-semibold text-milk shadow-[0_5px_0_#1d4425] transition active:translate-y-1 active:shadow-none">
              <T en="Order with Free Delivery" gu="મફત ડિલિવરી સાથે ઓર્ડર કરો" />
            </button>
            <button type="button" onClick={onVisit} className="w-full rounded-full border-2 border-ink px-6 py-3.5 font-semibold">
              <T en="Prefer to visit? Get Directions" gu="દુકાને આવવું છે? રસ્તો જુઓ" />
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={onVisit} className="w-full rounded-full bg-chopda px-6 py-4 text-lg font-semibold text-milk shadow-[0_5px_0_var(--color-chopda-dark)] transition active:translate-y-1 active:shadow-none">
              <T en="Get Directions to Nearest Store" gu="નજીકની દુકાનનો રસ્તો જુઓ" />
            </button>
            <button type="button" onClick={onPaid} className="w-full rounded-full border-2 border-ink px-6 py-3.5 font-semibold">
              <T en="Continue the order anyway" gu="તોપણ ઓર્ડર ચાલુ રાખો" />{" "}
              <span className="font-normal text-ink-2">
                <T en="(delivery charges apply)" gu="(ડિલિવરી ચાર્જ લાગશે)" />
              </span>
            </button>
          </>
        )}
      </div>
    </>
  );
}

/** "Save as my regular order" — the bandhi. */
function SaveBandhi() {
  const lines = useLines();
  const saved = useBandhi();
  const [open, setOpen] = useState(false);
  const [freq, setFreq] = useState<Freq>(saved?.freq ?? "daily");
  const isSaved = !!saved && sameLines(saved.lines, lines);

  if (isSaved && !open) {
    return (
      <p className="flex items-center gap-2 text-sm">
        <Stamp tone="leaf" className="text-xs" sound={null}>
          <T en={`Regular · ${freqLabel[saved.freq].en}`} gu={`નિયમિત · ${freqLabel[saved.freq].gu}`} />
        </Stamp>
        <button type="button" onClick={() => setOpen(true)} className="font-semibold text-ink-2 underline">
          <T en="change" gu="બદલો" />
        </button>
      </p>
    );
  }
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="rounded-full border-2 border-dashed border-chopda px-4 py-1.5 text-sm font-semibold text-chopda hover:bg-chopda/5">
        {saved ? <T en="↻ Make this my regular order" gu="↻ આને નિયમિત ઓર્ડર બનાવો" /> : <T en="☆ Save as my regular order" gu="☆ નિયમિત ઓર્ડર તરીકે સાચવો" />}
      </button>
    );
  }
  return (
    <div className="w-full rounded-2xl border-2 border-dashed border-chopda bg-milk p-4">
      <p className="font-semibold">
        <T en="How often do you need this?" gu="આ કેટલી વાર જોઈએ છે?" />
      </p>
      <p className="text-sm text-ink-2">
        <T
          en="We’ll keep it on this phone (your bandhi), so next time it’s one tap to order again."
          gu="અમે આ ફોનમાં સાચવી રાખીશું (તમારી બાંધી), જેથી આવતી વખતે એક ટૅપમાં ફરી ઓર્ડર થાય."
        />
      </p>
      <div className="mt-3 flex flex-wrap gap-2" role="radiogroup">
        {(Object.keys(freqLabel) as Freq[]).map((f) => (
          <button
            key={f}
            type="button"
            role="radio"
            aria-checked={freq === f}
            onClick={() => setFreq(f)}
            className={`rounded-full border-2 px-3.5 py-1.5 text-sm font-semibold ${freq === f ? "border-ink bg-ink text-milk" : "border-ink/25"}`}
          >
            <T en={freqLabel[f].en} gu={freqLabel[f].gu} />
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          onClick={() => {
            bandhi.save(lines, freq, null);
            setOpen(false);
          }}
          className="rounded-full bg-chopda px-5 py-2 font-semibold text-milk"
        >
          <T en="Save" gu="સાચવો" />
        </button>
        <button type="button" onClick={() => setOpen(false)} className="font-semibold text-ink-2 underline">
          <T en="Cancel" gu="રદ કરો" />
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────── details ───────────────────────── */

const field = "mt-1.5 w-full rounded-xl border-2 border-ink/25 bg-milk px-4 py-3 text-base outline-none focus:border-ink aria-[invalid=true]:border-chopda";

function Details({ customer: c, onChange, onNext }: { customer: Customer; onChange: (c: Customer) => void; onNext: () => void }) {
  const [touched, setTouched] = useState(false);
  const tr = useTr();
  const errors = {
    name: c.name.trim().length < 2 ? tr("Please write your name.", "કૃપા કરી તમારું નામ લખો.") : null,
    mobile: cleanMobile(c.mobile) ? null : tr("A 10-digit Indian mobile number, please.", "10 આંકડાનો મોબાઇલ નંબર લખો."),
    address: c.address.trim().length < 10 ? tr("Full address with house no., street and city.", "ઘર નં., શેરી અને શહેર સાથે પૂરું સરનામું.") : null,
    pincode: validPincode(c.pincode) ? null : tr("6-digit pincode.", "6 આંકડાનો પિનકોડ."),
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
        <T en="Name" gu="નામ" />
        <input value={c.name} onChange={set("name")} autoComplete="name" className={field} aria-invalid={touched && !!errors.name} aria-describedby="e-name" />
        {err("name")}
      </label>
      <label className="block font-semibold">
        <T en="Mobile number" gu="મોબાઇલ નંબર" />
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 mt-[3px] -translate-y-1/2 font-mono text-ink-2">+91</span>
          <input value={c.mobile} onChange={set("mobile")} type="tel" inputMode="numeric" autoComplete="tel-national" className={`${field} pl-14 font-mono`} aria-invalid={touched && !!errors.mobile} aria-describedby="e-mobile" />
        </div>
        {err("mobile")}
      </label>
      <label className="block font-semibold">
        <T en="Full delivery address" gu="પૂરું ડિલિવરી સરનામું" />
        <textarea
          value={c.address}
          onChange={set("address")}
          rows={3}
          autoComplete="street-address"
          className={field}
          aria-invalid={touched && !!errors.address}
          aria-describedby="e-address"
          placeholder={tr("House / flat, society, street, landmark, city", "ઘર / ફ્લેટ, સોસાયટી, શેરી, નિશાની, શહેર")}
        />
        {err("address")}
      </label>
      <label className="block font-semibold">
        <T en="Pincode" gu="પિનકોડ" />
        <input value={c.pincode} onChange={set("pincode")} inputMode="numeric" maxLength={6} autoComplete="postal-code" className={`${field} max-w-40 font-mono`} aria-invalid={touched && !!errors.pincode} aria-describedby="e-pincode" />
        {err("pincode")}
      </label>
      <label className="block font-semibold">
        <T en="Notes" gu="નોંધ" />{" "}
        <span className="font-normal text-ink-2">
          <T en="(optional)" gu="(વૈકલ્પિક)" />
        </span>
        <textarea value={c.notes} onChange={set("notes")} rows={2} className={field} placeholder={tr("Delivery time, gate code, ‘ring twice’…", "ડિલિવરીનો સમય, ગેટ કોડ, ‘બે વાર બેલ’…")} />
      </label>
      <button type="submit" className="w-full rounded-full bg-ink px-6 py-4 text-lg font-semibold text-milk shadow-[0_5px_0_var(--color-chopda)] transition active:translate-y-1 active:shadow-none">
        <T en="Review order →" gu="ઓર્ડર તપાસો →" />
      </button>
      <p className="text-center text-xs text-ink-2">
        <T en="Saved on this phone only, so next time is quicker." gu="ફક્ત આ ફોનમાં સચવાય છે, જેથી આવતી વખતે ઝડપી થાય." />
      </p>
    </form>
  );
}

/* ───────────────────────── review ───────────────────────── */

function Review({
  s,
  free,
  wantedFree,
  store,
  customer,
  regular,
  onSent,
  onEdit,
  onShop,
}: {
  s: Summary;
  free: boolean;
  wantedFree: boolean;
  store: Picked["store"];
  customer: Customer;
  regular: string | null;
  onSent: (msg: string) => void;
  onEdit: () => void;
  onShop: () => void;
}) {
  const message = orderMessage({ store, customer, items: s.items, total: s.total, free, regular });
  const [showMsg, setShowMsg] = useState(false);
  return (
    <div className="space-y-6">
      {wantedFree && !free && (
        <div role="alert" className="rounded-2xl border-2 border-chopda bg-chopda/5 p-4">
          <p className="font-semibold">
            <T en={`PIN ${customer.pincode} is outside our free-delivery area.`} gu={`પિન ${customer.pincode} મફત ડિલિવરી વિસ્તારની બહાર છે.`} />
          </p>
          <p className="mt-1 text-sm text-ink-2">
            <T en="Free delivery is available only in Ahmedabad. The shop will confirm the delivery charge on WhatsApp." gu="મફત ડિલિવરી ફક્ત અમદાવાદમાં છે. દુકાન WhatsApp પર ડિલિવરી ચાર્જ કન્ફર્મ કરશે." />
          </p>
        </div>
      )}
      <div className="ledger overflow-hidden rounded-3xl border-2 border-ink shadow-[6px_6px_0_var(--color-ink)]">
        <div className="border-b-2 border-ink bg-paper-2/70 py-4 pl-14 pr-5 md:pl-28">
          {free ? (
            <Stamp tone="leaf">
              <T en="Free delivery" gu="મફત ડિલિવરી" />
            </Stamp>
          ) : (
            <Stamp>
              <T en="Delivery charges apply" gu="ડિલિવરી ચાર્જ લાગશે" />
            </Stamp>
          )}
          <div className="mt-3 flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-chopda">
                <T en="To" gu="પ્રતિ" />
              </p>
              <p className="font-display text-2xl">Karnavati Dairy, {store.name}</p>
              <p className="text-sm text-ink-2">
                {store.city} · <T en="via WhatsApp" gu="WhatsApp દ્વારા" />
              </p>
            </div>
            <button type="button" onClick={onShop} className="shrink-0 text-sm font-semibold text-chopda underline">
              <T en="Change" gu="બદલો" />
            </button>
          </div>
          {regular && (
            <p className="mt-2 font-hand text-xl text-leaf">
              <T en={`your regular order · ${regular.toLowerCase()}`} gu={<span className="text-base">તમારો નિયમિત ઓર્ડર</span>} />
            </p>
          )}
        </div>
        <ul className="py-2 pl-14 pr-5 md:pl-28">
          {s.items.map((it) => (
            <li key={it.sku.id} className="flex justify-between gap-3 py-2.5 leading-snug">
              <span>
                <T en={it.sku.name} gu={it.sku.nameGu} />{" "}
                <span className="text-ink-2">
                  (<T en={it.sku.pack} gu={it.sku.packGu} />)
                </span>{" "}
                <span className="font-mono text-ink-2">× {it.qty}</span>
              </span>
              <span className="font-mono font-semibold">{inr(it.total)}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t-2 border-ink py-4 pl-14 pr-5 md:pl-28">
          <span className="font-semibold">
            <T en="Grand total" gu="કુલ રકમ" />
          </span>
          <span className="font-mono text-3xl font-semibold">{inr(s.total)}</span>
        </div>
      </div>

      <div className="rounded-3xl border-2 border-ink bg-milk p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-chopda">
              <T en="Deliver to" gu="અહીં પહોંચાડો" />
            </p>
            <p className="mt-1 font-semibold">{customer.name}</p>
            <p className="font-mono text-sm">+91 {cleanMobile(customer.mobile)}</p>
            <p className="mt-1 text-ink-2">
              {customer.address}, {customer.pincode}
            </p>
            {customer.notes.trim() && <p className="mt-1 font-hand text-xl text-ink-2">“{customer.notes.trim()}”</p>}
          </div>
          <button type="button" onClick={onEdit} className="shrink-0 text-sm font-semibold text-chopda underline">
            <T en="Edit" gu="સુધારો" />
          </button>
        </div>
      </div>

      <div className="rounded-3xl border-2 border-haldi bg-haldi/15 p-5">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-chopda-dark">
          <T en="Payment terms" gu="ચુકવણીની શરતો" />
        </p>
        {s.total > ADVANCE ? (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-milk p-4">
              <p className="text-sm text-ink-2">
                <T en="Advance to confirm" gu="કન્ફર્મ કરવા એડવાન્સ" />
              </p>
              <p className="font-mono text-2xl font-semibold">{inr(ADVANCE)}</p>
            </div>
            <div className="rounded-2xl bg-milk p-4">
              <p className="text-sm text-ink-2">
                <T en="Balance on delivery" gu="બાકી ડિલિવરી વખતે" />
              </p>
              <p className="font-mono text-2xl font-semibold">{inr(s.total - ADVANCE)}</p>
              {!free && (
                <p className="text-xs text-ink-2">
                  <T en="+ delivery charges" gu="+ ડિલિવરી ચાર્જ" />
                </p>
              )}
            </div>
          </div>
        ) : null}
        <p className="mt-3 font-semibold">
          <T
            en={paymentTerms(s.total, free)}
            gu={
              s.total > ADVANCE
                ? `ઓર્ડર કન્ફર્મ કરવા ${inr(ADVANCE)} એડવાન્સ, બાકી ${inr(s.total - ADVANCE)}${free ? "" : " અને ડિલિવરી ચાર્જ"} ડિલિવરી વખતે ચૂકવવાના.`
                : `પૂરા ${inr(s.total)}${free ? "" : " અને ડિલિવરી ચાર્જ"} ડિલિવરી વખતે ચૂકવવાના.`
            }
          />
        </p>
        <p className="mt-2 text-sm text-ink-2">
          <T
            en="You pay the advance directly to the shop on WhatsApp after they confirm. This website never asks for or takes any payment."
            gu="દુકાન કન્ફર્મ કરે પછી એડવાન્સ સીધું દુકાનને WhatsApp પર ચૂકવો. આ વેબસાઇટ ક્યારેય પૈસા માંગતી કે લેતી નથી."
          />
        </p>
      </div>

      <button type="button" onClick={() => setShowMsg((v) => !v)} className="text-sm font-semibold text-chopda underline underline-offset-4">
        {showMsg ? <T en="Hide the WhatsApp message" gu="WhatsApp સંદેશ છુપાવો" /> : <T en="Preview the WhatsApp message" gu="WhatsApp સંદેશ જુઓ" />}
      </button>
      {showMsg && (
        <>
          <pre className="whitespace-pre-wrap rounded-2xl border border-ink/20 bg-[#e7f6df] p-4 font-mono text-[13px] leading-relaxed">{message}</pre>
          <p className="l-gu text-xs text-ink-2">સંદેશ અંગ્રેજીમાં જશે, જેથી દુકાનનો સ્ટાફ સહેલાઈથી વાંચી શકે.</p>
        </>
      )}

      <a
        href={waLink(store.whatsapp, message)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onSent(message)}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1fa855] px-6 py-4 text-lg font-semibold text-white shadow-[0_5px_0_#126b35] transition active:translate-y-1 active:shadow-none"
      >
        <WhatsAppIcon /> <T en="Send order on WhatsApp" gu="WhatsApp પર ઓર્ડર મોકલો" />
      </a>
      <p className="text-center text-sm text-ink-2">
        <T en="WhatsApp opens with your order written out. Press send there." gu="WhatsApp તમારા ઓર્ડર સાથે ખુલશે. ત્યાં મોકલો દબાવો." />
      </p>
    </div>
  );
}

/* ───────────────────────── sent ───────────────────────── */

function Sent({
  snapshot,
  storeName,
  storeId,
  waHref,
  onNew,
  onDirections,
}: {
  snapshot: Snapshot;
  storeName: string;
  storeId: string;
  waHref: string;
  onNew: () => void;
  onDirections: () => void;
}) {
  const [copied, setCopied] = useState<null | boolean>(null);
  const [pic, setPic] = useState<"idle" | "busy" | "done" | "error">("idle");
  const lang = useLang();
  const lines = useLines();
  const savePicture = async () => {
    setPic("busy");
    try {
      const blob = await drawBill({ items: snapshot.items, total: snapshot.total, free: snapshot.free, storeName, lang });
      const r = await shareOrSave(blob, `karnavati-hisaab-${new Date().toISOString().slice(0, 10)}.png`);
      setPic(r === "cancelled" ? "idle" : "done");
    } catch {
      setPic("error");
    }
  };
  const saved = useBandhi();
  const isRegular = !!saved && sameLines(saved.lines, lines);
  return (
    <div className="space-y-6">
      <div className="ledger relative overflow-hidden rounded-3xl border-2 border-ink p-6 pl-14 shadow-[6px_6px_0_var(--color-ink)] md:pl-28">
        <Stamp tone="leaf" className="mb-4 text-base">
          <T en="Sent" gu="મોકલ્યું" /> · <span className="font-gu normal-case tracking-normal">જમા</span>
        </Stamp>
        <p className="max-w-[18ch] font-display text-3xl leading-tight">
          <T en={`Your order is on its way to ${storeName}.`} gu={`તમારો ઓર્ડર ${storeName} તરફ જઈ રહ્યો છે.`} />
        </p>
        <p className="mt-3 text-ink-2">
          <T
            en={`Once you press send in WhatsApp, the shop will reply to confirm and share how to pay the ${inr(ADVANCE)} advance.`}
            gu={`WhatsApp માં મોકલો દબાવશો એટલે દુકાન કન્ફર્મ કરશે અને ${inr(ADVANCE)} એડવાન્સ કેવી રીતે ચૂકવવું તે જણાવશે.`}
          />
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <dt className="text-sm text-ink-2">
              <T en="Grand total" gu="કુલ રકમ" />
            </dt>
            <dd className="font-mono text-2xl font-semibold">{inr(snapshot.total)}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-2">
              <T en="Delivery" gu="ડિલિવરી" />
            </dt>
            <dd className="font-mono text-2xl font-semibold">{snapshot.free ? <T en="FREE" gu="મફત" /> : <T en="As quoted" gu="દુકાન કહે તે" />}</dd>
          </div>
        </dl>
      </div>

      {!isRegular && lines && Object.keys(lines).length > 0 && (
        <div className="rounded-2xl border-2 border-dashed border-chopda bg-milk p-4">
          <p className="font-semibold">
            <T en="Order this often?" gu="આ વારંવાર મંગાવો છો?" />
          </p>
          <p className="text-sm text-ink-2">
            <T en={`Save it as your regular order with ${storeName}, and repeat it in one tap.`} gu={`${storeName} સાથે નિયમિત ઓર્ડર તરીકે સાચવો, ફરી એક ટૅપમાં.`} />
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(freqLabel) as Freq[]).map((f) => (
              <button key={f} type="button" onClick={() => bandhi.save(lines, f, storeId)} className="rounded-full border-2 border-ink px-3.5 py-1.5 text-sm font-semibold hover:bg-ink hover:text-milk">
                <T en={freqLabel[f].en} gu={freqLabel[f].gu} />
              </button>
            ))}
          </div>
        </div>
      )}
      {isRegular && (
        <p className="font-hand text-2xl text-leaf">
          <T en="saved as your regular order ✓" gu={<span className="text-lg">નિયમિત ઓર્ડર તરીકે સચવાયું ✓</span>} />
        </p>
      )}

      <pre className="whitespace-pre-wrap rounded-2xl border border-ink/20 bg-[#e7f6df] p-4 font-mono text-[13px] leading-relaxed">{snapshot.message}</pre>

      <button
        type="button"
        onClick={savePicture}
        disabled={pic === "busy"}
        className="ledger flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-ink px-6 py-4 font-semibold shadow-[4px_4px_0_var(--color-ink)] active:translate-y-0.5 active:shadow-none"
      >
        <span aria-hidden>🧾</span>
        {pic === "busy" ? (
          <T en="Writing your bill…" gu="બિલ લખાય છે…" />
        ) : pic === "done" ? (
          <T en="Bill picture ready ✓" gu="બિલનું ચિત્ર તૈયાર ✓" />
        ) : (
          <T en="Save my bill as a picture" gu="મારું બિલ ચિત્ર તરીકે સાચવો" />
        )}
      </button>
      {pic === "error" && (
        <p className="text-sm text-chopda">
          <T en="Couldn’t make the picture on this browser. Copy the order instead." gu="આ બ્રાઉઝર પર ચિત્ર ન બન્યું. તેના બદલે ઓર્ડર કૉપિ કરો." />
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={async () => setCopied(await copyText(snapshot.message))} className="rounded-full border-2 border-ink bg-milk px-6 py-3.5 font-semibold">
          {copied === true ? <T en="Copied ✓" gu="કૉપિ થયું ✓" /> : <T en="Copy order" gu="ઓર્ડર કૉપિ કરો" />}
        </button>
        <a href={waHref} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-[#1fa855] px-6 py-3.5 font-semibold text-white">
          <WhatsAppIcon /> <T en="Open WhatsApp again" gu="WhatsApp ફરી ખોલો" />
        </a>
      </div>
      {copied === false && (
        <p className="text-sm text-chopda">
          <T en="Couldn’t copy automatically. Press and hold the message above to copy it." gu="આપમેળે કૉપિ ન થયું. ઉપરના સંદેશને દબાવી રાખી કૉપિ કરો." />
        </p>
      )}
      <p className="text-sm text-ink-2">
        <T en="WhatsApp didn’t open? Copy the order and send it to the shop yourself." gu="WhatsApp ન ખૂલ્યું? ઓર્ડર કૉપિ કરીને જાતે દુકાનને મોકલો." />
      </p>

      <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/15 pt-5">
        <button type="button" onClick={onNew} className="font-semibold text-chopda underline underline-offset-4">
          <T en="Start a new hisaab" gu="નવો હિસાબ શરૂ કરો" />
        </button>
        <button type="button" onClick={onDirections} className="font-semibold text-chopda underline underline-offset-4">
          <T en={`Directions to ${storeName}`} gu={`${storeName} નો રસ્તો`} />
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
