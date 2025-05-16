
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Zap, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePlans } from "@/contexts/PlanContext";
import VoucherCard from "@/components/VoucherCard";

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
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Internet Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${activeVouchers.internet ? 'bg-green-100' : 'bg-silver-100'}`}>
                  <Wifi size={20} className={activeVouchers.internet ? 'text-green-600' : 'text-silver-600'} />
                </div>
                <div>
                  <div className={`font-medium ${activeVouchers.internet ? 'text-green-600' : 'text-silver-600'}`}>
                    {activeVouchers.internet ? 'Connected' : 'Not Connected'}
                  </div>
                  <div className="text-sm text-silver-600">
                    {activeVouchers.internet ? 'You have active internet access' : 'Purchase a plan to get connected'}
                  </div>
                </div>
              </div>
              <Button 
                variant={activeVouchers.internet ? "outline" : "default"}
                onClick={() => navigate('/plans')}
                size="sm"
              >
                {activeVouchers.internet ? 'View Plans' : 'Get Connected'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Power Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${activeVouchers.power ? 'bg-green-100' : 'bg-silver-100'}`}>
                  <Zap size={20} className={activeVouchers.power ? 'text-green-600' : 'text-silver-600'} />
                </div>
                <div>
                  <div className={`font-medium ${activeVouchers.power ? 'text-green-600' : 'text-silver-600'}`}>
                    {activeVouchers.power ? 'Active' : 'Inactive'}
                  </div>
                  <div className="text-sm text-silver-600">
                    {activeVouchers.power ? 'You have active power access' : 'Purchase a plan to activate power'}
                  </div>
                </div>
              </div>
              <Button 
                variant={activeVouchers.power ? "outline" : "default"}
                onClick={() => navigate('/plans')}
                size="sm"
              >
                {activeVouchers.power ? 'View Plans' : 'Get Power'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Vouchers */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Vouchers</h2>
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
          <Card className="bg-silver-50 border-dashed">
            <CardContent className="py-8 text-center">
              <CreditCard className="mx-auto text-silver-400 mb-2" size={32} />
              <p className="text-silver-600">You don't have any vouchers yet</p>
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
          <h2 className="text-xl font-semibold">Nearby Hotspots</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/hotspots')}>
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nearbyHotspots.map(hotspot => (
            <Card key={hotspot.id}>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">{hotspot.name}</h3>
                <p className="text-sm text-silver-600 mb-4">{hotspot.location}</p>
                <div className="flex space-x-2">
                  {hotspot.services.includes('internet') && (
                    <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">Internet</div>
                  )}
                  {hotspot.services.includes('power') && (
                    <div className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">Power</div>
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
