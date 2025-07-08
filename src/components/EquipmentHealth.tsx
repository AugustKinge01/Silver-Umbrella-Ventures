
import { EquipmentHealth as EquipmentHealthType } from "@/contexts/PlanContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Battery, Thermometer, Zap, Sun, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type EquipmentHealthProps = {
  health: EquipmentHealthType;
  compact?: boolean;
};

const EquipmentHealth = ({ health, compact = false }: EquipmentHealthProps) => {
  const {
    temperature,
    batteryLevel,
    solarGeneration,
    powerConsumption,
    uptime,
    lastMaintenance,
  } = health;

  const getBatteryColor = (level: number) => {
    if (level >= 80) return 'text-green-600';
    if (level >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 45) return 'text-red-600';
    if (temp >= 35) return 'text-amber-600';
    return 'text-green-600';
  };

  const formatUptime = (hours: number) => {
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };

  const daysSinceMaintenancee = Math.floor(
    (Date.now() - lastMaintenance.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Battery size={16} className={getBatteryColor(batteryLevel)} />
          <span>{batteryLevel}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Thermometer size={16} className={getTemperatureColor(temperature)} />
          <span>{temperature}°C</span>
        </div>
        <div className="flex items-center gap-1">
          <Sun size={16} className="text-yellow-600" />
          <span>{solarGeneration}W</span>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Equipment Health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Battery size={16} className={getBatteryColor(batteryLevel)} />
              <span className="text-sm">Battery</span>
            </div>
            <span className={cn("font-medium", getBatteryColor(batteryLevel))}>
              {batteryLevel}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer size={16} className={getTemperatureColor(temperature)} />
              <span className="text-sm">Temperature</span>
            </div>
            <span className={cn("font-medium", getTemperatureColor(temperature))}>
              {temperature}°C
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun size={16} className="text-yellow-600" />
              <span className="text-sm">Solar Gen</span>
            </div>
            <span className="font-medium text-yellow-600">
              {solarGeneration}W
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-blue-600" />
              <span className="text-sm">Consumption</span>
            </div>
            <span className="font-medium text-blue-600">
              {powerConsumption}W
            </span>
          </div>
        </div>

        <div className="pt-2 border-t space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-silver-600" />
              <span className="text-sm">Uptime</span>
            </div>
            <span className="font-medium">{formatUptime(uptime)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-silver-600">Last Maintenance</span>
            <Badge variant={daysSinceMaintenancee > 30 ? "destructive" : "outline"}>
              {daysSinceMaintenancee} days ago
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentHealth;
