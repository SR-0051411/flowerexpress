import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MapPin, Package, Save } from 'lucide-react';
import Header from '@/components/Header';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const [customerInfo, setCustomerInfo] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+91 98765 43210',
    address: '123 Main Street, Flower District, Mumbai, Maharashtra 400001'
  });

  // Sample order data
  const orders = [
    {
      id: 'ORD001',
      date: '2025-01-20',
      status: 'Delivered',
      total: 750,
      items: [
        { name: 'Rose Bouquet', quantity: 2 },
        { name: 'Jasmine Garland', quantity: 1 }
      ]
    },
    {
      id: 'ORD002',
      date: '2025-01-15',
      status: 'Processing',
      total: 1250,
      items: [
        { name: 'Wedding Decoration', quantity: 1 },
        { name: 'Marigold Garland', quantity: 3 }
      ]
    }
  ];

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <Header cartCount={0} onCartClick={() => {}} onAdminPanelClick={() => {}} onOrderManagementClick={() => {}} onOwnerLoginClick={() => {}} onSignOut={() => {}} />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>
          
          {/* Customer Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email address"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4" />
                  Name
                </Label>
                <Input
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 12345 67890"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Input
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your complete address"
                  className="mt-1"
                />
              </div>

              <Button 
                onClick={handleSaveProfile}
                className="w-full mt-4 bg-pink-500 hover:bg-pink-600 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">Order #{order.id.slice(-8)}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {order.status}
                          </span>
                          <p className="font-semibold mt-1">₹{order.total}</p>
                        </div>
                      </div>
                      <div className="text-sm">
                        {order.items.map((item, index) => (
                          <div key={index}>
                            {item.name} - Qty: {item.quantity}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;