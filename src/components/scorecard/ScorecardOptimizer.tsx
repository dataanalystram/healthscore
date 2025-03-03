import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  BarChart3,
  Lightbulb,
  Zap,
  History,
  Save,
  Users,
  Download,
  Upload,
  PieChart,
  FlaskConical,
} from "lucide-react";
import MLCore from "./MLCore";
import BackendIntegration from "./BackendIntegration";
import DatasetDownloader from "./DatasetDownloader";
import ShapValueExplainer from "./ShapValueExplainer";
import ModelPerformanceMetrics from "./ModelPerformanceMetrics";
import SimulationResults from "./SimulationResults";
import WeightDistributionChart from "./WeightDistributionChart";
import CustomerSegmentation from "./CustomerSegmentation";
import PredictiveInsights from "./PredictiveInsights";
import ScoreSimulator from "./ScoreSimulator";
import AdvancedAlgorithmInfo from "./AdvancedAlgorithmInfo";
import ModelTrainingProgress from "./ModelTrainingProgress";
import { customerData, optimizationResults } from "@/data/customerData";
import {
  comprehensiveCustomerData,
  comprehensiveOptimizationResults,
} from "@/data/customerDataset";
import {
  largeCustomerData,
  largeDatasetOptimizationResults,
  CustomerHealthModel,
} from "@/data/largeCustomerDataset";

interface WeightedMeasure {
  id: string;
  name: string;
  weight: number;
  impact: number;
  category: string;
  description: string;
}

interface OptimizationResult {
  accuracy: number;
  predictedChurnReduction: number;
  keyInsights: string[];
  recommendedWeights: WeightedMeasure[];
}

const ScorecardOptimizer = () => {
  const [measures, setMeasures] = useState<WeightedMeasure[]>([
    {
      id: "1",
      name: "Product Usage Frequency",
      weight: 25,
      impact: 0.8,
      category: "Usage",
      description: "How often customers use the product",
    },
    {
      id: "2",
      name: "Support Ticket Volume",
      weight: 15,
      impact: 0.6,
      category: "Support",
      description: "Number of support tickets opened",
    },
    {
      id: "3",
      name: "Feature Adoption Rate",
      weight: 20,
      impact: 0.7,
      category: "Usage",
      description: "Percentage of available features used",
    },
    {
      id: "4",
      name: "NPS Score",
      weight: 10,
      impact: 0.5,
      category: "Satisfaction",
      description: "Net Promoter Score from surveys",
    },
    {
      id: "5",
      name: "Contract Value",
      weight: 10,
      impact: 0.4,
      category: "Financial",
      description: "Total contract value",
    },
    {
      id: "6",
      name: "Time Since Last Login",
      weight: 20,
      impact: 0.9,
      category: "Usage",
      description: "Days since the customer last logged in",
    },
  ]);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizationResult, setOptimizationResult] =
    useState<OptimizationResult | null>(null);
  const [selectedModels, setSelectedModels] = useState({
    randomForest: true,
    xgboost: true,
    neuralNetwork: true,
    logisticRegression: true,
    svm: true,
    gradientBoosting: true,
    deepLearning: true,
    transformers: true,
    ensembleModel: true,
  });
  const [activeTab, setActiveTab] = useState("current");
  const [showDataset, setShowDataset] = useState(false);
  const [useComprehensiveData, setUseComprehensiveData] = useState(false);
  const [useLargeDataset, setUseLargeDataset] = useState(false);
  const [datasetUploaded, setDatasetUploaded] = useState(false);
  const [isTrainingModel, setIsTrainingModel] = useState(false);
  const [modelTrained, setModelTrained] = useState(false);
  const [randomizedResults, setRandomizedResults] = useState(false);

  // Update a measure's weight
  const updateWeight = (id: string, newWeight: number) => {
    setMeasures(
      measures.map((measure) =>
        measure.id === id ? { ...measure, weight: newWeight } : measure,
      ),
    );
  };

  // Start optimization process
  const startOptimization = () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    // Simulate optimization progress
    const interval = setInterval(() => {
      setOptimizationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsOptimizing(false);
          generateOptimizationResults();
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  // Generate optimization results using advanced ML algorithms
  const generateOptimizationResults = () => {
    // In a real implementation, this would use actual machine learning models
    // including deep learning, transformers, and ensemble methods
    // Use the calculated weights from our dataset
    let weights, correlations;

    // Generate random weights if randomized results are enabled
    if (randomizedResults) {
      // Generate random weights that sum to 100
      const randomWeights = {
        productUsageFrequency: Math.floor(Math.random() * 30) + 10,
        supportTicketVolume: Math.floor(Math.random() * 20) + 5,
        featureAdoptionRate: Math.floor(Math.random() * 25) + 10,
        npsScore: Math.floor(Math.random() * 15) + 5,
        contractValue: Math.floor(Math.random() * 15) + 5,
        timeSinceLastLogin: Math.floor(Math.random() * 25) + 10,
      };

      // Ensure weights sum to 100
      const totalWeight = Object.values(randomWeights).reduce(
        (sum, val) => sum + val,
        0,
      );
      const scaleFactor = 100 / totalWeight;

      Object.keys(randomWeights).forEach((key) => {
        randomWeights[key as keyof typeof randomWeights] = Math.round(
          randomWeights[key as keyof typeof randomWeights] * scaleFactor,
        );
      });

      // Ensure weights sum to exactly 100 after rounding
      const adjustedTotal = Object.values(randomWeights).reduce(
        (sum, val) => sum + val,
        0,
      );
      if (adjustedTotal !== 100) {
        const diff = 100 - adjustedTotal;
        const highestKey = Object.entries(randomWeights).sort(
          (a, b) => b[1] - a[1],
        )[0][0] as keyof typeof randomWeights;
        randomWeights[highestKey] += diff;
      }

      // Generate random correlations
      const randomCorrelations = {
        productUsageFrequency: Math.random() * 0.5 + 0.5,
        supportTicketVolume: Math.random() * 0.5 + 0.3,
        featureAdoptionRate: Math.random() * 0.5 + 0.4,
        npsScore: Math.random() * 0.4 + 0.2,
        contractValue: Math.random() * 0.4 + 0.2,
        timeSinceLastLogin: Math.random() * 0.5 + 0.4,
      };

      // Normalize correlations
      const totalCorrelation = Object.values(randomCorrelations).reduce(
        (sum, val) => sum + val,
        0,
      );
      Object.keys(randomCorrelations).forEach((key) => {
        randomCorrelations[key as keyof typeof randomCorrelations] =
          randomCorrelations[key as keyof typeof randomCorrelations] /
          totalCorrelation;
      });

      weights = randomWeights;
      correlations = randomCorrelations;
    } else if (useLargeDataset) {
      weights = largeDatasetOptimizationResults.weights;
      correlations = largeDatasetOptimizationResults.importance;
    } else if (useComprehensiveData) {
      weights = comprehensiveOptimizationResults.weights;
      correlations = comprehensiveOptimizationResults.correlations;
    } else {
      weights = optimizationResults.weights;
      correlations = optimizationResults.correlations;
    }

    const optimizedWeights: WeightedMeasure[] = [
      {
        id: "1",
        name: "Product Usage Frequency",
        weight: weights.productUsageFrequency,
        impact: correlations.productUsageFrequency,
        category: "Usage",
        description: "How often customers use the product",
      },
      {
        id: "2",
        name: "Support Ticket Volume",
        weight: weights.supportTicketVolume,
        impact: correlations.supportTicketVolume,
        category: "Support",
        description: "Number of support tickets opened",
      },
      {
        id: "3",
        name: "Feature Adoption Rate",
        weight: weights.featureAdoptionRate,
        impact: correlations.featureAdoptionRate,
        category: "Usage",
        description: "Percentage of available features used",
      },
      {
        id: "4",
        name: "NPS Score",
        weight: weights.npsScore,
        impact: correlations.npsScore,
        category: "Satisfaction",
        description: "Net Promoter Score from surveys",
      },
      {
        id: "5",
        name: "Contract Value",
        weight: weights.contractValue,
        impact: correlations.contractValue,
        category: "Financial",
        description: "Total contract value",
      },
      {
        id: "6",
        name: "Time Since Last Login",
        weight: weights.timeSinceLastLogin,
        impact: correlations.timeSinceLastLogin,
        category: "Usage",
        description: "Days since the customer last logged in",
      },
    ];

    // Generate insights based on the actual data analysis
    const sortedByImpact = [...optimizedWeights].sort(
      (a, b) => b.impact - a.impact,
    );
    const mostImportant = sortedByImpact[0].name;
    const leastImportant = sortedByImpact[sortedByImpact.length - 1].name;

    const keyInsights = [
      `${mostImportant} is the strongest predictor of customer health`,
      `${leastImportant} has less predictive value than expected`,
      "Usage metrics are more important than satisfaction metrics",
      "Early warning indicators can identify at-risk customers before churn",
    ];

    setOptimizationResult({
      accuracy: 100, // As requested, 100% accuracy
      predictedChurnReduction: 23, // Fixed value to match the image
      keyInsights,
      recommendedWeights: optimizedWeights,
    });
  };

  // Apply the recommended weights
  const applyRecommendedWeights = () => {
    if (optimizationResult) {
      setMeasures(optimizationResult.recommendedWeights);
      setActiveTab("current");
    }
  };

  // Calculate total weight to ensure it sums to 100
  const totalWeight = measures.reduce(
    (sum, measure) => sum + measure.weight,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Scorecard Optimizer
        </h1>
        <div className="flex items-center space-x-2">
          {!isOptimizing && !optimizationResult && (
            <Button onClick={startOptimization}>
              <Brain className="mr-2 h-4 w-4" />
              Run AI Optimization
            </Button>
          )}
          {optimizationResult && activeTab === "recommended" && (
            <Button onClick={applyRecommendedWeights}>
              <Save className="mr-2 h-4 w-4" />
              Apply Recommended Weights
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outline" onClick={() => setShowDataset(!showDataset)}>
          <Users className="mr-2 h-4 w-4" />
          {showDataset ? "Hide Dataset" : "View Dataset"}
        </Button>

        <div className="relative">
          <Button
            variant="secondary"
            onClick={() => {
              setUseComprehensiveData(false);
              setUseLargeDataset(true);
              setDatasetUploaded(true);
              setIsTrainingModel(true);
              setRandomizedResults(false);

              // Simulate ML model training
              setTimeout(() => {
                setIsTrainingModel(false);
                setModelTrained(true);
              }, 3000);
            }}
            disabled={isTrainingModel}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isTrainingModel
              ? "Training ML Model..."
              : datasetUploaded
                ? "Large Dataset Uploaded"
                : "Upload Large Dataset (250 Companies)"}
          </Button>
          {datasetUploaded && !isTrainingModel && (
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              ✓
            </span>
          )}
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setRandomizedResults(!randomizedResults);
            if (optimizationResult) {
              startOptimization();
            }
          }}
        >
          <Brain className="mr-2 h-4 w-4" />
          {randomizedResults ? "Fixed Results" : "Randomize Results"}
        </Button>
      </div>

      {isTrainingModel && (
        <ModelTrainingProgress
          onComplete={() => {
            setIsTrainingModel(false);
            setModelTrained(true);
          }}
        />
      )}

      {showDataset && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                {useLargeDataset
                  ? "Large Dataset (250 Companies, Multiple Users)"
                  : useComprehensiveData
                    ? "Comprehensive Dataset (10 Companies, 40 Users)"
                    : "Default Dataset"}
              </div>
              <DatasetDownloader useLargeDataset={useLargeDataset} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-96">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left text-xs font-medium">ID</th>
                    <th className="p-2 text-left text-xs font-medium">User</th>
                    <th className="p-2 text-left text-xs font-medium">
                      Company
                    </th>
                    <th className="p-2 text-left text-xs font-medium">Usage</th>
                    <th className="p-2 text-left text-xs font-medium">
                      Support
                    </th>
                    <th className="p-2 text-left text-xs font-medium">
                      Adoption
                    </th>
                    <th className="p-2 text-left text-xs font-medium">NPS</th>
                    <th className="p-2 text-left text-xs font-medium">
                      Contract
                    </th>
                    <th className="p-2 text-left text-xs font-medium">Login</th>
                    <th className="p-2 text-left text-xs font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(useLargeDataset
                    ? largeCustomerData.slice(0, 100) // Show only first 100 records for performance
                    : useComprehensiveData
                      ? comprehensiveCustomerData
                      : customerData
                  ).map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b hover:bg-muted/50"
                    >
                      <td className="p-2 text-xs">{customer.id}</td>
                      <td className="p-2 text-xs">{customer.name}</td>
                      <td className="p-2 text-xs">{customer.company}</td>
                      <td className="p-2 text-xs">
                        {customer.metrics.productUsageFrequency}
                      </td>
                      <td className="p-2 text-xs">
                        {customer.metrics.supportTicketVolume}
                      </td>
                      <td className="p-2 text-xs">
                        {customer.metrics.featureAdoptionRate}
                      </td>
                      <td className="p-2 text-xs">
                        {customer.metrics.npsScore}
                      </td>
                      <td className="p-2 text-xs">
                        {customer.metrics.contractValue}
                      </td>
                      <td className="p-2 text-xs">
                        {customer.metrics.timeSinceLastLogin}
                      </td>
                      <td className="p-2 text-xs">
                        <Badge
                          variant="outline"
                          className={`
                            ${customer.status === "healthy" ? "bg-green-100 text-green-800" : ""}
                            ${customer.status === "at-risk" ? "bg-yellow-100 text-yellow-800" : ""}
                            ${customer.status === "churned" ? "bg-red-100 text-red-800" : ""}
                          `}
                        >
                          {customer.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {isOptimizing ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5 animate-pulse text-primary" />
              AI Optimization in Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={optimizationProgress} className="h-2" />
            <div className="text-sm text-muted-foreground">
              {optimizationProgress < 30 &&
                "Analyzing historical customer data..."}
              {optimizationProgress >= 30 &&
                optimizationProgress < 60 &&
                "Training machine learning models..."}
              {optimizationProgress >= 60 &&
                optimizationProgress < 90 &&
                "Evaluating predictive accuracy..."}
              {optimizationProgress >= 90 && "Generating optimized weights..."}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
              <div className="flex flex-col items-center p-3 border rounded-md">
                <div className="text-sm font-medium mb-2">Random Forest</div>
                <div
                  className={`h-2 w-full rounded-full ${selectedModels.randomForest || useLargeDataset ? "bg-green-500" : "bg-gray-200"}`}
                ></div>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-md">
                <div className="text-sm font-medium mb-2">XGBoost</div>
                <div
                  className={`h-2 w-full rounded-full ${selectedModels.xgboost || useLargeDataset ? "bg-green-500" : "bg-gray-200"}`}
                ></div>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-md">
                <div className="text-sm font-medium mb-2">Neural Network</div>
                <div
                  className={`h-2 w-full rounded-full ${selectedModels.neuralNetwork || useLargeDataset ? "bg-green-500" : "bg-gray-200"}`}
                ></div>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-md">
                <div className="text-sm font-medium mb-2">
                  Logistic Regression
                </div>
                <div
                  className={`h-2 w-full rounded-full ${selectedModels.logisticRegression || useLargeDataset ? "bg-green-500" : "bg-gray-200"}`}
                ></div>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-md">
                <div className="text-sm font-medium mb-2">SVM</div>
                <div
                  className={`h-2 w-full rounded-full ${selectedModels.svm || useLargeDataset ? "bg-green-500" : "bg-gray-200"}`}
                ></div>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-md">
                <div className="text-sm font-medium mb-2">
                  Gradient Boosting
                </div>
                <div
                  className={`h-2 w-full rounded-full ${selectedModels.gradientBoosting || useLargeDataset ? "bg-green-500" : "bg-gray-200"}`}
                ></div>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-md">
                <div className="text-sm font-medium mb-2">Deep Learning</div>
                <div
                  className={`h-2 w-full rounded-full ${selectedModels.deepLearning || useLargeDataset ? "bg-green-500" : "bg-gray-200"}`}
                ></div>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-md">
                <div className="text-sm font-medium mb-2">Transformers</div>
                <div
                  className={`h-2 w-full rounded-full ${selectedModels.transformers || useLargeDataset ? "bg-green-500" : "bg-gray-200"}`}
                ></div>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-md">
                <div className="text-sm font-medium mb-2">Ensemble Model</div>
                <div
                  className={`h-2 w-full rounded-full ${selectedModels.ensembleModel || useLargeDataset ? "bg-green-500" : "bg-gray-200"}`}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {optimizationResult && (
            <ModelPerformanceMetrics
              accuracy={optimizationResult.accuracy}
              predictedChurnReduction={
                optimizationResult.predictedChurnReduction
              }
              randomize={randomizedResults}
            />
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">
                <BarChart3 className="mr-2 h-4 w-4" />
                Current Weights
              </TabsTrigger>
              <TabsTrigger value="recommended" disabled={!optimizationResult}>
                <Brain className="mr-2 h-4 w-4" />
                AI Recommended
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Scorecard Measure Weights</CardTitle>
                    <Badge
                      variant={totalWeight === 100 ? "default" : "destructive"}
                    >
                      Total: {totalWeight}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {measures.map((measure) => (
                      <div key={measure.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{measure.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {measure.description}
                            </div>
                          </div>
                          <Badge variant="outline">{measure.category}</Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Slider
                            value={[measure.weight]}
                            min={0}
                            max={100}
                            step={5}
                            onValueChange={(value) =>
                              updateWeight(measure.id, value[0])
                            }
                            className="flex-1"
                          />
                          <span className="w-12 text-right font-medium">
                            {measure.weight}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommended" className="space-y-4 pt-4">
              {optimizationResult && (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>AI Recommended Weights</CardTitle>
                      <Badge variant="default" className="bg-green-600">
                        Optimized
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {optimizationResult.recommendedWeights.map((measure) => {
                        const currentMeasure = measures.find(
                          (m) => m.id === measure.id,
                        );
                        const weightChange = currentMeasure
                          ? measure.weight - currentMeasure.weight
                          : 0;

                        return (
                          <div key={measure.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">
                                  {measure.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {measure.description}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">
                                  {measure.category}
                                </Badge>
                                {weightChange !== 0 && (
                                  <Badge
                                    variant={
                                      weightChange > 0 ? "default" : "secondary"
                                    }
                                    className={
                                      weightChange > 0
                                        ? "bg-green-600"
                                        : "bg-red-600"
                                    }
                                  >
                                    {weightChange > 0 ? "+" : ""}
                                    {weightChange}%
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${measure.weight}%` }}
                                ></div>
                              </div>
                              <span className="w-12 text-right font-medium">
                                {measure.weight}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {!optimizationResult ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="mr-2 h-5 w-5" />
                    Simulation Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6 text-muted-foreground">
                    Run AI optimization to see simulation results
                  </div>
                </CardContent>
              </Card>
            ) : (
              <SimulationResults
                improvement={23}
                randomize={randomizedResults}
              />
            )}

            {!optimizationResult ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5" />
                    SHAP Value Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6 text-muted-foreground">
                    Run AI optimization to see SHAP value analysis
                  </div>
                </CardContent>
              </Card>
            ) : (
              <ShapValueExplainer
                featureValues={optimizationResult.recommendedWeights.reduce(
                  (acc, measure) => {
                    acc[measure.name] = measure.impact;
                    return acc;
                  },
                  {} as Record<string, number>,
                )}
                randomize={randomizedResults}
              />
            )}

            {!optimizationResult ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5" />
                    Weight Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6 text-muted-foreground">
                    Run AI optimization to see weight distribution analysis
                  </div>
                </CardContent>
              </Card>
            ) : (
              <WeightDistributionChart
                weights={optimizationResult.recommendedWeights}
                title="Optimized Weight Distribution"
              />
            )}
          </div>

          {optimizationResult && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <CustomerSegmentation randomize={randomizedResults} />
                <PredictiveInsights randomize={randomizedResults} />
              </div>
              <div className="mt-6">
                <ScoreSimulator />
              </div>
              <div className="mt-6">
                <AdvancedAlgorithmInfo />
              </div>
              <div className="mt-6">
                <MLCore />
              </div>
              <div className="mt-6">
                <BackendIntegration
                  onTrainingComplete={(results) => {
                    // Use the results from the backend training
                    if (results && results.weights) {
                      // Trigger optimization with the new weights
                      startOptimization();
                    }
                  }}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ScorecardOptimizer;
