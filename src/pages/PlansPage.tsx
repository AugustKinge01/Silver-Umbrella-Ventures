
import { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlanType, usePlans } from "@/contexts/PlanContext";
import PlanCard from "@/components/PlanCard";
import PaymentModal from "@/components/PaymentModal";

const PlansPage = () => {
  const { plans, purchasePlan, isLoading } = usePlans();
  
  const [planType, setPlanType] = useState<PlanType>('internet');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  const filteredPlans = plans.filter(plan => plan.type === planType);
  const selectedPlan = plans.find(plan => plan.id === selectedPlanId) || null;
  
  const handlePurchaseClick = (planId: string) => {
    setSelectedPlanId(planId);
    setIsPaymentModalOpen(true);
  };
  
  const handlePayment = async (paymentMethod: 'card' | 'crypto') => {
    if (!selectedPlanId) return;
    
    const voucher = await purchasePlan(selectedPlanId, paymentMethod);
    if (voucher) {
      setIsPaymentModalOpen(false);
    }
  };
  
  return (
    <Layout
      title="Internet & Power Plans"
      description="Choose a plan that fits your needs"
    >
      <Tabs defaultValue="internet" value={planType} onValueChange={(value) => setPlanType(value as PlanType)}>
        <TabsList className="mb-6">
          <TabsTrigger value="internet">Internet Plans</TabsTrigger>
          <TabsTrigger value="power">Power Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="internet">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPlans.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onPurchase={handlePurchaseClick}
                disabled={isLoading}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="power">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPlans.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onPurchase={handlePurchaseClick}
                disabled={isLoading}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plan={selectedPlan}
        onPayment={handlePayment}
        isLoading={isLoading}
      />
    </Layout>
  );
};

export default PlansPage;
