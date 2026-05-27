// ── WebSocket Service — Global real-time connection (instant notifications) ──

let ws = null
let reconnectTimer = null
let currentToken = null
let reconnectAttempts = 0
const MAX_RECONNECT_DELAY = 10000
const listeners = new Set()

export const websocketService = {
  connect(token) {
    if (!token) return
    currentToken = token

    // Don't reconnect if already open
    if (ws && ws.readyState === WebSocket.OPEN) return
    // Clean up existing connection
    if (ws) {
      try { ws.close() } catch {}
      ws = null
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
    const wsUrl = baseUrl.replace('https://', 'wss://').replace('http://', 'ws://').replace('/api/v1', '')

    try {
      ws = new WebSocket(`${wsUrl}/ws/${token}`)

      ws.onopen = () => {
        console.log('[WS] Connected')
        reconnectAttempts = 0
        this._startPing()
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'pong') return // Ignore pong responses
          // Notify all listeners immediately
          listeners.forEach(fn => fn(data))
        } catch { /* ignore parse errors */ }
      }

      ws.onclose = () => {
        console.log('[WS] Disconnected')
        this._stopPing()
        ws = null
        // Exponential backoff reconnect (1s, 2s, 4s, max 10s)
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), MAX_RECONNECT_DELAY)
        reconnectAttempts++
        reconnectTimer = setTimeout(() => this.connect(currentToken), delay)
      }

      ws.onerror = () => {
        // Will trigger onclose
      }
    } catch {
      // WebSocket not available — retry in 3s
      reconnectTimer = setTimeout(() => this.connect(currentToken), 3000)
    }
  },

  disconnect() {
    currentToken = null
    reconnectAttempts = 0
    if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null }
    if (ws) {
      try { ws.close() } catch {}
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
    return () => listeners.delete(callback)
  },

  // Check if connected
  isConnected() {
    return ws && ws.readyState === WebSocket.OPEN
  },

  // Force reconnect (e.g., when tab becomes visible again)
  ensureConnected() {
    if (!currentToken) return
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null }
      reconnectAttempts = 0
      this.connect(currentToken)
    }
  },

  _pingInterval: null,

  _startPing() {
    // Ping every 15s to keep connection alive on Render
    this._stopPing()
    this._pingInterval = setInterval(() => {
      this.send({ type: 'ping' })
    }, 15000)
  },

  _stopPing() {
    if (this._pingInterval) {
      clearInterval(this._pingInterval)
      this._pingInterval = null
    }
  },
}

// Auto-reconnect when tab becomes visible (user switches back to app)
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      websocketService.ensureConnected()
    }
  })
}

// Reconnect on network recovery
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    websocketService.ensureConnected()
  })
}
