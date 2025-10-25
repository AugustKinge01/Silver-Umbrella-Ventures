
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Zap, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePlans } from "@/contexts/PlanContext";
import VoucherCard from "@/components/VoucherCard";
import dashboardHeroImage from "@/assets/dashboard-hero.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plans, vouchers, hotspots, activateVoucher } = usePlans();
  const [activeVouchers, setActiveVouchers] = useState<{ internet: boolean; power: boolean }>({
    internet: false,
    power: false
  });
  
  // Check if user has active vouchers
  useEffect(() => {
    if (!vouchers.length) return;
    
    const internetVoucher = vouchers.find(v => {
      const plan = plans.find(p => p.id === v.planId);
      return v.isActive && plan?.type === 'internet' && v.expiresAt && new Date(v.expiresAt) > new Date();
    });
    
    const powerVoucher = vouchers.find(v => {
      const plan = plans.find(p => p.id === v.planId);
      return v.isActive && plan?.type === 'power' && v.expiresAt && new Date(v.expiresAt) > new Date();
    });
    
    setActiveVouchers({
      internet: !!internetVoucher,
      power: !!powerVoucher
    });
  }, [vouchers, plans]);

  // Format recent vouchers
  const recentVouchers = vouchers
    .slice(0, 3)
    .map(voucher => {
      const plan = plans.find(p => p.id === voucher.planId);
      return {
        voucher,
        plan
      };
    })
    .filter(item => item.plan);

  // Get nearby hotspots (top 3)
  const nearbyHotspots = hotspots
    .filter(h => h.status === 'active')
    .slice(0, 3);

  const handleActivateVoucher = async (voucherId: string) => {
    await activateVoucher(voucherId);
  };

  return (
    <Layout
      title={`Welcome${user?.name ? ', ' + user.name : ''}`}
      description="Manage your internet and power access"
    >
      {/* Hero section with dashboard graphic */}
      <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-background rounded-2xl p-6 md:p-8 mb-6 overflow-hidden border border-primary/20">
        <div className="absolute inset-0">
          <img 
            src={dashboardHeroImage} 
            alt="Dashboard overview"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-background/70"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-xl md:text-2xl font-bold mb-2">Your dePIN Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">Decentralized connectivity powered by blockchain technology</p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              Internet Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${activeVouchers.internet ? 'bg-primary/20 text-primary' : 'bg-muted'}`}>
                  <Wifi size={24} />
                </div>
                <div>
                  <div className={`font-semibold ${activeVouchers.internet ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {activeVouchers.internet ? 'Connected' : 'Not Connected'}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    {activeVouchers.internet ? 'Active connection' : 'Purchase a plan'}
                  </div>
                </div>
              </div>
              <Button 
                size="sm" 
                variant={activeVouchers.internet ? "outline" : "default"}
                onClick={() => navigate('/plans')}
              >
                {activeVouchers.internet ? 'Manage' : 'Buy Plan'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Power Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${activeVouchers.power ? 'bg-primary/20 text-primary' : 'bg-muted'}`}>
                  <Zap size={24} />
                </div>
                <div>
                  <div className={`font-semibold ${activeVouchers.power ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {activeVouchers.power ? 'Active' : 'Inactive'}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    {activeVouchers.power ? 'Power access active' : 'Purchase a plan'}
                  </div>
                </div>
              </div>
              <Button 
                size="sm"
                variant={activeVouchers.power ? "outline" : "default"}
                onClick={() => navigate('/plans')}
              >
                {activeVouchers.power ? 'Manage' : 'Buy Plan'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Vouchers */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold">Recent Vouchers</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/vouchers')}>
            View All
          </Button>
        </div>
        
        {recentVouchers.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentVouchers.map(({ voucher, plan }) => (
              <VoucherCard
                key={voucher.id}
                voucher={voucher}
                planName={plan!.name}
                planType={plan!.type}
                onActivate={handleActivateVoucher}
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-primary/20">
            <CardContent className="py-8 text-center">
              <CreditCard className="mx-auto text-muted-foreground mb-2" size={32} />
              <p className="text-muted-foreground text-sm md:text-base">You don't have any vouchers yet</p>
              <Button variant="link" onClick={() => navigate('/plans')}>
                Purchase your first plan
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Nearby Hotspots */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold">Nearby dePIN Nodes</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/hotspots')}>
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nearbyHotspots.map(hotspot => (
            <Card key={hotspot.id} className="border-primary/10">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">{hotspot.name}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-4">{hotspot.location}</p>
                <div className="flex flex-wrap gap-2">
                  {hotspot.services.includes('internet') && (
                    <div className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-medium">Internet</div>
                  )}
                  {hotspot.services.includes('power') && (
                    <div className="bg-accent/80 text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">Power</div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
