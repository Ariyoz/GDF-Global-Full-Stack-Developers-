// ── Wallet Service — Demo ──

export const walletService = {
  async getWallet() {
    return { balance: 1250.00, total_earned: 4500.00, total_withdrawn: 3250.00 }
  },

  async getTransactions() {
    return [
      { id: 'tx-001', type: 'payment', amount: 500, status: 'completed', description: 'Project payment - Dashboard UI', created_at: '2024-12-15T10:00:00Z' },
      { id: 'tx-002', type: 'withdrawal', amount: -250, status: 'completed', description: 'Withdrawal to bank', created_at: '2024-12-10T14:00:00Z' },
      { id: 'tx-003', type: 'payment', amount: 750, status: 'completed', description: 'Project payment - API Integration', created_at: '2024-12-05T09:00:00Z' },
    ]
  },

  async getMonthlyEarnings() {
    return 1250.00
  },
}
