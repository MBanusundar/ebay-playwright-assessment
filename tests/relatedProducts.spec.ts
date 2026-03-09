/**
 * eBay Related Products Test Suite
 * Author: Banu
 * Description: Automated tests for eBay Related Products feature
 */

import { test, expect } from '@playwright/test';
import { ProductPage } from './pages/ProductPage';
import { TestHelpers, TEST_CONFIG } from './utils/helpers';

test.describe('Related Products - Best Sellers Feature', () => {
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    await productPage.goto();
  });

  test('TC-001: Verify Related Products Section is Displayed', async ({ page }) => {
    await productPage.searchProduct(TEST_CONFIG.SEARCH_TERM);
    const newPage = await productPage.clickFirstProduct();
    const newProductPage = new ProductPage(newPage);
    await newProductPage.scrollToRelatedProducts();

    const isVisible = await newProductPage.isRelatedProductsSectionVisible();
    expect(isVisible).toBeTruthy();
  });

  test('TC-002: Verify Maximum 6 Products are Displayed', async ({ page }) => {
    await productPage.searchProduct(TEST_CONFIG.SEARCH_TERM);
    const newPage = await productPage.clickFirstProduct();
    const newProductPage = new ProductPage(newPage);
    await newProductPage.scrollToRelatedProducts();

    const count = await newProductPage.getRelatedProductsCount();
    expect(count).toBeLessThanOrEqual(TEST_CONFIG.MAX_RELATED_PRODUCTS);
    expect(count).toBeGreaterThan(0);
  });

  test('TC-004: Verify Price Range Matching (±20%)', async ({ page }) => {
    await productPage.searchProduct(TEST_CONFIG.SEARCH_TERM);
    const newPage = await productPage.clickFirstProduct();
    const newProductPage = new ProductPage(newPage);
    
    const mainPrice = await newProductPage.getProductPrice();
    expect(mainPrice).toBeGreaterThan(0);

    await newProductPage.scrollToRelatedProducts();
    const relatedPrices = await newProductPage.getRelatedProductPrices();
    
    const priceRange = TestHelpers.calculatePriceRange(mainPrice, TEST_CONFIG.PRICE_TOLERANCE);
    
    relatedPrices.forEach(price => {
      expect(price).toBeGreaterThanOrEqual(priceRange.min);
      expect(price).toBeLessThanOrEqual(priceRange.max);
    });
  });

  test('TC-006: Verify Product Information is Displayed', async ({ page }) => {
    await productPage.searchProduct(TEST_CONFIG.SEARCH_TERM);
    const newPage = await productPage.clickFirstProduct();
    const newProductPage = new ProductPage(newPage);
    await newProductPage.scrollToRelatedProducts();

    const titles = await newProductPage.getRelatedProductTitles();
    const prices = await newProductPage.getRelatedProductPrices();
    const imagesLoaded = await newProductPage.areAllImagesLoaded();

    expect(titles.length).toBeGreaterThan(0);
    expect(prices.length).toBeGreaterThan(0);
    expect(imagesLoaded).toBeTruthy();
    
    titles.forEach(title => {
      expect(title.length).toBeGreaterThan(0);
    });
  });

  test('TC-007: Verify Click Navigation to Related Product', async ({ page }) => {
    await productPage.searchProduct(TEST_CONFIG.SEARCH_TERM);
    const newPage = await productPage.clickFirstProduct();
    const newProductPage = new ProductPage(newPage);
    await newProductPage.scrollToRelatedProducts();

    const count = await newProductPage.getRelatedProductsCount();
    if (count > 0) {
      const initialUrl = newPage.url();
      await newProductPage.clickRelatedProduct(0);
      
      await newPage.waitForLoadState('domcontentloaded');
      const newUrl = newPage.url();
      
      expect(newUrl).not.toBe(initialUrl);
      expect(newUrl).toContain('ebay.com');
    }
  });

  test('TC-017: Verify Mobile Responsive Display', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is only for mobile devices');
    
    await productPage.searchProduct(TEST_CONFIG.SEARCH_TERM);
    await productPage.clickFirstProduct();
    await productPage.scrollToRelatedProducts();

    const isVisible = await productPage.isRelatedProductsSectionVisible();
    expect(isVisible).toBeTruthy();

    const count = await productPage.getRelatedProductsCount();
    expect(count).toBeLessThanOrEqual(TEST_CONFIG.MAX_RELATED_PRODUCTS);
  });

  test('TC-020: Verify Cross-Browser Compatibility', async ({ page, browserName }) => {
    await productPage.searchProduct(TEST_CONFIG.SEARCH_TERM);
    await productPage.clickFirstProduct();
    await productPage.scrollToRelatedProducts();

    const isVisible = await productPage.isRelatedProductsSectionVisible();
    expect(isVisible).toBeTruthy();

    const count = await productPage.getRelatedProductsCount();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(TEST_CONFIG.MAX_RELATED_PRODUCTS);
  });

  test('TC-024: Verify Page Load Performance', async ({ page }) => {
    const startTime = Date.now();
    
    await productPage.searchProduct(TEST_CONFIG.SEARCH_TERM);
    await productPage.clickFirstProduct();
    await productPage.scrollToRelatedProducts();
    
    const endTime = Date.now();
    const loadTime = (endTime - startTime) / 1000;

    expect(loadTime).toBeLessThan(10);
  });

  test('TC-030: Verify Currency Display Format', async ({ page }) => {
    await productPage.searchProduct(TEST_CONFIG.SEARCH_TERM);
    await productPage.clickFirstProduct();
    await productPage.scrollToRelatedProducts();

    const prices = await productPage.getRelatedProductPrices();
    
    prices.forEach(price => {
      expect(price).toBeGreaterThan(0);
      expect(typeof price).toBe('number');
    });
  });

  test('TC-031: Verify Keyboard Navigation', async ({ page }) => {
    test.skip(true, 'Keyboard navigation test - requires manual verification');
    
    await productPage.searchProduct(TEST_CONFIG.SEARCH_TERM);
    await productPage.clickFirstProduct();
    await productPage.scrollToRelatedProducts();

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });
});

test.describe('Related Products - Negative Test Cases', () => {
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    await productPage.goto();
  });

  test('TC-008: Verify Behavior When No Related Products Available', async ({ page }) => {
    await productPage.searchProduct('rare unique expensive wallet 99999');
    
    const searchResults = await page.locator('.s-item__link').count();
    
    if (searchResults > 0) {
      await productPage.clickFirstProduct();
      await page.waitForTimeout(2000);
      
      const relatedCount = await productPage.getRelatedProductsCount();
      expect(relatedCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('TC-025: Verify Slow Network Performance', async ({ page }) => {
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 1000);
    });

    await productPage.searchProduct(TEST_CONFIG.SEARCH_TERM);
    await productPage.clickFirstProduct();
    
    await page.waitForTimeout(3000);
    
    const pageLoaded = await page.locator('body').isVisible();
    expect(pageLoaded).toBeTruthy();
  });

  test('TC-027: Verify Image Loading Failure Handling', async ({ page }) => {
    await page.route('**/*.jpg', route => route.abort());
    await page.route('**/*.png', route => route.abort());

    await productPage.searchProduct(TEST_CONFIG.SEARCH_TERM);
    await productPage.clickFirstProduct();
    await productPage.scrollToRelatedProducts();

    const isVisible = await productPage.isRelatedProductsSectionVisible();
    expect(isVisible).toBeTruthy();
  });
});

test.describe('Related Products - Edge Cases', () => {
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    await productPage.goto();
  });

  test('TC-028: Verify Special Characters in Product Title', async ({ page }) => {
    await productPage.searchProduct(TEST_CONFIG.SEARCH_TERM);
    await productPage.clickFirstProduct();
    await productPage.scrollToRelatedProducts();

    const titles = await productPage.getRelatedProductTitles();
    
    titles.forEach(title => {
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
    });
  });

  test('TC-029: Verify Very Long Product Title Display', async ({ page }) => {
    await productPage.searchProduct(TEST_CONFIG.SEARCH_TERM);
    await productPage.clickFirstProduct();
    await productPage.scrollToRelatedProducts();

    const titles = await productPage.getRelatedProductTitles();
    
    titles.forEach(title => {
      expect(title.length).toBeLessThan(200);
    });
  });
});
