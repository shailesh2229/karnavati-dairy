/**
 * Counter TV — reels and videos shown on the home page.
 *
 * HOW TO ADD ONE: copy a line below and fill it in. Three kinds:
 *  - Instagram reel/post:  { kind: "instagram", url: "https://www.instagram.com/reel/XXXX/", ... }
 *  - YouTube video/Short:  { kind: "youtube",   url: "https://youtube.com/shorts/XXXX" or "https://youtu.be/XXXX", ... }
 *  - Your own video file:  { kind: "video",     src: "/videos/churning.mp4", poster: "/videos/churning.jpg", ... }
 *    (put the files in /public/videos; short, silent-friendly clips under ~8 MB work best)
 *
 * `poster` is the still shown before playing. YouTube makes its own if you leave it out;
 * for Instagram, add a screenshot of the reel (Instagram gives no public preview image),
 * otherwise a product photo is used.
 *
 * While this list is empty, the strip shows "coming soon" posters and a follow button.
 */
export type Media = {
  kind: "instagram" | "youtube" | "video";
  url?: string;
  src?: string;
  poster?: string;
  title: { en: string; gu: string };
  vertical?: boolean; // reels & Shorts are vertical (default true)
};

export const media: Media[] = [
  { kind: "youtube", url: "https://youtube.com/shorts/QiktGh-eJ4U", title: { en: "20+ years of dairy delights", gu: "20+ વર્ષથી ડેરીની મીઠાશ" } },
  { kind: "youtube", url: "https://youtube.com/shorts/kIU4IzBFa-w", title: { en: "Clean kitchens, honest quality", gu: "સફાઈ પણ, ક્વોલિટી પણ" } },
  { kind: "youtube", url: "https://youtube.com/shorts/Pi1fEn8ZNFs", title: { en: "Namkeen fried in pure groundnut oil", gu: "શુદ્ધ સિંગતેલમાં બનેલું નમકીન" } },
  { kind: "youtube", url: "https://youtube.com/shorts/TzblTcCvbX8", title: { en: "Garba needs mithai too", gu: "ગરબા સાથે મીઠાઈની મીઠાશ" } },
  { kind: "youtube", url: "https://youtube.com/shorts/s76HRqM25Ek", title: { en: "The Rakhi gift that always wins", gu: "રાખડી પર જીતે એવી ગિફ્ટ" } },
  { kind: "instagram", url: "https://www.instagram.com/reel/DfduhCmIuGz/", title: { en: "Fresh on our Instagram", gu: "અમારા Instagram પર તાજું" } },
];
