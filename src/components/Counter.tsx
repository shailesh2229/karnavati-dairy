"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { categories, skus } from "@/data/catalogue";
import { products } from "@/data/products";
import { FREE_DELIVERY_AT, inr, summarise, useLines } from "@/lib/cart";
import { MilkCan, Stepper } from "@/components/bits";

export default function Counter() {
  const lines = useLines();
  const s = summarise(lines);
  const [active, setActive] = useState(categories[0].slug);

  // highlight the category tab for the section in view
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-30% 0px -60% 0px" },
    );
    categories.forEach((c) => {
      const el = document.getElementById(c.slug);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // keep the active tab visible in the scroller
  useEffect(() => {
    document.getElementById(`tab-${active}`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  return (
    <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-10">
      <div>
        {/* category tabs */}
        <nav aria-label="Categories" className="sticky top-0 z-30 -mx-4 border-b border-ink/15 bg-paper/95 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <ul className="no-scrollbar flex gap-2 overflow-x-auto">
            {categories.map((c) => (
              <li key={c.slug}>
                <a
                  id={`tab-${c.slug}`}
                  href={`#${c.slug}`}
                  className={`flex items-baseline gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                    active === c.slug ? "border-ink bg-ink text-milk" : "border-ink/20 bg-milk text-ink hover:border-ink"
                  }`}
                >
                  <span className={`font-gu text-[13px] ${active === c.slug ? "text-haldi" : "text-chopda"}`}>{c.gu}</span>
                  {c.en}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {categories.map((c, ci) => {
          const items = skus.filter((x) => x.cat === c.slug);
          const p = products.find((x) => x.slug === c.slug);
          return (
            <section key={c.slug} id={c.slug} className="scroll-mt-20 pt-12" aria-labelledby={`h-${c.slug}`}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-ink-2">Page {String(ci + 1).padStart(2, "0")}</p>
                  <h2 id={`h-${c.slug}`} className="font-display text-4xl leading-none sm:text-5xl">
                    {c.en}
                  </h2>
                  <p className="mt-2 text-ink-2">{c.line}</p>
                </div>
                <span aria-hidden className="select-none font-gu text-6xl font-bold leading-none text-transparent sm:text-8xl" style={{ WebkitTextStroke: "1.5px var(--color-chopda)" }}>
                  {c.gu}
                </span>
              </div>

              <ul className="ledger mt-5 overflow-hidden rounded-2xl border-2 border-ink shadow-[5px_5px_0_rgb(28_34_54/0.9)]">
                {items.map((it) => {
                  const q = lines[it.id] ?? 0;
                  return (
                    <li key={it.id} className={`relative flex items-center gap-3 border-b border-rule py-3 pl-14 pr-3 last:border-0 sm:gap-5 md:pl-24 md:pr-5 ${q ? "bg-haldi/10" : ""}`}>
                      {/* the photo is "pasted" into the margin */}
                      <div className="absolute left-1.5 top-1/2 grid size-11 -translate-y-1/2 -rotate-3 place-items-center overflow-hidden rounded-md border border-ink/20 bg-milk shadow-sm md:left-4 md:size-16">
                        {it.image ? (
                          <Image src={it.image} alt="" width={64} height={64} sizes="64px" className="size-full object-contain p-0.5" />
                        ) : (
                          <span className="font-gu text-lg text-chopda">{c.gu}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-lg leading-tight sm:text-xl">{it.name}</p>
                        <p className="text-sm text-ink-2">
                          {it.pack}
                          {it.note && <span className="hidden sm:inline"> · {it.note}</span>}
                        </p>
                        <p className="font-mono text-[15px] font-semibold text-chopda sm:hidden">{inr(it.price)}</p>
                      </div>
                      <p className="hidden w-24 text-right font-mono text-lg font-semibold text-chopda sm:block">{inr(it.price)}</p>
                      <div className="flex shrink-0 flex-col items-end gap-0.5">
                        <Stepper id={it.id} qty={q} label={`${it.name} ${it.pack}`} />
                        {q > 1 && <span className="font-mono text-xs text-ink-2">= {inr(q * it.price)}</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {p && (
                <details className="group mt-3 rounded-2xl border border-ink/15 bg-milk/60 px-5 py-3 open:pb-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold">
                    <span>
                      How we make our {c.en.toLowerCase()} <span className="font-hand text-xl font-normal text-chopda">(the slow way)</span>
                    </span>
                    <span className="grid size-7 place-items-center rounded-full border border-ink text-sm transition-transform group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-ink-2">{p.intro[0]}</p>
                  <ol className="mt-4 grid gap-3 sm:grid-cols-2">
                    {p.process.map((st, k) => (
                      <li key={st.title} className="flex gap-3">
                        <span className="font-mono text-sm font-semibold text-chopda">{String(k + 1).padStart(2, "0")}</span>
                        <span>
                          <strong className="font-semibold">{st.title}.</strong> <span className="text-ink-2">{st.text}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </details>
              )}
            </section>
          );
        })}

        <p className="mt-10 font-hand text-xl text-ink-2">
          Prices shown are placeholders for this preview. The shop confirms the final bill on WhatsApp.
        </p>
      </div>

      {/* desktop: running hisaab */}
      <aside className="hidden lg:block">
        <div className="sticky top-6 mt-14 rounded-2xl border-2 border-ink bg-milk p-5 shadow-[5px_5px_0_var(--color-ink)]">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-chopda">Your hisaab</p>
          <MilkCan progress={s.progress} free={s.free} className="mx-auto mt-2 h-40 w-auto" />
          <p key={s.total} className="animate-pop mt-2 text-center font-mono text-3xl font-semibold">{inr(s.total)}</p>
          <p className="mt-1 text-center text-sm text-ink-2">
            {s.count === 0
              ? `Free delivery from ${inr(FREE_DELIVERY_AT)}`
              : s.free
                ? "Free delivery unlocked!"
                : `${inr(s.gap)} more for free delivery`}
          </p>
          <Link
            href="/hisaab"
            className={`mt-4 block rounded-full py-3 text-center font-semibold transition ${s.count ? "bg-chopda text-milk shadow-[0_4px_0_var(--color-chopda-dark)] active:translate-y-1 active:shadow-none" : "pointer-events-none bg-ink/10 text-ink/40"}`}
            aria-disabled={!s.count}
          >
            {s.count ? `Open hisaab · ${s.count} item${s.count > 1 ? "s" : ""}` : "Nothing added yet"}
          </Link>
        </div>
      </aside>
    </div>
  );
}
