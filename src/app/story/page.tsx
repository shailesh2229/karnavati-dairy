import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/bits";
import PageTurn from "@/components/PageTurn";
import T from "@/components/T";
import { journey, locations, locationsGu, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Our Story",
  description: "From Amar Dairy in 2005 to Karnavati Dairy today: the story, the promise, and how to reach us.",
};

export default function StoryPage() {
  return (
    <PageTurn>
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-chopda">
          <T en="Vaarta · our story" gu="વાર્તા" />
        </p>
        <h1 className="mt-2 max-w-4xl font-display text-5xl leading-[0.95] sm:text-7xl">
          <T en="We named ourselves after the city’s first name." gu="અમે અમારું નામ શહેરના પહેલા નામ પરથી રાખ્યું." />
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-2">
          <T
            en="Karnavati is believed to be the original name of Ahmedabad, where this all began. In 2014, Amar Dairy took that name, because we never wanted to forget whose milk we pour."
            gu="કર્ણાવતી અમદાવાદનું મૂળ નામ માનવામાં આવે છે, જ્યાંથી આ બધું શરૂ થયું. 2014 માં અમર ડેરીએ આ નામ અપનાવ્યું, કારણ કે અમે કોનું દૂધ રેડીએ છીએ એ ક્યારેય ભૂલવું નથી."
          />
        </p>
      </section>

      <section className="mx-auto mt-16 max-w-6xl space-y-16 px-4 sm:px-6">
        {journey.map((j, i) => (
          <Reveal key={j.year} className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
            <figure className={`relative ${i % 2 ? "md:order-2" : ""}`}>
              <div className={`overflow-hidden rounded-lg border-[10px] border-milk bg-milk shadow-[0_18px_30px_-12px_rgb(28_34_54/0.45)] ${i % 2 ? "rotate-2" : "-rotate-2"}`}>
                <Image src={j.image} alt={`${j.year}: ${j.title}`} width={1400} height={990} sizes="(max-width: 768px) 92vw, 540px" className="w-full" />
              </div>
              <span className="absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 rotate-[-4deg] bg-haldi/60" aria-hidden />
            </figure>
            <div>
              <p className="font-mono text-6xl font-semibold text-chopda sm:text-8xl">{j.year}</p>
              <h2 className="mt-2 font-display text-3xl">
                <T en={j.title} gu={j.titleGu} />
              </h2>
              <p className="mt-3 text-lg text-ink-2">
                <T en={j.text} gu={j.textGu} />
              </p>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <Reveal className="cloth relative overflow-hidden rounded-3xl p-8 text-milk sm:p-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-haldi">
            <T en="Emerging Gujarat Award · 2024" gu="ઇમર્જિંગ ગુજરાત એવોર્ડ · 2024" />
          </p>
          <p className="mt-4 max-w-3xl font-display text-3xl leading-tight sm:text-5xl">
            <T
              en="“We are dedicated to nourishing communities with wholesome, delicious dairy you can trust.”"
              gu="“ભરોસાપાત્ર, પૌષ્ટિક અને સ્વાદિષ્ટ ડેરીથી સમાજને પોષવા અમે સમર્પિત છીએ.”"
            />
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="font-mono text-4xl font-semibold text-haldi">1 Cr L</p>
              <p className="text-milk/80"><T en="milk processed every year today" gu="આજે દર વર્ષે પ્રોસેસ થતું દૂધ" /></p>
            </div>
            <div>
              <p className="font-mono text-4xl font-semibold text-haldi">5 Cr L</p>
              <p className="text-milk/80"><T en="the goal within five years" gu="પાંચ વર્ષમાં લક્ષ્ય" /></p>
            </div>
            <div>
              <p className="font-mono text-4xl font-semibold text-haldi">2.5 L sq ft</p>
              <p className="text-milk/80"><T en="new plant being built to get there" gu="એ માટે બની રહેલો નવો પ્લાન્ટ" /></p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-4xl">
          <T en="Where the book has pages" gu="ચોપડાનાં પાનાં ક્યાં ક્યાં" />
        </h2>
        <p className="mt-6 font-display text-3xl leading-relaxed sm:text-5xl sm:leading-snug">
          {locations.map((l, i) => (
            <span key={l}>
              <span className={i % 3 === 0 ? "text-chopda" : i % 3 === 1 ? "text-ink" : "text-leaf"}>
                <T en={l} gu={locationsGu[i]} />
              </span>
              {i < locations.length - 1 && <span className="px-2 text-haldi">✦</span>}
            </span>
          ))}
        </p>
      </section>

      <section id="contact" className="mx-auto mt-24 max-w-6xl scroll-mt-6 px-4 sm:px-6">
        <div className="ledger grid gap-8 rounded-3xl border-2 border-ink p-6 pl-14 shadow-[8px_8px_0_var(--color-ink)] md:grid-cols-2 md:p-10 md:pl-28">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-chopda">
              <T en="Talk to us" gu="અમારી સાથે વાત કરો" />
            </p>
            <h2 className="mt-2 font-display text-4xl leading-tight">
              <T en="Call, write, or just drop in." gu="ફોન કરો, લખો, કે આવી જાઓ." />
            </h2>
            <address className="mt-4 not-italic leading-[2.75rem] text-ink-2">
              {site.address.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </address>
          </div>
          <ul className="space-y-3 self-end">
            <li>
              <a href={site.phoneHref} className="flex items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-milk px-5 py-4 font-semibold hover:bg-haldi/20">
                <T en="Enquiry" gu="પૂછપરછ" /> <span className="font-mono">{site.phone}</span>
              </a>
            </li>
            <li>
              <a href={site.customerCareHref} className="flex items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-milk px-5 py-4 font-semibold hover:bg-haldi/20">
                <T en="Customer care" gu="ગ્રાહક સેવા" /> <span className="font-mono">{site.customerCare}</span>
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-2xl border-2 border-ink bg-[#1fa855] px-5 py-4 font-semibold text-white">
                <T en="WhatsApp us" gu="WhatsApp કરો" /> <span aria-hidden>→</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="block break-all rounded-2xl border-2 border-ink bg-milk px-5 py-4 font-mono text-sm hover:bg-haldi/20">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </section>
    </PageTurn>
  );
}
