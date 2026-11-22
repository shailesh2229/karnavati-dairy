/**
 * Bilingual text. Renders both languages; CSS shows the one chosen on <html data-lang>.
 * Works in server and client components, with no hydration or flash issues.
 */
export default function T({ en, gu }: { en: React.ReactNode; gu: React.ReactNode }) {
  return (
    <>
      <span className="l-en">{en}</span>
      <span className="l-gu" lang="gu">
        {gu}
      </span>
    </>
  );
}
