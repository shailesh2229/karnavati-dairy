import type { MetadataRoute } from "next";

/**
 * Makes the website installable as an app (Android: "Install app" / "Add to Home screen";
 * iPhone: Share → Add to Home Screen). Opens full-screen with the Karnavati icon.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Karnavati Dairy",
    short_name: "Karnavati",
    description: "Pure milk, ghee, paneer, sweets and more from Karnavati Dairy, Ahmedabad. Order on WhatsApp or find your nearest shop.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f5ecd7",
    theme_color: "#9e1b17",
    lang: "en-IN",
    categories: ["food", "shopping"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "The Counter", short_name: "Counter", url: "/products", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Find a Shop", short_name: "Shops", url: "/stores", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "My Hisaab", short_name: "Hisaab", url: "/hisaab", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
