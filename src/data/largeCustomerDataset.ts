/**
 * Large Customer Dataset for the Scorecard Optimizer
 * Contains 250 companies with multiple users per company (1000+ total customers)
 */

import { CustomerData } from "./customerDataset";

// Define the customer health model interface
export interface CustomerHealthModel {
  weights: Record<string, number>;
  importance: Record<string, number>;
  accuracy: number;
  f1Score: number;
  rocAuc: number;
}

// Generate a large dataset of 250 companies with multiple users per company
export const generateLargeDataset = (): CustomerData[] => {
  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Manufacturing",
    "Retail",
    "Education",
    "Consulting",
    "Media",
    "Energy",
    "Transportation",
    "Telecommunications",
    "Real Estate",
    "Hospitality",
    "Agriculture",
    "Construction",
  ];

  const companySizes = ["Enterprise", "Mid-Market", "Startup"] as (
    | "Enterprise"
    | "Mid-Market"
    | "Startup"
  )[];

  const dataset: CustomerData[] = [];
  let id = 1;

  // Generate dates within the last 2 years
  const generateDate = (monthsAgo: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    return date.toISOString().split("T")[0];
  };

  // Generate company names
  const companyPrefixes = [
    "Tech",
    "Global",
    "Advanced",
    "Smart",
    "Innovative",
    "Digital",
    "Future",
    "Bright",
    "Rapid",
    "Dynamic",
    "Strategic",
    "Premier",
    "Elite",
    "Prime",
    "Next",
  ];

  const companySuffixes = [
    "Systems",
    "Solutions",
    "Technologies",
    "Innovations",
    "Enterprises",
    "Group",
    "Partners",
    "Associates",
    "Networks",
    "Industries",
    "Applications",
    "Dynamics",
    "Platforms",
    "Services",
    "Labs",
  ];

  // Generate 250 companies
  for (let companyIndex = 0; companyIndex < 250; companyIndex++) {
    // Generate a random company name
    const prefix =
      companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)];
    const suffix =
      companySuffixes[Math.floor(Math.random() * companySuffixes.length)];
    const companyName = `${prefix} ${suffix}`;

    // Assign random company size and industry
    const companySize =
      companySizes[Math.floor(Math.random() * companySizes.length)];
    const industry = industries[Math.floor(Math.random() * industries.length)];

    // Generate between 2-8 users per company
    const userCount = Math.floor(Math.random() * 7) + 2;

    // Create patterns based on company size
    const isEnterprise = companySize === "Enterprise";
    const isStartup = companySize === "Startup";

    // Base metrics for this company - will be modified per user
    const baseProductUsage = isStartup ? 70 : isEnterprise ? 50 : 60;
    const baseSupportTickets = isStartup ? 40 : isEnterprise ? 20 : 30;
    const baseFeatureAdoption = isStartup ? 65 : isEnterprise ? 55 : 60;
    const baseNps = isStartup ? 40 : isEnterprise ? 30 : 35;
    const baseContractValue = isStartup ? 30 : isEnterprise ? 80 : 55;
    const baseLoginTime = isStartup ? 15 : isEnterprise ? 30 : 25;

    // Company-wide status tendency (some companies are generally healthier than others)
    const companyHealthBias = Math.random();
    const healthyCompany = companyHealthBias > 0.7;
    const atRiskCompany = companyHealthBias < 0.3;

    // Generate users for this company
    for (let userIndex = 0; userIndex < userCount; userIndex++) {
      // Add variation to the base metrics for each user
      let productUsageFrequency = Math.floor(
        baseProductUsage + (Math.random() * 30 - 15),
      );
      let supportTicketVolume = Math.floor(
        baseSupportTickets + (Math.random() * 30 - 15),
      );
      let featureAdoptionRate = Math.floor(
        baseFeatureAdoption + (Math.random() * 30 - 15),
      );
      let npsScore = Math.floor(baseNps + (Math.random() * 60 - 30));
      let contractValue = Math.floor(
        baseContractValue + (Math.random() * 30 - 15),
      );
      let timeSinceLastLogin = Math.floor(
        baseLoginTime + (Math.random() * 30 - 15),
      );

      // Ensure values are within bounds
      productUsageFrequency = Math.min(100, Math.max(0, productUsageFrequency));
      supportTicketVolume = Math.min(100, Math.max(0, supportTicketVolume));
      featureAdoptionRate = Math.min(100, Math.max(0, featureAdoptionRate));
      npsScore = Math.min(100, Math.max(-100, npsScore));
      contractValue = Math.min(100, Math.max(0, contractValue));
      timeSinceLastLogin = Math.min(100, Math.max(0, timeSinceLastLogin));

      // Calculate health score with the "true" weights
      // These weights are what the AI should discover
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

      // Determine status based on health score and company bias
      let status: "healthy" | "at-risk" | "churned";
      const churnProbability = Math.round(100 - healthScore);

      if (healthyCompany) {
        status =
          churnProbability < 40
            ? "healthy"
            : churnProbability < 80
              ? "at-risk"
              : "churned";
      } else if (atRiskCompany) {
        status =
          churnProbability < 20
            ? "healthy"
            : churnProbability < 60
              ? "at-risk"
              : "churned";
      } else {
        status =
          churnProbability < 30
            ? "healthy"
            : churnProbability < 70
              ? "at-risk"
              : "churned";
      }

      // Generate realistic dates
      const customerSince = generateDate(Math.floor(Math.random() * 24) + 1); // 1-24 months ago
      const lastContact = generateDate(Math.floor(Math.random() * 3)); // 0-3 months ago

      // Create the customer record
      dataset.push({
        id: `${id}`,
        name: `User ${id}`,
        company: companyName,
        companySize,
        industry,
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
  }

  return dataset;
};

// Generate the large dataset
export const largeCustomerData = generateLargeDataset();

// Define the "true" weights that the AI should discover
export const largeDatasetOptimizationResults: CustomerHealthModel = {
  weights: {
    productUsageFrequency: 35,
    supportTicketVolume: 15,
    featureAdoptionRate: 25,
    npsScore: 5,
    contractValue: 5,
    timeSinceLastLogin: 15,
  },
  importance: {
    productUsageFrequency: 0.35,
    supportTicketVolume: 0.15,
    featureAdoptionRate: 0.25,
    npsScore: 0.05,
    contractValue: 0.05,
    timeSinceLastLogin: 0.15,
  },
  accuracy: 0.97,
  f1Score: 0.95,
  rocAuc: 0.98,
};
