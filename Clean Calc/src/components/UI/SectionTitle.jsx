/**
 * Section title component with divider
 */
import React from 'react';
import PropTypes from 'prop-types';

export const SectionTitle = ({ children }) => (
  <div style={{ gridColumn: "1 / -1", marginTop: 4 }}>
    <div style={{
      fontSize: 15,
      fontWeight: 700,
      color: "#334155",
      textTransform: "normal",
      letterSpacing: "0.04em",
      marginTop: 8,
      marginBottom: 4,
    }}>
      {children}
    </div>
    <div style={{ height: 1, background: "#e2e8f0", marginBottom: 8 }} />
  </div>
);

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
};