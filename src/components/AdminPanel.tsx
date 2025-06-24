

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Save } from "lucide-react";

interface Flower {
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

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  flowers: Flower[];
  onUpdateFlower: (id: string, updates: Partial<Flower>) => void;
  onAddFlower: (flower: Omit<Flower, 'id'>) => void;
  onDeleteFlower: (id: string) => void;
}

const AdminPanel = ({ isOpen, onClose, flowers, onUpdateFlower, onAddFlower, onDeleteFlower }: AdminPanelProps) => {
  const { t } = useLanguage();
  const { isOwner, logout } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFlowers, setEditingFlowers] = useState<{[key: string]: Flower}>({});
  const [newProduct, setNewProduct] = useState({
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
    imageFile: null as File | null,
    imageFileUrl: ''
  });

  const categories = [
    { value: 'flowers', label: 'Flowers' },
    { value: 'maala', label: 'Flower Maala' },
    { value: 'pooja', label: 'Pooja Items' },
    { value: 'oils', label: 'Oils' },
    { value: 'coconut', label: 'Coconut Products' },
    { value: 'other', label: 'Other Items' }
  ];

  if (!isOwner) return null;

  const handleUpdateFlower = (flowerId: string, field: keyof Flower, value: any) => {
    setEditingFlowers(prev => ({
      ...prev,
      [flowerId]: {
        ...flowers.find(f => f.id === flowerId)!,
        ...prev[flowerId],
        [field]: value
      }
    }));
  };

  const handleSaveChanges = (flowerId: string) => {
    const updatedFlower = editingFlowers[flowerId];
    if (updatedFlower) {
      onUpdateFlower(flowerId, updatedFlower);
      setEditingFlowers(prev => {
        const newState = { ...prev };
        delete newState[flowerId];
        return newState;
      });
      toast({
        title: "Product Updated",
        description: "Changes have been saved successfully",
      });
    }
  };

  const getFlowerValue = (flower: Flower, field: keyof Flower) => {
    return editingFlowers[flower.id]?.[field] ?? flower[field];
  };

  const handleNewImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProduct(prev => ({
        ...prev,
        imageFile: file,
        imageFileUrl: imageUrl
      }));
    }
  };

  const handleFlowerImageChange = (flower: Flower, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      handleUpdateFlower(flower.id, 'imageFileUrl', imageUrl);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.customName || (!newProduct.image && !newProduct.imageFileUrl) || newProduct.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    onAddFlower({
      nameKey: newProduct.nameKey,
      customName: newProduct.customName,
      price: newProduct.price,
      image: newProduct.image,
      imageFileUrl: newProduct.imageFileUrl,
      descKey: newProduct.descKey,
      customDesc: newProduct.customDesc,
      category: newProduct.category,
      available: newProduct.available,
      isCustom: true,
      tiedLength: newProduct.tiedLength > 0 ? newProduct.tiedLength : undefined,
      ballQuantity: newProduct.ballQuantity > 0 ? newProduct.ballQuantity : undefined
    });

    if (newProduct.imageFileUrl) {
      URL.revokeObjectURL(newProduct.imageFileUrl);
    }

    setNewProduct({
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
    });
    setShowAddForm(false);
    
    toast({
      title: "Product Added",
      description: "New product has been added successfully",
    });
  };

  const handleDeleteProduct = (flowerId: string) => {
    onDeleteFlower(flowerId);
    toast({
      title: "Product Deleted",
      description: "Product has been removed successfully",
    });
  };

  const handleLogout = () => {
    logout();
    onClose();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const getProductName = (flower: Flower) => {
    const nameValue = getFlowerValue(flower, 'customName');
    if (flower.isCustom && typeof nameValue === 'string') {
      return nameValue;
    }
    return t(flower.nameKey);
  };

  const getProductDesc = (flower: Flower) => {
    const descValue = getFlowerValue(flower, 'customDesc');
    if (flower.isCustom && typeof descValue === 'string') {
      return descValue;
    }
    return t(flower.descKey);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Owner Dashboard - Product Management
            </DialogTitle>
            <div className="flex space-x-2">
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Add New Product Form */}
          {showAddForm && (
            <div className="border-2 border-dashed border-green-300 rounded-lg p-6 bg-green-50">
              <h3 className="text-lg font-semibold mb-4 text-green-800">Add New Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-name">Product Name *</Label>
                  <Input
                    id="new-name"
                    value={newProduct.customName}
                    onChange={(e) => setNewProduct(prev => ({...prev, customName: e.target.value}))}
                    placeholder="Enter product name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="new-category">Category *</Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) => setNewProduct(prev => ({...prev, category: value}))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="new-price">Price (₹) *</Label>
                  <Input
                    id="new-price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({...prev, price: parseInt(e.target.value) || 0}))}
                    placeholder="Enter price"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="new-image-file">Product Image (optional, real photo)</Label>
                  <Input
                    id="new-image-file"
                    type="file"
                    accept="image/*"
                    onChange={handleNewImageFileChange}
                    className="mt-1"
                  />
                  {newProduct.imageFileUrl && (
                    <img
                      src={newProduct.imageFileUrl}
                      alt="Preview"
                      className="w-20 h-20 rounded object-cover mt-2 border"
                    />
                  )}
                  <span className="block text-xs text-gray-400 mt-1">You can use real images for product photos. If no image uploaded, emoji/icon will be shown.</span>
                </div>
                <div>
                  <Label htmlFor="new-image">Emoji/Icon *</Label>
                  <Input
                    id="new-image"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct(prev => ({...prev, image: e.target.value}))}
                    placeholder="🥥 (Enter emoji or icon)"
                    className="mt-1"
                  />
                  <span className="block text-xs text-gray-400 mt-1">If you don't upload an image, the icon/emoji will be used.</span>
                </div>
                <div>
                  <Label htmlFor="new-tied-length">Tied Length (ft)</Label>
                  <Input
                    id="new-tied-length"
                    type="number"
                    step="0.5"
                    value={newProduct.tiedLength}
                    onChange={(e) => setNewProduct(prev => ({...prev, tiedLength: parseFloat(e.target.value) || 0}))}
                    placeholder="e.g., 4"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="new-ball-quantity">Flower Balls</Label>
                  <Input
                    id="new-ball-quantity"
                    type="number"
                    value={newProduct.ballQuantity}
                    onChange={(e) => setNewProduct(prev => ({...prev, ballQuantity: parseInt(e.target.value) || 0}))}
                    placeholder="e.g., 1"
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="new-desc">Description</Label>
                  <Textarea
                    id="new-desc"
                    value={newProduct.customDesc}
                    onChange={(e) => setNewProduct(prev => ({...prev, customDesc: e.target.value}))}
                    placeholder="Enter product description"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newProduct.available}
                    onCheckedChange={(checked) => setNewProduct(prev => ({...prev, available: checked}))}
                  />
                  <Label>Available</Label>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button onClick={handleAddProduct} className="bg-green-500 hover:bg-green-600">
                  Add Product
                </Button>
                <Button onClick={() => setShowAddForm(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Existing Products */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Existing Products ({flowers.length})</h3>
            {flowers.map((flower) => (
              <div key={flower.id} className="border rounded-lg p-4 bg-pink-50">
                <div className="flex items-center space-x-4 mb-4">
                  {getFlowerValue(flower, 'imageFileUrl') ? (
                    <img src={getFlowerValue(flower, 'imageFileUrl') as string} alt={flower.customName || flower.nameKey} className="w-12 h-12 rounded object-cover border" />
                  ) : (
                    <span className="text-4xl">{getFlowerValue(flower, 'image')}</span>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{getProductName(flower)}</h3>
                    <p className="text-sm text-gray-600">{String(getFlowerValue(flower, 'category'))}</p>
                    {(getFlowerValue(flower, 'tiedLength') || getFlowerValue(flower, 'ballQuantity')) && (
                      <div className="text-xs text-gray-500 mt-1">
                        {getFlowerValue(flower, 'ballQuantity') && <span>🌸 {String(getFlowerValue(flower, 'ballQuantity'))} ball{(getFlowerValue(flower, 'ballQuantity') as number) > 1 ? 's' : ''} </span>}
                        {getFlowerValue(flower, 'tiedLength') && <span>📏 {String(getFlowerValue(flower, 'tiedLength'))}ft</span>}
                      </div>
                    )}
                    {flower.isCustom && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Custom Product
                      </span>
                    )}
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFlowerImageChange(flower, e)}
                      className="p-1 text-xs"
                    />
                    <span className="block text-xs text-gray-400">Change image</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`available-${flower.id}`}>Available</Label>
                    <Switch
                      id={`available-${flower.id}`}
                      checked={getFlowerValue(flower, 'available') !== false}
                      onCheckedChange={(checked) => 
                        handleUpdateFlower(flower.id, 'available', checked)
                      }
                    />
                  </div>
                  <div className="flex space-x-2">
                    {editingFlowers[flower.id] && (
                      <Button
                        onClick={() => handleSaveChanges(flower.id)}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                    )}
                    {flower.isCustom && (
                      <Button
                        onClick={() => handleDeleteProduct(flower.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor={`price-${flower.id}`}>Price (₹)</Label>
                    <Input
                      id={`price-${flower.id}`}
                      type="number"
                      value={getFlowerValue(flower, 'price') as number}
                      onChange={(e) => 
                        handleUpdateFlower(flower.id, 'price', parseInt(e.target.value) || 0)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`category-${flower.id}`}>Category</Label>
                    <Select
                      value={getFlowerValue(flower, 'category') as string}
                      onValueChange={(value) => handleUpdateFlower(flower.id, 'category', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`tied-length-${flower.id}`}>Tied Length (ft)</Label>
                    <Input
                      id={`tied-length-${flower.id}`}
                      type="number"
                      step="0.5"
                      value={String(getFlowerValue(flower, 'tiedLength') || '')}
                      onChange={(e) => 
                        handleUpdateFlower(flower.id, 'tiedLength', parseFloat(e.target.value) || undefined)
                      }
                      className="mt-1"
                      placeholder="e.g., 4"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`ball-quantity-${flower.id}`}>Flower Balls</Label>
                    <Input
                      id={`ball-quantity-${flower.id}`}
                      type="number"
                      value={String(getFlowerValue(flower, 'ballQuantity') || '')}
                      onChange={(e) => 
                        handleUpdateFlower(flower.id, 'ballQuantity', parseInt(e.target.value) || undefined)
                      }
                      className="mt-1"
                      placeholder="e.g., 1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {flower.isCustom && (
                    <div>
                      <Label htmlFor={`name-${flower.id}`}>Product Name</Label>
                      <Input
                        id={`name-${flower.id}`}
                        value={String(getFlowerValue(flower, 'customName') || '')}
                        onChange={(e) => 
                          handleUpdateFlower(flower.id, 'customName', e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                  )}
                  
                  {flower.isCustom && (
                    <div className={flower.isCustom ? "md:col-span-1" : "md:col-span-2"}>
                      <Label htmlFor={`desc-${flower.id}`}>Description</Label>
                      <Textarea
                        id={`desc-${flower.id}`}
                        value={String(getFlowerValue(flower, 'customDesc') || '')}
                        onChange={(e) => 
                          handleUpdateFlower(flower.id, 'customDesc', e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
