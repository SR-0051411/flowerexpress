
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Shield, Lock } from "lucide-react";

interface PaymentGatewayProps {
  amount: number;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
}

const PaymentGateway = ({ amount, onPaymentSuccess, onPaymentError }: PaymentGatewayProps) => {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // This is where you'll integrate with your bank's payment gateway
      // For now, we'll simulate the payment process
      
      // Validate card details
      if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
        throw new Error("Please fill in all payment details");
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate a mock payment ID
      const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      toast({
        title: "Payment Successful! 🎉",
        description: `Payment of $${amount.toFixed(2)} processed successfully.`,
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
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl">Secure Payment</CardTitle>
        <CardDescription>
          Complete your order for ${amount.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePayment} className="space-y-4">
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

          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Your payment is secured with bank-grade encryption</span>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500"
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
                Pay ${amount.toFixed(2)} Securely
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentGateway;
