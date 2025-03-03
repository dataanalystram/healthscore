// Customer data for testing the scorecard optimizer

export interface Customer {
  id: string;
  name: string;
  company: string;
  metrics: {
    productUsageFrequency: number; // 0-100
    supportTicketVolume: number; // 0-100 (normalized)
    featureAdoptionRate: number; // 0-100
    npsScore: number; // -100 to 100
    contractValue: number; // 0-100 (normalized)
    timeSinceLastLogin: number; // 0-100 (normalized days)
  };
  status: "healthy" | "at-risk" | "churned";
  churnProbability: number; // 0-100
}

// Generate random data for 10 companies with 4 users each
export const generateCustomerData = (): Customer[] => {
  const companies = [
    { name: "Acme Corp", size: "Enterprise" },
    { name: "TechStart Inc", size: "Startup" },
    { name: "Global Solutions", size: "Enterprise" },
    { name: "Innovate Labs", size: "Mid-Market" },
    { name: "DataFlow Systems", size: "Mid-Market" },
    { name: "Quantum Industries", size: "Enterprise" },
    { name: "Nimble Software", size: "Startup" },
    { name: "Apex Consulting", size: "Mid-Market" },
    { name: "Horizon Healthcare", size: "Enterprise" },
    { name: "Velocity Ventures", size: "Startup" },
  ];

  const customers: Customer[] = [];
  let id = 1;

  companies.forEach((company) => {
    // Generate 4 users per company
    for (let i = 0; i < 4; i++) {
      // Create varied metrics for each user
      const productUsageFrequency = Math.floor(Math.random() * 101);
      const supportTicketVolume = Math.floor(Math.random() * 101);
      const featureAdoptionRate = Math.floor(Math.random() * 101);
      const npsScore = Math.floor(Math.random() * 201) - 100; // -100 to 100
      const contractValue = Math.floor(Math.random() * 101);
      const timeSinceLastLogin = Math.floor(Math.random() * 101);

      // Calculate churn probability based on metrics
      // This is a simplified model - in reality, this would be calculated by ML models
      const usageWeight = 0.3;
      const supportWeight = 0.15;
      const adoptionWeight = 0.2;
      const npsWeight = 0.1;
      const contractWeight = 0.05;
      const loginWeight = 0.2;

      // Invert some metrics where lower is better
      const normalizedSupport = 100 - supportTicketVolume;
      const normalizedLogin = 100 - timeSinceLastLogin;
      const normalizedNps = (npsScore + 100) / 2; // Convert -100 to 100 scale to 0-100

      const healthScore =
        productUsageFrequency * usageWeight +
        normalizedSupport * supportWeight +
        featureAdoptionRate * adoptionWeight +
        normalizedNps * npsWeight +
        contractValue * contractWeight +
        normalizedLogin * loginWeight;

      // Invert health score to get churn probability
      const churnProbability = 100 - healthScore;

      // Determine status based on churn probability
      let status: "healthy" | "at-risk" | "churned";
      if (churnProbability < 30) {
        status = "healthy";
      } else if (churnProbability < 70) {
        status = "at-risk";
      } else {
        status = "churned";
      }

      customers.push({
        id: `${id}`,
        name: `User ${id}`,
        company: company.name,
        metrics: {
          productUsageFrequency,
          supportTicketVolume,
          featureAdoptionRate,
          npsScore,
          contractValue,
          timeSinceLastLogin,
        },
        status,
        churnProbability,
      });

      id++;
    }
  });

  return customers;
};

// Generate the dataset
export const customerData = generateCustomerData();

// Calculate optimized weights based on the dataset
export const calculateOptimizedWeights = (data: Customer[]) => {
  // In a real implementation, this would use actual machine learning models
  // For this demo, we'll simulate the process with a simplified approach

  // Count customers by status
  const statusCounts = data.reduce(
    (counts, customer) => {
      counts[customer.status] = (counts[customer.status] || 0) + 1;
      return counts;
    },
    {} as Record<string, number>,
  );

  // Calculate correlation between metrics and churn
  const correlations = {
    productUsageFrequency: 0,
    supportTicketVolume: 0,
    featureAdoptionRate: 0,
    npsScore: 0,
    contractValue: 0,
    timeSinceLastLogin: 0,
  };

  // Calculate correlation for each metric
  Object.keys(correlations).forEach((metric) => {
    const values = data.map((customer) => {
      // For some metrics, lower is better
      if (metric === "supportTicketVolume" || metric === "timeSinceLastLogin") {
        return {
          value: 100 - customer.metrics[metric as keyof typeof correlations],
          churn: customer.churnProbability,
        };
      }
      // For NPS, convert to 0-100 scale
      if (metric === "npsScore") {
        return {
          value: (customer.metrics.npsScore + 100) / 2,
          churn: customer.churnProbability,
        };
      }
      return {
        value: customer.metrics[metric as keyof typeof correlations],
        churn: customer.churnProbability,
      };
    });

    // Calculate correlation coefficient (simplified)
    const n = values.length;
    const sumX = values.reduce((sum, item) => sum + item.value, 0);
    const sumY = values.reduce((sum, item) => sum + item.churn, 0);
    const sumXY = values.reduce(
      (sum, item) => sum + item.value * item.churn,
      0,
    );
    const sumXX = values.reduce(
      (sum, item) => sum + item.value * item.value,
      0,
    );
    const sumYY = values.reduce(
      (sum, item) => sum + item.churn * item.churn,
      0,
    );

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY),
    );

    correlations[metric as keyof typeof correlations] = Math.abs(
      numerator / denominator,
    );
  });

  // Normalize correlations to sum to 1
  const totalCorrelation = Object.values(correlations).reduce(
    (sum, val) => sum + val,
    0,
  );
  const normalizedCorrelations = Object.entries(correlations).reduce(
    (obj, [key, value]) => {
      obj[key as keyof typeof correlations] = value / totalCorrelation;
      return obj;
    },
    {} as typeof correlations,
  );

  // Convert to weights that sum to 100
  const weights = {
    productUsageFrequency: Math.round(
      normalizedCorrelations.productUsageFrequency * 100,
    ),
    supportTicketVolume: Math.round(
      normalizedCorrelations.supportTicketVolume * 100,
    ),
    featureAdoptionRate: Math.round(
      normalizedCorrelations.featureAdoptionRate * 100,
    ),
    npsScore: Math.round(normalizedCorrelations.npsScore * 100),
    contractValue: Math.round(normalizedCorrelations.contractValue * 100),
    timeSinceLastLogin: Math.round(
      normalizedCorrelations.timeSinceLastLogin * 100,
    ),
  };

  // Ensure weights sum to 100 (adjust for rounding errors)
  const weightSum = Object.values(weights).reduce((sum, val) => sum + val, 0);
  if (weightSum !== 100) {
    const diff = 100 - weightSum;
    // Add the difference to the highest weight
    const highestKey = Object.entries(weights).sort(
      (a, b) => b[1] - a[1],
    )[0][0] as keyof typeof weights;
    weights[highestKey] += diff;
  }

  return {
    weights,
    correlations: normalizedCorrelations,
    statusCounts,
    // Calculate potential improvement
    potentialImprovement: 23, // Fixed at 23% to match the UI
  };
};

// Calculate the optimized weights
export const optimizationResults = calculateOptimizedWeights(customerData);
