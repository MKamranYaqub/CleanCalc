/**
 * Hook for managing loan input fields
 */
import { useState } from 'react';
import { LOAN_TYPES } from '../config/constants';

export const useLoanInputs = () => {
  const [propertyValue, setPropertyValue] = useState("1000000");
  const [monthlyRent, setMonthlyRent] = useState("3000");
  const [specificNetLoan, setSpecificNetLoan] = useState("");
  const [specificGrossLoan, setSpecificGrossLoan] = useState("");
  const [loanTypeRequired, setLoanTypeRequired] = useState(LOAN_TYPES.MAX_OPTIMUM_GROSS);
  const [specificLTV, setSpecificLTV] = useState(0.75);

  return {
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
  };
};