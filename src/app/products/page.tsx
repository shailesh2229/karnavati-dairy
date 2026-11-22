import type { Metadata } from "next";
import Counter from "@/components/Counter";
import PageTurn from "@/components/PageTurn";
import T from "@/components/T";

export const metadata: Metadata = {
  title: "The Counter",
  description: "Milk, chaas, ghee, paneer, dahi, butter, lassi, ice cream, sweets, farsan and oil. Add to your hisaab — free delivery above ₹3,000.",
};

export default function CounterPage() {
  return (
    <PageTurn>
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-chopda"><T en="The counter" gu="દુકાન" /></p>
        <h1 className="mt-2 max-w-3xl font-display text-5xl leading-[0.95] sm:text-7xl"><T en="Write it in the book." gu="ચોપડામાં લખી દો." /></h1>
        <p className="mt-4 max-w-xl text-lg text-ink-2">
          <T
            en="Tap to add. Every line goes into your hisaab, and the can fills toward free delivery at ₹3,000."
            gu="ઉમેરવા ટૅપ કરો. દરેક લીટી તમારા હિસાબમાં જાય છે, અને ₹3,000 એ મફત ડિલિવરી સુધી કેન ભરાતું જાય છે."
          />
        </p>
      </section>
      <Counter />
    </PageTurn>
  );
}
