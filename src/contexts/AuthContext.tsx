
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isOwner: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; message: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          toast({
            title: "Welcome to FlowerExpress! 🌸",
            description: "You have successfully signed in.",
          });
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user && !data.user.email_confirmed_at) {
        return { success: true, message: 'Please check your email to confirm your account.' };
      }

      return { success: true, message: 'Account created successfully!' };
    } catch (error: any) {
      return { success: false, message: error.message || 'An error occurred during sign up.' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Successfully signed in!' };
    } catch (error: any) {
      return { success: false, message: error.message || 'An error occurred during sign in.' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsOwnerLoggedIn(false);
    toast({
      title: "Goodbye! 👋",
      description: "You have been signed out successfully.",
    });
  };

  const login = (password: string) => {
    // Get current owner password from localStorage, fallback to default
    const currentOwnerPassword = localStorage.getItem('ownerPassword') || 'flowerexpress2024';
    
    if (password === currentOwnerPassword) {
      setIsOwnerLoggedIn(true);
      toast({
        title: "Admin Access Granted",
        description: "Welcome to FlowerExpress Admin Panel",
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsOwnerLoggedIn(false);
  };

  // Check if user is owner (either logged in as owner or has admin email)
  const isOwner = isOwnerLoggedIn || user?.email === 'admin@flowerexpress.com';

  const value = {
    user,
    session,
    loading,
    signOut,
    isOwner,
    login,
    logout,
    signUp,
    signIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
