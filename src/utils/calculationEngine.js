/**
 * Core loan calculation engine
 */
import { parseNumber } from './formatters';
import { getMaxLTV, applyFloorRate } from './rateSelectors';
import { LOAN_TYPES, PRODUCT_GROUPS, PROPERTY_TYPES } from '../config/constants';

/**
 * Compute loan data for a specific fee column
 */
export const computeColumnData = (params) => {
  const {
    colKey,
    manualRolled,
    manualDeferred,
    overriddenRate,
    selected,
    propertyValue,
    monthlyRent,
    specificNetLoan,
    specificGrossLoan,
    specificLTV,
    loanTypeRequired,
    productType,
    tier,
    criteria,
    propertyType,
    productGroup,
    isRetention,
    retentionLtv,
    effectiveProcFeePct,
    brokerFeePct,
    brokerFeeFlat,
    feeOverrides,
    limits,
  } = params;

  const base = selected?.[colKey];
  if (base == null && overriddenRate == null) return null;

  const pv = parseNumber(propertyValue);
  const mr = parseNumber(monthlyRent);
  const sn = parseNumber(specificNetLoan);
  const sg = parseNumber(specificGrossLoan);

  const feePct = (feeOverrides[colKey] != null
    ? Number(feeOverrides[colKey])
    : Number(colKey)) / 100;

  const minICR = productType.includes("Fix") ? limits.MIN_ICR_FIX : limits.MIN_ICR_TRK;

  const maxLTVPercent = getMaxLTV({
    propertyType,
    isRetention,
    retentionLtv,
    propertyAnswers: criteria,
    tier,
    productType,
  });
  
  const rulesLTVCap = pv ? Math.round(maxLTVPercent * pv) : Infinity;
  const specificLTVCap = loanTypeRequired === LOAN_TYPES.MAX_LTV && specificLTV != null
    ? pv * specificLTV
    : Infinity;

  let ltvCap = loanTypeRequired === LOAN_TYPES.MAX_LTV
    ? Math.min(specificLTVCap, rulesLTVCap)
    : rulesLTVCap;

  if (loanTypeRequired === LOAN_TYPES.SPECIFIC_GROSS && sg != null && sg > 0) {
    ltvCap = Math.min(ltvCap, sg);
  }

  const termMonths = limits.TERM_MONTHS?.[productType] ?? 24;
  const deferredCap = selected?.isMargin ? limits.MAX_DEFERRED_TRACKER : limits.MAX_DEFERRED_FIX;

  const actualBaseRate = overriddenRate != null ? overriddenRate : base;
  const isTracker = !!selected?.isMargin;

  let displayRate = isTracker ? actualBaseRate + limits.STANDARD_BBR : actualBaseRate;
  let stressRate = isTracker ? actualBaseRate + limits.STRESS_BBR : displayRate;

  let displayRateForGross = displayRate;
  let stressRateForGross = stressRate;

  if (productGroup === PRODUCT_GROUPS.CORE && 
      propertyType === PROPERTY_TYPES.RESIDENTIAL) {
    displayRateForGross = applyFloorRate(displayRateForGross, productGroup, propertyType);
    stressRateForGross = applyFloorRate(stressRateForGross, productGroup, propertyType);
  }

  const evaluateLoanCombination = (rolledMonths, deferredRate) => {
    const monthsLeft = Math.max(termMonths - rolledMonths, 1);
    const stressAdj = Math.max(stressRateForGross - deferredRate, 1e-6);

    let grossRent = Infinity;
    if (mr && stressAdj > 0) {
      const annualRent = mr * termMonths;
      grossRent = annualRent / (minICR * (stressAdj / 12) * monthsLeft);
    }

    let grossFromNet = Infinity;
    if (loanTypeRequired === LOAN_TYPES.SPECIFIC_NET && sn != null && feePct < 1) {
      const payRateAdj = Math.max(displayRateForGross - deferredRate, 0);
      const denom = 1 - feePct - (payRateAdj / 12) * rolledMonths - (deferredRate / 12) * termMonths;
      if (denom > 1e-7) grossFromNet = sn / denom;
    }

    let eligibleGross = Math.min(ltvCap, grossRent, limits.MAX_LOAN);
    if (loanTypeRequired === LOAN_TYPES.SPECIFIC_NET) {
      eligibleGross = Math.min(eligibleGross, grossFromNet);
    }

    if (eligibleGross < limits.MIN_LOAN - 1e-6) eligibleGross = 0;

    const payRateAdj = Math.max(displayRateForGross - deferredRate, 0);
    const feeAmt = eligibleGross * feePct;
    const rolledAmt = eligibleGross * (payRateAdj / 12) * rolledMonths;
    const deferredAmt = eligibleGross * (deferredRate / 12) * termMonths;
    const net = eligibleGross - feeAmt - rolledAmt - deferredAmt;
    const ltv = pv ? eligibleGross / pv : null;

    const procFeeDec = Number(effectiveProcFeePct || 0) / 100;
    const brokerFeeDec = brokerFeePct ? Number(brokerFeePct) / 100 : 0;
    const procFeeValue = eligibleGross * procFeeDec;
    const brokerFeeValue = brokerFeeFlat
      ? Number(brokerFeeFlat)
      : eligibleGross * brokerFeeDec;

    return {
      gross: eligibleGross,
      net,
      feeAmt,
      rolledAmt,
      deferredAmt,
      ltv,
      rolledMonths,
      deferredRate,
      payRateAdj,
      procFeeValue,
      brokerFeeValue,
    };
  };

  let best = null;

  if (productGroup === PRODUCT_GROUPS.CORE && 
      propertyType === PROPERTY_TYPES.RESIDENTIAL) {
    best = evaluateLoanCombination(0, 0);
  } else if (manualRolled != null || manualDeferred != null) {
    const rolled = Number.isFinite(manualRolled) ? manualRolled : 0;
    const deferred = Number.isFinite(manualDeferred) ? manualDeferred : 0;
    const safeRolled = Math.max(0, Math.min(rolled, limits.MAX_ROLLED_MONTHS));
    const safeDeferred = Math.max(0, Math.min(deferred, deferredCap));
    try {
      best = evaluateLoanCombination(safeRolled, safeDeferred);
      if (!best || !isFinite(best.gross)) best = evaluateLoanCombination(0, 0);
    } catch {
      best = evaluateLoanCombination(0, 0);
    }
  } else {
    const maxRolled = Math.min(limits.MAX_ROLLED_MONTHS, termMonths);
    const step = 0.0001;
    const steps = Math.max(1, Math.round(deferredCap / step));
    for (let r = 0; r <= maxRolled; r += 1) {
      for (let j = 0; j <= steps; j += 1) {
        const d = j * step;
        const out = evaluateLoanCombination(r, d);
        if (!best || out.net > best.net) best = out;
      }
    }
  }

  if (!best) return null;

  const belowMin = best.gross > 0 && best.gross < limits.MIN_LOAN - 1e-6;
  const hitMaxCap = Math.abs(best.gross - limits.MAX_LOAN) < 1e-6;

  const fullRateText = isTracker
    ? `${((actualBaseRate + limits.STANDARD_BBR) * 100).toFixed(2)}%`
    : `${(displayRate * 100).toFixed(2)}%`;

  const payRateText = isTracker
    ? `${(best.payRateAdj * 100).toFixed(2)}% + BBR`
    : `${(best.payRateAdj * 100).toFixed(2)}%`;

  const ddAmount = best.gross * (best.payRateAdj / 12);

  return {
    productName: `${productType}, ${tier}`,
    productType,
    fullRateText,
    actualRateUsed: isTracker ? actualBaseRate : displayRate,
    isRateOverridden: overriddenRate != null,
    payRateText,
    deferredCapPct: best.deferredRate,
    net: best.net,
    gross: best.gross,
    feeAmt: best.feeAmt,
    rolled: best.rolledAmt,
    deferred: best.deferredAmt,
    ltv: best.ltv,
    rolledMonths: best.rolledMonths,
    directDebit: ddAmount,
    maxLtvRule: maxLTVPercent,
    termMonths,
    belowMin,
    hitMaxCap,
    ddStartMonth: best.rolledMonths + 1,
    isManual: manualRolled != null && manualDeferred != null,
    procFeeValue: best.procFeeValue,
    brokerFeeValue: best.brokerFeeValue,
  };
};