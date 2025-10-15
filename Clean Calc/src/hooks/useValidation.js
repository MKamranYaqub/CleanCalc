/**
 * Custom hook for form validation
 */
import { useState, useCallback } from 'react';
import {
  validatePropertyValue,
  validateMonthlyRent,
  validateLoanAmount,
  validateFeePercentage,
  validateBrokerFeeFlat,
} from '../utils/validators';

export const useValidation = () => {
  const [errors, setErrors] = useState({});

  const validateField = useCallback((field, value, ...args) => {
    let validation;
    
    switch (field) {
      case 'propertyValue':
        validation = validatePropertyValue(value);
        break;
      case 'monthlyRent':
        validation = validateMonthlyRent(value);
        break;
      case 'specificNetLoan':
      case 'specificGrossLoan':
        validation = validateLoanAmount(value, ...args);
        break;
      case 'brokerFeePct':
      case 'procFeePct':
        validation = validateFeePercentage(value);
        break;
      case 'brokerFeeFlat':
        validation = validateBrokerFeeFlat(value);
        break;
      default:
        validation = { valid: true, error: null };
    }

    setErrors(prev => ({
      ...prev,
      [field]: validation.valid ? null : validation.error,
    }));

    return validation.valid;
  }, []);

  const clearError = useCallback((field) => {
    setErrors(prev => ({
      ...prev,
      [field]: null,
    }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const hasErrors = Object.values(errors).some(error => error !== null);

  return {
    errors,
    validateField,
    clearError,
    clearAllErrors,
    hasErrors,
  };
};