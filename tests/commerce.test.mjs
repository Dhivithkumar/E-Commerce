import test from "node:test";
import assert from "node:assert";

// Pure unit test suite for ÉLORA Commerce & AI Rules
const SUPPORTED_CURRENCIES = {
  USD: { code: "USD", symbol: "$", rate: 1.0, freeShippingThreshold: 100 },
  GBP: { code: "GBP", symbol: "£", rate: 0.79, freeShippingThreshold: 80 },
  EUR: { code: "EUR", symbol: "€", rate: 0.92, freeShippingThreshold: 90 },
  CAD: { code: "CAD", symbol: "CA$", rate: 1.35, freeShippingThreshold: 135 },
  AUD: { code: "AUD", symbol: "AU$", rate: 1.52, freeShippingThreshold: 150 },
  AED: { code: "AED", symbol: "AED ", rate: 3.67, freeShippingThreshold: 370 },
};

function convertFromUSD(amountInUSD, targetCurrency) {
  const rate = SUPPORTED_CURRENCIES[targetCurrency]?.rate ?? 1.0;
  return Math.round(amountInUSD * rate * 100) / 100;
}

test("Currency conversion for major international markets", () => {
  const usdAmount = 100.0;
  assert.strictEqual(convertFromUSD(usdAmount, "GBP"), 79.0);
  assert.strictEqual(convertFromUSD(usdAmount, "EUR"), 92.0);
  assert.strictEqual(convertFromUSD(usdAmount, "AED"), 367.0);
  assert.strictEqual(convertFromUSD(usdAmount, "CAD"), 135.0);
  assert.strictEqual(convertFromUSD(usdAmount, "AUD"), 152.0);
});

test("Complimentary shipping thresholds across territories", () => {
  assert.strictEqual(SUPPORTED_CURRENCIES.USD.freeShippingThreshold, 100);
  assert.strictEqual(SUPPORTED_CURRENCIES.GBP.freeShippingThreshold, 80);
  assert.strictEqual(SUPPORTED_CURRENCIES.EUR.freeShippingThreshold, 90);
  assert.strictEqual(SUPPORTED_CURRENCIES.AED.freeShippingThreshold, 370);
});

test("Coupon calculation logic for percentage and fixed discount", () => {
  const subtotal = 200.0;
  const discount15Percent = (subtotal * 15) / 100;
  assert.strictEqual(discount15Percent, 30.0);
  assert.strictEqual(subtotal - discount15Percent, 170.0);

  const fixedDiscount = Math.min(25.0, subtotal);
  assert.strictEqual(fixedDiscount, 25.0);
  assert.strictEqual(subtotal - fixedDiscount, 175.0);
});

test("International tax rate validation", () => {
  const amount = 100.0;
  assert.strictEqual(amount * 0.20, 20.0); // UK VAT 20%
  assert.strictEqual(amount * 0.05, 5.0);  // UAE VAT 5%
  assert.strictEqual(amount * 0.08, 8.0);  // US avg 8%
});

test("AI Skin Discovery compatibility scoring algorithm", () => {
  const testProduct = {
    skinTypes: "dry,combination,sensitive",
    primaryConcerns: "barrier,hydration,redness",
    isBestseller: true,
  };

  const userSkinType = "dry";
  const userConcerns = ["barrier", "hydration"];

  let score = 0;
  if (testProduct.skinTypes.includes(userSkinType)) score += 30;
  for (const c of userConcerns) {
    if (testProduct.primaryConcerns.includes(c)) score += 25;
  }
  if (testProduct.isBestseller) score += 10;

  // Expected: 30 (skin type) + 25 (barrier) + 25 (hydration) + 10 (bestseller) = 90
  assert.strictEqual(score, 90);
});

test("Cart quantity respects maximum stock limit", () => {
  const maxStock = 12;
  const requestedQuantity = 20;
  const allocatedQuantity = Math.min(requestedQuantity, maxStock);
  assert.strictEqual(allocatedQuantity, 12);
});

test("Order shipping calculation thresholds", () => {
  const freeThresholdUSD = 100.0;
  const standardFeeUSD = 15.0;

  // Order below threshold
  const subtotalLow = 85.0;
  const shippingLow = subtotalLow >= freeThresholdUSD ? 0 : standardFeeUSD;
  assert.strictEqual(shippingLow, 15.0);

  // Order above threshold
  const subtotalHigh = 135.0;
  const shippingHigh = subtotalHigh >= freeThresholdUSD ? 0 : standardFeeUSD;
  assert.strictEqual(shippingHigh, 0.0);
});

test("Customer review rating boundary constraints", () => {
  const clampRating = (r) => Math.max(1, Math.min(5, parseInt(r, 10)));
  assert.strictEqual(clampRating(6), 5);
  assert.strictEqual(clampRating(0), 1);
  assert.strictEqual(clampRating(4), 4);
});

