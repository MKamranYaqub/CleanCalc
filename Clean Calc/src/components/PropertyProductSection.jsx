/**
 * Property and product section component with formatted currency inputs
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Collapsible } from './UI/Collapsible';
import { CurrencyInput } from './UI/CurrencyInput';
import { ErrorMessage } from './UI/ErrorMessage';
import { LOAN_TYPES } from '../config/constants';
import { useValidation } from '../hooks/useValidation';

export const PropertyProductSection = ({
  isOpen,
  onToggle,
  propertyValue,
  setPropertyValue,
  monthlyRent,
  setMonthlyRent,
  loanTypeRequired,
  setLoanTypeRequired,
  specificGrossLoan,
  setSpecificGrossLoan,
  specificNetLoan,
  setSpecificNetLoan,
  specificLTV,
  setSpecificLTV,
  maxLTV,
  tier,
  productType,
  setProductType,
  productTypesList,
}) => {
  const { errors, validateField } = useValidation();

  const handlePropertyValueChange = (value) => {
    setPropertyValue(value);
    if (value) validateField('propertyValue', value);
  };

  const handleMonthlyRentChange = (value) => {
    setMonthlyRent(value);
    if (value) validateField('monthlyRent', value);
  };

  const handleSpecificNetLoanChange = (value) => {
    setSpecificNetLoan(value);
    if (value) validateField('specificNetLoan', value);
  };

  const handleSpecificGrossLoanChange = (value) => {
    setSpecificGrossLoan(value);
    if (value) validateField('specificGrossLoan', value);
  };

  return (
    <Collapsible
      title="🏦 Property & Product"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div style={{
        display: "grid",
        gap: "16px",
        gridTemplateColumns: "repeat(4, minmax(220px, 1fr))",
      }}>
        {/* Property Value with Currency Formatting */}
        <div>
          <CurrencyInput
            label="Property Value"
            value={propertyValue}
            onChange={handlePropertyValueChange}
            onBlur={(value) => validateField('propertyValue', value)}
            placeholder="e.g. 350,000"
            error={!!errors.propertyValue}
            required
            min={50000}
            max={10000000}
          />
          <ErrorMessage error={errors.propertyValue} />
        </div>

        {/* Monthly Rent with Currency Formatting */}
        <div>
          <CurrencyInput
            label="Monthly Rent"
            value={monthlyRent}
            onChange={handleMonthlyRentChange}
            onBlur={(value) => validateField('monthlyRent', value)}
            placeholder="e.g. 1,600"
            error={!!errors.monthlyRent}
            required
            min={100}
            max={50000}
          />
          <ErrorMessage error={errors.monthlyRent} />
        </div>

        {/* Loan Type Dropdown */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
            Loan type required?
          </label>
          <select
            value={loanTypeRequired}
            onChange={(e) => setLoanTypeRequired(e.target.value)}
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
            <option>{LOAN_TYPES.MAX_OPTIMUM_GROSS}</option>
            <option>{LOAN_TYPES.SPECIFIC_NET}</option>
            <option>{LOAN_TYPES.MAX_LTV}</option>
            <option>{LOAN_TYPES.SPECIFIC_GROSS}</option>
          </select>
        </div>

        {/* Specific Gross Loan */}
        {loanTypeRequired === LOAN_TYPES.SPECIFIC_GROSS && (
          <div>
            <CurrencyInput
              label="Specific Gross Loan (£)"
              value={specificGrossLoan}
              onChange={handleSpecificGrossLoanChange}
              onBlur={(value) => validateField('specificGrossLoan', value)}
              placeholder="e.g. 250,000"
              error={!!errors.specificGrossLoan}
              required
              min={150000}
              max={3000000}
            />
            <ErrorMessage error={errors.specificGrossLoan} />
          </div>
        )}

        {/* Specific Net Loan */}
        {loanTypeRequired === LOAN_TYPES.SPECIFIC_NET && (
          <div>
            <CurrencyInput
              label="Specific Net Loan"
              value={specificNetLoan}
              onChange={handleSpecificNetLoanChange}
              onBlur={(value) => validateField('specificNetLoan', value)}
              placeholder="e.g. 200,000"
              error={!!errors.specificNetLoan}
              required
              min={150000}
              max={3000000}
            />
            <ErrorMessage error={errors.specificNetLoan} />
          </div>
        )}

        {/* LTV Slider */}
        {loanTypeRequired === LOAN_TYPES.MAX_LTV && (
          <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              Specific LTV Cap
            </label>
            <div style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>
              LTV: <b>{(specificLTV * 100).toFixed(2)}%</b>
            </div>
            <input
              type="range"
              min={0.05}
              max={maxLTV}
              step={0.005}
              value={specificLTV}
              onChange={(e) => setSpecificLTV(Number(e.target.value))}
              style={{ width: "100%" }}
            />
            <div style={{
              marginTop: 8,
              background: "#f1f5f9",
              color: "#475569",
              fontSize: 12,
              padding: "8px 10px",
              borderRadius: 8,
              textAlign: "center",
            }}>
              Max LTV for {tier} is {(maxLTV * 100).toFixed(2)}%
            </div>
          </div>
        )}

        {/* Product Type */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
            Product Type
          </label>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
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
            {productTypesList.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Collapsible>
  );
};

PropertyProductSection.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  propertyValue: PropTypes.string.isRequired,
  setPropertyValue: PropTypes.func.isRequired,
  monthlyRent: PropTypes.string.isRequired,
  setMonthlyRent: PropTypes.func.isRequired,
  loanTypeRequired: PropTypes.string.isRequired,
  setLoanTypeRequired: PropTypes.func.isRequired,
  specificGrossLoan: PropTypes.string.isRequired,
  setSpecificGrossLoan: PropTypes.func.isRequired,
  specificNetLoan: PropTypes.string.isRequired,
  setSpecificNetLoan: PropTypes.func.isRequired,
  specificLTV: PropTypes.number.isRequired,
  setSpecificLTV: PropTypes.func.isRequired,
  maxLTV: PropTypes.number.isRequired,
  tier: PropTypes.string.isRequired,
  productType: PropTypes.string.isRequired,
  setProductType: PropTypes.func.isRequired,
  productTypesList: PropTypes.arrayOf(PropTypes.string).isRequired,
};