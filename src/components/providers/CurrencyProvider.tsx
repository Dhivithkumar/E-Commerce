"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CurrencyCode, SUPPORTED_CURRENCIES, formatCurrencyAmount } from "@/lib/currency";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  setCurrency: () => {},
  formatPrice: (amount) => `$${amount.toFixed(2)}`,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    const saved = localStorage.getItem("elora_currency") as CurrencyCode;
    if (saved && SUPPORTED_CURRENCIES[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem("elora_currency", code);
  };

  const formatPrice = (amountInUSD: number) => {
    return formatCurrencyAmount(amountInUSD, currency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

