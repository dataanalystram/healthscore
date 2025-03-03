import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Brain, Zap } from "lucide-react";

interface ModelPerformanceProps {
  accuracy: number;
  predictedChurnReduction: number;
  randomize?: boolean;
}

const ModelPerformanceMetrics = ({
  accuracy,
  predictedChurnReduction,
  randomize = false,
}: ModelPerformanceProps) => {
  // If randomize is true, generate random values
  const displayAccuracy = randomize
    ? Math.floor(Math.random() * 5) + 95
    : accuracy;
  const displayReduction = randomize
    ? Math.floor(Math.random() * 15) + 15
    : predictedChurnReduction;

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5 text-blue-500" />
          AI Optimization Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-muted-foreground mb-1">Accuracy</div>
            <div className="text-3xl font-bold text-green-600">
              {displayAccuracy}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Deep Learning Ensemble model performance
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-muted-foreground mb-1">
              Predicted Churn Reduction
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {displayReduction}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Based on historical data
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-muted-foreground mb-1">
              Key Driver Impact
            </div>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Zap key={star} className="h-5 w-5 text-yellow-500" />
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Usage metrics most significant
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            AI-Generated Key Insights
          </h3>
          <ul className="space-y-2">
            {[
              randomize
                ? `${["Product Usage Frequency", "Feature Adoption Rate", "Time Since Last Login"][Math.floor(Math.random() * 3)]} is the strongest predictor of customer health`
                : "Product Usage Frequency is the strongest predictor of customer health",
              randomize
                ? `${["NPS Score", "Contract Value"][Math.floor(Math.random() * 2)]} has less predictive value than expected`
                : "NPS Score has less predictive value than expected",
              "Usage metrics are more important than satisfaction metrics",
              "Early warning indicators can identify at-risk customers before churn",
              "Deep learning models outperform traditional ML by 27%",
              "Transformer-based models excel at detecting subtle usage patterns",
            ].map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 h-5 w-5 text-xs mr-2 mt-0.5">
                  {index + 1}
                </span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelPerformanceMetrics;
