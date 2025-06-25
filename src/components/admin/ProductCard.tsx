
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { Save, Trash2 } from "lucide-react";
import { Flower, categories } from "./types";
import { getSafeDisplayValue, getNumericValue, getStringValue } from "./utils";

interface ProductCardProps {
  flower: Flower;
  editingFlowers: {[key: string]: Flower};
  onUpdateFlower: (flowerId: string, field: keyof Flower, value: any) => void;
  onSaveChanges: (flowerId: string) => void;
  onDeleteFlower: (id: string) => void;
}

const ProductCard = ({ 
  flower, 
  editingFlowers, 
  onUpdateFlower, 
  onSaveChanges, 
  onDeleteFlower 
}: ProductCardProps) => {
  const { t } = useLanguage();

  const getFlowerValue = (flower: Flower, field: keyof Flower) => {
    return editingFlowers[flower.id]?.[field] ?? flower[field];
  };

  const getProductName = (flower: Flower) => {
    const nameValue = getFlowerValue(flower, 'customName');
    if (flower.isCustom && typeof nameValue === 'string') {
      return nameValue;
    }
    return t(flower.nameKey);
  };

  const handleFlowerImageChange = (flower: Flower, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onUpdateFlower(flower.id, 'imageFile', file);
      onUpdateFlower(flower.id, 'imageFileUrl', imageUrl);
      
      // Auto-save the changes immediately when image is uploaded
      setTimeout(() => {
        onSaveChanges(flower.id);
      }, 100);
    }
  };

  const handleDeleteProduct = (flowerId: string) => {
    // Clean up image URL if it exists
    const imageUrl = getStringValue(getFlowerValue(flower, 'imageFileUrl'));
    if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
    
    onDeleteFlower(flowerId);
    toast({
      title: "Product Deleted",
      description: "Product has been removed successfully",
    });
  };

  return (
    <div className="border rounded-lg p-4 bg-pink-50">
      <div className="flex items-center space-x-4 mb-4">
        {getStringValue(getFlowerValue(flower, 'imageFileUrl')) ? (
          <img 
            src={getStringValue(getFlowerValue(flower, 'imageFileUrl'))} 
            alt={flower.customName || flower.nameKey} 
            className="w-16 h-16 rounded object-cover border-2 border-pink-200" 
          />
        ) : (
          <div className="w-16 h-16 bg-pink-100 rounded border-2 border-pink-200 flex items-center justify-center">
            <span className="text-3xl">{getStringValue(getFlowerValue(flower, 'image'))}</span>
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{getProductName(flower)}</h3>
          <p className="text-sm text-gray-600">{getStringValue(getFlowerValue(flower, 'category'))}</p>
          {(getNumericValue(getFlowerValue(flower, 'tiedLength')) > 0 || getNumericValue(getFlowerValue(flower, 'ballQuantity')) > 0) && (
            <div className="text-xs text-gray-500 mt-1">
              {getNumericValue(getFlowerValue(flower, 'ballQuantity')) > 0 && <span>🌸 {getNumericValue(getFlowerValue(flower, 'ballQuantity'))} ball{getNumericValue(getFlowerValue(flower, 'ballQuantity')) > 1 ? 's' : ''} </span>}
              {getNumericValue(getFlowerValue(flower, 'tiedLength')) > 0 && <span>📏 {getNumericValue(getFlowerValue(flower, 'tiedLength'))}ft</span>}
            </div>
          )}
          {flower.isCustom && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
              Custom Product
            </span>
          )}
        </div>
        <div>
          <Label htmlFor={`image-${flower.id}`} className="text-xs">Upload Fresh Image</Label>
          <Input
            id={`image-${flower.id}`}
            type="file"
            accept="image/*"
            onChange={(e) => handleFlowerImageChange(flower, e)}
            className="p-1 text-xs w-32"
          />
          <span className="block text-xs text-green-600 mt-1">📸 Daily Fresh Photos</span>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor={`available-${flower.id}`}>Available</Label>
          <Switch
            id={`available-${flower.id}`}
            checked={getFlowerValue(flower, 'available') !== false}
            onCheckedChange={(checked) => {
              onUpdateFlower(flower.id, 'available', checked);
              // Auto-save availability changes
              setTimeout(() => {
                onSaveChanges(flower.id);
              }, 100);
            }}
          />
        </div>
        <div className="flex space-x-2">
          {editingFlowers[flower.id] && (
            <Button
              onClick={() => onSaveChanges(flower.id)}
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white"
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
            value={getNumericValue(getFlowerValue(flower, 'price'))}
            onChange={(e) => 
              onUpdateFlower(flower.id, 'price', parseInt(e.target.value) || 0)
            }
            onBlur={() => {
              // Auto-save price changes when user finishes editing
              if (editingFlowers[flower.id]) {
                setTimeout(() => {
                  onSaveChanges(flower.id);
                }, 500);
              }
            }}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`category-${flower.id}`}>Category</Label>
          <Select
            value={getStringValue(getFlowerValue(flower, 'category'))}
            onValueChange={(value) => {
              onUpdateFlower(flower.id, 'category', value);
              // Auto-save category changes
              setTimeout(() => {
                onSaveChanges(flower.id);
              }, 100);
            }}
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
            value={getStringValue(getFlowerValue(flower, 'tiedLength'))}
            onChange={(e) => 
              onUpdateFlower(flower.id, 'tiedLength', parseFloat(e.target.value) || undefined)
            }
            onBlur={() => {
              // Auto-save when user finishes editing
              if (editingFlowers[flower.id]) {
                setTimeout(() => {
                  onSaveChanges(flower.id);
                }, 500);
              }
            }}
            className="mt-1"
            placeholder="e.g., 4"
          />
        </div>
        <div>
          <Label htmlFor={`ball-quantity-${flower.id}`}>Flower Balls</Label>
          <Input
            id={`ball-quantity-${flower.id}`}
            type="number"
            value={getStringValue(getFlowerValue(flower, 'ballQuantity'))}
            onChange={(e) => 
              onUpdateFlower(flower.id, 'ballQuantity', parseInt(e.target.value) || undefined)
            }
            onBlur={() => {
              // Auto-save when user finishes editing
              if (editingFlowers[flower.id]) {
                setTimeout(() => {
                  onSaveChanges(flower.id);
                }, 500);
              }
            }}
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
              value={getStringValue(getFlowerValue(flower, 'customName'))}
              onChange={(e) => 
                onUpdateFlower(flower.id, 'customName', e.target.value)
              }
              onBlur={() => {
                // Auto-save when user finishes editing
                if (editingFlowers[flower.id]) {
                  setTimeout(() => {
                    onSaveChanges(flower.id);
                  }, 500);
                }
              }}
              className="mt-1"
            />
          </div>
        )}
        
        {flower.isCustom && (
          <div className={flower.isCustom ? "md:col-span-1" : "md:col-span-2"}>
            <Label htmlFor={`desc-${flower.id}`}>Description</Label>
            <Textarea
              id={`desc-${flower.id}`}
              value={getStringValue(getFlowerValue(flower, 'customDesc'))}
              onChange={(e) => 
                onUpdateFlower(flower.id, 'customDesc', e.target.value)
              }
              onBlur={() => {
                // Auto-save when user finishes editing
                if (editingFlowers[flower.id]) {
                  setTimeout(() => {
                    onSaveChanges(flower.id);
                  }, 1000);
                }
              }}
              className="mt-1"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
