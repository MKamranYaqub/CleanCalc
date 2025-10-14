/**
 * Parse a value to a valid number or null
 */
export const parseNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

/**
 * Format a number as GBP currency
 */
export const formatCurrency = (amount, decimals = 0) => {
  if (amount == null && amount !== 0) return "—";
  return Number(amount).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: decimals,
  });
};

/**
 * Format a decimal as percentage
 */
export const formatPercentage = (decimal, decimals = 2) => {
  if (decimal == null && decimal !== 0) return "—";
  return `${(Number(decimal) * 100).toFixed(decimals)}%`;
};

/**
 * Parse a percentage string to decimal
 */
export const parsePercentage = (str) => {
  if (str === "" || str == null) return null;
  const cleaned = String(str).replace("%", "").trim();
  const num = Number(cleaned);
  return Number.isFinite(num) ? num / 100 : null;
};