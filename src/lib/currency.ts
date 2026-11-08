export type CurrencyCode = "USD" | "GBP" | "EUR" | "CAD" | "AUD" | "AED";

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // against base USD
  flag: string;
  locale: string;
  freeShippingThreshold: number;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: {
    code: "USD",
    symbol: "$",
    name: "United States (USD)",
    rate: 1.0,
    flag: "🇺🇸",
    locale: "en-US",
    freeShippingThreshold: 100,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "United Kingdom (GBP)",
    rate: 0.79,
    flag: "🇬🇧",
    locale: "en-GB",
    freeShippingThreshold: 80,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "European Union (EUR)",
    rate: 0.92,
    flag: "🇪🇺",
    locale: "fr-FR",
    freeShippingThreshold: 90,
  },
  CAD: {
    code: "CAD",
    symbol: "CA$",
    name: "Canada (CAD)",
    rate: 1.35,
    flag: "🇨🇦",
    locale: "en-CA",
    freeShippingThreshold: 135,
  },
  AUD: {
    code: "AUD",
    symbol: "AU$",
    name: "Australia (AUD)",
    rate: 1.52,
    flag: "🇦🇺",
    locale: "en-AU",
    freeShippingThreshold: 150,
  },
  AED: {
    code: "AED",
    symbol: "AED ",
    name: "United Arab Emirates (AED)",
    rate: 3.67,
    flag: "🇦🇪",
    locale: "ar-AE",
    freeShippingThreshold: 370,
  },
};

export function convertFromUSD(amountInUSD: number, targetCurrency: CurrencyCode): number {
  const rate = SUPPORTED_CURRENCIES[targetCurrency]?.rate ?? 1.0;
  return Math.round(amountInUSD * rate * 100) / 100;
}

export function formatCurrencyAmount(amountInUSD: number, currencyCode: CurrencyCode): string {
  const info = SUPPORTED_CURRENCIES[currencyCode] ?? SUPPORTED_CURRENCIES.USD;
  const converted = amountInUSD * info.rate;
  return new Intl.NumberFormat(info.locale, {
    style: "currency",
    currency: info.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted);
}

