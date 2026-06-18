<template>
  <div class="messaging-view">

    <!-- ═══════════════════════════════════════════════
         SIDEBAR: Conversations
    ═══════════════════════════════════════════════ -->
    <div class="conv-panel" :class="{ 'hidden-mobile': !!activeConv }">
      <div class="conv-header">
        <h2 class="panel-title">Messages</h2>
        <span v-if="messagingStore.totalUnread > 0" class="total-badge">{{ messagingStore.totalUnread }}</span>
      </div>

      <div class="conv-search-wrap">
        <span class="material-symbols-outlined si">search</span>
        <input v-model="search" class="conv-search-input" placeholder="Search…" />
      </div>

      <div class="conv-list">
        <div v-for="conv in filteredConvs" :key="conv.id"
          class="conv-item" :class="{ active: activeConv?.id === conv.id }"
          @click="selectConv(conv)">
          <div class="c-avatar">
            <img v-if="conv.avatar" :src="conv.avatar" class="c-avatar-img" />
            <span v-else class="c-avatar-txt">{{ (conv.name||'?')[0].toUpperCase() }}</span>
            <span v-if="conv.online" class="c-online" />
          </div>
          <div class="c-info">
            <div class="c-row1">
              <span class="c-name">{{ conv.name }}</span>
              <span class="c-time">{{ conv.time }}</span>
            </div>
            <div class="c-row2">
              <span class="c-preview">{{ conv.last_message_content || 'Tap to chat' }}</span>
              <span v-if="conv.unread_count > 0" class="c-badge">{{ conv.unread_count }}</span>
            </div>
          </div>
        </div>
        <div v-if="!filteredConvs.length" class="conv-empty">
          <span class="material-symbols-outlined" style="font-size:2rem">chat_bubble_outline</span>
          <p>No conversations yet</p>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════
         CHAT PANEL
    ═══════════════════════════════════════════════ -->
    <div class="chat-panel" :class="{ 'hidden-mobile': !activeConv }">
      <template v-if="activeConv">

        <!-- Header -->
        <div class="chat-header">
          <button class="icon-btn back-btn" @click="messagingStore.setActiveConversation(null)">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div class="ch-avatar">
            <img v-if="activeConv.avatar" :src="activeConv.avatar" class="c-avatar-img" />
            <span v-else class="c-avatar-txt">{{ (activeConv.name||'?')[0].toUpperCase() }}</span>
            <span v-if="activeConv.online" class="c-online" />
          </div>
          <div class="ch-info" @click="activeConv.online && null">
            <span class="ch-name">{{ activeConv.name }}</span>
            <span class="ch-status" :class="activeConv.online ? 'online' : 'offline'">
              {{ messagingStore.isUserTyping(activeConv?.id) ? 'typing…' : activeConv.online ? 'online' : 'offline' }}
            </span>
          </div>
          <div class="ch-actions">
            <button class="icon-btn" @click="startCall('voice')"><span class="material-symbols-outlined">call</span></button>
            <button class="icon-btn" @click="startCall('video')"><span class="material-symbols-outlined">videocam</span></button>
            <button class="icon-btn" :class="{ active: showSearch }" @click="toggleSearch">
              <span class="material-symbols-outlined">search</span>
            </button>
            <div class="more-wrap">
              <button class="icon-btn" @click="showMenu = !showMenu">
                <span class="material-symbols-outlined">more_vert</span>
              </button>
              <Transition name="drop">
                <div v-if="showMenu" class="dropdown" v-click-outside="() => showMenu = false">
                  <button class="drop-item" @click="messagingStore.pinChat(activeConv.id); showMenu=false">
                    <span class="material-symbols-outlined">push_pin</span>{{ activeConv.pinned ? 'Unpin' : 'Pin' }}
                  </button>
                  <button class="drop-item danger" @click="deleteChat">
                    <span class="material-symbols-outlined">delete</span>Delete chat
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Search bar -->
        <Transition name="slide-down">
          <div v-if="showSearch" class="search-bar">
            <span class="material-symbols-outlined si">search</span>
            <input v-model="msgSearchQuery" class="search-bar-input" placeholder="Search messages…"
              @input="debounceSearch" @keydown.escape="closeSearch" autofocus />
            <button v-if="msgSearchQuery" class="icon-btn" @click="msgSearchQuery = ''; messagingStore.searchMessages('')">
              <span class="material-symbols-outlined" style="font-size:18px">close</span>
            </button>
            <span class="search-count" v-if="messagingStore.searchResults.length">
              {{ messagingStore.searchResults.length }} result(s)
            </span>
          </div>
        </Transition>

        <!-- Messages list -->
        <div class="msgs-area" ref="messagesEl" @scroll="onScroll" @click="closeAllMenus">
          <!-- Skeleton loading -->
          <template v-if="messagingStore.loading && !messagingStore.messages.length">
            <div v-for="i in 5" :key="i" class="skeleton-row" :class="i%2?'sr-right':'sr-left'">
              <div class="skeleton-bubble shimmer"></div>
            </div>
          </template>

          <template v-for="(msg, idx) in messagingStore.messages" :key="msg.id">
            <!-- Date separator -->
            <div v-if="shouldShowDate(idx)" class="date-sep">
              <span>{{ formatDateSep(msg.created_at) }}</span>
            </div>

            <!-- Message row -->
            <div :id="`msg-${msg.id}`" class="msg-row" :class="{ mine: msg.mine }"
              @click.stop
              @contextmenu.prevent="openCtx(msg, $event)"
              @touchstart="onTouchStart(msg, $event)"
              @touchend="onTouchEnd">

              <!-- Sender avatar (others only) -->
              <div v-if="!msg.mine" class="msg-avatar">
                <img v-if="activeConv.avatar" :src="activeConv.avatar" class="c-avatar-img small" />
                <span v-else class="c-avatar-txt small">{{ (activeConv.name||'?')[0].toUpperCase() }}</span>
              </div>

              <div class="msg-col">
                <!-- Reply preview inside bubble -->
                <div v-if="msg.reply_preview && !msg.is_deleted" class="reply-snap"
                  :class="msg.mine ? 'reply-snap-mine' : 'reply-snap-theirs'"
                  @click.stop="scrollToMessage(msg.reply_preview.id)">
                  <div class="reply-snap-bar" />
                  <div class="reply-snap-content">
                    <span class="reply-snap-who">{{ msg.reply_preview.sender_id === authStore.user?.id ? 'You' : activeConv.name }}</span>
                    <span class="reply-snap-text">{{ msg.reply_preview.content }}</span>
                    <img v-if="msg.reply_preview.media_url" :src="msg.reply_preview.media_url" class="reply-snap-img" />
                  </div>
                </div>

                <!-- Bubble -->
                <div class="bubble" :class="[msg.mine ? 'bubble-mine' : 'bubble-theirs', { 'bubble-deleted': msg.is_deleted }]">
                  <!-- Deleted -->
                  <span v-if="msg.is_deleted" class="deleted-label">
                    <span class="material-symbols-outlined" style="font-size:14px;vertical-align:-2px">block</span>
                    This message was deleted
                  </span>

                  <template v-else>
                    <!-- Image -->
                    <div v-if="msg.message_type === 'image' && msg.media_url" class="bubble-img-wrap">
                      <img :src="msg.media_url" class="bubble-img" @click.stop="lightboxUrl = msg.media_url" />
                    </div>

                    <!-- File -->
                    <a v-else-if="msg.media_url && msg.file_name"
                      :href="msg.media_url" target="_blank" class="file-chip"
                      :class="msg.mine ? 'file-mine' : 'file-theirs'">
                      <div class="file-icon">
                        <span class="material-symbols-outlined">description</span>
                      </div>
                      <div class="file-meta">
                        <span class="file-name">{{ msg.file_name }}</span>
                        <span class="file-size" v-if="msg.file_size">{{ formatFileSize(msg.file_size) }}</span>
                      </div>
                      <span class="material-symbols-outlined file-dl">download</span>
                    </a>

                    <!-- Text -->
                    <p v-else-if="msg.content" class="bubble-text" v-html="renderText(msg.content)" />

                    <span v-if="msg.is_edited" class="edited-tag">edited</span>
                  </template>

                  <!-- Footer -->
                  <div class="bubble-footer">
                    <span class="btime">{{ msg.time }}</span>
                    <span v-if="msg.mine" class="btick" :class="msg.status">
                      <span v-if="msg.status === 'seen'" class="material-symbols-outlined tick">done_all</span>
                      <span v-else-if="msg.status === 'delivered'" class="material-symbols-outlined tick">done_all</span>
                      <span v-else class="material-symbols-outlined tick">done</span>
                    </span>
                  </div>
                </div>

                <!-- Reactions row -->
                <div v-if="hasReactions(msg)" class="rxn-row" :class="{ 'rxn-mine': msg.mine }">
                  <button v-for="(users, emoji) in msg.reactions" :key="emoji"
                    v-show="users.length > 0"
                    class="rxn-pill" :class="{ 'rxn-active': users.includes(authStore.user?.id) }"
                    @click.stop="toggleReaction(msg, emoji)">
                    {{ emoji }}<span class="rxn-count">{{ users.length }}</span>
                  </button>
                </div>

                <!-- Hover action bar -->
                <div class="msg-actions" :class="msg.mine ? 'ma-left' : 'ma-right'">
                  <button class="ma-btn" @click.stop="openEmojiPicker(msg)" title="React">
                    <span class="material-symbols-outlined">add_reaction</span>
                  </button>
                  <button class="ma-btn" @click.stop="setReplyTo(msg)" title="Reply">
                    <span class="material-symbols-outlined">reply</span>
                  </button>
                  <button class="ma-btn" @click.stop="openCtx(msg, $event)" title="More">
                    <span class="material-symbols-outlined">expand_more</span>
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- Typing bubble -->
          <div v-if="messagingStore.isUserTyping(activeConv?.id)" class="typing-row">
            <div class="typing-bubble">
              <span class="td" /><span class="td" /><span class="td" />
            </div>
          </div>
        </div>

        <!-- Image preview before send -->
        <Transition name="slide-up">
          <div v-if="pendingImage" class="img-preview-bar">
            <div class="ipb-inner">
              <img :src="pendingImagePreview" class="ipb-thumb" />
              <div class="ipb-meta">
                <span class="ipb-name">{{ pendingImage.name }}</span>
                <span class="ipb-size">{{ formatFileSize(pendingImage.size) }}</span>
              </div>
              <button class="icon-btn" @click="clearPendingImage">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
        </Transition>

        <!-- Reply bar -->
        <Transition name="slide-up">
          <div v-if="replyTo" class="reply-bar">
            <div class="rb-accent" />
            <div class="rb-content">
              <span class="rb-who">{{ replyTo.sender_id === authStore.user?.id ? 'You' : activeConv.name }}</span>
              <span class="rb-text">{{ (replyTo.content || '📎 Media').slice(0, 80) }}</span>
            </div>
            <button class="icon-btn" @click="replyTo = null">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </Transition>

        <!-- Input bar -->
        <div class="input-bar">
          <button class="icon-btn ib-icon" @click="triggerFile" title="Attach">
            <span class="material-symbols-outlined">attach_file</span>
          </button>
          <input ref="fileInputEl" type="file" class="hidden-input"
            accept="image/*,application/pdf,application/zip"
            @change="onFileSelected" />
          <div class="ib-textarea-wrap">
            <textarea ref="textareaEl" v-model="newMessage" class="ib-textarea"
              placeholder="Message"
              rows="1"
              @input="onInput"
              @keydown.enter.exact.prevent="send"
              @keydown.enter.shift.exact="() => {}" />
          </div>
          <Transition name="btn-swap">
            <button v-if="canSend" class="send-btn" @click="send" key="send">
              <span class="material-symbols-outlined">send</span>
            </button>
            <button v-else class="icon-btn ib-icon" @click="triggerFile" key="attach">
              <span class="material-symbols-outlined">image</span>
            </button>
          </Transition>
        </div>
      </template>

      <!-- Empty state -->
      <div v-else class="chat-empty">
        <div class="ce-icon">
          <span class="material-symbols-outlined" style="font-size:3rem">forum</span>
        </div>
        <h3 class="ce-title">Your Messages</h3>
        <p class="ce-sub">Select a conversation to start chatting</p>
      </div>
    </div>

    <!-- ─── Emoji picker popup ─── -->
    <Teleport to="body">
      <div v-if="emojiPicker.show" class="emoji-picker-popup"
        :style="{ top: emojiPicker.y + 'px', left: emojiPicker.x + 'px' }"
        v-click-outside="() => emojiPicker.show = false">
        <button v-for="e in REACTIONS" :key="e" class="ep-btn"
          @click="toggleReaction(emojiPicker.msg, e); emojiPicker.show = false">
          {{ e }}
        </button>
      </div>
    </Teleport>

    <!-- ─── Context menu ─── -->
    <Teleport to="body">
      <Transition name="ctx-pop">
        <div v-if="ctx.show" class="ctx-menu"
          :style="{ top: ctx.y + 'px', left: ctx.x + 'px' }"
          v-click-outside="() => ctx.show = false">
          <!-- Reaction row at top -->
          <div class="ctx-reactions">
            <button v-for="e in REACTIONS" :key="e" class="ctx-rxn-btn"
              @click="toggleReaction(ctx.msg, e); ctx.show = false">{{ e }}</button>
          </div>
          <div class="ctx-divider" />
          <button class="ctx-item" @click="setReplyTo(ctx.msg); ctx.show = false">
            <span class="material-symbols-outlined">reply</span>Reply
          </button>
          <button class="ctx-item" @click="copyText(ctx.msg)">
            <span class="material-symbols-outlined">content_copy</span>Copy
          </button>
          <button v-if="ctx.msg?.mine" class="ctx-item" @click="beginEdit(ctx.msg); ctx.show = false">
            <span class="material-symbols-outlined">edit</span>Edit
          </button>
          <button v-if="ctx.msg?.mine" class="ctx-item ctx-danger" @click="deleteMsg(ctx.msg.id); ctx.show = false">
            <span class="material-symbols-outlined">delete</span>Delete
          </button>
          <button class="ctx-item" @click="ctx.show = false">
            <span class="material-symbols-outlined">close</span>Cancel
          </button>
        </div>
      </Transition>
    </Teleport>

    <!-- ─── Lightbox ─── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="lightboxUrl" class="lightbox" @click="lightboxUrl = null">
          <button class="lb-close" @click.stop="lightboxUrl = null">
            <span class="material-symbols-outlined">close</span>
          </button>
          <img :src="lightboxUrl" class="lb-img" @click.stop />
        </div>
      </Transition>
    </Teleport>

    <!-- ─── Incoming call ─── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="incomingCall" class="call-overlay">
          <div class="call-card">
            <div class="call-av">
              <img v-if="incomingCall.caller_avatar" :src="incomingCall.caller_avatar" class="c-avatar-img" />
              <span v-else class="c-avatar-txt" style="font-size:1.5rem">{{ (incomingCall.caller_name||'?')[0] }}</span>
            </div>
            <p class="call-name">{{ incomingCall.caller_name }}</p>
            <p class="call-sub">Incoming {{ incomingCall.call_type === 'video' ? 'video' : 'voice' }} call</p>
            <div class="call-btns">
              <button class="call-reject" @click="rejectCall">
                <span class="material-symbols-outlined">call_end</span>
              </button>
              <button class="call-accept" @click="acceptCall">
                <span class="material-symbols-outlined">call</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useMessagingStore } from '@/store/messaging'
import { useAuthStore } from '@/store/auth'

const messagingStore = useMessagingStore()
const authStore = useAuthStore()

const REACTIONS = ['👍','❤️','😂','😮','😢','🔥','🚀']

// ── State ──────────────────────────────────────────────────────────────────
const search         = ref('')
const newMessage     = ref('')
const messagesEl     = ref(null)
const textareaEl     = ref(null)
const fileInputEl    = ref(null)
const showMenu       = ref(false)
const showSearch     = ref(false)
const msgSearchQuery = ref('')
const replyTo        = ref(null)
const lightboxUrl    = ref(null)
const incomingCall   = ref(null)
const pendingImage   = ref(null)
const pendingImagePreview = ref(null)
const editingMsgId   = ref(null)

const ctx = ref({ show: false, x: 0, y: 0, msg: null })
const emojiPicker = ref({ show: false, x: 0, y: 0, msg: null })

let typingTimeout = null
let touchTimer    = null
let searchTimeout = null

// ── Computed ───────────────────────────────────────────────────────────────
const activeConv    = computed(() => messagingStore.activeConversation)
const canSend       = computed(() => newMessage.value.trim().length > 0 || !!pendingImage.value)
const filteredConvs = computed(() => {
  const q = search.value.toLowerCase()
  return messagingStore.conversations.filter(c => !q || c.name?.toLowerCase().includes(q))
})

// ── Helpers ────────────────────────────────────────────────────────────────
function shouldShowDate(idx) {
  if (idx === 0) return true
  const msgs = messagingStore.messages
  return new Date(msgs[idx-1]?.created_at).toDateString() !== new Date(msgs[idx]?.created_at).toDateString()
}

function formatDateSep(d) {
  if (!d) return ''
  const date = new Date(d)
  const today = new Date()
  const yest  = new Date(); yest.setDate(yest.getDate()-1)
  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yest.toDateString())  return 'Yesterday'
  return date.toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' })
}

function renderText(text) {
  if (!text) return ''
  const esc = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  return esc.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener" class="msg-link">$1</a>')
            .replace(/\n/g, '<br/>')
}

function formatFileSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB'
  return (bytes/(1024*1024)).toFixed(1) + ' MB'
}

function hasReactions(msg) {
  return msg.reactions && Object.values(msg.reactions).some(u => u.length > 0)
}

// ── Actions ────────────────────────────────────────────────────────────────
function selectConv(conv) {
  messagingStore.setActiveConversation(conv)
  showMenu.value = false
  showSearch.value = false
  replyTo.value = null
  ctx.value.show = false
  scrollBottom()
}

function scrollBottom() {
  nextTick(() => {
    if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  })
}

function onScroll() {
  if (messagesEl.value?.scrollTop === 0 && !messagingStore.loading) {
    const page = Math.ceil(messagingStore.messages.length / 50) + 1
    if (activeConv.value) messagingStore.fetchMessages(activeConv.value.id, page)
  }
}

// Typing
function onInput() {
  autoResize()
  messagingStore.sendTyping()
  clearTimeout(typingTimeout)
  typingTimeout = setTimeout(() => messagingStore.sendStopTyping(), 2000)
}

function autoResize() {
  if (!textareaEl.value) return
  textareaEl.value.style.height = 'auto'
  textareaEl.value.style.height = Math.min(textareaEl.value.scrollHeight, 120) + 'px'
}

// Send
async function send() {
  if (!activeConv.value) return
  clearTimeout(typingTimeout)
  messagingStore.sendStopTyping()

  if (pendingImage.value) {
    await sendImageAttachment()
    return
  }

  const content = newMessage.value.trim()
  if (!content) return
  newMessage.value = ''
  if (textareaEl.value) textareaEl.value.style.height = 'auto'

  if (editingMsgId.value) {
    await messagingStore.editMessage(editingMsgId.value, content)
    editingMsgId.value = null
    replyTo.value = null
    scrollBottom()
    return
  }

  await messagingStore.sendMessage({
    content,
    message_type: 'text',
    reply_to_id: replyTo.value?.id || null,
  })
  replyTo.value = null
  scrollBottom()
}

// Image
function triggerFile() { fileInputEl.value?.click() }

function onFileSelected(e) {
  const file = e.target.files?.[0]
  if (!file) return
  pendingImage.value = file
  pendingImagePreview.value = URL.createObjectURL(file)
  if (fileInputEl.value) fileInputEl.value.value = ''
}

function clearPendingImage() {
  if (pendingImagePreview.value) URL.revokeObjectURL(pendingImagePreview.value)
  pendingImage.value = null
  pendingImagePreview.value = null
}

async function sendImageAttachment() {
  if (!pendingImage.value || !activeConv.value) return
  const file = pendingImage.value
  clearPendingImage()
  try {
    const result = await messagingStore.uploadAttachment(file)
    await messagingStore.sendMessage({
      content: newMessage.value.trim() || '',
      message_type: result.is_image ? 'image' : 'file',
      media_url: result.url,
      file_name: result.file_name,
      file_size: result.file_size,
      reply_to_id: replyTo.value?.id || null,
    })
    newMessage.value = ''
    replyTo.value = null
    scrollBottom()
  } catch (err) {
    console.error('Send attachment failed:', err)
  }
}

// Context menu
function openCtx(msg, e) {
  ctx.value.show = false
  emojiPicker.value.show = false
  nextTick(() => {
    const x = Math.min(e.clientX, window.innerWidth - 200)
    const y = Math.min(e.clientY, window.innerHeight - 300)
    ctx.value = { show: true, x, y, msg }
  })
}

function closeAllMenus() {
  ctx.value.show = false
  emojiPicker.value.show = false
}

// Touch (long press = context menu)
function onTouchStart(msg, e) {
  touchTimer = setTimeout(() => {
    openCtx(msg, { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY })
  }, 500)
}
function onTouchEnd() { clearTimeout(touchTimer) }

// Emoji picker
function openEmojiPicker(msg) {
  const el = document.getElementById(`msg-${msg.id}`)
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = Math.min(rect.left, window.innerWidth - 260)
  const y = rect.top - 56
  emojiPicker.value = { show: true, x, y, msg }
}

// Reactions
async function toggleReaction(msg, emoji) {
  if (!activeConv.value || !msg) return
  // Optimistic update
  if (!msg.reactions) msg.reactions = {}
  const uid = authStore.user?.id
  if (!msg.reactions[emoji]) msg.reactions[emoji] = []
  const idx = msg.reactions[emoji].indexOf(uid)
  if (idx > -1) msg.reactions[emoji].splice(idx, 1)
  else msg.reactions[emoji].push(uid)
  try {
    await messagingStore.reactToMessage(activeConv.value.id, msg.id, emoji)
  } catch {}
}

// Reply
function setReplyTo(msg) { replyTo.value = msg }

// Scroll to message
function scrollToMessage(id) {
  const el = document.getElementById(`msg-${id}`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

// Copy
function copyText(msg) {
  if (msg?.content) navigator.clipboard.writeText(msg.content).catch(() => {})
  ctx.value.show = false
}

// Edit
function beginEdit(msg) {
  newMessage.value = msg.content || ''
  editingMsgId.value = msg.id
  nextTick(() => textareaEl.value?.focus())
}

// Delete
async function deleteMsg(id) {
  await messagingStore.deleteMessage(id)
}

// Search
function toggleSearch() {
  showSearch.value = !showSearch.value
  if (!showSearch.value) { msgSearchQuery.value = ''; messagingStore.searchMessages('') }
}
function closeSearch() { showSearch.value = false; msgSearchQuery.value = '' }
function debounceSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => messagingStore.searchMessages(msgSearchQuery.value), 300)
}

// Chat delete
async function deleteChat() {
  if (!activeConv.value) return
  await messagingStore.deleteConversation(activeConv.value.id)
  showMenu.value = false
}

// Calls
function startCall(type) {
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

// ── Watchers ───────────────────────────────────────────────────────────────
watch(() => messagingStore.messages.length, () => scrollBottom())

watch(() => messagingStore.callEvent, (event) => {
  if (!event) return
  if (event.type === 'incoming_call') incomingCall.value = event
  else if (['call_ended', 'call_rejected'].includes(event.type)) incomingCall.value = null
  messagingStore.clearCallEvent()
})

onMounted(() => messagingStore.fetchConversations())
</script>

<style scoped>
/* ═══════════════════════════ Layout ═══════════════════════════ */
.messaging-view { display:flex; height:calc(100vh - 72px); overflow:hidden; background:var(--background); }

/* ═══════════════════════════ Sidebar ═══════════════════════════ */
.conv-panel { width:320px; flex-shrink:0; display:flex; flex-direction:column; background:var(--surface-container-lowest); border-right:1px solid var(--outline-variant); }
.conv-header { display:flex; align-items:center; gap:.5rem; padding:1rem 1rem .5rem; flex-shrink:0; }
.panel-title { font-family:var(--font-headline); font-size:1.15rem; font-weight:700; color:var(--on-surface); flex:1; }
.total-badge { min-width:20px; height:20px; border-radius:10px; background:var(--primary); color:#fff; font-size:.65rem; font-weight:800; display:flex; align-items:center; justify-content:center; padding:0 5px; }

.conv-search-wrap { position:relative; padding:.5rem .75rem; flex-shrink:0; }
.si { position:absolute; left:1.35rem; top:50%; transform:translateY(-50%); font-size:18px; color:var(--on-surface-variant); pointer-events:none; }
.conv-search-input { width:100%; padding:.45rem .75rem .45rem 2.25rem; background:var(--surface-container); border:1px solid var(--outline-variant); border-radius:var(--radius-full); font-size:.83rem; color:var(--on-surface); outline:none; }
.conv-search-input:focus { border-color:var(--primary); }

.conv-list { flex:1; overflow-y:auto; }
.conv-item { display:flex; align-items:center; gap:.75rem; padding:.75rem 1rem; cursor:pointer; transition:background .12s; }
.conv-item:hover { background:var(--surface-container-low); }
.conv-item.active { background:color-mix(in srgb,var(--primary) 10%,transparent); }

.c-avatar { position:relative; width:46px; height:46px; border-radius:50%; background:var(--primary-fixed); display:flex; align-items:center; justify-content:center; flex-shrink:0; overflow:hidden; }
.c-avatar-img { width:100%; height:100%; object-fit:cover; border-radius:50%; }
.c-avatar-img.small { width:32px; height:32px; }
.c-avatar-txt { font-family:var(--font-headline); font-weight:700; color:var(--primary); font-size:.95rem; }
.c-avatar-txt.small { font-size:.7rem; }
.c-online { position:absolute; bottom:1px; right:1px; width:11px; height:11px; border-radius:50%; background:#22c55e; border:2px solid var(--surface-container-lowest); }

.c-info { flex:1; min-width:0; }
.c-row1 { display:flex; justify-content:space-between; align-items:center; }
.c-name { font-size:.875rem; font-weight:600; color:var(--on-surface); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.c-time { font-size:.68rem; color:var(--on-surface-variant); flex-shrink:0; margin-left:.3rem; }
.c-row2 { display:flex; justify-content:space-between; align-items:center; margin-top:.15rem; }
.c-preview { font-size:.78rem; color:var(--on-surface-variant); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.c-badge { min-width:18px; height:18px; border-radius:9px; background:#22c55e; color:#fff; font-size:.62rem; font-weight:800; display:flex; align-items:center; justify-content:center; padding:0 4px; flex-shrink:0; }
.conv-empty { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:3rem 1rem; color:var(--on-surface-variant); font-size:.85rem; }

/* ═══════════════════════════ Chat panel ═══════════════════════════ */
.chat-panel { flex:1; display:flex; flex-direction:column; overflow:hidden; position:relative;
  background-image: radial-gradient(circle at 1px 1px, color-mix(in srgb,var(--primary) 4%,transparent) 1px, transparent 0);
  background-size: 24px 24px;
  background-color: var(--background); }

/* Header */
.chat-header { display:flex; align-items:center; gap:.6rem; padding:.75rem 1rem; background:var(--surface-container-lowest); border-bottom:1px solid var(--outline-variant); flex-shrink:0; box-shadow:0 1px 4px rgba(0,0,0,.06); }
.back-btn { display:none; }
@media(max-width:767px) { .back-btn { display:flex; } .conv-panel { width:100%; } .hidden-mobile { display:none !important; } }
.ch-info { flex:1; min-width:0; display:flex; flex-direction:column; }
.ch-name { font-size:.925rem; font-weight:700; color:var(--on-surface); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ch-status { font-size:.73rem; }
.ch-status.online { color:#22c55e; }
.ch-status.offline { color:var(--on-surface-variant); }
.ch-actions { display:flex; gap:.15rem; }
.icon-btn { width:36px; height:36px; border-radius:50%; background:none; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--on-surface-variant); transition:.12s; }
.icon-btn:hover { background:rgba(168,85,247,.08); color:var(--primary); }
.icon-btn.active { background:rgba(168,85,247,.12); color:var(--primary); }
.icon-btn .material-symbols-outlined { font-size:20px; }

/* More menu */
.more-wrap { position:relative; }
.dropdown { position:absolute; top:calc(100%+4px); right:0; z-index:200; min-width:180px; background:var(--surface-container-high); border:1px solid var(--outline-variant); border-radius:var(--radius-lg); box-shadow:0 8px 24px rgba(0,0,0,.3); padding:.3rem; display:flex; flex-direction:column; }
.drop-item { display:flex; align-items:center; gap:.6rem; padding:.5rem .75rem; border:none; background:none; border-radius:var(--radius-md); font-size:.82rem; font-weight:500; color:var(--on-surface); cursor:pointer; }
.drop-item:hover { background:var(--surface-container); }
.drop-item.danger { color:#ef4444; }
.drop-item .material-symbols-outlined { font-size:18px; }

/* Search bar */
.search-bar { display:flex; align-items:center; gap:.5rem; padding:.5rem 1rem; background:var(--surface-container-low); border-bottom:1px solid var(--outline-variant); flex-shrink:0; }
.search-bar-input { flex:1; padding:.4rem .75rem .4rem 2.1rem; background:var(--surface-container); border:1px solid var(--outline-variant); border-radius:var(--radius-full); font-size:.85rem; color:var(--on-surface); outline:none; }
.search-bar-input:focus { border-color:var(--primary); }
.search-count { font-size:.72rem; color:var(--on-surface-variant); white-space:nowrap; }

/* ═══════════════════════════ Messages ═══════════════════════════ */
.msgs-area { flex:1; overflow-y:auto; padding:.75rem 1rem 1rem; display:flex; flex-direction:column; gap:.5rem; scroll-behavior:smooth; }

/* Skeletons */
.skeleton-row { display:flex; }
.sr-right { justify-content:flex-end; }
.skeleton-bubble { width:180px; height:44px; border-radius:18px; }
.shimmer { background:linear-gradient(90deg,var(--surface-container) 25%,var(--surface-container-high) 50%,var(--surface-container) 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* Date separator */
.date-sep { display:flex; justify-content:center; margin:.35rem 0; }
.date-sep span { background:color-mix(in srgb,var(--on-surface) 8%,transparent); color:var(--on-surface-variant); font-size:.7rem; font-weight:600; padding:.2rem .75rem; border-radius:var(--radius-full); backdrop-filter:blur(4px); }

/* Message row */
.msg-row { display:flex; align-items:flex-end; gap:.4rem; max-width:72%; position:relative; }
.msg-row.mine { align-self:flex-end; flex-direction:row-reverse; }

.msg-avatar { width:28px; height:28px; flex-shrink:0; border-radius:50%; overflow:hidden; }

.msg-col { display:flex; flex-direction:column; gap:.2rem; }

/* Hover action bar */
.msg-actions { display:none; align-items:center; gap:.15rem; margin-bottom:.2rem; }
.msg-row:hover .msg-actions { display:flex; }
.ma-left { margin-right:.25rem; align-self:flex-end; }
.ma-right { margin-left:.25rem; align-self:flex-end; }
.ma-btn { width:28px; height:28px; border-radius:50%; border:none; background:var(--surface-container-high); color:var(--on-surface-variant); display:flex; align-items:center; justify-content:center; cursor:pointer; }
.ma-btn:hover { background:var(--primary); color:#fff; }
.ma-btn .material-symbols-outlined { font-size:15px; }

/* Reply snap (inside bubble) */
.reply-snap { display:flex; align-items:stretch; gap:.4rem; border-radius:var(--radius-md); padding:.4rem .5rem; margin-bottom:.25rem; cursor:pointer; max-width:260px; }
.reply-snap-mine { background:rgba(0,0,0,.12); }
.reply-snap-theirs { background:rgba(0,0,0,.06); }
.reply-snap-bar { width:3px; border-radius:2px; background:var(--primary); flex-shrink:0; }
.reply-snap-content { display:flex; flex-direction:column; gap:.1rem; min-width:0; }
.reply-snap-who { font-size:.72rem; font-weight:700; color:var(--primary); }
.reply-snap-text { font-size:.78rem; color:var(--on-surface-variant); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.reply-snap-img { width:36px; height:36px; border-radius:4px; object-fit:cover; margin-top:.2rem; }

/* Bubble */
.bubble { padding:.55rem .85rem; border-radius:18px; word-break:break-word; position:relative; max-width:480px; min-width:60px; box-shadow:0 1px 2px rgba(0,0,0,.1); }
.bubble-mine { background:var(--primary); color:#fff; border-bottom-right-radius:4px; }
.bubble-theirs { background:var(--surface-container-high); color:var(--on-surface); border-bottom-left-radius:4px; }
[data-theme="dark"] .bubble-theirs { background:#2a2a3e; }
.bubble-deleted { opacity:.65; }
.deleted-label { font-size:.8rem; font-style:italic; display:flex; align-items:center; gap:.3rem; color:inherit; opacity:.75; }

/* Bubble content */
.bubble-img-wrap { border-radius:12px; overflow:hidden; max-width:260px; cursor:pointer; }
.bubble-img { width:100%; display:block; max-height:300px; object-fit:cover; }
.bubble-text { font-size:.875rem; line-height:1.5; margin:0; white-space:pre-wrap; }
.bubble-mine .bubble-text :deep(a) { color:#ddd6fe; }
.bubble-theirs .bubble-text :deep(a) { color:var(--primary); }
.edited-tag { font-size:.6rem; opacity:.65; font-style:italic; display:block; text-align:right; margin-top:.15rem; }

/* File chip */
.file-chip { display:flex; align-items:center; gap:.6rem; padding:.5rem .75rem; border-radius:var(--radius-lg); text-decoration:none; max-width:240px; }
.file-mine { background:rgba(255,255,255,.15); color:#fff; }
.file-theirs { background:var(--surface-container); color:var(--on-surface); }
.file-icon .material-symbols-outlined { font-size:26px; }
.file-meta { flex:1; min-width:0; display:flex; flex-direction:column; }
.file-name { font-size:.8rem; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.file-size { font-size:.68rem; opacity:.7; }
.file-dl .material-symbols-outlined { font-size:20px; opacity:.8; }

/* Footer */
.bubble-footer { display:flex; align-items:center; gap:.2rem; justify-content:flex-end; margin-top:.2rem; }
.btime { font-size:.6rem; opacity:.7; }
.btick .material-symbols-outlined { font-size:13px; }
.btick.seen .material-symbols-outlined { color:#60a5fa; }
.bubble-mine .btick.seen .material-symbols-outlined { color:#ddd6fe; }
.btick.delivered .material-symbols-outlined { opacity:.9; }

/* Reactions */
.rxn-row { display:flex; flex-wrap:wrap; gap:.25rem; margin-top:.2rem; }
.rxn-mine { justify-content:flex-end; }
.rxn-pill { padding:.15rem .5rem; border-radius:var(--radius-full); border:1px solid var(--outline-variant); background:var(--surface-container); font-size:.8rem; cursor:pointer; display:flex; align-items:center; gap:.2rem; transition:.12s; }
.rxn-pill:hover { background:var(--surface-container-low); }
.rxn-pill.rxn-active { background:color-mix(in srgb,var(--primary) 15%,transparent); border-color:var(--primary); }
.rxn-count { font-size:.7rem; font-weight:700; color:var(--on-surface-variant); }

/* Typing bubble */
.typing-row { align-self:flex-start; }
.typing-bubble { display:flex; align-items:center; gap:4px; padding:.55rem .85rem; background:var(--surface-container-high); border-radius:18px; border-bottom-left-radius:4px; width:54px; }
.td { width:6px; height:6px; border-radius:50%; background:var(--on-surface-variant); animation:td 1.4s infinite; }
.td:nth-child(2) { animation-delay:.2s; } .td:nth-child(3) { animation-delay:.4s; }
@keyframes td { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }

/* ═══════════════════════════ Bottom bars ═══════════════════════════ */
/* Image preview */
.img-preview-bar { flex-shrink:0; padding:.5rem 1rem; background:var(--surface-container-low); border-top:1px solid var(--outline-variant); }
.ipb-inner { display:flex; align-items:center; gap:.75rem; }
.ipb-thumb { width:52px; height:52px; border-radius:var(--radius-lg); object-fit:cover; }
.ipb-meta { flex:1; display:flex; flex-direction:column; gap:.15rem; }
.ipb-name { font-size:.82rem; font-weight:600; color:var(--on-surface); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ipb-size { font-size:.7rem; color:var(--on-surface-variant); }

/* Reply bar */
.reply-bar { flex-shrink:0; display:flex; align-items:center; gap:.6rem; padding:.5rem 1rem; background:var(--surface-container-low); border-top:1px solid var(--outline-variant); }
.rb-accent { width:3px; height:32px; border-radius:2px; background:var(--primary); flex-shrink:0; }
.rb-content { flex:1; display:flex; flex-direction:column; gap:.1rem; min-width:0; }
.rb-who { font-size:.72rem; font-weight:700; color:var(--primary); }
.rb-text { font-size:.78rem; color:var(--on-surface-variant); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

/* Input bar */
.input-bar { flex-shrink:0; display:flex; align-items:flex-end; gap:.4rem; padding:.6rem .75rem; background:var(--surface-container-lowest); border-top:1px solid var(--outline-variant); }
.ib-icon { color:var(--on-surface-variant); flex-shrink:0; }
.ib-textarea-wrap { flex:1; background:var(--surface-container-low); border:1px solid var(--outline-variant); border-radius:22px; padding:.5rem .875rem; transition:border-color .15s; }
.ib-textarea-wrap:focus-within { border-color:var(--primary); }
.ib-textarea { width:100%; background:transparent; border:none; outline:none; resize:none; font-family:var(--font-body); font-size:.9rem; color:var(--on-surface); line-height:1.5; max-height:120px; overflow-y:auto; }
.ib-textarea::placeholder { color:var(--outline); }
.hidden-input { display:none; }
.send-btn { width:42px; height:42px; border-radius:50%; background:var(--primary); color:#fff; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; box-shadow:0 2px 8px rgba(99,14,212,.35); transition:.15s; }
.send-btn:hover { background:color-mix(in srgb,var(--primary) 85%,#000); }
.send-btn .material-symbols-outlined { font-size:20px; }

/* ═══════════════════════════ Empty state ═══════════════════════════ */
.chat-empty { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.75rem; }
.ce-icon { width:80px; height:80px; border-radius:50%; background:color-mix(in srgb,var(--primary) 10%,transparent); display:flex; align-items:center; justify-content:center; color:var(--primary); }
.ce-title { font-family:var(--font-headline); font-size:1.25rem; font-weight:700; color:var(--on-surface); margin:0; }
.ce-sub { font-size:.875rem; color:var(--on-surface-variant); margin:0; }

/* ═══════════════════════════ Emoji picker ═══════════════════════════ */
.emoji-picker-popup { position:fixed; z-index:1000; background:var(--surface-container-high); border:1px solid var(--outline-variant); border-radius:var(--radius-xl); box-shadow:0 8px 24px rgba(0,0,0,.3); padding:.5rem; display:flex; gap:.2rem; }
.ep-btn { width:36px; height:36px; border-radius:50%; background:none; border:none; font-size:1.25rem; cursor:pointer; transition:.12s; display:flex; align-items:center; justify-content:center; }
.ep-btn:hover { background:var(--surface-container); transform:scale(1.2); }

/* ═══════════════════════════ Context menu ═══════════════════════════ */
.ctx-menu { position:fixed; z-index:1000; background:var(--surface-container-high); border:1px solid var(--outline-variant); border-radius:var(--radius-xl); box-shadow:0 12px 32px rgba(0,0,0,.35); padding:.4rem; min-width:190px; }
.ctx-reactions { display:flex; gap:.2rem; padding:.3rem .4rem .5rem; }
.ctx-rxn-btn { width:34px; height:34px; border-radius:50%; background:none; border:none; font-size:1.1rem; cursor:pointer; transition:.12s; }
.ctx-rxn-btn:hover { background:var(--surface-container); transform:scale(1.2); }
.ctx-divider { height:1px; background:var(--outline-variant); margin:.1rem 0; }
.ctx-item { display:flex; align-items:center; gap:.6rem; padding:.55rem .875rem; border:none; background:none; border-radius:var(--radius-md); font-size:.85rem; font-weight:500; color:var(--on-surface); cursor:pointer; width:100%; text-align:left; }
.ctx-item:hover { background:var(--surface-container); }
.ctx-item .material-symbols-outlined { font-size:18px; color:var(--on-surface-variant); }
.ctx-danger { color:#ef4444; }
.ctx-danger .material-symbols-outlined { color:#ef4444; }

/* ═══════════════════════════ Lightbox ═══════════════════════════ */
.lightbox { position:fixed; inset:0; background:rgba(0,0,0,.9); z-index:2000; display:flex; align-items:center; justify-content:center; }
.lb-close { position:absolute; top:1rem; right:1rem; width:44px; height:44px; border-radius:50%; background:rgba(255,255,255,.15); border:none; color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.lb-img { max-width:92vw; max-height:92vh; object-fit:contain; border-radius:var(--radius-lg); }

/* ═══════════════════════════ Call overlay ═══════════════════════════ */
.call-overlay { position:fixed; inset:0; background:rgba(0,0,0,.7); z-index:3000; display:flex; align-items:center; justify-content:center; }
.call-card { background:var(--surface-container-highest); border-radius:var(--radius-2xl); padding:2.5rem 2rem; display:flex; flex-direction:column; align-items:center; gap:1rem; min-width:280px; }
.call-av { width:72px; height:72px; border-radius:50%; overflow:hidden; background:var(--primary-fixed); display:flex; align-items:center; justify-content:center; }
.call-name { font-family:var(--font-headline); font-size:1.15rem; font-weight:700; color:var(--on-surface); margin:0; }
.call-sub { font-size:.85rem; color:var(--on-surface-variant); margin:0; }
.call-btns { display:flex; gap:1.75rem; margin-top:.5rem; }
.call-reject { width:60px; height:60px; border-radius:50%; background:#ef4444; border:none; color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.call-accept { width:60px; height:60px; border-radius:50%; background:#22c55e; border:none; color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.call-reject .material-symbols-outlined,
.call-accept .material-symbols-outlined { font-size:24px; }

/* ═══════════════════════════ Transitions ═══════════════════════════ */
.slide-down-enter-active, .slide-down-leave-active { transition:all .2s ease; }
.slide-down-enter-from, .slide-down-leave-to { transform:translateY(-10px); opacity:0; }
.slide-up-enter-active, .slide-up-leave-active { transition:all .18s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform:translateY(6px); opacity:0; }
.fade-enter-active, .fade-leave-active { transition:opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity:0; }
.drop-enter-active, .drop-leave-active { transition:all .15s ease; }
.drop-enter-from, .drop-leave-to { transform:translateY(-6px) scale(.97); opacity:0; }
.ctx-pop-enter-active, .ctx-pop-leave-active { transition:all .12s ease; }
.ctx-pop-enter-from, .ctx-pop-leave-to { transform:scale(.93); opacity:0; }
.btn-swap-enter-active, .btn-swap-leave-active { transition:all .15s ease; }
.btn-swap-enter-from, .btn-swap-leave-to { opacity:0; transform:scale(.7); }
</style>
