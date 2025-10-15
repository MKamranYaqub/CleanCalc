/**
 * Fees section component with validation
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Collapsible } from './UI/Collapsible';
import { ErrorMessage } from './UI/ErrorMessage';
import { useValidation } from '../hooks/useValidation';
import { CurrencyInput } from './UI/CurrencyInput';

export const FeesSection = ({
  isOpen,
  onToggle,
  procFeePctInput,
  setProcFeePctInput,
  effectiveProcFeePct,
  brokerFeePct,
  setBrokerFeePct,
  brokerFeeFlat,
  setBrokerFeeFlat,
  isRetention,
}) => {
  const { errors, validateField } = useValidation();

  const handleProcFeeChange = (value) => {
    setProcFeePctInput(value);
    if (value) validateField('procFeePct', value);
  };

  const handleBrokerFeePctChange = (value) => {
    setBrokerFeePct(value);
    if (value) {
      setBrokerFeeFlat("");
      validateField('brokerFeePct', value);
    }
  };

  const handleBrokerFeeFlatChange = (value) => {
    setBrokerFeeFlat(value);
    if (value) {
      setBrokerFeePct("");
      validateField('brokerFeeFlat', value);
    }
  };

  return (
    <Collapsible
      title="💰 Fees"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div style={{
        display: "grid",
        gap: "16px",
        gridTemplateColumns: "repeat(4, minmax(220px, 1fr))",
      }}>
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
            Proc Fee (%)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g. 1.00"
            value={procFeePctInput}
            onChange={(e) => handleProcFeeChange(e.target.value)}
            onBlur={(e) => validateField('procFeePct', e.target.value)}
            style={{
              width: "100%",
              height: 36,
              padding: "6px 10px",
              border: errors.procFeePct ? "1px solid #ef4444" : "1px solid #cbd5e1",
              borderRadius: 6,
              background: "#fff",
              fontSize: 14,
            }}
          />
          <ErrorMessage error={errors.procFeePct} />
          <div style={{ fontSize: 12, color: "#475569", marginTop: 6 }}>
            Effective proc fee in calculations:{" "}
            <b>{effectiveProcFeePct.toFixed(2)}%</b>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
            Client Broker Fee (%)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g. 1.50"
            value={brokerFeePct}
            onChange={(e) => handleBrokerFeePctChange(e.target.value)}
            onBlur={(e) => validateField('brokerFeePct', e.target.value)}
            style={{
              width: "100%",
              height: 36,
              padding: "6px 10px",
              border: errors.brokerFeePct ? "1px solid #ef4444" : "1px solid #cbd5e1",
              borderRadius: 6,
              background: "#fff",
              fontSize: 14,
            }}
          />
          <ErrorMessage error={errors.brokerFeePct} />
        </div>

        {!brokerFeePct && (
          <div 
          style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              Broker Fee (£)
            </label>
            <CurrencyInput
              type="number"
              step="1"
              placeholder="e.g. 995"
              value={brokerFeeFlat}
              onChange={(e) => handleBrokerFeeFlatChange(e.target.value)}
              onBlur={(e) => validateField('brokerFeeFlat', e.target.value)}
              style={{
                width: "100%",
                height: 36,
                padding: "6px 10px",
                border: errors.brokerFeeFlat ? "1px solid #ef4444" : "1px solid #cbd5e1",
                borderRadius: 6,
                background: "#fff",
                fontSize: 14,
              }}
            />
        
            <ErrorMessage error={errors.brokerFeeFlat} />
          </div>
        )}
      </div>
    </Collapsible>
  );
};

FeesSection.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  procFeePctInput: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setProcFeePctInput: PropTypes.func.isRequired,
  effectiveProcFeePct: PropTypes.number.isRequired,
  brokerFeePct: PropTypes.string.isRequired,
  setBrokerFeePct: PropTypes.func.isRequired,
  brokerFeeFlat: PropTypes.string.isRequired,
  setBrokerFeeFlat: PropTypes.func.isRequired,
  isRetention: PropTypes.string.isRequired,
};