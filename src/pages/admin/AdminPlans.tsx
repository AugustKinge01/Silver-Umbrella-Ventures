
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { usePlans, Plan, PlanType } from "@/contexts/PlanContext";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const AdminPlans = () => {
  const { plans } = usePlans();
  const [planType, setPlanType] = useState<PlanType>('internet');
  
  const filteredPlans = plans.filter(plan => plan.type === planType);
  
  const handleEditPlan = (planId: string) => {
    // In a real app, this would open a modal to edit the plan
    toast({
      title: "Feature Not Implemented",
      description: "This would open a modal to edit the plan details.",
    });
  };
  
  const handleDeactivatePlan = (planId: string) => {
    // In a real app, this would deactivate the plan
    toast({
      title: "Feature Not Implemented",
      description: "This would deactivate the plan in Supabase.",
    });
  };
  
  const handleAddPlan = () => {
    // In a real app, this would open a modal to add a new plan
    toast({
      title: "Feature Not Implemented",
      description: "This would open a modal to add a new plan.",
    });
  };

  return (
    <Layout
      title="Manage Plans"
      description="Create and edit service plans"
    >
      <div className="flex justify-end mb-6">
        <Button onClick={handleAddPlan}>Add New Plan</Button>
      </div>
      
      <Tabs defaultValue="internet" value={planType} onValueChange={(value) => setPlanType(value as PlanType)}>
        <TabsList className="mb-6">
          <TabsTrigger value="internet">Internet Plans</TabsTrigger>
          <TabsTrigger value="power">Power Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value={planType}>
          <Card>
            <CardHeader>
              <CardTitle>{planType === 'internet' ? 'Internet' : 'Power'} Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Description</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Duration</th>
                      <th className="text-left py-3 px-4">Popular</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlans.map(plan => (
                      <tr key={plan.id} className="border-b hover:bg-silver-50">
                        <td className="py-4 px-4">{plan.name}</td>
                        <td className="py-4 px-4 max-w-[200px] truncate">{plan.description}</td>
                        <td className="py-4 px-4">₦{plan.price.toLocaleString()}</td>
                        <td className="py-4 px-4">
                          {plan.duration === 24 ? '24 hours' : 
                           plan.duration === 168 ? '7 days' : 
                           `${plan.duration} hours`}
                        </td>
                        <td className="py-4 px-4">
                          {plan.popular ? (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Yes
                            </span>
                          ) : (
                            <span className="bg-silver-100 text-silver-800 text-xs px-2 py-1 rounded-full">
                              No
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditPlan(plan.id)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-500" onClick={() => handleDeactivatePlan(plan.id)}>
                            Deactivate
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default AdminPlans;
