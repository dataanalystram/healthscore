import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Code,
  Cpu,
  Database,
  FlaskConical,
  Lightbulb,
  BarChart3,
} from "lucide-react";

// Import ML core modules
import { initializeMLPipeline } from "@/ml";

interface MLCoreProps {
  onInitialized?: (mlCore: any) => void;
}

const MLCore: React.FC<MLCoreProps> = ({ onInitialized }) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mlCore, setMlCore] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [sampleResult, setSampleResult] = useState<any>(null);

  // Initialize ML pipeline
  useEffect(() => {
    if (!mlCore && !isInitializing) {
      initializeMLCore();
    }
  }, [mlCore, isInitializing]);

  const initializeMLCore = async () => {
    setIsInitializing(true);
    setProgress(0);

    // Simulate initialization progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    try {
      // Initialize ML pipeline
      const core = initializeMLPipeline();

      // Generate a sample scoring result
      const sampleCustomer = core.scorer.createSampleCustomer();
      const result = core.scorer.scoreCustomer(sampleCustomer);

      // Set state
      setMlCore(core);
      setSampleResult(result);

      // Notify parent component
      if (onInitialized) {
        onInitialized(core);
      }
    } catch (error) {
      console.error("Error initializing ML core:", error);
    } finally {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setIsInitializing(false), 500);
    }
  };

  if (isInitializing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5 animate-pulse text-primary" />
            Initializing ML Core
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="text-sm text-muted-foreground">
            {progress < 30 && "Loading ML modules..."}
            {progress >= 30 && progress < 60 && "Initializing models..."}
            {progress >= 60 &&
              progress < 90 &&
              "Setting up scoring pipeline..."}
            {progress >= 90 && "Finalizing initialization..."}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Cpu className="mr-2 h-5 w-5" />
            ML Core Components
          </div>
          <Button variant="outline" size="sm" onClick={initializeMLCore}>
            Reinitialize
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              <Database className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="sample">
              <FlaskConical className="mr-2 h-4 w-4" />
              Sample Result
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="mr-2 h-4 w-4" />
              Usage Example
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center mb-2">
                  <Database className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="font-medium">Data Preprocessor</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Handles data cleaning, normalization, and feature engineering
                  for customer data.
                </p>
              </div>

              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center mb-2">
                  <Brain className="h-5 w-5 text-purple-500 mr-2" />
                  <h3 className="font-medium">Model Trainer</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Trains and evaluates machine learning models for churn
                  prediction.
                </p>
              </div>

              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center mb-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                  <h3 className="font-medium">Model Explainer</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Provides explanations for model predictions using SHAP-like
                  approaches.
                </p>
              </div>

              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center mb-2">
                  <BarChart3 className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="font-medium">Score Optimizer</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Optimizes health score calculation parameters using various
                  techniques.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sample" className="space-y-4 pt-4">
            {sampleResult ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Sample Customer Score</h3>
                  <Badge
                    variant={
                      sampleResult.score > 70
                        ? "default"
                        : sampleResult.score > 30
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {sampleResult.score.toFixed(1)}/100
                  </Badge>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className={`h-2.5 rounded-full ${sampleResult.score > 70 ? "bg-green-500" : sampleResult.score > 30 ? "bg-yellow-500" : "bg-red-500"}`}
                    style={{ width: `${sampleResult.score}%` }}
                  ></div>
                </div>

                <div className="border rounded-md p-4 bg-gray-50">
                  <h4 className="font-medium mb-2">Explanation</h4>
                  <pre className="text-xs whitespace-pre-wrap">
                    {sampleResult.explanation}
                  </pre>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    if (mlCore) {
                      const sampleCustomer =
                        mlCore.scorer.createSampleCustomer();
                      const result =
                        mlCore.scorer.scoreCustomer(sampleCustomer);
                      setSampleResult(result);
                    }
                  }}
                >
                  Generate New Sample
                </Button>
              </div>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                No sample result available. Please reinitialize the ML core.
              </div>
            )}
          </TabsContent>

          <TabsContent value="code" className="space-y-4 pt-4">
            <div className="border rounded-md p-4 bg-gray-50">
              <h3 className="font-medium mb-2">Usage Example</h3>
              <pre className="text-xs overflow-auto p-2 bg-gray-900 text-gray-100 rounded">
                {`// Import ML core modules
import { initializeMLPipeline } from '@/ml';

// Initialize the ML pipeline
const {
  preprocessor,
  trainer,
  explainer,
  optimizer,
  scorer
} = initializeMLPipeline();

// Create a customer to score
const customer = {
  productUsageFrequency: 0.75,
  supportTicketVolume: 0.2,
  featureAdoptionRate: 0.8,
  npsScore: 0.9,
  contractValue: 0.6,
  timeSinceLastLogin: 0.1
};

// Score the customer
const result = scorer.scoreCustomer(customer);

// Access the score and explanation
console.log(\`Score: \${result.score}\`);
console.log(result.explanation);

// Optimize weights using Bayesian optimization
const optimizedWeights = optimizer.optimizeWeightsBayesian(
  sampleData,
  'churn',
  50 // number of trials
);

// Set up an A/B test
const testConfig = optimizer.setupABTest(
  'weight_optimization_test',
  [
    { name: 'control', weights: optimizer.featureWeights },
    { name: 'optimized', weights: optimizedWeights }
  ],
  [50, 50] // allocation percentages
);
`}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MLCore;
