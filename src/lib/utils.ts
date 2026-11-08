import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "USD") {
  const currencyMap: Record<string, { locale: string; rate: number; symbol: string }> = {
    USD: { locale: "en-US", rate: 1.0, symbol: "$" },
    GBP: { locale: "en-GB", rate: 0.79, symbol: "£" },
    EUR: { locale: "fr-FR", rate: 0.92, symbol: "€" },
    CAD: { locale: "en-CA", rate: 1.35, symbol: "CA$" },
    AUD: { locale: "en-AU", rate: 1.52, symbol: "AU$" },
    AED: { locale: "ar-AE", rate: 3.67, symbol: "AED " },
  };

  const config = currencyMap[currency] || currencyMap["USD"];
  const converted = amount * config.rate;

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted);
}

