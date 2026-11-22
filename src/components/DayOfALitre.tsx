"use client";

import { useEffect, useRef, useState } from "react";
import T from "@/components/T";

const steps = [
  { t: "04:00", h: 4, m: 0, title: "Milked", titleGu: "દોહન", text: "Contactless machines at clean, calm farms. No hands, no contamination.", textGu: "સ્વચ્છ, શાંત ખેતરોમાં સંપર્ક વિનાના મશીન. હાથ નહીં, ભેળસેળ નહીં." },
  { t: "04:20", h: 4, m: 20, title: "Chilled", titleGu: "ઠંડું", text: "Straight below 4°C, to lock the freshness in before the sun is up.", textGu: "સૂરજ ઊગે એ પહેલાં તાજગી જાળવવા સીધું 4°C થી નીચે." },
  { t: "05:30", h: 5, m: 30, title: "Pasteurised & tested", titleGu: "પાશ્ચરાઇઝ્ડ અને ચકાસણી", text: "Precise heat, then fat, SNF and purity checked at every batch.", textGu: "ચોક્કસ ગરમી, પછી દરેક બેચમાં ફેટ, SNF અને શુદ્ધતાની તપાસ." },
  { t: "06:15", h: 6, m: 15, title: "Sealed", titleGu: "સીલબંધ", text: "Food-grade pouches, sealed and dated, into the cold chain.", textGu: "ફૂડ-ગ્રેડ પાઉચ, સીલ અને તારીખ સાથે, કોલ્ડ-ચેનમાં." },
  { t: "07:00", h: 7, m: 0, title: "At your shop", titleGu: "તમારી દુકાને", text: "On the counter of 50+ Karnavati shops before your first chai.", textGu: "તમારી પહેલી ચા પહેલાં 50+ કર્ણાવતી દુકાનોના કાઉન્ટર પર." },
];

/** A sticky clock whose hands move as you scroll through the morning. */
export default function DayOfALitre() {
  const [i, setI] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setI(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  const s = steps[i];
  const hourDeg = ((s.h % 12) + s.m / 60) * 30;
  const minDeg = s.m * 6;

  return (
    <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6" aria-labelledby="litre-title">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-chopda">
        <T en="Ek litre no divas · a litre’s morning" gu="એક લિટરની સવાર" />
      </p>
      <h2 id="litre-title" className="mt-2 max-w-2xl font-display text-4xl leading-[1.05] sm:text-6xl">
        <T en="Three hours from the farm to your chai." gu="ખેતરથી તમારી ચા સુધી ત્રણ કલાક." />
      </h2>

      <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-16">
        <div className="sticky top-2 z-10 -mx-4 bg-paper/90 px-4 py-3 backdrop-blur md:top-24 md:mx-0 md:self-start md:bg-transparent md:p-0 md:backdrop-blur-none">
          <div className="flex items-center gap-5 md:block">
            <svg viewBox="0 0 200 200" className="size-24 shrink-0 md:size-80" aria-hidden>
              <circle cx="100" cy="100" r="94" fill="var(--color-milk)" stroke="var(--color-ink)" strokeWidth="4" />
              <circle cx="100" cy="100" r="84" fill="none" stroke="var(--color-chopda)" strokeWidth="1.5" strokeDasharray="2 6.8" />
              {Array.from({ length: 12 }, (_, k) => (
                <text key={k} x={(100 + 68 * Math.sin((k * Math.PI) / 6)).toFixed(2)} y={(106 - 68 * Math.cos((k * Math.PI) / 6)).toFixed(2)} textAnchor="middle" fontFamily="var(--font-anek-gu)" fontSize="15" fill="var(--color-ink)">
                  {["૧૨", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯", "૧૦", "૧૧"][k]}
                </text>
              ))}
              <g style={{ transform: `rotate(${hourDeg}deg)`, transformOrigin: "100px 100px", transition: "transform .9s cubic-bezier(.3,1.4,.4,1)" }}>
                <line x1="100" y1="100" x2="100" y2="56" stroke="var(--color-ink)" strokeWidth="7" strokeLinecap="round" />
              </g>
              <g style={{ transform: `rotate(${minDeg + (s.h - 4) * 360}deg)`, transformOrigin: "100px 100px", transition: "transform .9s cubic-bezier(.3,1.4,.4,1)" }}>
                <line x1="100" y1="100" x2="100" y2="30" stroke="var(--color-chopda)" strokeWidth="4" strokeLinecap="round" />
              </g>
              <circle cx="100" cy="100" r="6" fill="var(--color-haldi)" stroke="var(--color-ink)" strokeWidth="2" />
            </svg>
            <div className="md:mt-6">
              <p key={s.t} className="ink-in font-mono text-3xl font-semibold text-chopda md:text-5xl">{s.t}</p>
              <p className="font-display text-xl md:text-2xl">
                <T en={s.title} gu={s.titleGu} />
              </p>
            </div>
          </div>
        </div>

        <ol className="space-y-[28vh] pb-[12vh] md:pt-[6vh]">
          {steps.map((st, k) => (
            <li
              key={st.t}
              data-i={k}
              ref={(el) => {
                refs.current[k] = el;
              }}
              className={`ledger rounded-2xl border border-ink/10 p-6 pl-16 shadow-[4px_4px_0_rgb(28_34_54/0.08)] transition-opacity duration-500 md:pl-28 ${k === i ? "opacity-100" : "opacity-45"}`}
            >
              <p className="font-mono text-sm text-chopda">{st.t} a.m.</p>
              <h3 className="mt-1 font-display text-3xl">
                <T en={st.title} gu={st.titleGu} />
              </h3>
              <p className="mt-2 text-lg leading-[2.75rem] text-ink-2">
                <T en={st.text} gu={st.textGu} />
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
