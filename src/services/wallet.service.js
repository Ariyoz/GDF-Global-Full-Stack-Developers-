// ── Wallet Service — Full Paystack integration ──
import http from './http'

export const walletService = {
  // Balance + stats
  async getWallet() {
    return http.get('/wallet')
  },

  // Last 100 transactions
  async getTransactions() {
    const data = await http.get('/wallet/transactions')
    return data.transactions || []
  },

  // Initialize Paystack payment — returns { authorization_url, reference }
  async initializePayment(amountNaira, callbackUrl) {
    return http.post('/wallet/initialize', {
      amount:       amountNaira,
      // Paystack appends ?reference=xxx&trxref=xxx automatically
      callback_url: callbackUrl || window.location.origin + '/wallet',
    })
  },

  // Verify after Paystack redirect
  async verifyPayment(reference) {
    return http.post('/wallet/verify', { reference })
  },

  // Fetch live bank list from Paystack (via our backend)
  async getBanks() {
    const data = await http.get('/wallet/banks')
    return data.banks || []
  },

  // Resolve account number → account name
  async verifyBankAccount(accountNumber, bankCode) {
    return http.post('/wallet/verify-account', {
      account_number: accountNumber,
      bank_code:      bankCode,
    })
  },

  // Initiate Paystack transfer (instant withdrawal)
  async requestWithdrawal({ amount, bankCode, accountNumber, accountName }) {
    return http.post('/wallet/withdraw', {
      amount,
      bank_code:      bankCode,
      account_number: accountNumber,
      account_name:   accountName,
    })
  },

  // Admin: platform stats
  async adminOverview() {
    return http.get('/wallet/admin/overview')
  },

  // Admin: credit a user
  async adminCreditUser(userId, amount, description) {
    return http.post('/wallet/admin/credit-user', { user_id: userId, amount, description })
  },

  // Admin: pending withdrawals
  async adminPendingWithdrawals() {
    return http.get('/wallet/admin/pending-withdrawals')
  },
}
