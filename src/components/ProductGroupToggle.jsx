import React from 'react';
import PropTypes from 'prop-types';
import { PRODUCT_GROUPS } from '../config/constants';

export const ProductGroupToggle = ({
  productGroup,
  setProductGroup,
  isWithinCoreCriteria,
}) => {
  return (
    <div style={{
      gridColumn: "1 / -1",
      marginBottom: "16px",
    }}>
      {/* Toggle Button */}
      <div style={{
        display: 'inline-flex',
        position: 'relative',
        background: '#e5e5e5',
        borderRadius: '4px',
        padding: '2px',
        width: '100%',
      }}>
        {/* Specialist Button */}
        <button
          type="button"
          onClick={() => setProductGroup(PRODUCT_GROUPS.SPECIALIST)}
          style={{
            flex: '1',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            background: productGroup === PRODUCT_GROUPS.SPECIALIST 
              ? '#008891' 
              : 'transparent',
            color: productGroup === PRODUCT_GROUPS.SPECIALIST 
              ? '#ffffff' 
              : '#706e6b',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: 600,
            fontSize: '14px',
            fontFamily: 'Salesforce Sans, Arial, sans-serif',
            boxShadow: productGroup === PRODUCT_GROUPS.SPECIALIST
              ? '0 2px 4px rgba(0,0,0,0.1)'
              : 'none',
            position: 'relative',
            zIndex: productGroup === PRODUCT_GROUPS.SPECIALIST ? 1 : 0,
          }}
        >
          BTL Specialist
        </button>

        {/* Core Button */}
        <button
          type="button"
          onClick={() => setProductGroup(PRODUCT_GROUPS.CORE)}
          disabled={!isWithinCoreCriteria}
          style={{
            flex: '1',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            background: productGroup === PRODUCT_GROUPS.CORE 
              ? '#008891' 
              : 'transparent',
            color: productGroup === PRODUCT_GROUPS.CORE 
              ? '#ffffff' 
              : isWithinCoreCriteria ? '#706e6b' : '#c9c7c5',
            cursor: isWithinCoreCriteria ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            fontWeight: 600,
            fontSize: '14px',
            fontFamily: 'Salesforce Sans, Arial, sans-serif',
            boxShadow: productGroup === PRODUCT_GROUPS.CORE
              ? '0 2px 4px rgba(0,0,0,0.1)'
              : 'none',
            opacity: isWithinCoreCriteria ? 1 : 0.5,
            position: 'relative',
            zIndex: productGroup === PRODUCT_GROUPS.CORE ? 1 : 0,
          }}
        >
          BTL Core
        </button>
      </div>

      {/* Eligibility Information Banner */}
      {!isWithinCoreCriteria && (
        <div style={{
          marginTop: '12px',
          padding: '12px 16px',
          background: '#fef3cd',
          border: '1px solid #f9e3a5',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
        }}>
          <span style={{
            fontSize: '16px',
            lineHeight: '1',
            marginTop: '2px',
          }}>
            ⚠️
          </span>
          <div style={{
            flex: 1,
          }}>
            <div style={{
              fontWeight: 600,
              fontSize: '13px',
              color: '#826117',
              marginBottom: '4px',
              fontFamily: 'Salesforce Sans, Arial, sans-serif',
            }}>
              BTL Core Not Available
            </div>
            <div style={{
              fontSize: '13px',
              color: '#826117',
              lineHeight: '1.5',
              fontFamily: 'Salesforce Sans, Arial, sans-serif',
            }}>
              Core products require standard criteria to be met. Please review your property criteria selections above. Common reasons include: holiday lets, offshore companies, recent CCJs, or other non-standard conditions.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ProductGroupToggle.propTypes = {
  productGroup: PropTypes.string.isRequired,
  setProductGroup: PropTypes.func.isRequired,
  isWithinCoreCriteria: PropTypes.bool.isRequired,
};

ProductGroupToggle.defaultProps = {};