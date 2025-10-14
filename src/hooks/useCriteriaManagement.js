/**
 * Hook for managing criteria and tier calculation
 */
import { useState, useMemo, useCallback } from 'react';
import { PROPERTY_TYPES } from '../config/constants';
import { CRITERIA_CONFIG, CORE_CRITERIA_CONFIG } from '../config/criteria';

export const useCriteriaManagement = (propertyType) => {
  const getCurrentCriteria = useCallback(() => {
    if (propertyType === PROPERTY_TYPES.COMMERCIAL || 
        propertyType === PROPERTY_TYPES.SEMI_COMMERCIAL) {
      return CRITERIA_CONFIG.Commercial || CRITERIA_CONFIG.Residential;
    }
    return CRITERIA_CONFIG.Residential;
  }, [propertyType]);

  const initializeCriteriaState = useCallback((cfg) => {
    const state = {};
    cfg?.propertyQuestions?.forEach((q) => {
      state[q.key] = q.options[0].label;
    });
    cfg?.applicantQuestions?.forEach((q) => {
      state[q.key] = q.options[0].label;
    });
    return state;
  }, []);

  const [criteria, setCriteria] = useState(() => 
    initializeCriteriaState(getCurrentCriteria())
  );

  const tier = useMemo(() => {
    const cfg = getCurrentCriteria();
    let maxTier = 1;
    cfg?.propertyQuestions?.forEach((q) => {
      const answer = criteria[q.key];
      const option = q.options.find((opt) => opt.label === answer);
      if (option && option.tier > maxTier) maxTier = option.tier;
    });
    cfg?.applicantQuestions?.forEach((q) => {
      const answer = criteria[q.key];
      const option = q.options.find((opt) => opt.label === answer);
      if (option && option.tier > maxTier) maxTier = option.tier;
    });
    return `Tier ${maxTier}`;
  }, [criteria, getCurrentCriteria]);

  const isWithinCoreCriteria = useMemo(() => {
    if (propertyType !== PROPERTY_TYPES.RESIDENTIAL) return false;
    const coreCfg = CORE_CRITERIA_CONFIG?.Residential;
    if (!coreCfg) return false;

    const checkGroup = (groupKey, fullCfg) => {
      const coreGroup = coreCfg?.[groupKey] || [];
      for (const q of fullCfg?.[groupKey] || []) {
        const selectedAnswer = criteria[q.key];
        const coreQ = coreGroup.find((c) => c.key === q.key);
        if (!coreQ) continue;
        const allowedLabels = coreQ.options.map((o) => o.label);
        if (!allowedLabels.includes(selectedAnswer)) {
          return false;
        }
      }
      return true;
    };

    const okProp = checkGroup("propertyQuestions", CRITERIA_CONFIG?.Residential);
    const okApp = checkGroup("applicantQuestions", CRITERIA_CONFIG?.Residential);
    return okProp && okApp;
  }, [criteria, propertyType]);

  return {
    criteria,
    setCriteria,
    tier,
    getCurrentCriteria,
    isWithinCoreCriteria,
    initializeCriteriaState,
  };
};