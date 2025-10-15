/**
 * Input formatting utilities for real-time formatting
 */

/**
 * Format number with thousand separators for display
 * @param {string|number} value - The value to format
 * @returns {string} Formatted value with commas
 */
export const formatNumberWithCommas = (value) => {
    if (!value) return '';
    
    // Remove any non-digit characters except decimal point
    const cleanValue = String(value).replace(/[^\d.]/g, '');
    
    // Split into integer and decimal parts
    const parts = cleanValue.split('.');
    
    // Add thousand separators to integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Rejoin with decimal if it exists
    return parts.join('.');
  };
  
  /**
   * Remove formatting to get raw number
   * @param {string} value - Formatted value
   * @returns {string} Raw number string
   */
  export const unformatNumber = (value) => {
    if (!value) return '';
    return String(value).replace(/,/g, '');
  };
  
  /**
   * Format currency input while typing
   * @param {string} value - Input value
   * @returns {string} Formatted value
   */
  export const formatCurrencyInput = (value) => {
    // Remove all non-digit characters
    const numericValue = value.replace(/[^\d]/g, '');
    
    if (!numericValue) return '';
    
    // Convert to number and format with separators
    const number = parseInt(numericValue, 10);
    
    return number.toLocaleString('en-GB');
  };
  
  /**
   * Parse formatted currency input to number
   * @param {string} value - Formatted input value
   * @returns {number} Numeric value
   */
  export const parseCurrencyInput = (value) => {
    const cleaned = value.replace(/,/g, '');
    return cleaned ? Number(cleaned) : 0;
  };