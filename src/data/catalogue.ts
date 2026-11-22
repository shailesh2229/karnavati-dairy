/**
 * Orderable items (SKUs).
 *
 * ⚠️ PRICES ARE PLACEHOLDERS. The old website listed no prices, so these are
 * sensible estimates for layout and testing only. Replace every `price` with the
 * real store price before going live.
 */
export type Sku = {
  id: string;
  cat: string; // matches Product.slug in products.ts
  name: string;
  pack: string;
  price: number; // INR
  image?: string;
  note?: string;
};

export type Category = { slug: string; en: string; gu: string; line: string };

export const categories: Category[] = [
  { slug: "milk", en: "Milk", gu: "દૂધ", line: "Pasteurised every morning, chilled below 4°C." },
  { slug: "buttermilk", en: "Butter Milk", gu: "છાશ", line: "Traditionally cultured, naturally probiotic." },
  { slug: "ghee", en: "Ghee", gu: "ઘી", line: "Bilona method, granular, golden." },
  { slug: "paneer", en: "Paneer", gu: "પનીર", line: "Made daily from 100% cow milk." },
  { slug: "dahi", en: "Dahi", gu: "દહીં", line: "Thick, firm set, never touched by hand." },
  { slug: "butter", en: "Butter", gu: "માખણ", line: "Churned from fresh cream, salted or not." },
  { slug: "lassi", en: "Lassi", gu: "લસ્સી", line: "Slow-churned from our own thick curd." },
  { slug: "ice-cream", en: "Ice Cream", gu: "આઇસક્રીમ", line: "Real milk and cream, never vegetable fat." },
  { slug: "sweets", en: "Sweets", gu: "મીઠાઈ", line: "Small batches by our halwais, in pure ghee." },
  { slug: "namkeen", en: "Namkeen", gu: "ફરસાણ", line: "Spices ground in-house, fried in small batches." },
  { slug: "cooking-oil", en: "Cooking Oil", gu: "તેલ", line: "Gently refined, high smoke point." },
];

export const skus: Sku[] = [
  { id: "milk-gold-500", cat: "milk", name: "Gold Milk", pack: "500 ml pouch", price: 36, image: "/images/main_milkg.png", note: "Full cream · 6.0% fat" },
  { id: "milk-shakti-500", cat: "milk", name: "Shakti Milk", pack: "500 ml pouch", price: 33, image: "/images/dudh2.png", note: "Standardised · 4.5% fat" },
  { id: "milk-taza-500", cat: "milk", name: "Taza Milk", pack: "500 ml pouch", price: 28, image: "/images/dudh1.png", note: "Toned · 3.0% fat" },
  { id: "milk-special-500", cat: "milk", name: "Special Milk", pack: "500 ml pouch", price: 32, image: "/images/dudh3.png", note: "Jyada cup chai, jyada munafa" },

  { id: "chaas-500", cat: "buttermilk", name: "Butter Milk", pack: "500 ml bottle", price: 20, image: "/images/milk1.png" },
  { id: "chaas-1000", cat: "buttermilk", name: "Butter Milk", pack: "1 litre bottle", price: 35, image: "/images/milk1.png" },

  { id: "ghee-500", cat: "ghee", name: "Pure Desi Ghee", pack: "500 g jar", price: 375, image: "/images/ghee_tin_1.png" },
  { id: "ghee-1000", cat: "ghee", name: "Pure Desi Ghee", pack: "1 kg container", price: 730, image: "/images/ghee2.png" },
  { id: "ghee-15000", cat: "ghee", name: "Pure Desi Ghee", pack: "15 kg tin", price: 10500, image: "/images/ghee_tin_3.png", note: "For caterers & big families" },

  { id: "paneer-200", cat: "paneer", name: "Fresh Paneer", pack: "200 g", price: 95, image: "/images/main_paneer1.png" },
  { id: "paneer-500", cat: "paneer", name: "Fresh Paneer", pack: "500 g", price: 230, image: "/images/main_paneer1.png" },
  { id: "paneer-1000", cat: "paneer", name: "Fresh Paneer", pack: "1 kg", price: 450, image: "/images/main_paneer1.png" },

  { id: "dahi-400", cat: "dahi", name: "Set Dahi", pack: "400 g cup", price: 40, image: "/images/dahi.png" },
  { id: "dahi-1000", cat: "dahi", name: "Set Dahi", pack: "1 kg tub", price: 95, image: "/images/dahi.png" },

  { id: "butter-100", cat: "butter", name: "Classic Butter", pack: "100 g", price: 60, image: "/images/butter1.png" },
  { id: "butter-200", cat: "butter", name: "Classic Butter", pack: "200 g", price: 115, image: "/images/butter1.png" },
  { id: "butter-500", cat: "butter", name: "Classic Butter", pack: "500 g", price: 285, image: "/images/butter2.png" },

  { id: "lassi-plain", cat: "lassi", name: "Plain Lassi", pack: "200 ml", price: 25, image: "/images/lassi5.png" },
  { id: "lassi-mango", cat: "lassi", name: "Mango Lassi", pack: "200 ml", price: 35, image: "/images/lassi2.png" },
  { id: "lassi-makhaniya", cat: "lassi", name: "Makhaniya Lassi", pack: "200 ml", price: 35, image: "/images/lassi3.png" },
  { id: "lassi-kesariya", cat: "lassi", name: "Kesariya Lassi", pack: "200 ml", price: 40, image: "/images/lassi4.png" },
  { id: "lassi-rajwadi", cat: "lassi", name: "Rajwadi Dry Fruit Lassi", pack: "200 ml", price: 45, image: "/images/lassi1.png" },

  { id: "ic-vanilla", cat: "ice-cream", name: "Creamy Vanilla", pack: "1 litre", price: 220, image: "/images/icecream_1.png" },
  { id: "ic-gulab", cat: "ice-cream", name: "Royal Gulab", pack: "1 litre", price: 260, image: "/images/icecream_3.png" },
  { id: "ic-kesar-pista", cat: "ice-cream", name: "Kesar Pista", pack: "1 litre", price: 300, image: "/images/icecream_2.png" },
  { id: "ic-rajbhog", cat: "ice-cream", name: "Rajbhog", pack: "1 litre", price: 300, image: "/images/icecream_4.png" },
  { id: "ic-american", cat: "ice-cream", name: "American Dryfruits", pack: "1 litre", price: 320, image: "/images/icecream_5.png" },
  { id: "ic-kaju-draksh", cat: "ice-cream", name: "Kaju Draksh", pack: "1 litre", price: 300, image: "/images/icecream_6.png" },

  { id: "sw-kaju-katli", cat: "sweets", name: "Kaju Katli", pack: "500 g box", price: 560, image: "/images/sweets_04.png" },
  { id: "sw-milk-cake", cat: "sweets", name: "Milk Cake", pack: "500 g box", price: 300, image: "/images/sweets_06.png" },
  { id: "sw-badam-peda", cat: "sweets", name: "Badam Keshar Peda", pack: "500 g box", price: 380, image: "/images/sweets_3.png" },
  { id: "sw-besan-ladoo", cat: "sweets", name: "Chana (Besan) Ladoo", pack: "500 g box", price: 260, image: "/images/sweets_01.png" },
  { id: "sw-churma", cat: "sweets", name: "Churma Ladoo", pack: "500 g box", price: 240, image: "/images/sweets_02.png" },
  { id: "sw-motichur", cat: "sweets", name: "Motichur Ladoo", pack: "500 g box", price: 260, image: "/images/sweets_2.png" },
  { id: "sw-thabdi", cat: "sweets", name: "Thabdi Peda", pack: "500 g box", price: 320, image: "/images/sweets_1.png" },
  { id: "sw-pista", cat: "sweets", name: "White Pista Barfi", pack: "500 g box", price: 420, image: "/images/sweets_4.png" },

  { id: "nk-nylon", cat: "namkeen", name: "Nylon Ghatiya", pack: "400 g", price: 110, image: "/images/namkeen1.png" },
  { id: "nk-rajwadi", cat: "namkeen", name: "Rajwadi Mix", pack: "400 g", price: 130, image: "/images/namkeen2.png" },
  { id: "nk-ratlami", cat: "namkeen", name: "Ratlami Sev", pack: "400 g", price: 110, image: "/images/namkeen3.png" },
  { id: "nk-chana-dal", cat: "namkeen", name: "Chana Dal", pack: "400 g", price: 120, image: "/images/namkeen4.png" },

  { id: "oil-1", cat: "cooking-oil", name: "Refined Cooking Oil", pack: "1 litre", price: 175 },
  { id: "oil-5", cat: "cooking-oil", name: "Refined Cooking Oil", pack: "5 litre can", price: 850 },
  { id: "oil-15", cat: "cooking-oil", name: "Refined Cooking Oil", pack: "15 litre tin", price: 2450 },
];

export const skuById = new Map(skus.map((s) => [s.id, s]));
export const categoryOf = (slug: string) => categories.find((c) => c.slug === slug);
