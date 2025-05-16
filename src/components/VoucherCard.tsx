
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Voucher } from "@/contexts/PlanContext";

type VoucherCardProps = {
  voucher: Voucher;
  planName: string;
  planType: 'internet' | 'power';
  onActivate: (voucherId: string) => void;
};

const VoucherCard = ({ voucher, planName, planType, onActivate }: VoucherCardProps) => {
  const [remainingMinutes, setRemainingMinutes] = useState(voucher.remainingTime || 0);
  const [progress, setProgress] = useState(100);

  // Update remaining time every minute if voucher is active
  useEffect(() => {
    if (voucher.isActive && voucher.expiresAt) {
      const interval = setInterval(() => {
        const now = new Date();
        const expiresAt = new Date(voucher.expiresAt!);
        
        if (now >= expiresAt) {
          setRemainingMinutes(0);
          setProgress(0);
          clearInterval(interval);
        } else {
          const totalDurationMinutes = voucher.remainingTime || 0;
          const remainingMs = expiresAt.getTime() - now.getTime();
          const remainingMins = Math.floor(remainingMs / (1000 * 60));
          
          setRemainingMinutes(remainingMins);
          setProgress(Math.round((remainingMins / totalDurationMinutes) * 100));
        }
      }, 60000); // Update every minute
      
      // Initial calculation
      const now = new Date();
      const expiresAt = new Date(voucher.expiresAt);
      const totalDurationMinutes = voucher.remainingTime || 0;
      const remainingMs = expiresAt.getTime() - now.getTime();
      const remainingMins = Math.max(0, Math.floor(remainingMs / (1000 * 60)));
      
      setRemainingMinutes(remainingMins);
      setProgress(Math.round((remainingMins / totalDurationMinutes) * 100));
      
      return () => clearInterval(interval);
    }
  }, [voucher]);

  const formatTimeRemaining = (minutes: number) => {
    if (minutes <= 0) return "Expired";
    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const mins = minutes % 60;
    
    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    }
    if (hours > 0) {
      return `${hours}h ${mins}m remaining`;
    }
    return `${mins}m remaining`;
  };

  const planTypeColor = planType === 'internet' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600';
  const isExpired = voucher.isActive && remainingMinutes <= 0;
  
  return (
    <Card className={`${isExpired ? 'opacity-70' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${planTypeColor}`}>
            {planType === 'internet' ? 'Internet' : 'Power'}
          </div>
          
          {voucher.isActive ? (
            <div className={`px-3 py-1 rounded-full text-xs font-medium 
              ${isExpired ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {isExpired ? 'Expired' : 'Active'}
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-600">
              Not Active
            </div>
          )}
        </div>
        <CardTitle className="text-lg font-bold">{planName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-silver-50 p-3 rounded-lg flex items-center justify-center mb-4">
          <span className="font-mono text-lg font-semibold">{voucher.code}</span>
        </div>
        
        {voucher.isActive && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-silver-600">Time Remaining</span>
              <span className="font-medium">{formatTimeRemaining(remainingMinutes)}</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!voucher.isActive && (
          <Button 
            className="w-full" 
            onClick={() => onActivate(voucher.id)}
          >
            Activate Voucher
          </Button>
        )}
        {voucher.isActive && isExpired && (
          <p className="text-sm text-center w-full text-silver-600">
            This voucher has expired
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default VoucherCard;
