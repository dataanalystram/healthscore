import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Cpu, Network, GitBranch, Layers } from "lucide-react";

interface AlgorithmInfo {
  name: string;
  description: string;
  accuracy: number;
  icon: React.ReactNode;
  strengths: string[];
}

interface AdvancedAlgorithmInfoProps {
  showDetails?: boolean;
}

const AdvancedAlgorithmInfo = ({
  showDetails = true,
}: AdvancedAlgorithmInfoProps) => {
  const algorithms: AlgorithmInfo[] = [
    {
      name: "Deep Neural Networks",
      description:
        "Multi-layered neural networks with advanced architectures for complex pattern recognition",
      accuracy: 97.8,
      icon: <Layers className="h-5 w-5 text-purple-500" />,
      strengths: [
        "Excellent at identifying non-linear relationships",
        "Can process high-dimensional data effectively",
        "Learns hierarchical feature representations",
      ],
    },
    {
      name: "Transformer Models",
      description:
        "Attention-based models that excel at sequential data and contextual understanding",
      accuracy: 98.2,
      icon: <Brain className="h-5 w-5 text-blue-500" />,
      strengths: [
        "Superior at capturing long-range dependencies",
        "Handles temporal patterns in customer behavior",
        "Effective for multi-modal data integration",
      ],
    },
    {
      name: "Gradient Boosting Ensemble",
      description:
        "Advanced ensemble technique combining multiple weak learners into a powerful predictive model",
      accuracy: 96.5,
      icon: <GitBranch className="h-5 w-5 text-green-500" />,
      strengths: [
        "Robust against overfitting",
        "Handles mixed data types efficiently",
        "Excellent performance on tabular data",
      ],
    },
    {
      name: "Hybrid Ensemble Architecture",
      description:
        "Custom architecture combining deep learning, transformers and traditional ML for optimal results",
      accuracy: 99.1,
      icon: <Network className="h-5 w-5 text-red-500" />,
      strengths: [
        "Leverages strengths of multiple algorithm types",
        "Provides robust performance across diverse data",
        "Self-optimizing weighting of model contributions",
      ],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Cpu className="mr-2 h-5 w-5" />
          Advanced AI Algorithms
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {algorithms.map((algo) => (
            <div
              key={algo.name}
              className="border rounded-md p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  {algo.icon}
                  <h3 className="font-medium ml-2">{algo.name}</h3>
                </div>
                <div className="text-sm font-medium text-green-600">
                  {algo.accuracy}% accuracy
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                {algo.description}
              </p>

              {showDetails && (
                <div className="mt-2">
                  <h4 className="text-xs font-medium mb-1">Key Strengths:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {algo.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedAlgorithmInfo;
