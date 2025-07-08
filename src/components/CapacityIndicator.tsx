
import { HotspotCapacity } from "@/contexts/PlanContext";
import { cn } from "@/lib/utils";
import { Users, Clock } from "lucide-react";

type CapacityIndicatorProps = {
  capacity: HotspotCapacity;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
};

const CapacityIndicator = ({ 
  capacity, 
  size = 'md', 
  showDetails = false 
}: CapacityIndicatorProps) => {
  const { currentUsers, maxUsers, utilizationRate, queueLength } = capacity;

  const getStatusColor = (rate: number) => {
    if (rate >= 90) return 'text-red-600 bg-red-100';
    if (rate >= 70) return 'text-amber-600 bg-amber-100';
    if (rate >= 50) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusText = (rate: number) => {
    if (rate >= 90) return 'At Capacity';
    if (rate >= 70) return 'Busy';
    if (rate >= 50) return 'Moderate';
    return 'Available';
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full",
        getStatusColor(utilizationRate),
        sizeClasses[size]
      )}>
        <Users size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} />
        <span className="font-medium">
          {currentUsers}/{maxUsers}
        </span>
      </div>

      {showDetails && (
        <div className="flex items-center gap-2 text-silver-600">
          <span className={cn("font-medium", sizeClasses[size])}>
            {getStatusText(utilizationRate)}
          </span>
          {queueLength > 0 && (
            <div className="flex items-center gap-1 text-amber-600">
              <Clock size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} />
              <span className={cn("text-xs", sizeClasses[size])}>
                {queueLength} waiting
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CapacityIndicator;
