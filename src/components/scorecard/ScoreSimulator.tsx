import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, RefreshCw, Save } from "lucide-react";

interface ScoreSimulatorProps {
  initialScore?: number;
  measures?: {
    id: string;
    name: string;
    value: number;
    weight: number;
    maxValue: number;
  }[];
  onSaveScenario?: (score: number, measures: any[]) => void;
}

const ScoreSimulator = ({
  initialScore = 72,
  measures = [
    {
      id: "1",
      name: "Product Usage Frequency",
      value: 65,
      weight: 25,
      maxValue: 100,
    },
    {
      id: "2",
      name: "Support Ticket Volume",
      value: 30,
      weight: 15,
      maxValue: 100,
    },
    {
      id: "3",
      name: "Feature Adoption Rate",
      value: 55,
      weight: 20,
      maxValue: 100,
    },
    {
      id: "4",
      name: "NPS Score",
      value: 40,
      weight: 10,
      maxValue: 100,
    },
    {
      id: "5",
      name: "Contract Value",
      value: 80,
      weight: 10,
      maxValue: 100,
    },
    {
      id: "6",
      name: "Time Since Last Login",
      value: 25,
      weight: 20,
      maxValue: 100,
    },
  ],
  onSaveScenario = () => {},
}: ScoreSimulatorProps) => {
  const [simulatedMeasures, setSimulatedMeasures] = useState(measures);
  const [score, setScore] = useState(initialScore);
  const [originalScore] = useState(initialScore);
  const [scenarios, setScenarios] = useState<
    { name: string; score: number; change: number }[]
  >([
    { name: "Current State", score: initialScore, change: 0 },
    { name: "Improved Usage", score: initialScore + 8, change: 8 },
    { name: "Reduced Support Issues", score: initialScore + 5, change: 5 },
    { name: "Feature Adoption Campaign", score: initialScore + 12, change: 12 },
  ]);

  // Calculate score based on measure values and weights
  const calculateScore = (measures: typeof simulatedMeasures) => {
    return measures.reduce((total, measure) => {
      // For support tickets and login time, lower is better, so invert the value
      const normalizedValue =
        measure.id === "2" || measure.id === "6"
          ? measure.maxValue - measure.value
          : measure.value;

      return total + (normalizedValue * measure.weight) / 100;
    }, 0);
  };

  // Update a measure's value
  const updateMeasureValue = (id: string, newValue: number) => {
    const updatedMeasures = simulatedMeasures.map((measure) =>
      measure.id === id ? { ...measure, value: newValue } : measure,
    );
    setSimulatedMeasures(updatedMeasures);
    setScore(Math.round(calculateScore(updatedMeasures)));
  };

  // Reset to original values
  const resetSimulation = () => {
    setSimulatedMeasures(measures);
    setScore(initialScore);
  };

  // Save current scenario
  const saveScenario = () => {
    const scenarioName = `Scenario ${scenarios.length}`;
    const newScenario = {
      name: scenarioName,
      score: score,
      change: score - originalScore,
    };
    setScenarios([...scenarios, newScenario]);
    onSaveScenario(score, simulatedMeasures);
  };

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  // Get change indicator
  const getChangeIndicator = () => {
    const change = score - originalScore;
    if (change === 0) return null;

    return (
      <Badge
        variant={change > 0 ? "default" : "destructive"}
        className={change > 0 ? "bg-green-600" : ""}
      >
        {change > 0 ? "+" : ""}
        {change} pts
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FlaskConical className="mr-2 h-5 w-5" />
            Score Simulator
          </div>
          <div className="flex items-center space-x-2">
            {getChangeIndicator()}
            <Button variant="outline" size="sm" onClick={resetSimulation}>
              <RefreshCw className="mr-1 h-3 w-3" />
              Reset
            </Button>
            <Button size="sm" onClick={saveScenario}>
              <Save className="mr-1 h-3 w-3" />
              Save Scenario
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 text-center">
          <div className="text-4xl font-bold mb-2 flex items-center justify-center">
            <span className={getScoreColor(score)}>{score}</span>
            <span className="text-sm text-muted-foreground ml-2">/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className={`h-2.5 rounded-full ${score >= 80 ? "bg-green-600" : score >= 60 ? "bg-amber-500" : "bg-red-600"}`}
              style={{ width: `${score}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>At Risk (0-59)</span>
            <span>Moderate (60-79)</span>
            <span>Healthy (80-100)</span>
          </div>
        </div>

        <div className="space-y-6">
          {simulatedMeasures.map((measure) => (
            <div key={measure.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">{measure.name}</div>
                <div className="text-sm">{measure.value}</div>
              </div>
              <Slider
                value={[measure.value]}
                min={0}
                max={measure.maxValue}
                step={1}
                onValueChange={(value) =>
                  updateMeasureValue(measure.id, value[0])
                }
              />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Saved Scenarios</h4>
          <div className="space-y-2">
            {scenarios.map((scenario, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-muted rounded-md"
              >
                <span className="text-sm">{scenario.name}</span>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm font-medium ${getScoreColor(scenario.score)}`}
                  >
                    {scenario.score}
                  </span>
                  {scenario.change !== 0 && (
                    <Badge
                      variant={scenario.change > 0 ? "default" : "destructive"}
                      className={scenario.change > 0 ? "bg-green-600" : ""}
                    >
                      {scenario.change > 0 ? "+" : ""}
                      {scenario.change}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreSimulator;
