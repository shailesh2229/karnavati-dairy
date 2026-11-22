export type Variant = { name: string; subtitle?: string; text: string; image?: string; note?: string };
export type Step = { title: string; text: string };

export type Product = {
  slug: string;
  name: string;
  title: string;
  tagline: string;
  image?: string;
  color: string; // card accent
  short: string;
  intro: string[];
  variantsHeading?: string;
  variants?: Variant[];
  highlights: string[];
  why?: { title: string; text: string }[];
  processHeading: string;
  process: Step[];
};

export const products: Product[] = [
  {
    slug: "milk",
    name: "Milk",
    title: "Farm Fresh Dairy Milk",
    tagline: "Purity delivered, daily",
    image: "/images/main_milkg.png",
    color: "#e8f5fc",
    short: "Gold, Shakti, Taza and Special milk, pasteurised and delivered fresh every morning.",
    intro: [
      "Pure, farm-fresh milk, directly from our dairy to your doorstep. We follow a strict, hygienic milking and pasteurisation process so the milk keeps its natural taste, aroma and nutrition.",
      "Ethical sourcing and stringent quality control mean the highest standards in every drop.",
    ],
    variantsHeading: "Our range of milk",
    variants: [
      { name: "Gold Milk", subtitle: "Premium full cream", text: "Our richest milk, with the highest fat content. Perfect for curd, paneer and desserts.", note: "Min 6.0% fat", image: "/images/main_milkg.png" },
      { name: "Shakti Milk", subtitle: "Standardised milk", text: "The balance of health and taste. Ideal for daily drinking and family nutrition.", note: "Min 4.5% fat", image: "/images/dudh2.png" },
      { name: "Taza Milk", subtitle: "Toned milk", text: "A lighter, refreshing option for fitness lovers and anyone watching calories.", note: "Min 3.0% fat", image: "/images/dudh1.png" },
      { name: "Special Milk", subtitle: "Pasteurised, homogenised, standardised", text: "Processed to retain maximum nutrients with superior taste. Perfect for tea and coffee: “Jyada Cup Chai, Jyada Munafa”.", note: "Fat 4.5% min · SNF 8.5% min", image: "/images/dudh3.png" },
    ],
    highlights: ["100% pure milk", "Rich in protein & calcium", "Perfect for tea & coffee", "Standardised quality", "Daily farm-fresh delivery", "Tested for purity"],
    why: [
      { title: "100% pure & unadulterated", text: "Straight from the farm, with nothing added or taken away." },
      { title: "Rich in essential nutrients", text: "Calcium, protein and vitamins crucial for growth and health." },
      { title: "No preservatives", text: "Natural goodness, with no artificial ingredients or hormones." },
      { title: "Rapid farm-to-home", text: "Rapid chilling, pasteurisation and a cold chain keep it fresh." },
    ],
    processHeading: "From cow to carton: our 6-step purity protocol",
    process: [
      { title: "Ethical sourcing", text: "Cows raised in clean, stress-free environments on a balanced diet." },
      { title: "Automated milking", text: "Modern, contactless milking machines for zero contamination." },
      { title: "Instant chilling", text: "Milk is chilled below 4°C right away to lock in freshness." },
      { title: "Scientific pasteurisation", text: "Precise heat treatment removes harmful bacteria and keeps nutrients." },
      { title: "Quality testing", text: "Every batch is tested for purity, fat and safety at multiple checkpoints." },
      { title: "Sealed cold-chain delivery", text: "Packed in sealed, food-grade pouches and delivered cold." },
    ],
  },
  {
    slug: "buttermilk",
    name: "Butter Milk",
    title: "Traditional Butter Milk",
    tagline: "Refreshing tradition in every sip",
    image: "/images/milk1.png",
    color: "#e6f4ff",
    short: "Traditionally cultured chaas, rich in natural probiotics and great for digestion.",
    intro: [
      "Authentic butter milk crafted with time-honoured methods that preserve its natural probiotics and refreshing taste.",
      "Natural fermentation and strict quality control ensure the highest standards in every bottle.",
    ],
    highlights: ["Cooling & hydrating", "Excellent source of probiotics", "Aids digestion", "Naturally low in fat", "Great post-meal refresher", "Rich in nutrients"],
    why: [
      { title: "100% natural fermentation", text: "Traditionally cultured, with no artificial starters or additives." },
      { title: "Rich in probiotics", text: "Beneficial bacteria for gut health and better digestion." },
      { title: "No artificial preservatives", text: "Natural tangy flavour, nothing artificial." },
      { title: "Fresh daily delivery", text: "Properly chilled and delivered on time." },
    ],
    processHeading: "From milk to butter milk",
    process: [
      { title: "Quality milk selection", text: "Fresh, high-quality milk from our own dairy." },
      { title: "Natural culturing", text: "Cultured with traditional methods for healthy bacterial growth." },
      { title: "Controlled fermentation", text: "Precise temperatures develop the perfect tangy flavour." },
      { title: "Traditional churning", text: "Gently churned to separate butter and build texture." },
      { title: "Quality testing", text: "Each batch is checked for taste, consistency and probiotics." },
      { title: "Fresh packaging", text: "Packed in sealed, food-grade bottles and delivered fresh." },
    ],
  },
  {
    slug: "ghee",
    name: "Ghee",
    title: "Pure Desi Ghee",
    tagline: "Golden goodness of tradition",
    image: "/images/ghee2.png",
    color: "#fff4d6",
    short: "Bilona-method desi ghee with rich aroma and granular texture. 500 g, 1 kg and 15 kg.",
    intro: [
      "Our pure desi ghee is made the traditional bilona way for a rich aroma, granular texture and unmatched flavour.",
      "Perfect for daily cooking, poojas or gifting, it brings authentic Indian taste to your kitchen.",
    ],
    variantsHeading: "Sizes for every kitchen",
    variants: [
      { name: "500 g Jar", subtitle: "The ideal starter pack", text: "For lighter use or for buying fresh more often. The sealed jar locks in aroma until the last scoop, and it makes a lovely gift.", image: "/images/ghee_tin_1.png" },
      { name: "1 kg Container", subtitle: "Kitchen essential", text: "The standard size for the Indian kitchen: great value for daily cooking, traditional recipes and ceremonies.", image: "/images/ghee2.png" },
      { name: "15 kg Bulk Tin", subtitle: "The economical choice", text: "Best value for large families, caterers and high-volume use, in an airtight metal tin.", image: "/images/ghee_tin_3.png" },
    ],
    highlights: ["High smoke point", "Vitamins A, D, E & K", "Lactose & casein-free", "Enhances flavour", "Good for brain health", "Boosts immunity & digestion"],
    why: [
      { title: "Made from cultured butter", text: "Not from cream, for an authentic taste." },
      { title: "Healthy fats & nutrients", text: "Naturally rich in CLA and vitamins A, D, E and K." },
      { title: "Ayurvedic goodness", text: "Supports immunity and digestion." },
      { title: "Unmatched flavour", text: "Granular texture and deep aroma in every dish." },
    ],
    processHeading: "How we make it",
    process: [
      { title: "Cultured curd", text: "Fresh cow milk is set into curd by natural fermentation." },
      { title: "Churning", text: "The curd is churned to extract makkhan (white butter)." },
      { title: "Slow heating", text: "The butter is slowly heated in traditional vessels into golden ghee." },
      { title: "Filtration & packing", text: "Carefully filtered and packed with no additives." },
    ],
  },
  {
    slug: "paneer",
    name: "Paneer",
    title: "Pure Paneer",
    tagline: "Freshness, protein & purity",
    image: "/images/main_paneer1.png",
    color: "#fdf3ea",
    short: "Soft, fresh paneer made daily from 100% cow milk, with no starch or preservatives.",
    intro: [
      "Our paneer is made daily from fresh cow milk with a traditional yet hygienic process, so it’s soft, rich in protein and absolutely fresh.",
      "Perfect for curries, tikkas, parathas or salads. We never compromise on the milk or the process.",
    ],
    highlights: ["Made from 100% cow milk", "High in protein & calcium", "Soft, creamy texture", "Low in carbs", "No added starch", "Fresh daily production"],
    processHeading: "Production process",
    process: [
      { title: "Pure milk", text: "Our own pasteurised milk for consistency and quality." },
      { title: "Coagulation", text: "Milk is gently curdled with natural food-grade acids." },
      { title: "Separation", text: "Curds are carefully separated from the whey." },
      { title: "Pressing", text: "Pressed to the perfect texture: not too soft, not too hard." },
      { title: "Cutting & packing", text: "Cut, weighed and vacuum-packed for freshness." },
    ],
  },
  {
    slug: "dahi",
    name: "Dahi",
    title: "Traditional Set Dahi",
    tagline: "The creamy purity of cultured curd",
    image: "/images/dahi.png",
    color: "#eef6fb",
    short: "Thick, smooth set curd with natural probiotics, for raita, lassi or a bowl on its own.",
    intro: [
      "Our dahi is made with an age-old fermentation process, using the finest pasteurised milk and active cultures for a smooth, thick and firm set.",
      "It’s a natural source of probiotics for digestion and immunity, and the perfect base for raita or a cool lassi.",
    ],
    highlights: ["Natural probiotic", "High in calcium & B12", "Aids digestion & immunity", "Cooling & refreshing", "For sweet lassi & raita", "Good dairy protein"],
    why: [
      { title: "Active probiotics", text: "Supports balanced gut flora and nutrient absorption." },
      { title: "Naturally cooling", text: "Especially refreshing in Gujarat’s summers." },
      { title: "Rich in calcium", text: "For strong bones and teeth." },
      { title: "Velvety set", text: "Thick, smooth and firm: a sign of quality." },
    ],
    processHeading: "Our setting & quality protocol",
    process: [
      { title: "Select dairy", text: "Finest homogenised milk for a consistent base." },
      { title: "Premium culture", text: "Pure lactic cultures added under sterile conditions." },
      { title: "Precision setting", text: "Slow, controlled incubation for a firm curd." },
      { title: "Untouched by hand", text: "Fully hygienic from start to finish." },
      { title: "Quality assurance", text: "Fat, acidity and safety checked before release." },
      { title: "Sealed freshness", text: "Tamper-proof containers keep cultures active." },
    ],
  },
  {
    slug: "butter",
    name: "Butter",
    title: "Pure Dairy Butter",
    tagline: "Golden richness, creamy texture",
    image: "/images/butter1.png",
    color: "#fff6dc",
    short: "Churned from fresh cream. Salted and unsalted, in 100 g, 200 g and 500 g packs.",
    intro: [
      "Churned from the finest fresh cream for a deep flavour and smooth, melt-in-your-mouth texture: essential for baking, spreading and everyday cooking.",
      "Strict cold-chain and hygiene standards keep it fresh from the farm to your table.",
    ],
    variantsHeading: "Classic table butter",
    variants: [
      { name: "Karnavati Classic Butter", subtitle: "The everyday essential", text: "A clean, subtle flavour for toast or rich Indian gravies. Available salted and unsalted.", note: "100 g · 200 g · 500 g", image: "/images/butter2.png" },
    ],
    highlights: ["Made from pure cream", "Rich in vitamins A & E", "Perfect for baking", "Energy for growth", "Salted & unsalted", "Adds rich flavour"],
    why: [
      { title: "High fat content", text: "Richness for better baking and cooking." },
      { title: "Naturally rich in vitamins", text: "A natural source of vitamins A, D, E and K." },
      { title: "Pure ingredients", text: "No artificial colours, preservatives or additives." },
      { title: "100% dairy cream", text: "Churned only from fresh, high-quality cream." },
    ],
    processHeading: "The 5-step churning protocol",
    process: [
      { title: "Cream sourcing", text: "Only the best pasteurised fresh cream." },
      { title: "Temperature conditioning", text: "Chilled to the ideal temperature for perfect granules." },
      { title: "Churning", text: "Agitated until butter separates from buttermilk." },
      { title: "Washing & working", text: "Excess moisture removed, then lightly salted or left unsalted." },
      { title: "Cold packing", text: "Packed airtight to preserve freshness and aroma." },
    ],
  },
  {
    slug: "lassi",
    name: "Lassi",
    title: "Traditional Lassi",
    tagline: "Our signature lassi range",
    image: "/images/main_lassi.png",
    color: "#fdeef3",
    short: "Plain, Mango, Makhaniya, Kesariya and Rajwadi Dry Fruits, all made from thick Karnavati curd.",
    intro: [
      "Our lassi isn’t just a drink, it’s a tradition. We start with fresh curd made from our pure milk and churn it slowly to keep its natural tang and creamy texture.",
      "We blend in only natural flavours and a touch of sweetness, so every sip is thick, refreshing and satisfying.",
    ],
    variantsHeading: "Flavours",
    variants: [
      { name: "Plain Lassi", text: "The timeless classic: subtle tang, creamy texture, and great with any meal.", image: "/images/lassi5.png" },
      { name: "Mango Lassi", text: "Real Alphonso mango pulp blended with our curd. Summer in a glass.", image: "/images/lassi2.png" },
      { name: "Makhaniya Lassi", text: "Enriched with extra cream and malai for a rich, royal mouthfeel.", image: "/images/lassi3.png" },
      { name: "Kesariya Lassi", text: "Infused with pure Kashmiri saffron for a golden hue and delicate aroma.", image: "/images/lassi4.png" },
      { name: "Rajwadi Dry Fruits", text: "Loaded with almonds, cashews, pistachios and walnuts. Fit for royalty.", image: "/images/lassi1.png" },
    ],
    highlights: ["Traditional yogurt drink", "Cooling & hydrating", "Soothes the stomach", "Probiotics & calcium", "Sweet or salty", "Instant energy"],
    processHeading: "How we make it",
    process: [
      { title: "Fresh curd", text: "Made from our own pure milk." },
      { title: "Slow churning", text: "Time-honoured methods keep the natural tang." },
      { title: "Natural flavours", text: "Real fruit, saffron and dry fruits, with just a touch of sweetness." },
      { title: "Chilled & sealed", text: "Packed fresh for daily refreshment." },
    ],
  },
  {
    slug: "ice-cream",
    name: "Ice Cream",
    title: "Premium Ice Creams",
    tagline: "Six flavours, pure Karnavati goodness",
    image: "/images/main_icecream.png",
    color: "#fdeff6",
    short: "Real milk-and-cream ice cream, from Creamy Vanilla to Kesar Pista and Rajbhog.",
    intro: [
      "Slow-churned from our freshest full-cream milk and flash-frozen for fine ice crystals, giving a denser, creamier scoop where real fruit and nut flavours shine.",
      "Strict quality control from pasteurisation to packing means a premium, safe and indulgent dessert every time.",
    ],
    variantsHeading: "Flavours",
    variants: [
      { name: "Creamy Vanilla", text: "The timeless classic with pure vanilla and our rich farm-fresh milk.", image: "/images/icecream_1.png" },
      { name: "Royal Gulab", text: "Delicate rose petals with hints of cardamom: fragrant and floral.", image: "/images/icecream_3.png" },
      { name: "Kesar Pista", text: "The king of Indian ice creams: saffron strands and crunchy pistachios.", image: "/images/icecream_2.png" },
      { name: "Rajbhog", text: "Nuts, saffron and cardamom in every bite. A festive favourite.", image: "/images/icecream_4.png" },
      { name: "American Dryfruits", text: "Almonds, cashews, walnuts and raisins in a rich cream base.", image: "/images/icecream_5.png" },
      { name: "Kaju Draksh", text: "Crunchy cashews and sweet raisins in a creamy malai base.", image: "/images/icecream_6.png" },
    ],
    highlights: ["Real milk & cream", "Classic & new flavours", "Perfect summer treat", "Scoops & cones", "Calcium & energy", "Loved by all ages"],
    why: [
      { title: "Pure milk base", text: "Never made with vegetable-fat substitutes." },
      { title: "Real ingredients", text: "Authentic fruit pulp, nuts and spices." },
      { title: "Incredibly creamy", text: "High fat for a dense, smooth mouthfeel." },
      { title: "Perfect scooping", text: "Slow-churned to minimise air and maximise flavour." },
    ],
    processHeading: "Our secret to the perfect scoop",
    process: [
      { title: "Full-cream milk", text: "We start with our freshest full-cream milk." },
      { title: "Slow churning", text: "Less air, more flavour." },
      { title: "Flash freezing", text: "Fine ice crystals for a denser, creamier texture." },
      { title: "Quality packing", text: "Checked at every stage before it reaches you." },
    ],
  },
  {
    slug: "sweets",
    name: "Sweets",
    title: "Authentic Indian Sweets",
    tagline: "Richness in every tradition",
    image: "/images/main_sweets.png",
    color: "#fff1e3",
    short: "Kaju katli, thabdi, pedas and ladoos, handmade with pure milk and desi ghee.",
    intro: [
      "Traditional recipes meet modern hygiene. Every sweet is rich in flavour, purity and nostalgia, perfect for festivals, celebrations or everyday indulgence.",
      "Made in small batches by skilled halwais using our farm-fresh milk, pure desi ghee and the finest dry fruits.",
    ],
    variantsHeading: "Handcrafted specialities",
    variants: [
      { name: "Kaju Katli", subtitle: "The diamond of sweets", text: "Ground cashews and sugar syrup, finished with silver leaf. Thin, smooth, melt-in-the-mouth.", image: "/images/sweets_04.png" },
      { name: "Milk Cake", subtitle: "Granular perfection", text: "Milk and sugar slowly simmered for a caramelised, granular texture.", image: "/images/sweets_06.png" },
      { name: "Badam Keshar Peda", subtitle: "Aromatic indulgence", text: "Soft milk solids with ground almonds and saffron.", image: "/images/sweets_3.png" },
      { name: "Chana (Besan) Ladoo", subtitle: "Nutty & wholesome", text: "Roasted gram flour, pure desi ghee and sugar.", image: "/images/sweets_01.png" },
      { name: "Churma Ladoo", subtitle: "The festive treat", text: "Coarse wheat, fried and crushed, with plenty of ghee and jaggery.", image: "/images/sweets_02.png" },
      { name: "Motichur Ladoo", subtitle: "Tiny pearls of delight", text: "Pearl-sized boondi soaked in saffron syrup. Soft and juicy.", image: "/images/sweets_2.png" },
      { name: "Thabdi Peda", subtitle: "Gujarat’s caramelised delight", text: "Milk slow-cooked until dark, dense and caramelised. A regional favourite.", image: "/images/sweets_1.png" },
      { name: "White Pista Barfi / Peda", subtitle: "Elegant nutty fusion", text: "A light milk sweet with finely ground pistachios.", image: "/images/sweets_4.png" },
    ],
    highlights: ["Pure, high-quality ingredients", "Perfect for festivals", "Traditional flavours", "Freshly prepared daily", "Handcrafted with care", "Ideal for gifting"],
    processHeading: "How we make it",
    process: [
      { title: "Fresh ingredients", text: "Farm-fresh milk, pure desi ghee, the finest dry fruits." },
      { title: "Handcrafted", text: "Small batches by skilled halwais." },
      { title: "No artificial additives", text: "No colours, preservatives or artificial flavours." },
      { title: "Hygienic packing", text: "Modern sealing keeps every sweet fresh." },
    ],
  },
  {
    slug: "namkeen",
    name: "Namkeen",
    title: "Crispy & Savoury Namkeen",
    tagline: "The perfect crunch",
    image: "/images/namkeen1.png",
    color: "#fff3df",
    short: "Nylon ghatiya, Rajwadi mix, Ratlami sev and chana dal for tea time and travel.",
    intro: [
      "Authentic Indian savoury snacks, made with high-quality ingredients and traditional recipes passed down through generations.",
      "Tea time, travel or a festive gathering: our namkeen adds a burst of flavour to any moment.",
    ],
    variantsHeading: "Our savoury range",
    variants: [
      { name: "Nylon Ghatiya", text: "Fine, light strands of gram flour with a mild spice blend. Great on poha or with tea.", image: "/images/namkeen1.png" },
      { name: "Rajwadi Mix", text: "Flat sev, spicy boondi, puffed rice and roasted nuts in premium spices.", image: "/images/namkeen2.png" },
      { name: "Ratlami Sev", text: "Thick, rustic gram-flour sev with chilli and black pepper for real heat.", image: "/images/namkeen3.png" },
      { name: "Chana Dal", text: "Crispy fried chickpea lentils, lightly salted and tangy. High in protein.", image: "/images/namkeen4.png" },
    ],
    highlights: ["Perfect spice & crunch", "Ideal tea-time snack", "Regional flavours", "Great for festivals", "Instant energy", "Tested for freshness"],
    processHeading: "Our quality process",
    process: [
      { title: "Sourced ingredients", text: "The finest flours, handpicked pulses and groundnuts." },
      { title: "Authentic blending", text: "Spices freshly ground in-house with halwai techniques." },
      { title: "Small-batch frying", text: "Controlled batches in high-quality oil for maximum crispness." },
      { title: "Immediate sealing", text: "Moisture-proof packing locks in freshness." },
    ],
  },
  {
    slug: "cooking-oil",
    name: "Cooking Oil",
    title: "Pure Cooking Oil",
    tagline: "Purity in every drop",
    color: "#f4f8e6",
    short: "Carefully refined cooking oil with a high smoke point, for every Indian dish.",
    intro: [
      "Pure cooking oil, carefully processed to preserve its natural nutrients and cooking properties.",
      "Stringent extraction, gentle refining and rigorous quality control ensure the highest standards in every bottle.",
    ],
    highlights: ["High smoke point", "Rich in MUFA", "Neutral flavour", "Tested for purity", "Heart friendly", "For all Indian cuisine"],
    why: [
      { title: "100% pure extraction", text: "Modern methods that keep nutrients and remove impurities." },
      { title: "Heart healthy", text: "Balanced fatty acids that support heart health." },
      { title: "No chemical additives", text: "No artificial preservatives or chemical treatments." },
      { title: "Fresh stock", text: "Stored and handled properly for quality and shelf life." },
    ],
    processHeading: "From source to bottle",
    process: [
      { title: "Seed selection", text: "Premium oil seeds from trusted farms." },
      { title: "Careful cleaning", text: "Seeds cleaned of dust and impurities." },
      { title: "Modern extraction", text: "Preserves natural nutrients." },
      { title: "Gentle refining", text: "Removes impurities, keeps nutrition and flavour." },
      { title: "Quality testing", text: "Every batch is tested before bottling." },
      { title: "Hygienic packing", text: "Sealed in food-grade bottles." },
    ],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
