/**
 * ProductPage - Page Object Model
 * Author: Banu
 */

import { Page, Locator, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly relatedProductsSection: Locator;
  readonly relatedProductsHeading: Locator;
  readonly relatedProductCards: Locator;
  readonly relatedProductImages: Locator;
  readonly relatedProductTitles: Locator;
  readonly relatedProductPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.locator('#gh-ac');
    this.searchButton = page.locator('#gh-btn');
    this.productTitle = page.locator('h1.x-item-title__mainTitle, .it-ttl').first();
    this.productPrice = page.locator('.x-price-primary, .notranslate').first();
    
    // Related products selectors - these may need adjustment based on actual eBay structure
    this.relatedProductsSection = page.locator('.ieDF.qxPV').first();
    this.relatedProductsHeading = page.locator('h2:has-text("Similar"), h3:has-text("Related")').first();
    this.relatedProductCards = page.locator('.ieDF.qxPV');
    this.relatedProductImages = page.locator('.ieDF.qxPV img');
    this.relatedProductTitles = page.locator('.ieDF.qxPV');
    this.relatedProductPrices = page.locator('.ieDF.qxPV').locator('.ux-textspans--BOLD');
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(2000);
    // Close any popups
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(500);
  }

  async searchProduct(searchTerm: string) {
    await this.searchBox.waitFor({ state: 'visible' });
    await this.searchBox.click();
    await this.searchBox.fill(searchTerm);
    await this.searchBox.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickFirstProduct() {
    await this.page.waitForTimeout(3000);
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.page.locator('img[src*="gDcAAeSwX6tprsyQ"]').nth(1).click()
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }

  async getProductPrice(): Promise<number> {
    const priceText = await this.productPrice.textContent();
    if (!priceText) return 0;
    const price = priceText.replace(/[^0-9.]/g, '');
    return parseFloat(price);
  }

  async getProductTitle(): Promise<string> {
    return await this.productTitle.textContent() || '';
  }

  async scrollToRelatedProducts() {
    await this.page.waitForTimeout(2000);
    try {
      await this.relatedProductsSection.scrollIntoViewIfNeeded({ timeout: 5000 });
    } catch {
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    }
    await this.page.waitForTimeout(1000);
  }

  async isRelatedProductsSectionVisible(): Promise<boolean> {
    return await this.relatedProductsSection.isVisible();
  }

  async getRelatedProductsCount(): Promise<number> {
    return await this.relatedProductCards.count();
  }

  async getRelatedProductPrices(): Promise<number[]> {
    const count = await this.relatedProductCards.count();
    const prices: number[] = [];
    
    for (let i = 0; i < count; i++) {
      const priceText = await this.relatedProductPrices.nth(i).textContent();
      if (priceText) {
        const price = priceText.replace(/[^0-9.]/g, '');
        prices.push(parseFloat(price));
      }
    }
    return prices;
  }

  async getRelatedProductTitles(): Promise<string[]> {
    const count = await this.relatedProductCards.count();
    const titles: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const title = await this.relatedProductTitles.nth(i).textContent();
      if (title) titles.push(title.trim());
    }
    return titles;
  }

  async clickRelatedProduct(index: number) {
    await this.relatedProductCards.nth(index).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyPriceRange(mainPrice: number, relatedPrices: number[], tolerance: number = 0.20): Promise<boolean> {
    const lowerBound = mainPrice * (1 - tolerance);
    const upperBound = mainPrice * (1 + tolerance);
    
    return relatedPrices.every(price => price >= lowerBound && price <= upperBound);
  }

  async areAllImagesLoaded(): Promise<boolean> {
    const images = await this.relatedProductImages.all();
    for (const img of images) {
      const isVisible = await img.isVisible();
      if (!isVisible) return false;
    }
    return true;
  }
}
