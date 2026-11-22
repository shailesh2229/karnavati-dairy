"use client";

import { useState } from "react";
import StorePicker, { type Picked } from "@/components/StorePicker";
import Directions from "@/components/Directions";
import T from "@/components/T";

export default function ShopFinder() {
  const [picked, setPicked] = useState<Picked | null>(null);
  return (
    <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12">
      <div className="order-2 md:order-1">
        <StorePicker
          selectedId={picked?.store.id ?? null}
          onPick={(p) => {
            setPicked(p);
            if (window.matchMedia("(max-width: 767px)").matches) {
              requestAnimationFrame(() => document.getElementById("directions")?.scrollIntoView({ behavior: "smooth", block: "start" }));
            }
          }}
        />
      </div>
      <div id="directions" className="order-1 scroll-mt-4 md:order-2">
        <div className="md:sticky md:top-6">
          {picked ? (
            <Directions store={picked.store} km={picked.km} />
          ) : (
            <div className="ledger rounded-2xl border-2 border-dashed border-ink/40 p-6 pl-14 md:pl-28">
              <p className="font-hand text-3xl text-chopda">
                <T en="pick a shop →" gu={<span className="text-xl">દુકાન પસંદ કરો →</span>} />
              </p>
              <p className="mt-2 leading-[2.75rem] text-ink-2">
                <T
                  en="Use your location or search your area. Then open Google Maps, book a ride straight to the shop, or copy the address."
                  gu="તમારું સ્થાન વાપરો કે વિસ્તાર શોધો. પછી Google Maps ખોલો, સીધી દુકાન સુધી રાઇડ બુક કરો, કે સરનામું કૉપિ કરો."
                />
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
