/**
 * Currency input component with thousand separators
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const CurrencyInput = ({ 
  label, 
  value, 
  onChange, 
  onBlur,
  placeholder, 
  error,
  required = false,
  min,
  max,
}) => {
  const [displayValue, setDisplayValue] = useState(formatDisplay(value));

  function formatDisplay(val) {
    if (!val || val === '') return '';
    const numericValue = String(val).replace(/,/g, '');
    if (!numericValue || numericValue === '0') return '';
    return Number(numericValue).toLocaleString('en-GB');
  }

  const handleChange = (e) => {
    const input = e.target.value;
    
    // Remove all non-digit characters
    const numericValue = input.replace(/[^\d]/g, '');
    
    // Update display with formatting
    if (numericValue === '') {
      setDisplayValue('');
      onChange('');
    } else {
      const formatted = Number(numericValue).toLocaleString('en-GB');
      setDisplayValue(formatted);
      onChange(numericValue); // Pass raw number to parent
    }
  };

  const handleBlur = (e) => {
    const numericValue = displayValue.replace(/,/g, '');
    if (onBlur) onBlur(numericValue);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
      {label && (
        <label style={{ 
          fontSize: 12, 
          fontWeight: 600, 
          color: "#334155", 
          marginBottom: 6 
        }}>
          {label}
          {required && <span style={{ color: '#ef4444' }}> *</span>}
        </label>
      )}
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        style={{
          width: "100%",
          height: 36,
          padding: "6px 10px",
          border: error ? "1px solid #ef4444" : "1px solid #cbd5e1",
          borderRadius: 6,
          background: "#fff",
          fontSize: 14,
        }}
      />
      {min !== undefined && max !== undefined && (
        <div style={{ 
          fontSize: 11, 
          color: "#64748b", 
          marginTop: 4 
        }}>
          Range: £{min.toLocaleString('en-GB')} - £{max.toLocaleString('en-GB')}
        </div>
      )}
    </div>
  );
};

CurrencyInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  required: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
};

CurrencyInput.defaultProps = {
  label: '',
  onBlur: null,
  placeholder: '',
  error: false,
  required: false,
  min: undefined,
  max: undefined,
};