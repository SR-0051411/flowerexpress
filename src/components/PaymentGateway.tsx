
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Shield, Lock, Banknote, Smartphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PaymentGatewayProps {
  amount: number;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
}

const PaymentGateway = ({ amount, onPaymentSuccess, onPaymentError }: PaymentGatewayProps) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  
  // Card payment states
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  
  // UPI payment states
  const [upiId, setUpiId] = useState("");
  
  // Net Banking states
  const [bankCode, setBankCode] = useState("");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate based on payment method
      if (paymentMethod === "card") {
        if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
          throw new Error("Please fill in all card details");
        }
      } else if (paymentMethod === "upi") {
        if (!upiId) {
          throw new Error("Please enter your UPI ID");
        }
      } else if (paymentMethod === "netbanking") {
        if (!bankCode) {
          throw new Error("Please select your bank");
        }
      }

      // Simulate payment processing with bank integration
      console.log("Processing payment with method:", paymentMethod);
      console.log("Amount:", amount);
      console.log("Payment details:", { cardNumber: cardNumber.slice(-4), upiId, bankCode });
      
      // Simulate API call to bank's payment gateway
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate successful payment (90% success rate)
      const isSuccess = Math.random() > 0.1;
      
      if (!isSuccess) {
        throw new Error("Payment failed. Please try again or use a different payment method.");
      }

      // Generate a secure payment ID
      const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      toast({
        title: "Payment Successful! 🎉",
        description: `Payment of ₹${amount.toFixed(2)} processed successfully via ${paymentMethod.toUpperCase()}.`,
      });

      onPaymentSuccess(paymentId);
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      onPaymentError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-numeric characters
    const v = value.replace(/[^0-9]/g, '');
    // Limit to 16 digits
    const limited = v.substring(0, 16);
    // Add spaces every 4 digits
    const formatted = limited.replace(/(.{4})/g, '$1 ').trim();
    return formatted;
  };

  const formatExpiryDate = (value: string) => {
    // Remove all non-numeric characters
    const v = value.replace(/[^0-9]/g, '');
    // Format as MM/YY
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const banks = [
    { code: "SBI", name: "State Bank of India" },
    { code: "HDFC", name: "HDFC Bank" },
    { code: "ICICI", name: "ICICI Bank" },
    { code: "AXIS", name: "Axis Bank" },
    { code: "KOTAK", name: "Kotak Mahindra Bank" },
    { code: "PNB", name: "Punjab National Bank" },
  ];

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
      <CardHeader className="text-center bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-t-lg">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl">Secure Payment</CardTitle>
        <CardDescription className="text-white/90">
          Complete your order for ₹{amount.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="card" className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Card</span>
            </TabsTrigger>
            <TabsTrigger value="upi" className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4" />
              <span>UPI</span>
            </TabsTrigger>
            <TabsTrigger value="netbanking" className="flex items-center space-x-2">
              <Banknote className="w-4 h-4" />
              <span>Net Banking</span>
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handlePayment} className="space-y-6">
            <TabsContent value="card" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardHolder">Cardholder Name</Label>
                <Input
                  id="cardHolder"
                  type="text"
                  placeholder="John Doe"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="upi" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                />
              </div>
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <p>Popular UPI Apps: PhonePe, Google Pay, Paytm, BHIM</p>
              </div>
            </TabsContent>

            <TabsContent value="netbanking" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankCode">Select Your Bank</Label>
                <select
                  id="bankCode"
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                >
                  <option value="">Choose your bank</option>
                  {banks.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>
            </TabsContent>

            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-green-50 p-4 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-800">Bank-Grade Security</p>
                <p className="text-green-700">Your payment is protected with 256-bit SSL encryption</p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Lock className="w-4 h-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Pay ₹{amount.toFixed(2)} Securely
                </>
              )}
            </Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentGateway;
