import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2, Edit, Save, X, Shield, Phone } from 'lucide-react';
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
        .single();

      if (error) throw error;

      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        address: data.address || '',
        city: data.city || '',
        phone: data.phone || ''
      });
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
      // Simulate OTP sending (in production, this would call an edge function)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in database for verification
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

      // Mark phone as verified
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <Header cartCount={0} onCartClick={() => {}} onAdminPanelClick={() => {}} onOrderManagementClick={() => {}} onOwnerLoginClick={() => {}} onSignOut={() => {}} />
        <div className="flex items-center justify-center pt-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      <Header cartCount={0} onCartClick={() => {}} onAdminPanelClick={() => {}} onOrderManagementClick={() => {}} onOwnerLoginClick={() => {}} onSignOut={() => {}} />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                My Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    disabled={!editing}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!editing}
                      placeholder="+1234567890"
                    />
                    {profile?.phone_verified ? (
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <Phone className="h-4 w-4" />
                        Verified
                      </div>
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

                {showOtpInput && (
                  <div>
                    <Label htmlFor="otp">Enter OTP</Label>
                    <div className="flex gap-2">
                      <Input
                        id="otp"
                        value={phoneOtp}
                        onChange={(e) => setPhoneOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                      />
                      <Button onClick={handleVerifyOtp}>Verify</Button>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!editing}
                    placeholder="Enter your address"
                  />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    disabled={!editing}
                    placeholder="Enter your city"
                  />
                </div>
              </div>

              <div className="flex gap-2">
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
      </div>
    </div>
  );
};

export default Profile;