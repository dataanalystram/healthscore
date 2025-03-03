/**
 * ML Core Module for Customer Health Platform
 *
 * This module exports the core ML functionality for the AI-Driven Scorecard Optimizer.
 */

export { DataPreprocessor } from "./dataPreprocessor";
export { ModelTrainer } from "./modelTrainer";
export { ModelExplainer } from "./modelExplainer";
export { RealTimeScorer } from "./realTimeScorer";
export { ScoreOptimizer } from "./scoreOptimizer";

/**
 * Initialize the ML pipeline with sample data
 */
export function initializeMLPipeline() {
  const { DataPreprocessor } = require("./dataPreprocessor");
  const { ModelTrainer } = require("./modelTrainer");
  const { ModelExplainer } = require("./modelExplainer");
  const { RealTimeScorer } = require("./realTimeScorer");

  // Define feature names
  const featureNames = [
    "productUsageFrequency",
    "supportTicketVolume",
    "featureAdoptionRate",
    "npsScore",
    "contractValue",
    "timeSinceLastLogin",
  ];

  // Initialize components
  const preprocessor = new DataPreprocessor({
    numericalFeatures: featureNames,
  });

  const trainer = new ModelTrainer({
    featureNames,
    targetName: "churn",
  });

  // Create sample data
  const sampleData = Array(100)
    .fill(0)
    .map(() => {
      const data: Record<string, number> = {};
      featureNames.forEach((feature) => {
        data[feature] = Math.random();
      });
      data["churn"] = Math.random() > 0.7 ? 1 : 0;
      return data;
    });

  // Train models
  trainer.trainXGBoost(
    sampleData,
    sampleData.map((d) => d.churn),
  );
  trainer.trainEnsemble(
    sampleData,
    sampleData.map((d) => d.churn),
  );

  // Create explainer
  const explainer = new ModelExplainer(trainer);
  explainer.setupExplainers(sampleData);

  // Create score optimizer
  const optimizer = trainer.createScoreOptimizer();

  // Create real-time scorer
  const scorer = new RealTimeScorer(
    trainer,
    explainer,
    preprocessor,
    optimizer,
  );
  scorer.initialize("ensemble");

  return {
    preprocessor,
    trainer,
    explainer,
    optimizer,
    scorer,
    sampleData,
  };
}
