"use client";

import { setLang, useLang } from "@/lib/lang";

/** English / ગુજરાતી switch, shown on the book's cover (masthead). */
export default function LangSwitch() {
  const lang = useLang();
  return (
    <div role="group" aria-label="Language / ભાષા" className="flex rounded-full border border-milk/40 bg-chopda-dark/40 p-0.5 text-sm">
      {(
        [
          ["en", ["EN", "English"], "en"],
          ["gu", ["ગુ", "ગુજરાતી"], "gu"],
        ] as const
      ).map(([code, label, l]) => (
        <button
          key={code}
          type="button"
          lang={l}
          aria-pressed={lang === code}
          aria-label={label[1]}
          onClick={() => setLang(code)}
          className={`rounded-full px-3 py-1 font-semibold transition-colors ${code === "gu" ? "font-gu" : ""} ${
            lang === code ? "bg-milk text-chopda" : "text-milk/85 hover:text-milk"
          }`}
        >
          <span className="sm:hidden">{label[0]}</span>
          <span className="hidden sm:inline">{label[1]}</span>
        </button>
      ))}
    </div>
  );
}
