import Image from "next/image";
import Link from "next/link";
import MilkSurface from "@/components/MilkSurface";
import DayOfALitre from "@/components/DayOfALitre";
import { MilkCan, Reveal } from "@/components/bits";
import { categories, skus } from "@/data/catalogue";
import { journey } from "@/data/site";
import { stores } from "@/data/stores";
import { inr } from "@/lib/money";

const shelf = categories.map((c) => {
  const items = skus.filter((s) => s.cat === c.slug);
  return { ...c, from: Math.min(...items.map((s) => s.price)), image: items.find((s) => s.image)?.image };
});

export default function Home() {
  return (
    <>
      {/* 1 · Touch the milk */}
      <section className="relative h-[calc(100svh-62px-76px)] min-h-[520px] overflow-hidden border-b-4 border-ink md:h-[calc(100svh-62px)]">
        <MilkSurface className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-4 pb-8 pt-6 sm:px-8 md:px-12 md:pb-12">
          <div className="flex items-start justify-between gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
              Entry no. 1 · 4:00 a.m.
              <br />
              Changodar, Ahmedabad
            </p>
            <p className="rotate-3 font-hand text-2xl text-chopda sm:text-3xl">touch the milk ↓</p>
          </div>

          <p
            aria-hidden
            className="absolute right-[-4vw] top-1/2 -translate-y-1/2 select-none font-gu text-[46vw] font-bold leading-none text-transparent md:text-[30vw]"
            style={{ WebkitTextStroke: "2px rgb(158 27 23 / 0.16)" }}
          >
            દૂધ
          </p>

          <div className="relative">
            <h1 className="max-w-[14ch] font-display text-[13vw] font-semibold leading-[0.9] tracking-tight text-ink sm:text-7xl md:text-8xl lg:text-[8.5rem]">
              Fresh before the city wakes.
            </h1>
            <p className="mt-5 max-w-md text-lg text-ink-2">
              Since 2005, every litre we pour has gone into the same book: from village farms to {stores.length} Karnavati
              shops across Gujarat.
            </p>
            <div className="pointer-events-auto mt-7 flex flex-wrap gap-3">
              <Link href="/products" className="rounded-full bg-chopda px-6 py-3.5 font-semibold text-milk shadow-[0_4px_0_var(--color-chopda-dark)] transition active:translate-y-1 active:shadow-none">
                Open the counter
              </Link>
              <Link href="/stores" className="rounded-full border-2 border-ink bg-milk/70 px-6 py-3 font-semibold text-ink backdrop-blur transition hover:bg-milk">
                Nearest shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2 · A litre's morning */}
      <DayOfALitre />

      {/* 3 · The shelf with hanging price tags */}
      <section className="mt-8 overflow-hidden" aria-labelledby="shelf-title">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 sm:px-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-chopda">The counter</p>
            <h2 id="shelf-title" className="mt-2 font-display text-4xl leading-tight sm:text-5xl">Eleven things we make with care.</h2>
          </div>
          <p className="font-hand text-2xl text-ink-2">swipe the shelf →</p>
        </div>

        <ul className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 pt-2 sm:px-6 md:px-[max(1.5rem,calc((100%-72rem)/2+1.5rem))]">
          {shelf.map((c, k) => (
            <li key={c.slug} className="snap-start">
              <Link href={`/products#${c.slug}`} className="group relative block w-44 sm:w-52">
                <div className="relative grid h-56 place-items-end justify-center sm:h-64">
                  {c.image ? (
                    <Image src={c.image} alt={c.en} width={260} height={260} sizes="210px" className="relative z-10 max-h-full w-auto object-contain drop-shadow-[0_14px_10px_rgb(0_0_0/0.22)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:-rotate-2" />
                  ) : (
                    <svg viewBox="0 0 80 120" className="relative z-10 h-44 w-auto drop-shadow-[0_14px_10px_rgb(0_0_0/0.22)]" aria-hidden>
                      <rect x="16" y="28" width="48" height="88" rx="8" fill="#f2c94c" stroke="#1c2236" strokeWidth="3" />
                      <rect x="28" y="8" width="24" height="22" rx="4" fill="#9e1b17" stroke="#1c2236" strokeWidth="3" />
                      <rect x="22" y="56" width="36" height="34" rx="3" fill="#fffcf4" />
                      <text x="40" y="78" textAnchor="middle" fontSize="13" fontFamily="var(--font-anek-gu)" fill="#9e1b17">તેલ</text>
                    </svg>
                  )}
                </div>
                {/* the plank */}
                <div className="relative -mx-3 h-4 rounded-sm bg-[#8a5a2b] shadow-[0_6px_0_#5c3a1a]" aria-hidden />
                {/* hanging tag */}
                <div className="relative mx-auto mt-0 w-fit origin-top transition-transform duration-500 group-hover:rotate-[-6deg]" style={{ rotate: `${((k % 3) - 1) * 3}deg` }}>
                  <span className="mx-auto block h-5 w-px bg-ink/60" aria-hidden />
                  <span className="relative block rounded-md border border-ink/30 bg-milk px-4 pb-2.5 pt-3 text-center shadow-[2px_3px_0_rgb(28_34_54/0.15)] [clip-path:polygon(14%_0,86%_0,100%_18%,100%_100%,0_100%,0_18%)]">
                    <span className="absolute left-1/2 top-1.5 size-1.5 -translate-x-1/2 rounded-full bg-ink/50" aria-hidden />
                    <span className="block font-gu text-xl leading-tight text-chopda">{c.gu}</span>
                    <span className="block text-sm font-semibold">{c.en}</span>
                    <span className="mt-0.5 block font-mono text-xs text-ink-2">from {inr(c.from)}</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 4 · The ₹3,000 promise */}
      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <Reveal className="ledger relative overflow-hidden rounded-3xl border-2 border-ink p-6 pl-16 shadow-[8px_8px_0_var(--color-ink)] sm:p-10 md:pl-32">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-chopda">How ordering works</p>
              <h2 className="mt-3 font-display text-4xl leading-[1.05] sm:text-6xl">
                Fill the can to <span className="whitespace-nowrap text-chopda">₹3,000</span>, we deliver free. Anywhere in India.
              </h2>
              <ol className="mt-8 space-y-0 text-lg leading-[2.75rem]">
                <li><span className="font-mono text-chopda">1.</span> Pick from the counter. Your hisaab fills as you go.</li>
                <li><span className="font-mono text-chopda">2.</span> Above ₹3,000: free delivery. Order goes to your nearest shop on WhatsApp.</li>
                <li><span className="font-mono text-chopda">3.</span> ₹500 advance to the shop confirms it; the rest on delivery.</li>
                <li><span className="font-mono text-chopda">4.</span> Under ₹3,000? We’ll walk you to the nearest shop, or book your Uber, Ola or Rapido to the door.</li>
              </ol>
              <Link href="/products" className="mt-6 inline-block rounded-full bg-ink px-6 py-3.5 font-semibold text-milk shadow-[0_4px_0_var(--color-chopda)] transition active:translate-y-1 active:shadow-none">
                Start filling the can
              </Link>
            </div>
            <MilkCan progress={0.72} free={false} className="mx-auto h-56 w-auto md:h-80" />
          </div>
        </Reveal>
      </section>

      {/* 5 · From the old ledger */}
      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6" aria-labelledby="ledger-title">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-chopda">From the old ledger</p>
        <h2 id="ledger-title" className="mt-2 font-display text-4xl leading-tight sm:text-5xl">Amar Dairy, 2005. Karnavati, ever since.</h2>
        <div className="mt-8 overflow-hidden rounded-2xl border-2 border-ink bg-milk">
          <div className="grid grid-cols-[4.5rem_1fr] border-b-2 border-ink bg-paper-2 font-mono text-xs uppercase tracking-[0.15em] sm:grid-cols-[7rem_1fr_12rem]">
            <span className="border-r border-margin/60 px-3 py-2.5">Year</span>
            <span className="px-4 py-2.5">Entry</span>
            <span className="hidden border-l border-ink/20 px-4 py-2.5 sm:block">Note</span>
          </div>
          {journey.map((j, k) => (
            <Reveal key={j.year} delay={k * 80} className="grid grid-cols-[4.5rem_1fr] border-b border-rule last:border-0 sm:grid-cols-[7rem_1fr_12rem]">
              <span className="border-r border-margin/60 px-3 py-4 font-mono text-lg font-semibold text-chopda">{j.year}</span>
              <div className="px-4 py-4">
                <p className="font-display text-xl">{j.title}</p>
                <p className="mt-1 text-ink-2">{j.text}</p>
              </div>
              <span className="hidden border-l border-ink/20 px-4 py-4 font-hand text-xl leading-snug text-ink-2 sm:block">
                {["first ghee, first customers", "two shops now!", "named after Ahmedabad", "~50 places", "20,000 sq ft"][k]}
              </span>
            </Reveal>
          ))}
        </div>
        <Link href="/story" className="mt-6 inline-block font-semibold text-chopda underline decoration-2 underline-offset-4">
          Read the whole story →
        </Link>
      </section>
    </>
  );
}
