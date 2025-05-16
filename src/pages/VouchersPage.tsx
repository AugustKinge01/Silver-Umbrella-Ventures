
import { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlanType, usePlans } from "@/contexts/PlanContext";
import VoucherCard from "@/components/VoucherCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";

const VouchersPage = () => {
  const navigate = useNavigate();
  const { plans, vouchers, activateVoucher } = usePlans();
  const [filterType, setFilterType] = useState<PlanType | 'all'>('all');
  
  // Filter and map vouchers
  const filteredVouchers = vouchers
    .filter(voucher => {
      if (filterType === 'all') return true;
      const plan = plans.find(p => p.id === voucher.planId);
      return plan?.type === filterType;
    })
    .map(voucher => {
      const plan = plans.find(p => p.id === voucher.planId);
      return {
        voucher,
        planName: plan?.name || 'Unknown Plan',
        planType: plan?.type || 'internet'
      };
    });
    
  const activeVouchers = filteredVouchers.filter(item => 
    item.voucher.isActive && 
    item.voucher.expiresAt && 
    new Date(item.voucher.expiresAt) > new Date()
  );
  
  const expiredVouchers = filteredVouchers.filter(item => 
    item.voucher.isActive && 
    (!item.voucher.expiresAt || new Date(item.voucher.expiresAt) <= new Date())
  );
  
  const inactiveVouchers = filteredVouchers.filter(item => !item.voucher.isActive);
  
  const handleActivateVoucher = async (voucherId: string) => {
    await activateVoucher(voucherId);
  };
  
  return (
    <Layout
      title="My Vouchers"
      description="Manage your internet and power vouchers"
    >
      <Tabs defaultValue="all" value={filterType} onValueChange={(value) => setFilterType(value as PlanType | 'all')}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Vouchers</TabsTrigger>
          <TabsTrigger value="internet">Internet Only</TabsTrigger>
          <TabsTrigger value="power">Power Only</TabsTrigger>
        </TabsList>
        
        <TabsContent value={filterType}>
          {filteredVouchers.length === 0 ? (
            <Card className="bg-silver-50 border-dashed">
              <CardContent className="py-8 text-center">
                <CreditCard className="mx-auto text-silver-400 mb-2" size={32} />
                <p className="text-silver-600">You don't have any vouchers yet</p>
                <Button variant="link" onClick={() => navigate('/plans')}>
                  Purchase your first plan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {activeVouchers.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Active Vouchers</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {activeVouchers.map(({ voucher, planName, planType }) => (
                      <VoucherCard
                        key={voucher.id}
                        voucher={voucher}
                        planName={planName}
                        planType={planType as PlanType}
                        onActivate={handleActivateVoucher}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {inactiveVouchers.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Unused Vouchers</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {inactiveVouchers.map(({ voucher, planName, planType }) => (
                      <VoucherCard
                        key={voucher.id}
                        voucher={voucher}
                        planName={planName}
                        planType={planType as PlanType}
                        onActivate={handleActivateVoucher}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {expiredVouchers.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Expired Vouchers</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {expiredVouchers.map(({ voucher, planName, planType }) => (
                      <VoucherCard
                        key={voucher.id}
                        voucher={voucher}
                        planName={planName}
                        planType={planType as PlanType}
                        onActivate={handleActivateVoucher}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default VouchersPage;
