import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain } from "lucide-react";

interface ModelTrainingProgressProps {
  onComplete: () => void;
}

const ModelTrainingProgress = ({ onComplete }: ModelTrainingProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  const stages = [
    "Loading dataset with 250 companies and multiple users per company...",
    "Preprocessing data and handling inconsistencies...",
    "Encoding categorical features and normalizing numerical data...",
    "Building neural network architecture...",
    "Training model on 80% of data...",
    "Validating model on 20% of data...",
    "Calculating feature importance using SHAP values...",
    "Generating optimized weights based on model insights...",
    "Finalizing results and preparing visualization...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }

        // Update stage based on progress
        const newStage = Math.floor(prev / (100 / stages.length));
        if (newStage !== stage) {
          setStage(newStage);
        }

        return prev + Math.random() * 3 + 1; // Random increment for more realistic progress
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete, stage, stages.length]);

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <Brain className="mr-2 h-5 w-5 animate-pulse text-primary" />
            <span className="font-medium">
              Training Machine Learning Model on 250 Company Dataset
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-sm text-muted-foreground">
            {stages[Math.min(stage, stages.length - 1)]}
          </div>
          <div className="text-xs text-right text-muted-foreground">
            {Math.min(Math.round(progress), 100)}% complete
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelTrainingProgress;
