import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Mail, Lock, User, Shield, Heart, Star, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const HCAPTCHA_SITE_KEY = "cf3ef482-d854-4312-a08e-208e5f46125c";

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
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    phone: "",
    otp: "",
    generatedOtp: "",
    newPassword: "",
    step: 1
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const captchaRef = useRef<HCaptcha>(null);
  
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const requiresCaptcha = failedAttempts >= 3;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        toast({
          title: "Google Sign-In Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCaptchaToken = async (token: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-captcha', {
        body: { token }
      });
      
      if (error) {
        console.error('Captcha verification error:', error);
        return false;
      }
      
      return data?.success === true;
    } catch (error) {
      console.error('Captcha verification failed:', error);
      return false;
    }
  };

  const handleCaptchaVerify = async (token: string) => {
    setCaptchaToken(token);
    const isValid = await verifyCaptchaToken(token);
    setCaptchaVerified(isValid);
    
    if (!isValid) {
      toast({
        title: "Verification Failed",
        description: "Please complete the CAPTCHA again",
        variant: "destructive",
      });
      captchaRef.current?.resetCaptcha();
    }
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
    setCaptchaVerified(false);
  };

  const testConnection = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
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
      toast({
        title: "Connection Test Error",
        description: String(err),
        variant: "destructive",
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (requiresCaptcha && !captchaVerified) {
      toast({
        title: "CAPTCHA Required",
        description: "Please complete the CAPTCHA verification",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    const result = await signUp(signUpData.email, signUpData.password, signUpData.fullName);
    
    if (result.success) {
      toast({
        title: "Account Created! 🎉",
        description: result.message,
      });
      setSignUpData({ email: "", password: "", fullName: "" });
      setFailedAttempts(0);
      setCaptchaVerified(false);
      captchaRef.current?.resetCaptcha();
    } else {
      setFailedAttempts(prev => prev + 1);
      toast({
        title: "Sign Up Failed",
        description: result.message,
        variant: "destructive",
      });
      // Reset captcha after failed attempt
      setCaptchaVerified(false);
      captchaRef.current?.resetCaptcha();
    }
    
    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (requiresCaptcha && !captchaVerified) {
      toast({
        title: "CAPTCHA Required",
        description: "Please complete the CAPTCHA verification",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    const result = await signIn(signInData.email, signInData.password);
    
    if (result.success) {
      toast({
        title: "Welcome Back! 🌸",
        description: result.message,
      });
      setFailedAttempts(0);
      setCaptchaVerified(false);
      navigate("/");
    } else {
      setFailedAttempts(prev => prev + 1);
      toast({
        title: "Sign In Failed",
        description: result.message,
        variant: "destructive",
      });
      // Reset captcha after failed attempt
      setCaptchaVerified(false);
      captchaRef.current?.resetCaptcha();
    }
    
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (forgotPasswordData.step === 1) {
        const response = await supabase.functions.invoke('send-otp', {
          body: { phone: forgotPasswordData.phone, type: 'password_reset' }
        });
        
        if (response.error) {
          throw new Error(response.error.message || "Failed to send OTP");
        }
        
        toast({
          title: "OTP Sent",
          description: "Check your phone for the verification code",
        });
        
        setForgotPasswordData(prev => ({ ...prev, step: 2 }));
      } else if (forgotPasswordData.step === 2) {
        setForgotPasswordData(prev => ({ ...prev, step: 3 }));
        toast({
          title: "OTP Verified",
          description: "Please enter your new password"
        });
      } else if (forgotPasswordData.step === 3) {
        toast({
          title: "Password Reset Successful",
          description: "Your password has been updated successfully"
        });
        setForgotPasswordData({ phone: "", otp: "", generatedOtp: "", newPassword: "", step: 1 });
        setShowForgotPassword(false);
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
                alt="FlowerExpressCo Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
              FlowerExpressCo
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
              Join FlowerExpressCo for the best flower delivery experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                  Create Account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">Welcome back! Enter your credentials to access your account.</p>
                </div>
                
                {/* Google Sign In Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                  </div>
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
                  
                  {/* CAPTCHA after 3 failed attempts */}
                  {requiresCaptcha && (
                    <div className="space-y-2">
                      <p className="text-sm text-orange-600 font-medium">
                        Too many failed attempts. Please verify you're human.
                      </p>
                      <div className="flex justify-center">
                        <HCaptcha
                          ref={captchaRef}
                          sitekey={HCAPTCHA_SITE_KEY}
                          onVerify={handleCaptchaVerify}
                          onExpire={handleCaptchaExpire}
                        />
                      </div>
                      {captchaVerified && (
                        <p className="text-sm text-green-600 text-center">✓ Verified</p>
                      )}
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-medium shadow-lg"
                    disabled={isLoading || (requiresCaptcha && !captchaVerified)}
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
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Reset it here
                    </button>
                  </p>
                </div>

                {/* Forgot Password Section */}
                {showForgotPassword && (
                  <div className="mt-6 p-4 border border-orange-200 rounded-lg bg-orange-50">
                    <div className="text-center mb-4">
                      <KeyRound className="w-8 h-8 mx-auto text-orange-600 mb-2" />
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

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 h-12"
                          onClick={() => {
                            setShowForgotPassword(false);
                            setForgotPasswordData({ phone: "", otp: "", generatedOtp: "", newPassword: "", step: 1 });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500 text-white font-medium"
                          disabled={isLoading}
                        >
                          {isLoading ? "Processing..." : 
                           forgotPasswordData.step === 1 ? "Send OTP" :
                           forgotPasswordData.step === 2 ? "Verify OTP" : "Reset Password"}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="signup" className="space-y-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">Create your FlowerExpressCo account to start ordering beautiful flowers.</p>
                </div>
                
                {/* Google Sign Up Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or sign up with email</span>
                  </div>
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
                  
                  {/* CAPTCHA after 3 failed attempts */}
                  {requiresCaptcha && (
                    <div className="space-y-2">
                      <p className="text-sm text-orange-600 font-medium">
                        Too many failed attempts. Please verify you're human.
                      </p>
                      <div className="flex justify-center">
                        <HCaptcha
                          ref={captchaRef}
                          sitekey={HCAPTCHA_SITE_KEY}
                          onVerify={handleCaptchaVerify}
                          onExpire={handleCaptchaExpire}
                        />
                      </div>
                      {captchaVerified && (
                        <p className="text-sm text-green-600 text-center">✓ Verified</p>
                      )}
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-medium shadow-lg"
                    disabled={isLoading || (requiresCaptcha && !captchaVerified)}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
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
          <p className="font-medium text-pink-600">🌸 FlowerExpressCo - Premium Flower Delivery 🌸</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
