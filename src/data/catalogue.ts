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
  nameGu: string;
  pack: string;
  packGu: string;
  price: number; // INR
  image?: string;
  note?: string;
  noteGu?: string;
};

export type Category = { slug: string; en: string; gu: string; line: string; lineGu: string };

export const categories: Category[] = [
  { slug: "milk", en: "Milk", gu: "દૂધ", line: "Pasteurised every morning, chilled below 4°C.", lineGu: "રોજ સવારે પાશ્ચરાઇઝ્ડ, 4°C થી ઓછા તાપમાને ઠંડું." },
  { slug: "buttermilk", en: "Butter Milk", gu: "છાશ", line: "Traditionally cultured, naturally probiotic.", lineGu: "પરંપરાગત રીતે જમાવેલી, કુદરતી પ્રોબાયોટિક." },
  { slug: "ghee", en: "Ghee", gu: "ઘી", line: "Bilona method, granular, golden.", lineGu: "બિલોના પદ્ધતિ, દાણાદાર, સોનેરી." },
  { slug: "paneer", en: "Paneer", gu: "પનીર", line: "Made daily from 100% cow milk.", lineGu: "100% ગાયના દૂધમાંથી રોજ તાજું." },
  { slug: "dahi", en: "Dahi", gu: "દહીં", line: "Thick, firm set, never touched by hand.", lineGu: "જાડું, મજબૂત જમાવટ, હાથ અડાડ્યા વિના." },
  { slug: "butter", en: "Butter", gu: "માખણ", line: "Churned from fresh cream, salted or not.", lineGu: "તાજી મલાઈમાંથી વલોવેલું, મીઠાવાળું કે વગરનું." },
  { slug: "lassi", en: "Lassi", gu: "લસ્સી", line: "Slow-churned from our own thick curd.", lineGu: "અમારા પોતાના જાડા દહીંમાંથી ધીમે વલોવેલી." },
  { slug: "ice-cream", en: "Ice Cream", gu: "આઇસક્રીમ", line: "Real milk and cream, never vegetable fat.", lineGu: "સાચું દૂધ અને મલાઈ, વનસ્પતિ ચરબી ક્યારેય નહીં." },
  { slug: "sweets", en: "Sweets", gu: "મીઠાઈ", line: "Small batches by our halwais, in pure ghee.", lineGu: "શુદ્ધ ઘીમાં, અમારા કંદોઈના હાથે નાના ઘાણમાં." },
  { slug: "namkeen", en: "Namkeen", gu: "ફરસાણ", line: "Spices ground in-house, fried in small batches.", lineGu: "ઘરે દળેલા મસાલા, નાના ઘાણમાં તળેલું." },
  { slug: "cooking-oil", en: "Cooking Oil", gu: "તેલ", line: "Gently refined, high smoke point.", lineGu: "હળવેથી રિફાઇન્ડ, ઊંચા સ્મોક પોઇન્ટવાળું." },
];

export const skus: Sku[] = [
  { id: "milk-gold-500", cat: "milk", name: "Gold Milk", nameGu: "ગોલ્ડ દૂધ", pack: "500 ml pouch", packGu: "500 મિ.લી. પાઉચ", price: 36, image: "/images/main_milkg.png", note: "Full cream · 6.0% fat", noteGu: "ફુલ ક્રીમ · 6.0% ફેટ" },
  { id: "milk-shakti-500", cat: "milk", name: "Shakti Milk", nameGu: "શક્તિ દૂધ", pack: "500 ml pouch", packGu: "500 મિ.લી. પાઉચ", price: 33, image: "/images/dudh2.png", note: "Standardised · 4.5% fat", noteGu: "સ્ટાન્ડર્ડાઇઝ્ડ · 4.5% ફેટ" },
  { id: "milk-taza-500", cat: "milk", name: "Taza Milk", nameGu: "તાઝા દૂધ", pack: "500 ml pouch", packGu: "500 મિ.લી. પાઉચ", price: 28, image: "/images/dudh1.png", note: "Toned · 3.0% fat", noteGu: "ટોન્ડ · 3.0% ફેટ" },
  { id: "milk-special-500", cat: "milk", name: "Special Milk", nameGu: "સ્પેશિયલ દૂધ", pack: "500 ml pouch", packGu: "500 મિ.લી. પાઉચ", price: 32, image: "/images/dudh3.png", note: "Jyada cup chai, jyada munafa", noteGu: "જ્યાદા કપ ચા, જ્યાદા મુનાફા" },

  { id: "chaas-500", cat: "buttermilk", name: "Butter Milk", nameGu: "છાશ", pack: "500 ml bottle", packGu: "500 મિ.લી. બોટલ", price: 20, image: "/images/milk1.png" },
  { id: "chaas-1000", cat: "buttermilk", name: "Butter Milk", nameGu: "છાશ", pack: "1 litre bottle", packGu: "1 લિટર બોટલ", price: 35, image: "/images/milk1.png" },

  { id: "ghee-500", cat: "ghee", name: "Pure Desi Ghee", nameGu: "શુદ્ધ દેશી ઘી", pack: "500 g jar", packGu: "500 ગ્રામ બરણી", price: 375, image: "/images/ghee_tin_1.png" },
  { id: "ghee-1000", cat: "ghee", name: "Pure Desi Ghee", nameGu: "શુદ્ધ દેશી ઘી", pack: "1 kg container", packGu: "1 કિલો ડબ્બો", price: 730, image: "/images/ghee2.png" },
  { id: "ghee-15000", cat: "ghee", name: "Pure Desi Ghee", nameGu: "શુદ્ધ દેશી ઘી", pack: "15 kg tin", packGu: "15 કિલો ડબ્બો", price: 10500, image: "/images/ghee_tin_3.png", note: "For caterers & big families", noteGu: "કેટરર્સ અને મોટા પરિવાર માટે" },

  { id: "paneer-200", cat: "paneer", name: "Fresh Paneer", nameGu: "તાજું પનીર", pack: "200 g", packGu: "200 ગ્રામ", price: 95, image: "/images/main_paneer1.png" },
  { id: "paneer-500", cat: "paneer", name: "Fresh Paneer", nameGu: "તાજું પનીર", pack: "500 g", packGu: "500 ગ્રામ", price: 230, image: "/images/main_paneer1.png" },
  { id: "paneer-1000", cat: "paneer", name: "Fresh Paneer", nameGu: "તાજું પનીર", pack: "1 kg", packGu: "1 કિલો", price: 450, image: "/images/main_paneer1.png" },

  { id: "dahi-400", cat: "dahi", name: "Set Dahi", nameGu: "જમાવેલું દહીં", pack: "400 g cup", packGu: "400 ગ્રામ કપ", price: 40, image: "/images/dahi.png" },
  { id: "dahi-1000", cat: "dahi", name: "Set Dahi", nameGu: "જમાવેલું દહીં", pack: "1 kg tub", packGu: "1 કિલો ડબ્બી", price: 95, image: "/images/dahi.png" },

  { id: "butter-100", cat: "butter", name: "Classic Butter", nameGu: "ક્લાસિક માખણ", pack: "100 g", packGu: "100 ગ્રામ", price: 60, image: "/images/butter1.png" },
  { id: "butter-200", cat: "butter", name: "Classic Butter", nameGu: "ક્લાસિક માખણ", pack: "200 g", packGu: "200 ગ્રામ", price: 115, image: "/images/butter1.png" },
  { id: "butter-500", cat: "butter", name: "Classic Butter", nameGu: "ક્લાસિક માખણ", pack: "500 g", packGu: "500 ગ્રામ", price: 285, image: "/images/butter2.png" },

  { id: "lassi-plain", cat: "lassi", name: "Plain Lassi", nameGu: "સાદી લસ્સી", pack: "200 ml", packGu: "200 મિ.લી.", price: 25, image: "/images/lassi5.png" },
  { id: "lassi-mango", cat: "lassi", name: "Mango Lassi", nameGu: "મેંગો લસ્સી", pack: "200 ml", packGu: "200 મિ.લી.", price: 35, image: "/images/lassi2.png" },
  { id: "lassi-makhaniya", cat: "lassi", name: "Makhaniya Lassi", nameGu: "મખનિયા લસ્સી", pack: "200 ml", packGu: "200 મિ.લી.", price: 35, image: "/images/lassi3.png" },
  { id: "lassi-kesariya", cat: "lassi", name: "Kesariya Lassi", nameGu: "કેસરિયા લસ્સી", pack: "200 ml", packGu: "200 મિ.લી.", price: 40, image: "/images/lassi4.png" },
  { id: "lassi-rajwadi", cat: "lassi", name: "Rajwadi Dry Fruit Lassi", nameGu: "રજવાડી ડ્રાયફ્રૂટ લસ્સી", pack: "200 ml", packGu: "200 મિ.લી.", price: 45, image: "/images/lassi1.png" },

  { id: "ic-vanilla", cat: "ice-cream", name: "Creamy Vanilla", nameGu: "ક્રીમી વેનિલા", pack: "1 litre", packGu: "1 લિટર", price: 220, image: "/images/icecream_1.png" },
  { id: "ic-gulab", cat: "ice-cream", name: "Royal Gulab", nameGu: "રોયલ ગુલાબ", pack: "1 litre", packGu: "1 લિટર", price: 260, image: "/images/icecream_3.png" },
  { id: "ic-kesar-pista", cat: "ice-cream", name: "Kesar Pista", nameGu: "કેસર પિસ્તા", pack: "1 litre", packGu: "1 લિટર", price: 300, image: "/images/icecream_2.png" },
  { id: "ic-rajbhog", cat: "ice-cream", name: "Rajbhog", nameGu: "રાજભોગ", pack: "1 litre", packGu: "1 લિટર", price: 300, image: "/images/icecream_4.png" },
  { id: "ic-american", cat: "ice-cream", name: "American Dryfruits", nameGu: "અમેરિકન ડ્રાયફ્રૂટ", pack: "1 litre", packGu: "1 લિટર", price: 320, image: "/images/icecream_5.png" },
  { id: "ic-kaju-draksh", cat: "ice-cream", name: "Kaju Draksh", nameGu: "કાજુ દ્રાક્ષ", pack: "1 litre", packGu: "1 લિટર", price: 300, image: "/images/icecream_6.png" },

  { id: "sw-kaju-katli", cat: "sweets", name: "Kaju Katli", nameGu: "કાજુ કતરી", pack: "500 g box", packGu: "500 ગ્રામ બોક્સ", price: 560, image: "/images/sweets_04.png" },
  { id: "sw-milk-cake", cat: "sweets", name: "Milk Cake", nameGu: "મિલ્ક કેક", pack: "500 g box", packGu: "500 ગ્રામ બોક્સ", price: 300, image: "/images/sweets_06.png" },
  { id: "sw-badam-peda", cat: "sweets", name: "Badam Keshar Peda", nameGu: "બદામ કેસર પેંડા", pack: "500 g box", packGu: "500 ગ્રામ બોક્સ", price: 380, image: "/images/sweets_3.png" },
  { id: "sw-besan-ladoo", cat: "sweets", name: "Chana (Besan) Ladoo", nameGu: "ચણા (બેસન) લાડુ", pack: "500 g box", packGu: "500 ગ્રામ બોક્સ", price: 260, image: "/images/sweets_01.png" },
  { id: "sw-churma", cat: "sweets", name: "Churma Ladoo", nameGu: "ચુરમાના લાડુ", pack: "500 g box", packGu: "500 ગ્રામ બોક્સ", price: 240, image: "/images/sweets_02.png" },
  { id: "sw-motichur", cat: "sweets", name: "Motichur Ladoo", nameGu: "મોતીચૂર લાડુ", pack: "500 g box", packGu: "500 ગ્રામ બોક્સ", price: 260, image: "/images/sweets_2.png" },
  { id: "sw-thabdi", cat: "sweets", name: "Thabdi Peda", nameGu: "થાબડી પેંડા", pack: "500 g box", packGu: "500 ગ્રામ બોક્સ", price: 320, image: "/images/sweets_1.png" },
  { id: "sw-pista", cat: "sweets", name: "White Pista Barfi", nameGu: "સફેદ પિસ્તા બરફી", pack: "500 g box", packGu: "500 ગ્રામ બોક્સ", price: 420, image: "/images/sweets_4.png" },

  { id: "nk-nylon", cat: "namkeen", name: "Nylon Ghatiya", nameGu: "નાયલોન ગાંઠિયા", pack: "400 g", packGu: "400 ગ્રામ", price: 110, image: "/images/namkeen1.png" },
  { id: "nk-rajwadi", cat: "namkeen", name: "Rajwadi Mix", nameGu: "રજવાડી મિક્સ", pack: "400 g", packGu: "400 ગ્રામ", price: 130, image: "/images/namkeen2.png" },
  { id: "nk-ratlami", cat: "namkeen", name: "Ratlami Sev", nameGu: "રતલામી સેવ", pack: "400 g", packGu: "400 ગ્રામ", price: 110, image: "/images/namkeen3.png" },
  { id: "nk-chana-dal", cat: "namkeen", name: "Chana Dal", nameGu: "ચણા દાળ", pack: "400 g", packGu: "400 ગ્રામ", price: 120, image: "/images/namkeen4.png" },

  { id: "oil-1", cat: "cooking-oil", name: "Refined Cooking Oil", nameGu: "રિફાઇન્ડ ખાદ્ય તેલ", pack: "1 litre", packGu: "1 લિટર", price: 175 },
  { id: "oil-5", cat: "cooking-oil", name: "Refined Cooking Oil", nameGu: "રિફાઇન્ડ ખાદ્ય તેલ", pack: "5 litre can", packGu: "5 લિટર કેન", price: 850 },
  { id: "oil-15", cat: "cooking-oil", name: "Refined Cooking Oil", nameGu: "રિફાઇન્ડ ખાદ્ય તેલ", pack: "15 litre tin", packGu: "15 લિટર ડબ્બો", price: 2450 },
];

export const skuById = new Map(skus.map((s) => [s.id, s]));
export const categoryOf = (slug: string) => categories.find((c) => c.slug === slug);
