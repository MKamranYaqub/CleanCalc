# BTL Rate Matrix Calculator

A comprehensive Buy-to-Let (BTL) mortgage rate matrix calculator built with React and Vite. This application calculates optimal loan amounts, interest rates, and fees for BTL properties based on property criteria, applicant profiles, and product configurations.

## 🏦 Overview

The BTL Rate Matrix Calculator helps mortgage brokers and lenders:
- Calculate maximum loan amounts based on property value and rental income
- Determine optimal rolled months and deferred interest settings
- Compare different fee structures (2%, 3%, 4%, 6%)
- Support Residential, Commercial, and Semi-Commercial properties
- Handle both new applications and retention cases
- Distinguish between Core and Specialist products

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Core Formulas](#core-formulas)
- [Configuration Files](#configuration-files)
- [Calculation Engine](#calculation-engine)
- [Expansion Guide](#expansion-guide)
- [Component Reference](#component-reference)
- [Utility Functions](#utility-functions)
- [Development](#development)

## ✨ Features

### Current Functionality

1. **Product Setup**
   - Property type selection (Residential, Commercial, Semi-Commercial)
   - Retention loan handling with LTV ranges (65%, 75%)
   - Core vs Specialist product groups
   - Tier calculation based on criteria

2. **Criteria Assessment**
   - HMO and MUFB property checks
   - Holiday let identification
   - Applicant profile (Expat, Foreign National, First Time Landlord)
   - Credit history evaluation (arrears, CCJs, defaults, bankruptcy)

3. **Loan Calculations**
   - Maximum Optimum Gross Loan
   - Specific Net Loan
   - Maximum LTV Loan
   - Specific Gross Loan
   - Interest Coverage Ratio (ICR) validation

4. **Fee Management**
   - Processing fee configuration
   - Broker fee (percentage or flat rate)
   - Product fee overrides
   - Rate manual overrides

5. **Advanced Features**
   - Rolled months optimization (0-9 months for Residential, 0-6 for Commercial)
   - Deferred interest adjustment
   - Direct debit calculations
   - Core product floor rate (5.5%)
   - Real-time validation with error messages

## 🚀 Installation

### Prerequisites

- Node.js (v20.19.0 or higher)
- npm (v8.0.0 or higher)

### Setup Steps

```bash
# Clone the repository
git clone <repository-url>
cd btl-calculator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
btl-calculator/
│
├── public/                    # Static assets
├── src/
│   ├── components/           # React components
│   │   ├── UI/              # Reusable UI components
│   │   │   ├── Collapsible.jsx
│   │   │   ├── CurrencyInput.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── SectionTitle.jsx
│   │   │   └── SliderInput.jsx
│   │   ├── BasicGrossSection.jsx
│   │   ├── CriteriaSection.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── FeesSection.jsx
│   │   ├── MatrixSection.jsx
│   │   ├── ProductSetup.jsx
│   │   ├── PropertyProductSection.jsx
│   │   └── SummarySection.jsx
│   │
│   ├── config/              # Configuration files
│   │   ├── constants.js     # Application constants
│   │   ├── criteria.js      # Criteria and LTV rules
│   │   ├── designTokens.js  # UI design tokens
│   │   ├── loanLimits.js    # Loan constraints
│   │   └── rates.js         # Rate matrices
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useCriteriaManagement.js
│   │   ├── useFeeManagement.js
│   │   ├── useLoanInputs.js
│   │   ├── useProductSelection.js
│   │   └── useValidation.js
│   │
│   ├── utils/               # Utility functions
│   │   ├── calculationEngine.js
│   │   ├── formatters.js
│   │   ├── inputFormatters.js
│   │   ├── rateSelectors.js
│   │   └── validators.js
│   │
│   ├── styles/
│   │   └── styles.css       # Global styles
│   │
│   ├── App.jsx              # Main application component
│   └── index.jsx            # Application entry point
│
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## 🧮 Core Formulas

### 1. Maximum Gross Loan from Rental Income

```javascript
// Location: src/utils/calculationEngine.js

grossRent = (monthlyRent × termMonths) / (minICR × (stressRate / 12) × monthsLeft)

Where:
- monthlyRent = Monthly rental income
- termMonths = Loan term in months (24 for 2yr, 36 for 3yr)
- minICR = Minimum Interest Coverage Ratio
  - Fixed: 1.25 (Residential), 1.25 (Commercial)
  - Tracker: 1.30 (Residential), 1.30 (Commercial)
- stressRate = Rate used for stress testing
- monthsLeft = termMonths - rolledMonths
```

### 2. Net Loan Calculation

```javascript
// Location: src/utils/calculationEngine.js

net = gross - feeAmount - rolledInterest - deferredInterest

Where:
- feeAmount = gross × (feePct / 100)
- rolledInterest = gross × (payRate / 12) × rolledMonths
- deferredInterest = gross × (deferredRate / 12) × termMonths
- payRate = displayRate - deferredRate
```

### 3. Gross Loan from Specific Net Loan

```javascript
// Location: src/utils/calculationEngine.js

grossFromNet = specificNet / (1 - feePct - (payRate/12 × rolledMonths) - (deferredRate/12 × termMonths))

Where:
- specificNet = User-specified net loan amount
- feePct = Product fee as decimal (e.g., 0.06 for 6%)
- payRate = Interest rate after deferred adjustment
- rolledMonths = Number of months with rolled interest
- deferredRate = Deferred interest rate adjustment
- termMonths = Total loan term in months
```

### 4. Interest Rate Calculations

#### For Fixed Rate Products
```javascript
displayRate = baseRate
stressRate = baseRate
```

#### For Tracker Products
```javascript
displayRate = marginRate + STANDARD_BBR
stressRate = marginRate + STRESS_BBR

Where:
- STANDARD_BBR = 4.00% (0.04)
- STRESS_BBR = 4.25% (0.0425)
- marginRate = Base tracker margin from rate tables
```

#### Core Product Floor Rate
```javascript
// Location: src/utils/rateSelectors.js
// Only applies to Core Residential products

if (productGroup === "Core" && propertyType === "Residential") {
  displayRate = Math.max(displayRate, CORE_FLOOR_RATE)
  stressRate = Math.max(stressRate, CORE_FLOOR_RATE)
}

Where:
- CORE_FLOOR_RATE = 5.5% (0.055)
```

### 5. LTV Constraints

```javascript
// Location: src/utils/rateSelectors.js

maxLTV = Math.min(
  defaultLTV,           // From MAX_LTV_RULES
  retentionLTV,         // If retention case
  flatAboveCommLTV      // If flat above commercial
)

Default LTV Rules:
- Residential: 75%
- Commercial: 70%
- Semi-Commercial: 70%

Retention LTV:
- 65% retention: 65%
- 75% retention: 75%

Flat Above Commercial Override:
- Tier 2: 60%
- Tier 3: 70%
```

### 6. Direct Debit Calculation

```javascript
directDebit = gross × (payRate / 12)

Starts from month: rolledMonths + 1
```

### 7. Tier Calculation

```javascript
// Location: src/hooks/useCriteriaManagement.js

tier = Math.max(
  ...propertyQuestionTiers,
  ...applicantQuestionTiers
)

// Returns: "Tier 1", "Tier 2", or "Tier 3"
```

## ⚙️ Configuration Files

### 1. `src/config/constants.js`

**Purpose**: Define application-wide constants

**Key Constants**:
```javascript
LOAN_TYPES = {
  MAX_OPTIMUM_GROSS: "Max Optimum Gross Loan",
  SPECIFIC_NET: "Specific Net Loan",
  MAX_LTV: "Maximum LTV Loan",
  SPECIFIC_GROSS: "Specific Gross Loan",
}

PRODUCT_GROUPS = {
  SPECIALIST: "Specialist",
  CORE: "Core",
}

PROPERTY_TYPES = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  SEMI_COMMERCIAL: "Semi-Commercial",
}

CORE_FLOOR_RATE = 0.055  // 5.5% minimum for Core products
```

**To Modify**:
- Add new loan types to `LOAN_TYPES`
- Add new property types to `PROPERTY_TYPES`
- Adjust floor rate for Core products

### 2. `src/config/rates.js`

**Purpose**: Store all interest rate matrices

**Structure**:
```javascript
RATES_DATA = {
  "Tier 1": {
    products: {
      "2yr Fix": { 6: 0.0589, 4: 0.0639, 3: 0.0679, 2: 0.0719 },
      "3yr Fix": { 6: 0.0639, 4: 0.0679, 3: 0.0719, 2: 0.0749 },
      "2yr Tracker": { 
        6: 0.0159, 
        4: 0.0209, 
        3: 0.0249, 
        2: 0.0289, 
        isMargin: true  // Indicates tracker rate
      },
    },
  },
  // ... Tier 2, Tier 3
}
```

**To Add New Rates**:
1. Navigate to the appropriate tier
2. Add or modify product type rates
3. Use decimal format (e.g., 0.0589 = 5.89%)
4. Add `isMargin: true` for tracker products

**Available Rate Matrices**:
- `RATES_DATA` - Residential Specialist
- `RATES_COMMERCIAL` - Commercial/Semi-Commercial
- `RATES_CORE` - Core Residential
- `RATES_RETENTION_65` - Retention at 65% LTV
- `RATES_RETENTION_75` - Retention at 75% LTV
- `RATES_CORE_RETENTION_65` - Core retention at 65%
- `RATES_CORE_RETENTION_75` - Core retention at 75%

### 3. `src/config/criteria.js`

**Purpose**: Define property and applicant assessment criteria

**Structure**:
```javascript
CRITERIA_CONFIG = {
  Residential: {
    propertyQuestions: [
      {
        key: "hmo",
        label: "HMO",
        options: [
          { label: "No (Tier 1)", tier: 1 },
          { label: "Up to 6 beds (Tier 2)", tier: 2 },
          { label: "More than 6 beds (Tier 3)", tier: 3 },
        ],
      },
      // ... more questions
    ],
    applicantQuestions: [
      // Similar structure
    ],
  },
}
```

**To Add New Criteria**:
1. Add question to `propertyQuestions` or `applicantQuestions`
2. Define unique `key` (used in state management)
3. Provide `label` (displayed to user)
4. Create `options` array with tier assignments
5. Update `CORE_CRITERIA_CONFIG` if applicable to Core products

### 4. `src/config/loanLimits.js`

**Purpose**: Define loan constraints and parameters

**Key Limits**:
```javascript
LOAN_LIMITS = {
  Residential: {
    MAX_ROLLED_MONTHS: 9,
    MAX_DEFERRED_FIX: 0.0125,      // 1.25%
    MAX_DEFERRED_TRACKER: 0.02,     // 2.00%
    MIN_ICR_FIX: 1.25,
    MIN_ICR_TRK: 1.30,
    TOTAL_TERM: 10,                 // Years
    MIN_LOAN: 150000,
    MAX_LOAN: 3000000,
    STANDARD_BBR: 0.04,             // 4.00%
    STRESS_BBR: 0.0425,             // 4.25%
    CURRENT_MVR: 0.0859,            // 8.59%
    TERM_MONTHS: { 
      "2yr Fix": 24, 
      "3yr Fix": 36, 
      "2yr Tracker": 24 
    },
  },
  // Commercial, Semi-Commercial have different values
}
```

**To Modify**:
1. Update numerical limits for property types
2. Adjust ICR requirements
3. Change BBR rates (affects all tracker calculations)
4. Modify MVR (Market Variable Rate)

## 🔧 Calculation Engine

### Location: `src/utils/calculationEngine.js`

### Main Function: `computeColumnData()`

This is the heart of the calculator. It:
1. Retrieves base rate from rate matrices
2. Applies rate overrides if present
3. Calculates LTV constraints
4. Determines optimal rolled months and deferred interest
5. Computes gross and net loan amounts
6. Calculates all fees and interest components

### Optimization Logic

```javascript
// If manual settings exist, use those
if (manualRolled != null || manualDeferred != null) {
  best = evaluateLoanCombination(manualRolled, manualDeferred)
}
// Otherwise, optimize for maximum net loan
else {
  for (rolled = 0 to MAX_ROLLED_MONTHS) {
    for (deferred = 0 to MAX_DEFERRED step 0.0001) {
      result = evaluateLoanCombination(rolled, deferred)
      if (result.net > best.net) best = result
    }
  }
}
```

### Core vs Specialist Logic

```javascript
// Core products: No rolled months or deferred interest
if (productGroup === "Core" && propertyType === "Residential") {
  best = evaluateLoanCombination(0, 0)
}
```

## 🎯 Expansion Guide

### Adding a New Property Type

**Files to Update**:

1. **`src/config/constants.js`**
   ```javascript
   PROPERTY_TYPES = {
     RESIDENTIAL: "Residential",
     COMMERCIAL: "Commercial",
     SEMI_COMMERCIAL: "Semi-Commercial",
     HOLIDAY_LET: "Holiday Let",  // NEW
   }
   ```

2. **`src/config/rates.js`**
   ```javascript
   RATES_HOLIDAY_LET = {
     "Tier 1": {
       products: {
         "2yr Fix": { 6: 0.0599, 4: 0.0649, 3: 0.0689, 2: 0.0729 },
         // ... more products
       },
     },
   }
   ```

3. **`src/config/loanLimits.js`**
   ```javascript
   LOAN_LIMITS = {
     // ... existing types
     "Holiday Let": {
       MAX_ROLLED_MONTHS: 6,
       MAX_DEFERRED_FIX: 0.0125,
       // ... all required parameters
     },
   }
   ```

4. **`src/config/criteria.js`**
   ```javascript
   CRITERIA_CONFIG = {
     // ... existing types
     "Holiday Let": {
       propertyQuestions: [ /* ... */ ],
       applicantQuestions: [ /* ... */ ],
     },
   }
   
   MAX_LTV_RULES = {
     default: {
       // ... existing
       "Holiday Let": 60,  // NEW
     },
   }
   ```

5. **`src/utils/rateSelectors.js`**
   - Update `selectRateSource()` to handle new property type
   - Update `getMaxLTV()` if special LTV rules apply

6. **`src/components/ProductSetup.jsx`**
   ```javascript
   <select value={propertyType} onChange={...}>
     <option>Residential</option>
     <option>Commercial</option>
     <option>Semi-Commercial</option>
     <option>Holiday Let</option> {/* NEW */}
   </select>
   ```

### Adding a New Product Type

**Example**: Adding "5yr Fix"

1. **`src/config/constants.js`**
   ```javascript
   PRODUCT_TYPES_LIST = {
     Residential: ["2yr Fix", "3yr Fix", "5yr Fix", "2yr Tracker"],
     // ... update all property types
   }
   ```

2. **`src/config/rates.js`**
   ```javascript
   RATES_DATA = {
     "Tier 1": {
       products: {
         "2yr Fix": { /* ... */ },
         "3yr Fix": { /* ... */ },
         "5yr Fix": { 6: 0.0669, 4: 0.0709, 3: 0.0749, 2: 0.0779 },  // NEW
         "2yr Tracker": { /* ... */ },
       },
     },
   }
   // Update all rate matrices (RATES_COMMERCIAL, RATES_CORE, etc.)
   ```

3. **`src/config/loanLimits.js`**
   ```javascript
   LOAN_LIMITS = {
     Residential: {
       // ... existing limits
       TERM_MONTHS: { 
         "2yr Fix": 24, 
         "3yr Fix": 36,
         "5yr Fix": 60,  // NEW
         "2yr Tracker": 24 
       },
     },
   }
   ```

4. **`src/components/MatrixSection.jsx`**
   - Update ERC calculation logic if needed:
   ```javascript
   {data.productType.includes("5yr")
     ? "3% in year 1, 2% in year 2, 1% in years 3-5"
     : /* existing logic */}
   ```

### Adding a New Fee Column

**Example**: Adding 1.5% fee option

1. **`src/config/constants.js`**
   ```javascript
   FEE_COLUMNS = {
     Residential: [6, 4, 3, 2, 1.5],  // Added 1.5
     // Update all property types and retention options
   }
   ```

2. **`src/config/rates.js`**
   ```javascript
   RATES_DATA = {
     "Tier 1": {
       products: {
         "2yr Fix": { 
           6: 0.0589, 
           4: 0.0639, 
           3: 0.0679, 
           2: 0.0719,
           1.5: 0.0749  // NEW
         },
       },
     },
   }
   // Update all rate matrices
   ```

3. **Matrix will automatically display new column** - no component changes needed!

### Adding a New Criteria Question

1. **`src/config/criteria.js`**
   ```javascript
   CRITERIA_CONFIG = {
     Residential: {
       propertyQuestions: [
         // ... existing questions
         {
           key: "studentAccommodation",  // Unique key
           label: "Student Accommodation?",
           options: [
             { label: "No (Tier 1)", tier: 1 },
             { label: "Yes (Tier 2)", tier: 2 },
           ],
           helper: "Purpose-built student accommodation"  // Optional
         },
       ],
     },
   }
   ```

2. **Criteria section will automatically render new question** - no component changes needed!

3. **If Core criteria affected**, update `CORE_CRITERIA_CONFIG`:
   ```javascript
   CORE_CRITERIA_CONFIG = {
     Residential: {
       propertyQuestions: [
         // ... existing
         {
           key: "studentAccommodation",
           label: "Student Accommodation?",
           options: [{ label: "No (Tier 1)", tier: 1 }],  // Core only allows "No"
         },
       ],
     },
   }
   ```

### Adding Rate Override Functionality

Rate override is already implemented! Users can:
- Click on "Full Rate" cell in matrix
- Enter new rate value
- System recalculates with override
- "Reset Rate" button restores original

**To modify behavior**, edit: `src/hooks/useFeeManagement.js`

```javascript
const handleRateInputBlur = useCallback((colKey, val, originalRate) => {
  const parsed = parsePercentage(val);
  if (parsed != null && Math.abs(parsed - originalRate) > 1e-5) {
    setRateOverrides((p) => ({ ...p, [colKey]: parsed }));
  }
}, []);
```

### Adding Custom Validation Rules

1. **`src/utils/validators.js`**
   ```javascript
   export const validateNewField = (value, min, max) => {
     if (!value) {
       return { valid: false, error: 'Field is required' };
     }
     // Add custom validation logic
     return { valid: true, error: null };
   };
   ```

2. **`src/hooks/useValidation.js`**
   ```javascript
   const validateField = useCallback((field, value, ...args) => {
     // ... existing cases
     case 'newField':
       validation = validateNewField(value, ...args);
       break;
   }, []);
   ```

3. **Use in component**:
   ```javascript
   const { errors, validateField } = useValidation();
   
   <input
     onBlur={(e) => validateField('newField', e.target.value)}
   />
   <ErrorMessage error={errors.newField} />
   ```

## 📦 Component Reference

### Core Components

#### `App.jsx`
**Purpose**: Main orchestrator component

**State Management**:
- Product selection (property type, retention status, product group)
- Criteria answers
- Loan inputs (property value, rent, specific loans)
- Fee configuration
- Manual settings for rolled/deferred

**Key Logic**:
- Computes all column data using `computeColumnData()`
- Finds best loan option for summary
- Handles section collapse/expand

#### `ProductSetup.jsx`
**Purpose**: Product configuration interface

**Props**:
```javascript
{
  mainProductType,          // "BTL"
  propertyType,            // "Residential" | "Commercial" | "Semi-Commercial"
  isRetention,             // "Yes" | "No"
  retentionLtv,            // "65" | "75"
  productGroup,            // "Specialist" | "Core"
  isWithinCoreCriteria,    // boolean
  tier,                    // "Tier 1" | "Tier 2" | "Tier 3"
}
```

**Features**:
- Property type dropdown
- Retention configuration
- Core/Specialist toggle (only for Residential)
- Tier display

#### `CriteriaSection.jsx`
**Purpose**: Criteria assessment interface

**Dynamic Rendering**: Automatically renders questions from `CRITERIA_CONFIG`

**Tier Calculation**: Updates in real-time as answers change

#### `PropertyProductSection.jsx`
**Purpose**: Property and loan input interface

**Key Inputs**:
- Property Value (with currency formatting)
- Monthly Rent (with currency formatting)
- Loan Type selector
- Specific loan amounts (conditional)
- Product type selector

**Validation**: Real-time validation with error messages

#### `FeesSection.jsx`
**Purpose**: Fee configuration

**Fee Types**:
- Processing fee (%)
- Broker fee (% OR flat £)
- Product fee (overrideable in matrix)

#### `MatrixSection.jsx`
**Purpose**: Loan calculation results matrix

**Features**:
- Multi-column display (one per fee structure)
- Editable rates and fees
- Rolled months slider
- Deferred adjustment slider
- Reset to optimum functionality

**Matrix Rows**:
1. Product Name
2. Full Rate (Editable)
3. Product Fee %
4. Pay Rate
5. Net Loan
6. Max Gross Loan
7. Rolled Months
8. Deferred Adjustment
9. Product Fee
10. Rolled Interest
11. Deferred Interest
12. Direct Debit
13. Proc Fee
14. Broker Fee
15. Revert Rate
16. Total Term | ERC
17. Max Product LTV

#### `BasicGrossSection.jsx`
**Purpose**: Shows basic gross loan without roll/defer

**Formula**: Simplified calculation with rolledMonths=0, deferredRate=0

**Use Case**: Baseline comparison to optimized results

#### `SummarySection.jsx`
**Purpose**: Highlights best loan option

**Display**: Shows highest net loan with gross amount, LTV, and product details

### UI Components (`src/components/UI/`)

#### `Collapsible.jsx`
**Purpose**: Expandable/collapsible section wrapper

**Usage**:
```javascript
<Collapsible
  title="🏠 Section Title"
  isOpen={isOpen}
  onToggle={() => setIsOpen(!isOpen)}
>
  {/* Content */}
</Collapsible>
```

#### `CurrencyInput.jsx`
**Purpose**: Formatted currency input with thousand separators

**Features**:
- Auto-formatting on type (1000000 → 1,000,000)
- Range validation
- Error state styling

**Usage**:
```javascript
<CurrencyInput
  label="Property Value"
  value={propertyValue}
  onChange={setPropertyValue}
  min={50000}
  max={10000000}
  error={hasError}
  required
/>
```

#### `SliderInput.jsx`
**Purpose**: Range slider with formatted display

**Usage**:
```javascript
<SliderInput
  min={0}
  max={9}
  step={1}
  value={rolledMonths}
  onChange={setRolledMonths}
  formatValue={(v) => `${v} months`}
/>
```

#### `ErrorMessage.jsx`
**Purpose**: Validation error display

**Usage**:
```javascript
<ErrorMessage error={errors.propertyValue} />
```

## 🛠️ Utility Functions

### `formatters.js`

```javascript
parseNumber(value)           // Convert to number or null
formatCurrency(amount, decimals)  // Format as GBP
formatPercentage(decimal, decimals)  // Convert 0.05 → "5.00%"
parsePercentage(str)         // Convert "5%" → 0.05
```

### `validators.js`

```javascript
validatePropertyValue(value)      // Min: £50k, Max: £10M
validateMonthlyRent(value)        // Min: £100, Max: £50k
validateLoanAmount(value, min, max)
validateFeePercentage(value)      // Max: 10%
validateBrokerFeeFlat(value)      // Max: £50k
```

### `rateSelectors.js`

```javascript
selectRateSource(params)     // Select correct rate matrix
getMaxLTV(params)           // Calculate maximum LTV
getFeeColumns(params)       // Get applicable fee columns
applyFloorRate(rate, ...)   // Apply Core floor rate
```

### `calculationEngine.js`

```javascript
computeColumnData(params)   // Main calculation function
evaluateLoanCombination()   // Evaluate specific rolled/deferred combo
```

## 🧪 Development

### Running Tests

Currently no test suite is configured. To add testing:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom

# Add to package.json:
"scripts": {
  "test": "vitest"
}
```

### Code Style

The project follows standard React conventions:
- Functional components with hooks
- PropTypes for type checking
- Descriptive variable names
- Comments for complex logic

### Adding PropTypes

When creating new components:

```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  propertyValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isOptional: PropTypes.bool,
};

MyComponent.defaultProps = {
  isOptional: false,
};
```

### Error Boundary

The app includes `ErrorBoundary.jsx` which catches React errors:
- Displays friendly error message
- Shows stack trace in development
- Provides "Try Again" and "Reload Page" buttons

## 🎨 Styling

### Global Styles

Location: `src/styles/styles.css`

**CSS Variables**:
```css
:root {
  --bg: #f1f5f9;
  --card: #ffffff;
  --text: #0f172a;
  --border: #e2e3e4;
  --accent: #334155;
}
```

### Design Tokens

Location: `src/config/designTokens.js`

Centralized design constants for:
- Colors (primary, secondary, status, text)
- Spacing (xs to xxl)
- Font sizes and weights
- Border radius
- Shadows
- Z-index layers

**Usage**:
```javascript
import { COLORS, SPACING, FONT_SIZES } from '../config/designTokens';

<div style={{
  color: COLORS.textPrimary,
  padding: SPACING.md,
  fontSize: FONT_SIZES.lg,
}}>
```

### Responsive Design

- Desktop: 1200px max-width container
- Grid: 4-column layout on desktop, 1-column on mobile
- Matrix: Card-based view on mobile (<900px)

## 📚 Key Concepts

### Rate Types

1. **Fixed Rates**: Constant rate for term duration
2. **Tracker Rates**: Margin + BBR (Base Bank Rate)
   - Standard BBR: 4.00%
   - Stress BBR: 4.25%

### Product Groups

1. **Specialist**: Standard BTL products with full flexibility
2. **Core**: Premium products with stricter criteria
   - No rolled months
   - No deferred interest
   - 5.5% floor rate
   - Lower rates for qualifying applicants

### Loan Types

1. **Max Optimum Gross**: Optimizes for maximum net loan
2. **Specific Net**: User specifies net loan amount (day 1 advance)
3. **Max LTV**: Caps loan at specific LTV percentage
4. **Specific Gross**: User specifies gross loan amount (redemption total)

### Interest Components

1. **Product Fee**: Upfront fee based on gross loan
2. **Rolled Interest**: Interest paid upfront for initial months
3. **Deferred Interest**: Rate reduction applied across full term
4. **Direct Debit**: Monthly payment after rolled period

### Optimization Strategy

The calculator automatically finds the combination of rolled months and deferred interest that maximizes the net loan amount, subject to:
- ICR constraints (rental income must cover stressed interest)
- LTV constraints (loan-to-value limits)
- Property type limits (different max rolled months)
- Product type limits (different max deferred rates)

## 🐛 Common Issues & Solutions

### Issue: Calculator shows "£0" for all loans

**Cause**: Monthly rent too low for ICR requirements

**Solution**: 
- Increase monthly rent input
- Check ICR requirements in `loanLimits.js`
- Verify property value is appropriate for rent level

### Issue: Tier not updating when criteria changes

**Cause**: Criteria state not properly initialized

**Solution**:
1. Check `useCriteriaManagement.js`
2. Verify `getCurrentCriteria()` returns correct config
3. Ensure `initializeCriteriaState()` sets all question keys

### Issue: Core option not appearing

**Cause**: Criteria doesn't meet Core requirements

**Solution**:
- Review `CORE_CRITERIA_CONFIG` in `criteria.js`
- Ensure all criteria answers are within Core limits
- Check `isWithinCoreCriteria` logic in `useCriteriaManagement.js`

### Issue: Rate override not working

**Cause**: Input parsing failing

**Solution**:
1. Check `parsePercentage()` in `formatters.js`
2. Verify `handleRateInputBlur()` in `useFeeManagement.js`
3. Ensure `tempRateInput` state is properly managed

### Issue: Currency formatting breaks on large numbers

**Cause**: Locale issues or number overflow

**Solution**:
- Check `formatCurrency()` in `formatters.js`
- Verify browser locale support
- Add error handling for edge cases

## 📊 Rate Matrix Reference

### Reading the Rate Tables

**Format**: `{ feeColumn: rate }`

**Example**:
```javascript
"2yr Fix": { 6: 0.0589, 4: 0.0639, 3: 0.0679, 2: 0.0719 }
```

This means:
- 6% fee → 5.89% interest rate
- 4% fee → 6.39% interest rate
- 3% fee → 6.79% interest rate
- 2% fee → 7.19% interest rate

### Tracker Rates

**Indicated by**: `isMargin: true`

**Display Calculation**:
```javascript
displayRate = marginRate + STANDARD_BBR
// Example: 0.0159 + 0.04 = 0.0559 (5.59%)
```

**Stress Calculation**:
```javascript
stressRate = marginRate + STRESS_BBR
// Example: 0.0159 + 0.0425 = 0.0584 (5.84%)
```

## 🔐 Data Flow Architecture

### State Management Flow

```
User Input
    ↓
React State (App.jsx)
    ↓
Custom Hooks
    ├── useProductSelection → Product config
    ├── useCriteriaManagement → Tier calculation
    ├── useLoanInputs → Property/loan data
    └── useFeeManagement → Fees & overrides
    ↓
Utility Functions
    ├── selectRateSource() → Get rate matrix
    ├── getMaxLTV() → Calculate LTV cap
    └── getFeeColumns() → Get fee structure
    ↓
Calculation Engine
    └── computeColumnData() → Calculate loans
    ↓
Matrix Display
```

### Calculation Dependencies

```
propertyValue ─┐
monthlyRent ───┼─→ computeColumnData() ─→ loan results
criteria ──────┤
productType ───┤
tier ──────────┘
```

## 🚦 Adding Features: Step-by-Step

### Example: Adding "4yr Fix" Product Type

#### Step 1: Update Constants
**File**: `src/config/constants.js`
```javascript
PRODUCT_TYPES_LIST = {
  Residential: ["2yr Fix", "3yr Fix", "4yr Fix", "2yr Tracker"],
  Commercial: ["2yr Fix", "3yr Fix", "4yr Fix", "2yr Tracker"],
  "Semi-Commercial": ["2yr Fix", "3yr Fix", "4yr Fix", "2yr Tracker"],
}
```

#### Step 2: Add Term Months
**File**: `src/config/loanLimits.js`
```javascript
LOAN_LIMITS = {
  Residential: {
    // ... other limits
    TERM_MONTHS: { 
      "2yr Fix": 24, 
      "3yr Fix": 36,
      "4yr Fix": 48,  // ← ADD THIS
      "2yr Tracker": 24 
    },
  },
  Commercial: {
    // ... repeat for Commercial
  },
  "Semi-Commercial": {
    // ... repeat for Semi-Commercial
  },
}
```

#### Step 3: Add Rates to ALL Rate Matrices
**File**: `src/config/rates.js`

Update each rate object:
```javascript
// RATES_DATA
RATES_DATA = {
  "Tier 1": {
    products: {
      "2yr Fix": { 6: 0.0589, 4: 0.0639, 3: 0.0679, 2: 0.0719 },
      "3yr Fix": { 6: 0.0639, 4: 0.0679, 3: 0.0719, 2: 0.0749 },
      "4yr Fix": { 6: 0.0659, 4: 0.0699, 3: 0.0739, 2: 0.0769 },  // ← ADD
      "2yr Tracker": { 6: 0.0159, 4: 0.0209, 3: 0.0249, 2: 0.0289, isMargin: true },
    },
  },
  "Tier 2": {
    products: {
      "2yr Fix": { 6: 0.0639, 4: 0.0679, 3: 0.0719, 2: 0.0749 },
      "3yr Fix": { 6: 0.0679, 4: 0.0719, 3: 0.0759, 2: 0.0789 },
      "4yr Fix": { 6: 0.0699, 4: 0.0739, 3: 0.0779, 2: 0.0809 },  // ← ADD
      "2yr Tracker": { 6: 0.0209, 4: 0.0259, 3: 0.0299, 2: 0.0339, isMargin: true },
    },
  },
  "Tier 3": {
    products: {
      "2yr Fix": { 6: 0.0729, 4: 0.0779, 3: 0.0819, 2: 0.0849 },
      "3yr Fix": { 6: 0.0769, 4: 0.0809, 3: 0.0849, 2: 0.0879 },
      "4yr Fix": { 6: 0.0789, 4: 0.0829, 3: 0.0869, 2: 0.0899 },  // ← ADD
      "2yr Tracker": { 6: 0.0239, 4: 0.0289, 3: 0.0329, 2: 0.0369, isMargin: true },
    },
  },
};

// Repeat for:
// - RATES_COMMERCIAL
// - RATES_CORE
// - RATES_RETENTION_65 (Residential & Commercial)
// - RATES_RETENTION_75 (Residential & Commercial)
// - RATES_CORE_RETENTION_65
// - RATES_CORE_RETENTION_75
```

#### Step 4: Update ERC Display (Optional)
**File**: `src/components/MatrixSection.jsx`

Find the `totalTermERC` row rendering:
```javascript
case "totalTermERC":
  return (
    <>
      {limits.TOTAL_TERM} years |{" "}
      {data.productType.includes("2yr")
        ? "3% in year 1, 2% in year 2"
        : data.productType.includes("3yr")
        ? "3% in year 1, 2% in year 2, 1% in year 3"
        : data.productType.includes("4yr")  // ← ADD THIS
        ? "3% in year 1, 2% in year 2, 1% in years 3-4"
        : "Refer to product terms"}
    </>
  );
```

#### Step 5: Test
1. Start dev server: `npm run dev`
2. Select "4yr Fix" from Product Type dropdown
3. Verify rates appear correctly
4. Check calculations work properly
5. Test across all property types and tiers

### Example: Adding Regional LTV Overrides

Let's add London-specific LTV rules.

#### Step 1: Add Region to Criteria
**File**: `src/config/criteria.js`

```javascript
CRITERIA_CONFIG = {
  Residential: {
    propertyQuestions: [
      // ... existing questions
      {
        key: "region",
        label: "Property Region",
        options: [
          { label: "England (excl. London) (Tier 1)", tier: 1 },
          { label: "London (Tier 1)", tier: 1 },
          { label: "Scotland (Tier 1)", tier: 1 },
          { label: "Wales (Tier 1)", tier: 1 },
          { label: "Northern Ireland (Tier 2)", tier: 2 },
        ],
      },
    ],
    // ... applicantQuestions
  },
}
```

#### Step 2: Add Regional LTV Rules
**File**: `src/config/criteria.js`

```javascript
MAX_LTV_RULES = {
  default: {
    Residential: 75,
    Commercial: 70,
    "Semi-Commercial": 70,
  },
  retention: {
    // ... existing
  },
  flatAboveCommOverrides: {
    // ... existing
  },
  regionalOverrides: {  // ← ADD THIS
    London: {
      Residential: 80,  // Higher LTV for London
      Commercial: 75,
    },
    "Northern Ireland": {
      Residential: 70,  // Lower LTV for NI
      Commercial: 65,
    },
  },
}
```

#### Step 3: Update getMaxLTV Function
**File**: `src/utils/rateSelectors.js`

```javascript
export const getMaxLTV = (params) => {
  const { propertyType, isRetention, retentionLtv, propertyAnswers = {}, tier } = params;
  
  const def = MAX_LTV_RULES.default?.[propertyType] ?? 75;
  const numericLtv = Number(String(retentionLtv || "").match(/\d+/)?.[0]);
  
  const isFlat = propertyAnswers.flatAboveComm === "Yes";
  
  // ← ADD REGIONAL LOGIC
  const region = propertyAnswers.region;
  let regionalOv = null;
  if (region && MAX_LTV_RULES.regionalOverrides) {
    const regionKey = region.split('(')[0].trim();  // Extract "London" from "London (Tier 1)"
    regionalOv = MAX_LTV_RULES.regionalOverrides[regionKey]?.[propertyType];
  }
  
  let retOv = null;
  if (isRetention === "Yes" && numericLtv) {
    retOv = MAX_LTV_RULES.retention?.[propertyType]?.[numericLtv];
  }
  
  let flatOv = null;
  if (propertyType === PROPERTY_TYPES.RESIDENTIAL && isFlat && 
      MAX_LTV_RULES.flatAboveCommOverrides?.[tier] != null) {
    flatOv = MAX_LTV_RULES.flatAboveCommOverrides[tier];
  }
  
  const applicable = [def];
  if (retOv != null) applicable.push(retOv);
  if (flatOv != null) applicable.push(flatOv);
  if (regionalOv != null) applicable.push(regionalOv);  // ← ADD
  
  return Math.min(...applicable) / 100;
};
```

#### Step 4: Test
1. Select different regions in Criteria section
2. Verify Max Product LTV changes accordingly
3. Check that London shows 80% LTV
4. Confirm Northern Ireland shows 70% LTV

## 📝 Code Comments Best Practices

### Good Comment Examples

```javascript
// Calculate stressed interest rate for ICR testing
const stressRate = isTracker ? marginRate + STRESS_BBR : baseRate;

// Optimize for maximum net loan by testing all combinations
for (let rolled = 0; rolled <= maxRolled; rolled++) {
  for (let deferred = 0; deferred <= maxDeferred; deferred += 0.0001) {
    // ... evaluation logic
  }
}

// Core products: No flexibility in rolled/deferred
if (productGroup === PRODUCT_GROUPS.CORE) {
  return evaluateLoanCombination(0, 0);
}
```

### What to Comment

✅ **DO Comment**:
- Complex formulas and calculations
- Business logic and rules
- Non-obvious optimizations
- Workarounds for edge cases
- Intent behind architectural decisions

❌ **DON'T Comment**:
- Obvious code (`i++; // increment i`)
- Redundant descriptions of clear code
- Commented-out code (delete it instead)
- Outdated comments

## 🔒 Security Considerations

### Input Validation

All user inputs are validated:
- **Property Value**: £50k - £10M
- **Monthly Rent**: £100 - £50k
- **Loan Amounts**: £150k - £3M
- **Fee Percentages**: 0% - 10%

### XSS Protection

- React automatically escapes output
- No `dangerouslySetInnerHTML` used
- User input never executed as code

### Data Privacy

- No data sent to external servers
- All calculations performed client-side
- No cookies or local storage used
- No user tracking

## 🎯 Performance Optimization

### Current Optimizations

1. **useMemo for Expensive Calculations**
   ```javascript
   const allColumnData = useMemo(() => {
     // Heavy calculation
   }, [dependencies]);
   ```

2. **useCallback for Event Handlers**
   ```javascript
   const handleChange = useCallback((value) => {
     // Handler logic
   }, [dependencies]);
   ```

3. **Conditional Rendering**
   ```javascript
   {canShowMatrix && <MatrixSection />}
   ```

### Further Optimization Ideas

1. **Code Splitting**: Lazy load matrix section
2. **Web Workers**: Move optimization loop to background thread
3. **Memoization**: Cache calculation results by input hash
4. **Virtualization**: For very large rate matrices

## 📖 Glossary

**BBR**: Base Bank Rate - Bank of England base rate

**BTL**: Buy-to-Let - Property purchased for rental income

**CCJ**: County Court Judgment - Court order for unpaid debt

**ERC**: Early Repayment Charge - Fee for paying off loan early

**HMO**: House in Multiple Occupation - Property rented to multiple tenants

**ICR**: Interest Coverage Ratio - Rental income ÷ interest payments

**ILR**: Indefinite Leave to Remain - UK immigration status

**LTV**: Loan-to-Value - Loan amount ÷ property value

**MUFB**: Multi-Unit Freehold Block - Building with multiple flats

**MVR**: Market Variable Rate - Lender's standard variable rate

**Retention**: Remortgage with same lender

**Tracker**: Variable rate linked to BBR

## 🤝 Contributing

### Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Make changes
4. Add tests if applicable
5. Commit with clear messages
6. Push to branch
7. Open Pull Request

### Commit Message Format

```
feat: Add 4yr Fix product type
fix: Correct LTV calculation for London properties
docs: Update rate matrix documentation
refactor: Extract LTV logic into separate function
style: Format code with Prettier
test: Add tests for validation functions
```

## 📞 Support

### Getting Help

1. Check this README
2. Review inline code comments
3. Check configuration files in `src/config/`
4. Examine similar existing implementations

### Reporting Issues

Include:
1. What you were trying to do
2. What you expected to happen
3. What actually happened
4. Steps to reproduce
5. Browser and OS version
6. Screenshot if applicable

## 📜 License

This project is proprietary software. All rights reserved.

## 🙏 Acknowledgments

- Built with React 18 and Vite
- Uses PropTypes for type checking
- Styled with vanilla CSS and design tokens
- No external UI libraries for full customization

---

**Version**: 1.0.0  
**Last Updated**: 2025  
**Maintained By**: M Kamran Yaqub

For questions or suggestions, please contact the development team.
