
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
}

export const initialFlowers: Flower[] = [
  {
    id: "1",
    nameKey: "redRoses",
    price: 299,
    image: "🌹",
    descKey: "redRosesDesc",
    category: "flowers",
    available: true,
    tiedLength: 4,
    ballQuantity: 1
  },
  {
    id: "2",
    nameKey: "sunflowers",
    price: 199,
    image: "🌻",
    descKey: "sunflowersDesc",
    category: "flowers",
    available: true,
    tiedLength: 3.5,
    ballQuantity: 1
  },
  {
    id: "3",
    nameKey: "whiteLilies",
    price: 249,
    image: "🌺",
    descKey: "whiteLiliesDesc",
    category: "flowers",
    available: true,
    tiedLength: 4,
    ballQuantity: 1
  },
  {
    id: "4",
    nameKey: "pinkTulips",
    price: 279,
    image: "🌷",
    descKey: "pinkTulipsDesc",
    category: "flowers",
    available: true,
    tiedLength: 3,
    ballQuantity: 1
  },
  {
    id: "5",
    nameKey: "yellowMarigolds",
    price: 149,
    image: "🌼",
    descKey: "yellowMarigoldsDesc",
    category: "flowers",
    available: true,
    tiedLength: 5,
    ballQuantity: 2
  },
  {
    id: "6",
    nameKey: "purpleOrchids",
    price: 399,
    image: "🌸",
    descKey: "purpleOrchidsDesc",
    category: "flowers",
    available: true,
    tiedLength: 4.5,
    ballQuantity: 1
  },
  {
    id: "7",
    nameKey: "",
    customName: "Rose Garland",
    price: 150,
    image: "🌹",
    descKey: "",
    customDesc: "Beautiful fresh rose garland for special occasions",
    category: "maala",
    available: true,
    isCustom: true,
    tiedLength: 6,
    ballQuantity: 3
  },
  {
    id: "8",
    nameKey: "",
    customName: "Fresh Coconut",
    price: 45,
    image: "🥥",
    descKey: "",
    customDesc: "Fresh coconut for pooja and cooking",
    category: "coconut",
    available: true,
    isCustom: true
  },
  {
    id: "9",
    nameKey: "",
    customName: "Sesame Oil",
    price: 85,
    image: "🛢️",
    descKey: "",
    customDesc: "Pure sesame oil for pooja and cooking",
    category: "oils",
    available: true,
    isCustom: true
  }
];

export const categories = [
  { id: "all", titleKey: "allFlowers", image: "🌺" },
  { id: "flowers", titleKey: "flowers", image: "🌹" },
  { id: "maala", titleKey: "maala", image: "🌿" },
  { id: "pooja", titleKey: "pooja", image: "🕉️" },
  { id: "oils", titleKey: "oils", image: "🛢️" },
  { id: "coconut", titleKey: "coconut", image: "🥥" },
  { id: "other", titleKey: "other", image: "📦" }
];
