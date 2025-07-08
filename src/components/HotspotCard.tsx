
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Wifi, Zap } from "lucide-react";
import { Hotspot } from "@/contexts/PlanContext";
import SignalStrengthIndicator from "./SignalStrengthIndicator";

type HotspotCardProps = {
  hotspot: Hotspot;
};

const HotspotCard = ({ hotspot }: HotspotCardProps) => {
  const statusColors = {
    active: "bg-green-100 text-green-600",
    inactive: "bg-red-100 text-red-600",
    maintenance: "bg-amber-100 text-amber-600",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[hotspot.status]}`}>
            {hotspot.status === "active" ? "Online" : 
             hotspot.status === "inactive" ? "Offline" : "Under Maintenance"}
          </div>
          
          {/* Signal strength indicator */}
          {hotspot.services.includes("internet") && (
            <SignalStrengthIndicator 
              signalStrength={hotspot.signalStrength} 
              size="sm"
            />
          )}
        </div>
        <CardTitle className="text-lg font-bold">{hotspot.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-2 mb-4">
          <MapPin size={16} className="text-silver-600 mt-1 flex-shrink-0" />
          <span className="text-silver-700">{hotspot.location}</span>
        </div>
        
        <div className="flex items-center space-x-3 mb-4">
          {hotspot.services.includes("internet") && (
            <Badge variant="outline" className="flex items-center space-x-1">
              <Wifi size={14} />
              <span>Internet</span>
            </Badge>
          )}
          {hotspot.services.includes("power") && (
            <Badge variant="outline" className="flex items-center space-x-1">
              <Zap size={14} />
              <span>Power</span>
            </Badge>
          )}
        </div>
        
        {/* Detailed signal info for internet hotspots */}
        {hotspot.services.includes("internet") && hotspot.signalStrength && (
          <div className="mb-4 p-3 bg-silver-50 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-silver-700">Signal Quality</span>
              <SignalStrengthIndicator 
                signalStrength={hotspot.signalStrength} 
                showText={true}
                size="sm"
              />
            </div>
          </div>
        )}
        
        {hotspot.distance && (
          <div className="text-sm text-silver-600">
            Approximately {hotspot.distance.toFixed(1)} km away
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HotspotCard;
