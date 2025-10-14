// Product Groups
export const PRODUCT_GROUPS = {
  SPECIALIST: 'specialist',
  CORE: 'core',
};

// Property Types
export const PROPERTY_TYPES = {
  RESIDENTIAL: 'Residential',
  SEMI_COMMERCIAL: 'Semi-Commercial',
  COMMERCIAL: 'Commercial',
};

// Tiers
export const TIERS = {
  TIER_1: 'Tier 1',
  TIER_2: 'Tier 2',
  TIER_3: 'Tier 3',
};

// LTV Bands by Property Type
export const LTV_BANDS = {
  RESIDENTIAL: [6, 4, 3, 2],
  SEMI_COMMERCIAL: [6, 4, 2],
  COMMERCIAL: [6, 4, 2],
};

// Retention LTV Bands by Property Type
export const RETENTION_LTV_BANDS = {
  RESIDENTIAL: [5.5, 3.5, 2.5, 1.5],
  SEMI_COMMERCIAL: [5.5, 3.5, 1.5],
  COMMERCIAL: [5.5, 3.5, 1.5],
};

// Available Tiers by Property Type
export const AVAILABLE_TIERS = {
  RESIDENTIAL: [TIERS.TIER_1, TIERS.TIER_2, TIERS.TIER_3],
  SEMI_COMMERCIAL: [TIERS.TIER_1, TIERS.TIER_2],
  COMMERCIAL: [TIERS.TIER_1, TIERS.TIER_2],
}; // Fixed missing closing brace here

export const CORE_FLOOR_RATE = 0.055; // 5.5%

export const FEE_COLUMNS = {
  Residential: [6, 4, 3, 2],
  Commercial: [6, 4, 2],
  RetentionResidential: [5.5, 3.5, 2.5, 1.5],
  RetentionCommercial: [5.5, 3.5, 1.5],
  Core: [6, 4, 3, 2],
  Core_Retention_65: [5.5, 3.5, 2.5, 1.5],
  Core_Retention_75: [5.5, 3.5, 2.5, 1.5],
};

// Loan Types
export const LOAN_TYPES = {
  MAX_OPTIMUM_GROSS: 'Maximum Optimum Gross Loan',
  SPECIFIC_NET: 'Specific Net Loan',
  MAX_LTV: 'Maximum LTV Loan',
  SPECIFIC_GROSS: 'Specific Gross Loan',
};

// Product Types by Property Type
export const PRODUCT_TYPES_LIST = {
  Residential: ['2yr Fix', '3yr Fix', '2yr Tracker'],
  'Semi-Commercial': ['2yr Fix', '3yr Fix', '2yr Tracker'],
  Commercial: ['2yr Fix', '3yr Fix', '2yr Tracker'],
};