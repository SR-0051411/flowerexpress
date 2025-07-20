import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePayment } from '@/contexts/PaymentContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Loader2, 
  Edit, 
  Save, 
  X, 
  Shield, 
  Phone, 
  MapPin, 
  Mail, 
  User, 
  Package, 
  Calendar,
  IndianRupee,
  ShoppingBag,
  Clock
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
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    address: '',
    city: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
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
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ id: user?.id, full_name: user?.email?.split('@')[0] || '' }])
          .select()
          .single();

        if (createError) throw createError;
        setProfile(newProfile);
        setFormData({
          full_name: newProfile.full_name || '',
          address: newProfile.address || '',
          city: newProfile.city || '',
          phone: newProfile.phone || ''
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
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

  const handleVerifyPhone = async () => {
    setVerifyingPhone(true);
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      const { error } = await supabase
        .from('profiles')
        .update({
          phone_otp: otp,
          otp_expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;

      setShowOtpInput(true);
      toast({
        title: "OTP Sent",
        description: `Demo OTP: ${otp} (In production, this would be sent via SMS)`,
        duration: 10000
      });
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Error",
        description: "Failed to send OTP",
        variant: "destructive"
      });
    } finally {
      setVerifyingPhone(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('phone_otp, otp_expires_at')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (!data.phone_otp || new Date() > new Date(data.otp_expires_at)) {
        throw new Error('OTP expired');
      }

      if (data.phone_otp !== phoneOtp) {
        throw new Error('Invalid OTP');
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          phone_verified: true,
          phone_otp: null,
          otp_expires_at: null
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, phone_verified: true } : null);
      setShowOtpInput(false);
      setPhoneOtp('');
      toast({
        title: "Success",
        description: "Phone number verified successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'paid': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'processing': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'delivered').length;
  const totalSpent = orders.filter(order => order.status === 'delivered').reduce((sum, order) => sum + order.total, 0);

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
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Profile Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Personal Information */}
            <div className="md:col-span-2">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
                        className="bg-muted mt-2"
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
                        className="mt-2"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <div className="flex gap-2 items-center mt-2">
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!editing}
                          placeholder="+91 12345 67890"
                          className="flex-1"
                        />
                        {profile?.phone_verified ? (
                          <Badge variant="secondary" className="text-green-600">
                            <Phone className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : profile?.phone && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleVerifyPhone}
                            disabled={verifyingPhone}
                          >
                            {verifyingPhone ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
                          </Button>
                        )}
                      </div>
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
                        className="mt-2"
                        placeholder="Enter your city"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!editing}
                      className="mt-2"
                      placeholder="Enter your complete address"
                    />
                  </div>

                  {showOtpInput && (
                    <div>
                      <Label htmlFor="otp">Enter OTP</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="otp"
                          value={phoneOtp}
                          onChange={(e) => setPhoneOtp(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          className="flex-1"
                        />
                        <Button onClick={handleVerifyOtp}>Verify</Button>
                      </div>
                    </div>
                  )}

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

            {/* Account Overview */}
            <div className="space-y-6">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Shield className="h-5 w-5" />
                    Account Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Orders</span>
                    <span className="font-semibold">{totalOrders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completed</span>
                    <span className="font-semibold text-green-600">{completedOrders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Spent</span>
                    <span className="font-semibold flex items-center">
                      <IndianRupee className="h-4 w-4" />
                      {totalSpent.toLocaleString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-2">
                    {profile?.phone_verified ? (
                      <Badge variant="secondary" className="text-green-600">
                        <Phone className="h-3 w-3 mr-1" />
                        Phone Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-yellow-600">
                        <Clock className="h-3 w-3 mr-1" />
                        Phone Pending
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-primary">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/all-flowers'}>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Browse Flowers
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Order History */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Package className="h-5 w-5" />
                Order History
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
                <div className="space-y-4">
                  {orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order) => (
                    <Card key={order.id} className="border-l-4 border-l-primary">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold">Order #{order.id.slice(-8)}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <p className="text-lg font-semibold mt-1 flex items-center">
                              <IndianRupee className="h-4 w-4" />
                              {order.total.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h5 className="font-medium">Items:</h5>
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded">
                              <span>{item.name} x {item.quantity}</span>
                              <span className="flex items-center">
                                <IndianRupee className="h-3 w-3" />
                                {(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 p-3 bg-muted/30 rounded text-sm">
                          <p><strong>Delivery Address:</strong></p>
                          <p>{order.customerInfo.name}</p>
                          <p>{order.customerInfo.address}, {order.customerInfo.city} - {order.customerInfo.pincode}</p>
                          <p>Phone: {order.customerInfo.phone}</p>
                        </div>
                      </CardContent>
                    </Card>
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