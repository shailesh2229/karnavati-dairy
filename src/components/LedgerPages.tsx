"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { journey } from "@/data/site";
import { play } from "@/lib/sound";
import T from "@/components/T";

const notes: [string, string][] = [
  ["first ghee, first customers", "પહેલું ઘી, પહેલા ગ્રાહક"],
  ["two shops now!", "હવે બે દુકાન!"],
  ["named after Ahmedabad ♥", "અમદાવાદના નામ પરથી ♥"],
  ["~50 places!!", "~50 જગ્યા!!"],
  ["20,000 sq ft. who knew.", "20,000 ચો.ફૂ. કોણે વિચાર્યું હતું."],
];
const milestones: [string, string][] = [
  ["1 shop", "1 દુકાન"],
  ["2 shops", "2 દુકાન"],
  ["new name", "નવું નામ"],
  ["~50 places", "~50 જગ્યા"],
  ["30+ branches", "30+ શાખા"],
];

/** The old ledger: real yellowed pages you swipe through, one year per page. */
export default function LedgerPages() {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLOListElement>(null);
  const pages = useRef<(HTMLLIElement | null)[]>([]);
  const [drawn, setDrawn] = useState(false);
  const lineRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.6) setActive(Number((e.target as HTMLElement).dataset.i));
        }),
      { root: track.current, threshold: [0.6] },
    );
    pages.current.forEach((p) => p && io.observe(p));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setDrawn(true);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /** the page nearest the left edge of the track right now (not the last observed one) */
  const nearest = () => {
    const t = track.current;
    if (!t) return active;
    let best = 0;
    let bestD = Infinity;
    pages.current.forEach((p, k) => {
      if (!p) return;
      const d = Math.abs(p.offsetLeft - t.offsetLeft - 16 - t.scrollLeft);
      if (d < bestD) {
        bestD = d;
        best = k;
      }
    });
    return best;
  };
  const step = (dir: 1 | -1) => goTo(nearest() + dir);

  const goTo = (i: number) => {
    const p = pages.current[Math.max(0, Math.min(journey.length - 1, i))];
    if (!p || !track.current) return;
    play("page");
    track.current.scrollTo({ left: p.offsetLeft - track.current.offsetLeft - 16, behavior: "smooth" });
  };

  return (
    <section className="mt-24" aria-labelledby="ledger-title">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 sm:px-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-chopda">
            <T en="From the old ledger" gu="જૂના ચોપડામાંથી" />
          </p>
          <h2 id="ledger-title" className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
            <T en="Amar Dairy, 2005. Karnavati, ever since." gu="2005 માં અમર ડેરી. ત્યારથી કર્ણાવતી." />
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => step(-1)} disabled={active === 0} aria-label="Previous page" className="grid size-12 place-items-center rounded-full border-2 border-ink bg-milk text-xl font-semibold disabled:opacity-30">
            ←
          </button>
          <span className="w-16 text-center font-mono text-sm">
            {active + 1} / {journey.length}
          </span>
          <button type="button" onClick={() => step(1)} disabled={active === journey.length - 1} aria-label="Next page" className="grid size-12 place-items-center rounded-full border-2 border-ink bg-milk text-xl font-semibold disabled:opacity-30">
            →
          </button>
        </div>
      </div>

      <ol
        ref={track}
        className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-8 pt-4 sm:px-6 md:px-[max(1.5rem,calc((100%-72rem)/2+1.5rem))]"
        aria-label="Ledger pages"
      >
        {journey.map((j, i) => (
          <li
            key={j.year}
            data-i={i}
            ref={(el) => {
              pages.current[i] = el;
            }}
            className={`oldpage relative w-[86%] shrink-0 snap-center rounded-[4px_14px_14px_4px] p-5 pl-14 transition-[transform,opacity] duration-500 sm:w-[30rem] sm:p-7 sm:pl-20 ${
              i === active ? "rotate-0 opacity-100" : `${i % 2 ? "rotate-[1.5deg]" : "-rotate-[1.5deg]"} scale-[0.96] opacity-70`
            }`}
          >
            {/* binding stitches on the left edge */}
            <span aria-hidden className="absolute inset-y-6 left-2 w-1 bg-[repeating-linear-gradient(to_bottom,var(--color-chopda)_0_10px,transparent_10px_22px)] opacity-60" />
            {i === 2 && <span aria-hidden className="teamark absolute -right-6 bottom-10 size-36" />}
            {i === 4 && <span aria-hidden className="teamark absolute -left-4 top-24 size-28" />}

            <div className="flex items-start justify-between gap-3">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-2">
                <T en="Page" gu="પાનું" /> {j.year}
              </p>
              <span className="stamp rotate-[-10deg] px-2 py-0.5 font-mono text-2xl font-semibold text-chopda sm:text-3xl">{j.year}</span>
            </div>

            <figure className="relative mt-4">
              <span aria-hidden className="absolute -top-3 left-6 z-10 h-6 w-20 rotate-[-6deg] bg-haldi/55" />
              <span aria-hidden className="absolute -top-3 right-6 z-10 h-6 w-16 rotate-[5deg] bg-haldi/45" />
              <div className={`overflow-hidden border-[6px] border-white bg-white shadow-[0_10px_18px_-8px_rgb(60_40_10/0.45)] ${i % 2 ? "rotate-1" : "-rotate-1"}`}>
                <Image src={j.image} alt={`${j.year}: ${j.title}`} width={1400} height={990} sizes="(max-width: 640px) 80vw, 440px" className="aspect-[4/3] w-full object-cover sepia-[.25]" />
              </div>
            </figure>

            <h3 className="mt-5 font-display text-2xl leading-tight sm:text-3xl">
              <T en={j.title} gu={j.titleGu} />
            </h3>
            <p className="mt-2 leading-relaxed text-ink-2">
              <T en={j.text} gu={j.textGu} />
            </p>
            <p className="mt-4 -rotate-2 font-hand text-2xl text-chopda">
              <T en={`— ${notes[i][0]}`} gu={<span className="text-lg">— {notes[i][1]}</span>} />
            </p>
          </li>
        ))}
        <li aria-hidden className="w-2 shrink-0" />
      </ol>

      {/* the growth thread, drawn in ink */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <svg ref={lineRef} viewBox="0 0 1000 150" className="h-auto w-full overflow-visible" role="img" aria-label="2005: 1 shop. 2008: 2 shops. 2014: new name. 2018: around 50 places. 2024: 30+ branches.">
          <path
            d="M20 120 C 120 118, 170 112, 230 104 S 360 96, 440 84 S 600 52, 680 40 S 860 22, 980 14"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={1}
            style={{ strokeDasharray: 1, strokeDashoffset: drawn ? 0 : 1, transition: "stroke-dashoffset 1.8s cubic-bezier(.6,0,.2,1)" }}
          />
          {[
            [20, 120],
            [230, 104],
            [440, 84],
            [680, 40],
            [980, 14],
          ].map(([x, y], i) => (
            <g key={i} style={{ opacity: drawn ? 1 : 0, transition: `opacity .4s ${0.2 + i * 0.35}s` }}>
              <circle cx={x} cy={y} r={i === active ? 10 : 7} fill={i === active ? "var(--color-chopda)" : "var(--color-milk)"} stroke="var(--color-ink)" strokeWidth="3" style={{ transition: "r .3s" }} />
              <text x={x} y={y + 40} textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"} fontFamily="var(--font-plex-mono)" fontSize="26" fill="var(--color-chopda)" fontWeight="600">
                {journey[i].year}
              </text>
            </g>
          ))}
        </svg>
        <ul className="mt-1 grid grid-cols-5 gap-1 text-center font-hand text-lg leading-tight text-ink-2 sm:text-2xl">
          {milestones.map(([en, gu], i) => (
            <li key={en} className={i === 0 ? "text-left" : i === 4 ? "text-right" : ""}>
              <button type="button" onClick={() => goTo(i)} className={i === active ? "text-chopda underline decoration-wavy underline-offset-4" : ""}>
                <T en={en} gu={<span className="text-sm">{gu}</span>} />
              </button>
            </li>
          ))}
        </ul>
        <Link href="/story" transitionTypes={["turn-fwd"]} className="mt-6 inline-block font-semibold text-chopda underline decoration-2 underline-offset-4">
          <T en="Read the whole story →" gu="આખી વાર્તા વાંચો →" />
        </Link>
      </div>
    </section>
  );
}
