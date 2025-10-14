/**
 * Criteria section component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Collapsible } from './UI/Collapsible';

export const CriteriaSection = ({
  isOpen,
  onToggle,
  currentCriteria,
  criteria,
  setCriteria,
}) => {
  return (
    <Collapsible
      title="🏠 Criteria"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div style={{
        display: "grid",
        gap: "16px",
        gridTemplateColumns: "repeat(4, minmax(220px, 1fr))",
      }}>
        {currentCriteria?.propertyQuestions?.map((q) => (
          <div key={q.key} style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              {q.label}
            </label>
            <select
              value={criteria[q.key]}
              onChange={(e) =>
                setCriteria((prev) => ({
                  ...prev,
                  [q.key]: e.target.value,
                }))
              }
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
              {q.options.map((o) => (
                <option key={o.label} value={o.label}>
                  {o.label}
                </option>
              ))}
            </select>
            {q.helper && (
              <div style={{
                marginTop: 8,
                background: "#f1f5f9",
                color: "#475569",
                fontSize: 12,
                padding: "8px 10px",
                borderRadius: 8,
                textAlign: "center",
              }}>
                {q.helper}
              </div>
            )}
          </div>
        ))}

        {currentCriteria?.applicantQuestions?.map((q) => (
          <div key={q.key} style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              {q.label}
            </label>
            <select
              value={criteria[q.key]}
              onChange={(e) =>
                setCriteria((prev) => ({
                  ...prev,
                  [q.key]: e.target.value,
                }))
              }
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
              {q.options.map((o) => (
                <option key={o.label} value={o.label}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </Collapsible>
  );
};

CriteriaSection.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  currentCriteria: PropTypes.shape({
    propertyQuestions: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        tier: PropTypes.number.isRequired,
      })).isRequired,
      helper: PropTypes.string,
    })),
    applicantQuestions: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        tier: PropTypes.number.isRequired,
      })).isRequired,
    })),
  }).isRequired,
  criteria: PropTypes.object.isRequired,
  setCriteria: PropTypes.func.isRequired,
};