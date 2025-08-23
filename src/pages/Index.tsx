
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi, Zap, Gift, Star, Users, ArrowRight, Sparkles, Trophy, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import QRCodeGenerator from "@/components/QRCodeGenerator";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const appUrl = window.location.origin;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero section with modern gradient and floating elements */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 mb-6 animate-bounce">
                <Sparkles className="w-4 h-4 mr-2" />
                Now Live in Ijero-Ekiti!
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
                Power Your
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"> Future</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-slate-300 leading-relaxed">
                Decentralized internet & solar power for rural Nigeria. 
                <span className="text-amber-400 font-semibold"> Earn rewards</span> by inviting friends!
              </p>

              {/* Reward System Spotlight */}
              <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30 mb-8 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                    <div className="bg-amber-500 p-2 rounded-full">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Earn While You Share!</h3>
                  </div>
                  <p className="text-amber-100 mb-4">
                    Get <span className="font-bold text-amber-200">50 points</span> for every friend you invite. 
                    Redeem points for free data and power!
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-amber-500/30 text-amber-100 border-amber-500/50">
                      <Trophy className="w-3 h-3 mr-1" />
                      Free Internet
                    </Badge>
                    <Badge variant="secondary" className="bg-amber-500/30 text-amber-100 border-amber-500/50">
                      <Zap className="w-3 h-3 mr-1" />
                      Free Power
                    </Badge>
                    <Badge variant="secondary" className="bg-amber-500/30 text-amber-100 border-amber-500/50">
                      <Users className="w-3 h-3 mr-1" />
                      Growing Community
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {user ? (
                  <>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105" 
                      onClick={() => navigate('/dashboard')}
                    >
                      <Zap className="mr-2 h-5 w-5" />
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-white font-semibold px-8 py-4 rounded-full transition-all transform hover:scale-105" 
                      onClick={() => navigate('/rewards')}
                    >
                      <Gift className="mr-2 h-5 w-5" />
                      Earn Rewards
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105" 
                    onClick={() => navigate('/login')}
                  >
                    <Star className="mr-2 h-5 w-5" />
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Right content - Visual cards */}
            <div className="lg:w-1/2 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Internet Card */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:rotate-1">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-lg">
                      <Wifi size={32} className="text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-white mb-2">Lightning Fast</h3>
                    <p className="text-slate-300">Starlink-powered internet up to 100 Mbps</p>
                    <Badge className="mt-3 bg-blue-500/20 text-blue-300 border-blue-500/30">
                      High Speed
                    </Badge>
                  </CardContent>
                </Card>

                {/* Power Card */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-rotate-1">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-lg">
                      <Zap size={32} className="text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-white mb-2">Clean Energy</h3>
                    <p className="text-slate-300">Solar mini-grid solutions 24/7</p>
                    <Badge className="mt-3 bg-amber-500/20 text-amber-300 border-amber-500/30">
                      Eco-Friendly
                    </Badge>
                  </CardContent>
                </Card>

                {/* Rewards Card - Spans both columns */}
                <Card className="md:col-span-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-lg">
                      <Gift size={32} className="text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-white mb-2">Invite & Earn</h3>
                    <p className="text-slate-300 mb-3">Share with friends, earn points, get free services!</p>
                    <div className="flex justify-center gap-2">
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
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

      {/* How it works section with modern cards */}
      <div className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent"></div>
        <div className="relative container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-muted text-muted-foreground mb-4">
              Simple Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get Connected in <span className="text-amber-500">3 Steps</span>
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
              <Badge className="bg-amber-100 text-amber-700 mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Mobile First
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">
                Instant Mobile Access
              </h2>
              <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                Scan with your phone camera to access Silver Umbrella instantly - no app download needed!
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
                  <div className="bg-amber-500 p-2 rounded-full">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <span className="text-card-foreground">Open camera app</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                  <div className="bg-amber-500 p-2 rounded-full">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <span className="text-card-foreground">Point at QR code</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                  <div className="bg-amber-500 p-2 rounded-full">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <span className="text-card-foreground">Tap notification to open</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA section with gradient */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative container mx-auto px-4 md:px-6 text-center">
          <Badge className="bg-amber-500/20 text-amber-200 border-amber-500/30 mb-6">
            <Users className="w-4 h-4 mr-2" />
            Join 500+ Happy Users
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Power Your Community?
          </h2>
          
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Be part of the infrastructure revolution in rural Nigeria. 
            Start earning rewards while helping your neighbors get connected.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  onClick={() => navigate('/plans')}
                >
                  <Zap className="mr-2 h-5 w-5" />
                  View Available Plans
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-silver-900 font-semibold px-8 py-4 rounded-full transition-all transform hover:scale-105"
                  onClick={() => navigate('/rewards')}
                >
                  <Gift className="mr-2 h-5 w-5" />
                  Start Earning Rewards
                </Button>
              </>
            ) : (
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
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
      
      {/* Footer with modern styling */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-lg">
                  <Zap size={24} className="text-white" />
                </div>
                <span className="font-bold text-2xl text-white">Silver Umbrella</span>
              </div>
              <p className="text-lg mb-6 text-slate-400 leading-relaxed">
                Building the future of rural infrastructure through decentralized networks and community rewards.
              </p>
              <div className="flex space-x-4">
                {['Twitter', 'Telegram', 'WhatsApp'].map((social) => (
                  <a key={social} href="#" className="hover:text-amber-400 transition-colors px-3 py-2 rounded-lg hover:bg-slate-800">
                    {social}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-white text-lg mb-6">Service Areas</h3>
              <ul className="space-y-3 text-slate-400">
                <li className="hover:text-amber-400 transition-colors">Ijero-Ekiti</li>
                <li className="hover:text-amber-400 transition-colors">Ekiti State University</li>
                <li className="hover:text-amber-400 transition-colors">Ado-Ekiti</li>
                <li className="text-amber-400 font-semibold">More coming soon!</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-white text-lg mb-6">Get in Touch</h3>
              <div className="space-y-3 text-slate-400">
                <p className="hover:text-amber-400 transition-colors">info@silverumbrella.network</p>
                <p className="hover:text-amber-400 transition-colors">+234 700 0000 000</p>
                <Badge className="bg-amber-500/20 text-amber-200 border-amber-500/30">
                  <Heart className="w-3 h-3 mr-1" />
                  Community First
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-slate-500">
              © {new Date().getFullYear()} Silver Umbrella Ventures. Building infrastructure where institutions have failed.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
