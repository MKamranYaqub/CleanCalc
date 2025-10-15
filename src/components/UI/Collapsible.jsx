/**
 * Collapsible section component
 */
import React from 'react';
import PropTypes from 'prop-types';

export const Collapsible = ({ title, isOpen, onToggle, children }) => (
  <div className="card" style={{ gridColumn: "1 / -1" }}>
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        backgroundColor: "#f8fafc",
        borderRadius: 8,
        cursor: "pointer",
        transition: "background .2s",
        border: "1px solid #e2e8f0",
      }}
    >
      <h3 style={{ margin: 0 }}>{title}</h3>
      <span style={{ fontSize: 20 }}>{isOpen ? "▾" : "▸"}</span>
    </div>
    <div style={{
      maxHeight: isOpen ? "2000px" : "0px",
      overflow: "hidden",
      transition: "max-height .3s",
    }}>
      <div style={{ marginTop: isOpen ? "16px" : "0px" }}>{children}</div></div>
  </div>
);
Collapsible.propTypes = {
title: PropTypes.string.isRequired,
isOpen: PropTypes.bool.isRequired,
onToggle: PropTypes.func.isRequired,
children: PropTypes.node.isRequired,
};