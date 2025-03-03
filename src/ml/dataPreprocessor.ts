/**
 * Data Preprocessor Module
 *
 * This module implements data preprocessing functionality for the AI-Driven Scorecard Optimizer,
 * including cleaning, normalization, and feature engineering.
 */

interface PreprocessorOptions {
  categoricalFeatures?: string[];
  numericalFeatures?: string[];
  textFeatures?: string[];
  dateFeatures?: string[];
  target?: string;
}

export class DataPreprocessor {
  private categoricalFeatures: string[];
  private numericalFeatures: string[];
  private textFeatures: string[];
  private dateFeatures: string[];
  private target: string | null;

  private imputers: Record<string, any> = {};
  private scalers: Record<string, any> = {};
  private encoders: Record<string, any> = {};
  private textVectorizers: Record<string, any> = {};

  constructor(options: PreprocessorOptions = {}) {
    this.categoricalFeatures = options.categoricalFeatures || [];
    this.numericalFeatures = options.numericalFeatures || [];
    this.textFeatures = options.textFeatures || [];
    this.dateFeatures = options.dateFeatures || [];
    this.target = options.target || null;
  }

  /**
   * Fit the preprocessor on training data
   */
  fit(data: any[]): DataPreprocessor {
    console.log("Fitting preprocessor on training data...");

    // In a real implementation, this would fit scalers, encoders, etc.
    // For this demo, we'll simulate the fitting process

    // Handle numerical features
    for (const col of this.numericalFeatures) {
      // Create simulated scaler for the feature
      this.scalers[col] = {
        transform: (values: number[]) => {
          // Simulate min-max scaling
          const min = Math.min(...values);
          const max = Math.max(...values);
          return values.map((v) => (max > min ? (v - min) / (max - min) : 0));
        },
      };
    }

    // Handle categorical features
    for (const col of this.categoricalFeatures) {
      // Create simulated encoder for categorical feature
      this.encoders[col] = {
        transform: (values: any[]) => {
          // Simulate one-hot encoding
          const uniqueValues = Array.from(new Set(values));
          return values.map((v) => {
            const encoded = Array(uniqueValues.length).fill(0);
            const index = uniqueValues.indexOf(v);
            if (index >= 0) encoded[index] = 1;
            return encoded;
          });
        },
        categories: Array.from(new Set(data.map((item) => item[col]))),
      };
    }

    // Handle text features
    for (const col of this.textFeatures) {
      // Create simulated vectorizer for text features
      this.textVectorizers[col] = {
        transform: (texts: string[]) => {
          // Simulate TF-IDF vectorization (very simplified)
          return texts.map((text) => {
            // Create a simple bag-of-words representation
            const words = text
              .toLowerCase()
              .split(/\W+/)
              .filter((w) => w.length > 0);
            const wordCounts: Record<string, number> = {};

            for (const word of words) {
              wordCounts[word] = (wordCounts[word] || 0) + 1;
            }

            // Return a fixed-length vector (simplified)
            return Array(10)
              .fill(0)
              .map(() => Math.random());
          });
        },
      };
    }

    return this;
  }

  /**
   * Transform data using the fitted preprocessor
   */
  transform(data: any[]): any[] {
    console.log("Transforming data...");

    // In a real implementation, this would apply the fitted transformations
    // For this demo, we'll simulate the transformation process

    // Create a deep copy of the data
    const transformedData = JSON.parse(JSON.stringify(data));

    // Process numerical features
    for (const col of this.numericalFeatures) {
      if (col in this.scalers) {
        // Extract values for the column
        const values = transformedData.map((item: any) => item[col] || 0);

        // Scale the values
        const scaledValues = this.scalers[col].transform(values);

        // Update the data
        transformedData.forEach((item: any, i: number) => {
          item[col] = scaledValues[i];
        });
      }
    }

    // Process categorical features
    for (const col of this.categoricalFeatures) {
      if (col in this.encoders) {
        // Extract values for the column
        const values = transformedData.map((item: any) => item[col] || "");

        // Encode the values
        const encodedValues = this.encoders[col].transform(values);

        // Update the data
        transformedData.forEach((item: any, i: number) => {
          // Add encoded columns and remove original
          const categories = this.encoders[col].categories;

          for (let j = 0; j < categories.length; j++) {
            item[`${col}_${categories[j]}`] = encodedValues[i][j];
          }

          delete item[col];
        });
      }
    }

    // Process text features
    for (const col of this.textFeatures) {
      if (col in this.textVectorizers) {
        // Extract values for the column
        const values = transformedData.map((item: any) =>
          (item[col] || "").toString(),
        );

        // Vectorize the values
        const vectorizedValues = this.textVectorizers[col].transform(values);

        // Update the data
        transformedData.forEach((item: any, i: number) => {
          // Add vectorized columns and remove original
          for (let j = 0; j < vectorizedValues[i].length; j++) {
            item[`${col}_tfidf_${j}`] = vectorizedValues[i][j];
          }

          // Add sentiment analysis feature (simplified)
          item[`${col}_sentiment`] = Math.random() * 2 - 1; // -1 to 1

          // Add word count feature
          item[`${col}_word_count`] = (item[col] || "")
            .toString()
            .split(/\s+/).length;

          delete item[col];
        });
      }
    }

    // Process date features
    for (const col of this.dateFeatures) {
      transformedData.forEach((item: any) => {
        if (item[col]) {
          try {
            // Convert to date
            const date = new Date(item[col]);

            // Extract useful components
            item[`${col}_year`] = date.getFullYear();
            item[`${col}_month`] = date.getMonth() + 1;
            item[`${col}_day`] = date.getDate();
            item[`${col}_dayofweek`] = date.getDay();

            // Calculate time since the date
            const now = new Date();
            item[`${col}_days_since`] = Math.floor(
              (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
            );

            // Remove original date column
            delete item[col];
          } catch (e) {
            console.error(`Error processing date column ${col}: ${e}`);
          }
        }
      });
    }

    return transformedData;
  }

  /**
   * Fit the preprocessor and transform the data in one step
   */
  fitTransform(data: any[]): any[] {
    this.fit(data);
    return this.transform(data);
  }

  /**
   * Create time-based features from a time series
   */
  createTimeFeatures(data: any[], timeCol: string): any[] {
    console.log(`Creating time features from column ${timeCol}...`);

    // Create a deep copy of the data
    const resultData = JSON.parse(JSON.stringify(data));

    resultData.forEach((item: any) => {
      if (item[timeCol]) {
        try {
          // Convert to date
          const date = new Date(item[timeCol]);

          // Extract time components
          item[`${timeCol}_dayofweek`] = date.getDay();
          item[`${timeCol}_month`] = date.getMonth() + 1;
          item[`${timeCol}_year`] = date.getFullYear();
          item[`${timeCol}_hour`] = date.getHours();

          // Add cyclical features for time components
          item[`${timeCol}_hour_sin`] = Math.sin(
            (2 * Math.PI * date.getHours()) / 24,
          );
          item[`${timeCol}_hour_cos`] = Math.cos(
            (2 * Math.PI * date.getHours()) / 24,
          );
          item[`${timeCol}_day_sin`] = Math.sin(
            (2 * Math.PI * date.getDay()) / 7,
          );
          item[`${timeCol}_day_cos`] = Math.cos(
            (2 * Math.PI * date.getDay()) / 7,
          );
          item[`${timeCol}_month_sin`] = Math.sin(
            (2 * Math.PI * (date.getMonth() + 1)) / 12,
          );
          item[`${timeCol}_month_cos`] = Math.cos(
            (2 * Math.PI * (date.getMonth() + 1)) / 12,
          );
        } catch (e) {
          console.error(
            `Error creating time features for column ${timeCol}: ${e}`,
          );
        }
      }
    });

    return resultData;
  }

  /**
   * Create interaction features between pairs of numerical features
   */
  createInteractionFeatures(
    data: any[],
    featurePairs: [string, string][],
  ): any[] {
    console.log("Creating interaction features...");

    // Create a deep copy of the data
    const resultData = JSON.parse(JSON.stringify(data));

    for (const [feature1, feature2] of featurePairs) {
      resultData.forEach((item: any) => {
        if (feature1 in item && feature2 in item) {
          try {
            // Create multiplicative interaction
            item[`${feature1}_x_${feature2}`] = item[feature1] * item[feature2];

            // Create additive interaction
            item[`${feature1}_plus_${feature2}`] =
              item[feature1] + item[feature2];

            // Create ratio features (with handling for division by zero)
            item[`${feature1}_div_${feature2}`] =
              item[feature1] / (item[feature2] || 1);
            item[`${feature2}_div_${feature1}`] =
              item[feature2] / (item[feature1] || 1);
          } catch (e) {
            console.error(
              `Error creating interaction between ${feature1} and ${feature2}: ${e}`,
            );
          }
        }
      });
    }

    return resultData;
  }

  /**
   * Detect and handle outliers in numerical features
   */
  detectAndHandleOutliers(data: any[], method = "IQR", threshold = 1.5): any[] {
    console.log(`Detecting and handling outliers using ${method} method...`);

    // Create a deep copy of the data
    const resultData = JSON.parse(JSON.stringify(data));

    for (const col of this.numericalFeatures) {
      if (!data.some((item) => col in item)) continue;

      // Extract values for the column
      const values = data
        .map((item) => item[col])
        .filter((v) => v !== undefined && v !== null);

      if (method === "IQR") {
        // IQR method
        values.sort((a, b) => a - b);
        const q1 = values[Math.floor(values.length * 0.25)];
        const q3 = values[Math.floor(values.length * 0.75)];
        const iqr = q3 - q1;

        const lowerBound = q1 - threshold * iqr;
        const upperBound = q3 + threshold * iqr;

        // Replace outliers with bounds
        resultData.forEach((item: any) => {
          if (col in item) {
            if (item[col] < lowerBound) item[col] = lowerBound;
            if (item[col] > upperBound) item[col] = upperBound;
          }
        });
      } else if (method === "zscore") {
        // Z-score method
        const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
        const squaredDiffs = values.map((v) => Math.pow(v - mean, 2));
        const variance =
          squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length;
        const std = Math.sqrt(variance);

        // Replace values beyond threshold standard deviations
        resultData.forEach((item: any) => {
          if (col in item) {
            const zscore = Math.abs((item[col] - mean) / std);
            if (zscore > threshold) item[col] = mean;
          }
        });
      }
    }

    return resultData;
  }

  /**
   * Process text data to extract NLP features
   */
  processNLPFeatures(data: any[], textCol: string): any[] {
    console.log(`Processing NLP features for column ${textCol}...`);

    if (!data.some((item) => textCol in item)) {
      return data;
    }

    // Create a deep copy of the data
    const resultData = JSON.parse(JSON.stringify(data));

    resultData.forEach((item: any) => {
      if (textCol in item) {
        try {
          const text = (item[textCol] || "").toString();

          // Clean text
          item[`${textCol}_clean`] = this.cleanText(text);

          // Extract sentiment (simplified)
          item[`${textCol}_sentiment`] = this.calculateSentiment(text);

          // Create sentiment categories
          const sentiment = item[`${textCol}_sentiment`];
          item[`${textCol}_sentiment_category`] =
            sentiment > 0.05
              ? "positive"
              : sentiment < -0.05
                ? "negative"
                : "neutral";

          // Basic text features
          item[`${textCol}_word_count`] = text.split(/\s+/).length;
          item[`${textCol}_char_count`] = text.length;

          const words = text.split(/\s+/).filter((w) => w.length > 0);
          item[`${textCol}_avg_word_length`] =
            words.length > 0
              ? words.reduce((sum, w) => sum + w.length, 0) / words.length
              : 0;

          // Extract entities (simple approach)
          item[`${textCol}_has_number`] = /\d/.test(text);
        } catch (e) {
          console.error(
            `Error processing NLP features for column ${textCol}: ${e}`,
          );
        }
      }
    });

    return resultData;
  }

  /**
   * Clean text by removing special characters, lowercasing, etc.
   */
  private cleanText(text: string): string {
    if (!text) return "";

    // Convert to lowercase
    text = text.toLowerCase();

    // Remove special characters and numbers
    text = text.replace(/[^a-zA-Z\s]/g, "");

    // Remove extra whitespace
    text = text.replace(/\s+/g, " ").trim();

    // Remove common stopwords (simplified)
    const stopwords = [
      "the",
      "and",
      "a",
      "an",
      "in",
      "on",
      "at",
      "to",
      "for",
      "with",
      "by",
    ];
    const words = text.split(" ").filter((word) => !stopwords.includes(word));

    return words.join(" ");
  }

  /**
   * Calculate sentiment score for text (simplified)
   */
  private calculateSentiment(text: string): number {
    if (!text) return 0;

    // Very simplified sentiment analysis
    const positiveWords = [
      "good",
      "great",
      "excellent",
      "amazing",
      "wonderful",
      "best",
      "love",
      "happy",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "worst",
      "hate",
      "poor",
      "disappointed",
      "negative",
    ];

    const words = text
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 0);

    let score = 0;
    for (const word of words) {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    }

    // Normalize to [-1, 1]
    return words.length > 0 ? score / Math.sqrt(words.length) : 0;
  }
}
