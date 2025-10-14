import React from 'react';
import PropTypes from 'prop-types';
import { getCriteriaForPropertyType } from '../config/criteriaConfig';
import { PROPERTY_TYPES } from '../config/constants';

export const CriteriaSection = ({ 
  propertyType, 
  criteriaAnswers, 
  setCriteriaAnswers 
}) => {
  const criteria = getCriteriaForPropertyType(propertyType);

  const handleAnswerChange = (questionId, value) => {
    setCriteriaAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  return (
    <div style={{
      marginBottom: '20px',
      padding: '20px',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
    }}>
      <h3 style={{
        margin: '0 0 16px 0',
        fontSize: '18px',
        fontWeight: 700,
        color: '#0f172a',
      }}>
        {propertyType === PROPERTY_TYPES.RESIDENTIAL 
          ? 'Residential Criteria' 
          : 'Commercial Criteria'}
      </h3>

      <div style={{
        display: 'grid',
        gap: '16px',
      }}>
        {criteria.map((criteriaItem) => (
          <div key={criteriaItem.id}>
            <label style={{
              display: 'block',
              fontWeight: 600,
              fontSize: '14px',
              color: '#334155',
              marginBottom: '8px',
            }}>
              {criteriaItem.question}
            </label>
            <select
              value={criteriaAnswers[criteriaItem.id] || criteriaItem.options[0]}
              onChange={(e) => handleAnswerChange(criteriaItem.id, e.target.value)}
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
              {criteriaItem.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

CriteriaSection.propTypes = {
  propertyType: PropTypes.string.isRequired,
  criteriaAnswers: PropTypes.object.isRequired,
  setCriteriaAnswers: PropTypes.func.isRequired,
};