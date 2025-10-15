/**
 * Summary section component showing best loan option
 */
import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../utils/formatters';
import { LOAN_TYPES } from '../config/constants';

export const SummarySection = ({
  bestSummary,
  loanTypeRequired,
  productType,
  tier,
}) => {
  if (!bestSummary) return null;

  return (
    <div style={{
      gridColumn: "1 / -1",
      background: "#008891",
      color: "#fff",
      padding: 0,
      overflow: "hidden",
      borderRadius: 8,
    }}>
      <div style={{
        padding: "12px 16px",
        textAlign: "center",
        fontWeight: 800,
        fontSize: 18,
      }}>
        {loanTypeRequired === LOAN_TYPES.MAX_OPTIMUM_GROSS
          ? "Based on the inputs, the maximum gross loan is:"
          : `${loanTypeRequired} is:`}
      </div>
      <div style={{ padding: "12px 16px" }}>
        <div style={{
          background: "#fff",
          color: "#111827",
          borderRadius: 8,
          padding: "14px 16px",
          fontSize: 22,
          fontWeight: 800,
          textAlign: "center",
        }}>
          {bestSummary.grossStr} @ {bestSummary.grossLtvPct}% LTV,{" "}
          {productType}, {tier}, {Number(bestSummary.colKey)}% Fee
        </div>
        <div style={{
          marginTop: 8,
          background: "#00285b",
          color: "#fff",
          borderRadius: 8,
          padding: "8px 12px",
          textAlign: "center",
          fontSize: 12,
        }}>
          <span style={{ fontWeight: 800, textDecoration: "underline" }}>
            Max net loan
          </span>
          <span style={{ opacity: 0.95 }}>
            {" "}
            (amount advanced day 1) is {bestSummary.netStr} @{" "}
            {bestSummary.netLtvPct}% LTV, {productType}, {tier},{" "}
            {Number(bestSummary.colKey)}% Fee
          </span>
        </div>
      </div>
    </div>
  );
};

SummarySection.propTypes = {
  bestSummary: PropTypes.shape({
    colKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gross: PropTypes.number,
    grossStr: PropTypes.string,
    grossLtvPct: PropTypes.number,
    net: PropTypes.number,
    netStr: PropTypes.string,
    netLtvPct: PropTypes.number,
  }),
  loanTypeRequired: PropTypes.string.isRequired,
  productType: PropTypes.string.isRequired,
  tier: PropTypes.string.isRequired,
};

SummarySection.defaultProps = {
  bestSummary: null,
};