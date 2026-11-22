import type { MetadataRoute } from "next";
import { withBase } from "@/lib/basePath";

export const dynamic = "force-static";

/**
 * Makes the website installable as an app (Android: "Install app" / "Add to Home screen";
 * iPhone: Share → Add to Home Screen). Opens full-screen with the Karnavati icon.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Karnavati Dairy",
    short_name: "Karnavati",
    description: "Pure milk, ghee, paneer, sweets and more from Karnavati Dairy, Ahmedabad. Order on WhatsApp or find your nearest shop.",
    id: withBase("/"),
    start_url: withBase("/"),
    scope: withBase("/"),
    display: "standalone",
    orientation: "portrait",
    background_color: "#f5ecd7",
    theme_color: "#9e1b17",
    lang: "en-IN",
    categories: ["food", "shopping"],
    icons: [
      { src: withBase("/icons/icon-192.png"), sizes: "192x192", type: "image/png", purpose: "any" },
      { src: withBase("/icons/icon-512.png"), sizes: "512x512", type: "image/png", purpose: "any" },
      { src: withBase("/icons/maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "The Counter", short_name: "Counter", url: withBase("/products"), icons: [{ src: withBase("/icons/icon-192.png"), sizes: "192x192" }] },
      { name: "Find a Shop", short_name: "Shops", url: withBase("/stores"), icons: [{ src: withBase("/icons/icon-192.png"), sizes: "192x192" }] },
      { name: "My Hisaab", short_name: "Hisaab", url: withBase("/hisaab"), icons: [{ src: withBase("/icons/icon-192.png"), sizes: "192x192" }] },
    ],
  };
}
