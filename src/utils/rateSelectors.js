import {
  RATES_DATA,
  RATES_SEMI_COMMERCIAL,
  RATES_COMMERCIAL,
  RATES_CORE,
  RATES_RETENTION_65,
  RATES_RETENTION_75,
  RATES_CORE_RETENTION_65,
  RATES_CORE_RETENTION_75,
} from '../config/ratesData';
import { PRODUCT_GROUPS, PROPERTY_TYPES } from '../config/constants';

/**
 * Get the appropriate rate data based on property type, product group, and retention status
 */
export const getRateData = (propertyType, productGroup, isRetention = false, retentionLTV = null) => {
  // BTL Core Products (only for Residential)
  if (productGroup === PRODUCT_GROUPS.CORE) {
    if (propertyType !== PROPERTY_TYPES.RESIDENTIAL) {
      return null; // Core not available for Semi-Commercial or Commercial
    }
    
    if (isRetention) {
      return retentionLTV <= 65 ? RATES_CORE_RETENTION_65 : RATES_CORE_RETENTION_75;
    }
    
    return RATES_CORE;
  }

  // BTL Specialist Products
  if (productGroup === PRODUCT_GROUPS.SPECIALIST) {
    if (isRetention) {
      const retentionRates = retentionLTV <= 65 ? RATES_RETENTION_65 : RATES_RETENTION_75;
      return retentionRates[propertyType] || retentionRates.Residential;
    }

    // Standard products
    switch (propertyType) {
      case PROPERTY_TYPES.RESIDENTIAL:
        return RATES_DATA;
      case PROPERTY_TYPES.SEMI_COMMERCIAL:
        return RATES_SEMI_COMMERCIAL;
      case PROPERTY_TYPES.COMMERCIAL:
        return RATES_COMMERCIAL;
      default:
        return RATES_DATA;
    }
  }

  return RATES_DATA; // Default fallback
};

/**
 * Get available LTV bands for a specific product and tier
 */
export const getAvailableLTVBands = (rateData, tier, productName) => {
  if (!rateData || !rateData[tier] || !rateData[tier].products[productName]) {
    return [];
  }

  const ltvBands = Object.keys(rateData[tier].products[productName])
    .filter(key => key !== 'isMargin')
    .map(Number)
    .sort((a, b) => b - a); // Sort descending

  return ltvBands;
};

/**
 * Get rate for specific parameters
 */
export const getRate = (rateData, tier, productName, ltvBand) => {
  if (!rateData || !rateData[tier] || !rateData[tier].products[productName]) {
    return null;
  }

  return rateData[tier].products[productName][ltvBand] || null;
};

/**
 * Check if product is a margin product (tracker)
 */
export const isMarginProduct = (rateData, tier, productName) => {
  if (!rateData || !rateData[tier] || !rateData[tier].products[productName]) {
    return false;
  }

  return rateData[tier].products[productName].isMargin === true;
};
/**
 * Select rate source based on all parameters
 */
export const selectRateSource = ({ propertyType, productGroup, isRetention, retentionLtv, tier, productType }) => {
  const rateData = getRateData(
    propertyType,
    productGroup,
    isRetention === 'Yes',
    Number(retentionLtv)
  );
  
  if (!rateData || !rateData[tier]) return null;
  
  const products = rateData[tier].products;
  return products[productType] || null;
};

/**
 * Get fee columns based on property type and retention status
 */
export const getFeeColumns = ({ productGroup, isRetention, retentionLtv, propertyType }) => {
  if (isRetention === 'Yes') {
    // Retention products use different fee structure
    if (propertyType === PROPERTY_TYPES.RESIDENTIAL) {
      return ['5.5', '3.5', '2.5', '1.5'];
    } else {
      // Semi-Commercial and Commercial
      return ['5.5', '3.5', '1.5'];
    }
  } else {
    // Standard products
    if (propertyType === PROPERTY_TYPES.RESIDENTIAL) {
      return ['6', '4', '3', '2'];
    } else {
      // Semi-Commercial and Commercial
      return ['6', '4', '2'];
    }
  }
};

/**
 * Get maximum LTV for property type and tier
 */
export const getMaxLTV = ({ propertyType, isRetention, retentionLtv, propertyAnswers, tier, productType }) => {
  // Base LTV by property type and tier
  const baseLTV = {
    [PROPERTY_TYPES.RESIDENTIAL]: {
      'Tier 1': 0.75,
      'Tier 2': 0.70,
      'Tier 3': 0.65,
    },
    [PROPERTY_TYPES.SEMI_COMMERCIAL]: {
      'Tier 1': 0.70,
      'Tier 2': 0.65,
    },
    [PROPERTY_TYPES.COMMERCIAL]: {
      'Tier 1': 0.70,
      'Tier 2': 0.65,
    },
  };

  return baseLTV[propertyType]?.[tier] || 0.75;
};

/**
 * Apply floor rate for Core products
 */
export const applyFloorRate = (rate, productGroup, propertyType) => {
  const CORE_FLOOR_RATE = 0.055; // 5.5% minimum for Core products
  
  if (productGroup === PRODUCT_GROUPS.CORE && propertyType === PROPERTY_TYPES.RESIDENTIAL) {
    return Math.max(rate, CORE_FLOOR_RATE);
  }
  
  return rate;
};