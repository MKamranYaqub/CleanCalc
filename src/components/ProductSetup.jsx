/**
 * Product setup section component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { SectionTitle } from './UI/SectionTitle';

export const ProductSetup = ({
  mainProductType,
  setMainProductType,
  propertyType,
  setPropertyType,
  isRetention,
  setIsRetention,
  retentionLtv,
  setRetentionLtv,
  tier,
}) => {
  return (
    <div style={{
      gridColumn: "1 / -1",
      background: "#ffffff",
      border: "1px solid #e2e3e4",
      borderRadius: "8px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      padding: "16px",
    }}>
      <SectionTitle>Product Setup</SectionTitle>
      
      <div style={{
        background: "#f1f5f9",
        color: "#334155",
        fontSize: "14px",
        padding: "8px 12px",
        borderRadius: 8,
        marginTop: 4,
        marginBottom: 12,
        border: "1px solid #e2e8f0",
      }}>
        Based on the criteria, the current Tier is <strong>{tier}</strong>.
      </div>

      <div style={{
        display: "grid",
        gap: "16px",
        gridTemplateColumns: "repeat(4, minmax(220px, 1fr))",
      }}>
        {/* Product Type Dropdown */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
            Product Type
          </label>
          <select
            value={mainProductType}
            onChange={(e) => setMainProductType(e.target.value)}
            style={{
              width: "100%",
              height: 36,
              padding: "6px 10px",
              border: "1px solid #cbd5e1",
              borderRadius: 6,
              background: "#fff",
              fontSize: 14,
            }}
          >
            <option value="BTL">BTL</option>
            <option value="Bridge" disabled>Bridge (Coming Soon)</option>
            <option value="Fusion" disabled>Fusion (Coming Soon)</option>
          </select>
        </div>

        {/* Property Type Dropdown */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
            Property Type
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            style={{
              width: "100%",
              height: 36,
              padding: "6px 10px",
              border: "1px solid #cbd5e1",
              borderRadius: 6,
              background: "#fff",
              fontSize: 14,
            }}
          >
            <option>Residential</option>
            <option>Commercial</option>
            <option>Semi-Commercial</option>
          </select>
        </div>

        {/* Is Retention Dropdown */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
            Is This a Retention loan?
          </label>
          <select
            value={isRetention}
            onChange={(e) => setIsRetention(e.target.value)}
            style={{
              width: "100%",
              height: 36,
              padding: "6px 10px",
              border: "1px solid #cbd5e1",
              borderRadius: 6,
              background: "#fff",
              fontSize: 14,
            }}
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>

        {/* Retention LTV Range (conditionally shown) */}
        {isRetention === "Yes" && (
          <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              Retention LTV Range
            </label>
            <select
              value={retentionLtv}
              onChange={(e) => setRetentionLtv(e.target.value)}
              style={{
                width: "100%",
                height: 36,
                padding: "6px 10px",
                border: "1px solid #cbd5e1",
                borderRadius: 6,
                background: "#fff",
                fontSize: 14,
              }}
            >
              <option>65</option>
              <option>75</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

ProductSetup.propTypes = {
  mainProductType: PropTypes.string.isRequired,
  setMainProductType: PropTypes.func.isRequired,
  propertyType: PropTypes.string.isRequired,
  setPropertyType: PropTypes.func.isRequired,
  isRetention: PropTypes.string.isRequired,
  setIsRetention: PropTypes.func.isRequired,
  retentionLtv: PropTypes.string.isRequired,
  setRetentionLtv: PropTypes.func.isRequired,
  tier: PropTypes.string.isRequired,
};