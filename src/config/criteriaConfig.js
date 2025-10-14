import { PROPERTY_TYPES } from './constants';

// Residential Criteria Questions
export const RESIDENTIAL_CRITERIA = [
  {
    id: 'holidayLet',
    question: 'Holiday Let?',
    options: ['No', 'Yes'],
    tier1: 'No',
    tier2: 'No',
    tier3: 'Yes',
    coreEligible: 'No',
  },
  {
    id: 'hmo',
    question: 'HMO (House in Multiple Occupation)?',
    options: ['No', 'Yes'],
    tier1: 'No',
    tier2: 'Yes',
    tier3: 'Yes',
    coreEligible: 'No',
  },
  {
    id: 'newBuild',
    question: 'New Build?',
    options: ['No', 'Yes'],
    tier1: 'No',
    tier2: 'Yes',
    tier3: 'Yes',
    coreEligible: 'No',
  },
  {
    id: 'offshoreCompany',
    question: 'Offshore Company Ownership?',
    options: ['No', 'Yes'],
    tier1: 'No',
    tier2: 'No',
    tier3: 'Yes',
    coreEligible: 'No',
  },
  {
    id: 'ccj',
    question: 'CCJs in last 3 years?',
    options: ['No', 'Yes'],
    tier1: 'No',
    tier2: 'No',
    tier3: 'Yes',
    coreEligible: 'No',
  },
  {
    id: 'adverse',
    question: 'Adverse Credit History?',
    options: ['No', 'Minor', 'Severe'],
    tier1: 'No',
    tier2: 'Minor',
    tier3: 'Severe',
    coreEligible: 'No',
  },
];

// Commercial/Semi-Commercial Criteria Questions
export const COMMERCIAL_CRITERIA = [
  {
    id: 'companyOwnership',
    question: 'Company Ownership Type?',
    options: ['UK Ltd', 'Offshore', 'Partnership'],
    tier1: 'UK Ltd',
    tier2: 'Partnership',
    coreEligible: null, // Core not available for commercial
  },
  {
    id: 'tradingHistory',
    question: 'Trading History?',
    options: ['3+ years', '1-3 years', 'Less than 1 year'],
    tier1: '3+ years',
    tier2: '1-3 years',
    coreEligible: null,
  },
  {
    id: 'tenancy',
    question: 'Tenancy Status?',
    options: ['Occupied', 'Vacant', 'Part Occupied'],
    tier1: 'Occupied',
    tier2: 'Part Occupied',
    coreEligible: null,
  },
  {
    id: 'propertyCondition',
    question: 'Property Condition?',
    options: ['Good', 'Fair', 'Needs Work'],
    tier1: 'Good',
    tier2: 'Fair',
    coreEligible: null,
  },
  {
    id: 'commercialCCJ',
    question: 'Company CCJs in last 3 years?',
    options: ['No', 'Yes'],
    tier1: 'No',
    tier2: 'No',
    coreEligible: null,
  },
];

// Get criteria based on property type
export const getCriteriaForPropertyType = (propertyType) => {
  if (propertyType === PROPERTY_TYPES.RESIDENTIAL) {
    return RESIDENTIAL_CRITERIA;
  } else {
    // Both Semi-Commercial and Commercial use commercial criteria
    return COMMERCIAL_CRITERIA;
  }
};