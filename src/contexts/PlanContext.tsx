
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";

// Define types
export type PlanType = 'internet' | 'power';

export type Plan = {
  id: string;
  name: string;
  type: PlanType;
  description: string;
  price: number;
  duration: number; // in hours
  features: string[];
  popular?: boolean;
};

export type Voucher = {
  id: string;
  planId: string;
  code: string;
  isActive: boolean;
  activatedAt?: Date;
  expiresAt?: Date;
  remainingTime?: number; // in minutes
};

export type Hotspot = {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number]; // [latitude, longitude]
  status: 'active' | 'inactive' | 'maintenance';
  services: Array<'internet' | 'power'>;
  distance?: number; // in kilometers
};

type PlanContextType = {
  plans: Plan[];
  vouchers: Voucher[];
  hotspots: Hotspot[];
  isLoading: boolean;
  purchasePlan: (planId: string, paymentMethod: 'card' | 'crypto') => Promise<Voucher | null>;
  activateVoucher: (voucherId: string) => Promise<boolean>;
};

// Create the context
const PlanContext = createContext<PlanContextType | undefined>(undefined);

// Mock data
const mockPlans: Plan[] = [
  {
    id: 'plan_1',
    name: 'Browsing Basic',
    type: 'internet',
    description: 'Basic internet for casual browsing and messaging',
    price: 500, // in Naira
    duration: 24, // 24 hours
    features: ['1 Mbps speed', 'Up to 3 devices', 'Valid for 24 hours'],
  },
  {
    id: 'plan_2',
    name: 'Browsing Pro',
    type: 'internet',
    description: 'Faster internet for video streaming and downloads',
    price: 1000,
    duration: 24,
    features: ['3 Mbps speed', 'Up to 5 devices', 'Valid for 24 hours'],
    popular: true,
  },
  {
    id: 'plan_3',
    name: 'Weekly Internet',
    type: 'internet',
    description: 'Full week of internet access at great value',
    price: 3000,
    duration: 168, // 7 days
    features: ['2 Mbps speed', 'Up to 5 devices', 'Valid for 7 days'],
  },
  {
    id: 'plan_4',
    name: 'Power Basic',
    type: 'power',
    description: 'Basic power for lighting and phone charging',
    price: 300,
    duration: 24,
    features: ['Up to 100W usage', 'Phone and light charging', 'Valid for 24 hours'],
  },
  {
    id: 'plan_5',
    name: 'Power Plus',
    type: 'power',
    description: 'Enhanced power for TVs, fans and laptops',
    price: 800,
    duration: 24,
    features: ['Up to 300W usage', 'TV, fans, laptop support', 'Valid for 24 hours'],
    popular: true,
  },
  {
    id: 'plan_6',
    name: 'Weekly Power',
    type: 'power',
    description: 'Full week of power access at great value',
    price: 5000,
    duration: 168, // 7 days
    features: ['Up to 200W usage', 'All basic appliances', 'Valid for 7 days'],
  },
];

const mockHotspots: Hotspot[] = [
  {
    id: 'hotspot_1',
    name: 'Ijero Community Center',
    location: 'Ijero-Ekiti Main Square',
    coordinates: [7.8126, 5.0677],
    status: 'active',
    services: ['internet', 'power'],
  },
  {
    id: 'hotspot_2',
    name: 'Ekiti State University',
    location: 'EKSU Campus Library',
    coordinates: [7.7173, 5.2193],
    status: 'active',
    services: ['internet'],
  },
  {
    id: 'hotspot_3',
    name: 'Ado Market Hub',
    location: 'Central Market, Ado-Ekiti',
    coordinates: [7.6232, 5.2219],
    status: 'maintenance',
    services: ['internet', 'power'],
  },
];

// Provider component
export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>(mockHotspots);
  const [isLoading, setIsLoading] = useState(true);

  // Load vouchers from localStorage on mount
  useEffect(() => {
    const savedVouchers = localStorage.getItem('silverUmbrella.vouchers');
    if (savedVouchers) {
      setVouchers(JSON.parse(savedVouchers));
    }
    setIsLoading(false);
  }, []);

  // Save vouchers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('silverUmbrella.vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  // Mock function to purchase a plan
  const purchasePlan = async (planId: string, paymentMethod: 'card' | 'crypto'): Promise<Voucher | null> => {
    setIsLoading(true);
    try {
      // Find the selected plan
      const plan = plans.find(p => p.id === planId);
      if (!plan) {
        toast({
          title: "Plan Not Found",
          description: "The selected plan is no longer available.",
          variant: "destructive",
        });
        return null;
      }

      // Simulate payment process
      // In a real app, this would integrate with Flutterwave or a crypto payment gateway
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay

      // Generate a voucher
      const voucher: Voucher = {
        id: `voucher_${Date.now()}`,
        planId,
        code: Math.random().toString(36).substring(2, 10).toUpperCase(),
        isActive: false,
      };

      // Add voucher to state
      setVouchers(prev => [...prev, voucher]);

      toast({
        title: "Purchase Successful",
        description: `Your ${plan.name} voucher is ready to use.`,
      });

      return voucher;
    } catch (error) {
      console.error('Error purchasing plan:', error);
      toast({
        title: "Purchase Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function to activate a voucher
  const activateVoucher = async (voucherId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Find voucher
      const voucherIndex = vouchers.findIndex(v => v.id === voucherId);
      if (voucherIndex === -1) {
        toast({
          title: "Voucher Not Found",
          description: "The voucher could not be found.",
          variant: "destructive",
        });
        return false;
      }

      // Get plan details
      const voucher = vouchers[voucherIndex];
      const plan = plans.find(p => p.id === voucher.planId);

      if (!plan) {
        toast({
          title: "Plan Not Found",
          description: "The plan associated with this voucher is no longer available.",
          variant: "destructive",
        });
        return false;
      }

      // Update voucher
      const now = new Date();
      const expiresAt = new Date(now.getTime() + plan.duration * 60 * 60 * 1000);

      const updatedVoucher: Voucher = {
        ...voucher,
        isActive: true,
        activatedAt: now,
        expiresAt,
        remainingTime: plan.duration * 60, // in minutes
      };

      // Update vouchers state
      const updatedVouchers = [...vouchers];
      updatedVouchers[voucherIndex] = updatedVoucher;
      setVouchers(updatedVouchers);

      toast({
        title: "Voucher Activated",
        description: `Your ${plan.type} access is now active until ${expiresAt.toLocaleString()}.`,
      });

      return true;
    } catch (error) {
      console.error('Error activating voucher:', error);
      toast({
        title: "Activation Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PlanContext.Provider value={{ 
      plans,
      vouchers,
      hotspots,
      isLoading,
      purchasePlan,
      activateVoucher,
    }}>
      {children}
    </PlanContext.Provider>
  );
};

// Custom hook to use plan context
export const usePlans = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlans must be used within a PlanProvider');
  }
  return context;
};
