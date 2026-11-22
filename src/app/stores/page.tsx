import type { Metadata } from "next";
import ShopFinder from "@/components/ShopFinder";
import { stores } from "@/data/stores";
import PageTurn from "@/components/PageTurn";
import T from "@/components/T";

export const metadata: Metadata = {
  title: "Find a Shop",
  description: "Find your nearest Karnavati Dairy shop in Ahmedabad and North Gujarat, then navigate or book an Uber, Ola or Rapido to the door.",
};

export default function StoresPage() {
  return (
    <PageTurn>
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-chopda"><T en="Shaakha · our shops" gu="શાખા" /></p>
      <h1 className="mt-2 max-w-3xl font-display text-5xl leading-[0.95] sm:text-7xl"><T en={`${stores.length} counters. One is near you.`} gu={`${stores.length} કાઉન્ટર. એક તમારી નજીક છે.`} /></h1>
      <p className="mt-4 max-w-xl text-lg text-ink-2">
        <T
          en="Find the closest Karnavati shop, then walk, drive, or have Uber, Ola or Rapido drop you right at the door."
          gu="સૌથી નજીકની કર્ણાવતી દુકાન શોધો, પછી ચાલીને, ગાડીમાં, કે Uber, Ola કે Rapido થી સીધા દરવાજે પહોંચો."
        />
      </p>
      <ShopFinder />
    </div>
    </PageTurn>
  );
}
