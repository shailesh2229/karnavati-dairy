/**
 * Karnavati Dairy outlets. Pins come from the Google Maps links on the old website;
 * area/pincode were looked up from each pin (OpenStreetMap) and should be checked.
 *
 * ⚠️ TO CHECK with the business:
 *  - `whatsapp`: every store currently uses the head-office number. Put each shop's own number here.
 *  - Vastral's pin on the old site points near Shela/Sanand, not Vastral (east Ahmedabad).
 *  - "Sarkari Tubewell" & "Celebration City Centre Road" share one pin; so do "Skycity, Shela" & "Club O7 (Branch 2)".
 *  - Jetavada and Dadgam had no map link, so they have no pin (directions use the written address).
 */
export const HEAD_OFFICE_WHATSAPP = "919574459222";

export type Store = {
  id: string;
  name: string;
  region: "Ahmedabad" | "North Gujarat";
  address: string;
  city: string;
  state: string;
  pincode: string;
  lat: number | null;
  lng: number | null;
  map: string | null;
  whatsapp: string;
};

export const stores: Store[] = [
  { id: "bopal-gam", name: "Bopal Gam", region: "Ahmedabad", address: "Bopal Gam, Panchayat Road, Ghuma", city: "Ahmedabad", state: "Gujarat", pincode: "380058", lat: 23.036225, lng: 72.4624442, map: "https://maps.app.goo.gl/bnr4M1giJLBtd8b36", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "ambavadi", name: "Ambavadi", region: "Ahmedabad", address: "Ambavadi, Bhudarpura Road, Ambawadi", city: "Ahmedabad", state: "Gujarat", pincode: "380007", lat: 23.0144299, lng: 72.5460971, map: "https://www.google.com/maps/place/Karnavati+Dairy/@23.0144299,72.5460971,17z/data=!3m1!4b1!4m6!3m5!1s0x395e84e03b123eb3:0xb8154b2487c6d454!8m2!3d23.0144299!4d72.5460971!16s%2Fg%2F1pty11t5q!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MDIyMi4wIKXMDSoASAFQAw%3D%3D", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "shilaj-canal-road", name: "Shilaj Canal Road", region: "Ahmedabad", address: "Shilaj Canal Road, Shilaj", city: "Ahmedabad", state: "Gujarat", pincode: "380059", lat: 23.0490052, lng: 72.4769245, map: "https://maps.app.goo.gl/wqHQP6ckjBeTtt1SA", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "suncity-south-bopal", name: "Suncity, South Bopal", region: "Ahmedabad", address: "Suncity, South Bopal", city: "Ahmedabad", state: "Gujarat", pincode: "380058", lat: 23.0186073, lng: 72.4766807, map: "https://maps.app.goo.gl/A7NWFMDbrDaXJ8A28", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "ramdev-nagar-road", name: "Ramdev Nagar Road", region: "Ahmedabad", address: "Ramdev Nagar Road, Prahladnagar", city: "Ahmedabad", state: "Gujarat", pincode: "380051", lat: 23.0158582, lng: 72.5141655, map: "https://maps.app.goo.gl/kKseasNm51KeHNgp7", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "nikol", name: "Nikol", region: "Ahmedabad", address: "Nikol, Thakkarabapa Nagar", city: "Ahmedabad", state: "Gujarat", pincode: "382350", lat: 23.0392918, lng: 72.6495751, map: "https://maps.app.goo.gl/D7sn5awcsu4nwpSHA", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "shilaj-gam", name: "Shilaj Gam", region: "Ahmedabad", address: "Shilaj Gam, Shilaj", city: "Ahmedabad", state: "Gujarat", pincode: "380058", lat: 23.0520098, lng: 72.4727825, map: "https://maps.app.goo.gl/ip8wVoeFZ5QD9z5R7", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "skycity-shela", name: "Skycity, Shela", region: "Ahmedabad", address: "Shela", city: "Ahmedabad", state: "Gujarat", pincode: "380058", lat: 23.005495, lng: 72.4666758, map: "https://maps.app.goo.gl/84t8wPohMwHKBwzg9", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "godagadi-stand-sanand", name: "Godagadi Stand, Sanand", region: "Ahmedabad", address: "Sanand, SH135", city: "Ahmedabad", state: "Gujarat", pincode: "382110", lat: 22.995836, lng: 72.381454, map: "https://maps.app.goo.gl/X2C9jii1wLbNgNfk6", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "thaltej", name: "Thaltej", region: "Ahmedabad", address: "Thaltej", city: "Ahmedabad", state: "Gujarat", pincode: "380059", lat: 23.0473962, lng: 72.499134, map: "https://maps.app.goo.gl/8bzCPDRAwckVaC2A9", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "kaveri-soham-bopal", name: "Kaveri Soham, Bopal", region: "Ahmedabad", address: "Kaveri Soham, SP Ring Road, Bopal", city: "Ahmedabad", state: "Gujarat", pincode: "380058", lat: 23.0473802, lng: 72.4795458, map: "https://maps.app.goo.gl/z4Qc4fkiqyiWMLKQA", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "prahlad-nagar-100-ft-road", name: "Prahlad Nagar, 100 Ft Road", region: "Ahmedabad", address: "100 Ft Road, Prahladnagar", city: "Ahmedabad", state: "Gujarat", pincode: "380051", lat: 23.0132979, lng: 72.5258618, map: "https://maps.app.goo.gl/ZNnHBGGD9WrHUVXb8", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "sarkari-tubewell-bopal", name: "Sarkari Tubewell, Bopal", region: "Ahmedabad", address: "Bopal, South Bopal", city: "Ahmedabad", state: "Gujarat", pincode: "380058", lat: 23.0294582, lng: 72.4730664, map: "https://maps.app.goo.gl/tNRkCP5jpfjRaPcE8", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "garden-residency-south-bopal", name: "Garden Residency, South Bopal", region: "Ahmedabad", address: "South Bopal, Ghuma", city: "Ahmedabad", state: "Gujarat", pincode: "380058", lat: 23.0248681, lng: 72.4654012, map: "https://maps.app.goo.gl/F2BpMzj7YMevM6sv8", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "celebration-city-centre-road-south-bopal", name: "Celebration City Centre Road, South Bopal", region: "Ahmedabad", address: "South Bopal", city: "Ahmedabad", state: "Gujarat", pincode: "380058", lat: 23.0294582, lng: 72.4730664, map: "https://maps.app.goo.gl/ehMNrKtwf3uPqr3r6", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "eklingji-road-sanand", name: "Eklingji Road, Sanand", region: "Ahmedabad", address: "Sanand", city: "Ahmedabad", state: "Gujarat", pincode: "382110", lat: 22.9894106, lng: 72.3898414, map: "https://maps.app.goo.gl/u7u6b1EcTwCseppA9", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "dps-bopal-road-shilaj", name: "DPS Bopal Road, Shilaj", region: "Ahmedabad", address: "Shilaj, DPS-Bopal Road, Ghuma", city: "Ahmedabad", state: "Gujarat", pincode: "380058", lat: 23.0465261, lng: 72.472694, map: "https://maps.app.goo.gl/AoJ5PvZFoJmyyM4r5", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "vastral", name: "Vastral", region: "Ahmedabad", address: "Vastral", city: "Ahmedabad", state: "Gujarat", pincode: "", lat: 22.9189155, lng: 72.4458063, map: "https://maps.app.goo.gl/b9FBztBq4f55BdPv7", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "marigold-circle-south-bopal", name: "Marigold Circle, South Bopal", region: "Ahmedabad", address: "South Bopal, Ghuma", city: "Ahmedabad", state: "Gujarat", pincode: "380058", lat: 23.0161121, lng: 72.4642902, map: "https://maps.app.goo.gl/xNYRs8zMyFTknaVR9", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "club-o7-shela", name: "Club O7, Shela", region: "Ahmedabad", address: "Shela", city: "Ahmedabad", state: "Gujarat", pincode: "", lat: 22.918692, lng: 72.4457773, map: "https://maps.app.goo.gl/kYmmtJLhqRNuPYho7", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "science-city", name: "Science City", region: "Ahmedabad", address: "Science City, Bhagvat, Bhadaj", city: "Ahmedabad", state: "Gujarat", pincode: "380060", lat: 23.0824504, lng: 72.5013386, map: "https://maps.app.goo.gl/7tRFpRjfCMMKizo76", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "sola-gam-road", name: "Sola Gam Road", region: "Ahmedabad", address: "Sola Gam Road, Sola", city: "Ahmedabad", state: "Gujarat", pincode: "380060", lat: 23.0768062, lng: 72.5171162, map: "https://maps.app.goo.gl/X3TTwfodMz4bgJdXA", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "chanakyapuri", name: "Chanakyapuri", region: "Ahmedabad", address: "Chanakyapuri", city: "Ahmedabad", state: "Gujarat", pincode: "380061", lat: 23.0811388, lng: 72.5318004, map: "https://maps.app.goo.gl/9K91goLCShPqu59v6", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "club-o7-branch-2", name: "Club O7 (Branch 2)", region: "Ahmedabad", address: "Shela", city: "Ahmedabad", state: "Gujarat", pincode: "380058", lat: 23.005495, lng: 72.4666758, map: "https://maps.app.goo.gl/6fu1qcDYfnT5pH8w8", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "kalol", name: "Kalol", region: "North Gujarat", address: "Kalol", city: "Kalol, Gandhinagar", state: "Gujarat", pincode: "382721", lat: 23.2356769, lng: 72.4832736, map: "https://maps.app.goo.gl/H25wCxjsy7qNeTQn8", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "palanpur", name: "Palanpur", region: "North Gujarat", address: "Palanpur, SH712", city: "Palanpur, Banaskantha", state: "Gujarat", pincode: "385001", lat: 24.1681168, lng: 72.4346731, map: "https://maps.app.goo.gl/sZxryV1Xo6Vaoj6o8", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "dantiwada", name: "Dantiwada", region: "North Gujarat", address: "Dantiwada, SH132", city: "Dantiwada, Banaskantha", state: "Gujarat", pincode: "385505", lat: 24.3227881, lng: 72.3267632, map: "https://maps.app.goo.gl/3rUTpEeDmA4MDEEq6", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "panthavada", name: "Panthavada", region: "North Gujarat", address: "Panthavada, NH168", city: "Dantiwada, Banaskantha", state: "Gujarat", pincode: "385310", lat: 24.4952422, lng: 72.2994392, map: "https://maps.app.goo.gl/SPgugsicDDvLU3x49", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "jetavada", name: "Jetavada", region: "North Gujarat", address: "Jetavada", city: "Banaskantha", state: "Gujarat", pincode: "", lat: null, lng: null, map: null, whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "dadgam", name: "Dadgam", region: "North Gujarat", address: "Dadgam", city: "Banaskantha", state: "Gujarat", pincode: "", lat: null, lng: null, map: null, whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "raniwara", name: "Raniwara", region: "North Gujarat", address: "Raniwara", city: "Raniwara, Jalore", state: "Rajasthan", pincode: "343040", lat: 24.7513413, lng: 72.2061092, map: "https://maps.app.goo.gl/228wtCquBA114hFp9", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "nenava", name: "Nenava", region: "North Gujarat", address: "Nenava, NH168A", city: "Dhanera, Banaskantha", state: "Gujarat", pincode: "385310", lat: 24.6417477, lng: 71.8926349, map: "https://maps.app.goo.gl/wSATJKd34Dw3gzMSA", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "dhanera", name: "Dhanera", region: "North Gujarat", address: "Dhanera", city: "Dhanera, Banaskantha", state: "Gujarat", pincode: "385310", lat: 24.5034431, lng: 72.0315541, map: "https://maps.app.goo.gl/VjYmRZ9bgQzDCRPP6", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "tharad", name: "Tharad", region: "North Gujarat", address: "Tharad", city: "Tharad, Vav-Tharad", state: "Gujarat", pincode: "385565", lat: 24.3843203, lng: 71.632038, map: "https://maps.app.goo.gl/zc2pf9Jchqi75DCT6", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "lakhni", name: "Lakhni", region: "North Gujarat", address: "Lakhni, SH54", city: "Lakhni, Vav-Tharad", state: "Gujarat", pincode: "", lat: 24.3123002, lng: 71.8241353, map: "https://maps.app.goo.gl/Q3ZRFtSbXK1sYMuaA", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "diyodar", name: "Diyodar", region: "North Gujarat", address: "Diyodar", city: "Diyodar, Vav-Tharad", state: "Gujarat", pincode: "385330", lat: 24.1137893, lng: 71.7768429, map: "https://maps.app.goo.gl/hkJTsTjv154e5QUJ7", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "bhildi", name: "Bhildi", region: "North Gujarat", address: "Bhildi", city: "Bhildi, Banaskantha", state: "Gujarat", pincode: "385530", lat: 24.1880403, lng: 72.0045125, map: "https://maps.app.goo.gl/pLaihrJ6pSwzBrEk9", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "thara", name: "Thara", region: "North Gujarat", address: "Thara, NH27", city: "Kankrej, Banaskantha", state: "Gujarat", pincode: "385555", lat: 23.9699773, lng: 71.8225317, map: "https://maps.app.goo.gl/SwEf81QEtp95G1vd7", whatsapp: HEAD_OFFICE_WHATSAPP },
  { id: "patan", name: "Patan", region: "North Gujarat", address: "Patan, NH68", city: "Vishnunagar, Patan", state: "Gujarat", pincode: "384266", lat: 23.8514276, lng: 72.1369732, map: "https://maps.app.goo.gl/NxuShaPvnRFjs12m8", whatsapp: HEAD_OFFICE_WHATSAPP },
];

export const storeById = (id: string) => stores.find((s) => s.id === id);
