/**
 * Matrix section component displaying loan calculations
 */
import React from 'react';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { SliderInput } from './UI/SliderInput';
import { PRODUCT_GROUPS, PROPERTY_TYPES } from '../config/constants';

const MATRIX_LABELS = [
  { key: "productName", label: "Product Name" },
  { key: "fullRate", label: "Full Rate (Editable)" },
  { key: "productFeePct", label: "Product Fee %" },
  { key: "payRate", label: "Pay Rate" },
  {
    key: "netLoan",
    label: (
      <>
        Net Loan{" "}
        <span style={{ fontSize: 11, fontWeight: 400 }}>
          (advanced day 1)
        </span>
      </>
    ),
  },
  {
    key: "grossLoan",
    label: (
      <>
        Max Gross Loan{" "}
        <span style={{ fontSize: 11, fontWeight: 400 }}>
          (paid at redemption)
        </span>
      </>
    ),
  },
  { key: "rolledMonths", label: "Rolled Months" },
  { key: "deferredAdjustment", label: "Deferred Adjustment" },
  { key: "productFee", label: "Product Fee" },
  { key: "rolledInterest", label: "Rolled Months Interest" },
  { key: "deferredInterest", label: "Deferred Interest" },
  { key: "directDebit", label: "Direct Debit" },
  { key: "procFee", label: "Proc Fee (£)" },
  { key: "brokerFee", label: "Broker Fee (£)" },
  { key: "revertRate", label: "Revert Rate" },
  { key: "totalTermERC", label: "Total Term | ERC" },
  { key: "maxLTV", label: "Max Product LTV" },
];

export const MatrixSection = ({
  allColumnData,
  productGroup,
  propertyType,
  isRetention,
  limits,
  deferredCap,
  manualSettings,
  feeOverrides,
  tempRateInput,
  tempFeeInput,
  handleRateInputChange,
  handleRateInputBlur,
  handleFeeInputChange,
  handleFeeInputBlur,
  handleResetFeeOverride,
  handleRolledChange,
  handleDeferredChange,
  handleResetManual,
  handleResetRateOverride,
}) => {
  const renderMatrixCellContent = (rowKey, data, colKey) => {
    const manual = manualSettings[colKey];
    const isOverridden = data.isRateOverridden;
    const isFeeOverridden = feeOverrides[colKey] != null;
    const showCoreNA = productGroup === PRODUCT_GROUPS.CORE && 
                       propertyType === PROPERTY_TYPES.RESIDENTIAL;
    
    const rateDisplayValue = tempRateInput[colKey] !== undefined
      ? tempRateInput[colKey]
      : `${(data.actualRateUsed * 100).toFixed(2)}%`;
    const defaultFeePctDec = Number(colKey) / 100;
    const currentFeePctDec = feeOverrides[colKey] != null
      ? Number(feeOverrides[colKey]) / 100
      : defaultFeePctDec;
    const feeDisplayValue = tempFeeInput[colKey] !== undefined
      ? tempFeeInput[colKey]
      : `${(currentFeePctDec * 100).toFixed(2)}%`;

    switch (rowKey) {
      case "productName":
        return data.productName;
      
      case "fullRate":
        return (
          <div style={{
            background: "#fefce8",
            padding: "4px 10px",
            border: isOverridden ? "1px solid #fde047" : "1px solid #ffffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            width: '100%'
          }}>
            <input
              type="text"
              value={rateDisplayValue}
              onChange={(e) => handleRateInputChange(colKey, e.target.value)}
              onBlur={(e) => handleRateInputBlur(colKey, e.target.value, data.actualRateUsed)}
              placeholder={data.fullRateText}
              style={{
                width: "100%",
                border: "none",
                textAlign: "center",
                fontWeight: 700,
                background: "transparent",
                color: isOverridden ? "#ca8a04" : "#1e293b",
              }}
            />
            {isOverridden && (
              <button
                onClick={() => handleResetRateOverride(colKey)}
                style={{
                  fontSize: 10,
                  color: "#ca8a04",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  marginTop: 4,
                }}
              >
                (Reset Rate)
              </button>
            )}
          </div>
        );

      case "productFeePct":
        return (
          <div style={{
            background: "#fefce8",
            padding: "4px 10px",
            border: isFeeOverridden ? "1px solid #fde047" : "1px solid #ffffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            width: '100%'
          }}>
            <input
              type="text"
              value={feeDisplayValue}
              onChange={(e) => handleFeeInputChange(colKey, e.target.value)}
              onBlur={(e) => handleFeeInputBlur(colKey, e.target.value, defaultFeePctDec)}
              placeholder={`${(defaultFeePctDec * 100).toFixed(2)}%`}
              style={{
                width: "100%",
                border: "none",
                textAlign: "center",
                fontWeight: 700,
                background: "transparent",
                color: isFeeOverridden ? "#ca8a04" : "#1e293b",
              }}
            />
            {isFeeOverridden && (
              <button
                onClick={() => handleResetFeeOverride(colKey)}
                style={{
                  fontSize: 10,
                  color: "#ca8a04",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  marginTop: 4,
                }}
              >
                (Reset Fee)
              </button>
            )}
          </div>
        );

      case "payRate":
        return data.payRateText;
      
      case "netLoan":
        return (
          <>
            <span style={{ fontWeight: 700 }}>{formatCurrency(data.net)}</span>
            {data.netLtv != null && (
              <span style={{ fontWeight: 400 }}>
                {" "}
                @ {Math.round(data.netLtv * 100)}% LTV
              </span>
            )}
          </>
        );
      
      case "grossLoan":
        return (
          <>
            <span style={{ fontWeight: 700 }}>{formatCurrency(data.gross)}</span>
            {data.ltv != null && (
              <span style={{ fontWeight: 400 }}>
                {" "}
                @ {Math.round(data.ltv * 100)}% LTV
              </span>
            )}
          </>
        );

      case "rolledMonths":
        if (showCoreNA) return "—";
        return (
          <div style={{
            width: "100%",
            background: manual?.rolledMonths != null ? "#fefce8" : "#fff",
            borderRadius: 8,
            padding: "1px 1px",
            marginTop: 4,
            marginBottom: 4,
          }}>
            <SliderInput
              label=""
              min={0}
              max={Math.min(limits.MAX_ROLLED_MONTHS, data.termMonths)}
              step={1}
              value={manual?.rolledMonths ?? data.rolledMonths}
              onChange={(val) => handleRolledChange(colKey, val)}
              formatValue={(v) => `${v} months`}
              style={{ margin: "4px 0" }}
            />
          </div>
        );
      
      case "deferredAdjustment":
        if (showCoreNA) return "—";
        return (
          <div style={{
            width: "100%",
            background: manual?.deferredPct != null ? "#fefce8" : "#fff",
            borderRadius: 8,
            padding: "1px 1px",
            marginTop: 4,
            marginBottom: 4,
          }}>
            <SliderInput
              label=""
              min={0}
              max={deferredCap}
              step={0.0001}
              value={manual?.deferredPct ?? data.deferredCapPct}
              onChange={(val) => handleDeferredChange(colKey, val)}
              formatValue={(v) => formatPercentage(v, 2)}
              style={{ margin: "4px 0" }}
            />
            {(manual?.rolledMonths != null || manual?.deferredPct != null) && (
              <button
                onClick={() => handleResetManual(colKey)}
                style={{
                  fontSize: 10,
                  color: "#ca8a04",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  marginTop: 4,
                  alignSelf: "end",
                  display: "block",
                  width: "100%",
                  textAlign: "right",
                }}
              >
                (Reset to Optimum)
              </button>
            )}
          </div>
        );

      case "productFee":
        return (
          <>
            {formatCurrency(data.feeAmt)} (
            {(feeOverrides[colKey] != null
              ? Number(feeOverrides[colKey])
              : Number(colKey)
            ).toFixed(2)}
            %)
          </>
        );
      
      case "rolledInterest":
        return showCoreNA
          ? "—"
          : `${formatCurrency(data.rolled)} (${data.rolledMonths} months)`;
      
      case "deferredInterest":
        return showCoreNA
          ? "—"
          : `${formatCurrency(data.deferred)} (${(data.deferredCapPct * 100).toFixed(2)}%)`;
      
      case "directDebit":
        return `${formatCurrency(data.directDebit)} from month ${data.ddStartMonth}`;
      
      case "procFee":
        return formatCurrency(data.procFeeValue);
      
      case "brokerFee":
        return formatCurrency(data.brokerFeeValue);

      case "revertRate":
        return "MVR";

      case "totalTermERC":
        return (
          <>
            {limits.TOTAL_TERM} years |{" "}
            {data.productType.includes("2yr")
              ? "3% in year 1, 2% in year 2"
              : data.productType.includes("3yr")
              ? "3% in year 1, 2% in year 2, 1% in year 3"
              : "Refer to product terms"}
          </>
        );
      
      case "maxLTV":
        return `${(data.maxLtvRule * 100).toFixed(0)}%`;

      default:
        return null;
    }
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
        display: "grid",
        gridTemplateColumns: "220px repeat(auto-fit, minmax(220px, 1fr))",
        alignItems: "stretch",
        border: "1px solid #e2e3e4",
        borderRadius: 12,
        overflow: "hidden",
        marginTop: 12,
        background: "#fff",
      }}>
        {/* Warning */}
        {(() => {
          const anyBelowMin = allColumnData.some((d) => d.belowMin);
          const anyAtMaxCap = allColumnData.some((d) => d.hitMaxCap);
          if (anyBelowMin || anyAtMaxCap) {
            return (
              <div style={{
                gridColumn: "1 / -1",
                margin: "8px 0 12px",
                padding: "10px 12px",
                borderRadius: 10,
                background: "#fff7ed",
                border: "1px solid #fed7aa",
                color: "#7c2d12",
                fontWeight: 600,
                textAlign: "center",
                gridRow: 1,
              }}>
                {anyBelowMin &&
                  "One or more gross loans are below the £150,000 minimum threshold. "}
                {anyAtMaxCap &&
                  "One or more gross loans are capped at the maximum loan limit."}
              </div>
            );
          }
          return null;
        })()}

        {/* Headers */}
        <div style={{ gridRow: 2 }}></div>
        {allColumnData.map((d, idx) => {
          const headColors = ["#008891", "#ED8B00", "#902057", "#0284c7"];
          return (
            <div
              key={d.colKey}
              style={{
                gridColumn: idx + 2,
                gridRow: 2,
                padding: "8px 10px",
                fontWeight: 800,
                textAlign: "center",
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
                fontSize: 14,
                border: "1px solid #e2e3e4",
                background: headColors[idx % headColors.length],
              }}
            >
              BTL {productGroup}
              {isRetention === "Yes" ? " Retention" : ""}{" "}
              {Number(d.colKey)}% FEE
            </div>
          );
        })}

        {/* Rows */}
        {MATRIX_LABELS.map((row, rowIndex) => (
          <React.Fragment key={row.key}>
            <div style={{
              gridColumn: 1,
              gridRow: rowIndex + 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "1px 1px",
              borderBottom: "1px solid #dcdcdd",
              borderRight: "1px solid #dcdcdd",
              background: "#f7f6f6",
              fontSize: 14,
              fontWeight: 400,
              color: "#1e293b",
            }}>
              <div style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#334155",
                width: "100%",
                textAlign: "left",
                padding: "0 4px",
              }}>
                <b>{row.label}</b>
              </div>
            </div>

            {allColumnData.map((data, colIndex) => {
              const content = renderMatrixCellContent(row.key, data, data.colKey);
              const isInputRow = row.key === 'fullRate' || row.key === 'productFeePct';
              const isSliderRow = row.key === 'rolledMonths' || row.key === 'deferredAdjustment';

              return (
                <div
                  key={data.colKey + row.key}
                  style={{
                    gridColumn: colIndex + 2,
                    gridRow: rowIndex + 3,
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: isSliderRow ? "flex-start" : "center",
                    padding: "1px 1px",
                    borderBottom: "1px solid #dcdcdd",
                    borderRight: "1px solid #dcdcdd",
                  }}
                >
                  <div style={{
                    width: "100%",
                    textAlign: "center",
                    fontWeight: 400,
                    background: "#ffffff",
                    borderRadius: 8,
                    padding: isInputRow ? "0" : "8px 10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {content}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
     </div>
  );
};