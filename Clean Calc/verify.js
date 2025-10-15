const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'package.json',
  'vite.config.js',
  'index.html',
  'src/config/constants.js',
  'src/config/rates.js',
  'src/config/criteria.js',
  'src/config/loanLimits.js',
  'src/utils/formatters.js',
  'src/utils/rateSelectors.js',
  'src/utils/calculationEngine.js',
  'src/hooks/useProductSelection.js',
  'src/hooks/useCriteriaManagement.js',
  'src/hooks/useLoanInputs.js',
  'src/hooks/useFeeManagement.js',
  'src/components/UI/SectionTitle.jsx',
  'src/components/UI/Collapsible.jsx',
  'src/components/UI/SliderInput.jsx',
  'src/components/ProductSetup.jsx',
  'src/components/CriteriaSection.jsx',
  'src/components/PropertyProductSection.jsx',
  'src/components/FeesSection.jsx',
  'src/components/SummarySection.jsx',
  'src/components/MatrixSection.jsx',
  'src/App.jsx',
  'src/index.js',
  'src/styles/styles.css',
];

console.log('🔍 Checking for required files...\n');

let allPresent = true;
let emptyFiles = [];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Missing: ${file}`);
    allPresent = false;
  } else {
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      console.log(`⚠️  Empty: ${file}`);
      emptyFiles.push(file);
    } else {
      console.log(`✅ Found: ${file} (${stats.size} bytes)`);
    }
  }
});

console.log('\n' + '='.repeat(50));
if (allPresent && emptyFiles.length === 0) {
  console.log('✅ All files present and non-empty!');
  console.log('\n🚀 Ready to run: npm install && npm run dev');
} else {
  if (!allPresent) {
    console.log('❌ Some files are missing!');
  }
  if (emptyFiles.length > 0) {
    console.log(`⚠️  ${emptyFiles.length} file(s) are empty!`);
  }
}