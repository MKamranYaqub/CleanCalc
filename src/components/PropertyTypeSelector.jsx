import React from 'react';
import PropTypes from 'prop-types';
import { PROPERTY_TYPES } from '../config/constants';

export const PropertyTypeSelector = ({ propertyType, setPropertyType }) => {
  return (
    <div style={{
      marginBottom: '20px',
      padding: '16px',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
    }}>
      <label style={{
        display: 'block',
        fontWeight: 600,
        fontSize: '14px',
        color: '#0f172a',
        marginBottom: '8px',
      }}>
        Property Type
      </label>
      <select
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '14px',
          border: '2px solid #e2e8f0',
          borderRadius: '6px',
          background: '#ffffff',
          color: '#0f172a',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <option value={PROPERTY_TYPES.RESIDENTIAL}>Residential</option>
        <option value={PROPERTY_TYPES.SEMI_COMMERCIAL}>Semi-Commercial</option>
        <option value={PROPERTY_TYPES.COMMERCIAL}>Commercial</option>
      </select>
    </div>
  );
};

PropertyTypeSelector.propTypes = {
  propertyType: PropTypes.string.isRequired,
  setPropertyType: PropTypes.func.isRequired,
};