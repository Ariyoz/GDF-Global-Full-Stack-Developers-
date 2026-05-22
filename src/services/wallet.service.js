// ── Wallet Service — Supabase ──
import { supabase } from '@/lib/supabase'

export const walletService = {
  // Get wallet for user
  async getWallet(userId) {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data || { balance: 0, total_earned: 0, total_withdrawn: 0 }
  },

  // Get transactions
  async getTransactions(userId, { limit = 20, page = 1 } = {}) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)
    if (error) throw error
    return data || []
  },

  // Get earnings this month
  async getMonthlyEarnings(userId) {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'payment')
      .eq('status', 'completed')
      .gte('created_at', startOfMonth.toISOString())
    if (error) throw error

    return (data || []).reduce((sum, t) => sum + Number(t.amount), 0)
  },
}
