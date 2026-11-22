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
const N = journey.length;
const dots: [number, number][] = [
  [20, 120],
  [230, 104],
  [440, 84],
  [680, 40],
  [980, 14],
];

/**
 * The old ledger as a book you flip by scrolling.
 * The section pins; scroll progress (--p, 0..1) turns each page over its left edge,
 * draws the ink line and ages the background. Pure CSS transforms driven by one variable.
 */
export default function LedgerPages() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the user's motion preference after mount
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const sec = sectionRef.current;
    const stage = stageRef.current;
    if (!sec || !stage) return;
    let raf = 0;
    let last = -1;
    const update = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      stage.style.setProperty("--p", p.toFixed(4));
      const a = Math.min(N - 1, Math.round(p * (N - 1)));
      if (a !== last) {
        if (last !== -1) play("page");
        last = a;
        setActive(a);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  /** scroll the window to the point where page i is open */
  const goTo = (i: number) => {
    const sec = sectionRef.current;
    if (!sec) return;
    const total = sec.offsetHeight - window.innerHeight;
    const top = sec.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (total * Math.max(0, Math.min(N - 1, i))) / (N - 1) + 2, behavior: "smooth" });
  };

  const heading = (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-chopda">
        <T en="From the old ledger" gu="જૂના ચોપડામાંથી" />
      </p>
      <h2 id="ledger-title" className="mt-1 font-display text-3xl leading-tight sm:text-5xl">
        <T en="Amar Dairy, 2005. Karnavati, ever since." gu="2005 માં અમર ડેરી. ત્યારથી કર્ણાવતી." />
      </h2>
    </div>
  );

  /* Reduced motion: the same pages, simply stacked. */
  if (reduce) {
    return (
      <section className="mx-auto mt-24 max-w-3xl px-4 sm:px-6" aria-labelledby="ledger-title">
        {heading}
        <ol className="mt-8 space-y-8">
          {journey.map((j, i) => (
            <li key={j.year} className="oldpage relative rounded-[4px_14px_14px_4px] p-5 pl-14 sm:p-7 sm:pl-20">
              <PageBody i={i} />
            </li>
          ))}
        </ol>
        <StoryLink />
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative mt-24" style={{ height: `${100 + (N - 1) * 85}svh` }} aria-labelledby="ledger-title">
      <div
        ref={stageRef}
        className="ledger-stage sticky top-0 flex h-[100svh] flex-col overflow-hidden"
        style={{ "--p": 0 } as React.CSSProperties}
      >
        <div className="mx-auto w-full max-w-6xl px-4 pt-5 sm:px-6 sm:pt-8">{heading}</div>

        {/* giant year, written in as each page turns */}
        <p aria-hidden className="pointer-events-none absolute -right-4 top-[14%] select-none font-mono text-[34vw] font-semibold leading-none text-transparent sm:top-[10%] sm:text-[22vw]" style={{ WebkitTextStroke: "2px rgb(158 27 23 / 0.18)" }}>
          <span key={active} className="ink-in inline-block">
            {journey[active].year}
          </span>
        </p>

        {/* the book */}
        <div className="relative mx-auto mt-4 w-full max-w-6xl flex-1 px-4 sm:mt-6 sm:px-6">
          <ol className="book relative mx-auto h-full max-h-[36rem] w-full max-w-[30rem]" aria-label="Ledger pages">
            {journey.map((j, i) => (
              <li
                key={j.year}
                className="leaf oldpage absolute inset-0 overflow-hidden rounded-[4px_14px_14px_4px] p-4 pl-12 sm:p-7 sm:pl-20"
                style={{ "--i": i, zIndex: N - i } as React.CSSProperties}
                aria-hidden={i !== active}
              >
                <PageBody i={i} compact />
              </li>
            ))}
          </ol>
        </div>

        {/* ink line, drawn with the scroll */}
        <div className="mx-auto w-full max-w-3xl px-4 pb-[calc(84px+env(safe-area-inset-bottom))] pt-3 sm:px-6 md:pb-6">
          <svg viewBox="0 0 1000 160" className="h-auto w-full overflow-visible" role="img" aria-label="2005: 1 shop. 2008: 2 shops. 2014: new name. 2018: around 50 places. 2024: 30+ branches.">
            <path d="M20 120 C 120 118, 170 112, 230 104 S 360 96, 440 84 S 600 52, 680 40 S 860 22, 980 14" fill="none" stroke="var(--color-ink)" strokeOpacity=".15" strokeWidth="3" strokeDasharray="6 8" />
            <path
              d="M20 120 C 120 118, 170 112, 230 104 S 360 96, 440 84 S 600 52, 680 40 S 860 22, 980 14"
              fill="none"
              stroke="var(--color-chopda)"
              strokeWidth="4"
              strokeLinecap="round"
              pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: "calc(1 - var(--p))" }}
            />
            {dots.map(([x, y], i) => (
              <g key={i} onClick={() => goTo(i)} className="cursor-pointer">
                <circle cx={x} cy={y} r={i === active ? 12 : 8} fill={i <= active ? "var(--color-chopda)" : "var(--color-milk)"} stroke="var(--color-ink)" strokeWidth="3" style={{ transition: "r .3s, fill .3s" }} />
                <text x={x} y={y + 44} textAnchor={i === 0 ? "start" : i === N - 1 ? "end" : "middle"} fontFamily="var(--font-plex-mono)" fontSize="28" fontWeight="600" fill={i <= active ? "var(--color-chopda)" : "var(--color-ink-2)"}>
                  {journey[i].year}
                </text>
              </g>
            ))}
          </svg>
          <ul className="mt-1 grid grid-cols-5 gap-1 font-hand text-base leading-tight text-ink-2 sm:text-2xl">
            {milestones.map(([en, gu], i) => (
              <li key={en} className={i === 0 ? "text-left" : i === N - 1 ? "text-right" : "text-center"}>
                <button type="button" onClick={() => goTo(i)} className={i === active ? "text-chopda underline decoration-wavy underline-offset-4" : ""}>
                  <T en={en} gu={<span className="text-xs sm:text-sm">{gu}</span>} />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-hand text-xl text-ink-2">
              {active < N - 1 ? <T en="keep scrolling to turn the page ↓" gu={<span className="text-base">પાનું ફેરવવા નીચે સરકાવો ↓</span>} /> : <StoryLink inline />}
            </p>
            <p className="font-mono text-sm">
              {active + 1} / {N}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PageBody({ i, compact = false }: { i: number; compact?: boolean }) {
  const j = journey[i];
  return (
    <>
      <span aria-hidden className="absolute inset-y-6 left-2 w-1 bg-[repeating-linear-gradient(to_bottom,var(--color-chopda)_0_10px,transparent_10px_22px)] opacity-60" />
      {i === 2 && <span aria-hidden className="teamark absolute -right-6 bottom-10 size-36" />}
      {i === 4 && <span aria-hidden className="teamark absolute -left-4 top-24 size-28" />}
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-2">
          <T en="Page" gu="પાનું" /> {j.year}
        </p>
        <span className="stamp rotate-[-10deg] px-2 py-0.5 font-mono text-2xl font-semibold text-chopda sm:text-3xl">{j.year}</span>
      </div>
      <figure className="relative mt-3">
        <span aria-hidden className="absolute -top-3 left-6 z-10 h-6 w-20 rotate-[-6deg] bg-haldi/55" />
        <span aria-hidden className="absolute -top-3 right-6 z-10 h-6 w-16 rotate-[5deg] bg-haldi/45" />
        <div className={`overflow-hidden border-[6px] border-white bg-white shadow-[0_10px_18px_-8px_rgb(60_40_10/0.45)] ${i % 2 ? "rotate-1" : "-rotate-1"}`}>
          <Image src={j.image} alt={`${j.year}: ${j.title}`} width={1400} height={990} sizes="(max-width: 640px) 80vw, 440px" className={`w-full object-cover sepia-[.25] ${compact ? "aspect-[16/10] max-h-[28svh]" : "aspect-[4/3]"}`} />
        </div>
      </figure>
      <h3 className="mt-3 font-display text-xl leading-tight sm:mt-4 sm:text-3xl">
        <T en={j.title} gu={j.titleGu} />
      </h3>
      <p className={`mt-1.5 text-ink-2 ${compact ? "line-clamp-4 text-sm leading-snug sm:line-clamp-none sm:text-base sm:leading-relaxed" : "leading-relaxed"}`}>
        <T en={j.text} gu={j.textGu} />
      </p>
      <p className="mt-2 -rotate-2 font-hand text-xl text-chopda sm:mt-3 sm:text-2xl">
        <T en={`— ${notes[i][0]}`} gu={<span className="text-base">— {notes[i][1]}</span>} />
      </p>
    </>
  );
}

function StoryLink({ inline = false }: { inline?: boolean }) {
  return (
    <Link href="/story" transitionTypes={["turn-fwd"]} className={`${inline ? "font-sans text-base" : "mt-6 inline-block"} font-semibold text-chopda underline decoration-2 underline-offset-4`}>
      <T en="Read the whole story →" gu="આખી વાર્તા વાંચો →" />
    </Link>
  );
}
