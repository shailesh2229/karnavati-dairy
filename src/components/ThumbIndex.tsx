"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { inr, summarise, useLines } from "@/lib/cart";

const tabs = [
  { href: "/", en: "Home", gu: "શરૂઆત", tint: "bg-[#efe3c3]" },
  { href: "/products", en: "Counter", gu: "દુકાન", tint: "bg-[#f3d9a4]" },
  { href: "/hisaab", en: "Hisaab", gu: "હિસાબ", tint: "bg-[#f1c7b8]" },
  { href: "/stores", en: "Shops", gu: "શાખા", tint: "bg-[#cfdcc0]" },
  { href: "/story", en: "Story", gu: "વાર્તા", tint: "bg-[#c9d9ea]" },
];

/**
 * Navigation as a ledger's thumb index: tabs on the right page edge on desktop,
 * a row of tabs along the bottom edge on phones.
 */
export default function ThumbIndex() {
  const pathname = usePathname();
  const s = summarise(useLines());
  const active = (h: string) => (h === "/" ? pathname === "/" : pathname.startsWith(h));

  return (
    <>
      {/* Desktop: right edge */}
      <nav aria-label="Ledger index" className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1.5 md:flex">
        {tabs.map((t) => {
          const on = active(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={on ? "page" : undefined}
              className={`group relative flex w-[5.5rem] flex-col items-start rounded-l-xl border border-r-0 border-ink/15 px-3 py-2.5 shadow-[-3px_3px_0_rgb(28_34_54/0.12)] transition-transform duration-300 ${t.tint} ${
                on ? "-translate-x-3" : "hover:-translate-x-1.5"
              }`}
            >
              <span className="font-gu text-[15px] leading-none text-chopda">{t.gu}</span>
              <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">{t.en}</span>
              {t.href === "/hisaab" && s.count > 0 && (
                <span key={s.total} className="animate-pop mt-1 font-mono text-[11px] font-semibold text-chopda">
                  {inr(s.total)}
                </span>
              )}
              {on && <span className="absolute -left-1.5 top-1/2 size-2 -translate-y-1/2 rounded-full bg-chopda" aria-hidden />}
            </Link>
          );
        })}
      </nav>

      {/* Phone: bottom edge */}
      <nav
        aria-label="Ledger index"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/15 bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        {s.count > 0 && (
          <div className="h-1 w-full bg-ink/10" aria-hidden>
            <div className={`h-full transition-[width] duration-500 ${s.free ? "bg-leaf" : "bg-haldi"}`} style={{ width: `${s.progress * 100}%` }} />
          </div>
        )}
        <ul className="grid grid-cols-5 gap-1 px-1.5 pt-1.5">
          {tabs.map((t) => {
            const on = active(t.href);
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  aria-current={on ? "page" : undefined}
                  className={`relative flex h-[62px] flex-col items-center justify-center rounded-t-xl border border-b-0 border-ink/15 transition-transform duration-300 ${t.tint} ${
                    on ? "-translate-y-1.5 shadow-[0_-3px_0_rgb(158_27_23/0.9)]" : ""
                  }`}
                >
                  <span className="font-gu text-[15px] leading-none text-chopda">{t.gu}</span>
                  <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink">
                    {t.href === "/hisaab" && s.count > 0 ? inr(s.total) : t.en}
                  </span>
                  {t.href === "/hisaab" && s.count > 0 && (
                    <span key={s.count} className="animate-pop absolute -top-1.5 right-1.5 grid min-w-5 place-items-center rounded-full bg-chopda px-1 font-mono text-[10px] font-semibold text-milk">
                      {s.count}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
