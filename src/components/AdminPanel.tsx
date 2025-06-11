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
import { Plus, Trash2 } from "lucide-react";

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
  const [newProduct, setNewProduct] = useState({
    nameKey: '',
    customName: '',
    price: 0,
    image: '',
    descKey: '',
    customDesc: '',
    category: 'flowers',
    available: true,
    isCustom: true
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
    onUpdateFlower(flowerId, { [field]: value });
    toast({
      title: "Product Updated",
      description: `${field} has been updated successfully`,
    });
  };

  const handleAddProduct = () => {
    if (!newProduct.customName || !newProduct.image || newProduct.price <= 0) {
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
      descKey: newProduct.descKey,
      customDesc: newProduct.customDesc,
      category: newProduct.category,
      available: newProduct.available,
      isCustom: true
    });

    setNewProduct({
      nameKey: '',
      customName: '',
      price: 0,
      image: '',
      descKey: '',
      customDesc: '',
      category: 'flowers',
      available: true,
      isCustom: true
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
    return flower.isCustom ? flower.customName : t(flower.nameKey);
  };

  const getProductDesc = (flower: Flower) => {
    return flower.isCustom ? flower.customDesc : t(flower.descKey);
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
                  <Label htmlFor="new-image">Emoji/Icon *</Label>
                  <Input
                    id="new-image"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct(prev => ({...prev, image: e.target.value}))}
                    placeholder="🥥 (Enter emoji or icon)"
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
                  <span className="text-4xl">{flower.image}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{getProductName(flower)}</h3>
                    <p className="text-sm text-gray-600">{flower.category}</p>
                    {flower.isCustom && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Custom Product
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`available-${flower.id}`}>Available</Label>
                    <Switch
                      id={`available-${flower.id}`}
                      checked={flower.available !== false}
                      onCheckedChange={(checked) => 
                        handleUpdateFlower(flower.id, 'available', checked)
                      }
                    />
                  </div>
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`price-${flower.id}`}>Price (₹)</Label>
                    <Input
                      id={`price-${flower.id}`}
                      type="number"
                      value={flower.price}
                      onChange={(e) => 
                        handleUpdateFlower(flower.id, 'price', parseInt(e.target.value) || 0)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`category-${flower.id}`}>Category</Label>
                    <Select
                      value={flower.category}
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
                  {flower.isCustom && (
                    <div>
                      <Label htmlFor={`name-${flower.id}`}>Product Name</Label>
                      <Input
                        id={`name-${flower.id}`}
                        value={flower.customName || ''}
                        onChange={(e) => 
                          handleUpdateFlower(flower.id, 'customName', e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
                
                {flower.isCustom && (
                  <div className="mt-4">
                    <Label htmlFor={`desc-${flower.id}`}>Description</Label>
                    <Textarea
                      id={`desc-${flower.id}`}
                      value={flower.customDesc || ''}
                      onChange={(e) => 
                        handleUpdateFlower(flower.id, 'customDesc', e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
