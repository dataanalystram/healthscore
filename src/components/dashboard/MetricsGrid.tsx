import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  AlertTriangle,
  TrendingUp,
  BarChart,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  color: string;
}

const MetricCard = ({
  title = "Metric",
  value = "0",
  change = { value: "0%", isPositive: true },
  icon = <BarChart />,
  color = "bg-blue-100",
}: MetricCardProps) => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-full ${color}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center mt-1">
            {change.isPositive ? (
              <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span
              className={change.isPositive ? "text-green-500" : "text-red-500"}
            >
              {change.value}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface MetricsGridProps {
  metrics?: MetricCardProps[];
}

const MetricsGrid = ({ metrics = [] }: MetricsGridProps) => {
  // Default metrics if none provided
  const defaultMetrics: MetricCardProps[] =
    metrics.length > 0
      ? metrics
      : [
          {
            title: "Overall Health Score",
            value: "78/100",
            change: { value: "3.2%", isPositive: true },
            icon: <BarChart className="w-5 h-5 text-blue-600" />,
            color: "bg-blue-100",
          },
          {
            title: "At-Risk Customers",
            value: "12",
            change: { value: "2.1%", isPositive: false },
            icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
            color: "bg-amber-100",
          },
          {
            title: "Growth Opportunities",
            value: "24",
            change: { value: "5.3%", isPositive: true },
            icon: <TrendingUp className="w-5 h-5 text-green-600" />,
            color: "bg-green-100",
          },
          {
            title: "Recent Changes",
            value: "18",
            change: { value: "1.8%", isPositive: true },
            icon: <BarChart className="w-5 h-5 text-purple-600" />,
            color: "bg-purple-100",
          },
        ];

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {defaultMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default MetricsGrid;
