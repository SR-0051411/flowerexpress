export interface Flower {
  id: string;
  nameKey: string;
  price: number;
  image: string;
  descKey: string;
  category: string;
  available?: boolean;
  isCustom?: boolean;
  customName?: string;
  customDesc?: string;
  tiedLength?: number;
  ballQuantity?: number;
  imageFileUrl?: string;
  additionalImages?: { file?: File | null; url?: string }[];
}

// Updated flower data with Tamil flowers
export const initialFlowers: Flower[] = [
  {
    id: "1",
    nameKey: "malli",
    price: 150,
    image: "🌼",
    descKey: "malliDesc",
    category: "spare",
    available: true,
    isCustom: true,
    customName: "மல்லி (Jasmine)",
    customDesc: "புதிய மல்லி பூக்கள் - Fresh jasmine flowers"
  },
  {
    id: "2", 
    nameKey: "mullai",
    price: 120,
    image: "🌸",
    descKey: "mullaiDesc", 
    category: "spare",
    available: true,
    isCustom: true,
    customName: "முல்லை (Arabian Jasmine)",
    customDesc: "நறுமணமுள்ள முல்லை பூக்கள் - Fragrant Arabian jasmine"
  },
  {
    id: "3",
    nameKey: "jathy",
    price: 180,
    image: "🌺",
    descKey: "jathyDesc",
    category: "spare", 
    available: true,
    isCustom: true,
    customName: "ஜாதி (Nutmeg Flower)",
    customDesc: "அழகான ஜாதிப்பூ - Beautiful nutmeg flowers"
  },
  {
    id: "4",
    nameKey: "arali",
    price: 100,
    image: "🌹",
    descKey: "araliDesc",
    category: "spare",
    available: true,
    isCustom: true,
    customName: "அரளி (Nerium)",
    customDesc: "வண்ணமயமான அரளி பூக்கள் - Colorful nerium flowers"
  },
  {
    id: "5",
    nameKey: "thulasi",
    price: 80,
    image: "🌿",
    descKey: "thulasiDesc",
    category: "spare",
    available: true,
    isCustom: true,
    customName: "துளசி (Holy Basil)",
    customDesc: "புனித துளசி இலைகள் - Sacred holy basil leaves"
  },
  {
    id: "6",
    nameKey: "marikolunthu", 
    price: 200,
    image: "🌻",
    descKey: "marikolunthuDesc",
    category: "spare",
    available: true,
    isCustom: true,
    customName: "மாரிகொழுந்து (Marigold)",
    customDesc: "பிரகாசமான மாரிகொழுந்து - Bright marigold flowers"
  },
  {
    id: "7",
    nameKey: "kanakamparam",
    price: 250,
    image: "🌼",
    descKey: "kanakaramDesc",
    category: "spare",
    available: true,
    isCustom: true,
    customName: "கனகாம்பர (Crossandra)",
    customDesc: "அழகான கனகாம்பர பூக்கள் - Beautiful crossandra flowers"
  },
  {
    id: "8",
    nameKey: "sampangi",
    price: 170,
    image: "🌸",
    descKey: "sampangiDesc", 
    category: "spare",
    available: true,
    isCustom: true,
    customName: "சம்பங்கி (Champak)",
    customDesc: "நறுமணமுள்ள சம்பங்கி - Fragrant champak flowers"
  },
  {
    id: "9",
    nameKey: "sevanthi",
    price: 140,
    image: "🌼",
    descKey: "sevanthiDesc",
    category: "spare", 
    available: true,
    isCustom: true,
    customName: "செவந்தி (Chrysanthemum)",
    customDesc: "அழகான செவந்தி பூக்கள் - Beautiful chrysanthemum flowers"
  },
  {
    id: "10",
    nameKey: "vettrilai",
    price: 60,
    image: "🍃",
    descKey: "vettrilaiDesc",
    category: "spare",
    available: true,
    isCustom: true,
    customName: "வெற்றிலை (Betel Leaf)",
    customDesc: "புதிய வெற்றிலை - Fresh betel leaves"
  },
  {
    id: "11", 
    nameKey: "malliTied",
    price: 300,
    image: "🌼",
    descKey: "malliTiedDesc",
    category: "tied",
    available: true,
    isCustom: true,
    customName: "மல்லி கட்டு (Jasmine Bundle)",
    customDesc: "அழகாக கட்டப்பட்ட மல்லி பூக்கள் - Beautifully tied jasmine flowers",
    tiedLength: 4,
    ballQuantity: 2
  },
  {
    id: "12",
    nameKey: "mixedTied", 
    price: 400,
    image: "🌺",
    descKey: "mixedTiedDesc",
    category: "tied",
    available: true,
    isCustom: true,
    customName: "கலவை கட்டு (Mixed Flower Bundle)",
    customDesc: "பல்வேறு பூக்கள் கலவை கட்டு - Mixed flower bundle",
    tiedLength: 5,
    ballQuantity: 3
  },
  {
    id: "13",
    nameKey: "malliGarland",
    price: 500,
    image: "🌸",
    descKey: "malliGarlandDesc", 
    category: "garland",
    available: true,
    isCustom: true,
    customName: "மல்லி மாலை (Jasmine Garland)",
    customDesc: "பாரம்பரிய மல்லி மாலை - Traditional jasmine garland",
    tiedLength: 6,
    ballQuantity: 4
  },
  {
    id: "14",
    nameKey: "mixedGarland",
    price: 650,
    image: "🌺", 
    descKey: "mixedGarlandDesc",
    category: "garland",
    available: true,
    isCustom: true,
    customName: "கலவை மாலை (Mixed Garland)",
    customDesc: "பல்வேறு பூக்கள் கலவை மாலை - Mixed flower garland",
    tiedLength: 8,
    ballQuantity: 5
  },
  {
    id: "15",
    nameKey: "lotus",
    price: 300,
    image: "🪷",
    descKey: "lotusDesc",
    category: "seasonal",
    available: true,
    isCustom: true,
    customName: "தாமரை (Lotus)",
    customDesc: "புனித தாமரை பூக்கள் - Sacred lotus flowers"
  },
  {
    id: "16",
    nameKey: "hibiscus",
    price: 80,
    image: "🌺",
    descKey: "hibiscusDesc",
    category: "seasonal",
    available: true,
    isCustom: true,
    customName: "செம்பருத்தி (Hibiscus)",
    customDesc: "பருவகால செம்பருத்தி பூக்கள் - Seasonal hibiscus flowers"
  },
  {
    id: "17",
    nameKey: "sunflower",
    price: 150,
    image: "🌻",
    descKey: "sunflowerDesc",
    category: "seasonal",
    available: true,
    isCustom: true,
    customName: "சூரியகாந்தி (Sunflower)",
    customDesc: "பருவகால சூரியகாந்தி பூக்கள் - Seasonal sunflower"
  }
];

// Updated categories - now 5 categories including seasonal
export const categories = [
  { id: "all", titleKey: "allFlowers", image: "🌺" },
  { id: "tied", titleKey: "tiedFlower", image: "🌿" },
  { id: "garland", titleKey: "flowerGarland", image: "🌸" },
  { id: "seasonal", titleKey: "seasonalFlowers", image: "🌸" }
];
