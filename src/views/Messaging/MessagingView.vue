<template>
  <div class="msg-root">

    <!-- ═══ Conversation List ═══ -->
    <div class="conv-side" :class="{ 'conv-hidden': !!activeConv }">
      <!-- Topbar -->
      <div class="conv-topbar">
        <RouterLink to="/dashboard" class="conv-back-btn" aria-label="Back">
          <span class="material-symbols-outlined">arrow_back</span>
        </RouterLink>
        <h2 class="conv-title">Messages</h2>
        <span v-if="messagingStore.totalUnread > 0" class="conv-badge">
          {{ messagingStore.totalUnread > 99 ? '99+' : messagingStore.totalUnread }}
        </span>
      </div>
      <!-- Search -->
      <div class="conv-search-wrap">
        <span class="material-symbols-outlined conv-search-ico">search</span>
        <input v-model="search" name="conv_search" autocomplete="off" class="conv-search" placeholder="Search conversations…" />
      </div>
      <!-- List -->
      <div class="conv-list">
        <template v-if="messagingStore.loading && !messagingStore.conversations.length">
          <div v-for="i in 6" :key="i" class="conv-skel">
            <div class="skel-av shimmer"></div>
            <div class="skel-lines">
              <div class="shimmer skel-l1"></div>
              <div class="shimmer skel-l2"></div>
            </div>
          </div>
        </template>
        <div
          v-for="conv in filteredConvs" :key="conv.id"
          class="conv-item" :class="{ active: activeConv?.id === conv.id }"
          @click="selectConv(conv)"
        >
          <div class="cv-av">
            <img v-if="conv.avatar" :src="conv.avatar" class="cv-av-img" />
            <span v-else class="cv-av-ini">{{ (conv.name||'?')[0].toUpperCase() }}</span>
            <span v-if="conv.online" class="cv-dot" />
          </div>
          <div class="cv-body">
            <div class="cv-top">
              <span class="cv-name">{{ conv.name }}</span>
              <span class="cv-time">{{ conv.time }}</span>
            </div>
            <div class="cv-bot">
              <span class="cv-prev" :class="{ typing: messagingStore.isUserTyping(conv.id) }">
                <template v-if="messagingStore.isUserTyping(conv.id)">
                  <span class="cv-typing-dots"><i/><i/><i/></span> typing…
                </template>
                <template v-else-if="conv.last_message_type === 'image'">
                  <span class="material-symbols-outlined" style="font-size:13px">image</span> Photo
                </template>
                <template v-else-if="conv.last_message_type === 'video'">
                  <span class="material-symbols-outlined" style="font-size:13px">videocam</span> Video
                </template>
                <template v-else-if="conv.last_message_type === 'voice'">
                  <span class="material-symbols-outlined" style="font-size:13px">mic</span> Voice message
                </template>
                <template v-else-if="conv.last_message_type === 'file'">
                  <span class="material-symbols-outlined" style="font-size:13px">attach_file</span> {{ conv.last_message_content || 'File' }}
                </template>
                <template v-else>{{ conv.last_message_content || 'Tap to chat' }}</template>
              </span>
              <span v-if="conv.unread_count > 0" class="cv-badge-sm">{{ conv.unread_count }}</span>
            </div>
          </div>
        </div>
        <div v-if="!filteredConvs.length && !messagingStore.loading" class="conv-empty">
          <span class="material-symbols-outlined" style="font-size:3rem;opacity:.25">chat_bubble_outline</span>
          <p>No conversations yet</p>
        </div>
      </div>
    </div>

    <!-- ═══ Chat Window ═══ -->
    <div class="chat-win" :class="{ 'chat-active': !!activeConv }">
      <template v-if="activeConv">

        <!-- ── Header (STATIC) ── -->
        <div class="chat-hdr">
          <button class="hdr-btn ch-back" @click="messagingStore.setActiveConversation(null)">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div class="ch-av">
            <img v-if="activeConv.avatar" :src="activeConv.avatar" class="cv-av-img" />
            <span v-else class="cv-av-ini sm">{{ (activeConv.name||'?')[0].toUpperCase() }}</span>
            <span v-if="activeConv.online" class="cv-dot" />
          </div>
          <div class="ch-meta">
            <span class="ch-name">{{ activeConv.name }}</span>
            <span class="ch-status" :class="{ online: activeConv.online }">
              <template v-if="messagingStore.isUserTyping(activeConv?.id)">
                <span class="typing-inline"><i/><i/><i/></span> typing…
              </template>
              <template v-else>{{ activeConv.online ? 'online' : 'offline' }}</template>
            </span>
          </div>
          <div class="ch-acts">
            <button class="hdr-btn" @click="startCall('voice')">
              <span class="material-symbols-outlined">call</span>
            </button>
            <button class="hdr-btn" @click="startCall('video')">
              <span class="material-symbols-outlined">videocam</span>
            </button>
            <button class="hdr-btn" :class="{ active: showSearch }" @click="toggleSearch">
              <span class="material-symbols-outlined">search</span>
            </button>
            <div class="more-wrap">
              <button class="hdr-btn" @click="showMenu = !showMenu">
                <span class="material-symbols-outlined">more_vert</span>
              </button>
              <Transition name="drop">
                <div v-if="showMenu" class="drop-menu" v-click-outside="() => showMenu = false">
                  <button class="drop-item" @click="messagingStore.pinChat(activeConv.id); showMenu=false">
                    <span class="material-symbols-outlined">push_pin</span>
                    {{ activeConv.pinned ? 'Unpin' : 'Pin chat' }}
                  </button>
                  <div class="drop-div"/>
                  <button class="drop-item danger" @click="deleteChat">
                    <span class="material-symbols-outlined">delete</span>Delete chat
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- ── Search bar ── -->
        <Transition name="slide-down">
          <div v-if="showSearch" class="srch-bar">
            <span class="material-symbols-outlined" style="font-size:18px;color:var(--on-surface-variant)">search</span>
            <input v-model="msgQ" class="srch-inp" placeholder="Search messages…"
              @input="debounceSearch" @keydown.escape="closeSearch" autofocus />
            <button v-if="msgQ" class="hdr-btn sm" @click="msgQ=''; messagingStore.searchMessages('')">
              <span class="material-symbols-outlined" style="font-size:16px">close</span>
            </button>
          </div>
        </Transition>
        <Transition name="slide-down">
          <div v-if="showSearch && messagingStore.searchResults.length" class="srch-results">
            <div v-for="m in messagingStore.searchResults" :key="m.id"
              class="srch-item" @click="scrollToMsg(m.id)">
              <span class="srch-text">{{ m.content }}</span>
              <span class="srch-ts">{{ m.time }}</span>
            </div>
          </div>
        </Transition>

        <!-- ── E2E bar ── -->
        <div class="e2e-bar">
          <span class="material-symbols-outlined" style="font-size:12px">lock</span>
          End-to-end encrypted
        </div>

        <!-- ── Messages area ── -->
        <div class="msgs-area" ref="msgsEl" @scroll="onScroll" @click="closeAll">
          <template v-if="messagingStore.loading && !messagingStore.messages.length">
            <div v-for="i in 6" :key="i" class="sk-row" :class="i%2===0?'sk-r':'sk-l'">
              <div class="sk-bub shimmer" :style="{width:(90+i*20)+'px'}"></div>
            </div>
          </template>

          <template v-for="(m, idx) in messagingStore.messages" :key="m.id">
            <!-- Date chip -->
            <div v-if="showDate(idx)" class="date-chip">
              <span>{{ fmtDate(m.created_at) }}</span>
            </div>

            <!-- Message row -->
            <div :id="`m-${m.id}`"
              class="msg-row" :class="{ mine: m.mine, 'has-av': !m.mine }"
              @click.stop
              @contextmenu.prevent="openCtx(m,$event)"
              @touchstart="touchStart(m,$event)"
              @touchend="touchEnd"
            >
              <!-- Avatar (other person only) -->
              <div v-if="!m.mine" class="msg-av">
                <img v-if="activeConv.avatar" :src="activeConv.avatar" class="cv-av-img" />
                <span v-else class="cv-av-ini xs">{{ (activeConv.name||'?')[0].toUpperCase() }}</span>
              </div>

              <div class="msg-col">
                <!-- Reply preview -->
                <div v-if="m.reply_preview && !m.is_deleted"
                  class="reply-snap" :class="m.mine?'rs-mine':'rs-theirs'"
                  @click.stop="scrollToMsg(m.reply_preview.id)">
                  <div class="rs-bar"/>
                  <div class="rs-body">
                    <span class="rs-who">{{ m.reply_preview.sender_id===authStore.user?.id?'You':activeConv.name }}</span>
                    <span class="rs-txt">{{ m.reply_preview.content }}</span>
                  </div>
                </div>

                <!-- Bubble -->
                <div class="bubble"
                  :class="[m.mine?'bub-mine':'bub-theirs', {'bub-del':m.is_deleted,'bub-media':isImgOnly(m)}]">

                  <span v-if="m.is_deleted" class="del-msg">
                    <span class="material-symbols-outlined" style="font-size:14px">block</span>
                    Message was deleted
                  </span>

                  <template v-else>
                    <!-- Image -->
                    <div v-if="m.message_type==='image' && m.media_url"
                      class="bub-img-wrap" @click.stop="lightbox=m.media_url">
                      <img :src="m.media_url" class="bub-img" loading="lazy" />
                    </div>
                    <!-- Video -->
                    <div v-else-if="m.message_type==='video' && m.media_url" class="bub-vid-wrap">
                      <video :src="m.media_url" class="bub-vid" controls preload="metadata" playsinline />
                    </div>
                    <!-- Voice -->
                    <div v-else-if="m.message_type==='voice' && m.media_url"
                      class="voice-player" :class="m.mine?'vp-mine':'vp-theirs'">
                      <button class="vp-play" @click.stop="toggleVoice(m)">
                        <span class="material-symbols-outlined">{{ playingId===m.id?'pause':'play_arrow' }}</span>
                      </button>
                      <div class="vp-waves">
                        <div v-for="b in 24" :key="b" class="vp-bar"
                          :style="{height:barH(m.id,b)+'px', opacity:barProg(m.id,b)?1:0.3}"/>
                      </div>
                      <span class="vp-time">{{ voiceDur(m) }}</span>
                    </div>
                    <!-- File -->
                    <a v-else-if="m.media_url && m.file_name"
                      :href="m.media_url" target="_blank"
                      class="file-chip" :class="m.mine?'fc-mine':'fc-theirs'" @click.stop>
                      <span class="material-symbols-outlined fc-ico">description</span>
                      <div class="fc-info">
                        <span class="fc-name">{{ m.file_name }}</span>
                        <span class="fc-sz">{{ fmtSize(m.file_size) }}</span>
                      </div>
                      <span class="material-symbols-outlined fc-dl">download</span>
                    </a>
                    <!-- Text -->
                    <p v-else class="bub-txt" v-html="renderTxt(m.content)"></p>
                    <span v-if="m.is_edited" class="bub-edited">edited</span>
                  </template>

                  <!-- Footer: time + ticks -->
                  <div class="bub-foot">
                    <span class="bub-ts">{{ m.time }}</span>
                    <span v-if="m.mine && m.status === 'failed'" class="bub-failed" title="Tap to retry" @click.stop="retrySend(m)">
                      <span class="material-symbols-outlined" style="font-size:13px;color:#ef4444">error</span>
                    </span>
                    <span v-else-if="m.mine" class="bub-ticks" :class="m.status">
                      <span class="material-symbols-outlined tick-ico">
                        {{ m.status==='seen'||m.status==='delivered' ? 'done_all' : 'done' }}
                      </span>
                    </span>
                  </div>
                </div>

                <!-- Reactions -->
                <div v-if="hasRxn(m)" class="rxns" :class="{'rxns-r':m.mine}">
                  <button v-for="(users,e) in m.reactions" :key="e" v-show="users.length>0"
                    class="rxn-chip" :class="{'rxn-mine':users.includes(authStore.user?.id)}"
                    @click.stop="doReact(m,e)">
                    {{ e }}<span class="rxn-cnt">{{ users.length }}</span>
                  </button>
                </div>

                <!-- Quick actions on hover -->
                <div class="msg-actions">
                  <button class="ma-btn" title="React" @click.stop="openEmoji(m)">
                    <span class="material-symbols-outlined">add_reaction</span>
                  </button>
                  <button class="ma-btn" title="Reply" @click.stop="setReply(m)">
                    <span class="material-symbols-outlined">reply</span>
                  </button>
                  <button class="ma-btn" title="More" @click.stop="openCtx(m,$event)">
                    <span class="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- Typing indicator -->
          <div v-if="messagingStore.isUserTyping(activeConv?.id)" class="typing-row">
            <div class="typing-bub">
              <span class="td"/><span class="td"/><span class="td"/>
            </div>
          </div>

          <!-- Scroll anchor -->
          <div ref="bottomAnchor" style="height:1px;flex-shrink:0"/>
        </div>

        <!-- ── Preview bar (image/file pending) ── -->
        <Transition name="slide-up">
          <div v-if="pendImg" class="aux-bar">
            <img :src="pendPrev" class="aux-thumb" />
            <div class="aux-meta">
              <span class="aux-name">{{ pendImg.name }}</span>
              <span class="aux-sz">{{ fmtSize(pendImg.size) }}</span>
            </div>
            <button class="hdr-btn" @click="clearPend">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </Transition>

        <!-- ── Reply bar ── -->
        <Transition name="slide-up">
          <div v-if="replyTo" class="aux-bar reply-aux">
            <div class="reply-accent"/>
            <div class="aux-meta">
              <span class="aux-who">{{ replyTo.sender_id===authStore.user?.id?'You':activeConv.name }}</span>
              <span class="aux-name">{{ (replyTo.content||'📎 Attachment').slice(0,80) }}</span>
            </div>
            <button class="hdr-btn" @click="replyTo=null">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </Transition>

        <!-- ── Recording bar ── -->
        <Transition name="slide-up">
          <div v-if="isRec" class="aux-bar rec-aux">
            <div class="rec-dot"/>
            <span class="rec-time">{{ fmtRecTime(recSecs) }}</span>
            <span class="rec-hint">Release to send</span>
            <button class="hdr-btn" @click="cancelRec">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </Transition>

        <!-- ── Input bar ── -->
        <div class="inp-bar" ref="inpBarEl">
          <button class="hdr-btn attach-btn" @click="trigFile">
            <span class="material-symbols-outlined">attach_file</span>
          </button>
          <input ref="fileEl" type="file" class="hidden-f"
            accept="image/*,video/*,application/pdf,application/zip,audio/*"
            @change="onFile" />
          <div class="inp-wrap" :class="{ focused: inputFocused }">
            <textarea
              ref="txtEl"
              v-model="msg"
              class="inp-ta"
              placeholder="Message"
              rows="1"
              @input="onInput"
              @focus="inputFocused=true; scrollToBottom()"
              @blur="inputFocused=false"
              @keydown.enter.exact.prevent="send"
              @keydown.enter.shift.exact="() => {}"
            />
          </div>
          <Transition name="btn-swap">
            <button v-if="canSend" key="send" class="send-btn" @click="send">
              <span class="material-symbols-outlined">send</span>
            </button>
            <button v-else key="mic" class="mic-btn" :class="{ rec: isRec }"
              @mousedown="startRec" @mouseup="stopRec"
              @touchstart.prevent="startRec" @touchend.prevent="stopRec">
              <span class="material-symbols-outlined">mic</span>
            </button>
          </Transition>
        </div>

      </template>

      <!-- Empty state -->
      <div v-else class="chat-empty">
        <div class="empty-ico">
          <span class="material-symbols-outlined" style="font-size:2.5rem">forum</span>
        </div>
        <p class="empty-title">Your Messages</p>
        <p class="empty-sub">Select a conversation to start chatting</p>
      </div>
    </div>

    <!-- ── Emoji picker ── -->
    <Teleport to="body">
      <div v-if="emojiP.show" class="emoji-pop"
        :style="{top:emojiP.y+'px',left:emojiP.x+'px'}"
        v-click-outside="()=>emojiP.show=false">
        <button v-for="e in EMOJIS" :key="e" class="ep-btn"
          @click="doReact(emojiP.msg,e);emojiP.show=false">{{ e }}</button>
      </div>
    </Teleport>

    <!-- ── Context menu ── -->
    <Teleport to="body">
      <Transition name="ctx">
        <div v-if="ctx.show" class="ctx-menu"
          :style="{top:ctx.y+'px',left:ctx.x+'px'}"
          v-click-outside="()=>ctx.show=false">
          <div class="ctx-emojis">
            <button v-for="e in EMOJIS" :key="e" class="ctx-e"
              @click="doReact(ctx.msg,e);ctx.show=false">{{ e }}</button>
          </div>
          <div class="ctx-sep"/>
          <button class="ctx-row" @click="setReply(ctx.msg);ctx.show=false">
            <span class="material-symbols-outlined">reply</span>Reply
          </button>
          <button class="ctx-row" @click="copyTxt(ctx.msg)">
            <span class="material-symbols-outlined">content_copy</span>Copy
          </button>
          <button v-if="ctx.msg?.mine" class="ctx-row" @click="beginEdit(ctx.msg);ctx.show=false">
            <span class="material-symbols-outlined">edit</span>Edit
          </button>
          <button v-if="ctx.msg?.mine" class="ctx-row ctx-del"
            @click="messagingStore.deleteMessage(ctx.msg.id);ctx.show=false">
            <span class="material-symbols-outlined">delete</span>Delete
          </button>
          <button class="ctx-row" @click="ctx.show=false">
            <span class="material-symbols-outlined">close</span>Cancel
          </button>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Lightbox ── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="lightbox" class="lightbox" @click="lightbox=null">
          <button class="lb-x" @click.stop="lightbox=null">
            <span class="material-symbols-outlined">close</span>
          </button>
          <img :src="lightbox" class="lb-img" @click.stop />
        </div>
      </Transition>
    </Teleport>

    <!-- ── Incoming call (handled by CallView) ── -->
    <CallView ref="callViewRef" />

  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useMessagingStore } from '@/store/messaging'
import { useAuthStore } from '@/store/auth'
import { useRoute } from 'vue-router'
import CallView from './CallView.vue'

const messagingStore = useMessagingStore()
const authStore = useAuthStore()
const route = useRoute()

// ── Call ref ──
const callViewRef = ref(null)

const EMOJIS = ['👍','❤️','😂','😮','😢','🔥','🚀']

// ── State ──
const search = ref(''), msg = ref('')
const msgsEl = ref(null), bottomAnchor = ref(null)
const txtEl = ref(null), fileEl = ref(null), inpBarEl = ref(null)
const showMenu = ref(false), showSearch = ref(false), msgQ = ref('')
const replyTo = ref(null), lightbox = ref(null), incCall = ref(null)
const pendImg = ref(null), pendPrev = ref(null)
const editId = ref(null), inputFocused = ref(false)
const ctx = ref({ show:false, x:0, y:0, msg:null })
const emojiP = ref({ show:false, x:0, y:0, msg:null })
const isRec = ref(false), recSecs = ref(0), playingId = ref(null)
const voiceProg = ref({})
const voiceAudios = {} // { messageId: Audio } — cleaned up on unmount
let mediaRec=null, recChunks=[], recTimer=null
let touchTimer=null, searchTimer=null, typingTimer=null, activeAudio=null
const MAX_VOICE_CACHE = 10 // max cached audio elements to prevent memory leak

const activeConv  = computed(() => messagingStore.activeConversation)
const canSend     = computed(() => msg.value.trim().length > 0 || !!pendImg.value)
const filteredConvs = computed(() => {
  const q = search.value.toLowerCase()
  return messagingStore.conversations.filter(c => !q || c.name?.toLowerCase().includes(q))
})

// ── Lifecycle ──
onMounted(async () => {
  await messagingStore.fetchConversations()

  // ── WhatsApp keyboard technique ──
  // Set msg-root height = visualViewport.height directly.
  // The flex column (header → msgs → input) then reflows naturally.
  // No position:fixed tricks, no CSS padding hacks.
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', _onVV)
    window.visualViewport.addEventListener('scroll', _onVV)
    _onVV() // set initial height immediately
  }

  const convId = route.query.conv
  if (convId) {
    const found = messagingStore.conversations.find(c => c.id === convId)
    if (found) selectConv(found)
    else {
      await messagingStore.fetchConversations()
      const fresh = messagingStore.conversations.find(c => c.id === convId)
      if (fresh) selectConv(fresh)
    }
  }
})

onUnmounted(() => {
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', _onVV)
    window.visualViewport.removeEventListener('scroll', _onVV)
  }
  // Reset root positioning
  const root = document.querySelector('.msg-root')
  if (root) {
    root.style.position = ''
    root.style.top = ''
    root.style.left = ''
    root.style.width = ''
    root.style.height = ''
  }
  cancelRec()
  // Cleanup all cached audio elements
  if (activeAudio) { activeAudio.pause(); activeAudio = null }
  Object.values(voiceAudios).forEach(a => { a.pause(); a.src = '' })
  Object.keys(voiceAudios).forEach(k => delete voiceAudios[k])
})

function _onVV() {
  const vv = window.visualViewport
  const root = document.querySelector('.msg-root')
  if (!root) return

  // Pin the root to exactly the visible viewport area
  // This is the correct WhatsApp/iOS technique:
  // - offsetTop = how far the viewport has been pushed down (by keyboard)
  // - height = visible height (shrinks when keyboard opens)
  root.style.position = 'fixed'
  root.style.top = vv.offsetTop + 'px'
  root.style.left = vv.offsetLeft + 'px'
  root.style.width = vv.width + 'px'
  root.style.height = vv.height + 'px'

  // Always scroll messages to bottom when viewport changes
  scrollToBottom()
}

// ── Helpers ──
function showDate(idx) {
  if (idx === 0) return true
  const m = messagingStore.messages
  return new Date(m[idx-1]?.created_at).toDateString() !== new Date(m[idx]?.created_at).toDateString()
}
function fmtDate(d) {
  if (!d) return ''
  const dt = new Date(d), now = new Date(), yest = new Date()
  yest.setDate(yest.getDate() - 1)
  if (dt.toDateString() === now.toDateString())  return 'Today'
  if (dt.toDateString() === yest.toDateString()) return 'Yesterday'
  return dt.toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' })
}
function renderTxt(t) {
  if (!t) return ''
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener" class="msg-lnk">$1</a>')
    .replace(/\n/g, '<br/>')
}
function fmtSize(b) {
  if (!b) return ''
  return b < 1024 ? b+' B' : b < 1048576 ? (b/1024).toFixed(1)+' KB' : (b/1048576).toFixed(1)+' MB'
}
function fmtRecTime(s) {
  return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`
}
function isImgOnly(m) { return m.message_type==='image' && m.media_url && !m.is_deleted }
function hasRxn(m)    { return m.reactions && Object.values(m.reactions).some(u=>u.length>0) }
function closeAll()   { ctx.value.show=false; emojiP.value.show=false }
function scrollToBottom() {
  // Immediate scroll first
  if (msgsEl.value) {
    msgsEl.value.scrollTop = msgsEl.value.scrollHeight
  }
  // Then again after DOM update
  nextTick(() => {
    if (msgsEl.value) {
      msgsEl.value.scrollTop = msgsEl.value.scrollHeight
    }
  })
}
function scrollToMsg(id) {
  document.getElementById(`m-${id}`)?.scrollIntoView({ behavior:'smooth', block:'center' })
}

// ── Conversations ──
function selectConv(conv) {
  messagingStore.setActiveConversation(conv)
  showMenu.value = false; showSearch.value = false; replyTo.value = null
  scrollToBottom()
}
async function deleteChat() {
  if (!activeConv.value) return
  await messagingStore.deleteConversation(activeConv.value.id)
  showMenu.value = false
}
function onScroll() {
  if (msgsEl.value?.scrollTop === 0 && !messagingStore.loading) {
    const page = Math.ceil(messagingStore.messages.length / 50) + 1
    if (activeConv.value) messagingStore.fetchMessages(activeConv.value.id, page)
  }
}

// ── Input ──
function onInput() {
  autoResize()
  if (msg.value.trim().length === 0) {
    // Cleared — stop typing immediately
    clearTimeout(typingTimer)
    typingTimer = null
    messagingStore.sendStopTyping()
    return
  }
  // Only send typing_start once per session, not on every keystroke
  if (!typingTimer) {
    messagingStore.sendTyping()
  }
  // Auto-stop after 2.5s of inactivity
  clearTimeout(typingTimer)
  typingTimer = setTimeout(() => {
    messagingStore.sendStopTyping()
    typingTimer = null
  }, 2500)
}
function autoResize() {
  if (!txtEl.value) return
  txtEl.value.style.height = 'auto'
  txtEl.value.style.height = Math.min(txtEl.value.scrollHeight, 120) + 'px'
}

// ── Send ──
async function send() {
  if (!activeConv.value) return
  clearTimeout(typingTimer)
  typingTimer = null
  messagingStore.sendStopTyping()
  if (pendImg.value) { await sendAttachment(); return }
  const content = msg.value.trim()
  if (!content) return
  msg.value = ''; if (txtEl.value) txtEl.value.style.height = 'auto'
  if (editId.value) {
    await messagingStore.editMessage(editId.value, content)
    editId.value = null; replyTo.value = null; scrollToBottom(); return
  }
  await messagingStore.sendMessage({ content, message_type:'text', reply_to_id: replyTo.value?.id||null })
  replyTo.value = null; scrollToBottom()
}

// ── File ──
function trigFile() { fileEl.value?.click() }
function onFile(e) {
  const f = e.target.files?.[0]; if (!f) return
  pendImg.value = f; pendPrev.value = URL.createObjectURL(f)
  if (fileEl.value) fileEl.value.value = ''
}
function clearPend() {
  if (pendPrev.value) URL.revokeObjectURL(pendPrev.value)
  pendImg.value = null; pendPrev.value = null
}
async function sendAttachment() {
  const f = pendImg.value; clearPend()
  try {
    const r = await messagingStore.uploadAttachment(f)
    const isAudio = f.type.startsWith('audio/')
    const isVideo = f.type.startsWith('video/')
    await messagingStore.sendMessage({
      content: '',
      message_type: isAudio ? 'voice' : isVideo ? 'video' : r.is_image ? 'image' : 'file',
      media_url: r.url, file_name: r.file_name, file_size: r.file_size,
      reply_to_id: replyTo.value?.id || null
    })
    replyTo.value = null; scrollToBottom()
  } catch (e) { console.error(e) }
}

// ── Voice recording ──
async function startRec() {
  if (isRec.value) return
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    recChunks = []; mediaRec = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })
    mediaRec.ondataavailable = e => { if (e.data.size > 0) recChunks.push(e.data) }
    mediaRec.start(100); isRec.value = true; recSecs.value = 0
    recTimer = setInterval(() => recSecs.value++, 1000)
  } catch { alert('Microphone permission required') }
}
async function stopRec() {
  if (!isRec.value || !mediaRec) return
  clearInterval(recTimer); isRec.value = false
  await new Promise(res => { mediaRec.onstop=res; mediaRec.stop(); mediaRec.stream?.getTracks().forEach(t=>t.stop()) })
  if (recSecs.value < 1) { recChunks = []; return }
  const blob = new Blob(recChunks, { type: 'audio/webm' })
  const f = new File([blob], `voice-${Date.now()}.webm`, { type: 'audio/webm' })
  recChunks = []; pendImg.value = f
  await sendAttachment()
}
function cancelRec() {
  clearInterval(recTimer); isRec.value = false; recSecs.value = 0; recChunks = []
  if (mediaRec) { try { mediaRec.stop(); mediaRec.stream?.getTracks().forEach(t=>t.stop()) } catch {} mediaRec = null }
}

// ── Voice playback ──
function toggleVoice(m) {
  if (!m.media_url) return
  if (playingId.value === m.id) { activeAudio?.pause(); playingId.value = null; return }
  if (activeAudio) { activeAudio.pause(); activeAudio = null }
  playingId.value = m.id
  let a = voiceAudios[m.id]
  if (!a) {
    // Evict oldest cached audio if over limit
    const keys = Object.keys(voiceAudios)
    if (keys.length >= MAX_VOICE_CACHE) {
      const oldKey = keys[0]
      voiceAudios[oldKey]?.pause()
      voiceAudios[oldKey].src = ''
      delete voiceAudios[oldKey]
    }
    a = new Audio(m.media_url)
    voiceAudios[m.id] = a
    a.ontimeupdate = () => voiceProg.value = { ...voiceProg.value, [m.id]: a.currentTime / (a.duration||1) }
    a.onended = () => { playingId.value = null; voiceProg.value = { ...voiceProg.value, [m.id]: 0 } }
  }
  activeAudio = a; a.currentTime = 0; a.play().catch(() => playingId.value = null)
}
function barH(id, b) { const s=[...(id||'')].reduce((a,c)=>a+c.charCodeAt(0),0); return 4+((s*b*7+b*13)%14) }
function barProg(id, b) { return b/24 <= (voiceProg.value[id]||0) }
function voiceDur(m) { const a=voiceAudios[m.id]; return (a?.duration&&isFinite(a.duration))?fmtRecTime(Math.round(a.duration)):'0:00' }

// ── Reactions ──
async function doReact(m, emoji) {
  if (!activeConv.value || !m) return
  if (!m.reactions) m.reactions = {}
  const uid = authStore.user?.id
  if (!m.reactions[emoji]) m.reactions[emoji] = []
  const i = m.reactions[emoji].indexOf(uid)
  if (i > -1) m.reactions[emoji].splice(i, 1); else m.reactions[emoji].push(uid)
  try { await messagingStore.reactToMessage(activeConv.value.id, m.id, emoji) } catch {}
}

// ── Reply ──
function setReply(m) { replyTo.value = m; nextTick(() => txtEl.value?.focus()) }

// ── Retry failed message ──
async function retrySend(m) {
  // Remove the failed message and re-send
  messagingStore.messages = messagingStore.messages.filter(x => x.id !== m.id)
  try {
    await messagingStore.sendMessage({
      content: m.content,
      message_type: m.message_type || 'text',
      media_url: m.media_url || null,
      file_name: m.file_name || null,
      file_size: m.file_size || null,
    })
  } catch { /* show failed again */ }
}

// ── Context menu ──
function openCtx(m, e) {
  ctx.value.show = false; emojiP.value.show = false
  nextTick(() => {
    const x = Math.min(e.clientX, window.innerWidth - 210)
    const y = Math.min(e.clientY, window.innerHeight - 330)
    ctx.value = { show:true, x, y, msg:m }
  })
}
function openEmoji(m) {
  const el = document.getElementById(`m-${m.id}`)
  if (!el) return
  const r = el.getBoundingClientRect()
  emojiP.value = { show:true, x:Math.min(r.left, window.innerWidth-280), y:r.top-60, msg:m }
}
function copyTxt(m) {
  if (m?.content) navigator.clipboard.writeText(m.content).catch(() => {})
  ctx.value.show = false
}
function beginEdit(m) { msg.value = m.content||''; editId.value = m.id; nextTick(() => txtEl.value?.focus()) }

// ── Touch long-press ──
function touchStart(m, e) {
  touchTimer = setTimeout(() => openCtx(m, { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }), 500)
}
function touchEnd() { clearTimeout(touchTimer) }

// ── Search ──
function toggleSearch() {
  showSearch.value = !showSearch.value
  if (!showSearch.value) { msgQ.value = ''; messagingStore.searchMessages('') }
}
function closeSearch() { showSearch.value = false; msgQ.value = '' }
function debounceSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => messagingStore.searchMessages(msgQ.value), 300)
}

// ── Calls — now handled by CallView component ──
function startCall(type) {
  if (!activeConv.value) return
  callViewRef.value?.startCall(type, activeConv.value)
}
function rejectCall() { if (incCall.value) { messagingStore.sendCallSignal('call_reject',{to:incCall.value.from}); incCall.value=null } }
function acceptCall() { if (incCall.value) { messagingStore.sendCallSignal('call_accept',{to:incCall.value.from}); incCall.value=null } }

watch(() => messagingStore.callEvent, e => {
  if (!e) return
  if (e.type === 'incoming_call') incCall.value = e
  else if (['call_ended','call_rejected'].includes(e.type)) incCall.value = null
  messagingStore.clearCallEvent()
})
watch(() => messagingStore.messages.length, () => scrollToBottom())
</script>

<style scoped>
/* ══════════════════════════════════════════
   ROOT
══════════════════════════════════════════ */
.msg-root {
  display: flex;
  overflow: hidden;
  background: var(--background);
  height: calc(100vh - 72px);
}
@media (max-width: 767px) {
  /* JS overrides position/size with visualViewport values when keyboard opens */
  .msg-root {
    position: fixed;
    top: 0; left: 0;
    width: 100%;
    height: 100svh;
    height: 100vh; /* fallback */
  }
}

/* ══════════════════════════════════════════
   CONVERSATION SIDEBAR
══════════════════════════════════════════ */
.conv-side {
  width: 340px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--surface-container-lowest);
  border-right: 1px solid var(--outline-variant);
}
.conv-topbar {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .875rem 1rem .625rem;
  flex-shrink: 0;
  border-bottom: 1px solid var(--outline-variant);
}
.conv-back-btn {
  display: none;
  width: 36px; height: 36px;
  border-radius: 50%;
  align-items: center; justify-content: center;
  color: var(--on-surface-variant);
  text-decoration: none;
  transition: background .12s;
  flex-shrink: 0;
}
.conv-back-btn:hover { background: rgba(168,85,247,.08); color: var(--primary); }
.conv-back-btn .material-symbols-outlined { font-size: 22px; }
@media (max-width: 767px) { .conv-back-btn { display: flex; } }
.conv-title {
  font-family: var(--font-headline);
  font-size: 1.1rem; font-weight: 800;
  color: var(--on-surface); flex: 1;
}
.conv-badge {
  min-width: 20px; height: 20px; border-radius: 10px;
  background: var(--primary); color: #fff;
  font-size: .62rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  padding: 0 5px;
}

/* Search */
.conv-search-wrap {
  position: relative;
  padding: .625rem .875rem;
  flex-shrink: 0;
}
.conv-search-ico {
  position: absolute; left: 1.5rem; top: 50%;
  transform: translateY(-50%);
  font-size: 17px; color: var(--on-surface-variant);
  pointer-events: none;
}
.conv-search {
  width: 100%;
  padding: .5rem .875rem .5rem 2.25rem;
  background: var(--surface-container);
  border: 1.5px solid transparent;
  border-radius: 999px;
  font-size: .85rem; color: var(--on-surface);
  outline: none; transition: border-color .15s;
}
.conv-search:focus { border-color: var(--primary); }

/* Conv list */
.conv-list { flex: 1; overflow-y: auto; }
.conv-skel { display: flex; align-items: center; gap: .75rem; padding: .75rem 1rem; }
.skel-av { width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0; }
.skel-lines { flex: 1; display: flex; flex-direction: column; gap: .4rem; }
.skel-l1 { height: 12px; border-radius: 4px; width: 60%; }
.skel-l2 { height: 10px; border-radius: 4px; width: 40%; }
.shimmer {
  background: linear-gradient(90deg,var(--surface-container) 25%,var(--surface-container-high) 50%,var(--surface-container) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* Conv item */
.conv-item {
  display: flex; align-items: center; gap: .75rem;
  padding: .75rem 1rem;
  cursor: pointer;
  transition: background .12s;
  border-bottom: 1px solid var(--outline-variant);
}
.conv-item:hover { background: var(--surface-container-low); }
.conv-item.active { background: color-mix(in srgb,var(--primary) 8%,transparent); }

/* Avatars */
.cv-av {
  position: relative;
  width: 48px; height: 48px;
  border-radius: 50%;
  background: var(--primary-fixed);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; overflow: hidden;
}
.cv-av-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.cv-av-ini {
  font-family: var(--font-headline);
  font-weight: 700; color: var(--primary);
  font-size: .95rem; line-height: 1;
}
.cv-av-ini.sm { font-size: .8rem; }
.cv-av-ini.xs { font-size: .65rem; }
.cv-av-ini.lg { font-size: 1.6rem; }
.cv-dot {
  position: absolute; bottom: 2px; right: 2px;
  width: 12px; height: 12px; border-radius: 50%;
  background: #22c55e;
  border: 2.5px solid var(--surface-container-lowest);
}

.cv-body { flex: 1; min-width: 0; }
.cv-top  { display: flex; justify-content: space-between; align-items: baseline; }
.cv-name {
  font-size: .9rem; font-weight: 600;
  color: var(--on-surface);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.cv-time { font-size: .68rem; color: var(--on-surface-variant); flex-shrink: 0; margin-left: .5rem; }
.cv-bot  { display: flex; justify-content: space-between; align-items: center; margin-top: .2rem; }
.cv-prev {
  font-size: .8rem; color: var(--on-surface-variant);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  display: flex; align-items: center; gap: .25rem;
}
.cv-prev.typing { color: #22c55e; font-style: italic; }
.cv-badge-sm {
  min-width: 19px; height: 19px; border-radius: 9px;
  background: #22c55e; color: #fff;
  font-size: .6rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  padding: 0 4px; flex-shrink: 0; margin-left: .35rem;
}
/* Typing dots in conv list */
.cv-typing-dots { display: inline-flex; align-items: center; gap: 2px; }
.cv-typing-dots i {
  width: 5px; height: 5px; border-radius: 50%;
  background: #22c55e; display: block;
  animation: td 1.2s infinite;
}
.cv-typing-dots i:nth-child(2) { animation-delay: .15s; }
.cv-typing-dots i:nth-child(3) { animation-delay: .3s; }
.conv-empty {
  display: flex; flex-direction: column; align-items: center; gap: .5rem;
  padding: 3rem 1rem; color: var(--on-surface-variant); font-size: .875rem;
}

/* ══════════════════════════════════════════
   CHAT WINDOW
══════════════════════════════════════════ */
.chat-win {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column;
  overflow: hidden; position: relative;
  background: var(--background);
}
/* Subtle dot background pattern */
.chat-win::before {
  content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background-image: radial-gradient(circle, color-mix(in srgb,var(--primary) 5%,transparent) 1px, transparent 0);
  background-size: 22px 22px;
}

/* Mobile responsive */
@media (max-width: 767px) {
  .conv-side { width: 100%; }
  .conv-hidden { display: none !important; }
  .chat-win { display: none; }
  .chat-active { display: flex !important; }
  .ch-back { display: flex !important; }
}

/* ── Header ── */
.chat-hdr {
  display: flex; align-items: center; gap: .5rem;
  padding: .625rem .875rem;
  background: var(--surface-container-lowest);
  border-bottom: 1px solid var(--outline-variant);
  flex-shrink: 0;
  position: relative; z-index: 20;
  box-shadow: 0 1px 0 var(--outline-variant);
}
.ch-back { display: none; }
.ch-av {
  position: relative;
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--primary-fixed);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; flex-shrink: 0;
}
.ch-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.ch-name {
  font-size: .95rem; font-weight: 700;
  color: var(--on-surface);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.ch-status { font-size: .72rem; color: var(--on-surface-variant); display: flex; align-items: center; gap: .25rem; }
.ch-status.online { color: #22c55e; }
.ch-acts { display: flex; align-items: center; gap: .1rem; }

/* Typing inline in header */
.typing-inline { display: inline-flex; align-items: center; gap: 2px; }
.typing-inline i {
  width: 4px; height: 4px; border-radius: 50%;
  background: currentColor; display: block;
  animation: td 1.2s infinite;
}
.typing-inline i:nth-child(2) { animation-delay: .15s; }
.typing-inline i:nth-child(3) { animation-delay: .3s; }

/* Header icon buttons */
.hdr-btn {
  width: 38px; height: 38px; border-radius: 50%;
  background: none; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--on-surface-variant);
  transition: background .12s, color .12s;
  flex-shrink: 0;
}
.hdr-btn:hover { background: rgba(168,85,247,.08); color: var(--primary); }
.hdr-btn.active { background: rgba(168,85,247,.12); color: var(--primary); }
.hdr-btn.sm { width: 30px; height: 30px; }
.hdr-btn .material-symbols-outlined,
.hdr-btn .material-symbols-outlined { font-size: 21px; }
.attach-btn { color: var(--on-surface-variant); }

/* Dropdown menu */
.more-wrap { position: relative; }
.drop-menu {
  position: absolute; top: calc(100% + 6px); right: 0; z-index: 200;
  min-width: 190px;
  background: var(--surface-container-high);
  border: 1px solid var(--outline-variant);
  border-radius: 14px;
  box-shadow: 0 8px 28px rgba(0,0,0,.25);
  padding: .35rem; display: flex; flex-direction: column;
}
.drop-item {
  display: flex; align-items: center; gap: .6rem;
  padding: .6rem .875rem; border: none; background: none;
  border-radius: 10px; font-size: .85rem; font-weight: 500;
  color: var(--on-surface); cursor: pointer; text-align: left;
}
.drop-item:hover { background: var(--surface-container); }
.drop-item.danger { color: #ef4444; }
.drop-item .material-symbols-outlined { font-size: 18px; color: var(--on-surface-variant); }
.drop-item.danger .material-symbols-outlined { color: #ef4444; }
.drop-div { height: 1px; background: var(--outline-variant); margin: .25rem 0; }

/* Search bar */
.srch-bar {
  display: flex; align-items: center; gap: .5rem;
  padding: .5rem .875rem;
  background: var(--surface-container-low);
  border-bottom: 1px solid var(--outline-variant);
  flex-shrink: 0; position: relative; z-index: 10;
}
.srch-inp {
  flex: 1; padding: .4rem .75rem;
  background: var(--surface-container);
  border: 1.5px solid var(--outline-variant);
  border-radius: 999px;
  font-size: .875rem; color: var(--on-surface); outline: none;
  transition: border-color .15s;
}
.srch-inp:focus { border-color: var(--primary); }
.srch-results {
  position: relative; z-index: 10;
  background: var(--surface-container-high);
  border-bottom: 1px solid var(--outline-variant);
  max-height: 180px; overflow-y: auto;
}
.srch-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: .6rem 1rem; cursor: pointer;
  border-bottom: 1px solid var(--outline-variant);
}
.srch-item:hover { background: var(--surface-container); }
.srch-text { font-size: .82rem; color: var(--on-surface); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.srch-ts { font-size: .7rem; color: var(--on-surface-variant); flex-shrink: 0; margin-left: .5rem; }

/* E2E bar */
.e2e-bar {
  display: flex; align-items: center; justify-content: center; gap: .3rem;
  padding: .3rem; font-size: .68rem;
  background: color-mix(in srgb,#22c55e 7%,transparent);
  color: var(--on-surface-variant);
  flex-shrink: 0; position: relative; z-index: 5;
}

/* ══════════════════════════════════════════
   MESSAGES AREA
══════════════════════════════════════════ */
.msgs-area {
  flex: 1; min-height: 0;
  overflow-y: auto; overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding: .75rem .875rem 1rem;
  display: flex; flex-direction: column;
  gap: .2rem;
  position: relative; z-index: 1;
}

/* Skeletons */
.sk-row { display: flex; margin: .2rem 0; }
.sk-l { justify-content: flex-start; }
.sk-r { justify-content: flex-end; }
.sk-bub { height: 44px; border-radius: 18px; flex-shrink: 0; }

/* Date chip */
.date-chip {
  display: flex; justify-content: center;
  margin: .625rem 0 .375rem; flex-shrink: 0;
}
.date-chip span {
  background: color-mix(in srgb,var(--on-surface) 10%,transparent);
  color: var(--on-surface-variant);
  font-size: .7rem; font-weight: 600;
  padding: .25rem 1rem; border-radius: 999px;
  backdrop-filter: blur(8px);
}

/* ── Message row ── */
.msg-row {
  display: flex; align-items: flex-end; gap: .375rem;
  max-width: 80%; position: relative;
  align-self: flex-start;
  /* Group spacing */
  margin-bottom: 2px;
}
.msg-row.mine {
  align-self: flex-end;
  flex-direction: row-reverse;
}
@media (max-width: 767px) { .msg-row { max-width: 90%; } }

/* Avatar */
.msg-av {
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  background: var(--primary-fixed);
  overflow: hidden; display: flex; align-items: center; justify-content: center;
  align-self: flex-end; margin-bottom: 2px;
}

.msg-col { display: flex; flex-direction: column; gap: .15rem; min-width: 0; }
.msg-row:hover .msg-actions { opacity: 1; pointer-events: all; }

/* Reply snap */
.reply-snap {
  display: flex; gap: .4rem;
  border-radius: 10px; padding: .35rem .5rem .35rem;
  cursor: pointer; margin-bottom: .2rem;
  max-width: 260px;
}
.rs-mine   { background: rgba(0,0,0,.15); }
.rs-theirs { background: rgba(0,0,0,.06); }
:global([data-theme="dark"]) .rs-theirs { background: rgba(255,255,255,.08); }
.rs-bar { width: 3px; border-radius: 2px; background: var(--primary); flex-shrink: 0; align-self: stretch; }
.rs-body { display: flex; flex-direction: column; gap: .1rem; min-width: 0; overflow: hidden; }
.rs-who  { font-size: .7rem; font-weight: 700; color: var(--primary); }
.rs-txt  { font-size: .77rem; color: var(--on-surface-variant); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ── Bubble ── */
.bubble {
  padding: .5rem .875rem .4rem;
  border-radius: 18px;
  word-break: break-word;
  min-width: 52px; max-width: 100%;
  box-shadow: 0 1px 2px rgba(0,0,0,.12);
  position: relative;
}
/* Sent — purple with bottom-right nub */
.bub-mine {
  background: var(--primary);
  color: #fff;
  border-bottom-right-radius: 5px;
}
/* Received — light card with bottom-left nub */
.bub-theirs {
  background: #eeeef5;
  color: #1a1a2e;
  border-bottom-left-radius: 5px;
}
:global([data-theme="dark"]) .bub-theirs {
  background: #252538;
  color: rgba(255,255,255,.93);
}
.bub-del   { opacity: .6; }
.bub-media { padding: .35rem .35rem .45rem; }
.del-msg {
  font-size: .82rem; font-style: italic; opacity: .7;
  display: flex; align-items: center; gap: .3rem;
}

/* Image inside bubble */
.bub-img-wrap {
  border-radius: 12px; overflow: hidden;
  max-width: 240px; cursor: pointer;
  line-height: 0;
}
.bub-img {
  width: 100%; display: block;
  max-height: 260px; object-fit: cover;
  border-radius: 12px;
}
/* Video inside bubble */
.bub-vid-wrap { border-radius: 12px; overflow: hidden; max-width: 260px; line-height: 0; }
.bub-vid { width: 100%; display: block; max-height: 220px; border-radius: 12px; background: #000; outline: none; }

/* Text */
.bub-txt {
  font-size: .9rem; line-height: 1.5;
  margin: 0; white-space: pre-wrap;
}
.bub-mine  :deep(.msg-lnk) { color: #c4b5fd; text-decoration: underline; }
.bub-theirs :deep(.msg-lnk) { color: var(--primary); text-decoration: underline; }
.bub-edited { font-size: .6rem; opacity: .55; font-style: italic; }

/* Footer: time + ticks */
.bub-foot {
  display: flex; align-items: center; justify-content: flex-end;
  gap: .2rem; margin-top: .25rem;
}
.bub-ts   { font-size: .65rem; opacity: .7; line-height: 1; }
.tick-ico { font-size: 14px; line-height: 1; }
.bub-ticks.seen  .tick-ico { color: #c4b5fd; }
.bub-ticks.delivered .tick-ico { color: rgba(255,255,255,.7); }
.bub-failed { cursor: pointer; display: flex; align-items: center; }

/* Voice player */
.voice-player {
  display: flex; align-items: center; gap: .5rem;
  min-width: 185px; max-width: 250px; padding: .2rem 0;
}
.vp-play {
  width: 36px; height: 36px; border-radius: 50%;
  border: none; cursor: pointer; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.vp-mine  .vp-play { background: rgba(255,255,255,.22); color: #fff; }
.vp-theirs .vp-play { background: var(--primary); color: #fff; }
.vp-waves { display: flex; align-items: center; gap: 2px; height: 26px; flex: 1; }
.vp-bar {
  width: 3px; border-radius: 2px;
  background: currentColor;
  transition: opacity .1s;
}
.vp-mine   .vp-waves { color: rgba(255,255,255,.85); }
.vp-theirs .vp-waves { color: var(--primary); }
.vp-time { font-size: .68rem; font-weight: 600; opacity: .75; min-width: 30px; }

/* File chip */
.file-chip {
  display: flex; align-items: center; gap: .6rem;
  padding: .5rem .75rem; border-radius: 12px;
  text-decoration: none; max-width: 240px;
}
.fc-mine   { background: rgba(255,255,255,.18); color: #fff; }
.fc-theirs { background: var(--surface-container); color: var(--on-surface); }
.fc-ico    { font-size: 26px; }
.fc-info   { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.fc-name   { font-size: .8rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fc-sz     { font-size: .68rem; opacity: .7; }
.fc-dl     { font-size: 20px; opacity: .75; }

/* Reactions */
.rxns { display: flex; flex-wrap: wrap; gap: .25rem; margin-top: .3rem; }
.rxns-r { justify-content: flex-end; }
.rxn-chip {
  padding: .15rem .45rem; border-radius: 999px;
  border: 1px solid var(--outline-variant);
  background: var(--surface-container);
  font-size: .82rem; cursor: pointer;
  display: flex; align-items: center; gap: .15rem;
  transition: border-color .12s;
}
.rxn-chip:hover { border-color: var(--primary); }
.rxn-chip.rxn-mine {
  background: color-mix(in srgb,var(--primary) 12%,transparent);
  border-color: var(--primary);
}
.rxn-cnt { font-size: .7rem; font-weight: 700; color: var(--on-surface-variant); }

/* Quick hover actions */
.msg-actions {
  display: flex; align-items: center; gap: .15rem;
  opacity: 0; pointer-events: none;
  transition: opacity .15s;
  position: absolute; top: 50%; transform: translateY(-50%);
}
/* Received messages: actions appear on the right */
.msg-row:not(.mine) .msg-actions { left: calc(100% + 4px); }
/* Sent messages: actions appear on the left */
.msg-row.mine .msg-actions { right: calc(100% + 4px); }
/* On mobile: always show (tap to reveal via touch) */
@media (max-width: 767px) {
  .msg-actions { display: none; }
}
.ma-btn {
  width: 26px; height: 26px; border-radius: 50%; border: none;
  background: var(--surface-container-high);
  color: var(--on-surface-variant);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.ma-btn:hover { background: var(--primary); color: #fff; }
.ma-btn .material-symbols-outlined { font-size: 14px; }

/* Typing indicator */
.typing-row {
  display: flex; align-items: flex-end; gap: .375rem;
  align-self: flex-start; margin-top: .25rem;
}
.typing-bub {
  display: flex; align-items: center; gap: 4px;
  padding: .55rem .875rem;
  background: #eeeef5;
  border-radius: 18px; border-bottom-left-radius: 5px;
  box-shadow: 0 1px 2px rgba(0,0,0,.1);
}
:global([data-theme="dark"]) .typing-bub { background: #252538; }
.td {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--on-surface-variant);
  animation: td 1.3s ease-in-out infinite;
}
.td:nth-child(2) { animation-delay: .18s; }
.td:nth-child(3) { animation-delay: .36s; }
@keyframes td {
  0%,60%,100% { transform: translateY(0); opacity: .4; }
  30% { transform: translateY(-5px); opacity: 1; }
}

/* ══════════════════════════════════════════
   AUX BARS (preview / reply / recording)
══════════════════════════════════════════ */
.aux-bar {
  display: flex; align-items: center; gap: .625rem;
  padding: .5rem .875rem;
  background: var(--surface-container-low);
  border-top: 1px solid var(--outline-variant);
  flex-shrink: 0; position: relative; z-index: 15;
}
.aux-thumb {
  width: 42px; height: 42px;
  border-radius: 10px; object-fit: cover; flex-shrink: 0;
}
.aux-meta { flex: 1; display: flex; flex-direction: column; min-width: 0; gap: 2px; }
.aux-who  { font-size: .72rem; font-weight: 700; color: var(--primary); }
.aux-name { font-size: .8rem; font-weight: 500; color: var(--on-surface); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.aux-sz   { font-size: .7rem; color: var(--on-surface-variant); }
/* Reply accent bar */
.reply-accent {
  width: 3px; align-self: stretch;
  border-radius: 2px; background: var(--primary); flex-shrink: 0;
}
/* Recording */
.rec-aux .rec-dot {
  width: 12px; height: 12px; border-radius: 50%;
  background: #ef4444; flex-shrink: 0;
  animation: pulse 1s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
.rec-time { font-family: var(--font-headline); font-size: .9rem; font-weight: 700; color: #ef4444; }
.rec-hint { flex: 1; font-size: .75rem; color: var(--on-surface-variant); }

/* ═══════════════════════════════════════════════
   MOBILE KEYBOARD-AWARE LAYOUT — WhatsApp technique
   
   JS sets msg-root height = visualViewport.height.
   When keyboard opens, root shrinks → flex column
   reflows: header stays top, msgs-area fills middle,
   inp-bar stays at bottom. No position:fixed needed.
═══════════════════════════════════════════════ */

@media (max-width: 767px) {

  /* Input bar: normal flow at bottom of flex column */
  .inp-bar {
    position: relative !important;
    flex-shrink: 0;
  }

  /* Aux bars: also normal flow above input bar */
  .aux-bar {
    position: relative !important;
    flex-shrink: 0;
  }

  /* Messages area fills remaining space */
  .msgs-area {
    padding-top: 110px !important;
    padding-bottom: 1rem !important;
  }

  /* Header FIXED at top — sits above the flex column */
  .chat-hdr {
    position: fixed !important;
    top: 0; left: 0; right: 0;
    z-index: 150;
  }

  /* E2E bar: fixed just below header */
  .e2e-bar {
    position: fixed !important;
    top: 65px; left: 0; right: 0;
    z-index: 149;
  }

  /* Search bar: fixed just below header */
  .srch-bar {
    position: fixed !important;
    top: 65px; left: 0; right: 0;
    z-index: 148;
  }
}

.inp-bar {
  display: flex; align-items: flex-end; gap: .5rem;
  padding: .625rem .875rem calc(.625rem + env(safe-area-inset-bottom,0px));
  background: var(--surface-container-lowest);
  border-top: 1px solid var(--outline-variant);
  flex-shrink: 0;
  position: relative; z-index: 20;
}
.inp-wrap {
  flex: 1;
  background: var(--surface-container-low);
  border: 1.5px solid var(--outline-variant);
  border-radius: 24px;
  padding: .55rem 1rem;
  transition: border-color .15s;
  display: flex; align-items: center;
  min-height: 44px;
}
.inp-wrap.focused { border-color: var(--primary); }
.inp-ta {
  width: 100%; background: transparent; border: none; outline: none;
  resize: none; line-height: 1.45;
  font-family: var(--font-body);
  font-size: max(.9rem, 16px); /* 16px prevents iOS auto-zoom */
  color: var(--on-surface);
  max-height: 120px; overflow-y: auto;
}
.inp-ta::placeholder { color: var(--outline); }
.hidden-f { display: none; }

.send-btn {
  width: 46px; height: 46px; border-radius: 50%;
  background: var(--primary); color: #fff; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
  box-shadow: 0 2px 12px rgba(99,14,212,.4);
  transition: transform .1s, box-shadow .1s;
}
.send-btn:active { transform: scale(.92); }
.send-btn .material-symbols-outlined { font-size: 21px; }
.mic-btn {
  width: 46px; height: 46px; border-radius: 50%;
  background: var(--surface-container); border: none;
  color: var(--on-surface-variant);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; transition: .15s;
}
.mic-btn:hover, .mic-btn:active { background: var(--primary); color: #fff; }
.mic-btn.rec { background: #ef4444; color: #fff; animation: pulse .8s ease-in-out infinite; }
.mic-btn .material-symbols-outlined { font-size: 22px; }

/* Empty state */
.chat-empty {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: .75rem; position: relative; z-index: 1;
}
.empty-ico {
  width: 80px; height: 80px; border-radius: 50%;
  background: color-mix(in srgb,var(--primary) 10%,transparent);
  display: flex; align-items: center; justify-content: center;
  color: var(--primary);
}
.empty-title { font-family: var(--font-headline); font-size: 1.15rem; font-weight: 700; color: var(--on-surface); margin: 0; }
.empty-sub   { font-size: .875rem; color: var(--on-surface-variant); margin: 0; }

/* ══════════════════════════════════════════
   OVERLAYS
══════════════════════════════════════════ */
/* Emoji picker */
.emoji-pop {
  position: fixed; z-index: 1000;
  background: var(--surface-container-high);
  border: 1px solid var(--outline-variant);
  border-radius: 16px;
  box-shadow: 0 8px 28px rgba(0,0,0,.28);
  padding: .5rem; display: flex; gap: .2rem;
}
.ep-btn {
  width: 38px; height: 38px; border-radius: 50%;
  background: none; border: none; font-size: 1.3rem;
  cursor: pointer; transition: transform .1s, background .1s;
}
.ep-btn:hover { background: var(--surface-container); transform: scale(1.25); }

/* Context menu */
.ctx-menu {
  position: fixed; z-index: 1000;
  background: var(--surface-container-high);
  border: 1px solid var(--outline-variant);
  border-radius: 16px;
  box-shadow: 0 12px 36px rgba(0,0,0,.32);
  padding: .4rem; min-width: 200px;
}
.ctx-emojis { display: flex; gap: .2rem; padding: .3rem .4rem .5rem; }
.ctx-e {
  width: 34px; height: 34px; border-radius: 50%;
  background: none; border: none; font-size: 1.1rem;
  cursor: pointer; transition: transform .1s;
}
.ctx-e:hover { background: var(--surface-container); transform: scale(1.2); }
.ctx-sep { height: 1px; background: var(--outline-variant); margin: .15rem 0; }
.ctx-row {
  display: flex; align-items: center; gap: .625rem;
  padding: .55rem .875rem; border: none; background: none;
  border-radius: 10px; font-size: .85rem; font-weight: 500;
  color: var(--on-surface); cursor: pointer; width: 100%; text-align: left;
}
.ctx-row:hover { background: var(--surface-container); }
.ctx-row .material-symbols-outlined { font-size: 18px; color: var(--on-surface-variant); }
.ctx-del { color: #ef4444; }
.ctx-del .material-symbols-outlined { color: #ef4444; }

/* Lightbox */
.lightbox {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.92); z-index: 2000;
  display: flex; align-items: center; justify-content: center;
}
.lb-x {
  position: absolute; top: 1rem; right: 1rem;
  width: 44px; height: 44px; border-radius: 50%;
  background: rgba(255,255,255,.15); border: none; color: #fff;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.lb-img { max-width: 92vw; max-height: 92vh; object-fit: contain; border-radius: 12px; }

/* ══════════════════════════════════════════
   TRANSITIONS
══════════════════════════════════════════ */
.slide-down-enter-active, .slide-down-leave-active { transition: all .2s ease; }
.slide-down-enter-from,  .slide-down-leave-to      { transform: translateY(-8px); opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: all .18s ease; }
.slide-up-enter-from,   .slide-up-leave-to     { transform: translateY(8px); opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from,   .fade-leave-to     { opacity: 0; }
.drop-enter-active, .drop-leave-active { transition: all .15s ease; }
.drop-enter-from,   .drop-leave-to     { transform: translateY(-6px) scale(.97); opacity: 0; }
.ctx-enter-active, .ctx-leave-active { transition: all .12s ease; }
.ctx-enter-from,   .ctx-leave-to     { transform: scale(.94); opacity: 0; }
.btn-swap-enter-active, .btn-swap-leave-active { transition: all .15s ease; }
.btn-swap-enter-from,   .btn-swap-leave-to     { opacity: 0; transform: scale(.65) rotate(15deg); }
</style>
