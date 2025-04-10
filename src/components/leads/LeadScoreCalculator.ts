import { Lead, LeadPriority } from "@/types/lead";

/**
 * Lead Score Algorithm
 *
 * Calculates a lead score from 0-100 based on various factors, including:
 * - Lead priority
 * - Lead status
 * - Deal value
 * - Industry
 * - Company size
 * - Time since last contact
 * - Company revenue
 */
export const calculateLeadScore = (lead: Lead): number => {
  let score = 50; // Base score

  // Priority factor (up to 20 points)
  if (lead.priority === "high") {
    score += 20;
  } else if (lead.priority === "medium") {
    score += 10;
  }

  // Status factor (up to 25 points)
  const statusPoints: { [key in string]?: number } = {
    new: 5,
    contacted: 10,
    qualified: 15,
    proposal: 20,
    negotiation: 25,
    closed: 15,
    lost: -10,
  };

  score += statusPoints[lead.status] || 0;

  // Value factor (up to 20 points)
  if (lead.value) {
    if (lead.value >= 100000) {
      score += 20;
    } else if (lead.value >= 50000) {
      score += 15;
    } else if (lead.value >= 25000) {
      score += 10;
    } else if (lead.value >= 10000) {
      score += 5;
    } else {
      score += 3;
    }
  }

  // Industry factor (up to 5 points)
  // Certain industries might be more valuable to the business
  const highValueIndustries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Energy",
    "Telecommunications",
  ];
  const mediumValueIndustries = [
    "Manufacturing",
    "Education",
    "Retail",
    "Media",
    "Real Estate",
  ];

  if (lead.industry) {
    if (
      highValueIndustries.some((industry) => lead.industry?.includes(industry))
    ) {
      score += 5;
    } else if (
      mediumValueIndustries.some((industry) =>
        lead.industry?.includes(industry)
      )
    ) {
      score += 3;
    }
  }

  // Company size factor (up to 10 points)
  if (lead.companySize) {
    if (
      lead.companySize.includes("1000+") ||
      lead.companySize.includes("5000+") ||
      lead.companySize.includes("Enterprise")
    ) {
      score += 10;
    } else if (
      lead.companySize.includes("501-") ||
      lead.companySize.includes("201-") ||
      lead.companySize.includes("Large")
    ) {
      score += 7;
    } else if (
      lead.companySize.includes("51-") ||
      lead.companySize.includes("Medium")
    ) {
      score += 5;
    } else {
      score += 2;
    }
  }

  // Revenue factor (up to 10 points)
  if (lead.revenue) {
    if (lead.revenue >= 10000000) {
      score += 10;
    } else if (lead.revenue >= 5000000) {
      score += 7;
    } else if (lead.revenue >= 1000000) {
      score += 5;
    } else {
      score += 2;
    }
  }

  // Recent contact factor (up to 5 points)
  if (lead.lastContactedAt) {
    const daysSinceLastContact = Math.floor(
      (Date.now() - new Date(lead.lastContactedAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastContact < 7) {
      score += 5; // Contacted within the last week
    } else if (daysSinceLastContact < 14) {
      score += 3; // Contacted within the last two weeks
    } else if (daysSinceLastContact < 30) {
      score += 1; // Contacted within the last month
    } else if (daysSinceLastContact > 60) {
      score -= 5; // Not contacted for over two months
    } else if (daysSinceLastContact > 30) {
      score -= 2; // Not contacted for over a month
    }
  } else {
    score -= 5; // Never contacted
  }

  // Cap the score between 0 and 100
  return Math.min(Math.max(0, Math.round(score)), 100);
};

// Get color for score visualization
export const getScoreColor = (score: number): string => {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-blue-500";
  if (score >= 40) return "bg-yellow-500";
  return "bg-rose-500";
};

// Get classification based on score
export const getScoreClassification = (score: number): string => {
  if (score >= 80) return "Hot";
  if (score >= 60) return "Warm";
  if (score >= 40) return "Cool";
  return "Cold";
};

// Get priority based on score
export const getPriorityFromScore = (score: number): LeadPriority => {
  if (score >= 80) return "high";
  if (score >= 50) return "medium";
  return "low";
};
