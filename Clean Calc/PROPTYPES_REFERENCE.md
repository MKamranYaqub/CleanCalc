# PropTypes Reference Guide

## Complete List of Components with PropTypes

### ✅ Completed Components

1. **ProductSetup** - ✅ PropTypes added
2. **CriteriaSection** - ✅ PropTypes added
3. **PropertyProductSection** - ✅ PropTypes added (with validation)
4. **FeesSection** - ✅ PropTypes added (with validation)
5. **SummarySection** - ✅ PropTypes added
6. **SectionTitle** (UI) - ✅ PropTypes added
7. **Collapsible** (UI) - ✅ PropTypes added
8. **SliderInput** (UI) - ✅ PropTypes added
9. **ErrorMessage** (UI) - ✅ PropTypes added

### 🔲 Remaining Components (Add as needed)

10. **MatrixSection** - Add PropTypes
11. **BasicGrossSection** - Add PropTypes

## How to Add PropTypes
```javascript
import PropTypes from 'prop-types';

ComponentName.propTypes = {
  stringProp: PropTypes.string.isRequired,
  numberProp: PropTypes.number.isRequired,
  boolProp: PropTypes.bool.isRequired,
  funcProp: PropTypes.func.isRequired,
  arrayProp: PropTypes.array.isRequired,
  objectProp: PropTypes.object.isRequired,
  optionalProp: PropTypes.string, // Not required
};

ComponentName.defaultProps = {
  optionalProp: 'default value',
};