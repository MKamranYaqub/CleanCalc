/**
 * Error message component for displaying validation errors
 */
import React from 'react';
import PropTypes from 'prop-types';

export const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
    <div style={{
      marginTop: 4,
      padding: '6px 8px',
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: 4,
      fontSize: 11,
      color: '#991b1b',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    }}>
      <span style={{ fontSize: 12 }}>⚠️</span>
      <span>{error}</span>
    </div>
  );
};

ErrorMessage.propTypes = {
  error: PropTypes.string,
};

ErrorMessage.defaultProps = {
  error: null,
};