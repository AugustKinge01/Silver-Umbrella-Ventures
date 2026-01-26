import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Gamepad2, Trophy, Users, Clock, DollarSign, Sparkles, Car, Smartphone, Headset, Monitor } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import gamingPeople from "@/assets/gaming-people.jpg";
import esportsTournament from "@/assets/esports-tournament.jpg";
import BookingPaymentModal, { BookingType } from "@/components/BookingPaymentModal";

type StationType = 'ps4' | 'ps5' | 'vr_racing' | 'vr_immersive' | 'mobile_esports';
type TournamentStatus = 'upcoming' | 'registration' | 'in_progress' | 'completed' | 'cancelled';

interface GamingStation {
  id: string;
  name: string;
  station_type: StationType;
  description: string;
  hourly_rate: number;
  xp_per_hour: number;
  is_available: boolean;
  specs: Record<string, string>;
}

interface Tournament {
  id: string;
  name: string;
  game: string;
  description: string;
  station_type: StationType | null;
  entry_fee: number;
  prize_pool: number;
  max_participants: number;
  current_participants: number;
  xp_reward_winner: number;
  xp_reward_participation: number;
  status: TournamentStatus;
  start_date: string;
}

const stationIcons: Record<StationType, React.ReactNode> = {
  ps4: <Gamepad2 className="h-5 w-5" />,
  ps5: <Gamepad2 className="h-5 w-5" />,
  vr_racing: <Car className="h-5 w-5" />,
  vr_immersive: <Headset className="h-5 w-5" />,
  mobile_esports: <Smartphone className="h-5 w-5" />
};

const stationColors: Record<StationType, string> = {
  ps4: "bg-blue-600",
  ps5: "bg-indigo-600",
  vr_racing: "bg-red-600",
  vr_immersive: "bg-purple-600",
  mobile_esports: "bg-green-600"
};

const statusColors: Record<TournamentStatus, string> = {
  upcoming: "bg-slate-500",
  registration: "bg-green-500",
  in_progress: "bg-amber-500",
  completed: "bg-blue-500",
  cancelled: "bg-red-500"
};

const GameHubPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stations, setStations] = useState<GamingStation[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedStation, setSelectedStation] = useState<GamingStation | null>(null);
  const [bookingModal, setBookingModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [tournamentModal, setTournamentModal] = useState<Tournament | null>(null);
  const [tournamentPaymentModal, setTournamentPaymentModal] = useState(false);
  const [hours, setHours] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stations");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stationsRes, tournamentsRes] = await Promise.all([
        supabase.from('gaming_stations').select('*').eq('is_available', true),
        supabase.from('tournaments').select('*').in('status', ['upcoming', 'registration', 'in_progress']).order('start_date')
      ]);

      if (stationsRes.data) {
        setStations(stationsRes.data.map(s => ({
          ...s,
          specs: typeof s.specs === 'string' ? JSON.parse(s.specs) : s.specs || {}
        })));
      }
      if (tournamentsRes.data) {
        setTournaments(tournamentsRes.data as Tournament[]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookStation = (station: GamingStation) => {
    setSelectedStation(station);
    setBookingModal(true);
  };

  const confirmBooking = () => {
    if (!user || !selectedStation) return;
    setBookingModal(false);
    setPaymentModal(true);
  };

  const handlePaymentComplete = async (paymentMethod: 'card' | 'crypto', voucherCode: string, phone: string) => {
    if (!user || !selectedStation) return;

    const totalAmount = selectedStation.hourly_rate * hours * 1000; // Convert to Naira
    const xpEarned = selectedStation.xp_per_hour * hours;
    const startTime = new Date();
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + hours);

    // Insert gaming session
    const { error } = await supabase.from('gaming_sessions').insert({
      user_id: user.id,
      station_id: selectedStation.id,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      duration_hours: hours,
      total_amount: totalAmount,
      xp_earned: xpEarned,
      payment_status: 'completed'
    });

    if (error) throw error;

    // Record payment
    await supabase.from('payments').insert({
      user_id: user.id,
      amount: totalAmount,
      payment_method: paymentMethod,
      status: 'completed',
      description: `Gaming session: ${selectedStation.name} - ${hours}h - Voucher: ${voucherCode}`,
      currency: 'NGN'
    });

    toast({
      title: "Session Booked!",
      description: `${hours}h on ${selectedStation.name}. You earned ${xpEarned} XP!`,
    });
  };

  const openTournamentPayment = (tournament: Tournament) => {
    setTournamentModal(tournament);
    if (tournament.entry_fee > 0) {
      setTournamentPaymentModal(true);
    }
  };

  const handleTournamentPaymentComplete = async (paymentMethod: 'card' | 'crypto', voucherCode: string, phone: string) => {
    if (!user || !tournamentModal) return;

    const { error } = await supabase.from('tournament_participants').insert({
      tournament_id: tournamentModal.id,
      user_id: user.id,
      payment_status: 'completed'
    });

    if (error) {
      if (error.code === '23505') {
        toast({
          title: "Already Registered",
          description: "You're already in this tournament!",
          variant: "destructive"
        });
      }
      throw error;
    }

    // Update participant count
    await supabase.from('tournaments').update({
      current_participants: tournamentModal.current_participants + 1
    }).eq('id', tournamentModal.id);

    // Record payment
    await supabase.from('payments').insert({
      user_id: user.id,
      amount: tournamentModal.entry_fee * 1000,
      payment_method: paymentMethod,
      status: 'completed',
      description: `Tournament entry: ${tournamentModal.name} - Voucher: ${voucherCode}`,
      currency: 'NGN'
    });

    toast({
      title: "Registered!",
      description: `You'll earn ${tournamentModal.xp_reward_participation} XP just for participating!`,
    });
    setTournamentPaymentModal(false);
    setTournamentModal(null);
    fetchData();
  };

  const registerForTournament = async (tournament: Tournament) => {
    if (!user) return;

    // If free tournament, register directly
    if (tournament.entry_fee === 0) {
      try {
        const { error } = await supabase.from('tournament_participants').insert({
          tournament_id: tournament.id,
          user_id: user.id,
          payment_status: 'completed'
        });

        if (error) {
          if (error.code === '23505') {
            toast({
              title: "Already Registered",
              description: "You're already in this tournament!",
              variant: "destructive"
            });
          } else {
            throw error;
          }
          return;
        }

        await supabase.from('tournaments').update({
          current_participants: tournament.current_participants + 1
        }).eq('id', tournament.id);

        toast({
          title: "Registered!",
          description: `You'll earn ${tournament.xp_reward_participation} XP just for participating!`,
        });
        setTournamentModal(null);
        fetchData();
      } catch (error) {
        console.error('Registration error:', error);
        toast({
          title: "Registration Failed",
          description: "Please try again.",
          variant: "destructive"
        });
      }
    } else {
      // Paid tournament - open payment modal
      openTournamentPayment(tournament);
    }
  };

  const groupedStations = stations.reduce((acc, station) => {
    if (!acc[station.station_type]) acc[station.station_type] = [];
    acc[station.station_type].push(station);
    return acc;
  }, {} as Record<StationType, GamingStation[]>);

  return (
    <Layout title="Game Hub" description="Console gaming, VR racing, tournaments & esports">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0">
          <img 
            src={gamingPeople} 
            alt="Gamers enjoying VR and console gaming"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
        </div>
        <div className="relative z-10 p-8 md:p-12">
          <Badge className="mb-4 bg-purple-500/90 text-white border-purple-500/30">
            <Gamepad2 className="w-3 h-3 mr-1" />
            Level Up Your Gaming
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">PS4 • PS5 • VR Racing • CODM</h2>
          <p className="text-muted-foreground max-w-xl">
            Book gaming sessions, join tournaments, and earn XP for every minute of play.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="stations">
            <Gamepad2 className="w-4 h-4 mr-2" />
            Gaming Stations
          </TabsTrigger>
          <TabsTrigger value="tournaments">
            <Trophy className="w-4 h-4 mr-2" />
            Tournaments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stations">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading stations...</div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedStations).map(([type, typeStations]) => (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`p-2 rounded-lg ${stationColors[type as StationType]}`}>
                      {stationIcons[type as StationType]}
                    </div>
                    <h3 className="text-lg font-semibold capitalize">
                      {type.replace('_', ' ')} Stations
                    </h3>
                    <Badge variant="outline">{typeStations.length} available</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {typeStations.map((station) => (
                      <Card key={station.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{station.name}</CardTitle>
                            <Badge className={stationColors[station.station_type]}>
                              ${station.hourly_rate}/hr
                            </Badge>
                          </div>
                          <CardDescription>{station.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {Object.entries(station.specs).map(([key, value]) => (
                              <Badge key={key} variant="outline" className="text-xs">
                                {value}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-primary text-sm">
                            <Sparkles className="w-4 h-4" />
                            <span>{station.xp_per_hour} XP per hour</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" onClick={() => handleBookStation(station)}>
                            <Clock className="w-4 h-4 mr-2" />
                            Book Session
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tournaments">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading tournaments...</div>
          ) : tournaments.length === 0 ? (
            <Card className="p-8 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Active Tournaments</h3>
              <p className="text-muted-foreground">Check back soon for upcoming competitions!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tournaments.map((tournament) => (
                <Card key={tournament.id} className="overflow-hidden">
                  <div className={`h-2 ${statusColors[tournament.status]}`} />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className={statusColors[tournament.status]}>
                        {tournament.status.replace('_', ' ')}
                      </Badge>
                      {tournament.station_type && (
                        <div className={`p-1.5 rounded ${stationColors[tournament.station_type]}`}>
                          {stationIcons[tournament.station_type]}
                        </div>
                      )}
                    </div>
                    <CardTitle className="mt-2">{tournament.name}</CardTitle>
                    <CardDescription>{tournament.game}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{tournament.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Participants</span>
                        <span>{tournament.current_participants}/{tournament.max_participants}</span>
                      </div>
                      <Progress 
                        value={(tournament.current_participants / tournament.max_participants) * 100} 
                        className="h-2"
                      />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground block">Entry Fee</span>
                          <span className="font-semibold">
                            {tournament.entry_fee > 0 ? `$${tournament.entry_fee}` : 'FREE'}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Prize Pool</span>
                          <span className="font-semibold text-green-500">${tournament.prize_pool}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-primary">
                          <Trophy className="w-4 h-4" />
                          <span>{tournament.xp_reward_winner} XP</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{tournament.xp_reward_participation} XP</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {format(new Date(tournament.start_date), 'PPP p')}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      disabled={tournament.status !== 'registration' || tournament.current_participants >= tournament.max_participants}
                      onClick={() => setTournamentModal(tournament)}
                    >
                      {tournament.status === 'registration' 
                        ? (tournament.current_participants >= tournament.max_participants ? 'Full' : 'Register Now')
                        : tournament.status === 'upcoming' ? 'Coming Soon' : 'In Progress'
                      }
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Booking Modal */}
      <Dialog open={bookingModal} onOpenChange={setBookingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Gaming Session</DialogTitle>
            <DialogDescription>
              {selectedStation?.name} - {selectedStation?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedStation && (
            <div className="space-y-4">
              <div>
                <Label>Duration (hours)</Label>
                <Input 
                  type="number" 
                  min={1} 
                  max={8} 
                  value={hours} 
                  onChange={(e) => setHours(Number(e.target.value))}
                />
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Rate</span>
                  <span>${selectedStation.hourly_rate}/hour</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(selectedStation.hourly_rate * hours).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-primary">
                  <span>XP Earned</span>
                  <span className="font-bold">+{selectedStation.xp_per_hour * hours} XP</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingModal(false)}>Cancel</Button>
            <Button onClick={confirmBooking}>Proceed to Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gaming Session Payment Modal */}
      <BookingPaymentModal
        isOpen={paymentModal}
        onClose={() => setPaymentModal(false)}
        booking={selectedStation ? {
          type: 'gaming' as BookingType,
          name: selectedStation.name,
          description: `${hours}h gaming session`,
          amount: selectedStation.hourly_rate * hours * 1000, // Convert to Naira
          xpEarned: selectedStation.xp_per_hour * hours,
          duration: `${hours} hour(s)`
        } : null}
        onPaymentComplete={handlePaymentComplete}
      />

      {/* Tournament Registration Modal */}
      <Dialog open={!!tournamentModal} onOpenChange={() => setTournamentModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register for {tournamentModal?.name}</DialogTitle>
            <DialogDescription>{tournamentModal?.game}</DialogDescription>
          </DialogHeader>
          
          {tournamentModal && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{tournamentModal.description}</p>
              
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Entry Fee</span>
                  <span className="font-bold">
                    {tournamentModal.entry_fee > 0 ? `$${tournamentModal.entry_fee}` : 'FREE'}
                  </span>
                </div>
                <div className="flex justify-between text-primary">
                  <span>Prize Pool</span>
                  <span className="font-bold">${tournamentModal.prize_pool}</span>
                </div>
                <div className="flex justify-between text-primary">
                  <span>Participation XP</span>
                  <span className="font-bold">+{tournamentModal.xp_reward_participation} XP</span>
                </div>
                <div className="flex justify-between text-secondary-foreground">
                  <span>Winner XP</span>
                  <span className="font-bold">+{tournamentModal.xp_reward_winner} XP</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setTournamentModal(null)}>Cancel</Button>
            <Button onClick={() => tournamentModal && registerForTournament(tournamentModal)}>
              {tournamentModal?.entry_fee ? `Proceed to Payment` : 'Register Free'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tournament Payment Modal */}
      <BookingPaymentModal
        isOpen={tournamentPaymentModal}
        onClose={() => {
          setTournamentPaymentModal(false);
          setTournamentModal(null);
        }}
        booking={tournamentModal ? {
          type: 'tournament' as BookingType,
          name: tournamentModal.name,
          description: tournamentModal.game,
          amount: tournamentModal.entry_fee * 1000, // Convert to Naira
          xpEarned: tournamentModal.xp_reward_participation
        } : null}
        onPaymentComplete={handleTournamentPaymentComplete}
      />
    </Layout>
  );
};

export default GameHubPage;
