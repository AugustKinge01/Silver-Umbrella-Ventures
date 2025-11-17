
import { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlanType, usePlans } from "@/contexts/PlanContext";
import PlanCard from "@/components/PlanCard";
import PaymentModal from "@/components/PaymentModal";
import plansGraphicImage from "@/assets/plans-graphic.jpg";

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
      {/* Plans hero section */}
      <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-8 mb-8 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={plansGraphicImage} 
            alt="Internet and power plans visualization"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70"></div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-bold mb-3">Choose Your Perfect Plan</h1>
          <p className="text-lg text-muted-foreground">Affordable internet and power solutions for your community</p>
        </div>
      </div>

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
