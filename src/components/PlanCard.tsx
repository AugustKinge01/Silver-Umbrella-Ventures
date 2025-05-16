
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Plan } from "@/contexts/PlanContext";

type PlanCardProps = {
  plan: Plan;
  onPurchase: (planId: string) => void;
  disabled?: boolean;
};

const PlanCard = ({ plan, onPurchase, disabled = false }: PlanCardProps) => {
  const planTypeColor = plan.type === 'internet' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600';
  
  return (
    <Card className={`relative overflow-hidden ${plan.popular ? 'border-silver-300 shadow-lg' : ''}`}>
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-silver-300 text-white px-4 py-1 text-xs font-semibold">
          Popular
        </div>
      )}
      <CardHeader>
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${planTypeColor} mb-2`}>
          {plan.type === 'internet' ? 'Internet' : 'Power'}
        </div>
        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <span className="text-3xl font-bold">₦{plan.price.toLocaleString()}</span>
          <span className="text-silver-600 ml-1 text-sm">
            / {plan.duration === 24 ? 'day' : 
               plan.duration === 168 ? 'week' : 
               `${plan.duration}h`}
          </span>
        </div>
        <p className="text-silver-600 mb-6">{plan.description}</p>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
              <span className="text-silver-700 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onPurchase(plan.id)}
          disabled={disabled}
        >
          Purchase Plan
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanCard;
