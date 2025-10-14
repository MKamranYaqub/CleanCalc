import React, { useState, useEffect } from 'react';
import { PropertyTypeSelector } from './PropertyTypeSelector';
import { ProductGroupToggle } from './ProductGroupToggle';
import { CriteriaSection } from './CriteriaSection';
import { RateMatrix } from './RateMatrix';
import { PRODUCT_GROUPS, PROPERTY_TYPES } from '../config/constants';
import { calculateTier, checkCoreCriteria } from '../utils/tierCalculator';
import { getRateData } from '../utils/rateSelector';

export const RateCalculator = () => {
  // State
  const [propertyType, setPropertyType] = useState(PROPERTY_TYPES.RESIDENTIAL);
  const [productGroup, setProductGroup] = useState(PRODUCT_GROUPS.SPECIALIST);
  const [criteriaAnswers, setCriteriaAnswers] = useState({});
  const [tier, setTier] = useState('Tier 1');
  const [isWithinCoreCriteria, setIsWithinCoreCriteria] = useState(false);

  // Calculate tier whenever property type or criteria answers change
  useEffect(() => {
    const calculatedTier = calculateTier(propertyType, criteriaAnswers);
    setTier(calculatedTier);

    const coreEligible = checkCoreCriteria(propertyType, criteriaAnswers);
    setIsWithinCoreCriteria(coreEligible);

    // If Core becomes unavailable, switch to Specialist
    if (!coreEligible && productGroup === PRODUCT_GROUPS.CORE) {
      setProductGroup(PRODUCT_GROUPS.SPECIALIST);
    }
  }, [propertyType, criteriaAnswers, productGroup]);

  // Reset criteria when property type changes
  const handlePropertyTypeChange = (newPropertyType) => {
    setPropertyType(newPropertyType);
    setCriteriaAnswers({});
    
    // If switching away from Residential, force Specialist product group
    if (newPropertyType !== PROPERTY_TYPES.RESIDENTIAL && productGroup === PRODUCT_GROUPS.CORE) {
      setProductGroup(PRODUCT_GROUPS.SPECIALIST);
    }
  };

  // Get current rate data
  const currentRateData = getRateData(propertyType, productGroup, false, null);

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 700,
        color: '#0f172a',
        marginBottom: '24px',
      }}>
        BTL Rate Calculator
      </h1>

      {/* Property Type Selector */}
      <PropertyTypeSelector
        propertyType={propertyType}
        setPropertyType={handlePropertyTypeChange}
      />

      {/* Product Group Toggle (Core/Specialist) */}
      <ProductGroupToggle
        productGroup={productGroup}
        setProductGroup={setProductGroup}
        isWithinCoreCriteria={isWithinCoreCriteria}
      />

      {/* Tier Display */}
      <div style={{
        padding: '16px',
        background: '#f0fdfa',
        border: '2px solid #008891',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '14px',
          color: '#334155',
          marginBottom: '4px',
        }}>
          Current Tier
        </div>
        <div style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#008891',
        }}>
          {tier}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#64748b',
          marginTop: '4px',
        }}>
          {propertyType} • {productGroup === PRODUCT_GROUPS.CORE ? 'BTL Core' : 'BTL Specialist'}
        </div>
      </div>

      {/* Criteria Section */}
      <CriteriaSection
        propertyType={propertyType}
        criteriaAnswers={criteriaAnswers}
        setCriteriaAnswers={setCriteriaAnswers}
      />

      {/* Rate Matrix */}
      {currentRateData && (
        <RateMatrix
          rateData={currentRateData}
          tier={tier}
          propertyType={propertyType}
          productGroup={productGroup}
        />
      )}

      {!currentRateData && (
        <div style={{
          padding: '20px',
          background: '#fff7ed',
          border: '1px solid #fed7aa',
          borderRadius: '8px',
          color: '#7c2d12',
          textAlign: 'center',
        }}>
          No rate data available for the selected configuration.
        </div>
      )}
    </div>
  );
};