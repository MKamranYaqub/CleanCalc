/**
 * Slider input component with formatted display
 */
import React from 'react';
import PropTypes from 'prop-types';

export const SliderInput = ({ label, min, max, step, value, onChange, formatValue, style }) => (
  <div style={style}>
    {label && <div style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>}
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ width: "100%" }}
    />
    <div style={{ fontSize: 12, textAlign: "center", marginTop: 4 }}>
      {formatValue ? formatValue(value) : value}
    </div>
  </div>
);

SliderInput.propTypes = {
  label: PropTypes.string,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  formatValue: PropTypes.func,
  style: PropTypes.object,
};

SliderInput.defaultProps = {
  label: '',
  formatValue: null,
  style: {},
};