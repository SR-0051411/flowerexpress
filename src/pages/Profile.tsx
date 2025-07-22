import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePayment } from '@/contexts/PaymentContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { 
  Loader2, 
  Edit, 
  Save, 
  X, 
  Phone, 
  MapPin, 
  Mail, 
  User, 
  Package,
  ShoppingBag
} from 'lucide-react';
import Header from '@/components/Header';

interface Profile {
  id: string;
  full_name: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  phone_verified: boolean;
}

const Profile = () => {
  const { user } = useAuth();
  const { orders } = usePayment();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    address: '',
    city: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          address: data.address || '',
          city: data.city || '',
          phone: data.phone || ''
        });
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          id: user.id,
          full_name: user.email?.split('@')[0] || 'User',
          address: null,
          city: null,
          phone: null,
          phone_verified: false
        };
        
        const { error: createError } = await supabase
          .from('profiles')
          .insert([newProfile]);

        if (createError) throw createError;
        
        setProfile(newProfile);
        setFormData({
          full_name: newProfile.full_name || '',
          address: '',
          city: '',
          phone: ''
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
      // Set default profile to show the page
      setProfile({
        id: user?.id || '',
        full_name: user?.email?.split('@')[0] || 'User',
        address: null,
        city: null,
        phone: null,
        phone_verified: false
      });
      setFormData({
        full_name: user?.email?.split('@')[0] || 'User',
        address: '',
        city: '',
        phone: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user?.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...formData } : null);
      setEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <Header cartCount={0} onCartClick={() => {}} onAdminPanelClick={() => {}} onOrderManagementClick={() => {}} onOwnerLoginClick={() => {}} onSignOut={() => {}} />
        <div className="flex items-center justify-center pt-32">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <Header cartCount={0} onCartClick={() => {}} onAdminPanelClick={() => {}} onOrderManagementClick={() => {}} onOwnerLoginClick={() => {}} onSignOut={() => {}} />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Please sign in to view your profile</h2>
            <Button onClick={() => window.location.href = '/auth'} className="bg-white text-primary hover:bg-gray-100">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      <Header cartCount={0} onCartClick={() => {}} onAdminPanelClick={() => {}} onOrderManagementClick={() => {}} onOwnerLoginClick={() => {}} onSignOut={() => {}} />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="lg:col-span-2">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-muted mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="full_name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        disabled={!editing}
                        className="mt-1"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!editing}
                        placeholder="+91 12345 67890"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="city" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        City
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        disabled={!editing}
                        className="mt-1"
                        placeholder="Enter your city"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Complete Address
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!editing}
                      className="mt-1"
                      placeholder="Enter your complete address"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    {!editing ? (
                      <Button onClick={() => setEditing(true)} className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex items-center gap-2"
                        >
                          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditing(false);
                            setFormData({
                              full_name: profile?.full_name || '',
                              address: profile?.address || '',
                              city: profile?.city || '',
                              phone: profile?.phone || ''
                            });
                          }}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div>
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-primary">Account Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{orders.length}</div>
                    <div className="text-sm text-muted-foreground">Total Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {orders.filter(order => order.status === 'delivered').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Delivered</div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => window.location.href = '/all-flowers'}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Shop Flowers
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Order History */}
          <Card className="shadow-elegant mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Package className="h-5 w-5" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                  <p className="text-muted-foreground mb-6">Start exploring our beautiful flower collection!</p>
                  <Button onClick={() => window.location.href = '/all-flowers'}>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Shop Now
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 bg-muted/30">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">Order #{order.id.slice(-8)}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                          <p className="font-semibold mt-1">₹{order.total}</p>
                        </div>
                      </div>
                      <div className="text-sm">
                        <p><strong>Items:</strong> {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}</p>
                        <p><strong>Delivery:</strong> {order.customerInfo.address}, {order.customerInfo.city}</p>
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