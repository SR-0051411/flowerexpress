
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone, Building } from "lucide-react";
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
    city: '',
    pincode: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [step, setStep] = useState<'details' | 'payment'>('details');

  const validateCustomerInfo = () => {
    return customerInfo.name && customerInfo.phone && customerInfo.address && 
           customerInfo.city && customerInfo.pincode;
  };

  const handleContinueToPayment = () => {
    if (!validateCustomerInfo()) {
      toast({
        title: "Missing Information",
        description: "Please fill all customer details",
        variant: "destructive",
      });
      return;
    }
    setStep('payment');
  };

  const handlePayment = async () => {
    try {
      const orderId = await createOrder(items, customerInfo, total);
      
      const paymentSuccess = await processPayment(orderId, paymentMethod);
      
      if (paymentSuccess) {
        toast({
          title: "Payment Successful!",
          description: `Order ${orderId} has been placed successfully.`,
        });
        onOrderSuccess();
        onClose();
        setStep('details');
        setCustomerInfo({
          name: '',
          phone: '',
          address: '',
          city: '',
          pincode: ''
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
            {step === 'details' ? 'Customer Details' : 'Payment Method'}
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
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter your full address"
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
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-pink-600">₹{total}</span>
              </div>
              
              <Button 
                onClick={handleContinueToPayment}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white text-lg py-3"
                disabled={!validateCustomerInfo()}
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
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
              <h4 className="font-semibold mb-2">Order Summary</h4>
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
