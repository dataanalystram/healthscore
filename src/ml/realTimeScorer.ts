/**
 * Real-Time Scorer Module
 *
 * This module handles real-time scoring of customers using trained models,
 * providing health scores and explanations.
 */

import { ModelTrainer } from "./modelTrainer";
import { ModelExplainer } from "./modelExplainer";
import { DataPreprocessor } from "./dataPreprocessor";
import { ScoreOptimizer } from "./scoreOptimizer";

interface ScoringResult {
  customerId?: string;
  score: number;
  prediction: number;
  threshold: number;
  model: string;
  timestamp: string;
  explanation?: string;
  error?: string;
}

export class RealTimeScorer {
  private trainer: ModelTrainer;
  private explainer: ModelExplainer;
  private preprocessor: DataPreprocessor;
  private optimizer: ScoreOptimizer;
  private scoringModel: string | null = null;
  private scoringThreshold: number = 0.5;

  constructor(
    trainer: ModelTrainer,
    explainer: ModelExplainer,
    preprocessor: DataPreprocessor,
    optimizer: ScoreOptimizer,
  ) {
    this.trainer = trainer;
    this.explainer = explainer;
    this.preprocessor = preprocessor;
    this.optimizer = optimizer;
  }

  /**
   * Initialize the real-time scorer with the specified model
   */
  initialize(modelName = "ensemble", threshold = 0.5): void {
    console.log(`Initializing real-time scorer with ${modelName} model...`);

    this.scoringThreshold = threshold;

    // Set the scoring model
    if (modelName === "ensemble") {
      this.scoringModel = "ensemble";
      console.log("Using ensemble model for scoring");
    } else {
      this.scoringModel = modelName;
      console.log(`Using ${modelName} model for scoring`);
    }
  }

  /**
   * Score a customer using the selected model
   */
  scoreCustomer(customerData: any, generateExplanation = true): ScoringResult {
    try {
      // Ensure customer data is in the right format
      const customer = Array.isArray(customerData)
        ? customerData[0]
        : customerData;

      // Get customer ID if available
      const customerId =
        customer.id || customer.customerId || customer.customer_id;

      // Preprocess data (in a real implementation)
      // const processedData = this.preprocessor.transform([customer]);

      // For this demo, we'll use the customer data directly
      const processedData = customer;

      // Calculate health score using optimizer
      const score = this.optimizer.calculateHealthScore(processedData);

      // Normalize score to 0-1 range for prediction
      const normalizedScore = score / 100;

      // Determine prediction
      const prediction = normalizedScore >= this.scoringThreshold ? 1 : 0;

      // Generate explanation if requested
      let explanation;
      if (generateExplanation) {
        explanation = this.explainer.generateCustomerExplanation(
          processedData,
          normalizedScore,
          this.scoringModel || "xgboost",
        );
      }

      // Create result object
      const result: ScoringResult = {
        customerId,
        score,
        prediction,
        threshold: this.scoringThreshold,
        model: this.scoringModel || "default",
        timestamp: new Date().toISOString(),
        explanation,
      };

      return result;
    } catch (e) {
      console.error(`Error scoring customer: ${e}`);
      return {
        customerId:
          customerData.id ||
          customerData.customerId ||
          customerData.customer_id,
        score: 50, // Default score
        prediction: 0,
        threshold: this.scoringThreshold,
        model: this.scoringModel || "default",
        timestamp: new Date().toISOString(),
        error: String(e),
      };
    }
  }

  /**
   * Score multiple customers in batch mode
   */
  batchScoreCustomers(customersData: any[]): ScoringResult[] {
    try {
      // Score each customer
      return customersData.map((customer) =>
        this.scoreCustomer(customer, false),
      );
    } catch (e) {
      console.error(`Error batch scoring customers: ${e}`);

      // Return error results
      return customersData.map((customer) => ({
        customerId: customer.id || customer.customerId || customer.customer_id,
        score: 50, // Default score
        prediction: 0,
        threshold: this.scoringThreshold,
        model: this.scoringModel || "default",
        timestamp: new Date().toISOString(),
        error: String(e),
      }));
    }
  }

  /**
   * Create a sample customer for testing
   */
  createSampleCustomer(): any {
    return {
      customerId: `cust_${Math.floor(Math.random() * 10000)}`,
      productUsageFrequency: Math.random(),
      supportTicketVolume: Math.random(),
      featureAdoptionRate: Math.random(),
      npsScore: Math.random(),
      contractValue: Math.random(),
      timeSinceLastLogin: Math.random(),
    };
  }
}
