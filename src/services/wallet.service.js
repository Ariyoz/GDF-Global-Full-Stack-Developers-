// ── Wallet Service — Paystack integration ──
import http from './http'

export const walletService = {
  async getWallet() {
    return http.get('/wallet')
  },
  async getTransactions() {
    const data = await http.get('/wallet/transactions')
    return data.transactions || []
  },
  async getMonthlyEarnings() {
    const w = await http.get('/wallet')
    return w.monthly_earnings || 0
  },
  // Initialize Paystack payment — returns authorization_url
  async initializePayment(amountNaira, callbackUrl) {
    return http.post('/wallet/initialize', {
      amount: amountNaira,
      callback_url: callbackUrl || window.location.origin + '/wallet?verify=1',
    })
  },
  // Verify after Paystack redirect
  async verifyPayment(reference) {
    return http.post('/wallet/verify', { reference })
  },
  // Withdrawal request
  async requestWithdrawal(amount, bankName, accountNumber, accountName) {
    return http.post('/wallet/withdraw', {
      amount,
      bank_name: bankName,
      account_number: accountNumber,
      account_name: accountName,
    })
  },
}
