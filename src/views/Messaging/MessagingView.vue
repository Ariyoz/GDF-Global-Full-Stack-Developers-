<template>
  <div class="messaging-view">
    <!-- Sidebar: Conversation List -->
    <div class="conv-panel" :class="{ 'hidden-mobile': !!activeConv }">
      <div class="conv-header">
        <h2 class="panel-title">Messages</h2>
        <span v-if="messagingStore.totalUnread" class="total-unread-badge">{{ messagingStore.totalUnread }}</span>
      </div>

      <!-- Search -->
      <div class="conv-search">
        <span class="material-symbols-outlined search-icon">search</span>
        <input v-model="search" class="search-input" placeholder="Search conversations…" />
      </div>

      <!-- Conversation list -->
      <div class="conv-list">
        <div v-for="conv in filteredConvs" :key="conv.id" class="conv-item"
          :class="{ active: activeConv?.id === conv.id, pinned: conv.pinned }"
          @click="selectConv(conv)">
          <div class="conv-avatar-wrap">
            <img v-if="conv.avatar" :src="conv.avatar" class="avatar-img" :alt="conv.name" />
            <span v-else class="avatar-initials">{{ (conv.name || 'U')[0] }}</span>
            <span v-if="conv.online" class="online-dot" />
          </div>
          <div class="conv-meta">
            <div class="conv-row1">
              <span class="conv-name">{{ conv.name }}</span>
              <span class="conv-time">{{ conv.time }}</span>
            </div>
            <div class="conv-row2">
              <span class="conv-preview">{{ conv.last_message_content || 'Start chatting…' }}</span>
              <span v-if="conv.unread_count" class="unread-dot">{{ conv.unread_count }}</span>
            </div>
          </div>
        </div>
        <div v-if="!filteredConvs.length && !messagingStore.loading" class="conv-empty">
          <span class="material-symbols-outlined">chat_bubble_outline</span>
          <p>No conversations yet</p>
        </div>
      </div>
    </div>

    <!-- Chat Panel -->
    <div class="chat-panel" :class="{ 'hidden-mobile': !activeConv }">
      <template v-if="activeConv">
        <!-- Header -->
        <div class="chat-header">
          <button class="back-btn btn-ghost" @click="messagingStore.setActiveConversation(null)">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div class="chat-avatar-wrap">
            <img v-if="activeConv.avatar" :src="activeConv.avatar" class="avatar-img" :alt="activeConv.name" />
            <span v-else class="avatar-initials">{{ (activeConv.name || 'U')[0] }}</span>
            <span v-if="activeConv.online" class="online-dot" />
          </div>
          <div class="chat-info">
            <span class="chat-name">{{ activeConv.name }}</span>
            <span class="chat-status" :class="activeConv.online ? 'status-online' : 'status-offline'">
              {{ activeConv.online ? 'Online' : 'Offline' }}
            </span>
          </div>
          <div class="chat-actions">
            <button class="btn-ghost icon-btn" @click="startCall('voice')" title="Voice call">
              <span class="material-symbols-outlined">call</span>
            </button>
            <button class="btn-ghost icon-btn" @click="startCall('video')" title="Video call">
              <span class="material-symbols-outlined">videocam</span>
            </button>
            <!-- Search toggle -->
            <button class="btn-ghost icon-btn" :class="{ active: showSearch }" @click="toggleSearch" title="Search messages">
              <span class="material-symbols-outlined">search</span>
            </button>
            <div class="more-menu-wrap">
              <button class="btn-ghost icon-btn" @click="showMenu = !showMenu">
                <span class="material-symbols-outlined">more_vert</span>
              </button>
              <div v-if="showMenu" class="chat-dropdown" v-click-outside="() => showMenu = false">
                <button class="dropdown-item" @click="messagingStore.pinChat(activeConv.id); showMenu = false">
                  <span class="material-symbols-outlined">push_pin</span>
                  {{ activeConv.pinned ? 'Unpin' : 'Pin' }} chat
                </button>
                <button class="dropdown-item danger" @click="deleteChat">
                  <span class="material-symbols-outlined">delete</span>Delete conversation
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- In-chat search -->
        <Transition name="slide-down">
          <div v-if="showSearch" class="in-chat-search">
            <input v-model="msgSearchQuery" class="msg-search-input" placeholder="Search messages…"
              @input="debounceSearch" @keydown.escape="closeSearch" autofocus />
            <button class="btn-ghost icon-btn" @click="closeSearch">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </Transition>

        <!-- Search results overlay -->
        <div v-if="showSearch && msgSearchQuery" class="search-results-overlay">
          <div v-if="messagingStore.isSearching" class="search-loading">Searching…</div>
          <div v-else-if="!messagingStore.searchResults.length" class="search-empty">No results</div>
          <div v-for="msg in messagingStore.searchResults" :key="msg.id" class="search-result-item"
            @click="scrollToMessage(msg.id)">
            <span class="search-result-content">{{ msg.content }}</span>
            <span class="search-result-time">{{ msg.time }}</span>
          </div>
        </div>

        <!-- Messages -->
        <div class="chat-messages" ref="messagesEl" @scroll="onScroll">
          <div v-if="messagingStore.loading" class="msgs-loading">
            <div v-for="i in 4" :key="i" class="skeleton-msg" :class="i % 2 ? 'right' : 'left'">
              <div class="skeleton-shimmer msg-skeleton-bubble"></div>
            </div>
          </div>

          <template v-for="(msg, idx) in messagingStore.messages" :key="msg.id">
            <!-- Date separator -->
            <div v-if="shouldShowDate(idx)" class="date-separator">
              <span>{{ formatDateSep(msg.created_at) }}</span>
            </div>

            <div :id="`msg-${msg.id}`" class="msg-row" :class="{ 'msg-mine': msg.mine }">
              <!-- Reply preview -->
              <div v-if="msg.reply_preview" class="reply-preview-bar">
                <div class="reply-line" />
                <div class="reply-preview-content">
                  <span class="reply-sender">{{ msg.reply_preview.sender_id === authStore.user?.id ? 'You' : activeConv.name }}</span>
                  <span class="reply-text">{{ msg.reply_preview.content }}</span>
                </div>
              </div>

              <div class="msg-bubble" :class="msg.mine ? 'bubble-mine' : 'bubble-theirs'"
                @contextmenu.prevent="openMsgMenu(msg, $event)">
                <!-- Deleted -->
                <span v-if="msg.is_deleted" class="deleted-text">This message was deleted</span>
                <template v-else>
                  <!-- Image attachment -->
                  <img v-if="msg.message_type === 'image' && msg.media_url" :src="msg.media_url"
                    class="msg-image" @click="openImagePreview(msg.media_url)" />
                  <!-- File attachment -->
                  <a v-else-if="msg.media_url && msg.file_name" :href="msg.media_url" target="_blank"
                    class="msg-file-attach">
                    <span class="material-symbols-outlined">description</span>
                    <span>{{ msg.file_name }}</span>
                  </a>
                  <!-- Code block -->
                  <pre v-else-if="isCode(msg.content)" class="msg-code"><code>{{ stripCodeFences(msg.content) }}</code></pre>
                  <!-- Rich text / link -->
                  <span v-else class="msg-text" v-html="renderMsgContent(msg.content)"></span>
                  <!-- Link preview card -->
                  <div v-if="msg.link_preview" class="link-preview-card">
                    <img v-if="msg.link_preview.image" :src="msg.link_preview.image" class="lp-image" />
                    <div class="lp-body">
                      <span class="lp-site">{{ msg.link_preview.site_name }}</span>
                      <span class="lp-title">{{ msg.link_preview.title }}</span>
                      <span class="lp-desc">{{ msg.link_preview.description }}</span>
                    </div>
                  </div>
                  <span v-if="msg.is_edited" class="edited-label">(edited)</span>
                </template>

                <!-- Footer: time + status -->
                <div class="msg-footer">
                  <span class="msg-time">{{ msg.time }}</span>
                  <span v-if="msg.mine" class="msg-status" :class="msg.status">
                    <span v-if="msg.status === 'seen'" class="material-symbols-outlined status-icon">done_all</span>
                    <span v-else-if="msg.status === 'delivered'" class="material-symbols-outlined status-icon">done_all</span>
                    <span v-else class="material-symbols-outlined status-icon">done</span>
                  </span>
                </div>

                <!-- Reactions display -->
                <div v-if="hasReactions(msg)" class="msg-reactions">
                  <button v-for="(users, emoji) in msg.reactions" :key="emoji"
                    v-show="users.length > 0"
                    class="reaction-pill" :class="{ 'mine-reaction': users.includes(authStore.user?.id) }"
                    @click="toggleReaction(msg, emoji)">
                    {{ emoji }} {{ users.length }}
                  </button>
                </div>
              </div>

              <!-- Quick reaction bar on hover -->
              <div class="quick-reactions" :class="msg.mine ? 'qr-left' : 'qr-right'">
                <button v-for="emoji in REACTIONS" :key="emoji" class="qr-btn"
                  @click="toggleReaction(msg, emoji)">{{ emoji }}</button>
                <button class="qr-btn" @click="setReplyTo(msg)">
                  <span class="material-symbols-outlined" style="font-size:14px">reply</span>
                </button>
              </div>
            </div>
          </template>

          <!-- Typing indicator -->
          <div v-if="messagingStore.isUserTyping(activeConv?.id)" class="typing-row">
            <div class="typing-bubble">
              <span class="typing-dot" /><span class="typing-dot" /><span class="typing-dot" />
            </div>
          </div>
        </div>

        <!-- Reply preview bar above input -->
        <Transition name="slide-up">
          <div v-if="replyTo" class="reply-to-bar">
            <div class="reply-to-info">
              <span class="material-symbols-outlined">reply</span>
              <span>Replying to <strong>{{ replyTo.sender_id === authStore.user?.id ? 'yourself' : activeConv.name }}</strong></span>
              <span class="reply-to-preview">{{ replyTo.content?.slice(0, 80) }}</span>
            </div>
            <button class="btn-ghost icon-btn" @click="replyTo = null">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </Transition>

        <!-- Input bar -->
        <div class="chat-input-bar">
          <button class="btn-ghost icon-btn input-icon" @click="triggerFileUpload" title="Attach file">
            <span class="material-symbols-outlined">attach_file</span>
          </button>
          <input ref="fileInput" type="file" class="hidden-input"
            accept="image/*,application/pdf,application/zip,application/x-rar-compressed,application/x-7z-compressed"
            @change="handleFileAttach" />
          <div class="input-wrap">
            <textarea v-model="newMessage" class="chat-input" rows="1"
              placeholder="Type a message…"
              @input="handleTyping()"
              @keydown.enter.exact.prevent="sendMessage"
              @keydown.enter.shift.exact="() => {}" />
          </div>
          <button class="send-btn" :disabled="!canSend" @click="sendMessage">
            <span class="material-symbols-outlined">send</span>
          </button>
        </div>
      </template>

      <!-- Empty state -->
      <div v-else class="chat-empty">
        <span class="material-symbols-outlined empty-icon">forum</span>
        <h3>Select a conversation</h3>
        <p>Choose from your conversations to start messaging</p>
      </div>
    </div>

    <!-- Message context menu -->
    <Teleport to="body">
      <div v-if="msgMenu.show" class="ctx-menu" :style="{ top: msgMenu.y + 'px', left: msgMenu.x + 'px' }"
        v-click-outside="() => msgMenu.show = false">
        <button class="ctx-item" @click="setReplyTo(msgMenu.msg); msgMenu.show = false">
          <span class="material-symbols-outlined">reply</span> Reply
        </button>
        <button class="ctx-item" v-if="msgMenu.msg?.mine" @click="startEdit(msgMenu.msg); msgMenu.show = false">
          <span class="material-symbols-outlined">edit</span> Edit
        </button>
        <button class="ctx-item danger" v-if="msgMenu.msg?.mine" @click="messagingStore.deleteMessage(msgMenu.msg.id); msgMenu.show = false">
          <span class="material-symbols-outlined">delete</span> Delete
        </button>
      </div>
    </Teleport>

    <!-- Image preview lightbox -->
    <Teleport to="body">
      <div v-if="previewImg" class="lightbox" @click="previewImg = null">
        <img :src="previewImg" class="lightbox-img" />
      </div>
    </Teleport>

    <!-- Incoming call overlay -->
    <Transition name="modal">
      <div v-if="incomingCall" class="call-overlay">
        <div class="call-card">
          <div class="call-avatar">
            <img v-if="incomingCall.caller_avatar" :src="incomingCall.caller_avatar" class="avatar-img" />
            <span v-else>{{ (incomingCall.caller_name || 'U')[0] }}</span>
          </div>
          <h3>{{ incomingCall.caller_name }}</h3>
          <p>Incoming {{ incomingCall.call_type }} call…</p>
          <div class="call-btns">
            <button class="call-reject" @click="rejectCall"><span class="material-symbols-outlined">call_end</span></button>
            <button class="call-accept" @click="acceptCall"><span class="material-symbols-outlined">call</span></button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useMessagingStore } from '@/store/messaging'
import { useAuthStore } from '@/store/auth'

const messagingStore = useMessagingStore()
const authStore = useAuthStore()

const REACTIONS = ['👍', '❤️', '🚀', '🔥', '😂', '😮']

const search = ref('')
const newMessage = ref('')
const messagesEl = ref(null)
const fileInput = ref(null)
const showMenu = ref(false)
const showSearch = ref(false)
const msgSearchQuery = ref('')
const replyTo = ref(null)
const previewImg = ref(null)
const incomingCall = ref(null)
const msgMenu = ref({ show: false, x: 0, y: 0, msg: null })

let typingTimeout = null
let searchTimeout = null

const activeConv = computed(() => messagingStore.activeConversation)

const filteredConvs = computed(() => {
  const q = search.value.toLowerCase()
  return messagingStore.conversations.filter(c =>
    !q || (c.name || '').toLowerCase().includes(q)
  )
})

const canSend = computed(() => newMessage.value.trim().length > 0)

function shouldShowDate(idx) {
  if (idx === 0) return true
  const msgs = messagingStore.messages
  const a = new Date(msgs[idx - 1]?.created_at).toDateString()
  const b = new Date(msgs[idx]?.created_at).toDateString()
  return a !== b
}

function formatDateSep(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Today'
  const yest = new Date(); yest.setDate(yest.getDate() - 1)
  if (d.toDateString() === yest.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function isCode(content) {
  return content && (content.startsWith('```') || /\n```/.test(content))
}

function stripCodeFences(content) {
  return (content || '').replace(/```[\w]*\n?/g, '').replace(/```$/g, '').trim()
}

function renderMsgContent(text) {
  if (!text) return ''
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return escaped.replace(/(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="msg-link">$1</a>')
}

function hasReactions(msg) {
  return msg.reactions && Object.values(msg.reactions).some(users => users.length > 0)
}

function openMsgMenu(msg, e) {
  msgMenu.value = { show: true, x: e.clientX, y: e.clientY, msg }
}

function setReplyTo(msg) {
  replyTo.value = msg
}

function toggleSearch() {
  showSearch.value = !showSearch.value
  if (!showSearch.value) {
    msgSearchQuery.value = ''
    messagingStore.searchResults.splice(0)
  }
}

function closeSearch() {
  showSearch.value = false
  msgSearchQuery.value = ''
}

function debounceSearch() {
  clearTimeout(searchTimeout)
  if (!msgSearchQuery.value.trim()) return
  searchTimeout = setTimeout(() => {
    messagingStore.searchMessages(msgSearchQuery.value)
  }, 400)
}

function scrollToMessage(msgId) {
  const el = document.getElementById(`msg-${msgId}`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  showSearch.value = false
}

async function toggleReaction(msg, emoji) {
  if (!activeConv.value) return
  await messagingStore.reactToMessage(activeConv.value.id, msg.id, emoji)
}

function openImagePreview(url) {
  previewImg.value = url
}

function triggerFileUpload() {
  fileInput.value?.click()
}

async function handleFileAttach(e) {
  const file = e.target.files?.[0]
  if (!file || !activeConv.value) return
  try {
    const result = await messagingStore.uploadAttachment(file)
    await messagingStore.sendMessage({
      content: '',
      message_type: result.is_image ? 'image' : 'file',
      media_url: result.url,
      file_name: result.file_name,
      file_size: result.file_size,
      file_type: result.file_type,
      reply_to_id: replyTo.value?.id || null,
    })
    replyTo.value = null
  } catch (err) {
    console.error('Attach failed:', err)
  }
  if (fileInput.value) fileInput.value.value = ''
}

function handleTyping() {
  messagingStore.sendTyping()
  clearTimeout(typingTimeout)
  typingTimeout = setTimeout(() => messagingStore.sendStopTyping(), 2000)
}

async function sendMessage() {
  const content = newMessage.value.trim()
  if (!content) return
  newMessage.value = ''
  clearTimeout(typingTimeout)
  messagingStore.sendStopTyping()
  await messagingStore.sendMessage({
    content,
    message_type: 'text',
    reply_to_id: replyTo.value?.id || null,
  })
  replyTo.value = null
  scrollBottom()
}

function scrollBottom() {
  nextTick(() => {
    if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  })
}

function onScroll() {
  // Load older messages when scrolled to top
  if (messagesEl.value?.scrollTop === 0 && !messagingStore.loading) {
    const currentPage = Math.ceil(messagingStore.messages.length / 50) + 1
    if (activeConv.value) messagingStore.fetchMessages(activeConv.value.id, currentPage)
  }
}

function selectConv(conv) {
  messagingStore.setActiveConversation(conv)
  showMenu.value = false
  showSearch.value = false
  replyTo.value = null
  scrollBottom()
}

async function deleteChat() {
  if (!activeConv.value) return
  await messagingStore.deleteConversation(activeConv.value.id)
  showMenu.value = false
}

function startEdit(msg) {
  newMessage.value = msg.content || ''
}

function startCall(type) {
  // Re-use existing WS call signalling
  messagingStore.sendCallSignal('call_initiate', {
    to: activeConv.value?.other_user_id,
    call_type: type,
    caller_name: authStore.profile?.full_name || 'User',
    caller_avatar: authStore.profile?.avatar || '',
  })
}

function rejectCall() {
  if (incomingCall.value) {
    messagingStore.sendCallSignal('call_reject', { to: incomingCall.value.from })
    incomingCall.value = null
  }
}

function acceptCall() {
  if (incomingCall.value) {
    messagingStore.sendCallSignal('call_accept', { to: incomingCall.value.from })
    incomingCall.value = null
  }
}

// Watch for incoming call events
watch(() => messagingStore.callEvent, (event) => {
  if (!event) return
  if (event.type === 'incoming_call') incomingCall.value = event
  else if (['call_ended', 'call_rejected'].includes(event.type)) incomingCall.value = null
  messagingStore.clearCallEvent()
})

watch(() => messagingStore.messages.length, () => scrollBottom())

onMounted(() => {
  messagingStore.fetchConversations()
})
</script>

<style scoped>
.messaging-view { display:flex; height:calc(100vh - 72px); gap:0; overflow:hidden; }
.conv-panel { width:300px; flex-shrink:0; display:flex; flex-direction:column; background:var(--surface-container-lowest); border-right:1px solid var(--outline-variant); }
.conv-header { display:flex; align-items:center; gap:0.5rem; padding:1rem 1rem 0.5rem; }
.panel-title { font-family:var(--font-headline); font-size:1.1rem; font-weight:700; color:var(--on-surface); flex:1; }
.total-unread-badge { background:var(--primary); color:#fff; font-size:0.7rem; font-weight:700; min-width:20px; height:20px; border-radius:10px; display:flex; align-items:center; justify-content:center; padding:0 5px; }
.conv-search { position:relative; padding:0 0.75rem 0.5rem; }
.search-icon { position:absolute; left:1.35rem; top:50%; transform:translateY(-60%); font-size:18px; color:var(--on-surface-variant); pointer-events:none; }
.search-input { width:100%; padding:0.45rem 0.75rem 0.45rem 2.25rem; background:var(--surface-container); border:1px solid var(--outline-variant); border-radius:var(--radius-full); font-size:0.82rem; color:var(--on-surface); outline:none; }
.search-input:focus { border-color:var(--primary); }
.conv-list { flex:1; overflow-y:auto; }
.conv-item { display:flex; align-items:center; gap:0.65rem; padding:0.7rem 0.75rem; cursor:pointer; transition:background 0.12s; }
.conv-item:hover { background:var(--surface-container-low); }
.conv-item.active { background:color-mix(in srgb, var(--primary) 10%, transparent); }
.conv-avatar-wrap { position:relative; width:42px; height:42px; border-radius:50%; background:var(--primary-fixed); display:flex; align-items:center; justify-content:center; flex-shrink:0; overflow:hidden; }
.avatar-img { width:100%; height:100%; object-fit:cover; border-radius:50%; }
.avatar-initials { font-family:var(--font-headline); font-size:0.9rem; font-weight:700; color:var(--primary); }
.online-dot { position:absolute; bottom:1px; right:1px; width:10px; height:10px; border-radius:50%; background:#22c55e; border:2px solid var(--surface-container-lowest); }
.conv-meta { flex:1; min-width:0; }
.conv-row1 { display:flex; justify-content:space-between; align-items:center; }
.conv-name { font-size:0.85rem; font-weight:600; color:var(--on-surface); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.conv-time { font-size:0.68rem; color:var(--on-surface-variant); flex-shrink:0; margin-left:0.3rem; }
.conv-row2 { display:flex; justify-content:space-between; align-items:center; margin-top:0.15rem; }
.conv-preview { font-size:0.78rem; color:var(--on-surface-variant); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:170px; }
.unread-dot { min-width:18px; height:18px; border-radius:9px; background:var(--primary); color:#fff; font-size:0.65rem; font-weight:700; display:flex; align-items:center; justify-content:center; padding:0 4px; flex-shrink:0; }
.conv-empty { display:flex; flex-direction:column; align-items:center; gap:0.5rem; padding:2.5rem 1rem; color:var(--on-surface-variant); font-size:0.85rem; }
.conv-empty .material-symbols-outlined { font-size:2rem; }

/* Chat panel */
.chat-panel { flex:1; display:flex; flex-direction:column; overflow:hidden; background:var(--surface-container-lowest); }
.chat-header { display:flex; align-items:center; gap:0.5rem; padding:0.75rem 1rem; border-bottom:1px solid var(--outline-variant); flex-shrink:0; }
.back-btn { display:none; }
@media(max-width:767px) { .back-btn { display:flex; } .conv-panel { width:100%; } .hidden-mobile { display:none !important; } }
.chat-avatar-wrap { position:relative; width:36px; height:36px; border-radius:50%; background:var(--primary-fixed); display:flex; align-items:center; justify-content:center; flex-shrink:0; overflow:hidden; }
.chat-info { flex:1; min-width:0; }
.chat-name { font-size:0.9rem; font-weight:600; color:var(--on-surface); display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.chat-status { font-size:0.72rem; }
.status-online { color:#22c55e; }
.status-offline { color:var(--on-surface-variant); }
.chat-actions { display:flex; gap:0.2rem; align-items:center; }
.icon-btn { width:36px; height:36px; display:flex; align-items:center; justify-content:center; border-radius:50%; }
.icon-btn.active { background:color-mix(in srgb, var(--primary) 12%, transparent); color:var(--primary); }
.more-menu-wrap { position:relative; }
.chat-dropdown { position:absolute; top:calc(100% + 4px); right:0; z-index:200; min-width:190px; background:var(--surface-container-high); border:1px solid var(--outline-variant); border-radius:var(--radius-lg); box-shadow:0 8px 24px rgba(0,0,0,0.3); padding:0.3rem; display:flex; flex-direction:column; }
.dropdown-item { display:flex; align-items:center; gap:0.6rem; padding:0.5rem 0.75rem; border:none; background:none; border-radius:var(--radius-md); font-size:0.82rem; font-weight:500; color:var(--on-surface); cursor:pointer; }
.dropdown-item:hover { background:var(--surface-container); }
.dropdown-item.danger { color:#ef4444; }

.in-chat-search { display:flex; align-items:center; gap:0.5rem; padding:0.5rem 1rem; border-bottom:1px solid var(--outline-variant); background:var(--surface-container-low); flex-shrink:0; }
.msg-search-input { flex:1; padding:0.4rem 0.75rem; background:var(--surface-container); border:1px solid var(--outline-variant); border-radius:var(--radius-full); font-size:0.85rem; color:var(--on-surface); outline:none; }
.msg-search-input:focus { border-color:var(--primary); }
.search-results-overlay { position:absolute; z-index:100; left:300px; right:0; top:140px; max-height:300px; overflow-y:auto; background:var(--surface-container-high); border:1px solid var(--outline-variant); border-radius:var(--radius-lg); box-shadow:0 8px 24px rgba(0,0,0,0.3); }
.search-loading, .search-empty { padding:1rem; text-align:center; color:var(--on-surface-variant); font-size:0.85rem; }
.search-result-item { display:flex; justify-content:space-between; align-items:center; padding:0.65rem 1rem; cursor:pointer; border-bottom:1px solid var(--outline-variant); }
.search-result-item:hover { background:var(--surface-container); }
.search-result-content { font-size:0.83rem; color:var(--on-surface); flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.search-result-time { font-size:0.7rem; color:var(--on-surface-variant); flex-shrink:0; margin-left:0.5rem; }

/* Messages */
.chat-messages { flex:1; overflow-y:auto; padding:1rem; display:flex; flex-direction:column; gap:0.5rem; scroll-behavior:smooth; }
.date-separator { display:flex; align-items:center; justify-content:center; margin:0.5rem 0; }
.date-separator span { font-size:0.72rem; color:var(--on-surface-variant); background:var(--surface-container); padding:0.2rem 0.75rem; border-radius:var(--radius-full); }
.msg-row { display:flex; flex-direction:column; max-width:72%; gap:0.15rem; position:relative; }
.msg-row:hover .quick-reactions { opacity:1; }
.msg-mine { align-self:flex-end; align-items:flex-end; }
.msg-bubble { padding:0.6rem 0.85rem; border-radius:var(--radius-xl); font-size:0.875rem; line-height:1.5; position:relative; word-break:break-word; }
.bubble-theirs { background:var(--surface-container); color:var(--on-surface); border-bottom-left-radius:4px; }
.bubble-mine { background:var(--primary); color:#fff; border-bottom-right-radius:4px; }
.bubble-mine .msg-link { color:#fff; text-decoration:underline; }
.bubble-theirs .msg-link { color:var(--primary); text-decoration:underline; }
.msg-image { max-width:240px; max-height:240px; border-radius:var(--radius-lg); object-fit:cover; cursor:pointer; display:block; margin-bottom:0.25rem; }
.msg-file-attach { display:flex; align-items:center; gap:0.4rem; font-size:0.82rem; text-decoration:none; }
.bubble-mine .msg-file-attach { color:#fff; }
.bubble-theirs .msg-file-attach { color:var(--primary); }
.msg-code { font-family:'JetBrains Mono','Fira Code',monospace; font-size:0.78rem; background:rgba(0,0,0,0.15); border-radius:var(--radius-md); padding:0.5rem; white-space:pre-wrap; word-break:break-all; margin:0; }
.edited-label { font-size:0.65rem; opacity:0.7; font-style:italic; margin-left:0.25rem; }
.deleted-text { font-size:0.82rem; font-style:italic; opacity:0.6; }
.msg-footer { display:flex; align-items:center; gap:0.2rem; justify-content:flex-end; margin-top:0.2rem; }
.msg-time { font-size:0.62rem; opacity:0.7; }
.status-icon { font-size:14px; }
.msg-status.seen .status-icon { color:color-mix(in srgb, var(--primary) 50%, #fff); }
.bubble-mine .msg-status.seen .status-icon { color:#ddd6fe; }
.msg-reactions { display:flex; flex-wrap:wrap; gap:0.25rem; margin-top:0.25rem; }
.reaction-pill { padding:0.2rem 0.5rem; border-radius:var(--radius-full); background:var(--surface-container); border:1px solid var(--outline-variant); font-size:0.78rem; cursor:pointer; transition:background 0.12s; }
.reaction-pill.mine-reaction { background:color-mix(in srgb, var(--primary) 15%, transparent); border-color:var(--primary); }
.quick-reactions { display:flex; gap:0.2rem; opacity:0; transition:opacity 0.15s; padding:0.2rem 0; }
.qr-left { order:-1; margin-right:0.3rem; }
.qr-right { margin-left:0.3rem; }
.qr-btn { width:28px; height:28px; border-radius:50%; background:var(--surface-container-high); border:1px solid var(--outline-variant); font-size:0.85rem; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.qr-btn:hover { background:var(--surface-container); }

/* Reply preview inside bubble */
.reply-preview-bar { display:flex; align-items:stretch; gap:0.5rem; margin-bottom:0.35rem; }
.reply-line { width:3px; border-radius:2px; background:var(--primary); flex-shrink:0; }
.reply-preview-content { display:flex; flex-direction:column; gap:0.1rem; min-width:0; }
.reply-sender { font-size:0.72rem; font-weight:700; color:var(--primary); }
.reply-text { font-size:0.78rem; color:var(--on-surface-variant); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

/* Link preview */
.link-preview-card { margin-top:0.4rem; border-radius:var(--radius-lg); overflow:hidden; border:1px solid var(--outline-variant); background:var(--surface-container-low); max-width:280px; }
.lp-image { width:100%; height:120px; object-fit:cover; display:block; }
.lp-body { padding:0.5rem 0.65rem; display:flex; flex-direction:column; gap:0.15rem; }
.lp-site { font-size:0.65rem; text-transform:uppercase; color:var(--on-surface-variant); }
.lp-title { font-size:0.82rem; font-weight:600; color:var(--on-surface); line-height:1.3; }
.lp-desc { font-size:0.75rem; color:var(--on-surface-variant); line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

/* Typing indicator */
.typing-row { align-self:flex-start; }
.typing-bubble { display:flex; align-items:center; gap:4px; padding:0.5rem 0.85rem; background:var(--surface-container); border-radius:var(--radius-xl); border-bottom-left-radius:4px; }
.typing-dot { width:6px; height:6px; border-radius:50%; background:var(--on-surface-variant); animation:tdot 1.4s infinite; }
.typing-dot:nth-child(2) { animation-delay:0.2s; }
.typing-dot:nth-child(3) { animation-delay:0.4s; }
@keyframes tdot { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-5px); } }

/* Reply-to bar */
.reply-to-bar { display:flex; align-items:center; gap:0.5rem; padding:0.5rem 1rem; background:var(--surface-container-low); border-top:1px solid var(--outline-variant); flex-shrink:0; }
.reply-to-info { flex:1; display:flex; align-items:center; gap:0.5rem; min-width:0; font-size:0.8rem; color:var(--on-surface-variant); }
.reply-to-info strong { color:var(--primary); }
.reply-to-preview { color:var(--on-surface-variant); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

/* Input bar */
.chat-input-bar { display:flex; align-items:flex-end; gap:0.4rem; padding:0.65rem 0.75rem; border-top:1px solid var(--outline-variant); flex-shrink:0; }
.input-icon { flex-shrink:0; }
.input-wrap { flex:1; }
.chat-input { width:100%; padding:0.5rem 0.75rem; background:var(--surface-container-low); border:1px solid var(--outline-variant); border-radius:var(--radius-xl); font-size:0.875rem; color:var(--on-surface); outline:none; resize:none; max-height:120px; font-family:var(--font-body); line-height:1.5; }
.chat-input:focus { border-color:var(--primary); }
.hidden-input { display:none; }
.send-btn { width:38px; height:38px; border-radius:50%; background:var(--primary); color:#fff; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; transition:opacity 0.15s; }
.send-btn:disabled { opacity:0.4; cursor:not-allowed; }

.chat-empty { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.75rem; color:var(--on-surface-variant); }
.empty-icon { font-size:3.5rem; }

/* Skeleton */
.msgs-loading { display:flex; flex-direction:column; gap:0.75rem; }
.skeleton-msg { display:flex; }
.skeleton-msg.right { justify-content:flex-end; }
.msg-skeleton-bubble { width:180px; height:44px; border-radius:var(--radius-xl); background:linear-gradient(90deg,var(--surface-container) 25%,var(--surface-container-high) 50%,var(--surface-container) 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; }
@keyframes shimmer { 0% { background-position:200% 0; } 100% { background-position:-200% 0; } }

/* Context menu */
.ctx-menu { position:fixed; z-index:1000; background:var(--surface-container-high); border:1px solid var(--outline-variant); border-radius:var(--radius-lg); box-shadow:0 8px 24px rgba(0,0,0,0.35); padding:0.3rem; min-width:160px; }
.ctx-item { display:flex; align-items:center; gap:0.6rem; padding:0.5rem 0.75rem; border:none; background:none; border-radius:var(--radius-md); font-size:0.82rem; font-weight:500; color:var(--on-surface); cursor:pointer; width:100%; text-align:left; }
.ctx-item:hover { background:var(--surface-container); }
.ctx-item.danger { color:#ef4444; }

/* Lightbox */
.lightbox { position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:2000; display:flex; align-items:center; justify-content:center; cursor:zoom-out; }
.lightbox-img { max-width:90vw; max-height:90vh; border-radius:var(--radius-lg); object-fit:contain; }

/* Call overlay */
.call-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.65); z-index:3000; display:flex; align-items:center; justify-content:center; }
.call-card { background:var(--surface-container-highest); border-radius:var(--radius-2xl); padding:2rem 2.5rem; display:flex; flex-direction:column; align-items:center; gap:0.75rem; min-width:280px; }
.call-avatar { width:72px; height:72px; border-radius:50%; background:var(--primary-fixed); display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:700; color:var(--primary); overflow:hidden; }
.call-btns { display:flex; gap:1.5rem; margin-top:0.5rem; }
.call-reject { width:56px; height:56px; border-radius:50%; background:#ef4444; border:none; color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.2rem; }
.call-accept { width:56px; height:56px; border-radius:50%; background:#22c55e; border:none; color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.2rem; }

/* Transitions */
.slide-down-enter-active, .slide-down-leave-active { transition:all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { transform:translateY(-10px); opacity:0; }
.slide-up-enter-active, .slide-up-leave-active { transition:all 0.18s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform:translateY(8px); opacity:0; }
.modal-enter-active, .modal-leave-active { transition:opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity:0; }
</style>
