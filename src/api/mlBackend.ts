/**
 * ML Backend API Integration
 *
 * This module provides integration with the FastAPI backend for the AI-Driven Scorecard Optimizer.
 */

import { ScoreOptimizer } from "@/ml/scoreOptimizer";

interface TrainingJob {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  created_at: string;
  completed_at?: string;
  results?: any;
  error?: string;
}

interface CustomerData {
  id: string;
  features: Record<string, number>;
  target?: number;
}

interface ScoringResult {
  customer_id: string;
  score: number;
  prediction: number;
  explanation?: string;
}

export class MLBackendAPI {
  private baseUrl: string;
  private optimizer: ScoreOptimizer | null = null;

  constructor(baseUrl = "http://localhost:8000") {
    this.baseUrl = baseUrl;
  }

  /**
   * Initialize the ML backend connection
   */
  async initialize(): Promise<boolean> {
    try {
      // Check if backend is available
      const response = await fetch(`${this.baseUrl}/api/health`);
      if (!response.ok) {
        throw new Error(`Backend health check failed: ${response.statusText}`);
      }

      // Initialize local optimizer as fallback
      this.optimizer = new ScoreOptimizer();

      return true;
    } catch (error) {
      console.error("Failed to initialize ML backend:", error);
      // Initialize local optimizer as fallback
      this.optimizer = new ScoreOptimizer();
      return false;
    }
  }

  /**
   * Start a new model training job
   */
  async startTrainingJob(data: CustomerData[]): Promise<TrainingJob | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ml/training`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        throw new Error(`Failed to start training job: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error starting training job:", error);
      return null;
    }
  }

  /**
   * Get the status of a training job
   */
  async getTrainingJobStatus(jobId: string): Promise<TrainingJob | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ml/training/${jobId}`);

      if (!response.ok) {
        throw new Error(
          `Failed to get training job status: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting training job status:", error);
      return null;
    }
  }

  /**
   * Get the latest training job
   */
  async getLatestTrainingJob(): Promise<TrainingJob | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ml/training/latest`);

      if (!response.ok) {
        throw new Error(
          `Failed to get latest training job: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting latest training job:", error);
      return null;
    }
  }

  /**
   * Score a customer using the backend API
   */
  async scoreCustomer(
    customerData: Record<string, any>,
  ): Promise<ScoringResult | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ml/score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customer_data: customerData }),
      });

      if (!response.ok) {
        throw new Error(`Failed to score customer: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error scoring customer:", error);

      // Fallback to local scoring if backend fails
      if (this.optimizer) {
        const score = this.optimizer.calculateHealthScore(customerData);
        return {
          customer_id: customerData.id || customerData.customer_id || "unknown",
          score,
          prediction: score >= 50 ? 0 : 1,
        };
      }

      return null;
    }
  }

  /**
   * Optimize weights using the backend API
   */
  async optimizeWeights(
    data: CustomerData[],
    targetCol: string,
  ): Promise<Record<string, number> | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ml/optimize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data, target_col: targetCol }),
      });

      if (!response.ok) {
        throw new Error(`Failed to optimize weights: ${response.statusText}`);
      }

      const result = await response.json();
      return result.weights;
    } catch (error) {
      console.error("Error optimizing weights:", error);

      // Fallback to local optimization if backend fails
      if (this.optimizer) {
        return this.optimizer.optimizeWeightsBayesian(
          data.map((d) => ({ ...d.features, [targetCol]: d.target || 0 })),
          targetCol,
          20,
        );
      }

      return null;
    }
  }

  /**
   * Upload a CSV file for processing
   */
  async uploadCSV(
    file: File,
  ): Promise<{ success: boolean; message: string; data?: any[] }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${this.baseUrl}/api/ml/upload-csv`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload CSV: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error uploading CSV:", error);
      return { success: false, message: String(error) };
    }
  }

  /**
   * Set up an A/B test for weight optimization
   */
  async setupABTest(
    testName: string,
    variants: any[],
    allocation?: number[],
  ): Promise<any | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ml/ab-test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test_name: testName, variants, allocation }),
      });

      if (!response.ok) {
        throw new Error(`Failed to set up A/B test: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error setting up A/B test:", error);

      // Fallback to local A/B test setup if backend fails
      if (this.optimizer) {
        return this.optimizer.setupABTest(testName, variants, allocation);
      }

      return null;
    }
  }
}

// Create a singleton instance
export const mlBackend = new MLBackendAPI();
