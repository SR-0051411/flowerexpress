
import { useAuth } from "@/contexts/AuthContext";
import Auth from "@/pages/Auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, isOwner } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-pink-500" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow access if user is logged in OR if they're logged in as owner
  if (!user && !isOwner) {
    return <Auth />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
