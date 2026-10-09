export type PricingCurrency = "VND" | "USD";
export type PricedPackage = "standard" | "premium" | "bespoke";

export const PACKAGE_PRICES = {
  VND: { standard: 500_000, premium: 800_000, bespoke: 1_800_000 },
  USD: { standard: 99, premium: 199, bespoke: 299 },
} as const;

export function currencyForCountry(country: string | null | undefined): PricingCurrency {
  return country?.trim().toUpperCase() === "VN" ? "VND" : "USD";
}

export function packageAmount(id: PricedPackage, currency: PricingCurrency): string {
  return PACKAGE_PRICES[currency][id].toLocaleString(currency === "VND" ? "vi-VN" : "en-US");
}

export function packagePrice(id: PricedPackage, currency: PricingCurrency): string {
  const amount = packageAmount(id, currency);
  return currency === "VND" ? `${amount}đ` : `$${amount} USD`;
}
