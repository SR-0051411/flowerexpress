
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

interface OwnerLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const OwnerLogin = ({ isOpen, onClose }: OwnerLoginProps) => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (login(password)) {
      toast({
        title: "Login Successful",
        description: "Welcome to Owner Dashboard",
      });
      onClose();
      setPassword("");
    } else {
      toast({
        title: "Login Failed",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Owner Login
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter owner password"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          
          <Button 
            onClick={handleLogin}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
          >
            Login as Owner
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OwnerLogin;
