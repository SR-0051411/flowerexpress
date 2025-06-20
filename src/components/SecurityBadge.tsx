
import { Shield, Lock, CheckCircle } from "lucide-react";

const SecurityBadge = () => {
  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-4 max-w-sm">
      <div className="flex items-center space-x-2 mb-2">
        <Shield className="w-5 h-5 text-green-600" />
        <span className="font-semibold text-sm text-gray-800">Secure & Protected</span>
      </div>
      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span>SSL Encrypted Connection</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span>Bank-Grade Security</span>
        </div>
        <div className="flex items-center space-x-2">
          <Lock className="w-3 h-3 text-green-500" />
          <span>Data Protection Compliant</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityBadge;
