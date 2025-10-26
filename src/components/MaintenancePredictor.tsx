import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Battery, Sun, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type PredictedIssue = {
  component: string;
  issue: string;
  probability: number;
  timeframe: string;
};

type MaintenancePredictorProps = {
  overallHealth?: number;
  maintenancePriority?: "low" | "medium" | "high" | "critical";
  predictedIssues?: PredictedIssue[];
  solarForecast?: {
    nextWeekGeneration: number;
    efficiency: number;
    weatherImpact: string;
  };
  loading?: boolean;
};

const MaintenancePredictor = ({
  overallHealth = 0,
  maintenancePriority = "low",
  predictedIssues = [],
  solarForecast,
  loading = false
}: MaintenancePredictorProps) => {
  const priorityColors = {
    low: "bg-green-100 text-green-700 border-green-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    critical: "bg-red-100 text-red-700 border-red-200"
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return "text-green-500";
    if (health >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 animate-pulse" />
            Predictive Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Analyzing equipment health...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-green-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Predictive Maintenance
          </span>
          <Badge className={priorityColors[maintenancePriority]}>
            {maintenancePriority.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Health */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Health</span>
            <span className={`text-2xl font-bold ${getHealthColor(overallHealth)}`}>
              {overallHealth}%
            </span>
          </div>
          <Progress value={overallHealth} className="h-2" />
        </div>

        {/* Solar Forecast */}
        {solarForecast && (
          <div className="bg-white/50 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-1">
              <Sun className="h-4 w-4 text-yellow-500" />
              7-Day Solar Forecast
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Expected Generation</p>
                <p className="text-lg font-bold">{solarForecast.nextWeekGeneration} kWh</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Panel Efficiency</p>
                <p className="text-lg font-bold">{solarForecast.efficiency}%</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{solarForecast.weatherImpact}</p>
          </div>
        )}

        {/* Predicted Issues */}
        {predictedIssues.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              Predicted Issues
            </h4>
            {predictedIssues.map((issue, index) => (
              <div key={index} className="bg-white/50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{issue.component}</span>
                  <Badge variant="outline" className="text-xs">
                    {issue.probability}% probability
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{issue.issue}</p>
                <p className="text-xs text-muted-foreground">Timeframe: {issue.timeframe}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaintenancePredictor;
