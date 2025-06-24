
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
  imageFile?: File | null;
  imageFileUrl?: string;
}

export interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  flowers: Flower[];
  onUpdateFlower: (id: string, updates: Partial<Flower>) => void;
  onAddFlower: (flower: Omit<Flower, 'id'>) => void;
  onDeleteFlower: (id: string) => void;
}

export interface NewProduct {
  nameKey: string;
  customName: string;
  price: number;
  image: string;
  descKey: string;
  customDesc: string;
  category: string;
  available: boolean;
  isCustom: boolean;
  tiedLength: number;
  ballQuantity: number;
  imageFile: File | null;
  imageFileUrl: string;
}

export const categories = [
  { value: 'flowers', label: 'Flowers' },
  { value: 'maala', label: 'Flower Maala' },
  { value: 'pooja', label: 'Pooja Items' },
  { value: 'oils', label: 'Oils' },
  { value: 'coconut', label: 'Coconut Products' },
  { value: 'other', label: 'Other Items' }
];

export const initialNewProduct: NewProduct = {
  nameKey: '',
  customName: '',
  price: 0,
  image: '',
  descKey: '',
  customDesc: '',
  category: 'flowers',
  available: true,
  isCustom: true,
  tiedLength: 0,
  ballQuantity: 0,
  imageFile: null,
  imageFileUrl: ''
};
