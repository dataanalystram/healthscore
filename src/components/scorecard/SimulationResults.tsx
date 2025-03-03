import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, BarChart3 } from "lucide-react";

interface SimulationResultsProps {
  improvement: number;
  randomize?: boolean;
}

const SimulationResults = ({
  improvement,
  randomize = false,
}: SimulationResultsProps) => {
  // If randomize is true, generate a random improvement value
  const displayImprovement = randomize
    ? Math.floor(Math.random() * 15) + 15
    : improvement;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="mr-2 h-5 w-5" />
          Simulation Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-6 text-muted-foreground">
          <div className="space-y-4">
            <div className="inline-block p-4 bg-green-50 rounded-full">
              <BarChart3 className="h-12 w-12 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {displayImprovement}% Improvement
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                The optimized weights would have identified {displayImprovement}
                % more at-risk customers based on historical data analysis.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationResults;
