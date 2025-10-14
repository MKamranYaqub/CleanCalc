
export const LOAN_TYPES = {
  MAX_OPTIMUM_GROSS: "Max Optimum Gross Loan",
  SPECIFIC_NET: "Specific Net Loan",
  MAX_LTV: "Maximum LTV Loan",
  SPECIFIC_GROSS: "Specific Gross Loan",
};

export const PRODUCT_GROUPS = {
  SPECIALIST: "Specialist",
  CORE: "Core",
};

export const PROPERTY_TYPES = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  SEMI_COMMERCIAL: "Semi-Commercial",
};

export const RETENTION_OPTIONS = {
  YES: "Yes",
  NO: "No",
};

export const RETENTION_LTV_RANGES = {
  LTV_65: "65",
  LTV_75: "75",
};

export const CORE_FLOOR_RATE = 0.055; // 5.5%

export const PRODUCT_TYPES_LIST = {
  Residential: ["2yr Fix", "3yr Fix", "2yr Tracker"],
  Commercial: ["2yr Fix", "3yr Fix", "2yr Tracker"],
  "Semi-Commercial": ["2yr Fix", "3yr Fix", "2yr Tracker"],
};

export const FEE_COLUMNS = {
  Residential: [6, 4, 3, 2],
  Commercial: [6, 4, 2],
  RetentionResidential: [5.5, 3.5, 2.5, 1.5],
  RetentionCommercial: [5.5, 3.5, 1.5],
  Core: [6, 4, 3, 2],
  Core_Retention_65: [5.5, 3.5, 2.5, 1.5],
  Core_Retention_75: [5.5, 3.5, 2.5, 1.5],
};