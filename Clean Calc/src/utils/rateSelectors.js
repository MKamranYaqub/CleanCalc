/**
 * Rate selection logic based on product parameters
 */
import { PROPERTY_TYPES, PRODUCT_GROUPS, CORE_FLOOR_RATE, FEE_COLUMNS } from '../config/constants';
import {
  RATES_DATA,
  RATES_COMMERCIAL,
  RATES_CORE,
  RATES_RETENTION_65,
  RATES_RETENTION_75,
  RATES_CORE_RETENTION_65,
  RATES_CORE_RETENTION_75,
} from '../config/rates';
import { MAX_LTV_RULES } from '../config/criteria';

/**
 * Get maximum LTV based on property and loan parameters
 */
export const getMaxLTV = (params) => {
  const { propertyType, isRetention, retentionLtv, propertyAnswers = {}, tier } = params;
  const def = MAX_LTV_RULES.default?.[propertyType] ?? 75;
  const numericLtv = Number(String(retentionLtv || "").match(/\d+/)?.[0]);
  
  const isFlat = propertyAnswers.flatAboveComm === "Yes" || 
                 propertyAnswers?.criteria?.flatAboveComm === "Yes";
  
  let retOv = null;
  if (isRetention === "Yes" && numericLtv) {
    retOv = MAX_LTV_RULES.retention?.[propertyType]?.[numericLtv];
  }
  
  let flatOv = null;
  if (propertyType === PROPERTY_TYPES.RESIDENTIAL && isFlat && 
      MAX_LTV_RULES.flatAboveCommOverrides?.[tier] != null) {
    flatOv = MAX_LTV_RULES.flatAboveCommOverrides[tier];
  }
  
  const applicable = [def];
  if (retOv != null) applicable.push(retOv);
  if (flatOv != null) applicable.push(flatOv);
  return Math.min(...applicable) / 100;
};

/**
 * Select the appropriate rate source based on parameters
 */
export const selectRateSource = (params) => {
  const { propertyType, productGroup, isRetention, retentionLtv, tier, productType } = params;
  const isCommercial = propertyType === PROPERTY_TYPES.COMMERCIAL || 
                       propertyType === PROPERTY_TYPES.SEMI_COMMERCIAL;

  if (productGroup === PRODUCT_GROUPS.CORE && propertyType === PROPERTY_TYPES.RESIDENTIAL) {
    if (isRetention === "Yes") {
      const coreRetRates = retentionLtv === "65" 
        ? RATES_CORE_RETENTION_65 
        : RATES_CORE_RETENTION_75;
      return coreRetRates?.[tier]?.products?.[productType];
    }
    return RATES_CORE?.[tier]?.products?.[productType];
  }

  if (isRetention === "Yes") {
    const retentionRates = retentionLtv === "65" 
      ? RATES_RETENTION_65 
      : RATES_RETENTION_75;
    return propertyType === PROPERTY_TYPES.RESIDENTIAL
      ? retentionRates?.Residential?.[tier]?.products?.[productType]
      : retentionRates?.Commercial?.[tier]?.products?.[productType];
  }

  return isCommercial
    ? RATES_COMMERCIAL?.[tier]?.products?.[productType]
    : RATES_DATA?.[tier]?.products?.[productType];
};

/**
 * Get fee columns based on product configuration
 */
export const getFeeColumns = (params) => {
  const { productGroup, isRetention, retentionLtv, propertyType } = params;
  
  if (productGroup === PRODUCT_GROUPS.CORE && propertyType === PROPERTY_TYPES.RESIDENTIAL) {
    if (isRetention === "Yes") {
      return retentionLtv === "65" 
        ? FEE_COLUMNS.Core_Retention_65 
        : FEE_COLUMNS.Core_Retention_75;
    }
    return FEE_COLUMNS.Core;
  }
  
  if (isRetention === "Yes") {
    return propertyType === PROPERTY_TYPES.RESIDENTIAL
      ? FEE_COLUMNS.RetentionResidential
      : FEE_COLUMNS.RetentionCommercial;
  }
  
  return FEE_COLUMNS[propertyType] || [6, 4, 3, 2];
};

/**
 * Apply floor rate for Core products
 */
export const applyFloorRate = (rate, productGroup, propertyType) => {
  if (productGroup === PRODUCT_GROUPS.CORE && 
      propertyType === PROPERTY_TYPES.RESIDENTIAL) {
    return Math.max(rate, CORE_FLOOR_RATE);
  }
  return rate;
};