// ── Currency Store — persisted user preference ──
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// All supported currencies with their exchange rates relative to USD
// Rates are approximate — in production you'd fetch these from an API
export const CURRENCIES = [
  { code: 'USD', symbol: '$',  name: 'US Dollar',          country: 'United States',          rate: 1 },
  { code: 'NGN', symbol: '₦',  name: 'Nigerian Naira',      country: 'Nigeria',                rate: 1650 },
  { code: 'GBP', symbol: '£',  name: 'British Pound',       country: 'United Kingdom',         rate: 0.79 },
  { code: 'EUR', symbol: '€',  name: 'Euro',                country: 'European Union',         rate: 0.92 },
  { code: 'CAD', symbol: 'CA$',name: 'Canadian Dollar',     country: 'Canada',                 rate: 1.37 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar',   country: 'Australia',              rate: 1.54 },
  { code: 'INR', symbol: '₹',  name: 'Indian Rupee',        country: 'India',                  rate: 83.5 },
  { code: 'GHS', symbol: 'GH₵',name: 'Ghanaian Cedi',       country: 'Ghana',                  rate: 15.6 },
  { code: 'KES', symbol: 'KSh',name: 'Kenyan Shilling',     country: 'Kenya',                  rate: 129 },
  { code: 'ZAR', symbol: 'R',  name: 'South African Rand',  country: 'South Africa',           rate: 18.6 },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound',      country: 'Egypt',                  rate: 30.9 },
  { code: 'TZS', symbol: 'TSh',name: 'Tanzanian Shilling',  country: 'Tanzania',               rate: 2530 },
  { code: 'UGX', symbol: 'USh',name: 'Ugandan Shilling',    country: 'Uganda',                 rate: 3760 },
  { code: 'RWF', symbol: 'RF', name: 'Rwandan Franc',       country: 'Rwanda',                 rate: 1300 },
  { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr',      country: 'Ethiopia',               rate: 56.5 },
  { code: 'XOF', symbol: 'CFA',name: 'West African CFA',    country: 'Senegal / Côte d\'Ivoire',rate: 604 },
  { code: 'MAD', symbol: 'MAD',name: 'Moroccan Dirham',     country: 'Morocco',                rate: 10.0 },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real',      country: 'Brazil',                 rate: 4.97 },
  { code: 'MXN', symbol: 'MX$',name: 'Mexican Peso',        country: 'Mexico',                 rate: 17.1 },
  { code: 'AED', symbol: 'AED',name: 'UAE Dirham',          country: 'UAE',                    rate: 3.67 },
  { code: 'SAR', symbol: 'SAR',name: 'Saudi Riyal',         country: 'Saudi Arabia',           rate: 3.75 },
  { code: 'PKR', symbol: '₨',  name: 'Pakistani Rupee',     country: 'Pakistan',               rate: 278 },
  { code: 'BDT', symbol: '৳',  name: 'Bangladeshi Taka',    country: 'Bangladesh',             rate: 110 },
  { code: 'PHP', symbol: '₱',  name: 'Philippine Peso',     country: 'Philippines',            rate: 56.5 },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah',   country: 'Indonesia',              rate: 15800 },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit',   country: 'Malaysia',               rate: 4.72 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar',    country: 'Singapore',              rate: 1.34 },
  { code: 'JPY', symbol: '¥',  name: 'Japanese Yen',        country: 'Japan',                  rate: 149 },
  { code: 'CNY', symbol: '¥',  name: 'Chinese Yuan',        country: 'China',                  rate: 7.24 },
  { code: 'KRW', symbol: '₩',  name: 'South Korean Won',    country: 'South Korea',            rate: 1330 },
  { code: 'TRY', symbol: '₺',  name: 'Turkish Lira',        country: 'Turkey',                 rate: 32.1 },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona',       country: 'Sweden',                 rate: 10.5 },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone',     country: 'Norway',                 rate: 10.6 },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone',        country: 'Denmark',                rate: 6.89 },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc',         country: 'Switzerland',            rate: 0.9 },
  { code: 'NZD', symbol: 'NZ$',name: 'New Zealand Dollar',  country: 'New Zealand',            rate: 1.63 },
]

export const useCurrencyStore = defineStore('currency', () => {
  const code = ref(localStorage.getItem('gfd_currency') || 'USD')

  const current = computed(() => CURRENCIES.find(c => c.code === code.value) || CURRENCIES[0])

  function setCurrency(newCode) {
    code.value = newCode
    localStorage.setItem('gfd_currency', newCode)
  }

  // Convert a USD amount to the current currency
  function fromUSD(usdAmount) {
    return Number(usdAmount || 0) * (current.value.rate || 1)
  }

  // Format a USD amount into the current currency string
  function format(usdAmount) {
    const val = fromUSD(usdAmount)
    const sym = current.value.symbol
    // For very large rates (JPY, IDR etc) show 0 decimals
    const decimals = current.value.rate >= 100 ? 0 : 2
    return `${sym}${val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
  }

  // Format a raw value already in the current currency (e.g. NGN wallet balance)
  function formatRaw(amount) {
    const sym = current.value.symbol
    const decimals = current.value.rate >= 100 ? 0 : 2
    return `${sym}${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
  }

  return { code, current, setCurrency, fromUSD, format, formatRaw, CURRENCIES }
})
