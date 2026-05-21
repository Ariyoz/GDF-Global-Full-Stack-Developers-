// ── Contact Service ──
import http from './http'
import { API_ENDPOINTS } from '@/config/api'

export const contactService = {
  async send(data) {
    return http.post(API_ENDPOINTS.contact.send, data)
  },

  async subscribeNewsletter(email) {
    return http.post(API_ENDPOINTS.newsletter.subscribe, { email })
  },
}
