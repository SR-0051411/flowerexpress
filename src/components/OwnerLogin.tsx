import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface OwnerLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const OwnerLogin = ({ isOpen, onClose }: OwnerLoginProps) => {
  const { t } = useLanguage();
  const { signIn, user, isOwner, isCheckingAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        // Wait a moment for admin check to complete
        setTimeout(() => {
          onClose();
          setEmail("");
          setPassword("");
        }, 500);
      } else {
        toast({
          title: "Login Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already logged in but not admin, show appropriate message
  if (user && !isCheckingAdmin && !isOwner) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Admin Access Required
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              You are signed in but do not have admin privileges. 
              Please contact the administrator to request admin access.
            </p>
            <Button 
              onClick={onClose}
              className="w-full"
              variant="outline"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Admin Login
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Sign in with your admin account to access the dashboard.
          </p>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              disabled={isLoading}
            />
          </div>
          
          <Button 
            onClick={handleLogin}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            disabled={isLoading || isCheckingAdmin}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            Admin access requires an account with admin role assigned in the database.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OwnerLogin;
