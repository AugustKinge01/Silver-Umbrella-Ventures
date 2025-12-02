import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Utensils, Wifi, Zap, Clock, MapPin, Users, Star, Coffee, Monitor, Lock, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type CoworkingTier = 'basic' | 'standard' | 'premium' | 'vip';

interface TierConfig {
  id: string;
  tier: CoworkingTier;
  name: string;
  description: string;
  hourly_rate: number;
  daily_rate: number;
  monthly_rate: number | null;
  meals_included: number;
  amenities: string[];
  xp_multiplier: number;
}

interface CoworkingSpace {
  id: string;
  name: string;
  tier: CoworkingTier;
  capacity: number;
  location: string;
  amenities: string[];
  is_available: boolean;
}

const tierColors: Record<CoworkingTier, string> = {
  basic: "bg-slate-500",
  standard: "bg-blue-500",
  premium: "bg-purple-500",
  vip: "bg-amber-500"
};

const tierIcons: Record<CoworkingTier, React.ReactNode> = {
  basic: <Wifi className="h-5 w-5" />,
  standard: <Coffee className="h-5 w-5" />,
  premium: <Monitor className="h-5 w-5" />,
  vip: <Star className="h-5 w-5" />
};

const CoworkingPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tiers, setTiers] = useState<TierConfig[]>([]);
  const [spaces, setSpaces] = useState<CoworkingSpace[]>([]);
  const [selectedTier, setSelectedTier] = useState<CoworkingTier | null>(null);
  const [bookingModal, setBookingModal] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<CoworkingSpace | null>(null);
  const [bookingDuration, setBookingDuration] = useState<'hourly' | 'daily' | 'monthly'>('daily');
  const [hours, setHours] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tiersRes, spacesRes] = await Promise.all([
        supabase.from('coworking_tier_configs').select('*').order('hourly_rate'),
        supabase.from('coworking_spaces').select('*').eq('is_available', true)
      ]);

      if (tiersRes.data) {
        setTiers(tiersRes.data.map(t => ({
          ...t,
          amenities: Array.isArray(t.amenities) ? t.amenities : JSON.parse(t.amenities as string || '[]')
        })));
      }
      if (spacesRes.data) {
        setSpaces(spacesRes.data.map(s => ({
          ...s,
          amenities: Array.isArray(s.amenities) ? s.amenities : JSON.parse(s.amenities as string || '[]')
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = (tier: TierConfig) => {
    switch (bookingDuration) {
      case 'hourly': return tier.hourly_rate * hours;
      case 'daily': return tier.daily_rate;
      case 'monthly': return tier.monthly_rate || tier.daily_rate * 25;
    }
  };

  const calculateXP = (tier: TierConfig) => {
    const baseXP = bookingDuration === 'monthly' ? 500 : bookingDuration === 'daily' ? 25 : 5 * hours;
    return Math.round(baseXP * tier.xp_multiplier);
  };

  const handleBookSpace = (space: CoworkingSpace) => {
    setSelectedSpace(space);
    setSelectedTier(space.tier);
    setBookingModal(true);
  };

  const confirmBooking = async () => {
    if (!user || !selectedSpace) return;
    
    const tier = tiers.find(t => t.tier === selectedSpace.tier);
    if (!tier) return;

    const amount = calculatePrice(tier);
    const xp = calculateXP(tier);
    const startTime = new Date();
    let endTime = new Date();
    
    if (bookingDuration === 'hourly') {
      endTime.setHours(endTime.getHours() + hours);
    } else if (bookingDuration === 'daily') {
      endTime.setHours(23, 59, 59);
    } else {
      endTime.setMonth(endTime.getMonth() + 1);
    }

    try {
      const { error } = await supabase.from('coworking_bookings').insert({
        user_id: user.id,
        space_id: selectedSpace.id,
        tier: selectedSpace.tier,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        meals_used: 0,
        total_amount: amount,
        xp_earned: xp,
        payment_status: 'pending'
      });

      if (error) throw error;

      toast({
        title: "Booking Confirmed!",
        description: `You'll earn ${xp} XP for this booking. ${tier.meals_included > 0 ? `${tier.meals_included} meals included!` : ''}`,
      });
      setBookingModal(false);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const filteredSpaces = selectedTier 
    ? spaces.filter(s => s.tier === selectedTier)
    : spaces;

  return (
    <Layout title="Coworking Space" description="Book your productive workspace with power, internet & meals">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-primary/20 via-primary/10 to-background p-8">
        <div className="relative z-10">
          <Badge className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Earn XP with every booking
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Uninterruptible Power & Internet</h2>
          <p className="text-muted-foreground max-w-xl">
            Work from our powered spaces with high-speed internet, comfortable seating, and meals included in premium tiers.
          </p>
        </div>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {tiers.map((tier) => (
          <Card 
            key={tier.id} 
            className={`cursor-pointer transition-all hover:scale-105 ${selectedTier === tier.tier ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedTier(selectedTier === tier.tier ? null : tier.tier)}
          >
            <CardHeader className="pb-2">
              <div className={`w-10 h-10 rounded-full ${tierColors[tier.tier]} flex items-center justify-center text-white mb-2`}>
                {tierIcons[tier.tier]}
              </div>
              <CardTitle className="flex items-center justify-between">
                {tier.name}
                {tier.meals_included > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    <Utensils className="w-3 h-3 mr-1" />
                    {tier.meals_included} meals
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hourly</span>
                  <span className="font-semibold">${tier.hourly_rate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Daily</span>
                  <span className="font-semibold">${tier.daily_rate}</span>
                </div>
                {tier.monthly_rate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly</span>
                    <span className="font-semibold">${tier.monthly_rate}</span>
                  </div>
                )}
                <div className="flex justify-between text-primary">
                  <span>XP Multiplier</span>
                  <span className="font-bold">{tier.xp_multiplier}x</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1">
                {tier.amenities.slice(0, 3).map((amenity, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{amenity}</Badge>
                ))}
                {tier.amenities.length > 3 && (
                  <Badge variant="outline" className="text-xs">+{tier.amenities.length - 3}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Spaces */}
      <h3 className="text-xl font-semibold mb-4">
        {selectedTier ? `${selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Spaces` : 'All Available Spaces'}
      </h3>
      
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading spaces...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSpaces.map((space) => {
            const tier = tiers.find(t => t.tier === space.tier);
            return (
              <Card key={space.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{space.name}</CardTitle>
                    <Badge className={tierColors[space.tier]}>{space.tier}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {space.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Capacity: {space.capacity}
                    </div>
                    {tier && tier.meals_included > 0 && (
                      <div className="flex items-center gap-2 text-primary">
                        <Utensils className="w-4 h-4" />
                        {tier.meals_included} meals included
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {space.amenities.map((amenity, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{amenity}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleBookSpace(space)}>
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      <Dialog open={bookingModal} onOpenChange={setBookingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book {selectedSpace?.name}</DialogTitle>
            <DialogDescription>
              Select your booking duration and confirm
            </DialogDescription>
          </DialogHeader>
          
          {selectedSpace && selectedTier && (
            <div className="space-y-4">
              <div>
                <Label>Duration</Label>
                <Select value={bookingDuration} onValueChange={(v) => setBookingDuration(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {bookingDuration === 'hourly' && (
                <div>
                  <Label>Hours</Label>
                  <Input 
                    type="number" 
                    min={1} 
                    max={12} 
                    value={hours} 
                    onChange={(e) => setHours(Number(e.target.value))}
                  />
                </div>
              )}

              {(() => {
                const tier = tiers.find(t => t.tier === selectedTier);
                if (!tier) return null;
                return (
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Price</span>
                      <span className="font-bold">${calculatePrice(tier).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-primary">
                      <span>XP Earned</span>
                      <span className="font-bold">+{calculateXP(tier)} XP</span>
                    </div>
                    {tier.meals_included > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Meals Included</span>
                        <span className="font-bold">{tier.meals_included} per day</span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingModal(false)}>Cancel</Button>
            <Button onClick={confirmBooking}>Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CoworkingPage;
