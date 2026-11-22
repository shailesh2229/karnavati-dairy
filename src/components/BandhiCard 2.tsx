"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { storeById } from "@/data/stores";
import { bandhi, freqLabel, sameLines, useBandhi } from "@/lib/bandhi";
import { cart, inr, summarise, useLines } from "@/lib/cart";
import T from "@/components/T";
import { play } from "@/lib/sound";

/**
 * The saved regular order, pinned like a slip tucked into the book.
 * Shown on Home and the Counter; hidden when nothing is saved.
 */
export default function BandhiCard({ className = "" }: { className?: string }) {
  const b = useBandhi();
  const lines = useLines();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (!b) return null;

  const s = summarise(b.lines);
  const store = b.storeId ? storeById(b.storeId) : null;
  const inCart = sameLines(lines, b.lines);
  const cartHasOther = Object.keys(lines).length > 0 && !inCart;

  const repeat = (mode: "replace" | "add") => {
    play("page");
    if (mode === "replace") cart.clear();
    Object.entries(b.lines).forEach(([id, q]) => cart.add(id, q));
    router.push(`/hisaab${s.free && store ? "?bandhi=1" : ""}`, { transitionTypes: ["turn-fwd"] });
  };

  return (
    <section className={className} aria-label="Your regular order">
      <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-chopda bg-milk p-5 shadow-[4px_4px_0_rgb(158_27_23/0.25)] sm:p-6">
        <span className="absolute -right-8 top-4 rotate-12 bg-haldi px-10 py-1 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-ink" aria-hidden>
          <T en="Bandhi" gu="બાંધી" />
        </span>
        <p className="pr-20 font-mono text-xs uppercase tracking-[0.18em] text-chopda">
          <T en="Your regular order" gu="તમારો નિયમિત ઓર્ડર" /> · <T en={freqLabel[b.freq].en} gu={freqLabel[b.freq].gu} />
        </p>
        <p className="mt-2 max-w-2xl font-display text-xl leading-snug sm:text-2xl">
          {s.items.map((it, i) => (
            <span key={it.sku.id}>
              {it.qty} × <T en={it.sku.name} gu={it.sku.nameGu} />
              {i < s.items.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
        <p className="mt-1 text-sm text-ink-2">
          <span className="font-mono font-semibold text-ink">{inr(s.total)}</span>
          {s.free && (
            <>
              {" · "}
              <T en="free delivery" gu="મફત ડિલિવરી" />
            </>
          )}
          {store && (
            <>
              {" · "}
              <T en={`from ${store.name}`} gu={`${store.name} થી`} />
            </>
          )}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {inCart ? (
            <button type="button" onClick={() => repeat("replace")} className="rounded-full bg-ink px-5 py-2.5 font-semibold text-milk">
              <T en="It’s in your hisaab → open" gu="હિસાબમાં છે → ખોલો" />
            </button>
          ) : (
            <>
              <button type="button" onClick={() => repeat("replace")} className="rounded-full bg-chopda px-5 py-2.5 font-semibold text-milk shadow-[0_3px_0_var(--color-chopda-dark)] active:translate-y-0.5 active:shadow-none">
                {s.free && store ? <T en={`Order again from ${store.name}`} gu={`${store.name} થી ફરી ઓર્ડર કરો`} /> : <T en="Repeat this order" gu="આ ઓર્ડર ફરી કરો" />}
              </button>
              {cartHasOther && (
                <button type="button" onClick={() => repeat("add")} className="rounded-full border-2 border-ink px-4 py-2 font-semibold">
                  <T en="Add to my current hisaab" gu="હાલના હિસાબમાં ઉમેરો" />
                </button>
              )}
            </>
          )}
          {confirmDelete ? (
            <span className="flex items-center gap-2 text-sm">
              <T en="Forget it?" gu="ભૂલી જઈએ?" />
              <button type="button" onClick={() => bandhi.remove()} className="font-semibold text-chopda underline">
                <T en="Yes" gu="હા" />
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)} className="font-semibold underline">
                <T en="No" gu="ના" />
              </button>
            </span>
          ) : (
            <button type="button" onClick={() => setConfirmDelete(true)} className="text-sm font-semibold text-ink-2 underline underline-offset-2">
              <T en="Forget this order" gu="આ ઓર્ડર ભૂલી જાઓ" />
            </button>
          )}
        </div>
        {cartHasOther && (
          <p className="mt-2 text-xs text-ink-2">
            <T en="“Repeat” replaces what’s in your hisaab now." gu="“ફરી કરો” હાલના હિસાબને બદલી નાખશે." />
          </p>
        )}
      </div>
    </section>
  );
}
