import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Smartphone, Building, MapPin, Navigation } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePayment } from "@/contexts/PaymentContext";
import { toast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onOrderSuccess: () => void;
}

const CheckoutForm = ({ isOpen, onClose, items, total, onOrderSuccess }: CheckoutFormProps) => {
  const { t } = useLanguage();
  const { createOrder, processPayment, isProcessingPayment } = usePayment();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    pincode: '',
    latitude: '',
    longitude: '',
    deliveryNotes: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location services",
        variant: "destructive",
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCustomerInfo(prev => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString()
        }));
        toast({
          title: "Location Captured",
          description: "Your precise location has been saved for delivery",
        });
        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = "Unable to get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permission.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive",
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const validateCustomerInfo = () => {
    return customerInfo.name && customerInfo.phone && customerInfo.address && 
           customerInfo.city && customerInfo.pincode;
  };

  const handleContinueToPayment = () => {
    if (!validateCustomerInfo()) {
      toast({
        title: "Missing Information",
        description: "Please fill all required customer details",
        variant: "destructive",
      });
      return;
    }
    
    if (!customerInfo.latitude || !customerInfo.longitude) {
      toast({
        title: "Location Required",
        description: "Please capture your location for precise delivery",
        variant: "destructive",
      });
      return;
    }
    
    setStep('payment');
  };

  const handlePayment = async () => {
    try {
      const orderData = {
        ...customerInfo,
        location: {
          latitude: customerInfo.latitude,
          longitude: customerInfo.longitude,
          address: customerInfo.address,
          landmark: customerInfo.landmark,
          city: customerInfo.city,
          pincode: customerInfo.pincode
        }
      };
      
      const orderId = await createOrder(items, orderData, total);
      
      const paymentSuccess = await processPayment(orderId, paymentMethod);
      
      if (paymentSuccess) {
        toast({
          title: "Order Placed Successfully!",
          description: `Order ${orderId} will be delivered to your precise location.`,
        });
        onOrderSuccess();
        onClose();
        setStep('details');
        setCustomerInfo({
          name: '',
          phone: '',
          address: '',
          landmark: '',
          city: '',
          pincode: '',
          latitude: '',
          longitude: '',
          deliveryNotes: ''
        });
      } else {
        toast({
          title: "Payment Failed",
          description: "There was an issue processing your payment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {step === 'details' ? 'Delivery Details' : 'Payment Method'}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'details' ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Full Address *</Label>
              <Textarea
                id="address"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter your complete address"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="landmark">Nearby Landmark</Label>
              <Input
                id="landmark"
                value={customerInfo.landmark}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, landmark: e.target.value }))}
                placeholder="e.g., Near City Mall, Opposite School"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={customerInfo.city}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={customerInfo.pincode}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, pincode: e.target.value }))}
                  placeholder="Pincode"
                />
              </div>
            </div>

            {/* Location Capture Section */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <Label className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Precise Location for Delivery
              </Label>
              <p className="text-xs text-blue-600">
                This helps our delivery partner find you easily and deliver fresh flowers quickly.
              </p>
              
              {customerInfo.latitude && customerInfo.longitude ? (
                <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                  <span className="text-green-700 text-sm">📍 Location captured successfully</span>
                  <Button
                    type="button"
                    onClick={getCurrentLocation}
                    variant="outline"
                    size="sm"
                    disabled={isGettingLocation}
                  >
                    Update Location
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  {isGettingLocation ? 'Getting Location...' : 'Capture Current Location'}
                </Button>
              )}
            </div>

            <div>
              <Label htmlFor="deliveryNotes">Special Delivery Instructions</Label>
              <Textarea
                id="deliveryNotes"
                value={customerInfo.deliveryNotes}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, deliveryNotes: e.target.value }))}
                placeholder="Any specific instructions for delivery (e.g., Ring doorbell, Call on arrival)"
                rows={2}
              />
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-pink-600">₹{total}</span>
              </div>
              
              <Button 
                onClick={handleContinueToPayment}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white text-lg py-3"
                disabled={!validateCustomerInfo() || !customerInfo.latitude || !customerInfo.longitude}
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Payment method selection - keep existing code */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">Select Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={(value: 'card' | 'upi' | 'netbanking') => setPaymentMethod(value)}>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="card" id="card" />
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">
                    Credit/Debit Card
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="upi" id="upi" />
                  <Smartphone className="w-5 h-5 text-green-600" />
                  <Label htmlFor="upi" className="flex-1 cursor-pointer">
                    UPI Payment
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="netbanking" id="netbanking" />
                  <Building className="w-5 h-5 text-purple-600" />
                  <Label htmlFor="netbanking" className="flex-1 cursor-pointer">
                    Net Banking
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="bg-pink-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Order Summary & Delivery Info</h4>
              <div className="space-y-1 text-sm">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t pt-2 font-semibold flex justify-between">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  📍 Delivery to: {customerInfo.city}, {customerInfo.pincode}
                  <br />
                  📞 Contact: {customerInfo.phone}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => setStep('details')}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handlePayment}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? 'Processing...' : `Pay ₹${total}`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutForm;
