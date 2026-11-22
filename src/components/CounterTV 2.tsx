"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { highlights, media, type Media } from "@/data/media";
import { site } from "@/data/site";
import { useTr } from "@/lib/lang";
import { play } from "@/lib/sound";
import T from "@/components/T";

const fallbackPosters = ["/images/ghee2.png", "/images/main_sweets.png", "/images/main_lassi.png", "/images/main_icecream.png", "/images/main_paneer1.png", "/images/main_milkg.png"];

function youtubeId(url: string) {
  return url.match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/)?.[1] ?? null;
}

/**
 * Counter TV: reels and videos as a strip of film pasted into the ledger.
 * Instagram and YouTube players load only when tapped (no tracking until then);
 * the dairy's own clips loop silently while on screen.
 */
export default function CounterTV() {
  const empty = media.length === 0;
  return (
    <section className="mt-24 overflow-hidden" aria-labelledby="tv-title">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 sm:px-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-chopda">
            <T en="Counter TV" gu="કાઉન્ટર ટીવી" />
          </p>
          <h2 id="tv-title" className="mt-2 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
            <T en="See it being made." gu="બનતું જુઓ." />
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border-2 border-ink bg-milk px-4 py-2 font-semibold transition hover:bg-[#fde7ef]"
          >
            <InstaIcon /> {site.instagramHandle}
          </a>
          <a
            href={site.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border-2 border-ink bg-milk px-4 py-2 font-semibold transition hover:bg-[#ffe3e0]"
          >
            <YouTubeIcon /> YouTube
          </a>
        </div>
      </div>

      {highlights.length > 0 && <Highlights />}

      {/* the film strip */}
      <div className="filmstrip relative mt-8 py-6">
        <ul className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:px-6 md:px-[max(1.5rem,calc((100%-72rem)/2+1.5rem))]">
          {empty
            ? fallbackPosters.slice(0, 5).map((p, i) => <ComingSoon key={p} poster={p} i={i} />)
            : media.map((m, i) => (
                <li key={(m.url ?? m.src ?? "") + i} className="snap-start">
                  <Frame m={m} i={i} />
                </li>
              ))}
        </ul>
      </div>
      {empty && (
        <p className="mx-auto mt-4 max-w-6xl px-4 font-hand text-2xl text-ink-2 sm:px-6">
          <T en="reels from our kitchens are on their way — follow along on Instagram meanwhile ↗" gu={<span className="text-lg">અમારા રસોડાની રીલ્સ આવી રહી છે — ત્યાં સુધી Instagram પર જુઓ ↗</span>} />
        </p>
      )}
    </section>
  );
}

function Frame({ m, i }: { m: Media; i: number }) {
  const tr = useTr();
  const [on, setOn] = useState(false);
  const vertical = m.vertical ?? true;
  const yt = m.kind === "youtube" && m.url ? youtubeId(m.url) : null;
  const poster = m.poster ?? (yt ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` : fallbackPosters[i % fallbackPosters.length]);
  const size = vertical ? "w-[62vw] max-w-[17rem] aspect-[9/16]" : "w-[84vw] max-w-[30rem] aspect-video";
  const title = tr(m.title.en, m.title.gu);

  if (m.kind === "video" && m.src) return <OwnClip m={m} size={size} poster={m.poster} title={title} />;

  // Instagram's embed is a cramped white widget that won't play inline, so reels open in Instagram itself
  const src = yt ? `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&playsinline=1&rel=0` : null;
  const external = m.url ?? site.instagram;

  return (
    <figure className={`relative overflow-hidden rounded-md bg-black ${size}`}>
      {on && src ? (
        <iframe src={src} title={title} className="size-full border-0" allow="autoplay; encrypted-media; picture-in-picture; clipboard-write" allowFullScreen loading="lazy" />
      ) : (
        <button
          type="button"
          onClick={() => {
            play("tick");
            if (src) setOn(true);
            else window.open(external, "_blank", "noopener");
          }}
          className="group relative block size-full"
          aria-label={tr(`Play: ${m.title.en}`, `ચલાવો: ${m.title.gu}`)}
        >
          {poster.startsWith("http") ? (
            <Image src={poster} alt="" fill sizes="280px" className="object-cover opacity-90 transition group-hover:scale-105" />
          ) : (
            <span className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_40%,#fff7e6,#e9d3a6)]">
              <Image src={poster} alt="" width={260} height={260} className="w-3/4 object-contain drop-shadow-xl transition group-hover:scale-105" />
            </span>
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <span
            className={`absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-2xl text-milk transition group-hover:scale-110 ${
              m.kind === "instagram" ? "bg-[linear-gradient(45deg,#f9a825,#e1306c,#833ab4)] shadow-[0_4px_0_#5b1f78]" : "bg-chopda shadow-[0_4px_0_var(--color-chopda-dark)]"
            }`}
          >
            ▶
          </span>
          <span className="absolute inset-x-3 bottom-3 text-left">
            <span className="block font-display text-lg leading-tight text-white">{title}</span>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-white/80">
              {m.kind === "youtube" ? "YouTube" : <T en="Watch on Instagram ↗" gu="Instagram પર જુઓ ↗" />}
            </span>
          </span>
        </button>
      )}
      {on && (
        <a href={external} target="_blank" rel="noopener noreferrer" className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink">
          <T en="Open app ↗" gu="ઍપમાં ખોલો ↗" />
        </a>
      )}
    </figure>
  );
}

/** The dairy's own clip: silent loop while on screen, tap for sound. */
function OwnClip({ m, size, poster, title }: { m: Media; size: string; poster?: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !reduce) void v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.5 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <figure className={`relative overflow-hidden rounded-md bg-black ${size}`}>
      <video ref={ref} src={m.src} poster={poster} muted={muted} loop playsInline preload="metadata" className="size-full object-cover" aria-label={title} />
      <button
        type="button"
        onClick={() => {
          setMuted((x) => !x);
          void ref.current?.play().catch(() => {});
        }}
        className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink"
      >
        {muted ? <T en="🔇 Tap for sound" gu="🔇 અવાજ માટે ટૅપ" /> : <T en="🔊 Sound on" gu="🔊 અવાજ ચાલુ" />}
      </button>
      <figcaption className="pointer-events-none absolute inset-x-3 bottom-3 font-display text-lg leading-tight text-white drop-shadow">{title}</figcaption>
    </figure>
  );
}

function ComingSoon({ poster, i }: { poster: string; i: number }) {
  const labels: [string, string][] = [
    ["Bilona ghee, start to finish", "બિલોના ઘી, શરૂથી અંત સુધી"],
    ["The halwai’s morning", "કંદોઈની સવાર"],
    ["Lassi, churned slow", "ધીમે વલોવેલી લસ્સી"],
    ["Ice cream day", "આઇસક્રીમનો દિવસ"],
    ["Paneer, pressed fresh", "તાજું દબાવેલું પનીર"],
  ];
  return (
    <li className="snap-start">
      <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="group relative block aspect-[9/16] w-[56vw] max-w-[15rem] overflow-hidden rounded-md bg-[radial-gradient(circle_at_50%_40%,#fff7e6,#e9d3a6)]">
        <Image src={poster} alt="" width={240} height={240} className="absolute left-1/2 top-[38%] w-3/4 -translate-x-1/2 -translate-y-1/2 object-contain opacity-80 drop-shadow-xl grayscale-[.3] transition group-hover:grayscale-0" />
        <span className="stamp absolute left-3 top-3 rotate-[-8deg] bg-milk/60 px-2 py-0.5 font-mono text-[11px] font-semibold text-chopda">
          <T en="coming soon" gu="જલ્દી આવે છે" />
        </span>
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3 pt-10">
          <span className="block font-display text-lg leading-tight text-milk">
            <T en={labels[i][0]} gu={labels[i][1]} />
          </span>
        </span>
      </a>
    </li>
  );
}

/** Instagram story highlights as round stamps; each opens in Instagram. */
function Highlights() {
  const tr = useTr();
  return (
    <ul className="no-scrollbar mt-8 flex gap-4 overflow-x-auto px-4 pb-2 sm:gap-6 sm:px-6 md:px-[max(1.5rem,calc((100%-72rem)/2+1.5rem))]" aria-label={tr("Instagram highlights", "Instagram હાઇલાઇટ્સ")}>
      {highlights.map((h, i) => (
        <li key={h.url} className="shrink-0">
          <a href={h.url} target="_blank" rel="noopener noreferrer" onClick={() => play("tick")} className="group flex w-20 flex-col items-center gap-2 sm:w-24">
            <span
              className="grid size-20 place-items-center rounded-full p-[3px] transition-transform group-hover:-rotate-6 group-active:scale-95 sm:size-24"
              style={{ background: "conic-gradient(from 200deg, #e3a21a, #e1306c, #9e1b17, #e3a21a)", rotate: `${(i % 3) - 1}deg` }}
            >
              <span className="grid size-full place-items-center overflow-hidden rounded-full border-[3px] border-paper bg-milk">
                <Image src={h.cover} alt="" width={96} height={96} sizes="96px" className="size-full object-cover" />
              </span>
            </span>
            <span className="w-full truncate text-center text-sm font-semibold">
              <T en={h.name.en} gu={h.name.gu} />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="4" fill="#e1251b" />
      <path d="M10 9v6l5-3z" fill="#fff" />
    </svg>
  );
}

function InstaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
