// ── WebSocket Service — Global real-time connection ──

let ws = null
let reconnectTimer = null
const listeners = new Set()

export const websocketService = {
  connect(token) {
    if (ws && ws.readyState === WebSocket.OPEN) return

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
    const wsUrl = baseUrl.replace('https://', 'wss://').replace('http://', 'ws://').replace('/api/v1', '')

    if (!token) return

    try {
      ws = new WebSocket(`${wsUrl}/ws/${token}`)

      ws.onopen = () => {
        console.log('[WS] Connected')
        // Send ping every 30s to keep alive
        this._startPing()
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          // Notify all listeners
          listeners.forEach(fn => fn(data))
        } catch { /* ignore parse errors */ }
      }

      ws.onclose = () => {
        console.log('[WS] Disconnected')
        this._stopPing()
        // Auto-reconnect after 5s
        reconnectTimer = setTimeout(() => this.connect(token), 5000)
      }

      ws.onerror = () => {
        // Will trigger onclose
      }
    } catch {
      // WebSocket not available
    }
  },

  disconnect() {
    if (reconnectTimer) clearTimeout(reconnectTimer)
    if (ws) {
      ws.close()
      ws = null
    }
    this._stopPing()
  },

  send(data) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data))
    }
  },

  // Subscribe to WebSocket events
  onEvent(callback) {
    listeners.add(callback)
    return () => listeners.delete(callback) // Returns unsubscribe function
  },

  // Check if connected
  isConnected() {
    return ws && ws.readyState === WebSocket.OPEN
  },

  _pingInterval: null,

  _startPing() {
    this._pingInterval = setInterval(() => {
      this.send({ type: 'ping' })
    }, 30000)
  },

  _stopPing() {
    if (this._pingInterval) {
      clearInterval(this._pingInterval)
      this._pingInterval = null
    }
  },
}
