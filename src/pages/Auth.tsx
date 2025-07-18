
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Flower2, Mail, Lock, User, Shield, Heart, Star } from "lucide-react";
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
  const { signUp, signIn, login, user } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Brand */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full flex items-center justify-center shadow-lg">
              <Flower2 className="w-8 h-8 text-white" />
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
              <TabsList className={`grid w-full ${!user ? 'grid-cols-3' : 'grid-cols-2'} mb-6`}>
                <TabsTrigger value="signin" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white flex flex-col gap-1 py-3 px-4">
                  <span className="font-medium">Login</span>
                  <span className="text-xs opacity-80">Already have an account?</span>
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white flex flex-col gap-1 py-3 px-4">
                  <span className="font-medium">Create Account</span>
                  <span className="text-xs opacity-80">New to FlowerExpress?</span>
                </TabsTrigger>
                {/* Only show Owner tab if no user is signed in */}
                {!user && (
                  <TabsTrigger value="owner" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white flex flex-col gap-1 py-3 px-4">
                    <span className="font-medium">Admin</span>
                    <span className="text-xs opacity-80">Store Owner</span>
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
