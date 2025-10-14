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