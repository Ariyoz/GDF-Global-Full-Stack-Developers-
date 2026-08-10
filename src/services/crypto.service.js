// ── Crypto Wallet Service ──
import http from './http'

export const cryptoService = {
  // List supported coins
  async getCoins() {
    const data = await http.get('/crypto/coins')
    return data.coins || []
  },

  // Get all crypto balances
  async getBalances() {
    const data = await http.get('/crypto/balance')
    return data.balances || []
  },

  // Get deposit address for a specific coin
  async getDepositAddress(coin) {
    return http.get(`/crypto/deposit-address/${coin.toLowerCase()}`)
  },

  // Get crypto transaction history
  async getTransactions() {
    const data = await http.get('/crypto/transactions')
    return data.transactions || []
  },
}
