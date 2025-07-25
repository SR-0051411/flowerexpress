
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
    console.log('SignUp attempt started for:', email);
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      console.log('Making signup request to Supabase...');
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
        console.error('Signup error:', error);
        
        // Handle specific error types
        if (error.message.includes('Email rate limit exceeded')) {
          return { success: false, message: 'Too many signup attempts. Please wait a few minutes and try again.' };
        }
        if (error.message.includes('User already registered')) {
          return { success: false, message: 'An account with this email already exists. Please try signing in instead.' };
        }
        if (error.message.includes('Password should be at least')) {
          return { success: false, message: 'Password must be at least 6 characters long.' };
        }
        
        return { success: false, message: error.message };
      }

      if (data.user && !data.session) {
        return { success: true, message: 'Account created successfully! You can now sign in.' };
      }

      return { success: true, message: 'Account created successfully!' };
    } catch (error: any) {
      console.error('Signup exception:', error);
      return { success: false, message: error.message || 'Network error occurred. Please check your internet connection and try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('SignIn attempt started for:', email);
    try {
      setLoading(true);
      console.log('Making signin request to Supabase...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Signin error:', error);
        
        // Handle specific error types
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, message: 'Invalid email or password. Please check your credentials and try again.' };
        }
        if (error.message.includes('Email not confirmed')) {
          return { success: false, message: 'Please check your email and confirm your account before signing in.' };
        }
        if (error.message.includes('Too many requests')) {
          return { success: false, message: 'Too many login attempts. Please wait a few minutes and try again.' };
        }
        
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Successfully signed in!' };
    } catch (error: any) {
      console.error('Signin exception:', error);
      return { success: false, message: error.message || 'Network error occurred. Please check your internet connection and try again.' };
    } finally {
      setLoading(false);
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
