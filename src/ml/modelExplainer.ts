/**
 * Model Explainer Module
 *
 * This module provides explainability for model predictions using SHAP-like
 * and LIME-like approaches for the AI-Driven Scorecard Optimizer.
 */

import { ModelTrainer } from "./modelTrainer";

interface ExplanationResult {
  feature: string;
  value: number;
  impact: number;
  direction: "increases" | "decreases";
  magnitude: "significantly" | "somewhat" | "slightly";
}

export class ModelExplainer {
  private trainer: ModelTrainer;
  private explainers: Record<string, any> = {};
  private backgroundData: any[] | null = null;

  constructor(trainer: ModelTrainer) {
    this.trainer = trainer;
  }

  /**
   * Set up explainers for different model types
   */
  setupExplainers(trainingData: any[]): void {
    console.log("Setting up model explainers...");

    // Save a sample of background data
    const sampleSize = Math.min(100, trainingData.length);
    this.backgroundData = trainingData.slice(0, sampleSize);

    // In a real implementation, this would set up SHAP and LIME explainers
    // For this demo, we'll simulate the explainers

    // Set up a simulated explainer for XGBoost
    if (this.trainer.getFeatureImportance) {
      this.explainers["xgboost"] = {
        shap_values: (instance: any) => {
          // Simulate SHAP values based on feature importance
          const featureImportance =
            this.trainer.getFeatureImportance("xgboost");

          // Create SHAP values with some randomness
          return Array.isArray(instance)
            ? instance.map(() => this.simulateShapValues(featureImportance))
            : [this.simulateShapValues(featureImportance)];
        },
        expected_value: 0.5, // Base value
      };

      console.log("Created simulated SHAP explainer for XGBoost");
    }
  }

  /**
   * Generate a human-readable explanation of a prediction for a customer
   */
  generateCustomerExplanation(
    customerData: any,
    prediction: number,
    modelName = "xgboost",
    topFeatures = 5,
  ): string {
    try {
      // Ensure customer data is in the right format
      const customer = Array.isArray(customerData)
        ? customerData[0]
        : customerData;

      // Get feature names
      const featureNames = Object.keys(customer).filter((key) => {
        // Filter out non-feature fields
        return !["id", "customerId", "customer_id"].includes(key);
      });

      // Generate simulated SHAP values
      const shapValues: Record<string, number> = {};

      for (const feature of featureNames) {
        // Generate a random SHAP value with some correlation to the feature value
        const featureValue = customer[feature] || 0;
        const baseImpact = (featureValue - 0.5) * 2; // Scale to [-1, 1]
        shapValues[feature] = baseImpact * (0.5 + Math.random() * 0.5); // Add randomness
      }

      // Create explanation objects
      const explanations: ExplanationResult[] = featureNames.map((feature) => {
        const impact = shapValues[feature];
        return {
          feature,
          value: customer[feature] || 0,
          impact,
          direction: impact > 0 ? "increases" : "decreases",
          magnitude:
            Math.abs(impact) > 0.1
              ? "significantly"
              : Math.abs(impact) > 0.05
                ? "somewhat"
                : "slightly",
        };
      });

      // Sort by absolute impact
      explanations.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

      // Get top contributing features
      const topExplanations = explanations.slice(0, topFeatures);

      // Generate explanation text
      const churnProb = prediction * 100;
      const churnRisk =
        churnProb > 70 ? "HIGH" : churnProb > 30 ? "MEDIUM" : "LOW";

      let explanation = [
        `Customer Churn Risk: ${churnRisk} (${churnProb.toFixed(1)}%)\n`,
        "Top factors influencing this prediction:",
      ];

      for (const exp of topExplanations) {
        // Format feature value based on its type
        const valueStr =
          typeof exp.value === "number"
            ? exp.value.toFixed(2)
            : String(exp.value);

        explanation.push(
          `- ${exp.feature} = ${valueStr} ${exp.direction} churn risk ${exp.magnitude}`,
        );
      }

      return explanation.join("\n");
    } catch (e) {
      console.error(`Error generating customer explanation: ${e}`);
      return `Unable to generate explanation due to an error: ${e}`;
    }
  }

  /**
   * Simulate SHAP values based on feature importance
   */
  private simulateShapValues(featureImportance: any[]): number[] {
    // Create SHAP values with some randomness based on feature importance
    return featureImportance.map(({ importance }) => {
      // Generate a random value centered around the importance
      // with some randomness to simulate variation
      return (importance - 0.5) * 2 * (0.5 + Math.random() * 0.5);
    });
  }
}
