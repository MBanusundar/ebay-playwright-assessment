export class TestHelpers {
  static calculatePriceRange(basePrice: number, tolerance: number = 0.20): { min: number; max: number } {
    return {
      min: basePrice * (1 - tolerance),
      max: basePrice * (1 + tolerance)
    };
  }

  static isPriceInRange(price: number, basePrice: number, tolerance: number = 0.20): boolean {
    const range = this.calculatePriceRange(basePrice, tolerance);
    return price >= range.min && price <= range.max;
  }

  static formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  static extractPrice(priceString: string): number {
    const cleaned = priceString.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  }

  static async waitForNetworkIdle(page: any, timeout: number = 3000) {
    await page.waitForLoadState('networkidle', { timeout });
  }

  static generateTestData() {
    return {
      searchTerms: ['wallet', 'mens wallet', 'leather wallet'],
      categories: ['Wallets', 'Men\'s Wallets', 'Accessories'],
      priceRanges: [
        { min: 10, max: 30 },
        { min: 30, max: 60 },
        { min: 60, max: 100 }
      ]
    };
  }

  static async takeScreenshot(page: any, name: string) {
    await page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }
}

export const TEST_CONFIG = {
  MAX_RELATED_PRODUCTS: 6,
  PRICE_TOLERANCE: 0.20,
  DEFAULT_TIMEOUT: 30000,
  SEARCH_TERM: 'mens leather wallet',
  BASE_URL: 'https://www.ebay.com'
};
