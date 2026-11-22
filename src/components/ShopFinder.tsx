"use client";

import { useState } from "react";
import StorePicker, { type Picked } from "@/components/StorePicker";
import StoreMap from "@/components/StoreMap";
import Directions from "@/components/Directions";
import { haversineKm } from "@/lib/geo";
import type { Detected } from "@/lib/locate";
import T from "@/components/T";

export default function ShopFinder() {
  const [picked, setPicked] = useState<Picked | null>(null);
  const [you, setYou] = useState<Detected | null>(null);

  const showDirections = () => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => document.getElementById("directions")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
      {/* map + directions */}
      <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <StoreMap
          selectedId={picked?.store.id ?? null}
          you={you}
          onSelect={(s) => {
            setPicked({ store: s, km: you && s.lat != null && s.lng != null ? haversineKm(you.lat, you.lng, s.lat, s.lng) : null });
            showDirections();
          }}
        />
        <div id="directions" className="scroll-mt-4">
          {picked ? (
            <Directions store={picked.store} km={picked.km} />
          ) : (
            <div className="ledger rounded-2xl border-2 border-dashed border-ink/40 p-6 pl-14 md:pl-28">
              <p className="font-hand text-3xl text-chopda">
                <T en="pick a shop" gu={<span className="text-xl">દુકાન પસંદ કરો</span>} />
              </p>
              <p className="mt-2 leading-relaxed text-ink-2">
                <T
                  en="Tap a pin on the map, use your location, or type your PIN code. Then open Google Maps, book a ride straight to the shop, or copy the address."
                  gu="નકશા પર પિન દબાવો, તમારું સ્થાન વાપરો, કે પિનકોડ લખો. પછી Google Maps ખોલો, સીધી દુકાન સુધી રાઇડ બુક કરો, કે સરનામું કૉપિ કરો."
                />
              </p>
            </div>
          )}
        </div>
      </div>

      {/* finder */}
      <div>
        <StorePicker
          selectedId={picked?.store.id ?? null}
          onDetect={setYou}
          onPick={(p, auto) => {
            setPicked(p);
            if (!auto) showDirections();
          }}
        />
      </div>
    </div>
  );
}
