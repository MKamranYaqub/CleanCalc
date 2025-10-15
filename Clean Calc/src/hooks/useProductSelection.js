/**
 * Hook for managing product selection state
 */
import { useState } from 'react';
import { PROPERTY_TYPES, PRODUCT_GROUPS } from '../config/constants';

export const useProductSelection = () => {
  const [mainProductType, setMainProductType] = useState("BTL");
  const [propertyType, setPropertyType] = useState(PROPERTY_TYPES.RESIDENTIAL);
  const [isRetention, setIsRetention] = useState("No");
  const [retentionLtv, setRetentionLtv] = useState("65");
  const [productType, setProductType] = useState("2yr Fix");
  const [productGroup, setProductGroup] = useState(PRODUCT_GROUPS.SPECIALIST);

  return {
    mainProductType,
    setMainProductType,
    propertyType,
    setPropertyType,
    isRetention,
    setIsRetention,
    retentionLtv,
    setRetentionLtv,
    productType,
    setProductType,
    productGroup,
    setProductGroup,
  };
};