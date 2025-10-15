/**
 * Hook for managing fees and overrides
 */
import { useState, useMemo, useEffect, useCallback } from 'react';
import { parsePercentage } from '../utils/formatters';

export const useFeeManagement = (isRetention) => {
  const [procFeePctInput, setProcFeePctInput] = useState(1);
  const [brokerFeePct, setBrokerFeePct] = useState("");
  const [brokerFeeFlat, setBrokerFeeFlat] = useState("");
  const [rateOverrides, setRateOverrides] = useState({});
  const [feeOverrides, setFeeOverrides] = useState({});
  const [manualSettings, setManualSettings] = useState({});
  const [tempRateInput, setTempRateInput] = useState({});
  const [tempFeeInput, setTempFeeInput] = useState({});

  useEffect(() => {
    setProcFeePctInput(isRetention === "Yes" ? 0.5 : 1.0);
  }, [isRetention]);

  const effectiveProcFeePct = useMemo(() => {
    const base = Number(procFeePctInput || 0) || 1;
    return base;
  }, [procFeePctInput]);

  const handleRateInputChange = useCallback((colKey, val) => {
    setTempRateInput((p) => ({ ...p, [colKey]: val }));
  }, []);
  
  const handleRateInputBlur = useCallback((colKey, val, originalRate) => {
    setTempRateInput((p) => ({ ...p, [colKey]: undefined }));
    const parsed = parsePercentage(val);
    if (parsed != null && Math.abs(parsed - originalRate) > 1e-5) {
      setRateOverrides((p) => ({ ...p, [colKey]: parsed }));
    } else {
      setRateOverrides((p) => {
        const s = { ...p };
        delete s[colKey];
        return s;
      });
    }
  }, []);

  const handleFeeInputChange = useCallback((colKey, val) => {
    setTempFeeInput((p) => ({ ...p, [colKey]: val }));
  }, []);
  
  const handleFeeInputBlur = useCallback((colKey, val, origPctDec) => {
    setTempFeeInput((p) => ({ ...p, [colKey]: undefined }));
    const parsed = parsePercentage(val);
    if (parsed != null && Math.abs(parsed - origPctDec) > 1e-8) {
      setFeeOverrides((p) => ({ ...p, [colKey]: parsed * 100 }));
    } else {
      setFeeOverrides((p) => {
        const s = { ...p };
        delete s[colKey];
        return s;
      });
    }
  }, []);

  const handleResetFeeOverride = useCallback((colKey) => {
    setFeeOverrides((p) => {
      const s = { ...p };
      delete s[colKey];
      return s;
    });
  }, []);

  const handleRolledChange = useCallback((colKey, v) => {
    setManualSettings((p) => ({
      ...p,
      [colKey]: { ...p[colKey], rolledMonths: v },
    }));
  }, []);

  const handleDeferredChange = useCallback((colKey, v) => {
    setManualSettings((p) => ({
      ...p,
      [colKey]: { ...p[colKey], deferredPct: v },
    }));
  }, []);

  const handleResetManual = useCallback((colKey) => {
    setManualSettings((p) => {
      const s = { ...p };
      delete s[colKey];
      return s;
    });
  }, []);

  const handleResetRateOverride = useCallback((colKey) => {
    setRateOverrides((p) => {
      const s = { ...p };
      delete s[colKey];
      return s;
    });
  }, []);

  return {
    procFeePctInput,
    setProcFeePctInput,
    brokerFeePct,
    setBrokerFeePct,
    brokerFeeFlat,
    setBrokerFeeFlat,
    rateOverrides,
    setRateOverrides,
    feeOverrides,
    setFeeOverrides,
    manualSettings,
    setManualSettings,
    tempRateInput,
    setTempRateInput,
    tempFeeInput,
    setTempFeeInput,
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
  };
};