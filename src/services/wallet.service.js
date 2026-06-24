// ── Wallet Service — Flutterwave integration ──
import http from './http'

export const walletService = {
  // Balance + monthly stats
  async getWallet() {
    return http.get('/wallet')
  },

  // Last 100 transactions
  async getTransactions() {
    const data = await http.get('/wallet/transactions')
    return data.transactions || []
  },

  // Initialize Flutterwave payment → returns { payment_link, tx_ref }
  // Frontend redirects to payment_link
  // Flutterwave redirects back to /wallet?tx_ref=xxx&transaction_id=xxx&status=successful
  async initializePayment(amountNaira, redirectUrl) {
    return http.post('/wallet/flw/initialize', {
      amount:       amountNaira,
      redirect_url: redirectUrl || window.location.origin + '/wallet',
    }, { timeout: 30000 })
  },

  // Verify after Flutterwave redirect
  async verifyPayment({ txRef, transactionId, status }) {
    const params = new URLSearchParams()
    if (txRef)         params.append('tx_ref', txRef)
    if (transactionId) params.append('transaction_id', transactionId)
    if (status)        params.append('status', status)
    return http.get(`/wallet/flw/verify?${params.toString()}`, { timeout: 30000 })
  },

  // Live Nigerian bank list
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

  // Instant withdrawal via Flutterwave Transfer
  async requestWithdrawal({ amount, bankCode, accountNumber, accountName }) {
    return http.post('/wallet/withdraw', {
      amount,
      bank_code:      bankCode,
      account_number: accountNumber,
      account_name:   accountName,
    }, { timeout: 30000 })
  },

  // Admin endpoints
  async adminOverview()           { return http.get('/wallet/admin/overview') },
  async adminPendingWithdrawals() { return http.get('/wallet/admin/pending-withdrawals') },
  async adminCreditUser(userId, amount, description) {
    return http.post('/wallet/admin/credit-user', { user_id: userId, amount, description })
  },
}
