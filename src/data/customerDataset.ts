// Comprehensive customer dataset for the Scorecard Optimizer
// Contains 10 companies with 4 users each (40 total customers)

export interface CustomerData {
  id: string;
  name: string;
  company: string;
  companySize: "Enterprise" | "Mid-Market" | "Startup";
  industry: string;
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
  customerSince: string; // ISO date string
  lastContact: string; // ISO date string
}

// Company data with industry and size information
const companies = [
  { name: "Acme Corp", size: "Enterprise", industry: "Manufacturing" },
  { name: "TechStart Inc", size: "Startup", industry: "Technology" },
  { name: "Global Solutions", size: "Enterprise", industry: "Consulting" },
  { name: "Innovate Labs", size: "Mid-Market", industry: "Research" },
  { name: "DataFlow Systems", size: "Mid-Market", industry: "Technology" },
  { name: "Quantum Industries", size: "Enterprise", industry: "Manufacturing" },
  { name: "Nimble Software", size: "Startup", industry: "Technology" },
  { name: "Apex Consulting", size: "Mid-Market", industry: "Consulting" },
  { name: "Horizon Healthcare", size: "Enterprise", industry: "Healthcare" },
  { name: "Velocity Ventures", size: "Startup", industry: "Finance" },
];

// Generate a realistic dataset with patterns that can be discovered by the optimizer
export const generateComprehensiveDataset = (): CustomerData[] => {
  const dataset: CustomerData[] = [];
  let id = 1;

  // Generate dates within the last 2 years
  const generateDate = (monthsAgo: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    return date.toISOString().split("T")[0];
  };

  companies.forEach((company) => {
    // Create different patterns for each company size
    const isEnterprise = company.size === "Enterprise";
    const isStartup = company.size === "Startup";

    // Generate 4 users per company
    for (let i = 0; i < 4; i++) {
      // Create varied metrics based on company size and user role
      // Enterprise companies tend to have higher contract values but sometimes lower usage
      // Startups have higher usage but lower contract values
      // Mid-market is balanced

      // Base values with some randomness
      let productUsageFrequency =
        Math.floor(Math.random() * 30) +
        (isStartup ? 60 : isEnterprise ? 40 : 50);
      let supportTicketVolume =
        Math.floor(Math.random() * 40) +
        (isStartup ? 40 : isEnterprise ? 20 : 30);
      let featureAdoptionRate =
        Math.floor(Math.random() * 30) +
        (isStartup ? 60 : isEnterprise ? 50 : 55);
      let npsScore =
        Math.floor(Math.random() * 60) -
        30 +
        (isStartup ? 40 : isEnterprise ? 30 : 20); // -100 to 100
      let contractValue =
        Math.floor(Math.random() * 30) +
        (isStartup ? 30 : isEnterprise ? 70 : 50);
      let timeSinceLastLogin =
        Math.floor(Math.random() * 40) +
        (isStartup ? 10 : isEnterprise ? 30 : 20);

      // Ensure values are within bounds
      productUsageFrequency = Math.min(100, Math.max(0, productUsageFrequency));
      supportTicketVolume = Math.min(100, Math.max(0, supportTicketVolume));
      featureAdoptionRate = Math.min(100, Math.max(0, featureAdoptionRate));
      npsScore = Math.min(100, Math.max(-100, npsScore));
      contractValue = Math.min(100, Math.max(0, contractValue));
      timeSinceLastLogin = Math.min(100, Math.max(0, timeSinceLastLogin));

      // Calculate health score based on metrics
      // This formula creates a pattern that the AI can discover
      // Usage metrics have higher impact than others
      const usageWeight = 0.35;
      const supportWeight = 0.15;
      const adoptionWeight = 0.25;
      const npsWeight = 0.05;
      const contractWeight = 0.05;
      const loginWeight = 0.15;

      // Invert metrics where lower is better
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
      const churnProbability = Math.round(100 - healthScore);

      // Determine status based on churn probability
      let status: "healthy" | "at-risk" | "churned";
      if (churnProbability < 30) {
        status = "healthy";
      } else if (churnProbability < 70) {
        status = "at-risk";
      } else {
        status = "churned";
      }

      // Generate realistic dates
      const customerSince = generateDate(Math.floor(Math.random() * 24) + 1); // 1-24 months ago
      const lastContact = generateDate(Math.floor(Math.random() * 3)); // 0-3 months ago

      // Create the customer record
      dataset.push({
        id: `${id}`,
        name: `User ${id}`,
        company: company.name,
        companySize: company.size as "Enterprise" | "Mid-Market" | "Startup",
        industry: company.industry,
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
        customerSince,
        lastContact,
      });

      id++;
    }
  });

  return dataset;
};

// Generate the comprehensive dataset
export const comprehensiveCustomerData = generateComprehensiveDataset();

// Calculate optimized weights based on the dataset
export const calculateOptimizedWeights = (data: CustomerData[]) => {
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

    // Calculate correlation coefficient
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
export const comprehensiveOptimizationResults = calculateOptimizedWeights(
  comprehensiveCustomerData,
);
