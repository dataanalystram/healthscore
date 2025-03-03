import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface ShapValueProps {
  featureValues: Record<string, number>;
  randomize?: boolean;
}

const ShapValueExplainer = ({
  featureValues,
  randomize = false,
}: ShapValueProps) => {
  // If randomize is true, generate random values for each feature
  const values = randomize
    ? Object.keys(featureValues).reduce(
        (acc, key) => {
          acc[key] = Math.random();
          return acc;
        },
        {} as Record<string, number>,
      )
    : featureValues;

  // Sort features by importance
  const sortedFeatures = Object.entries(values).sort((a, b) => b[1] - a[1]);

  // Normalize values to sum to 1
  const total = sortedFeatures.reduce((sum, [_, value]) => sum + value, 0);
  const normalizedFeatures = sortedFeatures.map(([name, value]) => [
    name,
    value / total,
  ]);

  // Format feature names for display
  const formatFeatureName = (name: string) => {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/([a-z])([A-Z])/g, "$1 $2");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5" />
          SHAP Value Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {normalizedFeatures.map(([feature, value]) => (
            <div key={feature} className="flex items-center">
              <div className="w-40 truncate">
                {formatFeatureName(feature as string)}
              </div>
              <div className="flex-1 ml-2">
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(value as number) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 text-right">
                {((value as number) * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShapValueExplainer;
