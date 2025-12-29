import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Bell, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Footer from "@/components/Footer";

interface ProfileData {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  order_notifications: boolean;
}

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    order_notifications: true,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone, address, city, order_notifications")
        .eq("id", user?.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
        return;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          order_notifications: data.order_notifications ?? true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: profile.full_name.trim(),
          phone: profile.phone.trim(),
          address: profile.address.trim(),
          city: profile.city.trim(),
          order_notifications: profile.order_notifications,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error("Error saving profile:", error);
        toast.error("Failed to save profile");
        return;
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string | boolean) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-500">Manage your account information</p>
          </div>
        </div>

        {/* Profile Information Card */}
        <Card className="mb-6 shadow-lg border-pink-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-pink-500" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details for order deliveries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                placeholder="Enter your full name"
                value={profile.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                className="border-pink-200 focus:border-pink-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={profile.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="border-pink-200 focus:border-pink-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Delivery Address</Label>
              <Input
                id="address"
                placeholder="Enter your delivery address"
                value={profile.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="border-pink-200 focus:border-pink-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Enter your city"
                value={profile.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="border-pink-200 focus:border-pink-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card className="mb-6 shadow-lg border-pink-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-pink-500" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage how you receive order updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Order Notifications</p>
                <p className="text-sm text-gray-500">
                  Receive updates about your order status via SMS/Email
                </p>
              </div>
              <Switch
                checked={profile.order_notifications}
                onCheckedChange={(checked) =>
                  handleInputChange("order_notifications", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Display */}
        <Card className="mb-6 shadow-lg border-pink-100">
          <CardHeader>
            <CardTitle>Account Email</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-400 mt-1">
              Email cannot be changed from here
            </p>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-6 text-lg"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default ProfileSettings;
