import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Define types
type User = {
  id: string;
  email: string;
  phone?: string;
  roles: string[];
  walletAddress?: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  connectWallet: (address: string) => Promise<boolean>;
  checkIsAdmin: () => boolean;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user roles
  const fetchUserRoles = async (userId: string): Promise<string[]> => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching roles:', error);
      return ['user'];
    }
    
    return data?.map(r => r.role) || ['user'];
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const roles = await fetchUserRoles(session.user.id);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            phone: session.user.phone,
            roles,
            name: session.user.user_metadata?.full_name
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const roles = await fetchUserRoles(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          phone: session.user.phone,
          roles,
          name: session.user.user_metadata?.full_name
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign up function
  const signUp = async (email: string, password: string, fullName?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account Created",
        description: "Welcome to Silver Umbrella!",
      });
      return true;
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: "Sign Up Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      return true;
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out.",
    });
  };
  
  // Connect wallet function
  const connectWallet = async (address: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const updatedUser = {
        ...user,
        walletAddress: address
      };
      
      setUser(updatedUser);
      
      toast({
        title: "Wallet Connected",
        description: `Wallet ${address.slice(0, 6)}...${address.slice(-4)} connected successfully.`,
      });
      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Failed to Connect Wallet",
        description: "Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const checkIsAdmin = () => {
    return user?.roles.includes('admin') || false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      signUp, 
      signIn, 
      logout,
      connectWallet,
      checkIsAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
