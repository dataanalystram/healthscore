/**
 * Score Optimizer Module
 *
 * This module implements the core ML functionality for the AI-Driven Scorecard Optimizer,
 * including health score calculation, weight optimization, and A/B testing.
 */

interface FeatureWeights {
  [feature: string]: number;
}

interface Customer {
  [feature: string]: number;
}

interface ABTestVariant {
  name: string;
  weights: FeatureWeights;
}

interface ABTestConfig {
  name: string;
  variants: ABTestVariant[];
  allocation: number[];
  startDate: string;
  status: "active" | "paused" | "completed";
  results: {
    [variantName: string]: {
      conversions: number;
      total: number;
    };
  };
}

export class ScoreOptimizer {
  featureWeights: FeatureWeights = {};
  private abTestGroups: { [testName: string]: ABTestConfig } = {};
  private optimizationHistory: any[] = [];

  constructor(initialWeights?: FeatureWeights) {
    if (initialWeights) {
      this.featureWeights = this.normalizeWeights(initialWeights);
    } else {
      // Default weights if none provided
      this.featureWeights = {
        productUsageFrequency: 0.25,
        supportTicketVolume: 0.15,
        featureAdoptionRate: 0.2,
        npsScore: 0.1,
        contractValue: 0.1,
        timeSinceLastLogin: 0.2,
      };
    }
  }

  /**
   * Calculate health score using the provided weights
   */
  calculateHealthScore(
    customerData: Customer,
    weights?: FeatureWeights,
  ): number {
    try {
      // Use provided weights or default
      const useWeights = weights || this.featureWeights;

      // Calculate score
      let score = 0.0;
      let totalWeight = 0.0;

      for (const [feature, weight] of Object.entries(useWeights)) {
        if (feature in customerData) {
          // Get feature value
          const value = customerData[feature];

          // For some features, lower values are better (e.g., churn probability)
          const invertedFeatures = [
            "churnProbability",
            "daysSinceLastLogin",
            "supportTickets",
          ];
          const normalizedValue = invertedFeatures.some((inv) =>
            feature.toLowerCase().includes(inv.toLowerCase()),
          )
            ? 1.0 - value // Invert the value
            : value;

          // Add to score
          score += normalizedValue * weight;
          totalWeight += weight;
        }
      }

      // Normalize final score to 0-100 range
      const finalScore = totalWeight > 0 ? 100.0 * (score / totalWeight) : 50.0;

      return finalScore;
    } catch (e) {
      console.error("Error calculating health score: " + e);
      return 50.0; // Return default score on error
    }
  }

  /**
   * Set up an A/B test with multiple variants
   */
  setupABTest(
    testName: string,
    variants: ABTestVariant[],
    allocation?: number[],
  ): ABTestConfig | null {
    try {
      // Validate inputs
      if (!variants || variants.length === 0) {
        throw new Error("No variants provided for A/B test");
      }

      // Default to equal allocation if not provided
      let useAllocation = allocation;
      if (!useAllocation) {
        useAllocation = Array(variants.length).fill(100.0 / variants.length);
      }

      // Ensure allocation sums to 100
      const sum = useAllocation.reduce((a, b) => a + b, 0);
      if (Math.abs(sum - 100.0) > 0.001) {
        useAllocation = useAllocation.map((a) => (a * 100.0) / sum);
      }

      // Create test configuration
      const testConfig: ABTestConfig = {
        name: testName,
        variants,
        allocation: useAllocation,
        startDate: new Date().toISOString(),
        status: "active",
        results: Object.fromEntries(
          variants.map((variant) => [
            variant.name,
            { conversions: 0, total: 0 },
          ]),
        ),
      };

      // Store the test
      this.abTestGroups[testName] = testConfig;

      console.log(
        "A/B test '" +
          testName +
          "' set up with " +
          variants.length +
          " variants",
      );
      return testConfig;
    } catch (e) {
      console.error("Error setting up A/B test: " + e);
      return null;
    }
  }

  /**
   * Assign a customer to a variant in an A/B test
   */
  assignVariant(testName: string, customerId: string): ABTestVariant {
    try {
      // Check if test exists
      if (!(testName in this.abTestGroups)) {
        throw new Error("A/B test '" + testName + "' not found");
      }

      const testConfig = this.abTestGroups[testName];

      // Deterministic assignment based on customer ID
      // Create hash of customer ID and test name
      const hashInput = customerId + ":" + testName;
      let hashValue = 0;
      for (let i = 0; i < hashInput.length; i++) {
        hashValue = (hashValue << 5) - hashValue + hashInput.charCodeAt(i);
        hashValue |= 0; // Convert to 32bit integer
      }

      // Use hash value to determine variant
      const hashPct = Math.abs(hashValue % 100);

      // Find variant based on allocation percentages
      let cumulativePct = 0;
      for (let i = 0; i < testConfig.allocation.length; i++) {
        cumulativePct += testConfig.allocation[i];
        if (hashPct < cumulativePct) {
          const variant = testConfig.variants[i];

          // Update statistics
          testConfig.results[variant.name].total += 1;

          return variant;
        }
      }

      // Fallback to first variant if something went wrong
      return testConfig.variants[0];
    } catch (e) {
      console.error("Error assigning variant: " + e);

      // Return default variant on error
      if (
        testName in this.abTestGroups &&
        this.abTestGroups[testName].variants.length > 0
      ) {
        return this.abTestGroups[testName].variants[0];
      } else {
        return { name: "default", weights: this.featureWeights };
      }
    }
  }

  /**
   * Record a conversion for an A/B test variant
   */
  recordConversion(
    testName: string,
    variantName: string,
    converted = true,
  ): boolean {
    try {
      // Check if test exists
      if (!(testName in this.abTestGroups)) {
        throw new Error("A/B test '" + testName + "' not found");
      }

      const testConfig = this.abTestGroups[testName];

      // Check if variant exists
      if (!(variantName in testConfig.results)) {
        throw new Error(
          "Variant '" + variantName + "' not found in test '" + testName + "'",
        );
      }

      // Update conversion count if converted
      if (converted) {
        testConfig.results[variantName].conversions += 1;
      }

      return true;
    } catch (e) {
      console.error("Error recording conversion: " + e);
      return false;
    }
  }

  /**
   * Analyze the results of an A/B test
   */
  analyzeABTestResults(testName: string): any {
    try {
      // Check if test exists
      if (!(testName in this.abTestGroups)) {
        throw new Error("A/B test '" + testName + "' not found");
      }

      const testConfig = this.abTestGroups[testName];

      // Calculate conversion rates and confidence intervals
      const results: any = {};
      for (const [variantName, statsData] of Object.entries(
        testConfig.results,
      )) {
        const conversions = statsData.conversions;
        const total = statsData.total;

        if (total > 0) {
          // Conversion rate
          const conversionRate = conversions / total;

          // Wilson score interval for confidence interval
          const z = 1.96; // 95% confidence

          // Calculate confidence interval
          const ciLower =
            (conversionRate +
              (z * z) / (2 * total) -
              z *
                Math.sqrt(
                  (conversionRate * (1 - conversionRate) +
                    (z * z) / (4 * total)) /
                    total,
                )) /
            (1 + (z * z) / total);

          const ciUpper =
            (conversionRate +
              (z * z) / (2 * total) +
              z *
                Math.sqrt(
                  (conversionRate * (1 - conversionRate) +
                    (z * z) / (4 * total)) /
                    total,
                )) /
            (1 + (z * z) / total);

          results[variantName] = {
            conversions,
            total,
            conversionRate,
            ciLower,
            ciUpper,
          };
        } else {
          results[variantName] = {
            conversions: 0,
            total: 0,
            conversionRate: 0.0,
            ciLower: 0.0,
            ciUpper: 0.0,
          };
        }
      }

      // Find the control and best performer
      let control = null;
      let bestPerformer = null;
      let bestRate = 0.0;

      for (const [variantName, result] of Object.entries(results)) {
        if (control === null) {
          control = variantName;
        }

        if (result.conversionRate > bestRate) {
          bestRate = result.conversionRate;
          bestPerformer = variantName;
        }
      }

      // Simple statistical significance test
      let analysis: any = {
        control,
        bestPerformer,
        recommendation: bestPerformer,
      };

      if (Object.keys(results).length > 1 && control in results) {
        // Simple chi-squared test approximation
        const controlResult = results[control];
        const bestResult = results[bestPerformer];

        // Calculate p-value using chi-squared approximation
        // This is a simplified approach - in production, use a proper statistical library
        const pValue = this.calculatePValue(controlResult, bestResult);

        // Determine significance
        const significant = pValue < 0.05;

        // Add to results
        analysis = {
          ...analysis,
          pValue,
          significant,
          recommendation: significant ? bestPerformer : control,
        };
      }

      // Return combined results
      return {
        testName,
        results,
        analysis,
      };
    } catch (e) {
      console.error("Error analyzing A/B test results: " + e);
      return { error: String(e) };
    }
  }

  /**
   * Optimize weights using Bayesian optimization (simplified simulation)
   */
  optimizeWeightsBayesian(
    trainData: any[],
    targetCol: string,
    nTrials = 100,
  ): FeatureWeights {
    try {
      console.log(
        "Running Bayesian optimization with " + nTrials + " trials...",
      );

      // In a real implementation, this would use a Bayesian optimization library
      // For this demo, we'll simulate the optimization process

      // Extract features (all columns except target)
      const features = Object.keys(trainData[0]).filter(
        (col) => col !== targetCol,
      );

      // Generate random weights for demonstration
      const optimizedWeights: FeatureWeights = {};

      // Simulate multiple trials
      let bestScore = -Infinity;
      let bestWeights: FeatureWeights = {};

      for (let trial = 0; trial < nTrials; trial++) {
        // Generate random weights
        const trialWeights: FeatureWeights = {};
        for (const feature of features) {
          trialWeights[feature] = Math.random();
        }

        // Normalize weights to sum to 1
        const normalizedWeights = this.normalizeWeights(trialWeights);

        // Evaluate weights (in a real implementation, this would use cross-validation)
        const score = this.evaluateWeights(
          normalizedWeights,
          trainData,
          targetCol,
        );

        // Update best weights if better score found
        if (score > bestScore) {
          bestScore = score;
          bestWeights = normalizedWeights;
        }
      }

      // Store optimization result
      const optimizationResult = {
        method: "bayesian",
        weights: bestWeights,
        score: bestScore,
        timestamp: new Date().toISOString(),
      };

      this.optimizationHistory.push(optimizationResult);

      // Update feature weights
      this.featureWeights = bestWeights;

      return bestWeights;
    } catch (e) {
      console.error(
        "Error optimizing weights with Bayesian optimization: " + e,
      );
      return this.featureWeights;
    }
  }

  /**
   * Generate a reinforcement learning recommendation
   */
  recommendReinforcementLearning(): any {
    try {
      // Create recommendation
      const recommendation = {
        title: "Reinforcement Learning for Score Optimization",
        description:
          "Reinforcement Learning (RL) offers a powerful approach for optimizing " +
          "health score calculations over time by learning from actual outcomes. " +
          "Unlike traditional optimization methods, RL continuously adapts based on " +
          "real-world feedback, leading to more effective and dynamic scoring models.",
        benefits: [
          "Continuous learning and adaptation based on real customer outcomes",
          "Ability to optimize for multiple business objectives simultaneously",
          "Can adapt to changing customer behavior patterns over time",
          "Provides a self-improving system that gets better with more data",
        ],
        implementationSteps: [
          "Define the RL environment (states, actions, rewards)",
          "Configure the RL agent and policy network",
          "Implement the training loop with historical data",
          "Deploy the agent for online learning with proper safeguards",
          "Monitor performance and adjust reward functions as needed",
        ],
        resourceRequirements: [
          "Computing resources for model training and inference",
          "Historical data with clear outcome labels",
          "Engineering resources for integration with scoring pipeline",
          "Monitoring infrastructure for assessing model performance",
        ],
        timeline:
          "3-6 months for initial implementation, with ongoing improvements",
      };

      return {
        recommendation,
        sampleCode: this.getRLSampleCode(),
      };
    } catch (e) {
      console.error("Error generating RL recommendation: " + e);
      return {
        error: String(e),
        recommendation: {
          title: "Reinforcement Learning for Score Optimization",
          description: "Error generating detailed recommendation.",
        },
      };
    }
  }

  /**
   * Helper method to normalize weights to sum to 1
   */
  private normalizeWeights(weights: FeatureWeights): FeatureWeights {
    const totalWeight = Object.values(weights).reduce(
      (sum, weight) => sum + weight,
      0,
    );

    if (totalWeight === 0) {
      return weights; // Avoid division by zero
    }

    const normalizedWeights: FeatureWeights = {};
    for (const [feature, weight] of Object.entries(weights)) {
      normalizedWeights[feature] = weight / totalWeight;
    }

    return normalizedWeights;
  }

  /**
   * Helper method to evaluate weights on training data
   */
  private evaluateWeights(
    weights: FeatureWeights,
    trainData: any[],
    targetCol: string,
  ): number {
    // Calculate scores for each customer
    const scores = trainData.map((customer) => {
      // Create customer data without target
      const customerData = { ...customer };
      delete customerData[targetCol];

      // Calculate health score
      const score = this.calculateHealthScore(customerData, weights) / 100.0; // Normalize to 0-1
      return score;
    });

    // Calculate correlation with target
    const targetValues = trainData.map((customer) => customer[targetCol]);

    // For churn prediction, we want health score to be inversely related to churn
    const correlation = -this.calculateCorrelation(scores, targetValues);

    return correlation;
  }

  /**
   * Helper method to calculate correlation between two arrays
   */
  private calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length;

    // Calculate means
    const xMean = x.reduce((sum, val) => sum + val, 0) / n;
    const yMean = y.reduce((sum, val) => sum + val, 0) / n;

    // Calculate covariance and variances
    let covariance = 0;
    let xVariance = 0;
    let yVariance = 0;

    for (let i = 0; i < n; i++) {
      const xDiff = x[i] - xMean;
      const yDiff = y[i] - yMean;
      covariance += xDiff * yDiff;
      xVariance += xDiff * xDiff;
      yVariance += yDiff * yDiff;
    }

    // Calculate correlation coefficient
    const denominator = Math.sqrt(xVariance * yVariance);
    return denominator === 0 ? 0 : covariance / denominator;
  }

  /**
   * Helper method to calculate p-value for chi-squared test
   */
  private calculatePValue(controlResult: any, testResult: any): number {
    // Simplified chi-squared test for two proportions
    const controlConversions = controlResult.conversions;
    const controlNonConversions =
      controlResult.total - controlResult.conversions;
    const testConversions = testResult.conversions;
    const testNonConversions = testResult.total - testResult.conversions;

    // Calculate expected values
    const totalConversions = controlConversions + testConversions;
    const totalNonConversions = controlNonConversions + testNonConversions;
    const totalSamples = controlResult.total + testResult.total;

    const expectedControlConversions =
      controlResult.total * (totalConversions / totalSamples);
    const expectedControlNonConversions =
      controlResult.total * (totalNonConversions / totalSamples);
    const expectedTestConversions =
      testResult.total * (totalConversions / totalSamples);
    const expectedTestNonConversions =
      testResult.total * (totalNonConversions / totalSamples);

    // Calculate chi-squared statistic
    const chiSquared =
      Math.pow(controlConversions - expectedControlConversions, 2) /
        expectedControlConversions +
      Math.pow(controlNonConversions - expectedControlNonConversions, 2) /
        expectedControlNonConversions +
      Math.pow(testConversions - expectedTestConversions, 2) /
        expectedTestConversions +
      Math.pow(testNonConversions - expectedTestNonConversions, 2) /
        expectedTestNonConversions;

    // Approximate p-value using chi-squared distribution with 1 degree of freedom
    // This is a simplified approximation - in production, use a proper statistical library
    return 1 - this.chiSquaredCDF(chiSquared, 1);
  }

  /**
   * Helper method to approximate chi-squared CDF
   */
  private chiSquaredCDF(x: number, k: number): number {
    // Very simplified approximation of chi-squared CDF
    // In production, use a proper statistical library
    if (x <= 0) return 0;

    // Approximation for k=1 (1 degree of freedom)
    if (k === 1) {
      return 2 * this.normalCDF(Math.sqrt(x)) - 1;
    }

    // Approximation for k=2 (2 degrees of freedom)
    if (k === 2) {
      return 1 - Math.exp(-x / 2);
    }

    // Rough approximation for other degrees of freedom
    const z = Math.sqrt(2 * x) - Math.sqrt(2 * k - 1);
    return this.normalCDF(z);
  }

  /**
   * Helper method to approximate normal CDF
   */
  private normalCDF(x: number): number {
    // Approximation of the normal CDF
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp((-x * x) / 2);
    const p =
      d *
      t *
      (0.3193815 +
        t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - p : p;
  }

  /**
   * Helper method to get sample RL code
   */
  private getRLSampleCode(): string {
    return `
// Sample Reinforcement Learning Implementation with TensorFlow.js

// Note: This is a code sample that would be used with TensorFlow.js
// It's not meant to be executed directly in this context

/*
import * as tf from '@tensorflow/tfjs';

// Define the environment for health score optimization
class HealthScoreEnv {
  constructor(customerData, outcomes, featureNames) {
    this.customerData = customerData;
    this.outcomes = outcomes;
    this.featureNames = featureNames;
    this.nFeatures = featureNames.length;
    this.episodeLength = 100;
    this.currentStep = 0;
    this.currentCustomerIdx = 0;
  }
  
  reset() {
    // Reset environment state
    this.currentStep = 0;
    this.currentCustomerIdx = 0;
    
    // Return initial observation
    return this.getObservation();
  }
  
  step(action) {
    // Get current customer data
    const customer = this.getObservation();
    
    // Normalize action (weights) to sum to 1
    const sum = action.reduce((a, b) => a + b, 0);
    const weights = action.map(w => w / sum);
    
    // Calculate health score using weights
    let healthScore = 0;
    for (let i = 0; i < customer.length; i++) {
      healthScore += customer[i] * weights[i];
    }
    
    // Get actual outcome (1 for retained, 0 for churned)
    const actualOutcome = this.outcomes[this.currentCustomerIdx];
    
    // Calculate reward based on accuracy of prediction
    // If health score correctly predicts outcome, give positive reward
    const predOutcome = healthScore >= 0.5 ? 1 : 0;
    const reward = predOutcome === actualOutcome ? 1.0 : -1.0;
    
    // Move to next customer
    this.currentCustomerIdx = (this.currentCustomerIdx + 1) % this.customerData.length;
    this.currentStep += 1;
    
    // Check if episode is done
    const done = this.currentStep >= this.episodeLength;
    
    // Return observation, reward, done, info
    return {
      observation: this.getObservation(),
      reward,
      done,
      info: {}
    };
  }
  
  getObservation() {
    // Return current customer features
    return this.customerData[this.currentCustomerIdx];
  }
}

// Define a simple policy network
class PolicyNetwork {
  constructor(inputDim, outputDim) {
    this.model = tf.sequential();
    this.model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [inputDim]
    }));
    this.model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));
    this.model.add(tf.layers.dense({
      units: outputDim,
      activation: 'softmax'
    }));
    
    this.optimizer = tf.train.adam(0.01);
  }
  
  predict(state) {
    return this.model.predict(tf.tensor2d([state]));
  }
  
  update(states, actions, advantages) {
    // Convert to tensors
    const stateTensor = tf.tensor2d(states);
    const actionTensor = tf.tensor2d(actions);
    const advantageTensor = tf.tensor1d(advantages);
    
    // Training step
    const loss = tf.tidy(() => {
      const predictions = this.model.predict(stateTensor);
      const actionProbs = tf.sum(tf.mul(predictions, actionTensor), 1);
      const logProbs = tf.log(actionProbs);
      return tf.neg(tf.mean(tf.mul(logProbs, advantageTensor)));
    });
    
    // Backpropagation
    const grads = tf.variableGrads(() => loss);
    this.optimizer.applyGradients(grads.grads);
    
    // Clean up tensors
    stateTensor.dispose();
    actionTensor.dispose();
    advantageTensor.dispose();
    
    return loss.dataSync()[0];
  }
}

// Train the RL agent
async function trainRLOptimizer(customerData, outcomes, featureNames, totalEpisodes = 1000) {
  // Create environment
  const env = new HealthScoreEnv(customerData, outcomes, featureNames);
  
  // Create policy network
  const policy = new PolicyNetwork(featureNames.length, featureNames.length);
  
  // Training loop
  const batchSize = 32;
  let states = [];
  let actions = [];
  let rewards = [];
  let losses = [];
  
  for (let episode = 0; episode < totalEpisodes; episode++) {
    // Reset environment
    let state = env.reset();
    let done = false;
    let episodeReward = 0;
    
    while (!done) {
      // Get action from policy
      const actionProbs = await policy.predict(state).data();
      
      // Sample action from probabilities
      const action = sampleFromDistribution(actionProbs);
      
      // Take action in environment
      const { observation: nextState, reward, done: isDone } = env.step(action);
      
      // Store transition
      states.push(state);
      actions.push(action);
      rewards.push(reward);
      
      // Update state
      state = nextState;
      done = isDone;
      episodeReward += reward;
      
      // Update policy if batch is full
      if (states.length >= batchSize) {
        // Calculate advantages (simple version - just use rewards)
        const advantages = rewards;
        
        // Update policy
        const loss = await policy.update(states, actions, advantages);
        losses.push(loss);
        
        // Clear batch
        states = [];
        actions = [];
        rewards = [];
      }
    }
    
    // Log progress
    if (episode % 10 === 0) {
      console.log('Episode ' + episode + ', Reward: ' + episodeReward);
    }
  }
  
  // Get optimal weights
  const observation = env.reset();
  const actionProbs = await policy.predict(observation).data();
  const optimalWeights = {};
  
  for (let i = 0; i < featureNames.length; i++) {
    optimalWeights[featureNames[i]] = actionProbs[i];
  }
  
  // Normalize weights
  const sum = Object.values(optimalWeights).reduce((a, b) => a + b, 0);
  for (const feature in optimalWeights) {
    optimalWeights[feature] /= sum;
  }
  
  return {
    optimalWeights,
    trainingLosses: losses
  };
}

// Helper function to sample from a probability distribution
function sampleFromDistribution(probs) {
  const action = Array(probs.length).fill(0);
  let cumProb = 0;
  const r = Math.random();
  
  for (let i = 0; i < probs.length; i++) {
    cumProb += probs[i];
    if (r <= cumProb) {
      action[i] = 1;
      return action;
    }
  }
  
  // Fallback
  action[0] = 1;
  return action;
}
*/
`;
  }
}
