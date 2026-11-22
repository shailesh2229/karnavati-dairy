/**
 * DELIVERY CONFIG — edit freely.
 *
 * PIN_TABLE: PIN code → approximate centre (lat/lng) used to find the nearest shop.
 *   Coordinates are approximate area centres. VERIFY each before going live.
 *   A PIN may appear more than once with different area names (e.g. Makarba and Vejalpur);
 *   the FIRST row for a PIN is the one used when someone types that PIN.
 *
 * FREE_DELIVERY_AREAS: where free delivery (cart ≥ ₹3,000) is offered.
 *   - pinPrefixes: any PIN starting with these (380xxx = Ahmedabad city).
 *   - pincodes:    extra PINs around Ahmedabad that we cover (Sanand, Sarkhej, Changodar, Naroda…).
 *   Anything else (Palanpur, Patan, other cities/states) → no free delivery.
 */

export type PinRow = { pin: string; area: string; lat: number; lng: number; comment?: string };

export const PIN_TABLE: PinRow[] = [
  // ── Ahmedabad city (380xxx) ── VERIFY
  { pin: "380001", area: "Bhadra / Lal Darwaja", lat: 23.0258, lng: 72.5873, comment: "VERIFY" },
  { pin: "380002", area: "Kalupur / Relief Road", lat: 23.03, lng: 72.596, comment: "VERIFY" },
  { pin: "380004", area: "Shahibaug", lat: 23.056, lng: 72.596, comment: "VERIFY" },
  { pin: "380005", area: "Sabarmati", lat: 23.08, lng: 72.588, comment: "VERIFY" },
  { pin: "380006", area: "Ellisbridge", lat: 23.022, lng: 72.565, comment: "VERIFY" },
  { pin: "380007", area: "Paldi / Ambawadi", lat: 23.013, lng: 72.56, comment: "VERIFY" },
  { pin: "380008", area: "Maninagar", lat: 22.996, lng: 72.603, comment: "VERIFY" },
  { pin: "380009", area: "Navrangpura", lat: 23.037, lng: 72.56, comment: "VERIFY" },
  { pin: "380013", area: "Naranpura", lat: 23.056, lng: 72.553, comment: "VERIFY" },
  { pin: "380014", area: "Usmanpura", lat: 23.048, lng: 72.57, comment: "VERIFY" },
  { pin: "380015", area: "Satellite / Prahladnagar", lat: 23.025, lng: 72.512, comment: "VERIFY" },
  { pin: "380016", area: "Asarva", lat: 23.048, lng: 72.605, comment: "VERIFY" },
  { pin: "380018", area: "Saraspur", lat: 23.03, lng: 72.615, comment: "VERIFY" },
  { pin: "380021", area: "Rakhial", lat: 23.02, lng: 72.628, comment: "VERIFY" },
  { pin: "380022", area: "Behrampura", lat: 23.005, lng: 72.583, comment: "VERIFY" },
  { pin: "380023", area: "Bapunagar", lat: 23.04, lng: 72.63, comment: "VERIFY" },
  { pin: "380024", area: "Thakkarbapa Nagar", lat: 23.048, lng: 72.639, comment: "VERIFY" },
  { pin: "380026", area: "Amraiwadi", lat: 23.004, lng: 72.625, comment: "VERIFY" },
  { pin: "380027", area: "Wadaj", lat: 23.061, lng: 72.572, comment: "VERIFY" },
  { pin: "380028", area: "Danilimda", lat: 22.995, lng: 72.583, comment: "VERIFY" },
  { pin: "380050", area: "Ghodasar", lat: 22.98, lng: 72.607, comment: "VERIFY" },
  { pin: "380051", area: "Vejalpur / Jivraj Park / Makarba", lat: 23.001, lng: 72.513, comment: "VERIFY" },
  { pin: "380052", area: "Memnagar", lat: 23.05, lng: 72.535, comment: "VERIFY" },
  { pin: "380054", area: "Bodakdev", lat: 23.038, lng: 72.51, comment: "VERIFY" },
  { pin: "380055", area: "Juhapura", lat: 23.0, lng: 72.525, comment: "VERIFY" },
  { pin: "380058", area: "Bopal / South Bopal / Shela / Ghuma", lat: 23.025, lng: 72.468, comment: "VERIFY" },
  { pin: "380059", area: "Thaltej / Shilaj", lat: 23.05, lng: 72.495, comment: "VERIFY" },
  { pin: "380060", area: "Sola / Science City", lat: 23.075, lng: 72.515, comment: "VERIFY" },
  { pin: "380061", area: "Ghatlodia / Chanakyapuri", lat: 23.065, lng: 72.538, comment: "VERIFY" },
  // ── Around Ahmedabad (382xxx) ── VERIFY
  { pin: "382110", area: "Sanand", lat: 22.992, lng: 72.381, comment: "VERIFY" },
  { pin: "382210", area: "Sarkhej", lat: 22.986, lng: 72.5, comment: "VERIFY: PIN also covers Bhat, Kolat, Telav, Sanathal" },
  { pin: "382213", area: "Changodar", lat: 22.93, lng: 72.44, comment: "VERIFY" },
  { pin: "382330", area: "Naroda", lat: 23.07, lng: 72.655, comment: "VERIFY" },
  { pin: "382340", area: "Kubernagar", lat: 23.07, lng: 72.63, comment: "VERIFY" },
  { pin: "382345", area: "Naroda GIDC", lat: 23.09, lng: 72.66, comment: "VERIFY" },
  { pin: "382350", area: "Nikol", lat: 23.043, lng: 72.665, comment: "VERIFY" },
  { pin: "382405", area: "Narol", lat: 22.97, lng: 72.595, comment: "VERIFY" },
  { pin: "382415", area: "Odhav", lat: 23.03, lng: 72.66, comment: "VERIFY" },
  { pin: "382418", area: "Vastral", lat: 23.005, lng: 72.665, comment: "VERIFY" },
  { pin: "382424", area: "Chandkheda", lat: 23.11, lng: 72.59, comment: "VERIFY" },
  { pin: "382440", area: "Vatva", lat: 22.96, lng: 72.63, comment: "VERIFY" },
  { pin: "382443", area: "Isanpur", lat: 22.975, lng: 72.615, comment: "VERIFY" },
  { pin: "382445", area: "Vatva GIDC", lat: 22.965, lng: 72.645, comment: "VERIFY" },
  { pin: "382449", area: "Ramol", lat: 22.99, lng: 72.66, comment: "VERIFY" },
  { pin: "382470", area: "Motera", lat: 23.1, lng: 72.6, comment: "VERIFY" },
  { pin: "382480", area: "Ranip", lat: 23.08, lng: 72.565, comment: "VERIFY" },
  { pin: "382481", area: "Gota / Chandlodia", lat: 23.1, lng: 72.545, comment: "VERIFY" },
  // extra area names people type (same PINs as above)
  { pin: "380051", area: "Makarba", lat: 22.996, lng: 72.508, comment: "VERIFY" },
  { pin: "380015", area: "Prahladnagar", lat: 23.012, lng: 72.51, comment: "VERIFY" },
  { pin: "380015", area: "Vastrapur", lat: 23.037, lng: 72.53, comment: "VERIFY" },
  { pin: "380058", area: "South Bopal", lat: 23.019, lng: 72.47, comment: "VERIFY" },
  { pin: "380058", area: "Shela", lat: 23.0, lng: 72.46, comment: "VERIFY" },
  { pin: "380059", area: "Shilaj", lat: 23.05, lng: 72.475, comment: "VERIFY" },
  { pin: "380060", area: "Science City", lat: 23.08, lng: 72.495, comment: "VERIFY" },
  // ── Outside Ahmedabad (shop towns; no free delivery) ── VERIFY
  { pin: "382010", area: "Gandhinagar", lat: 23.223, lng: 72.65, comment: "VERIFY" },
  { pin: "382721", area: "Kalol", lat: 23.244, lng: 72.497, comment: "VERIFY" },
  { pin: "385001", area: "Palanpur", lat: 24.172, lng: 72.433, comment: "VERIFY" },
  { pin: "384265", area: "Patan", lat: 23.85, lng: 72.125, comment: "VERIFY" },
  { pin: "384266", area: "Patan (Vishnunagar)", lat: 23.851, lng: 72.137, comment: "VERIFY" },
  { pin: "385535", area: "Deesa", lat: 24.258, lng: 72.191, comment: "VERIFY" },
  { pin: "385310", area: "Dhanera", lat: 24.51, lng: 72.023, comment: "VERIFY" },
  { pin: "385565", area: "Tharad", lat: 24.395, lng: 71.627, comment: "VERIFY" },
  { pin: "385505", area: "Dantiwada", lat: 24.327, lng: 72.327, comment: "VERIFY" },
  { pin: "385530", area: "Bhildi", lat: 24.188, lng: 72.004, comment: "VERIFY" },
  { pin: "385330", area: "Diyodar", lat: 24.1, lng: 71.76, comment: "VERIFY" },
  { pin: "385555", area: "Thara", lat: 23.97, lng: 71.82, comment: "VERIFY" },
  { pin: "343040", area: "Raniwara (Rajasthan)", lat: 24.75, lng: 72.21, comment: "VERIFY" },
];

export const FREE_DELIVERY_AREAS = {
  pinPrefixes: ["380"],
  pincodes: [
    "382110", // Sanand
    "382210", // Sarkhej
    "382213", // Changodar
    "382330", "382340", "382345", // Naroda, Kubernagar, Naroda GIDC
    "382350", // Nikol
    "382405", // Narol
    "382415", // Odhav
    "382418", // Vastral
    "382424", // Chandkheda
    "382440", "382443", "382445", // Vatva, Isanpur, Vatva GIDC
    "382449", // Ramol
    "382470", // Motera
    "382480", // Ranip
    "382481", // Gota / Chandlodia
  ],
  /** shown in the message when someone is outside the area */
  label: { en: "Ahmedabad (with Bopal, Shela, Shilaj, Sola, Sanand and nearby)", gu: "અમદાવાદ (બોપલ, શેલા, શીલજ, સોલા, સાણંદ અને આસપાસ)" },
};

/** A location from GPS counts as a PIN row only if it is this close to that row's centre. */
export const GPS_MATCH_KM = 6;

export function isFreeDeliveryPin(pin: string | null | undefined) {
  if (!pin || !/^\d{6}$/.test(pin)) return false;
  return FREE_DELIVERY_AREAS.pinPrefixes.some((p) => pin.startsWith(p)) || FREE_DELIVERY_AREAS.pincodes.includes(pin);
}
