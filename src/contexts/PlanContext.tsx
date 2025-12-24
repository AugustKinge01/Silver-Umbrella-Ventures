import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useOneChainContracts } from "@/hooks/useOneChainContracts";
import { supabase } from "@/integrations/supabase/client";

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

export type InviteCode = {
  id: string;
  code: string;
  inviterId: string;
  inviterPhone: string;
  uses: number;
  maxUses: number;
  pointsPerUse: number;
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
};

export type PointsTransaction = {
  id: string;
  userId: string;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
  relatedId?: string; // invite code ID or voucher ID
  createdAt: Date;
};

export type PointsRedemption = {
  id: string;
  name: string;
  type: 'internet' | 'power';
  pointsCost: number;
  description: string;
  duration: number; // in hours
  isActive: boolean;
};

type PlanContextType = {
  plans: Plan[];
  vouchers: Voucher[];
  hotspots: Hotspot[];
  supportTickets: SupportTicket[];
  inviteCodes: InviteCode[];
  pointsTransactions: PointsTransaction[];
  pointsRedemptions: PointsRedemption[];
  userPoints: number;
  isLoading: boolean;
  purchasePlan: (planId: string, paymentMethod: 'card' | 'crypto') => Promise<Voucher | null>;
  activateVoucher: (voucherId: string) => Promise<boolean>;
  updateSignalStrengths: () => void;
  submitSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateHotspotCapacity: () => void;
  generateInviteCode: () => Promise<InviteCode | null>;
  useInviteCode: (code: string) => Promise<boolean>;
  getUserPoints: () => number;
  redeemPoints: (redemptionId: string) => Promise<Voucher | null>;
  getPointsHistory: () => PointsTransaction[];
};

// Create the context
const PlanContext = createContext<PlanContextType | undefined>(undefined);

const mockPointsRedemptions: PointsRedemption[] = [
  {
    id: 'redeem_1',
    name: '2 Hour Internet Free',
    type: 'internet',
    pointsCost: 100,
    description: '2 hours of free internet access',
    duration: 2,
    isActive: true,
  },
  {
    id: 'redeem_2',
    name: '1 Day Internet Free',
    type: 'internet',
    pointsCost: 400,
    description: '24 hours of free internet access',
    duration: 24,
    isActive: true,
  },
  {
    id: 'redeem_3',
    name: '2 Hour Power Free',
    type: 'power',
    pointsCost: 80,
    description: '2 hours of free power access',
    duration: 2,
    isActive: true,
  },
  {
    id: 'redeem_4',
    name: '1 Day Power Free',
    type: 'power',
    pointsCost: 320,
    description: '24 hours of free power access',
    duration: 24,
    isActive: true,
  },
];

// Provider component
export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [pointsTransactions, setPointsTransactions] = useState<PointsTransaction[]>([]);
  const [pointsRedemptions, setPointsRedemptions] = useState<PointsRedemption[]>(mockPointsRedemptions);
  const [userPoints, setUserPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // OneChain contracts integration
  const { purchasePlan: purchasePlanContract, mintVoucher } = useOneChainContracts();

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch plans from database
        const { data: dbPlans, error: plansError } = await supabase
          .from('plans')
          .select('*')
          .eq('is_active', true);
        
        if (plansError) throw plansError;
        
        if (dbPlans && dbPlans.length > 0) {
          const formattedPlans: Plan[] = dbPlans.map((p, index) => ({
            id: p.id,
            name: p.name,
            type: p.duration_hours <= 24 ? 'internet' : 'internet', // Default to internet
            description: p.description || '',
            price: Number(p.price),
            duration: p.duration_hours,
            features: [
              `${p.speed_mbps} Mbps speed`,
              p.data_limit_mb ? `${p.data_limit_mb}MB data` : 'Unlimited data',
              `Valid for ${p.duration_hours} hours`
            ],
            popular: index === 1, // Mark second plan as popular
          }));
          setPlans(formattedPlans);
        }
        
        // Fetch hotspots from database
        const { data: dbHotspots, error: hotspotsError } = await supabase
          .from('hotspots')
          .select('*');
        
        if (hotspotsError) throw hotspotsError;
        
        if (dbHotspots && dbHotspots.length > 0) {
          const formattedHotspots: Hotspot[] = dbHotspots.map(h => ({
            id: h.id,
            name: h.name,
            location: h.location,
            coordinates: [Number(h.latitude) || 0, Number(h.longitude) || 0] as [number, number],
            status: h.status as 'active' | 'inactive' | 'maintenance',
            services: h.is_solar_powered ? ['internet', 'power'] : ['internet'],
            signalStrength: {
              level: Math.floor((h.signal_strength || 0) / 25),
              rssi: -90 + (h.signal_strength || 0),
              quality: h.signal_strength >= 80 ? 'excellent' : h.signal_strength >= 60 ? 'good' : h.signal_strength >= 40 ? 'fair' : 'poor',
              lastUpdated: new Date(),
            },
            capacity: {
              currentUsers: h.current_users || 0,
              maxUsers: h.capacity || 50,
              utilizationRate: ((h.current_users || 0) / (h.capacity || 50)) * 100,
              queueLength: 0,
            },
            equipmentHealth: {
              temperature: 30,
              batteryLevel: 85,
              solarGeneration: h.is_solar_powered ? 500 : 0,
              powerConsumption: 150,
              uptime: 720,
              lastMaintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          }));
          setHotspots(formattedHotspots);
        }
        
        // Load vouchers from localStorage (user-specific, not in DB yet)
        const savedVouchers = localStorage.getItem('silverUmbrella.vouchers');
        const savedInviteCodes = localStorage.getItem('silverUmbrella.inviteCodes');
        const savedPointsTransactions = localStorage.getItem('silverUmbrella.pointsTransactions');
        
        if (savedVouchers) setVouchers(JSON.parse(savedVouchers));
        if (savedInviteCodes) setInviteCodes(JSON.parse(savedInviteCodes));
        if (savedPointsTransactions) {
          const transactions = JSON.parse(savedPointsTransactions);
          setPointsTransactions(transactions);
          const totalPoints = transactions.reduce((sum: number, transaction: PointsTransaction) => {
            return transaction.type === 'earned' ? sum + transaction.points : sum - transaction.points;
          }, 0);
          setUserPoints(Math.max(0, totalPoints));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error loading data",
          description: "Some features may not work correctly.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('silverUmbrella.vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem('silverUmbrella.inviteCodes', JSON.stringify(inviteCodes));
  }, [inviteCodes]);

  useEffect(() => {
    localStorage.setItem('silverUmbrella.pointsTransactions', JSON.stringify(pointsTransactions));
  }, [pointsTransactions]);

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

  const purchasePlan = async (planId: string, paymentMethod: 'card' | 'crypto' = 'crypto'): Promise<Voucher | null> => {
    setIsLoading(true);
    try {
      const plan = plans.find(p => p.id === planId);
      if (!plan) {
        toast({
          title: "Plan Not Found",
          description: "The selected plan is no longer available.",
          variant: "destructive",
        });
        return null;
      }

      // For crypto payments, use smart contract
      if (paymentMethod === 'crypto') {
        // Convert Naira to ONE (mock conversion rate: 1000 Naira = 1 ONE)
        const priceInONE = plan.price / 1000;
        
        // Create payment on blockchain using ONE tokens
        const paymentId = await purchasePlanContract(
          planId,
          priceInONE.toString(),
          true // use native ONE token
        );

        if (!paymentId) {
          return null;
        }

        // Generate voucher code
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        
        // Mint voucher NFT on blockchain (admin address will be from connected wallet)
        const voucherId = await mintVoucher(
          planId,
          code,
          plan.duration,
          (window as any).ethereum?.selectedAddress || "0x0000000000000000000000000000000000000000"
        );

        if (!voucherId) {
          toast({
            title: "Voucher Minting Failed",
            description: "Payment succeeded but voucher creation failed. Contact support.",
            variant: "destructive",
          });
          return null;
        }

        // Create local voucher record
        const voucher: Voucher = {
          id: voucherId,
          planId,
          code,
          isActive: false,
        };

        setVouchers(prev => [...prev, voucher]);

        toast({
          title: "Purchase Successful",
          description: `Voucher ${code} created on Stellar blockchain!`,
        });

        return voucher;
      }

      // Fallback for other payment methods
      await new Promise(resolve => setTimeout(resolve, 2000));

      const voucher: Voucher = {
        id: `voucher_${Date.now()}`,
        planId,
        code: Math.random().toString(36).substring(2, 10).toUpperCase(),
        isActive: false,
      };

      setVouchers(prev => [...prev, voucher]);

      const paymentMethodText = paymentMethod === 'card' ? 'card' : 'cryptocurrency';
      
      toast({
        title: "Purchase Successful",
        description: `Your ${plan.name} voucher is ready. Paid with ${paymentMethodText}.`,
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

  // Generate invite code
  const generateInviteCode = async (): Promise<InviteCode | null> => {
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const newInviteCode: InviteCode = {
        id: `invite_${Date.now()}`,
        code,
        inviterId: 'current_user', // In real app, get from auth context
        inviterPhone: '+234XXXXXXXXX', // In real app, get from auth context
        uses: 0,
        maxUses: 10,
        pointsPerUse: 50,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
      };

      setInviteCodes(prev => [...prev, newInviteCode]);

      toast({
        title: "Invite Code Generated",
        description: `Your invite code ${code} is ready to share! Earn 50 points per use.`,
      });

      return newInviteCode;
    } catch (error) {
      console.error('Error generating invite code:', error);
      toast({
        title: "Generation Failed",
        description: "Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Use invite code
  const useInviteCode = async (code: string): Promise<boolean> => {
    try {
      const inviteCode = inviteCodes.find(ic => ic.code === code && ic.isActive);
      
      if (!inviteCode) {
        toast({
          title: "Invalid Code",
          description: "This invite code doesn't exist or has expired.",
          variant: "destructive",
        });
        return false;
      }

      if (inviteCode.uses >= inviteCode.maxUses) {
        toast({
          title: "Code Expired",
          description: "This invite code has reached its maximum uses.",
          variant: "destructive",
        });
        return false;
      }

      if (inviteCode.expiresAt && new Date() > inviteCode.expiresAt) {
        toast({
          title: "Code Expired",
          description: "This invite code has expired.",
          variant: "destructive",
        });
        return false;
      }

      // Update invite code usage
      setInviteCodes(prev => prev.map(ic => 
        ic.id === inviteCode.id 
          ? { ...ic, uses: ic.uses + 1 }
          : ic
      ));

      // Add points transaction for inviter
      const pointsTransaction: PointsTransaction = {
        id: `transaction_${Date.now()}`,
        userId: inviteCode.inviterId,
        type: 'earned',
        points: inviteCode.pointsPerUse,
        description: `Invite code used: ${code}`,
        relatedId: inviteCode.id,
        createdAt: new Date(),
      };

      setPointsTransactions(prev => [...prev, pointsTransaction]);
      setUserPoints(prev => prev + inviteCode.pointsPerUse);

      toast({
        title: "Invite Code Applied",
        description: `Welcome! The inviter earned ${inviteCode.pointsPerUse} points.`,
      });

      return true;
    } catch (error) {
      console.error('Error using invite code:', error);
      toast({
        title: "Application Failed",
        description: "Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Get user points
  const getUserPoints = (): number => {
    return userPoints;
  };

  // Redeem points for voucher
  const redeemPoints = async (redemptionId: string): Promise<Voucher | null> => {
    try {
      const redemption = pointsRedemptions.find(r => r.id === redemptionId && r.isActive);
      
      if (!redemption) {
        toast({
          title: "Invalid Redemption",
          description: "This redemption option is not available.",
          variant: "destructive",
        });
        return null;
      }

      if (userPoints < redemption.pointsCost) {
        toast({
          title: "Insufficient Points",
          description: `You need ${redemption.pointsCost} points but only have ${userPoints}.`,
          variant: "destructive",
        });
        return null;
      }

      // Create voucher
      const voucher: Voucher = {
        id: `voucher_${Date.now()}`,
        planId: `redeem_${redemption.type}`,
        code: Math.random().toString(36).substring(2, 10).toUpperCase(),
        isActive: false,
      };

      setVouchers(prev => [...prev, voucher]);

      // Add points transaction
      const pointsTransaction: PointsTransaction = {
        id: `transaction_${Date.now()}`,
        userId: 'current_user',
        type: 'redeemed',
        points: redemption.pointsCost,
        description: `Redeemed: ${redemption.name}`,
        relatedId: voucher.id,
        createdAt: new Date(),
      };

      setPointsTransactions(prev => [...prev, pointsTransaction]);
      setUserPoints(prev => prev - redemption.pointsCost);

      toast({
        title: "Points Redeemed",
        description: `Your ${redemption.name} voucher is ready to use!`,
      });

      return voucher;
    } catch (error) {
      console.error('Error redeeming points:', error);
      toast({
        title: "Redemption Failed",
        description: "Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Get points history
  const getPointsHistory = (): PointsTransaction[] => {
    return pointsTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  return (
    <PlanContext.Provider value={{ 
      plans,
      vouchers,
      hotspots,
      supportTickets,
      inviteCodes,
      pointsTransactions,
      pointsRedemptions,
      userPoints,
      isLoading,
      purchasePlan,
      activateVoucher,
      updateSignalStrengths,
      submitSupportTicket,
      updateHotspotCapacity,
      generateInviteCode,
      useInviteCode,
      getUserPoints,
      redeemPoints,
      getPointsHistory,
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
