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
  isCheckingAdmin: boolean;
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);

  // Check if user has admin role from database
  const checkAdminRole = async (userId: string) => {
    setIsCheckingAdmin(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          // Defer admin check to avoid Supabase deadlock
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
        }

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
      
      if (session?.user) {
        checkAdminRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
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
      return { success: false, message: error.message || 'Network error occurred. Please check your internet connection and try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
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
      return { success: false, message: error.message || 'Network error occurred. Please check your internet connection and try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    toast({
      title: "Goodbye! 👋",
      description: "You have been signed out successfully.",
    });
  };

  // isOwner is now based on database role check
  const isOwner = isAdmin;

  const value = {
    user,
    session,
    loading,
    signOut,
    isOwner,
    isCheckingAdmin,
    signUp,
    signIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
