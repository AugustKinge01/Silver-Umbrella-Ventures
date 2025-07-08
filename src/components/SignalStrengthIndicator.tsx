
import { Wifi, WifiOff } from "lucide-react";
import { SignalStrength } from "@/contexts/PlanContext";
import { cn } from "@/lib/utils";

type SignalStrengthIndicatorProps = {
  signalStrength?: SignalStrength;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const SignalStrengthIndicator = ({ 
  signalStrength, 
  showText = false, 
  size = 'md' 
}: SignalStrengthIndicatorProps) => {
  if (!signalStrength) {
    return (
      <div className="flex items-center gap-1 text-silver-400">
        <WifiOff size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        {showText && <span className="text-xs">No Signal</span>}
      </div>
    );
  }

  const { level, quality, rssi } = signalStrength;

  const colorClasses = {
    'excellent': 'text-green-600',
    'good': 'text-green-500',
    'fair': 'text-amber-500',
    'poor': 'text-red-500',
    'no-signal': 'text-silver-400',
  };

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {/* Signal strength bars */}
        <div className="flex items-end gap-0.5">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={cn(
                "w-1 bg-current transition-colors",
                bar <= level ? colorClasses[quality] : "text-silver-200",
                size === 'sm' ? 'h-2' : size === 'lg' ? 'h-4' : 'h-3',
                bar === 1 && (size === 'sm' ? 'h-1' : size === 'lg' ? 'h-2' : 'h-1.5'),
                bar === 2 && (size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2'),
                bar === 3 && (size === 'sm' ? 'h-2' : size === 'lg' ? 'h-3.5' : 'h-2.5'),
              )}
            />
          ))}
        </div>
        
        {/* WiFi icon for context */}
        {level > 0 ? (
          <Wifi 
            size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} 
            className={colorClasses[quality]} 
          />
        ) : (
          <WifiOff 
            size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} 
            className="text-silver-400" 
          />
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={cn("text-xs font-medium capitalize", colorClasses[quality])}>
            {quality.replace('-', ' ')}
          </span>
          <span className="text-xs text-silver-500">
            {rssi} dBm
          </span>
        </div>
      )}
    </div>
  );
};

export default SignalStrengthIndicator;
