import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import LangSwitch from "@/components/LangSwitch";

/** The ledger's red cloth spine across the top. */
export default function Masthead() {
  return (
    <header className="cloth relative text-milk">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Karnavati Dairy home">
          <span className="rounded-lg bg-milk p-1 shadow-[0_2px_0_rgb(0_0_0/0.25)]">
            <Image src="/images/logo.png" alt="" width={34} height={37} className="h-9 w-auto" preload />
          </span>
          <span className="leading-none">
            <span className="block font-display text-lg font-semibold tracking-tight sm:text-xl">Karnavati Dairy</span>
            <span className="mt-0.5 block font-gu text-[13px] text-haldi">કર્ણાવતી ડેરી · since 2005</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <a href={site.phoneHref} className="hidden font-mono text-sm text-milk/85 hover:text-milk lg:block">
            {site.phone}
          </a>
          <LangSwitch />
        </div>
      </div>
      <div className="stitch absolute inset-x-0 bottom-1 h-0.5 opacity-70" aria-hidden />
    </header>
  );
}
