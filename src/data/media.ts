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
  // { kind: "instagram", url: "https://www.instagram.com/reel/XXXX/", poster: "/videos/reel-1.jpg", title: { en: "Morning at the plant", gu: "પ્લાન્ટમાં સવાર" } },
  // { kind: "youtube", url: "https://youtube.com/shorts/XXXX", title: { en: "How we make ghee", gu: "અમે ઘી કેવી રીતે બનાવીએ" } },
];
