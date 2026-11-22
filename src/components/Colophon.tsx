import Link from "next/link";
import { site } from "@/data/site";

/** The ledger's last page. */
export default function Colophon() {
  return (
    <footer className="cloth mt-28 text-milk">
      <div className="stitch h-0.5 opacity-70" aria-hidden />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-gu text-2xl text-haldi">કાર્યે સિદ્ધિ સત્વે ભવતિ</p>
          <p className="mt-1 text-sm text-milk/70">Roughly: “work done with purity succeeds.” The line above our logo.</p>
          <p className="mt-6 max-w-sm font-display text-3xl leading-tight">
            Written in the same book since 2005. Thank you for being an entry in it.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-haldi">Head office</p>
          <address className="mt-3 text-sm not-italic leading-relaxed text-milk/85">
            {site.address.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </address>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-haldi">Talk to us</p>
          <ul className="mt-3 space-y-1.5 font-mono text-sm">
            <li><a className="hover:underline" href={site.phoneHref}>{site.phone}</a></li>
            <li><a className="hover:underline" href={site.customerCareHref}>{site.customerCare}</a> <span className="font-sans text-milk/60">care</span></li>
            <li><a className="hover:underline" href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><a className="hover:underline" href={site.instagram} target="_blank" rel="noopener noreferrer">@karnavatidairyofficial</a></li>
          </ul>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-sm text-milk/80">
            <li><Link href="/products" className="hover:text-milk">Counter</Link></li>
            <li><Link href="/hisaab" className="hover:text-milk">Hisaab</Link></li>
            <li><Link href="/stores" className="hover:text-milk">Shops</Link></li>
            <li><Link href="/story" className="hover:text-milk">Story</Link></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-8 text-xs text-milk/55 sm:px-6">© {new Date().getFullYear()} Karnavati Dairy, Ahmedabad.</p>
    </footer>
  );
}
