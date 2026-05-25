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
            <button class="btn-ghost icon-only" @click="showChatMenu = !showChatMenu">
              <span class="material-symbols-outlined">more_vert</span>
            </button>
            <div v-if="showChatMenu" class="chat-dropdown">
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

        <div class="chat-messages" ref="messagesEl">
          <div
            v-for="msg in activeMessages"
            :key="msg.id"
            class="msg-row"
            :class="{ 'msg-mine': msg.mine }"
          >
            <div class="msg-bubble" :class="msg.mine ? 'bubble-mine' : 'bubble-theirs'">
              {{ msg.content || msg.text }}
              <span class="msg-time">{{ msg.time }}</span>
            </div>
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
  // Remove from local list
  const convId = activeConv.value.id
  messagingStore.conversations = messagingStore.conversations.filter(c => c.id !== convId)
  messagingStore.setActiveConversation(null)
  showChatMenu.value = false
  // TODO: Call backend delete endpoint when available
}

function handleTyping() {
  messagingStore.sendTyping()
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
</style>
