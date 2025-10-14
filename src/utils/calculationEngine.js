/**
 * Core loan calculation engine for BTL Rate Matrix Calculator
 * 
 * This module handles all Buy-to-Let loan calculations including:
 * - Gross and net loan amounts
 * - Interest calculations (rolled, deferred)
 * - Fee calculations
 * - LTV (Loan-to-Value) constraints
 * - ICR (Interest Coverage Ratio) validation
 * - Optimization for maximum net loan
 */
import { parseNumber } from './formatters';
import { getMaxLTV, applyFloorRate } from './rateSelectors';
import { LOAN_TYPES, PRODUCT_GROUPS, PROPERTY_TYPES } from '../config/constants';

/**
 * Compute comprehensive loan data for a specific fee column
 * 
 * This is the main calculation function that:
 * 1. Parses all inputs
 * 2. Calculates LTV and ICR constraints
 * 3. Either uses manual settings OR optimizes rolled/deferred for max net loan
 * 4. Returns complete loan breakdown with all fees and interest components
 * 
 * @param {Object} params - All calculation parameters
 * @param {string|number} params.colKey - Fee column key (e.g., "6", "4", "3", "2")
 * @param {number|null} params.manualRolled - User-set rolled months (overrides optimization)
 * @param {number|null} params.manualDeferred - User-set deferred rate (overrides optimization)
 * @param {number|null} params.overriddenRate - User-overridden interest rate
 * @param {Object} params.selected - Selected rate table object
 * @param {string} params.propertyValue - Property value as string
 * @param {string} params.monthlyRent - Monthly rental income as string
 * @param {string} params.specificNetLoan - Specific net loan (for SPECIFIC_NET type)
 * @param {string} params.specificGrossLoan - Specific gross loan (for SPECIFIC_GROSS type)
 * @param {number} params.specificLTV - Specific LTV cap (for MAX_LTV type)
 * @param {string} params.loanTypeRequired - Loan calculation type
 * @param {string} params.productType - Product type (e.g., "2yr Fix")
 * @param {string} params.tier - Risk tier ("Tier 1", "Tier 2", "Tier 3")
 * @param {Object} params.criteria - Property and applicant criteria answers
 * @param {string} params.propertyType - Property type (Residential/Commercial/Semi-Commercial)
 * @param {string} params.productGroup - Product group (Specialist/Core)
 * @param {string} params.isRetention - Retention case flag ("Yes"/"No")
 * @param {string} params.retentionLtv - Retention LTV range ("65"/"75")
 * @param {number} params.effectiveProcFeePct - Effective processing fee percentage
 * @param {string} params.brokerFeePct - Broker fee as percentage string
 * @param {string} params.brokerFeeFlat - Broker fee as flat amount string
 * @param {Object} params.feeOverrides - Fee percentage overrides by column key
 * @param {Object} params.limits - Loan limits and constraints configuration
 * 
 * @returns {Object|null} Complete loan calculation result or null if invalid
 * @property {string} productName - Product display name
 * @property {string} productType - Product type identifier
 * @property {string} fullRateText - Display text for full rate
 * @property {number} actualRateUsed - Actual rate used in calculation
 * @property {boolean} isRateOverridden - Whether rate was manually overridden
 * @property {string} payRateText - Display text for payment rate
 * @property {number} net - Net loan amount (advanced day 1)
 * @property {number} gross - Gross loan amount (total at redemption)
 * @property {number} feeAmt - Product fee amount
 * @property {number} rolled - Rolled interest amount
 * @property {number} deferred - Deferred interest amount
 * @property {number} ltv - Loan-to-value ratio (decimal)
 * @property {number} deferredCapPct - Deferred interest rate used
 * @property {number} rolledMonths - Number of rolled months
 * @property {number} termMonths - Total term in months
 * @property {number} directDebit - Monthly direct debit amount
 * @property {number} ddStartMonth - Month when direct debit starts
 * @property {number} procFeeValue - Processing fee value
 * @property {number} brokerFeeValue - Broker fee value
 * @property {number} maxLtvRule - Maximum LTV percentage allowed
 * @property {boolean} belowMin - Whether loan is below minimum threshold
 * @property {boolean} hitMaxCap - Whether loan hit maximum cap
 * @property {boolean} isManual - Whether manual settings were used
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

  // Get base rate from selected rate table
  const baseRate = selected?.[colKey];
  if (baseRate == null && overriddenRate == null) {
    return null; // No rate available for this fee column
  }

  // Parse all numeric inputs from strings
  const parsedPropertyValue = parseNumber(propertyValue);
  const parsedMonthlyRent = parseNumber(monthlyRent);
  const parsedSpecificNetLoan = parseNumber(specificNetLoan);
  const parsedSpecificGrossLoan = parseNumber(specificGrossLoan);

  // Calculate fee percentage as decimal (e.g., 6% becomes 0.06)
  const feePercentageDecimal = (feeOverrides[colKey] != null
    ? Number(feeOverrides[colKey])
    : Number(colKey)) / 100;

  // Get minimum Interest Coverage Ratio (ICR) based on product type
  // ICR = (Annual Rent) / (Annual Interest Payment)
  // Fixed products: 1.25 (Residential) or 1.30 (Commercial)
  // Tracker products: 1.30 (Residential) or 1.35 (Commercial)
  const minimumInterestCoverageRatio = productType.includes("Fix") 
    ? limits.MIN_ICR_FIX 
    : limits.MIN_ICR_TRK;

  // Calculate maximum LTV (Loan-to-Value) based on all rules
  const maximumLtvPercentage = getMaxLTV({
    propertyType,
    isRetention,
    retentionLtv,
    propertyAnswers: criteria,
    tier,
    productType,
  });
  
  // Convert maximum LTV percentage to pounds
  const ltvCapFromRules = parsedPropertyValue 
    ? Math.round(maximumLtvPercentage * parsedPropertyValue) 
    : Infinity;
  
  // Apply specific LTV cap if user specified MAX_LTV loan type
  const specificLtvCap = loanTypeRequired === LOAN_TYPES.MAX_LTV && specificLTV != null
    ? parsedPropertyValue * specificLTV
    : Infinity;

  // Final LTV cap is the lower of the two
  let loanToValueCap = loanTypeRequired === LOAN_TYPES.MAX_LTV
    ? Math.min(specificLtvCap, ltvCapFromRules)
    : ltvCapFromRules;

  // For SPECIFIC_GROSS loan type, also cap at the specified gross amount
  if (loanTypeRequired === LOAN_TYPES.SPECIFIC_GROSS && 
      parsedSpecificGrossLoan != null && 
      parsedSpecificGrossLoan > 0) {
    loanToValueCap = Math.min(loanToValueCap, parsedSpecificGrossLoan);
  }

  // Get loan term in months for this product type (24, 36, etc.)
  const termInMonths = limits.TERM_MONTHS?.[productType] ?? 24;
  
  // Determine maximum deferred interest rate based on product type
  // Fixed: 1.25% max, Tracker: 2.00% max
  const maximumDeferredInterestRate = selected?.isMargin 
    ? limits.MAX_DEFERRED_TRACKER 
    : limits.MAX_DEFERRED_FIX;

  // Determine which rate to use (user override takes precedence)
  const actualBaseRate = overriddenRate != null ? overriddenRate : baseRate;
  
  // Check if this is a tracker product (margin-based rate)
  const isTrackerProduct = !!selected?.isMargin;

  // Calculate display rate and stress test rate
  // For TRACKER products: display rate = margin + BBR (Base Bank Rate)
  // For FIXED products: display rate = base rate (no BBR added)
  let displayRate = isTrackerProduct 
    ? actualBaseRate + limits.STANDARD_BBR 
    : actualBaseRate;
  
  // Stress test rate uses higher BBR for affordability testing
  let stressTestRate = isTrackerProduct 
    ? actualBaseRate + limits.STRESS_BBR 
    : displayRate;

  // Store rates for gross loan calculation (may be adjusted by floor rate)
  let displayRateForGrossCalculation = displayRate;
  let stressRateForGrossCalculation = stressTestRate;

  // Apply Core product floor rate (5.5% minimum for Core Residential products)
  if (productGroup === PRODUCT_GROUPS.CORE && 
      propertyType === PROPERTY_TYPES.RESIDENTIAL) {
    displayRateForGrossCalculation = applyFloorRate(
      displayRateForGrossCalculation, 
      productGroup, 
      propertyType
    );
    stressRateForGrossCalculation = applyFloorRate(
      stressRateForGrossCalculation, 
      productGroup, 
      propertyType
    );
  }

  /**
   * Evaluate a specific combination of rolled months and deferred interest
   * 
   * This function calculates the actual loan amount that can be advanced
   * given specific rolled and deferred interest settings.
   * 
   * @param {number} rolledMonths - Number of months with rolled interest (0-9 for Residential)
   * @param {number} deferredInterestRate - Deferred interest rate as decimal (e.g., 0.0125 = 1.25%)
   * @returns {Object} Loan calculation result with all components
   */
  const evaluateLoanCombination = (rolledMonths, deferredInterestRate) => {
    // Calculate remaining months after rolled period ends
    const remainingMonths = Math.max(termInMonths - rolledMonths, 1);
    
    // Calculate stress-adjusted rate for ICR testing
    // Deferred interest reduces the payment rate, so subtract it from stress rate
    const stressAdjustedRate = Math.max(
      stressRateForGrossCalculation - deferredInterestRate, 
      1e-6 // Minimum to avoid division by zero
    );

    // ========================================================================
    // Calculate maximum gross loan from rental income (ICR constraint)
    // ========================================================================
    let maximumGrossFromRent = Infinity;
    if (parsedMonthlyRent && stressAdjustedRate > 0) {
      // Total rental income over loan term
      const annualRentalIncome = parsedMonthlyRent * termInMonths;
      
      // Formula: Gross = Annual Rent / (ICR × (Rate/12) × Months)
      // This ensures rental income covers interest payments at required ICR
      maximumGrossFromRent = annualRentalIncome / (
        minimumInterestCoverageRatio * 
        (stressAdjustedRate / 12) * 
        remainingMonths
      );
    }

    // ========================================================================
    // Calculate gross loan from specific net loan (if applicable)
    // ========================================================================
    let grossLoanFromSpecificNet = Infinity;
    if (loanTypeRequired === LOAN_TYPES.SPECIFIC_NET && 
        parsedSpecificNetLoan != null && 
        feePercentageDecimal < 1) {
      
      // Calculate payment rate (display rate minus deferred adjustment)
      const paymentRateAdjusted = Math.max(
        displayRateForGrossCalculation - deferredInterestRate, 
        0
      );
      
      // Formula: Gross = Net / (1 - Fee% - Rolled% - Deferred%)
      // This works backward from desired net loan to required gross
      const denominator = 1 
        - feePercentageDecimal 
        - (paymentRateAdjusted / 12) * rolledMonths 
        - (deferredInterestRate / 12) * termInMonths;
      
      if (denominator > 1e-7) {
        grossLoanFromSpecificNet = parsedSpecificNetLoan / denominator;
      }
    }

    // ========================================================================
    // Determine eligible gross loan (minimum of all constraints)
    // ========================================================================
    let eligibleGrossLoan = Math.min(
      loanToValueCap,           // LTV constraint
      maximumGrossFromRent,     // ICR/rental income constraint
      limits.MAX_LOAN           // Absolute maximum loan
    );
    
    // Apply specific net loan constraint if applicable
    if (loanTypeRequired === LOAN_TYPES.SPECIFIC_NET) {
      eligibleGrossLoan = Math.min(eligibleGrossLoan, grossLoanFromSpecificNet);
    }

    // If below minimum loan threshold (£150,000), set to zero
    if (eligibleGrossLoan < limits.MIN_LOAN - 1e-6) {
      eligibleGrossLoan = 0;
    }

    // ========================================================================
    // Calculate all fee and interest components
    // ========================================================================
    
    // Payment rate after deferred interest adjustment
    const paymentRateAdjusted = Math.max(
      displayRateForGrossCalculation - deferredInterestRate, 
      0
    );
    
    // Product fee (e.g., 6% of gross loan)
    const productFeeAmount = eligibleGrossLoan * feePercentageDecimal;
    
    // Rolled interest (paid upfront for initial months)
    const rolledInterestAmount = eligibleGrossLoan * 
      (paymentRateAdjusted / 12) * 
      rolledMonths;
    
    // Deferred interest (spread across full term)
    const deferredInterestAmount = eligibleGrossLoan * 
      (deferredInterestRate / 12) * 
      termInMonths;
    
    // Net loan = Gross - all upfront costs
    const netLoanAmount = eligibleGrossLoan 
      - productFeeAmount 
      - rolledInterestAmount 
      - deferredInterestAmount;
    
    // Calculate loan-to-value ratio
    const loanToValueRatio = parsedPropertyValue 
      ? eligibleGrossLoan / parsedPropertyValue 
      : null;

    // ========================================================================
    // Calculate processing and broker fees
    // ========================================================================
    const processingFeePercentageDecimal = Number(effectiveProcFeePct || 0) / 100;
    const brokerFeePercentageDecimal = brokerFeePct ? Number(brokerFeePct) / 100 : 0;
    
    const processingFeeValue = eligibleGrossLoan * processingFeePercentageDecimal;
    const brokerFeeValue = brokerFeeFlat
      ? Number(brokerFeeFlat)
      : eligibleGrossLoan * brokerFeePercentageDecimal;

    // Return complete loan breakdown
    return {
      grossLoan: eligibleGrossLoan,
      netLoan: netLoanAmount,
      productFeeAmount,
      rolledInterestAmount,
      deferredInterestAmount,
      loanToValueRatio,
      rolledMonths,
      deferredInterestRate,
      paymentRateAdjusted,
      processingFeeValue,
      brokerFeeValue,
    };
  };

  // ========================================================================
  // MAIN CALCULATION LOGIC
  // ========================================================================
  
  let bestLoanResult = null;

  // CASE 1: Core products - No rolled months or deferred interest allowed
  if (productGroup === PRODUCT_GROUPS.CORE && 
      propertyType === PROPERTY_TYPES.RESIDENTIAL) {
    bestLoanResult = evaluateLoanCombination(0, 0);
  } 
  
  // CASE 2: Manual settings - Use user-specified rolled/deferred values
  else if (manualRolled != null || manualDeferred != null) {
    const manualRolledMonths = Number.isFinite(manualRolled) ? manualRolled : 0;
    const manualDeferredRate = Number.isFinite(manualDeferred) ? manualDeferred : 0;
    
    // Ensure values are within allowed limits
    const safeRolledMonths = Math.max(
      0, 
      Math.min(manualRolledMonths, limits.MAX_ROLLED_MONTHS)
    );
    const safeDeferredRate = Math.max(
      0, 
      Math.min(manualDeferredRate, maximumDeferredInterestRate)
    );
    
    try {
      bestLoanResult = evaluateLoanCombination(safeRolledMonths, safeDeferredRate);
      
      // Fallback to no rolled/deferred if calculation fails
      if (!bestLoanResult || !isFinite(bestLoanResult.grossLoan)) {
        bestLoanResult = evaluateLoanCombination(0, 0);
      }
    } catch {
      // If any error occurs, use safe defaults
      bestLoanResult = evaluateLoanCombination(0, 0);
    }
  } 
  
  // CASE 3: Optimization - Find combination that maximizes net loan
  else {
    const maximumRolledMonths = Math.min(limits.MAX_ROLLED_MONTHS, termInMonths);
    const deferredStepSize = 0.0001; // Step size: 0.01% increments
    const totalDeferredSteps = Math.max(
      1, 
      Math.round(maximumDeferredInterestRate / deferredStepSize)
    );
    
    // Iterate through all possible combinations to find optimal
    for (let rolledMonths = 0; rolledMonths <= maximumRolledMonths; rolledMonths += 1) {
      for (let deferredStepIndex = 0; deferredStepIndex <= totalDeferredSteps; deferredStepIndex += 1) {
        const deferredInterestRate = deferredStepIndex * deferredStepSize;
        const loanCalculationResult = evaluateLoanCombination(
          rolledMonths, 
          deferredInterestRate
        );
        
        // Keep track of combination with highest net loan
        if (!bestLoanResult || 
            loanCalculationResult.netLoan > bestLoanResult.netLoan) {
          bestLoanResult = loanCalculationResult;
        }
      }
    }
  }

  // Return null if no valid result found
  if (!bestLoanResult) {
    return null;
  }

  // ========================================================================
  // CHECK STATUS FLAGS
  // ========================================================================
  
  // Check if loan is below minimum threshold (£150,000)
  const isBelowMinimumLoan = bestLoanResult.grossLoan > 0 && 
    bestLoanResult.grossLoan < limits.MIN_LOAN - 1e-6;
  
  // Check if loan hit maximum cap (£3,000,000)
  const hasReachedMaximumLoan = Math.abs(
    bestLoanResult.grossLoan - limits.MAX_LOAN
  ) < 1e-6;

  // ========================================================================
  // FORMAT DISPLAY TEXT
  // ========================================================================
  
  // Full rate display (includes BBR for tracker products)
  const fullRateDisplayText = isTrackerProduct
    ? `${((actualBaseRate + limits.STANDARD_BBR) * 100).toFixed(2)}%`
    : `${(displayRate * 100).toFixed(2)}%`;

  // Payment rate display (rate customer actually pays)
  const paymentRateDisplayText = isTrackerProduct
    ? `${(bestLoanResult.paymentRateAdjusted * 100).toFixed(2)}% + BBR`
    : `${(bestLoanResult.paymentRateAdjusted * 100).toFixed(2)}%`;

  // ========================================================================
  // CALCULATE MONTHLY DIRECT DEBIT
  // ========================================================================
  
  // Monthly payment amount (starts after rolled months period)
  const monthlyDirectDebitAmount = bestLoanResult.grossLoan * 
    (bestLoanResult.paymentRateAdjusted / 12);

  // ========================================================================
  // RETURN COMPLETE CALCULATION RESULT
  // ========================================================================
  
  return {
    // Product information
    productName: `${productType}, ${tier}`,
    productType,
    
    // Interest rates
    fullRateText: fullRateDisplayText,
    actualRateUsed: isTrackerProduct ? actualBaseRate : displayRate,
    isRateOverridden: overriddenRate != null,
    payRateText: paymentRateDisplayText,
    
    // Loan amounts (using original property names for compatibility)
    net: bestLoanResult.netLoan,
    gross: bestLoanResult.grossLoan,
    
    // Fee and interest components (using original property names)
    feeAmt: bestLoanResult.productFeeAmount,
    rolled: bestLoanResult.rolledInterestAmount,
    deferred: bestLoanResult.deferredInterestAmount,
    
    // Ratios and percentages
    ltv: bestLoanResult.loanToValueRatio,
    deferredCapPct: bestLoanResult.deferredInterestRate,
    
    // Configuration
    rolledMonths: bestLoanResult.rolledMonths,
    termMonths: termInMonths,
    
    // Payment information
    directDebit: monthlyDirectDebitAmount,
    ddStartMonth: bestLoanResult.rolledMonths + 1,
    
    // Additional fees
    procFeeValue: bestLoanResult.processingFeeValue,
    brokerFeeValue: bestLoanResult.brokerFeeValue,
    
    // Rules and limits
    maxLtvRule: maximumLtvPercentage,
    
    // Status flags (using original property names for compatibility)
    belowMin: isBelowMinimumLoan,
    hitMaxCap: hasReachedMaximumLoan,
    isManual: manualRolled != null || manualDeferred != null,
  };
};