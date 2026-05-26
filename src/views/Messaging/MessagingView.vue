<template>
  <div class="messaging-view">
    <!-- Conversation List -->
    <div class="conv-panel" :class="{ 'hidden-mobile': activeConv }">
      <div class="conv-header">
        <h2 class="text-headline-md">Messages</h2>
      </div>
      <div class="conv-search">
        <span class="material-symbols-outlined search-icon">search</span>
        <input v-model="search" class="search-input" placeholder="Search conversations..." />
      </div>
      <div class="conv-list">
        <div
          v-for="conv in filteredConvs"
          :key="conv.id"
          class="conv-item"
          :class="{ active: activeConv?.id === conv.id }"
          @click="selectConv(conv)"
        >
          <div class="conv-avatar">
            <img v-if="conv.avatar" :src="conv.avatar" :alt="conv.name" class="conv-avatar-img" />
            <span v-else>{{ (conv.name || 'U')[0] }}</span>
            <span v-if="conv.online" class="online-dot" />
          </div>
          <div class="conv-info">
            <div class="conv-top">
              <span class="conv-name">{{ conv.name }}</span>
              <span v-if="conv.pinned" class="material-symbols-outlined pin-icon" style="font-size:14px;color:var(--primary);">push_pin</span>
              <span class="conv-time">{{ conv.time }}</span>
            </div>
            <div class="conv-bottom">
              <span class="conv-last">{{ conv.lastMessage || 'Start chatting...' }}</span>
              <span v-if="conv.unread" class="unread-badge">{{ conv.unread }}</span>
            </div>
          </div>
        </div>
        <div v-if="!filteredConvs.length" class="empty-convs">
          <span class="material-symbols-outlined" style="font-size:2rem;color:var(--on-surface-variant)">chat_bubble</span>
          <p class="text-body-md" style="margin-top:0.5rem">No conversations found</p>
        </div>
      </div>
    </div>

    <!-- Chat Area -->
    <div class="chat-panel" :class="{ 'hidden-mobile': !activeConv }">
      <template v-if="activeConv">
        <div class="chat-header glass-card-static">
          <button class="btn-ghost back-btn" @click="messagingStore.setActiveConversation(null)">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div class="chat-avatar">
            <img v-if="activeConv.avatar" :src="activeConv.avatar" :alt="activeConv.name" class="conv-avatar-img" />
            <span v-else>{{ (activeConv.name || 'U')[0] }}</span>
          </div>
          <div class="chat-info">
            <p class="chat-name">{{ activeConv.name }}</p>
            <p class="chat-status">
              <span v-if="activeConv.online" class="status-dot status-dot-green" />
              {{ activeConv.online ? 'Online' : 'Offline' }}
            </p>
          </div>
          <div class="chat-actions">
            <button class="btn-ghost icon-only call-btn" @click="startCall('voice')" title="Voice call">
              <span class="material-symbols-outlined">call</span>
            </button>
            <button class="btn-ghost icon-only call-btn" @click="startCall('video')" title="Video call">
              <span class="material-symbols-outlined">videocam</span>
            </button>
            <button class="btn-ghost icon-only" @click="showChatMenu = !showChatMenu">
              <span class="material-symbols-outlined">more_vert</span>
            </button>
            <div v-if="showChatMenu" class="chat-dropdown">
              <button class="dropdown-item" @click="pinCurrentChat">
                <span class="material-symbols-outlined">push_pin</span>
                {{ activeConv?.pinned ? 'Unpin chat' : 'Pin chat' }}
              </button>
              <button class="dropdown-item" @click="deleteChat">
                <span class="material-symbols-outlined">delete</span>
                Delete conversation
              </button>
              <button class="dropdown-item" @click="showChatMenu = false">
                <span class="material-symbols-outlined">volume_off</span>
                Mute
              </button>
              <button class="dropdown-item" @click="showChatMenu = false">
                <span class="material-symbols-outlined">block</span>
                Block user
              </button>
            </div>
          </div>
        </div>

        <!-- Call Overlay -->
        <Transition name="call-fade">
          <div v-if="callActive" class="call-overlay">
            <!-- Video streams (shown during video call) -->
            <div v-if="callType === 'video' && callConnected" class="video-call-container">
              <video ref="remoteVideoEl" class="remote-video" autoplay playsinline></video>
              <video ref="localVideoEl" class="local-video" autoplay playsinline muted></video>
            </div>

            <div class="call-card" :class="{ 'call-card-video': callType === 'video' && callConnected }">
              <div v-if="!(callType === 'video' && callConnected)" class="call-avatar-large">
                <img v-if="activeConv.avatar" :src="activeConv.avatar" :alt="activeConv.name" class="call-avatar-img" />
                <span v-else class="call-initials">{{ (activeConv.name || 'U')[0] }}</span>
              </div>
              <h3 class="call-name">{{ activeConv.name }}</h3>
              <p class="call-status-text">{{ callStatusText }}</p>
              <div class="call-timer" v-if="callConnected">{{ callDuration }}</div>
              <div class="call-controls">
                <button class="call-control-btn" :class="{ active: isMuted }" @click="toggleMute">
                  <span class="material-symbols-outlined">{{ isMuted ? 'mic_off' : 'mic' }}</span>
                </button>
                <button v-if="callType === 'video'" class="call-control-btn" :class="{ active: isCameraOff }" @click="toggleCamera">
                  <span class="material-symbols-outlined">{{ isCameraOff ? 'videocam_off' : 'videocam' }}</span>
                </button>
                <button class="call-control-btn" :class="{ active: isSpeaker }" @click="isSpeaker = !isSpeaker">
                  <span class="material-symbols-outlined">{{ isSpeaker ? 'volume_up' : 'volume_off' }}</span>
                </button>
                <button class="call-end-btn" @click="endCall">
                  <span class="material-symbols-outlined">call_end</span>
                </button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Incoming Call Notification -->
        <Transition name="call-fade">
          <div v-if="incomingCall" class="incoming-call-overlay">
            <div class="incoming-call-card">
              <div class="call-avatar-large">
                <img v-if="incomingCall.caller_avatar" :src="incomingCall.caller_avatar" alt="" class="call-avatar-img" />
                <span v-else class="call-initials">{{ (incomingCall.caller_name || 'U')[0] }}</span>
              </div>
              <h3 class="call-name">{{ incomingCall.caller_name || 'Someone' }}</h3>
              <p class="call-status-text">{{ incomingCall.call_type === 'video' ? 'Incoming video call...' : 'Incoming voice call...' }}</p>
              <div class="incoming-call-actions">
                <button class="call-end-btn" @click="rejectIncomingCall">
                  <span class="material-symbols-outlined">call_end</span>
                </button>
                <button class="call-accept-btn" @click="acceptIncomingCall">
                  <span class="material-symbols-outlined">call</span>
                </button>
              </div>
            </div>
          </div>
        </Transition>

        <div class="chat-messages" ref="messagesEl">
          <div
            v-for="msg in activeMessages"
            :key="msg.id"
            class="msg-row"
            :class="{ 'msg-mine': msg.mine }"
          >
            <div class="msg-bubble" :class="[msg.mine ? 'bubble-mine' : 'bubble-theirs', { deleted: msg.is_deleted }]">
              <p v-if="msg.media_url" class="msg-media">
                <img :src="msg.media_url" alt="Shared image" class="msg-image" />
              </p>
              <!-- Code snippet detection -->
              <pre v-if="isCodeSnippet(msg.content)" class="msg-code"><code>{{ extractCode(msg.content) }}</code></pre>
              <span v-else>{{ msg.content || msg.text }}</span>
              <span v-if="msg.is_edited" class="msg-edited">(edited)</span>
              <div class="msg-footer">
                <span class="msg-time">{{ msg.time }}</span>
                <span v-if="msg.mine && msg.is_read" class="msg-read">✓✓</span>
                <span v-else-if="msg.mine" class="msg-sent">✓</span>
              </div>
            </div>
          </div>

          <!-- Typing indicator (at bottom after all messages) -->
          <div v-if="messagingStore.typingUsers[activeConv?.id]?.length" class="typing-indicator">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-text">typing...</span>
          </div>
        </div>

        <div class="chat-input-bar glass-card-static">
          <button class="btn-ghost icon-only input-action" @click="$refs.chatImageInput?.click()">
            <span class="material-symbols-outlined">image</span>
          </button>
          <input ref="chatImageInput" type="file" accept="image/*" class="hidden-input" @change="sendImage" />
          <input
            v-model="newMessage"
            class="chat-input"
            placeholder="Start a new message"
            @keydown.enter.prevent="sendMessage"
            @input="handleTyping"
          />
          <button class="btn-ghost icon-only input-action" @click="newMessage += '😊'">
            <span class="material-symbols-outlined">mood</span>
          </button>
          <button class="send-btn" @click="sendMessage" :disabled="!newMessage.trim()">
            <span class="material-symbols-outlined">send</span>
          </button>
        </div>
      </template>

      <div v-else class="chat-empty">
        <span class="material-symbols-outlined empty-icon">forum</span>
        <h3 class="text-headline-md" style="margin-top:1rem">Select a conversation</h3>
        <p class="text-body-md" style="margin-top:0.5rem">Choose a conversation from the list to start messaging.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useMessagingStore } from '@/store/messaging'
import { useAuthStore } from '@/store/auth'
import http from '@/services/http'

const messagingStore = useMessagingStore()
const authStore = useAuthStore()

const search     = ref('')
const newMessage = ref('')
const messagesEl = ref(null)
const showChatMenu = ref(false)
const chatImageInput = ref(null)

// Call state
const callActive = ref(false)
const callType = ref('voice') // 'voice' or 'video'
const callConnected = ref(false)
const callStatusText = ref('Calling...')
const callDuration = ref('00:00')
const isMuted = ref(false)
const isCameraOff = ref(false)
const isSpeaker = ref(false)
const incomingCall = ref(null)
let callTimer = null
let callSeconds = 0
let callTimeout = null

// WebRTC
let peerConnection = null
let localStream = null
const remoteAudio = ref(null)
const remoteVideoEl = ref(null)
const localVideoEl = ref(null)

const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ]
}

function createPeerConnection() {
  peerConnection = new RTCPeerConnection(rtcConfig)

  peerConnection.onicecandidate = (event) => {
    if (event.candidate && activeConv.value) {
      messagingStore.sendCallSignal('webrtc_ice', {
        to: activeConv.value.otherUserId || incomingCall.value?.from,
        candidate: JSON.stringify(event.candidate),
      })
    }
  }

  peerConnection.ontrack = (event) => {
    // Play remote audio/video
    if (callType.value === 'video' && remoteVideoEl.value) {
      remoteVideoEl.value.srcObject = event.streams[0]
    } else {
      const audio = new Audio()
      audio.srcObject = event.streams[0]
      audio.play().catch(() => {})
    }
  }

  peerConnection.onconnectionstatechange = () => {
    if (peerConnection.connectionState === 'connected') {
      callConnected.value = true
      callStatusText.value = 'Connected'
      startCallTimer()
    } else if (peerConnection.connectionState === 'disconnected' || peerConnection.connectionState === 'failed') {
      endCall()
    }
  }

  return peerConnection
}

async function getLocalAudio() {
  try {
    const constraints = {
      audio: true,
      video: callType.value === 'video' ? { width: 640, height: 480, facingMode: 'user' } : false,
    }
    localStream = await navigator.mediaDevices.getUserMedia(constraints)
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream)
    })
    // Show local video preview
    if (callType.value === 'video' && localVideoEl.value) {
      localVideoEl.value.srcObject = localStream
    }
  } catch (err) {
    console.error('Media access denied:', err)
    callStatusText.value = callType.value === 'video' ? 'Camera/Mic access denied' : 'Mic access denied'
    setTimeout(() => endCall(), 2000)
  }
}

function startCallTimer() {
  if (callTimeout) { clearTimeout(callTimeout); callTimeout = null }
  callTimer = setInterval(() => {
    callSeconds++
    const mins = Math.floor(callSeconds / 60).toString().padStart(2, '0')
    const secs = (callSeconds % 60).toString().padStart(2, '0')
    callDuration.value = `${mins}:${secs}`
  }, 1000)
}

async function startCall(type) {
  if (!activeConv.value) return
  callType.value = type
  callActive.value = true
  callConnected.value = false
  callStatusText.value = type === 'video' ? 'Video calling...' : 'Calling...'
  callDuration.value = '00:00'
  callSeconds = 0

  // Create peer connection and get mic
  createPeerConnection()
  await getLocalAudio()
  if (!localStream) return

  // Create offer
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)

  // Send call signal with offer
  const user = authStore.profile || authStore.user
  messagingStore.sendCallSignal('call_initiate', {
    to: activeConv.value.otherUserId,
    call_type: type,
    caller_name: user?.full_name || user?.name || 'User',
    caller_avatar: user?.avatar || '',
    offer: JSON.stringify(offer),
  })

  // Timeout
  callTimeout = setTimeout(() => {
    if (callActive.value && !callConnected.value) {
      callStatusText.value = 'No answer'
      setTimeout(() => endCall(), 1500)
    }
  }, 30000)
}

async function acceptIncomingCall() {
  if (!incomingCall.value) return
  callType.value = incomingCall.value.call_type || 'voice'
  callActive.value = true
  callStatusText.value = 'Connecting...'
  callSeconds = 0

  // Create peer connection and get mic
  createPeerConnection()
  await getLocalAudio()

  // Set remote offer
  if (incomingCall.value.offer) {
    const offer = JSON.parse(incomingCall.value.offer)
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))

    // Create answer
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)

    // Send answer back
    messagingStore.sendCallSignal('call_accept', {
      to: incomingCall.value.from,
      answer: JSON.stringify(answer),
    })
  } else {
    // Fallback if no offer (old signaling)
    messagingStore.sendCallSignal('call_accept', { to: incomingCall.value.from })
    callConnected.value = true
    callStatusText.value = 'Connected'
    startCallTimer()
  }

  incomingCall.value = null
}

function rejectIncomingCall() {
  if (!incomingCall.value) return
  messagingStore.sendCallSignal('call_reject', { to: incomingCall.value.from })
  incomingCall.value = null
}

function endCall() {
  if (activeConv.value) {
    messagingStore.sendCallSignal('call_end', { to: activeConv.value.otherUserId })
  }
  // Cleanup WebRTC
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop())
    localStream = null
  }
  if (peerConnection) {
    peerConnection.close()
    peerConnection = null
  }
  callActive.value = false
  callConnected.value = false
  incomingCall.value = null
  if (callTimer) { clearInterval(callTimer); callTimer = null }
  if (callTimeout) { clearTimeout(callTimeout); callTimeout = null }
  callSeconds = 0
}

// Listen for incoming call events
import { watch } from 'vue'

function toggleMute() {
  isMuted.value = !isMuted.value
  if (localStream) {
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !isMuted.value
    })
  }
}

function toggleCamera() {
  isCameraOff.value = !isCameraOff.value
  if (localStream) {
    localStream.getVideoTracks().forEach(track => {
      track.enabled = !isCameraOff.value
    })
  }
}

watch(() => messagingStore.callEvent, async (event) => {
  if (!event) return

  if (event.type === 'incoming_call') {
    incomingCall.value = event
  } else if (event.type === 'call_accepted') {
    // Set remote answer
    if (event.answer && peerConnection) {
      const answer = JSON.parse(event.answer)
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
    } else {
      callConnected.value = true
      callStatusText.value = 'Connected'
      startCallTimer()
    }
  } else if (event.type === 'webrtc_ice') {
    // Add ICE candidate
    if (event.candidate && peerConnection) {
      try {
        const candidate = JSON.parse(event.candidate)
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
      } catch { /* ignore */ }
    }
  } else if (event.type === 'call_rejected') {
    callStatusText.value = 'Call declined'
    setTimeout(() => endCall(), 1500)
  } else if (event.type === 'call_ended') {
    endCall()
  }
  messagingStore.clearCallEvent()
})

// Load conversations on mount
onMounted(() => {
  messagingStore.fetchConversations()
})

const filteredConvs = computed(() => {
  if (!search.value) return messagingStore.conversations
  return messagingStore.conversations.filter(c =>
    (c.name || '').toLowerCase().includes(search.value.toLowerCase())
  )
})

const activeConv = computed(() => messagingStore.activeConversation)
const activeMessages = computed(() => messagingStore.messages)
const conversations = computed(() => messagingStore.conversations)

function selectConv(conv) {
  messagingStore.setActiveConversation(conv)
  showChatMenu.value = false
  nextTick(() => {
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight
    }
  })
}

async function sendMessage() {
  if (!newMessage.value.trim() || !activeConv.value) return
  const text = newMessage.value.trim()
  newMessage.value = ''

  await messagingStore.sendMessage(text)

  nextTick(() => {
    if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  })
}

async function sendImage(e) {
  const file = e.target.files?.[0]
  if (!file || !activeConv.value) return
  try {
    const formData = new FormData()
    formData.append('file', file)
    const data = await http.post('/uploads/media', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    if (data.url) {
      await messagingStore.sendMessage(`[Image] ${data.url}`, 'image', data.url)
    }
  } catch { /* ignore */ }
  if (chatImageInput.value) chatImageInput.value.value = ''
}

async function deleteChat() {
  if (!activeConv.value) return
  await messagingStore.deleteConversation(activeConv.value.id)
  showChatMenu.value = false
}

function handleTyping() {
  messagingStore.sendTyping()
}

function pinCurrentChat() {
  if (activeConv.value) {
    messagingStore.pinChat(activeConv.value.id)
  }
  showChatMenu.value = false
}

function isCodeSnippet(content) {
  if (!content) return false
  return content.startsWith('```') || content.includes('\n```')
}

function extractCode(content) {
  if (!content) return ''
  return content.replace(/```\w*\n?/g, '').replace(/```$/g, '').trim()
}
</script>

<style scoped>
.messaging-view {
  display: flex;
  height: calc(100vh - 72px - 2 * var(--space-md));
  gap: 1rem;
  overflow: hidden;
}

/* Conversation Panel */
.conv-panel {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.conv-header { padding: 1.25rem 1.25rem 0.75rem; }

.conv-search {
  position: relative;
  padding: 0 1rem 0.75rem;
}
.search-icon {
  position: absolute;
  left: 1.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: var(--on-surface-variant);
  pointer-events: none;
  margin-top: -0.375rem;
}
.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--on-surface);
  outline: none;
}
.search-input:focus { border-color: var(--primary); }

.conv-list { flex: 1; overflow-y: auto; padding: 0 0.5rem 0.5rem; }

.conv-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition-fast);
}
.conv-item:hover { background: var(--surface-container-low); }
.conv-item.active { background: var(--primary-fixed); }

.conv-avatar {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: var(--surface-container);
  color: var(--primary);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.conv-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-full);
}
.online-dot {
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid var(--surface-container-lowest);
}

.conv-info { flex: 1; min-width: 0; }
.conv-top { display: flex; justify-content: space-between; align-items: center; }
.conv-name { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface); }
.conv-time { font-size: 0.7rem; color: var(--on-surface-variant); }
.conv-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 0.2rem; }
.conv-last { font-size: 0.8rem; color: var(--on-surface-variant); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
.unread-badge {
  min-width: 18px;
  height: 18px;
  border-radius: var(--radius-full);
  background: var(--primary);
  color: var(--on-primary);
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  flex-shrink: 0;
}

.empty-convs { display: flex; flex-direction: column; align-items: center; padding: 2rem; }

/* Chat Panel */
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 0.95rem;
  border-bottom: 1px solid var(--outline-variant);
  border-radius: 0;
  flex-wrap: wrap;
}

.back-btn {
  display: none;
  flex-shrink: 0;
}
@media (max-width: 767px) {
  .back-btn { display: flex; }
}

.chat-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--primary-fixed);
  color: var(--primary);
  font-family: var(--font-headline);
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chat-info {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.chat-name {
  font-family: var(--font-headline);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}
.chat-status {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-actions {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
  position: relative;
}

.chat-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 100;
  min-width: 200px;
  padding: 0.4rem;
  background: var(--surface-container-high);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 24px rgba(0,0,0,0.35);
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.chat-dropdown .dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.75rem;
  background: none;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-headline);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--on-surface);
  cursor: pointer;
  transition: background 0.12s;
}
.chat-dropdown .dropdown-item:hover { background: var(--surface-container); }

.hidden-input { display: none; }

/* Typing indicator */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
}
.typing-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--on-surface-variant);
  animation: typingBounce 1.4s infinite;
}
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }
.typing-text { font-size: 0.75rem; color: var(--on-surface-variant); margin-left: 0.3rem; }

@keyframes typingBounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
}

/* Message improvements */
.msg-media { margin-bottom: 0.3rem; }
.msg-image { max-width: 250px; border-radius: var(--radius-lg); }
.msg-edited { font-size: 0.65rem; color: var(--on-surface-variant); font-style: italic; }
.msg-footer { display: flex; align-items: center; gap: 0.25rem; justify-content: flex-end; margin-top: 0.15rem; }
.msg-read { font-size: 0.7rem; color: var(--primary); }
.msg-sent { font-size: 0.7rem; color: var(--on-surface-variant); }
.msg-bubble.deleted { opacity: 0.6; font-style: italic; }

/* Code snippets in messages */
.msg-code {
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-md);
  padding: 0.5rem 0.75rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.78rem;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--on-surface);
  margin: 0;
}

.input-action {
  padding: 0.4rem;
  color: var(--primary);
}

.icon-only { padding: 0.4rem; }

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.msg-row { display: flex; }
.msg-row.msg-mine { justify-content: flex-end; }

.msg-bubble {
  max-width: 70%;
  padding: 0.625rem 0.875rem;
  border-radius: var(--radius-xl);
  font-size: 0.875rem;
  line-height: 1.5;
  position: relative;
}

.bubble-theirs {
  background: var(--surface-container);
  color: var(--on-surface);
  border-bottom-left-radius: var(--radius-sm);
}

.bubble-mine {
  background: var(--primary);
  color: var(--on-primary);
  border-bottom-right-radius: var(--radius-sm);
}

.msg-time {
  display: block;
  font-size: 0.65rem;
  opacity: 0.7;
  margin-top: 0.25rem;
  text-align: right;
}

.chat-input-bar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--outline-variant);
  border-radius: 0;
}

.chat-input {
  flex: 1;
  min-width: 0;
  padding: 0.5rem 0.875rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--on-surface);
  outline: none;
}
.chat-input:focus { border-color: var(--primary); }

.send-btn {
  padding: 0.5rem;
  background: var(--primary);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s;
}
.send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.send-btn .material-symbols-outlined { font-size: 20px; }

.old-send-btn {
  padding: 0.625rem;
  border-radius: var(--radius-full);
  width: auto !important;
  min-width: 44px;
  flex-shrink: 0;
}
.send-btn .material-symbols-outlined { font-size: 20px; }

.chat-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}
.empty-icon { font-size: 4rem; color: var(--on-surface-variant); }

/* Mobile responsive */
@media (max-width: 767px) {
  .messaging-view { position: relative; }
  .conv-panel { width: 100%; position: absolute; inset: 0; z-index: 1; border-radius: var(--radius-xl); }
  .chat-panel { width: 100%; position: absolute; inset: 0; z-index: 2; border-radius: var(--radius-xl); }
  .hidden-mobile { display: none; }

  .chat-header {
    flex-wrap: nowrap;
    justify-content: flex-start;
    gap: 0.35rem;
  }
  .back-btn {
    padding: 0.45rem;
    min-width: auto;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 0.25rem;
  }
  .chat-info {
    min-width: 0;
    flex: 1 1 auto;
    overflow: hidden;
  }
  .chat-name,
  .chat-status {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .chat-actions {
    display: flex;
    gap: 0.25rem;
    margin-left: 0;
    flex-shrink: 0;
  }
  .icon-only {
    padding: 0.45rem;
  }
  .chat-input-bar {
    gap: 0.5rem;
  }
  .chat-input {
    min-width: 0;
  }
}

/* ── Call UI ── */
.call-btn:hover {
  color: var(--primary);
  background: rgba(168, 85, 247, 0.08);
}

.call-overlay {
  position: absolute;
  inset: 0;
  z-index: 50;
  background: linear-gradient(135deg, #1a0840 0%, #0d0520 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.call-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
}

.call-avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(168, 85, 247, 0.2);
  border: 3px solid rgba(168, 85, 247, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  animation: callPulse 2s ease-in-out infinite;
}

.call-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.call-initials {
  font-family: var(--font-headline);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary);
}

.call-name {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
}

.call-status-text {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
}

.call-timer {
  font-family: var(--font-mono, monospace);
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin-top: 0.5rem;
}

.call-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.call-control-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  transition: all 0.15s ease;
}

.call-control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.call-control-btn.active {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
  color: #ef4444;
}

.call-control-btn .material-symbols-outlined {
  font-size: 24px;
}

.call-end-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #ef4444;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  transition: all 0.15s ease;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
}

.call-end-btn:hover {
  background: #dc2626;
  transform: scale(1.05);
}

.call-end-btn .material-symbols-outlined {
  font-size: 28px;
}

@keyframes callPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.3); }
  50% { box-shadow: 0 0 0 20px rgba(168, 85, 247, 0); }
}

/* Call transition */
.call-fade-enter-active, .call-fade-leave-active {
  transition: opacity 0.3s ease;
}
.call-fade-enter-from, .call-fade-leave-to {
  opacity: 0;
}

/* Video call */
.video-call-container {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.remote-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.local-video {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 120px;
  height: 160px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  border: 2px solid rgba(255, 255, 255, 0.3);
  z-index: 5;
}

@media (max-width: 767px) {
  .local-video {
    width: 90px;
    height: 120px;
    top: 0.75rem;
    right: 0.75rem;
  }
}

.call-card-video {
  position: relative;
  z-index: 2;
  background: transparent;
}

.call-card-video .call-name,
.call-card-video .call-status-text,
.call-card-video .call-timer {
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.call-card-video .call-controls {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-full);
  padding: 0.75rem 1.5rem;
}

/* Incoming call */
.incoming-call-overlay {
  position: absolute;
  inset: 0;
  z-index: 60;
  background: linear-gradient(135deg, #1a0840 0%, #0d0520 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.incoming-call-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
}

.incoming-call-actions {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
}

.call-accept-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #22c55e;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  transition: all 0.15s ease;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.4);
  animation: callPulse 2s ease-in-out infinite;
}

.call-accept-btn:hover {
  background: #16a34a;
  transform: scale(1.05);
}

.call-accept-btn .material-symbols-outlined {
  font-size: 28px;
}
</style>
