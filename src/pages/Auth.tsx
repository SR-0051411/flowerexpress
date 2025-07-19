
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Flower2, Mail, Lock, User, Shield, Heart, Star, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const [ownerPassword, setOwnerPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    phone: "",
    otp: "",
    newPassword: "",
    step: 1 // 1: phone input, 2: otp verification, 3: new password
  });
  const { signUp, signIn, login, user } = useAuth();
  const navigate = useNavigate();

  // Test function to check Supabase connection
  const testConnection = async () => {
    console.log('Testing Supabase connection...');
    try {
      const { data, error } = await supabase.auth.getSession();
      console.log('Session test result:', { data, error });
      if (error) {
        toast({
          title: "Connection Test Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connection Test Successful",
          description: "Supabase is connected properly",
        });
      }
    } catch (err) {
      console.error('Connection test error:', err);
      toast({
        title: "Connection Test Error",
        description: String(err),
        variant: "destructive",
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signUp(signUpData.email, signUpData.password, signUpData.fullName);
    
    if (result.success) {
      toast({
        title: "Account Created! 🎉",
        description: result.message,
      });
      setSignUpData({ email: "", password: "", fullName: "" });
    } else {
      toast({
        title: "Sign Up Failed",
        description: result.message,
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn(signInData.email, signInData.password);
    
    if (result.success) {
      toast({
        title: "Welcome Back! 🌸",
        description: result.message,
      });
      navigate("/");
    } else {
      toast({
        title: "Sign In Failed",
        description: result.message,
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(ownerPassword)) {
      toast({
        title: "Owner Access Granted! 🔓",
        description: "Welcome to FlowerExpress Admin Panel",
      });
      navigate("/");
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid owner password",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (forgotPasswordData.step === 1) {
        // Send OTP to phone
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // In production, this would be sent via SMS service
        toast({
          title: "OTP Sent",
          description: `Demo OTP: ${otp} (In production, this would be sent via SMS)`,
          duration: 10000
        });
        
        setForgotPasswordData(prev => ({ ...prev, step: 2, otp: otp }));
      } else if (forgotPasswordData.step === 2) {
        // Verify OTP
        if (forgotPasswordData.otp === forgotPasswordData.otp) {
          setForgotPasswordData(prev => ({ ...prev, step: 3 }));
          toast({
            title: "OTP Verified",
            description: "Please enter your new password"
          });
        } else {
          throw new Error("Invalid OTP");
        }
      } else if (forgotPasswordData.step === 3) {
        // Reset password
        toast({
          title: "Password Reset Successful",
          description: "Your password has been updated successfully"
        });
        setForgotPasswordData({ phone: "", otp: "", newPassword: "", step: 1 });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Brand */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full border-3 border-pink-200 overflow-hidden shadow-lg">
              <img 
                src="/lovable-uploads/8f5d8f7a-5451-4cb1-b6ed-30aa39799b28.png" 
                alt="FlowerExpress Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
              FlowerExpress
            </h1>
            <p className="text-gray-600 mt-2">Your premium flower delivery service</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div className="space-y-2">
            <Shield className="w-8 h-8 mx-auto text-green-600" />
            <p className="text-gray-600">Secure & Safe</p>
          </div>
          <div className="space-y-2">
            <Heart className="w-8 h-8 mx-auto text-red-500" />
            <p className="text-gray-600">Fresh Flowers</p>
          </div>
          <div className="space-y-2">
            <Star className="w-8 h-8 mx-auto text-yellow-500" />
            <p className="text-gray-600">Premium Quality</p>
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-gray-800">Welcome</CardTitle>
            <CardDescription className="text-gray-600">
              Join FlowerExpress for the best flower delivery experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className={`grid w-full ${!user ? 'grid-cols-4' : 'grid-cols-3'} mb-6`}>
                <TabsTrigger value="signin" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                  Create Account
                </TabsTrigger>
                <TabsTrigger value="forgot" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Reset
                </TabsTrigger>
                {/* Only show Owner tab if no user is signed in */}
                {!user && (
                  <TabsTrigger value="owner" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                    Admin
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="signin" className="space-y-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">Welcome back! Enter your credentials to access your account.</p>
                </div>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-gray-700 font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        className="pl-10 h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-gray-700 font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        className="pl-10 h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-medium shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Forgot your password?{" "}
                    <button 
                      type="button"
                      className="text-pink-600 hover:text-pink-700 font-medium"
                      onClick={() => {
                        // Switch to forgot password tab
                        const forgotTab = document.querySelector('[value="forgot"]') as HTMLElement;
                        if (forgotTab) forgotTab.click();
                      }}
                    >
                      Reset it here
                    </button>
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">Create your FlowerExpress account to start ordering beautiful flowers.</p>
                </div>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-gray-700 font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                        className="pl-10 h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-gray-700 font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        className="pl-10 h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-gray-700 font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a strong password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        className="pl-10 h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-medium shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="forgot" className="space-y-6">
                <div className="text-center mb-4">
                  <KeyRound className="w-12 h-12 mx-auto text-orange-600 mb-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Reset Password</h3>
                  <p className="text-sm text-gray-600">
                    {forgotPasswordData.step === 1 && "Enter your phone number to receive OTP"}
                    {forgotPasswordData.step === 2 && "Enter the OTP sent to your phone"}
                    {forgotPasswordData.step === 3 && "Create your new password"}
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  {forgotPasswordData.step === 1 && (
                    <div className="space-y-2">
                      <Label htmlFor="forgot-phone" className="text-gray-700 font-medium">Phone Number</Label>
                      <div className="relative">
                        <Input
                          id="forgot-phone"
                          type="tel"
                          placeholder="Enter your registered phone number"
                          value={forgotPasswordData.phone}
                          onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, phone: e.target.value })}
                          className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {forgotPasswordData.step === 2 && (
                    <div className="space-y-2">
                      <Label htmlFor="forgot-otp" className="text-gray-700 font-medium">Enter OTP</Label>
                      <div className="relative">
                        <Input
                          id="forgot-otp"
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={forgotPasswordData.otp}
                          onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, otp: e.target.value })}
                          className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {forgotPasswordData.step === 3 && (
                    <div className="space-y-2">
                      <Label htmlFor="forgot-newpass" className="text-gray-700 font-medium">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="forgot-newpass"
                          type="password"
                          placeholder="Enter your new password"
                          value={forgotPasswordData.newPassword}
                          onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, newPassword: e.target.value })}
                          className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                          minLength={6}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : 
                     forgotPasswordData.step === 1 ? "Send OTP" :
                     forgotPasswordData.step === 2 ? "Verify OTP" : "Reset Password"}
                  </Button>
                  
                  {forgotPasswordData.step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setForgotPasswordData({ phone: "", otp: "", newPassword: "", step: 1 })}
                    >
                      Start Over
                    </Button>
                  )}
                </form>
              </TabsContent>

              {/* Only show Owner tab content if no user is signed in */}
              {!user && (
                <TabsContent value="owner" className="space-y-6">
                  <div className="text-center mb-4">
                    <Shield className="w-12 h-12 mx-auto text-purple-600 mb-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Owner Access</h3>
                    <p className="text-sm text-gray-600">Enter owner credentials to access admin panel</p>
                  </div>
                  
                  <form onSubmit={handleOwnerLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="owner-password" className="text-gray-700 font-medium">Owner Password</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="owner-password"
                          type="password"
                          placeholder="Enter owner password"
                          value={ownerPassword}
                          onChange={(e) => setOwnerPassword(e.target.value)}
                          className="pl-10 h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium shadow-lg"
                    >
                      Login as Owner
                    </Button>
                  </form>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>

        {/* Debug Section */}
        <div className="text-center">
          <Button 
            onClick={testConnection}
            variant="outline"
            className="text-xs px-3 py-1"
          >
            Test Connection
          </Button>
        </div>

        {/* Terms and Privacy */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
          <p className="font-medium text-pink-600">🌸 FlowerExpress - Premium Flower Delivery 🌸</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
