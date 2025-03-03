import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, BarChart3 } from "lucide-react";

interface WeightedMeasure {
  id: string;
  name: string;
  weight: number;
  impact: number;
  category: string;
  description: string;
}

interface WeightDistributionChartProps {
  weights: WeightedMeasure[];
  title?: string;
  showCategories?: boolean;
}

const WeightDistributionChart = ({
  weights,
  title = "Weight Distribution",
  showCategories = true,
}: WeightDistributionChartProps) => {
  // Group weights by category if showCategories is true
  const categoryWeights = showCategories
    ? weights.reduce(
        (acc, measure) => {
          acc[measure.category] = (acc[measure.category] || 0) + measure.weight;
          return acc;
        },
        {} as Record<string, number>,
      )
    : {};

  // Calculate total for percentage
  const total = weights.reduce((sum, measure) => sum + measure.weight, 0);

  // Generate colors for the chart segments
  const getColor = (index: number, isCategory = false) => {
    const colors = isCategory
      ? ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
      : ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#e879f9"];
    return colors[index % colors.length];
  };

  // Sort weights by value for better visualization
  const sortedWeights = [...weights].sort((a, b) => b.weight - a.weight);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieChart className="mr-2 h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {/* SVG Pie Chart */}
          <div className="relative w-48 h-48 mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Create pie chart segments */}
              {
                sortedWeights.reduce(
                  (acc, measure, index) => {
                    const percentage = (measure.weight / total) * 100;
                    const startAngle = acc.currentAngle;
                    const endAngle = startAngle + percentage * 3.6; // 3.6 = 360/100

                    // Calculate SVG arc path
                    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                    const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                    const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

                    // Determine if the arc should be drawn the long way around
                    const largeArcFlag = percentage > 50 ? 1 : 0;

                    // Create the SVG path
                    const path = `
                    M 50 50
                    L ${x1} ${y1}
                    A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
                    Z
                  `;

                    acc.paths.push(
                      <path
                        key={measure.id}
                        d={path}
                        fill={getColor(index)}
                        stroke="white"
                        strokeWidth="1"
                      />,
                    );

                    acc.currentAngle = endAngle;
                    return acc;
                  },
                  { paths: [] as React.ReactNode[], currentAngle: 0 },
                ).paths
              }
              {/* Center circle for donut chart effect */}
              <circle cx="50" cy="50" r="25" fill="white" />
              {/* Display total in center */}
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fontWeight="bold"
              >
                {total}%
              </text>
            </svg>
          </div>

          {/* Legend */}
          <div className="w-full space-y-2">
            {showCategories ? (
              // Show category-based legend
              <>
                <h4 className="text-sm font-medium mb-2">By Category</h4>
                {Object.entries(categoryWeights).map(
                  ([category, weight], index) => (
                    <div
                      key={category}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: getColor(index, true) }}
                        ></div>
                        <span className="text-sm">{category}</span>
                      </div>
                      <span className="text-sm font-medium">{weight}%</span>
                    </div>
                  ),
                )}
                <div className="border-t my-3"></div>
              </>
            ) : null}

            {/* Individual measures legend */}
            <h4 className="text-sm font-medium mb-2">By Measure</h4>
            {sortedWeights.map((measure, index) => (
              <div
                key={measure.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: getColor(index) }}
                  ></div>
                  <span className="text-sm truncate max-w-[180px]">
                    {measure.name}
                  </span>
                </div>
                <span className="text-sm font-medium">{measure.weight}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightDistributionChart;
