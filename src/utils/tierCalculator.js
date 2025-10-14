import { 
    RESIDENTIAL_CRITERIA, 
    COMMERCIAL_CRITERIA 
  } from '../config/criteriaConfig';
  import { PROPERTY_TYPES, TIERS } from '../config/constants';
  
  /**
   * Calculate tier for residential properties
   */
  export const calculateResidentialTier = (criteriaAnswers) => {
    let tierScore = 1; // Start at Tier 1 (best)
  
    RESIDENTIAL_CRITERIA.forEach((criteria) => {
      const answer = criteriaAnswers[criteria.id];
      
      if (answer === criteria.tier3 && tierScore < 3) {
        tierScore = 3; // Tier 3 criteria met
      } else if (answer === criteria.tier2 && tierScore < 2) {
        tierScore = 2; // Tier 2 criteria met
      }
    });
  
    return `Tier ${tierScore}`;
  };
  
  /**
   * Calculate tier for commercial/semi-commercial properties
   * Only returns Tier 1 or Tier 2
   */
  export const calculateCommercialTier = (criteriaAnswers) => {
    let tierScore = 1; // Start at Tier 1 (best)
  
    COMMERCIAL_CRITERIA.forEach((criteria) => {
      const answer = criteriaAnswers[criteria.id];
      
      if (answer === criteria.tier2) {
        tierScore = 2; // Tier 2 criteria met
      }
    });
  
    return `Tier ${tierScore}`;
  };
  
  /**
   * Main tier calculation function
   */
  export const calculateTier = (propertyType, criteriaAnswers) => {
    if (propertyType === PROPERTY_TYPES.RESIDENTIAL) {
      return calculateResidentialTier(criteriaAnswers);
    } else {
      // Both Semi-Commercial and Commercial use commercial tier logic
      return calculateCommercialTier(criteriaAnswers);
    }
  };
  
  /**
   * Check if Core product criteria is met (only for Residential)
   */
  export const checkCoreCriteria = (propertyType, criteriaAnswers) => {
    // Core products only available for Residential
    if (propertyType !== PROPERTY_TYPES.RESIDENTIAL) {
      return false;
    }
  
    // Check all residential criteria for Core eligibility
    for (const criteria of RESIDENTIAL_CRITERIA) {
      const answer = criteriaAnswers[criteria.id];
      
      // If any answer doesn't match core eligible criteria, return false
      if (answer !== criteria.coreEligible) {
        return false;
      }
    }
  
    return true;
  };