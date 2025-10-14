/**
 * Design tokens for consistent styling across the application
 */

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 40,
  };
  
  export const GRID = {
    labelWidth: 220,
    columnMinWidth: 220,
    rowHeight: 48,
    headerHeight: 48,
    gap: 8,
    gapLarge: 16,
    gapSmall: 4,
  };
  
  export const COLORS = {
    // Primary colors
    primary: '#008891',
    primaryHover: '#006b73',
    
    // Secondary colors
    secondary: '#ED8B00',
    tertiary: '#902057',
    quaternary: '#0284c7',
    
    // Status colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Neutral colors
    background: '#f1f5f9',
    cardBackground: '#ffffff',
    border: '#e2e3e4',
    borderLight: '#e2e8f0',
    borderDark: '#cbd5e1',
    
    // Text colors
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textTertiary: '#64748b',
    textLight: '#94a3b8',
    
    // Component specific
    inputBorder: '#cbd5e1',
    inputFocus: '#60a5fa',
    inputBackground: '#ffffff',
    
    // Matrix colors
    matrixHeader1: '#008891',
    matrixHeader2: '#ED8B00',
    matrixHeader3: '#902057',
    matrixHeader4: '#0284c7',
    matrixLabel: '#f7f6f6',
    matrixCell: '#ffffff',
    matrixCellAlt: '#f1f5f9',
    
    // Highlight colors
    highlightYellow: '#fefce8',
    highlightYellowBorder: '#fde047',
    highlightOrange: '#fff7ed',
    highlightOrangeBorder: '#fed7aa',
    
    // Override colors
    overrideText: '#ca8a04',
  };
  
  export const FONT_SIZES = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 15,
    xl: 18,
    xxl: 22,
  };
  
  export const FONT_WEIGHTS = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  };
  
  export const BORDER_RADIUS = {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 10,
    xxl: 12,
    full: 9999,
  };
  
  export const SHADOWS = {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 2px 6px rgba(0,0,0,0.1)',
    lg: '0 4px 12px rgba(0,0,0,0.15)',
  };
  
  export const TRANSITIONS = {
    fast: 'all 0.2s ease',
    medium: 'all 0.3s ease',
    slow: 'all 0.5s ease',
  };
  
  export const Z_INDEX = {
    dropdown: 1000,
    modal: 2000,
    tooltip: 3000,
    notification: 4000,
  };
  
  // Utility function to convert number to px string
  export const px = (value) => `${value}px`;
  
  // Utility function to get grid template columns
  export const getGridColumns = (count) => 
    `${px(GRID.labelWidth)} repeat(${count}, minmax(${px(GRID.columnMinWidth)}, 1fr))`;