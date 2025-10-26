import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Zap, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type AIInsightsProps = {
  performanceScore?: number;
  predictedUptime?: number;
  riskFactors?: string[];
  recommendations?: string[];
  loading?: boolean;
};

const AIInsights = ({
  performanceScore = 0,
  predictedUptime = 0,
  riskFactors = [],
  recommendations = [],
  loading = false
}: AIInsightsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            AI Network Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Analyzing network data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Network Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Performance Score</span>
              <span className={`text-2xl font-bold ${getScoreColor(performanceScore)}`}>
                {performanceScore}
              </span>
            </div>
            <Progress value={performanceScore} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Predicted Uptime (7d)
              </span>
              <span className="text-2xl font-bold text-green-500">
                {predictedUptime}%
              </span>
            </div>
            <Progress value={predictedUptime} className="h-2" />
          </div>
        </div>

        {/* Risk Factors */}
        {riskFactors.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Risk Factors
            </h4>
            <div className="flex flex-wrap gap-2">
              {riskFactors.map((risk, index) => (
                <Badge key={index} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  {risk}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-1">
              <Zap className="h-4 w-4 text-primary" />
              AI Recommendations
            </h4>
            <ul className="space-y-1.5">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsights;
