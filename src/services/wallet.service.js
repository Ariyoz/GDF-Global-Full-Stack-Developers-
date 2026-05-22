// ── Wallet Service — Demo ──

export const walletService = {
  async getWallet() {
    return { balance: 0, total_earned: 0, total_withdrawn: 0 }
  },

  async getTransactions() {
    return []
  },

  async getMonthlyEarnings() {
    return 0
  },
}
