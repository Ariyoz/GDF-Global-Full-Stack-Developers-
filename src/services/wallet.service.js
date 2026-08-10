// ── Wallet Service — Paystack integration ──
import http from './http'

export const walletService = {

  // ── Balance + stats ──────────────────────────────────────────────────────
  async getWallet() {
    return http.get('/wallet')
  },

  // ── Transaction history (paginated) ─────────────────────────────────────
  async getTransactions({ page = 1, pageSize = 30, type = null } = {}) {
    const params = new URLSearchParams({ page, page_size: pageSize })
    if (type) params.append('tx_type', type)
    const data = await http.get(`/wallet/transactions?${params.toString()}`)
    return data
  },

  // ── Fund wallet via Paystack ─────────────────────────────────────────────
  // Returns { payment_url, reference, amount, provider }
  // Frontend redirects to payment_url.
  // Paystack redirects back to /wallet?ref=<reference>
  async initializePayment(amountNaira) {
    return http.post('/wallet/fund', {
      amount:   amountNaira,
      provider: 'paystack',
    }, { timeout: 60000 })
  },

  // ── Verify after Paystack redirect ───────────────────────────────────────
  // Call this when ?ref=<reference> appears in the URL after redirect
  async verifyPayment(reference) {
    return http.post('/wallet/verify', {
      reference,
      provider: 'paystack',
    }, { timeout: 30000 })
  },

  // ── List Nigerian banks (from Paystack) ──────────────────────────────────
  async getBanks() {
    const data = await http.get('/wallet/banks?provider=paystack')
    return data.banks || []
  },

  // ── Resolve account number → account name (Paystack) ────────────────────
  // Proxied through our backend to keep secret key server-side
  async verifyBankAccount(accountNumber, bankCode) {
    return http.post('/wallet/verify-account', {
      account_number: accountNumber,
      bank_code:      bankCode,
    })
  },

  // ── Request withdrawal ───────────────────────────────────────────────────
  async requestWithdrawal({ amount, bankName, bankCode, accountNumber, accountName }) {
    return http.post('/wallet/withdraw', {
      amount,
      bank_name:      bankName,
      account_name:   accountName,
      account_number: accountNumber,
      bank_code:      bankCode,
    }, { timeout: 30000 })
  },

  // ── Withdrawal history ───────────────────────────────────────────────────
  async getWithdrawals() {
    return http.get('/wallet/withdrawals')
  },

  // ── Dedicated Virtual Account (Paystack DVA) ─────────────────────────────
  async getVirtualAccount() {
    return http.get('/wallet/virtual-account')
  },

  async createVirtualAccount() {
    return http.post('/wallet/virtual-account?provider=paystack', {}, { timeout: 30000 })
  },

  // ── Send money to another GFD user ───────────────────────────────────────
  async sendMoney({ recipient, amount, note }) {
    return http.post('/wallet/send', { recipient, amount, note }, { timeout: 30000 })
  },

  // ── Request money from another GFD user ──────────────────────────────────
  async requestMoney({ recipient, amount, note }) {
    return http.post('/wallet/request', { recipient, amount, note }, { timeout: 30000 })
  },

  async getMoneyRequests() {
    return http.get('/wallet/requests')
  },

  async acceptRequest(requestId) {
    return http.post(`/wallet/requests/${requestId}/accept`, {})
  },

  async rejectRequest(requestId) {
    return http.post(`/wallet/requests/${requestId}/reject`, {})
  },

  // ── Crypto wallet ─────────────────────────────────────────────────────────

  async getCryptoBalance() {
    return http.get('/crypto/balance')
  },

  async getCryptoTransactions() {
    return http.get('/crypto/transactions')
  },

  async getCryptoDepositAddress(coin) {
    return http.get(`/crypto/deposit-address/${coin.toLowerCase()}`)
  },

  async listSupportedCoins() {
    return http.get('/crypto/coins')
  },

  async getCryptoPrices() {
    return http.get('/crypto/prices')
  },

  async sendCrypto({ coin, amount, to_address, network, idempotency_key, pin_token }) {
    return http.post('/crypto/send', { coin, amount, to_address, network, idempotency_key, pin_token }, { timeout: 30000 })
  },

  // ── Transaction PIN ───────────────────────────────────────────────────────
  async getPinStatus() {
    return http.get('/wallet/pin/status')
  },
  async createPin(pin, confirm_pin) {
    return http.post('/wallet/pin/create', { pin, confirm_pin })
  },
  async verifyPin(pin) {
    return http.post('/wallet/pin/verify', { pin })
  },
  async changePin(old_pin, new_pin, confirm_pin) {
    return http.post('/wallet/pin/change', { old_pin, new_pin, confirm_pin })
  },

  // ── KYC ──────────────────────────────────────────────────────────────────
  async getKycStatus() {
    return http.get('/kyc/status')
  },
}
