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

export type SignalStrength = {
  level: number; // 0-4 (0 = no signal, 4 = excellent)
  rssi: number; // Signal strength in dBm
  quality: 'excellent' | 'good' | 'fair' | 'poor' | 'no-signal';
  lastUpdated: Date;
};

export type EquipmentHealth = {
  temperature: number; // in Celsius
  batteryLevel: number; // percentage
  solarGeneration: number; // watts
  powerConsumption: number; // watts
  uptime: number; // hours
  lastMaintenance: Date;
};

export type HotspotCapacity = {
  currentUsers: number;
  maxUsers: number;
  utilizationRate: number; // percentage
  queueLength: number;
};

export type SupportTicket = {
  id: string;
  userId: string;
  hotspotId: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
};

export type Hotspot = {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number]; // [latitude, longitude]
  status: 'active' | 'inactive' | 'maintenance';
  services: Array<'internet' | 'power'>;
  distance?: number; // in kilometers
  signalStrength?: SignalStrength;
  capacity?: HotspotCapacity;
  equipmentHealth?: EquipmentHealth;
};

type PlanContextType = {
  plans: Plan[];
  vouchers: Voucher[];
  hotspots: Hotspot[];
  supportTickets: SupportTicket[];
  isLoading: boolean;
  purchasePlan: (planId: string, paymentMethod: 'card' | 'crypto' | 'ton') => Promise<Voucher | null>;
  activateVoucher: (voucherId: string) => Promise<boolean>;
  updateSignalStrengths: () => void;
  submitSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateHotspotCapacity: () => void;
};

// Create the context
const PlanContext = createContext<PlanContextType | undefined>(undefined);

// Mock data with enhanced information
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
    signalStrength: {
      level: 4,
      rssi: -45,
      quality: 'excellent',
      lastUpdated: new Date(),
    },
    capacity: {
      currentUsers: 45,
      maxUsers: 200,
      utilizationRate: 22.5,
      queueLength: 0,
    },
    equipmentHealth: {
      temperature: 32,
      batteryLevel: 85,
      solarGeneration: 650,
      powerConsumption: 180,
      uptime: 720,
      lastMaintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  },
  {
    id: 'hotspot_2',
    name: 'Ekiti State University',
    location: 'EKSU Campus Library',
    coordinates: [7.7173, 5.2193],
    status: 'active',
    services: ['internet'],
    signalStrength: {
      level: 3,
      rssi: -60,
      quality: 'good',
      lastUpdated: new Date(),
    },
    capacity: {
      currentUsers: 120,
      maxUsers: 200,
      utilizationRate: 60,
      queueLength: 5,
    },
    equipmentHealth: {
      temperature: 35,
      batteryLevel: 92,
      solarGeneration: 580,
      powerConsumption: 165,
      uptime: 480,
      lastMaintenance: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
  },
  {
    id: 'hotspot_3',
    name: 'Ado Market Hub',
    location: 'Central Market, Ado-Ekiti',
    coordinates: [7.6232, 5.2219],
    status: 'maintenance',
    services: ['internet', 'power'],
    signalStrength: {
      level: 0,
      rssi: -90,
      quality: 'no-signal',
      lastUpdated: new Date(),
    },
    capacity: {
      currentUsers: 0,
      maxUsers: 200,
      utilizationRate: 0,
      queueLength: 0,
    },
    equipmentHealth: {
      temperature: 28,
      batteryLevel: 65,
      solarGeneration: 320,
      powerConsumption: 45,
      uptime: 0,
      lastMaintenance: new Date(),
    },
  },
];

// Provider component
export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>(mockHotspots);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
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

  // Update signal strengths and capacity periodically
  useEffect(() => {
    const interval = setInterval(() => {
      updateSignalStrengths();
      updateHotspotCapacity();
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Function to update signal strengths
  const updateSignalStrengths = () => {
    setHotspots(prevHotspots => 
      prevHotspots.map(hotspot => {
        if (hotspot.status === 'inactive' || hotspot.status === 'maintenance') {
          return {
            ...hotspot,
            signalStrength: {
              level: 0,
              rssi: -90,
              quality: 'no-signal' as const,
              lastUpdated: new Date(),
            },
          };
        }

        // Mock signal strength variations
        const baseSignal = hotspot.distance ? Math.max(1, 4 - Math.floor(hotspot.distance / 2)) : 4;
        const variation = Math.floor(Math.random() * 2) - 1;
        const level = Math.max(0, Math.min(4, baseSignal + variation));
        
        const rssiMap = { 0: -90, 1: -80, 2: -70, 3: -60, 4: -45 };
        const qualityMap = { 0: 'no-signal', 1: 'poor', 2: 'fair', 3: 'good', 4: 'excellent' } as const;

        return {
          ...hotspot,
          signalStrength: {
            level,
            rssi: rssiMap[level as keyof typeof rssiMap] + Math.floor(Math.random() * 10) - 5,
            quality: qualityMap[level as keyof typeof qualityMap],
            lastUpdated: new Date(),
          },
        };
      })
    );
  };

  // Function to update hotspot capacity
  const updateHotspotCapacity = () => {
    setHotspots(prevHotspots => 
      prevHotspots.map(hotspot => {
        if (hotspot.status === 'inactive' || hotspot.status === 'maintenance') {
          return {
            ...hotspot,
            capacity: {
              currentUsers: 0,
              maxUsers: 200,
              utilizationRate: 0,
              queueLength: 0,
            },
          };
        }

        // Mock capacity variations
        const baseUsers = hotspot.capacity?.currentUsers || 0;
        const variation = Math.floor(Math.random() * 20) - 10;
        const currentUsers = Math.max(0, Math.min(200, baseUsers + variation));
        const utilizationRate = (currentUsers / 200) * 100;
        const queueLength = currentUsers > 180 ? Math.floor(Math.random() * 10) : 0;

        return {
          ...hotspot,
          capacity: {
            currentUsers,
            maxUsers: 200,
            utilizationRate,
            queueLength,
          },
          equipmentHealth: {
            ...hotspot.equipmentHealth!,
            temperature: 28 + Math.floor(Math.random() * 15),
            batteryLevel: Math.max(20, Math.min(100, (hotspot.equipmentHealth?.batteryLevel || 80) + Math.floor(Math.random() * 10) - 5)),
            solarGeneration: Math.max(0, 400 + Math.floor(Math.random() * 400)),
            powerConsumption: 150 + Math.floor(Math.random() * 100),
          },
        };
      })
    );
  };

  // Submit support ticket
  const submitSupportTicket = async (ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const newTicket: SupportTicket = {
        ...ticketData,
        id: `ticket_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setSupportTickets(prev => [...prev, newTicket]);
      
      toast({
        title: "Support Ticket Submitted",
        description: "Your support request has been received. We'll get back to you soon.",
      });

      return true;
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support directly.",
        variant: "destructive",
      });
      return false;
    }
  };

  const purchasePlan = async (planId: string, paymentMethod: 'card' | 'crypto' | 'ton'): Promise<Voucher | null> => {
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
      // In a real app, this would integrate with Flutterwave, crypto gateway, or TON blockchain
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

      const paymentMethodText = paymentMethod === 'ton' ? 'TON wallet' : paymentMethod === 'crypto' ? 'cryptocurrency' : 'card';
      
      toast({
        title: "Purchase Successful",
        description: `Your ${plan.name} voucher is ready to use. Paid with ${paymentMethodText}.`,
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
      supportTickets,
      isLoading,
      purchasePlan,
      activateVoucher,
      updateSignalStrengths,
      submitSupportTicket,
      updateHotspotCapacity,
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
