import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface PredictiveInsight {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  trend: "increasing" | "decreasing" | "stable";
  probability: number;
}

interface PredictiveInsightsProps {
  insights?: PredictiveInsight[];
  randomize?: boolean;
}

const PredictiveInsights = ({
  insights = [],
  randomize = false,
}: PredictiveInsightsProps) => {
  // Default insights if none provided
  const defaultInsights: PredictiveInsight[] = [
    {
      id: "1",
      title: "Potential Churn Risk Increase",
      description:
        "Enterprise segment showing early warning signs of increased churn risk in next 60 days",
      impact: "high",
      trend: "increasing",
      probability: 78,
    },
    {
      id: "2",
      title: "Feature Adoption Opportunity",
      description:
        "Mid-market customers likely to adopt premium features with targeted enablement",
      impact: "medium",
      trend: "increasing",
      probability: 65,
    },
    {
      id: "3",
      title: "Support Volume Prediction",
      description:
        "Expected 15% increase in support tickets following next product release",
      impact: "medium",
      trend: "increasing",
      probability: 82,
    },
    {
      id: "4",
      title: "Upsell Opportunity",
      description:
        "High probability of successful upsell for customers with >90% feature adoption",
      impact: "high",
      trend: "stable",
      probability: 73,
    },
    {
      id: "5",
      title: "Engagement Decline",
      description:
        "Startup segment showing decreased product usage over last 30 days",
      impact: "high",
      trend: "decreasing",
      probability: 68,
    },
  ];

  // Use provided insights or defaults
  const displayInsights = insights.length > 0 ? insights : defaultInsights;

  // Randomize values if requested
  const finalInsights = randomize
    ? displayInsights.map((insight) => ({
        ...insight,
        probability: Math.floor(Math.random() * 30) + 65,
        trend: ["increasing", "decreasing", "stable"][
          Math.floor(Math.random() * 3)
        ] as "increasing" | "decreasing" | "stable",
      }))
    : displayInsights;

  // Get impact color based on impact level
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-amber-600 bg-amber-50";
      case "low":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Get trend icon based on trend direction
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case "decreasing":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default:
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Predictive Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {finalInsights.map((insight) => (
            <div
              key={insight.id}
              className="border rounded-md p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-sm flex items-center">
                    {insight.title}
                    <span className="ml-2 flex items-center text-xs">
                      {getTrendIcon(insight.trend)}
                    </span>
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {insight.description}
                  </p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${getImpactColor(insight.impact)}`}
                  >
                    {insight.impact} impact
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="text-xs text-muted-foreground">Probability</div>
                <div className="text-xs font-medium">
                  {insight.probability}%
                </div>
              </div>
              <div className="mt-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${insight.probability > 75 ? "bg-red-500" : insight.probability > 60 ? "bg-amber-500" : "bg-blue-500"}`}
                  style={{ width: `${insight.probability}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveInsights;
