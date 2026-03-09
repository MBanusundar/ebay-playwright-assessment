# eBay Related Products Automation Framework

**Author:** Banu

## Overview
Automated testing framework for eBay's Related Products feature using Playwright and TypeScript.

## Features
- ✅ Page Object Model (POM) design pattern
- ✅ TypeScript for type safety
- ✅ Cross-browser testing (Chrome, Firefox, Safari)
- ✅ Mobile responsive testing
- ✅ 15 comprehensive test cases
- ✅ Detailed test reports

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests on specific browser
npm run test:chrome
npm run test:firefox
npm run test:safari

# View test report
npm run test:report

# Run tests in UI mode
npm run test:ui
```


## Test Cases

### Functional Tests
- TC-001: Verify Related Products Section is Displayed
- TC-002: Verify Maximum 6 Products are Displayed
- TC-004: Verify Price Range Matching (±20%)
- TC-006: Verify Product Information is Displayed
- TC-007: Verify Click Navigation to Related Product

### Cross-Platform Tests
- TC-017: Verify Mobile Responsive Display
- TC-020: Verify Cross-Browser Compatibility

### Performance Tests
- TC-024: Verify Page Load Performance
- TC-030: Verify Currency Display Format

### Negative Tests
- TC-008: Verify Behavior When No Related Products Available
- TC-025: Verify Slow Network Performance
- TC-027: Verify Image Loading Failure Handling

### Edge Cases
- TC-028: Verify Special Characters in Product Title
- TC-029: Verify Very Long Product Title Display
- TC-031: Verify Keyboard Navigation

## Configuration

Test configuration can be modified in `tests/utils/helpers.ts`:

```typescript
export const TEST_CONFIG = {
  MAX_RELATED_PRODUCTS: 6,
  PRICE_TOLERANCE: 0.20,
  DEFAULT_TIMEOUT: 30000,
  SEARCH_TERM: 'mens leather wallet',
  BASE_URL: 'https://www.ebay.com'
};
```

## Test Results

Tests generate reports in multiple formats:
- HTML report: `playwright-report/`
- JSON report: `test-results/results.json`
- Videos: `test-results/` (on failure)
- Screenshots: `test-results/` (on failure)

## Stack Used
- **Playwright** - Browser automation
- **TypeScript** - Programming language
- **Node.js** - Runtime environment

## Author
Banu

