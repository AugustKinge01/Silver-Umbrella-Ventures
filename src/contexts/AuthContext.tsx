
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";

// Define types
type User = {
  id: string;
  phone: string;
  isAdmin: boolean;
  walletAddress?: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  sendOTP: (phone: string) => Promise<boolean>;
  verifyOTP: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  connectWallet: (address: string) => Promise<boolean>;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // For now, simulate checking local storage
        const savedUser = localStorage.getItem('silverUmbrella.user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Mock sending OTP
  const sendOTP = async (phone: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would call Supabase Auth API
      // For MVP, we'll simulate a successful OTP send
      toast({
        title: "OTP Sent",
        description: `Check your phone ${phone} for verification code.`,
      });
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Failed to send OTP",
        description: "Please try again later.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock verifying OTP
  const verifyOTP = async (phone: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would verify with Supabase Auth
      // For MVP, we'll accept any 6-digit code
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        // Mock user data
        const mockUser: User = {
          id: `user_${Date.now()}`,
          phone,
          isAdmin: phone === "+2347000000000", // Admin check
          name: ""
        };
        
        setUser(mockUser);
        localStorage.setItem('silverUmbrella.user', JSON.stringify(mockUser));
        
        toast({
          title: "Login Successful",
          description: "Welcome to Silver Umbrella!",
        });
        return true;
      }
      
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct 6-digit code.",
        variant: "destructive",
      });
      return false;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Verification Failed",
        description: "Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('silverUmbrella.user');
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
      localStorage.setItem('silverUmbrella.user', JSON.stringify(updatedUser));
      
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      sendOTP, 
      verifyOTP, 
      logout,
      connectWallet,
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
