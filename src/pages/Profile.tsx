import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePayment } from '@/contexts/PaymentContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { User, Mail, Phone, MapPin, Edit, Save, X, Package, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';

console.log('Profile component loaded');

const Profile = () => {
  const { user } = useAuth();
  const { orders } = usePayment();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: ''
  });

  useEffect(() => {
    if (user) {
      // Set default values
      setProfile({
        full_name: user.email?.split('@')[0] || 'User',
        phone: '',
        address: '',
        city: ''
      });
      
      // Try to load from database
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      if (!user?.id) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        setProfile({
          full_name: data.full_name || user.email?.split('@')[0] || 'User',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      // Try to update first
      const { error: updateError } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);

      if (updateError) {
        // If update fails, try to insert
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, ...profile }]);

        if (insertError) throw insertError;
      }

      setEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <Header cartCount={0} onCartClick={() => {}} onAdminPanelClick={() => {}} onOrderManagementClick={() => {}} onOwnerLoginClick={() => {}} onSignOut={() => {}} />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Please sign in to view your profile</h2>
            <Button onClick={() => window.location.href = '/auth'}>
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
          
          {/* Profile Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input value={user.email || ''} disabled className="bg-muted" />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    value={profile.full_name}
                    onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                    disabled={!editing}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!editing}
                    placeholder="+91 12345 67890"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    City
                  </Label>
                  <Input
                    value={profile.city}
                    onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
                    disabled={!editing}
                    placeholder="Enter your city"
                  />
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Complete Address
                </Label>
                <Input
                  value={profile.address}
                  onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                  disabled={!editing}
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
                    <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={() => setEditing(false)}>
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order History ({orders.length} orders)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                  <p className="text-muted-foreground mb-4">Start exploring our beautiful flower collection!</p>
                  <Button onClick={() => window.location.href = '/all-flowers'}>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Shop Now
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">Order #{order.id.slice(-8)}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm">
                            {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
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
                    </div>
                  ))}
                  {orders.length > 5 && (
                    <p className="text-center text-muted-foreground">
                      Showing 5 of {orders.length} orders
                    </p>
                  )}
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