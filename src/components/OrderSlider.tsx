"use client";

import Link from "next/link";
import { useState } from "react";
import { ADVANCE, FREE_DELIVERY_AT, inr, NUDGE_FROM } from "@/lib/money";
import { useTr } from "@/lib/lang";
import { MilkCan, Reveal, Stamp } from "@/components/bits";
import T from "@/components/T";

const MAX = 4000;

/**
 * "How ordering works" as something you play with: drag the rupee slider and
 * watch the can fill and the rules change in front of you.
 */
export default function OrderSlider() {
  const [amt, setAmt] = useState(1800);
  const tr = useTr();
  const free = amt >= FREE_DELIVERY_AT;
  const nudge = !free && amt >= NUDGE_FROM;
  const pct = (amt / MAX) * 100;
  const mark = (v: number) => `${(v / MAX) * 100}%`;

  return (
    <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6" aria-labelledby="how-title">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-chopda">
        <T en="How ordering works" gu="ઓર્ડર કેવી રીતે કરવો" />
      </p>
      <h2 id="how-title" className="mt-2 max-w-3xl font-display text-4xl leading-[1.02] sm:text-6xl">
        <T
          en={<>Fill the can to <span className="text-chopda">₹3,000</span>. We deliver free, anywhere in India.</>}
          gu={<>કેન <span className="text-chopda">₹3,000</span> સુધી ભરો. ડિલિવરી મફત, ભારતમાં ક્યાંય પણ.</>}
        />
      </h2>

      <div className="relative mt-10 overflow-hidden rounded-[2rem] border-2 border-ink bg-milk shadow-[8px_8px_0_var(--color-ink)]">
        {/* the slider */}
        <div className="border-b-2 border-dashed border-ink/25 px-5 pb-8 pt-6 sm:px-10">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <label htmlFor="amt" className="font-hand text-2xl text-ink-2 sm:text-3xl">
              <T en="drag to try: if my order is…" gu={<span className="text-xl">ખેંચીને જુઓ: જો મારો ઓર્ડર હોય…</span>} />
            </label>
            <output htmlFor="amt" key={free ? "f" : nudge ? "n" : "b"} className={`animate-pop font-mono text-5xl font-semibold sm:text-6xl ${free ? "text-leaf" : nudge ? "text-haldi" : "text-chopda"}`}>
              {inr(amt)}
            </output>
          </div>

          <div className="relative mt-8">
            <span aria-hidden className="absolute -top-6 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] text-ink-2" style={{ left: mark(NUDGE_FROM) }}>
              ₹2,500 ↓
            </span>
            {/* track with zones */}
            <div className="relative h-5 overflow-hidden rounded-full border-2 border-ink bg-paper" aria-hidden>
              <div className="absolute inset-y-0 left-0 transition-[width] duration-150" style={{ width: `${pct}%`, background: free ? "var(--color-leaf)" : nudge ? "var(--color-haldi)" : "var(--color-chopda)" }} />
              <span className="absolute inset-y-0 w-0.5 bg-ink/50" style={{ left: mark(NUDGE_FROM) }} />
              <span className="absolute inset-y-0 w-1 bg-ink" style={{ left: mark(FREE_DELIVERY_AT) }} />
            </div>
            <input
              id="amt"
              type="range"
              min={0}
              max={MAX}
              step={50}
              value={amt}
              onChange={(e) => setAmt(Number(e.target.value))}
              aria-valuetext={tr(`${inr(amt)}: ${free ? "free delivery" : nudge ? `${inr(FREE_DELIVERY_AT - amt)} more for free delivery` : "visit your nearest shop"}`, `${inr(amt)}: ${free ? "મફત ડિલિવરી" : nudge ? `મફત ડિલિવરી માટે ${inr(FREE_DELIVERY_AT - amt)} વધુ` : "નજીકની દુકાને આવો"}`)}
              className="kd-range absolute inset-x-0 -top-3 h-11 w-full cursor-grab appearance-none bg-transparent active:cursor-grabbing"
            />
            <div className="relative mt-2 h-5 font-mono text-[11px] text-ink-2" aria-hidden>
              <span className="absolute left-0">₹0</span>
              <span className="absolute -translate-x-1/2 whitespace-nowrap font-semibold text-ink" style={{ left: mark(FREE_DELIVERY_AT) }}>
                ₹3,000 <T en="free" gu="મફત" />
              </span>
              <span className="absolute right-0 hidden sm:block">₹4,000</span>
            </div>
          </div>
        </div>

        {/* what happens */}
        <div className="grid items-center gap-6 px-5 py-8 sm:grid-cols-[auto_1fr] sm:px-10">
          <MilkCan progress={amt / FREE_DELIVERY_AT} free={free} className="mx-auto h-40 w-auto sm:h-52" />
          <div aria-live="polite" className="min-h-48">
            {free ? (
              <div key="free">
                <Stamp tone="leaf" sound="bell" className="text-lg">
                  <T en="Free delivery" gu="મફત ડિલિવરી" />
                </Stamp>
                <p className="mt-4 font-display text-2xl leading-snug sm:text-3xl">
                  <T en="We bring it to your door, anywhere in India." gu="ભારતમાં ક્યાંય પણ, તમારા દરવાજે પહોંચાડીશું." />
                </p>
                <div className="mt-4 grid max-w-md grid-cols-2 gap-3">
                  <div className="rounded-2xl border-2 border-ink/15 bg-paper/60 p-3">
                    <p className="text-xs text-ink-2"><T en="Advance on WhatsApp" gu="WhatsApp પર એડવાન્સ" /></p>
                    <p className="font-mono text-2xl font-semibold">{inr(ADVANCE)}</p>
                  </div>
                  <div className="rounded-2xl border-2 border-ink/15 bg-paper/60 p-3">
                    <p className="text-xs text-ink-2"><T en="Rest on delivery" gu="બાકી ડિલિવરી વખતે" /></p>
                    <p key={amt} className="ink-in font-mono text-2xl font-semibold">{inr(amt - ADVANCE)}</p>
                  </div>
                </div>
              </div>
            ) : nudge ? (
              <div key="nudge">
                <p className="font-hand text-3xl text-chopda">
                  <T en="so close!" gu={<span className="text-2xl">બસ થોડું જ!</span>} />
                </p>
                <p className="mt-1 font-display text-2xl leading-snug sm:text-3xl">
                  <T
                    en={<>Add just <span className="font-mono text-haldi">{inr(FREE_DELIVERY_AT - amt)}</span> more and delivery is free.</>}
                    gu={<>ફક્ત <span className="font-mono text-haldi">{inr(FREE_DELIVERY_AT - amt)}</span> વધુ ઉમેરો, ડિલિવરી મફત.</>}
                  />
                </p>
                <p className="mt-3 text-ink-2">
                  <T en="A box of Kaju Katli usually does it. Or pick it up from your shop today." gu="એક કાજુ કતરીનું બોક્સ સામાન્ય રીતે પૂરું કરી દે. અથવા આજે દુકાનેથી લઈ જાઓ." />
                </p>
              </div>
            ) : (
              <div key="visit">
                <p className="font-display text-2xl leading-snug sm:text-3xl">
                  <T en="Pop into your nearest Karnavati shop." gu="નજીકની કર્ણાવતી દુકાને આવી જાઓ." />
                </p>
                <p className="mt-2 text-ink-2">
                  <T en="We find it for you and get you there:" gu="અમે શોધી આપીશું અને પહોંચાડીશું:" />
                </p>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Ways to get there">
                  {[
                    ["Google Maps", "bg-ink text-milk"],
                    ["Uber", "bg-black text-white"],
                    ["Ola", "bg-[#cddc39] text-black"],
                    ["Rapido", "bg-[#f9c933] text-black"],
                  ].map(([n, c], i) => (
                    <li key={n} className={`float-up rounded-full px-3.5 py-1.5 text-sm font-semibold ${c}`} style={{ animationDelay: `${i * 70}ms` }}>
                      {n}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-ink-2">
                  <T en="Prefer delivery anyway? You can still order — the shop quotes delivery." gu="છતાં ડિલિવરી જોઈએ? ઓર્ડર કરી શકો છો — દુકાન ડિલિવરી ચાર્જ કહેશે." />
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* the 4 steps as stamped cards */}
      <ol className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {[
          ["Pick", "ચૂંટો", "Choose from the counter. Your hisaab fills as you go.", "દુકાનમાંથી પસંદ કરો. હિસાબ સાથે સાથે ભરાય."],
          ["Choose a shop", "દુકાન", "We find your nearest Karnavati shop from your location.", "તમારા સ્થાન પરથી નજીકની દુકાન શોધીએ."],
          ["WhatsApp it", "WhatsApp", "Your order goes to that shop, written out neatly.", "ઓર્ડર એ દુકાને, વ્યવસ્થિત લખાઈને જાય."],
          ["₹500 & done", "₹500", "₹500 advance to confirm. The rest when it arrives.", "₹500 એડવાન્સથી પાકું. બાકી આવે ત્યારે."],
        ].map(([en, gu, ten, tgu], i) => (
          <Reveal as="li" key={en} delay={i * 90} className="relative w-[78%] shrink-0 snap-start rounded-2xl border-2 border-ink bg-milk p-5 shadow-[4px_4px_0_var(--color-ink)] sm:w-auto">
            <span className="stamp absolute right-3 top-3 rotate-[-8deg] px-2 py-0.5 font-mono text-xs font-semibold text-chopda">{String(i + 1).padStart(2, "0")}</span>
            <p className="font-display text-2xl">
              <T en={en} gu={gu} />
            </p>
            <p className="mt-2 leading-relaxed text-ink-2">
              <T en={ten} gu={tgu} />
            </p>
          </Reveal>
        ))}
      </ol>

      <Link href="/products" transitionTypes={["turn-fwd"]} className="mt-6 inline-block rounded-full bg-ink px-6 py-3.5 font-semibold text-milk shadow-[0_4px_0_var(--color-chopda)] transition active:translate-y-1 active:shadow-none">
        <T en="Start filling the can" gu="કેન ભરવાનું શરૂ કરો" />
      </Link>
    </section>
  );
}
