import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Wifi, Zap, Gift, Star, Users, ArrowRight, Sparkles, Trophy, 
  Gamepad2, Coffee, Monitor, Crown, Coins, Target
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import silverUmbrellaLogo from "@/assets/silver-umbrella-logo.png";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const appUrl = window.location.origin;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="relative z-50 bg-card/95 backdrop-blur-xl border-b border-primary/20">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <img 
                src={silverUmbrellaLogo} 
                alt="Silver Umbrella Ventures"
                className="h-8 md:h-12 w-auto"
              />
              <div>
                <h1 className="font-bold text-base md:text-xl text-foreground">Silver Umbrella Ventures</h1>
                <p className="text-xs md:text-sm text-muted-foreground">Work • Play • Earn</p>
              </div>
            </div>
            
            {user ? (
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">App</span>
              </Button>
            ) : (
              <Button onClick={() => navigate('/login')} size="sm">
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Join</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
        
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
            {/* Left content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <Badge className="mb-4 md:mb-6 bg-primary/10 text-primary border-primary/30">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                <span className="text-xs md:text-sm">Powered by OneChain</span>
              </Badge>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-foreground leading-tight">
                <span className="block">Your All-in-One</span>
                <span className="text-primary block">Digital Hub</span>
              </h1>
              
              <p className="text-base md:text-xl lg:text-2xl mb-6 md:mb-8 text-muted-foreground leading-relaxed">
                Coworking spaces, gaming hub, and uninterrupted power —
                <span className="text-primary font-semibold block mt-2">Every action earns you XP & crypto rewards!</span>
              </p>

              {/* XP & Rewards Spotlight */}
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 mb-6 md:mb-8">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-center lg:justify-start gap-2 md:gap-3 mb-3 md:mb-4">
                    <div className="bg-primary p-2 rounded-full">
                      <Coins className="w-4 h-4 md:w-6 md:h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-base md:text-xl font-bold text-card-foreground">Earn While You Work & Play</h3>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
                    Every booking, gaming session, and tournament earns you <span className="font-bold text-primary">XP & INET tokens</span>. 
                    Level up and unlock exclusive perks!
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Trophy className="w-3 h-3 mr-1" />
                      Leaderboards
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Crown className="w-3 h-3 mr-1" />
                      VIP Perks
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Target className="w-3 h-3 mr-1" />
                      Achievements
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                {user ? (
                  <>
                    <Button size="default" className="md:size-lg" onClick={() => navigate('/dashboard')}>
                      <Zap className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      <span className="text-sm md:text-base">Dashboard</span>
                      <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                    <Button variant="outline" size="default" className="md:size-lg" onClick={() => navigate('/leaderboard')}>
                      <Trophy className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      <span className="text-sm md:text-base">Leaderboard</span>
                    </Button>
                  </>
                ) : (
                  <Button size="default" className="md:size-lg w-full sm:w-auto" onClick={() => navigate('/login')}>
                    <Star className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    <span className="text-sm md:text-base">Join the Ecosystem</span>
                    <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Right content - Feature cards */}
            <div className="lg:w-1/2 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Coworking Card */}
                <Card 
                  className="bg-card border hover:border-primary/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer group"
                  onClick={() => navigate('/coworking')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <Coffee size={32} className="text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-card-foreground mb-2">Coworking</h3>
                    <p className="text-muted-foreground text-sm mb-3">Uninterrupted power & fast internet</p>
                    <Badge variant="secondary" className="text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      + 2 Meals/Day
                    </Badge>
                  </CardContent>
                </Card>

                {/* Game Hub Card */}
                <Card 
                  className="bg-card border hover:border-primary/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer group"
                  onClick={() => navigate('/gaming')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <Gamepad2 size={32} className="text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-card-foreground mb-2">Game Hub</h3>
                    <p className="text-muted-foreground text-sm mb-3">PS5, VR Racing & Tournaments</p>
                    <Badge variant="secondary" className="text-xs">
                      <Trophy className="w-3 h-3 mr-1" />
                      Win Prizes
                    </Badge>
                  </CardContent>
                </Card>

                {/* Internet & Power Card */}
                <Card 
                  className="bg-card border hover:border-primary/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer group"
                  onClick={() => navigate('/plans')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <Wifi size={32} className="text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-card-foreground mb-2">Internet Plans</h3>
                    <p className="text-muted-foreground text-sm mb-3">Starlink-powered connectivity</p>
                    <Badge variant="secondary" className="text-xs">
                      Up to 100Mbps
                    </Badge>
                  </CardContent>
                </Card>

                {/* Leaderboard Card */}
                <Card 
                  className="bg-card border hover:border-primary/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer group"
                  onClick={() => navigate('/leaderboard')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <Trophy size={32} className="text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-card-foreground mb-2">Leaderboard</h3>
                    <p className="text-muted-foreground text-sm mb-3">Compete & climb the ranks</p>
                    <Badge variant="secondary" className="text-xs">
                      <Crown className="w-3 h-3 mr-1" />
                      Top Players
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="bg-muted text-muted-foreground mb-4">
              Our Ecosystem
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              One Place, <span className="text-primary">Endless Possibilities</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Work productively, play competitively, earn continuously
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Coworking Feature */}
            <Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6 md:p-8">
                <div className="bg-blue-500/10 rounded-2xl p-4 w-fit mb-6">
                  <Coffee className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">Coworking Spaces</h3>
                <p className="text-muted-foreground mb-4">
                  4 tiers from Basic to VIP. Premium tiers include 2 meals daily. 
                  Solar-powered backup ensures zero downtime.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" /> Uninterrupted power
                  </li>
                  <li className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-primary" /> High-speed internet
                  </li>
                  <li className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-primary" /> XP multipliers on premium tiers
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6" onClick={() => navigate('/coworking')}>
                  Explore Spaces
                </Button>
              </CardContent>
            </Card>

            {/* Gaming Feature */}
            <Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6 md:p-8">
                <div className="bg-purple-500/10 rounded-2xl p-4 w-fit mb-6">
                  <Gamepad2 className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">Gaming Hub</h3>
                <p className="text-muted-foreground mb-4">
                  PS4/PS5 consoles, VR racing simulators, immersive VR experiences, 
                  and mobile esports stations.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-primary" /> Console & VR rentals
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" /> Weekly tournaments
                  </li>
                  <li className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-primary" /> Win INET prizes
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6" onClick={() => navigate('/gaming')}>
                  View Gaming
                </Button>
              </CardContent>
            </Card>

            {/* XP & Rewards Feature */}
            <Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6 md:p-8">
                <div className="bg-green-500/10 rounded-2xl p-4 w-fit mb-6">
                  <Crown className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">XP & Rewards</h3>
                <p className="text-muted-foreground mb-4">
                  Every action in our ecosystem earns XP. Level up to unlock perks 
                  and earn INET tokens.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" /> On-chain Player DID
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" /> Global leaderboards
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" /> Achievement badges
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6" onClick={() => navigate('/leaderboard')}>
                  View Leaderboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* QR Code section */}
      <div className="bg-gradient-to-br from-muted to-muted/80 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-card rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto border">
            <div className="text-center mb-8">
              <Badge className="mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Mobile First
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">
                Instant Mobile Access
              </h2>
              <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                Scan to access Silver Umbrella Ventures on your phone — book spaces, join games, track XP!
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <div className="bg-gradient-to-br from-muted/50 to-background p-6 rounded-2xl shadow-lg border">
                  <QRCodeGenerator 
                    url={appUrl}
                    title="Access Silver Umbrella" 
                    description="Scan to open on your device" 
                  />
                </div>
              </div>
              
              <div className="md:w-1/2 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                  <div className="bg-primary p-2 rounded-full">
                    <Coffee className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-card-foreground">Book coworking spaces</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                  <div className="bg-primary p-2 rounded-full">
                    <Gamepad2 className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-card-foreground">Reserve gaming stations</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                  <div className="bg-primary p-2 rounded-full">
                    <Trophy className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-card-foreground">Join tournaments & earn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-gradient-to-r from-primary/10 via-background to-accent/10 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge className="mb-6">
            <Users className="w-4 h-4 mr-2" />
            Growing Community
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Work, Play & Earn?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Join our ecosystem where productivity meets entertainment. 
            Every action you take earns you XP and real crypto rewards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/coworking')}
                >
                  <Coffee className="mr-2 h-5 w-5" />
                  Book a Space
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate('/gaming')}
                >
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  Start Gaming
                </Button>
              </>
            ) : (
              <Button 
                size="lg" 
                onClick={() => navigate('/login')}
              >
                <Star className="mr-2 h-5 w-5" />
                Join the Ecosystem
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={silverUmbrellaLogo} 
                  alt="Silver Umbrella Ventures"
                  className="h-10 w-auto"
                />
                <div>
                  <h3 className="font-bold text-foreground">Silver Umbrella Ventures</h3>
                  <p className="text-sm text-muted-foreground">Work • Play • Earn</p>
                </div>
              </div>
              <p className="text-muted-foreground max-w-md">
                An all-in-one digital ecosystem combining coworking spaces, gaming hub, 
                and blockchain-powered rewards. Every action earns you XP and INET tokens.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Services</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/coworking')}>Coworking Spaces</li>
                <li className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/gaming')}>Game Hub</li>
                <li className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/plans')}>Internet Plans</li>
                <li className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/leaderboard')}>Leaderboard</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Account</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/login')}>Login / Sign Up</li>
                <li className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/dashboard')}>Dashboard</li>
                <li className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/rewards')}>Rewards</li>
                <li className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/support')}>Support</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} Silver Umbrella Ventures. Powered by OneChain.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
