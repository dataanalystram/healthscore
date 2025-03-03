import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface CustomerSegment {
  name: string;
  count: number;
  percentage: number;
  status: "healthy" | "at-risk" | "churned" | "unknown";
  description: string;
}

interface CustomerSegmentationProps {
  segments?: CustomerSegment[];
  randomize?: boolean;
}

const CustomerSegmentation = ({
  segments = [],
  randomize = false,
}: CustomerSegmentationProps) => {
  // Default segments if none provided
  const defaultSegments: CustomerSegment[] = [
    {
      name: "Power Users",
      count: 42,
      percentage: 28,
      status: "healthy",
      description: "High usage across all features, regular engagement",
    },
    {
      name: "Steady Adopters",
      count: 37,
      percentage: 25,
      status: "healthy",
      description: "Consistent usage patterns, good feature adoption",
    },
    {
      name: "Occasional Users",
      count: 31,
      percentage: 21,
      status: "at-risk",
      description: "Irregular usage patterns, limited feature adoption",
    },
    {
      name: "New Customers",
      count: 18,
      percentage: 12,
      status: "unknown",
      description: "Recently onboarded, establishing usage patterns",
    },
    {
      name: "Declining Usage",
      count: 14,
      percentage: 9,
      status: "at-risk",
      description: "Decreasing engagement over last 30 days",
    },
    {
      name: "Critical Attention",
      count: 8,
      percentage: 5,
      status: "churned",
      description: "No activity in 30+ days, multiple support issues",
    },
  ];

  // Use provided segments or defaults
  const displaySegments = segments.length > 0 ? segments : defaultSegments;

  // Randomize values if requested
  const finalSegments = randomize
    ? displaySegments.map((segment) => ({
        ...segment,
        count: Math.floor(Math.random() * 50) + 5,
        percentage: Math.floor(Math.random() * 30) + 5,
      }))
    : displaySegments;

  // Get status icon based on segment status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "at-risk":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "churned":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <ArrowRight className="h-4 w-4 text-blue-500" />;
    }
  };

  // Get status color based on segment status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100";
      case "at-risk":
        return "bg-amber-100";
      case "churned":
        return "bg-red-100";
      default:
        return "bg-blue-100";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Customer Segmentation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {finalSegments.map((segment, index) => (
            <div
              key={index}
              className={`p-3 rounded-md ${getStatusColor(segment.status)}`}
            >
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  {getStatusIcon(segment.status)}
                  <span className="font-medium ml-2">{segment.name}</span>
                </div>
                <div className="text-sm font-medium">
                  {segment.count} ({segment.percentage}%)
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {segment.description}
              </p>
              <div className="mt-2 h-1.5 w-full bg-white rounded-full overflow-hidden">
                <div
                  className={`h-full ${segment.status === "healthy" ? "bg-green-500" : segment.status === "at-risk" ? "bg-amber-500" : segment.status === "churned" ? "bg-red-500" : "bg-blue-500"}`}
                  style={{ width: `${segment.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerSegmentation;
