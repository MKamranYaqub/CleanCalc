/**
 * Basic Gross section component (no roll/defer calculations)
 */
import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { parseNumber } from '../utils/formatters';
import { getMaxLTV, applyFloorRate } from '../utils/rateSelectors';
import { PRODUCT_GROUPS, PROPERTY_TYPES } from '../config/constants';

export const BasicGrossSection = ({
  feeColumns,
  selected,
  propertyValue,
  monthlyRent,
  specificNetLoan,
  specificGrossLoan,
  loanTypeRequired,
  specificLTV,
  productType,
  tier,
  criteria,
  propertyType,
  productGroup,
  isRetention,
  retentionLtv,
  feeOverrides,
  limits,
}) => {
  const computeBasicGrossForCol = (colKey) => {
    const base = selected?.[colKey];
    if (base == null) return null;

    const pv = parseNumber(propertyValue);
    const mr = parseNumber(monthlyRent);
    const sn = parseNumber(specificNetLoan);
    const sg = parseNumber(specificGrossLoan);

    const feePct = feeOverrides[colKey] != null
      ? Number(feeOverrides[colKey]) / 100
      : Number(colKey) / 100;

    const minICR = productType.includes("Fix") ? limits.MIN_ICR_FIX : limits.MIN_ICR_TRK;

    const maxLTVPercent = getMaxLTV({
      propertyType,
      isRetention,
      retentionLtv,
      propertyAnswers: criteria,
      tier,
      productType,
    });

    let ltvCap = pv ? Math.round(maxLTVPercent * pv) : Infinity;
    if (loanTypeRequired === "Maximum LTV Loan" && specificLTV != null) {
      ltvCap = Math.min(ltvCap, pv * specificLTV);
    }
    if (loanTypeRequired === "Specific Gross Loan" && sg != null && sg > 0) {
      ltvCap = Math.min(ltvCap, sg);
    }

    const termMonths = limits.TERM_MONTHS?.[productType] ?? 24;
    const isTracker = !!selected?.isMargin;

    let displayRate = isTracker ? base + limits.STANDARD_BBR : base;
    let stressRate = isTracker ? base + limits.STRESS_BBR : displayRate;

    if (productGroup === PRODUCT_GROUPS.CORE && 
        propertyType === PROPERTY_TYPES.RESIDENTIAL) {
      displayRate = applyFloorRate(displayRate, productGroup, propertyType);
      stressRate = applyFloorRate(stressRate, productGroup, propertyType);
    }

    const deferred = 0;
    const rolled = 0;
    const monthsLeft = termMonths - rolled;
    const stressAdj = Math.max(stressRate - deferred, 1e-6);

    let grossRent = Infinity;
    if (mr && stressAdj) {
      const annualRent = mr * termMonths;
      grossRent = annualRent / (minICR * (stressAdj / 12) * Math.max(monthsLeft, 1));
    }

    let grossFromNet = Infinity;
    if (loanTypeRequired === "Specific Net Loan" && sn != null && feePct < 1) {
      const denom = 1 - feePct;
      if (denom > 0) grossFromNet = sn / denom;
    }

    let eligibleGross = Math.min(ltvCap, grossRent, limits.MAX_LOAN);
    if (loanTypeRequired === "Specific Net Loan") {
      eligibleGross = Math.min(eligibleGross, grossFromNet);
    }

    const ltvPct = pv ? Math.round((eligibleGross / pv) * 100) : null;

    return {
      grossBasic: eligibleGross,
      ltvPctBasic: ltvPct,
    };
  };

  return (
    <div style={{
      gridColumn: "1 / -1",
      background: "#ffffff",
      border: "1px solid #e2e3e4",
      borderRadius: "8px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      padding: "16px",
    }}>
      <div style={{
        textAlign: "center",
        color: "#7c2d12",
        background: "#fff7ed",
        border: "1px solid #fed7aa",
        borderRadius: 10,
        padding: "10px 12px",
        fontWeight: 600,
        marginBottom: 12,
      }}>
        Results use optimum rolled & deferred interest for maximum net loan, unless manually overridden.
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "220px repeat(auto-fit, minmax(220px, 1fr))",
        alignItems: "stretch",
        border: "1px solid #e2e3e4",
        borderRadius: 12,
        overflow: "hidden",
        marginTop: 12,
        background: "#fff",
        gap: 0,
      }}>
        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateRows: "48px",
          border: "1px solid transparent",
          background: "transparent",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#475569",
            fontWeight: 700,
          }}>
            Basic Gross (No Roll / Deferred)
          </div>
        </div>

        {/* Data Columns */}
        {feeColumns.map((colKey) => {
          const data = computeBasicGrossForCol(colKey);
          if (!data) return null;

          return (
            <div
              key={`basic-${colKey}`}
              style={{
                display: "grid",
                gridTemplateRows: "48px",
                border: "1px solid #e2e3e4",
                borderRadius: 8,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 6,
              }}>
                <div style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: 800,
                  background: "#f1f5f9",
                  borderRadius: 8,
                  padding: "10px 12px",
                }}>
                  {formatCurrency(data.grossBasic)}{" "}
                  <span style={{ fontWeight: 700 }}>
                    @ {data.ltvPctBasic != null ? `${data.ltvPctBasic}% LTV` : "—"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        gridColumn: "1 / -1",
        textAlign: "center",
        marginTop: 12,
        fontSize: 12,
        color: "#334155",
      }}>
        <span style={{ marginRight: 16 }}>
          <b>MVR (Market Financial Solutions Variable Rate)</b> is currently{" "}
          {(limits.CURRENT_MVR * 100).toFixed(2)}%
        </span>
        <span>
          <b>BBR</b> is currently {(limits.STANDARD_BBR * 100).toFixed(2)}%
        </span>
      </div>
    </div>
  );
};