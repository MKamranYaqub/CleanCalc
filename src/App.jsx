/**
 * Main application component
 */
import React, { useState, useMemo, useEffect } from 'react';
import { useProductSelection } from './hooks/useProductSelection';
import { useCriteriaManagement } from './hooks/useCriteriaManagement';
import { useLoanInputs } from './hooks/useLoanInputs';
import { useFeeManagement } from './hooks/useFeeManagement';
import { ProductSetup } from './components/ProductSetup';
import { CriteriaSection } from './components/CriteriaSection';
import { PropertyProductSection } from './components/PropertyProductSection';
import { FeesSection } from './components/FeesSection';
import { SummarySection } from './components/SummarySection';
import { MatrixSection } from './components/MatrixSection';
import { BasicGrossSection } from './components/BasicGrossSection';
import { parseNumber, formatCurrency } from './utils/formatters';
import { selectRateSource, getFeeColumns, getMaxLTV } from './utils/rateSelectors';
import { computeColumnData } from './utils/calculationEngine';
import { LOAN_LIMITS } from './config/loanLimits';
import { PRODUCT_TYPES_LIST, PRODUCT_GROUPS, LOAN_TYPES } from './config/constants';
import './styles/styles.css';

function App() {
  const productSelection = useProductSelection();
  const {
    mainProductType,
    setMainProductType,
    propertyType,
    setPropertyType,
    isRetention,
    setIsRetention,
    retentionLtv,
    setRetentionLtv,
    productType,
    setProductType,
    productGroup,
    setProductGroup,
  } = productSelection;

  const criteriaManagement = useCriteriaManagement(propertyType);
  const { 
    criteria, 
    setCriteria, 
    tier, 
    getCurrentCriteria, 
    isWithinCoreCriteria,
    initializeCriteriaState,
  } = criteriaManagement;

  const loanInputs = useLoanInputs();
  const {
    propertyValue,
    setPropertyValue,
    monthlyRent,
    setMonthlyRent,
    specificNetLoan,
    setSpecificNetLoan,
    specificGrossLoan,
    setSpecificGrossLoan,
    loanTypeRequired,
    setLoanTypeRequired,
    specificLTV,
    setSpecificLTV,
  } = loanInputs;

  const feeManagement = useFeeManagement(isRetention);
  const {
    procFeePctInput,
    setProcFeePctInput,
    brokerFeePct,
    setBrokerFeePct,
    brokerFeeFlat,
    setBrokerFeeFlat,
    rateOverrides,
    feeOverrides,
    manualSettings,
    tempRateInput,
    tempFeeInput,
    effectiveProcFeePct,
    handleRateInputChange,
    handleRateInputBlur,
    handleFeeInputChange,
    handleFeeInputBlur,
    handleResetFeeOverride,
    handleRolledChange,
    handleDeferredChange,
    handleResetManual,
    handleResetRateOverride,
  } = feeManagement;

  const [openSections, setOpenSections] = useState({
    criteria: false,
    property: true,
    fees: false,
  });

  // Reset criteria when property type changes
  useEffect(() => {
    setCriteria(initializeCriteriaState(getCurrentCriteria()));
  }, [propertyType, getCurrentCriteria, initializeCriteriaState, setCriteria]);

  // Revert to Specialist if Core becomes ineligible
  useEffect(() => {
    if (productGroup === PRODUCT_GROUPS.CORE && !isWithinCoreCriteria) {
      setProductGroup(PRODUCT_GROUPS.SPECIALIST);
    }
  }, [isWithinCoreCriteria, productGroup, setProductGroup]);

  const limits = useMemo(() => {
    return LOAN_LIMITS[propertyType] || LOAN_LIMITS.Residential;
  }, [propertyType]);

  const productTypesList = PRODUCT_TYPES_LIST[propertyType] || PRODUCT_TYPES_LIST.Residential;

  const selected = useMemo(() => {
    return selectRateSource({
      propertyType,
      productGroup,
      isRetention,
      retentionLtv,
      tier,
      productType,
    });
  }, [propertyType, productGroup, isRetention, retentionLtv, tier, productType]);

  const feeColumns = useMemo(() => {
    return getFeeColumns({
      productGroup,
      isRetention,
      retentionLtv,
      propertyType,
    });
  }, [productGroup, isRetention, retentionLtv, propertyType]);

  const canShowMatrix = useMemo(() => {
    const mr = parseNumber(monthlyRent);
    const pv = parseNumber(propertyValue);
    const sn = parseNumber(specificNetLoan);
    const sg = parseNumber(specificGrossLoan);
    if (!mr) return false;
    if (loanTypeRequired === LOAN_TYPES.SPECIFIC_NET) return !!sn && !!pv;
    if (loanTypeRequired === LOAN_TYPES.MAX_LTV) return !!pv;
    if (loanTypeRequired === LOAN_TYPES.SPECIFIC_GROSS) return !!pv && !!sg;
    return !!pv;
  }, [monthlyRent, propertyValue, specificNetLoan, specificGrossLoan, loanTypeRequired]);

  const allColumnData = useMemo(() => {
    if (!canShowMatrix) return [];
    const pv = parseNumber(propertyValue);
    return feeColumns.map((colKey) => {
      const manual = manualSettings[colKey];
      const overriddenRate = rateOverrides[colKey];
      const data = computeColumnData({
        colKey,
        manualRolled: manual?.rolledMonths,
        manualDeferred: manual?.deferredPct,
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
      });
      if (!data) return null;
      const netLtv = pv ? data.net / pv : null;
      return { colKey, netLtv, ...data };
    }).filter(Boolean);
  }, [
    canShowMatrix,
    feeColumns,
    manualSettings,
    rateOverrides,
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
  ]);

  const maxLTV = useMemo(() => {
    return getMaxLTV({
      propertyType,
      isRetention,
      retentionLtv,
      propertyAnswers: criteria,
      tier,
      productType,
    });
  }, [propertyType, isRetention, retentionLtv, criteria, tier, productType]);

  const bestSummary = useMemo(() => {
    if (!canShowMatrix || !allColumnData.length) return null;
    const pv = parseNumber(propertyValue) || 0;
    let best = null;
    for (const d of allColumnData) {
      if (!best || d.net > best.net) {
        best = {
          colKey: d.colKey,
          gross: d.gross,
          grossStr: formatCurrency(d.gross),
          grossLtvPct: pv ? Math.round((d.gross / pv) * 100) : 0,
          net: d.net,
          netStr: formatCurrency(d.net),
          netLtvPct: pv ? Math.round((d.net / pv) * 100) : 0,
        };
      }
    }
    return best;
  }, [allColumnData, canShowMatrix, propertyValue]);

  const deferredCap = selected?.isMargin ? limits.MAX_DEFERRED_TRACKER : limits.MAX_DEFERRED_FIX;

  return (
    <div className="app-container">
      <ProductSetup
        mainProductType={mainProductType}
        setMainProductType={setMainProductType}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        isRetention={isRetention}
        setIsRetention={setIsRetention}
        retentionLtv={retentionLtv}
        setRetentionLtv={setRetentionLtv}
        productGroup={productGroup}
        setProductGroup={setProductGroup}
        isWithinCoreCriteria={isWithinCoreCriteria}
        tier={tier}
      />

      <CriteriaSection
        isOpen={openSections.criteria}
        onToggle={() => setOpenSections((s) => ({ ...s, criteria: !s.criteria }))}
        currentCriteria={getCurrentCriteria()}
        criteria={criteria}
        setCriteria={setCriteria}
      />

      <PropertyProductSection
        isOpen={openSections.property}
        onToggle={() => setOpenSections((s) => ({ ...s, property: !s.property }))}
        propertyValue={propertyValue}
        setPropertyValue={setPropertyValue}
        monthlyRent={monthlyRent}
        setMonthlyRent={setMonthlyRent}
        loanTypeRequired={loanTypeRequired}
        setLoanTypeRequired={setLoanTypeRequired}
        specificGrossLoan={specificGrossLoan}
        setSpecificGrossLoan={setSpecificGrossLoan}
        specificNetLoan={specificNetLoan}
        setSpecificNetLoan={setSpecificNetLoan}
        specificLTV={specificLTV}
        setSpecificLTV={setSpecificLTV}
        maxLTV={maxLTV}
        tier={tier}
        productType={productType}
        setProductType={setProductType}
        productTypesList={productTypesList}
      />

      <FeesSection
        isOpen={openSections.fees}
        onToggle={() => setOpenSections((s) => ({ ...s, fees: !s.fees }))}
        procFeePctInput={procFeePctInput}
        setProcFeePctInput={setProcFeePctInput}
        effectiveProcFeePct={effectiveProcFeePct}
        brokerFeePct={brokerFeePct}
        setBrokerFeePct={setBrokerFeePct}
        brokerFeeFlat={brokerFeeFlat}
        setBrokerFeeFlat={setBrokerFeeFlat}
        isRetention={isRetention}
      />

      <SummarySection
        bestSummary={bestSummary}
        loanTypeRequired={loanTypeRequired}
        productType={productType}
        tier={tier}
      />

      {canShowMatrix && (
        <>
          <MatrixSection
            allColumnData={allColumnData}
            productGroup={productGroup}
            propertyType={propertyType}
            isRetention={isRetention}
            limits={limits}
            deferredCap={deferredCap}
            manualSettings={manualSettings}
            feeOverrides={feeOverrides}
            tempRateInput={tempRateInput}
            tempFeeInput={tempFeeInput}
            handleRateInputChange={handleRateInputChange}
            handleRateInputBlur={handleRateInputBlur}
            handleFeeInputChange={handleFeeInputChange}
            handleFeeInputBlur={handleFeeInputBlur}
            handleResetFeeOverride={handleResetFeeOverride}
            handleRolledChange={handleRolledChange}
            handleDeferredChange={handleDeferredChange}
            handleResetManual={handleResetManual}
            handleResetRateOverride={handleResetRateOverride}
          />

          <BasicGrossSection
            feeColumns={feeColumns}
            selected={selected}
            propertyValue={propertyValue}
            monthlyRent={monthlyRent}
            specificNetLoan={specificNetLoan}
            specificGrossLoan={specificGrossLoan}
            loanTypeRequired={loanTypeRequired}
            specificLTV={specificLTV}
            productType={productType}
            tier={tier}
            criteria={criteria}
            propertyType={propertyType}
            productGroup={productGroup}
            isRetention={isRetention}
            retentionLtv={retentionLtv}
            feeOverrides={feeOverrides}
            limits={limits}
          />
        </>
      )}
    </div>
  );
}

export default App;