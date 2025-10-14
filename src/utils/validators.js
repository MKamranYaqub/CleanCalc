/**
 * Input validation utilities
 */

/**
 * Validate property value
 */
export const validatePropertyValue = (value) => {
    const num = Number(value);
    
    if (!value || value === '') {
      return { valid: false, error: 'Property value is required' };
    }
    
    if (isNaN(num)) {
      return { valid: false, error: 'Property value must be a number' };
    }
    
    if (num < 50000) {
      return { valid: false, error: 'Minimum property value is £50,000' };
    }
    
    if (num > 10000000) {
      return { valid: false, error: 'Maximum property value is £10,000,000' };
    }
    
    return { valid: true, error: null };
  };
  
  /**
   * Validate monthly rent
   */
  export const validateMonthlyRent = (value) => {
    const num = Number(value);
    
    if (!value || value === '') {
      return { valid: false, error: 'Monthly rent is required' };
    }
    
    if (isNaN(num)) {
      return { valid: false, error: 'Monthly rent must be a number' };
    }
    
    if (num < 100) {
      return { valid: false, error: 'Minimum monthly rent is £100' };
    }
    
    if (num > 50000) {
      return { valid: false, error: 'Maximum monthly rent is £50,000' };
    }
    
    return { valid: true, error: null };
  };
  
  /**
   * Validate loan amount
   */
  export const validateLoanAmount = (value, min = 150000, max = 3000000) => {
    const num = Number(value);
    
    if (!value || value === '') {
      return { valid: false, error: 'Loan amount is required' };
    }
    
    if (isNaN(num)) {
      return { valid: false, error: 'Loan amount must be a number' };
    }
    
    if (num < min) {
      return { 
        valid: false, 
        error: `Minimum loan is £${min.toLocaleString('en-GB')}` 
      };
    }
    
    if (num > max) {
      return { 
        valid: false, 
        error: `Maximum loan is £${max.toLocaleString('en-GB')}` 
      };
    }
    
    return { valid: true, error: null };
  };
  
  /**
   * Validate percentage
   */
  export const validatePercentage = (value, min = 0, max = 100) => {
    const num = Number(value);
    
    if (value === '' || value === null || value === undefined) {
      return { valid: false, error: 'Percentage is required' };
    }
    
    if (isNaN(num)) {
      return { valid: false, error: 'Percentage must be a number' };
    }
    
    if (num < min || num > max) {
      return { 
        valid: false, 
        error: `Must be between ${min}% and ${max}%` 
      };
    }
    
    return { valid: true, error: null };
  };
  
  /**
   * Validate fee percentage
   */
  export const validateFeePercentage = (value) => {
    const num = Number(value);
    
    if (value === '' || value === null || value === undefined) {
      return { valid: true, error: null }; // Optional field
    }
    
    if (isNaN(num)) {
      return { valid: false, error: 'Fee must be a number' };
    }
    
    if (num < 0) {
      return { valid: false, error: 'Fee cannot be negative' };
    }
    
    if (num > 10) {
      return { valid: false, error: 'Fee cannot exceed 10%' };
    }
    
    return { valid: true, error: null };
  };
  
  /**
   * Validate broker fee flat amount
   */
  export const validateBrokerFeeFlat = (value) => {
    const num = Number(value);
    
    if (value === '' || value === null || value === undefined) {
      return { valid: true, error: null }; // Optional field
    }
    
    if (isNaN(num)) {
      return { valid: false, error: 'Fee must be a number' };
    }
    
    if (num < 0) {
      return { valid: false, error: 'Fee cannot be negative' };
    }
    
    if (num > 50000) {
      return { valid: false, error: 'Fee cannot exceed £50,000' };
    }
    
    return { valid: true, error: null };
  };
  
  /**
   * Validate all inputs at once
   */
  export const validateAllInputs = (inputs) => {
    const errors = {};
    
    const propertyValidation = validatePropertyValue(inputs.propertyValue);
    if (!propertyValidation.valid) {
      errors.propertyValue = propertyValidation.error;
    }
    
    const rentValidation = validateMonthlyRent(inputs.monthlyRent);
    if (!rentValidation.valid) {
      errors.monthlyRent = rentValidation.error;
    }
    
    if (inputs.specificNetLoan) {
      const netLoanValidation = validateLoanAmount(inputs.specificNetLoan);
      if (!netLoanValidation.valid) {
        errors.specificNetLoan = netLoanValidation.error;
      }
    }
    
    if (inputs.specificGrossLoan) {
      const grossLoanValidation = validateLoanAmount(inputs.specificGrossLoan);
      if (!grossLoanValidation.valid) {
        errors.specificGrossLoan = grossLoanValidation.error;
      }
    }
    
    if (inputs.brokerFeePct) {
      const brokerFeePctValidation = validateFeePercentage(inputs.brokerFeePct);
      if (!brokerFeePctValidation.valid) {
        errors.brokerFeePct = brokerFeePctValidation.error;
      }
    }
    
    if (inputs.brokerFeeFlat) {
      const brokerFeeFlatValidation = validateBrokerFeeFlat(inputs.brokerFeeFlat);
      if (!brokerFeeFlatValidation.valid) {
        errors.brokerFeeFlat = brokerFeeFlatValidation.error;
      }
    }
    
    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  };