
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi, Zap, Gift, Star, Users, ArrowRight, Sparkles, Trophy, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import heroImage from "@/assets/hero-rural-connectivity.jpg";
import solarWifiImage from "@/assets/solar-wifi-illustration.jpg";
import communityRewardsImage from "@/assets/community-rewards.jpg";
import processStepsImage from "@/assets/process-steps.jpg";
import silverUmbrellaLogo from "@/assets/silver-umbrella-logo.png";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const appUrl = window.location.origin;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with prominent Silver Umbrella Ventures branding */}
      <header className="relative z-50 bg-background/95 backdrop-blur-sm border-b border-border/10">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={silverUmbrellaLogo} 
                alt="Silver Umbrella Ventures"
                className="h-12 w-auto"
              />
              <div>
                <h1 className="font-bold text-xl text-foreground">Silver Umbrella Ventures</h1>
                <p className="text-sm text-muted-foreground">Powering Rural Nigeria's Future</p>
              </div>
            </div>
            
            {user ? (
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate('/login')}>
                Get Started
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero section with stunning background */}
      <div className="relative bg-background overflow-hidden">
        {/* Hero background image */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Rural connectivity infrastructure"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 to-background/30"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <Badge className="mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Now Live in Ijero-Ekiti!
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
                Power Your
                <span className="text-primary"> Future</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-muted-foreground leading-relaxed">
                Decentralized internet & solar power for rural Nigeria.
                <span className="text-primary font-semibold"> Earn rewards</span> by inviting friends!
              </p>

              {/* Reward System Spotlight */}
              <Card className="bg-card border mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                    <div className="bg-primary p-2 rounded-full">
                      <Gift className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground">Earn While You Share!</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Get <span className="font-bold text-primary">50 points</span> for every friend you invite. 
                    Redeem points for free data and power!
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      <Trophy className="w-3 h-3 mr-1" />
                      Free Internet
                    </Badge>
                    <Badge variant="secondary">
                      <Zap className="w-3 h-3 mr-1" />
                      Free Power
                    </Badge>
                    <Badge variant="secondary">
                      <Users className="w-3 h-3 mr-1" />
                      Growing Community
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {user ? (
                  <>
                    <Button size="lg" onClick={() => navigate('/dashboard')}>
                      <Zap className="mr-2 h-5 w-5" />
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => navigate('/rewards')}>
                      <Gift className="mr-2 h-5 w-5" />
                      Earn Rewards
                    </Button>
                  </>
                ) : (
                  <Button size="lg" onClick={() => navigate('/login')}>
                    <Star className="mr-2 h-5 w-5" />
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Right content - Visual cards with graphics */}
            <div className="lg:w-1/2 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Internet & Power Card with stunning visual */}
                <Card className="bg-card border hover:bg-accent/30 transition-all duration-300 transform hover:scale-105 hover:rotate-1">
                  <CardContent className="p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0">
                      <img 
                        src={solarWifiImage} 
                        alt="Solar power and WiFi infrastructure"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-card/70"></div>
                    </div>
                    <div className="relative z-10">
                      <div className="bg-primary rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-lg backdrop-blur-sm">
                        <Wifi size={32} className="text-primary-foreground" />
                      </div>
                      <h3 className="font-bold text-xl text-card-foreground mb-2 drop-shadow-sm">Lightning Fast</h3>
                      <p className="text-card-foreground font-medium drop-shadow-sm">Starlink-powered internet up to 100 Mbps</p>
                      <Badge variant="secondary" className="mt-3 backdrop-blur-sm">
                        High Speed
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Power Card */}
                <Card className="bg-card border hover:bg-accent/30 transition-all duration-300 transform hover:scale-105 hover:-rotate-1">
                  <CardContent className="p-6 text-center">
                    <div className="bg-primary rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-lg">
                      <Zap size={32} className="text-primary-foreground" />
                    </div>
                    <h3 className="font-bold text-xl text-card-foreground mb-2">Clean Energy</h3>
                    <p className="text-muted-foreground">Solar mini-grid solutions 24/7</p>
                    <Badge variant="secondary" className="mt-3">
                      Eco-Friendly
                    </Badge>
                  </CardContent>
                </Card>

                {/* Rewards Card with community visual - Spans both columns */}
                <Card className="md:col-span-2 bg-card border transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
                  <div className="absolute inset-0">
                    <img 
                      src={communityRewardsImage} 
                      alt="Community rewards and connectivity"
                      className="w-full h-full object-cover opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-card/40"></div>
                  </div>
                  <CardContent className="p-6 text-center relative z-10">
                    <div className="bg-primary rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-lg backdrop-blur-sm">
                      <Gift size={32} className="text-primary-foreground" />
                    </div>
                    <h3 className="font-bold text-xl text-card-foreground mb-2 drop-shadow-sm">Invite & Earn</h3>
                    <p className="text-card-foreground font-medium mb-3 drop-shadow-sm">Share with friends, earn points, get free services!</p>
                    <div className="flex justify-center gap-2">
                      <Badge variant="secondary" className="backdrop-blur-sm">
                        <Heart className="w-3 h-3 mr-1" />
                        Community Rewards
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works section with visual background */}
      <div className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={processStepsImage} 
            alt="Step by step process visualization"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent"></div>
        </div>
        <div className="relative container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-muted text-muted-foreground mb-4">
              Simple Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get Connected in <span className="text-primary">3 Steps</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our growing community and start earning rewards immediately
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Plan",
                description: "Select from our affordable internet and power plans designed for your community.",
                icon: Wifi,
                color: "from-blue-500 to-cyan-600"
              },
              {
                step: "02", 
                title: "Invite Friends",
                description: "Share your invite code and earn 50 points for every friend who joins our network.",
                icon: Users,
                color: "from-purple-500 to-pink-600"
              },
              {
                step: "03",
                title: "Enjoy & Earn",
                description: "Get connected instantly and redeem your points for free data and power credits.",
                icon: Trophy,
                color: "from-amber-500 to-orange-600"
              }
            ].map((step, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-card">
                <CardContent className="p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-card opacity-80"></div>
                  <div className="relative">
                    <div className="text-6xl font-bold text-muted mb-4">{step.step}</div>
                    <div className={`bg-gradient-to-br ${step.color} rounded-full p-4 w-16 h-16 mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                      <step.icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground mb-4">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* QR Code section with modern design */}
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
                Scan with your phone camera to access Silver Umbrella Ventures instantly - no app download needed!
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <div className="bg-gradient-to-br from-muted/50 to-background p-6 rounded-2xl shadow-lg border">
                  <QRCodeGenerator 
                    url={appUrl}
                    title="Access Silver Umbrella Ventures" 
                    description="Scan to open on your device" 
                  />
                </div>
              </div>
              
              <div className="md:w-1/2 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                  <div className="bg-primary p-2 rounded-full">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <span className="text-card-foreground">Open camera app</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                  <div className="bg-primary p-2 rounded-full">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <span className="text-card-foreground">Point at QR code</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                  <div className="bg-primary p-2 rounded-full">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <span className="text-card-foreground">Tap notification to open</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-secondary py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge className="mb-6">
            <Users className="w-4 h-4 mr-2" />
            Join 500+ Happy Users
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Power Your Community?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Be part of the infrastructure revolution in rural Nigeria. 
            Start earning rewards while helping your neighbors get connected.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/plans')}
                >
                  <Zap className="mr-2 h-5 w-5" />
                  View Available Plans
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate('/rewards')}
                >
                  <Gift className="mr-2 h-5 w-5" />
                  Start Earning Rewards
                </Button>
              </>
            ) : (
              <Button 
                size="lg" 
                onClick={() => navigate('/login')}
              >
                <Star className="mr-2 h-5 w-5" />
                Create Account & Earn
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src={silverUmbrellaLogo} 
                  alt="Silver Umbrella Ventures"
                  className="h-12 w-auto"
                />
                <span className="font-bold text-2xl text-foreground">Silver Umbrella Ventures</span>
              </div>
              <p className="text-lg mb-6 text-muted-foreground leading-relaxed">
                Building the future of rural infrastructure through decentralized networks and community rewards.
              </p>
              <div className="flex space-x-4">
                {['Twitter', 'Telegram', 'WhatsApp'].map((social) => (
                  <a key={social} href="#" className="transition-colors px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground">
                    {social}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg mb-6">Service Areas</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="hover:text-primary transition-colors">Ijero-Ekiti</li>
                <li className="hover:text-primary transition-colors">Ekiti State University</li>
                <li className="hover:text-primary transition-colors">Ado-Ekiti</li>
                <li className="text-primary font-semibold">More coming soon!</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg mb-6">Get in Touch</h3>
              <div className="space-y-3 text-muted-foreground">
                <p className="hover:text-primary transition-colors">info@silverumbrella.network</p>
                <p className="hover:text-primary transition-colors">+234 700 0000 000</p>
                <Badge variant="secondary">
                  <Heart className="w-3 h-3 mr-1" />
                  Community First
                </Badge>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} Silver Umbrella Ventures. Building infrastructure where institutions have failed.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
