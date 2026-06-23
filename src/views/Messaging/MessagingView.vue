<template>
  <div class="msg-root">

    <!-- ═══ Conversation List ═══ -->
    <div class="conv-side" :class="{ 'conv-hidden': !!activeConv }">
      <div class="conv-topbar">
        <h2 class="conv-title">Chats</h2>
        <span v-if="messagingStore.totalUnread > 0" class="conv-badge">{{ messagingStore.totalUnread }}</span>
      </div>
      <div class="conv-search-row">
        <span class="material-symbols-outlined conv-si">search</span>
        <input v-model="search" class="conv-search" placeholder="Search…" />
      </div>
      <div class="conv-list">
        <template v-if="messagingStore.loading && !messagingStore.conversations.length">
          <div v-for="i in 5" :key="i" class="conv-skeleton">
            <div class="cs-av shimmer"></div>
            <div class="cs-lines">
              <div class="shimmer cs-l1"></div>
              <div class="shimmer cs-l2"></div>
            </div>
          </div>
        </template>
        <div v-for="conv in filteredConvs" :key="conv.id"
          class="conv-item" :class="{ active: activeConv?.id === conv.id }"
          @click="selectConv(conv)">
          <div class="cv-av">
            <img v-if="conv.avatar" :src="conv.avatar" class="cv-av-img" />
            <span v-else class="cv-av-txt">{{ (conv.name||'?')[0].toUpperCase() }}</span>
            <span v-if="conv.online" class="cv-online" />
          </div>
          <div class="cv-info">
            <div class="cv-row1">
              <span class="cv-name">{{ conv.name }}</span>
              <span class="cv-time">{{ conv.time }}</span>
            </div>
            <div class="cv-row2">
              <span class="cv-preview" :class="{ typing: messagingStore.isUserTyping(conv.id) }">
                {{ messagingStore.isUserTyping(conv.id) ? 'typing…' : (conv.last_message_content || 'Tap to chat') }}
              </span>
              <span v-if="conv.unread_count > 0" class="cv-unread">{{ conv.unread_count }}</span>
            </div>
          </div>
        </div>
        <div v-if="!filteredConvs.length && !messagingStore.loading" class="conv-empty">
          <span class="material-symbols-outlined" style="font-size:2.5rem;opacity:.3">chat_bubble_outline</span>
          <p>No conversations yet</p>
        </div>
      </div>
    </div>

    <!-- ═══ Chat Window ═══ -->
    <div class="chat-win" :class="{ 'chat-visible': !!activeConv }">
      <template v-if="activeConv">

        <!-- Header -->
        <div class="chat-hdr" @click="() => {}">
          <button class="ch-back icon-b" @click="messagingStore.setActiveConversation(null)">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div class="ch-av">
            <img v-if="activeConv.avatar" :src="activeConv.avatar" class="cv-av-img" />
            <span v-else class="cv-av-txt sm">{{ (activeConv.name||'?')[0].toUpperCase() }}</span>
            <span v-if="activeConv.online" class="cv-online" />
          </div>
          <div class="ch-info">
            <span class="ch-name">{{ activeConv.name }}</span>
            <span class="ch-status" :class="{ online: activeConv.online }">
              {{ messagingStore.isUserTyping(activeConv?.id) ? '✏️ typing…' : activeConv.online ? 'online' : 'offline' }}
            </span>
          </div>
          <div class="ch-acts">
            <button class="icon-b" @click="startCall('voice')"><span class="material-symbols-outlined">call</span></button>
            <button class="icon-b" @click="startCall('video')"><span class="material-symbols-outlined">videocam</span></button>
            <button class="icon-b" :class="{ 'icon-active': showSearch }" @click="toggleSearch">
              <span class="material-symbols-outlined">search</span>
            </button>
            <div class="more-w">
              <button class="icon-b" @click="showMenu = !showMenu"><span class="material-symbols-outlined">more_vert</span></button>
              <Transition name="drop">
                <div v-if="showMenu" class="drop-menu" v-click-outside="() => showMenu = false">
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
          <div v-if="showSearch" class="srch-bar">
            <span class="material-symbols-outlined conv-si">search</span>
            <input v-model="msgQ" class="srch-inp" placeholder="Search messages…"
              @input="debounceSearch" @keydown.escape="closeSearch" autofocus />
            <button v-if="msgQ" class="icon-b sm" @click="msgQ=''; messagingStore.searchMessages('')">
              <span class="material-symbols-outlined" style="font-size:16px">close</span>
            </button>
          </div>
        </Transition>

        <!-- Search results -->
        <Transition name="slide-down">
          <div v-if="showSearch && messagingStore.searchResults.length" class="srch-results">
            <div v-for="m in messagingStore.searchResults" :key="m.id"
              class="srch-item" @click="scrollToMsg(m.id)">
              <span class="srch-text">{{ m.content }}</span>
              <span class="srch-time">{{ m.time }}</span>
            </div>
          </div>
        </Transition>

        <!-- E2E notice -->
        <div class="e2e-bar">
          <span class="material-symbols-outlined" style="font-size:11px">lock</span>
          Messages are end-to-end encrypted
        </div>

        <!-- Messages area -->
        <div class="msgs-area" ref="msgsEl" @scroll="onScroll" @click="closeAll">
          <!-- Loading skeletons -->
          <template v-if="messagingStore.loading && !messagingStore.messages.length">
            <div v-for="i in 5" :key="i" class="sk-row" :class="i%2?'sk-r':'sk-l'">
              <div class="sk-bubble shimmer"></div>
            </div>
          </template>

          <template v-for="(msg, idx) in messagingStore.messages" :key="msg.id">
            <!-- Date separator -->
            <div v-if="showDate(idx)" class="date-sep"><span>{{ fmtDate(msg.created_at) }}</span></div>

            <!-- Message row -->
            <div :id="`m-${msg.id}`" class="msg-row" :class="{ mine: msg.mine }"
              @click.stop @contextmenu.prevent="openCtx(msg,$event)"
              @touchstart="touchStart(msg,$event)" @touchend="touchEnd">

              <!-- Other person avatar -->
              <div v-if="!msg.mine" class="msg-av">
                <img v-if="activeConv.avatar" :src="activeConv.avatar" class="cv-av-img tiny" />
                <span v-else class="cv-av-txt tiny">{{ (activeConv.name||'?')[0].toUpperCase() }}</span>
              </div>

              <div class="msg-col">
                <!-- Reply preview snapped inside bubble -->
                <div v-if="msg.reply_preview && !msg.is_deleted" class="rp-snap"
                  :class="msg.mine?'rp-mine':'rp-theirs'" @click.stop="scrollToMsg(msg.reply_preview.id)">
                  <div class="rp-bar"/>
                  <div class="rp-body">
                    <span class="rp-who">{{ msg.reply_preview.sender_id===authStore.user?.id?'You':activeConv.name }}</span>
                    <span class="rp-txt">{{ msg.reply_preview.content }}</span>
                  </div>
                </div>

                <!-- Bubble -->
                <div class="bubble" :class="[msg.mine?'b-mine':'b-theirs', {'b-del':msg.is_deleted,'b-img':isImgOnly(msg)}]">
                  <span v-if="msg.is_deleted" class="del-txt">
                    <span class="material-symbols-outlined" style="font-size:13px">block</span> This message was deleted
                  </span>
                  <template v-else>
                    <!-- Image -->
                    <div v-if="msg.message_type==='image' && msg.media_url" class="b-img-wrap" @click.stop="lightbox=msg.media_url">
                      <img :src="msg.media_url" class="b-img" />
                    </div>
                    <!-- Voice note -->
                    <div v-else-if="msg.message_type==='voice' && msg.media_url" class="voice-row" :class="msg.mine?'vr-mine':'vr-theirs'">
                      <button class="vp-btn" @click.stop="toggleVoice(msg)">
                        <span class="material-symbols-outlined">{{ playingId===msg.id?'pause':'play_arrow' }}</span>
                      </button>
                      <div class="vp-wave">
                        <div v-for="b in 22" :key="b" class="vp-bar"
                          :style="{height:barH(msg.id,b)+'px',opacity:barProg(msg.id,b)?1:0.35}"></div>
                      </div>
                      <span class="vp-dur">{{ voiceDur(msg) }}</span>
                    </div>
                    <!-- File -->
                    <a v-else-if="msg.media_url && msg.file_name" :href="msg.media_url" target="_blank"
                      class="file-chip" :class="msg.mine?'fc-mine':'fc-theirs'" @click.stop>
                      <span class="material-symbols-outlined fc-icon">description</span>
                      <div class="fc-meta">
                        <span class="fc-name">{{ msg.file_name }}</span>
                        <span class="fc-size">{{ fmtSize(msg.file_size) }}</span>
                      </div>
                      <span class="material-symbols-outlined fc-dl">download</span>
                    </a>
                    <!-- Text -->
                    <p v-else class="b-txt" v-html="renderTxt(msg.content)"></p>
                    <span v-if="msg.is_edited" class="edited">edited</span>
                  </template>

                  <!-- Time + status -->
                  <div class="b-foot">
                    <span class="bt">{{ msg.time }}</span>
                    <span v-if="msg.mine" class="btick" :class="msg.status">
                      <span v-if="msg.status==='seen'" class="material-symbols-outlined ti">done_all</span>
                      <span v-else-if="msg.status==='delivered'" class="material-symbols-outlined ti">done_all</span>
                      <span v-else class="material-symbols-outlined ti">done</span>
                    </span>
                  </div>
                </div>

                <!-- Reactions -->
                <div v-if="hasRxn(msg)" class="rxns" :class="{'rxns-mine':msg.mine}">
                  <button v-for="(users,e) in msg.reactions" :key="e" v-show="users.length>0"
                    class="rxn" :class="{'rxn-mine':users.includes(authStore.user?.id)}"
                    @click.stop="doReact(msg,e)">
                    {{ e }}<span class="rxn-n">{{ users.length }}</span>
                  </button>
                </div>

                <!-- Hover actions -->
                <div class="ha" :class="msg.mine?'ha-l':'ha-r'">
                  <button class="ha-btn" @click.stop="openEmoji(msg)"><span class="material-symbols-outlined">add_reaction</span></button>
                  <button class="ha-btn" @click.stop="setReply(msg)"><span class="material-symbols-outlined">reply</span></button>
                  <button class="ha-btn" @click.stop="openCtx(msg,$event)"><span class="material-symbols-outlined">more_vert</span></button>
                </div>
              </div>
            </div>
          </template>

          <!-- Typing bubble -->
          <div v-if="messagingStore.isUserTyping(activeConv?.id)" class="typing-row">
            <div class="typing-bub">
              <span class="td"/><span class="td"/><span class="td"/>
            </div>
            <span class="typing-name">{{ activeConv.name }} is typing…</span>
          </div>
        </div>

        <!-- Image preview bar -->
        <Transition name="slide-up">
          <div v-if="pendImg" class="prev-bar">
            <img :src="pendPrev" class="prev-thumb" />
            <div class="prev-meta">
              <span class="prev-name">{{ pendImg.name }}</span>
              <span class="prev-size">{{ fmtSize(pendImg.size) }}</span>
            </div>
            <button class="icon-b" @click="clearPend"><span class="material-symbols-outlined">close</span></button>
          </div>
        </Transition>

        <!-- Reply bar -->
        <Transition name="slide-up">
          <div v-if="replyTo" class="reply-bar">
            <div class="rb-accent"/>
            <div class="rb-body">
              <span class="rb-who">{{ replyTo.sender_id===authStore.user?.id?'You':activeConv.name }}</span>
              <span class="rb-txt">{{ (replyTo.content||'📎 Media').slice(0,80) }}</span>
            </div>
            <button class="icon-b" @click="replyTo=null"><span class="material-symbols-outlined">close</span></button>
          </div>
        </Transition>

        <!-- Recording bar -->
        <Transition name="slide-up">
          <div v-if="isRec" class="rec-bar">
            <div class="rec-dot"></div>
            <span class="rec-time">{{ fmtRecTime(recSecs) }}</span>
            <span class="rec-hint">Slide left to cancel</span>
            <button class="icon-b" @click="cancelRec"><span class="material-symbols-outlined">delete</span></button>
          </div>
        </Transition>

        <!-- Input bar -->
        <div class="inp-bar" ref="inpBarEl">
          <button class="icon-b ib-icon" @click="trigFile"><span class="material-symbols-outlined">attach_file</span></button>
          <input ref="fileEl" type="file" class="hidden-f"
            accept="image/*,application/pdf,application/zip,audio/*"
            @change="onFile" />
          <div class="inp-wrap" :class="{ 'inp-focus': inputFocused }">
            <textarea ref="txtEl" v-model="msg" class="inp-ta"
              placeholder="Message"
              rows="1"
              @input="onInput"
              @focus="inputFocused=true; scrollToBottom()"
              @blur="inputFocused=false"
              @keydown.enter.exact.prevent="send"
              @keydown.enter.shift.exact="() => {}" />
          </div>
          <Transition name="btn-swap">
            <button v-if="canSend" key="send" class="send-btn" @click="send">
              <span class="material-symbols-outlined">send</span>
            </button>
            <button v-else key="mic" class="mic-btn" :class="{ recording: isRec }"
              @mousedown="startRec" @mouseup="stopRec"
              @touchstart.prevent="startRec" @touchend.prevent="stopRec">
              <span class="material-symbols-outlined">mic</span>
            </button>
          </Transition>
        </div>

      </template>

      <!-- Empty state -->
      <div v-else class="chat-empty">
        <div class="ce-ico"><span class="material-symbols-outlined" style="font-size:3rem">forum</span></div>
        <h3>Your Messages</h3>
        <p>Select a conversation to start chatting</p>
      </div>
    </div>

    <!-- Emoji picker -->
    <Teleport to="body">
      <div v-if="emojiP.show" class="emoji-pop" :style="{top:emojiP.y+'px',left:emojiP.x+'px'}"
        v-click-outside="()=>emojiP.show=false">
        <button v-for="e in EMOJIS" :key="e" class="ep-btn" @click="doReact(emojiP.msg,e);emojiP.show=false">{{ e }}</button>
      </div>
    </Teleport>

    <!-- Context menu -->
    <Teleport to="body">
      <Transition name="ctx">
        <div v-if="ctx.show" class="ctx-menu" :style="{top:ctx.y+'px',left:ctx.x+'px'}"
          v-click-outside="()=>ctx.show=false">
          <div class="ctx-rxns">
            <button v-for="e in EMOJIS" :key="e" class="ctx-rxn" @click="doReact(ctx.msg,e);ctx.show=false">{{ e }}</button>
          </div>
          <div class="ctx-div"/>
          <button class="ctx-it" @click="setReply(ctx.msg);ctx.show=false"><span class="material-symbols-outlined">reply</span>Reply</button>
          <button class="ctx-it" @click="copyTxt(ctx.msg)"><span class="material-symbols-outlined">content_copy</span>Copy</button>
          <button v-if="ctx.msg?.mine" class="ctx-it" @click="beginEdit(ctx.msg);ctx.show=false"><span class="material-symbols-outlined">edit</span>Edit</button>
          <button v-if="ctx.msg?.mine" class="ctx-it ctx-danger" @click="messagingStore.deleteMessage(ctx.msg.id);ctx.show=false"><span class="material-symbols-outlined">delete</span>Delete</button>
          <button class="ctx-it" @click="ctx.show=false"><span class="material-symbols-outlined">close</span>Cancel</button>
        </div>
      </Transition>
    </Teleport>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="lightbox" class="lb" @click="lightbox=null">
          <button class="lb-close" @click.stop="lightbox=null"><span class="material-symbols-outlined">close</span></button>
          <img :src="lightbox" class="lb-img" @click.stop />
        </div>
      </Transition>
    </Teleport>

    <!-- Incoming call -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="incCall" class="call-ov">
          <div class="call-card">
            <div class="call-av">
              <img v-if="incCall.caller_avatar" :src="incCall.caller_avatar" class="cv-av-img"/>
              <span v-else class="cv-av-txt lg">{{ (incCall.caller_name||'?')[0] }}</span>
            </div>
            <p class="call-nm">{{ incCall.caller_name }}</p>
            <p class="call-sub">Incoming {{ incCall.call_type==='video'?'video':'voice' }} call</p>
            <div class="call-btns">
              <button class="call-rej" @click="rejectCall"><span class="material-symbols-outlined">call_end</span></button>
              <button class="call-acc" @click="acceptCall"><span class="material-symbols-outlined">call</span></button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useMessagingStore } from '@/store/messaging'
import { useAuthStore } from '@/store/auth'
import { useRoute } from 'vue-router'

const messagingStore = useMessagingStore()
const authStore = useAuthStore()
const route = useRoute()

const EMOJIS = ['👍','❤️','😂','😮','😢','🔥','🚀']

// ── State
const search = ref(''), msg = ref(''), msgsEl = ref(null)
const txtEl = ref(null), fileEl = ref(null), inpBarEl = ref(null)
const showMenu = ref(false), showSearch = ref(false), msgQ = ref('')
const replyTo = ref(null), lightbox = ref(null), incCall = ref(null)
const pendImg = ref(null), pendPrev = ref(null)
const editId = ref(null), inputFocused = ref(false)
const ctx = ref({show:false,x:0,y:0,msg:null})
const emojiP = ref({show:false,x:0,y:0,msg:null})
// Voice
const isRec = ref(false), recSecs = ref(0), playingId = ref(null)
const voiceProg = ref({}), voiceAudios = {}
let mediaRec=null, recChunks=[], recTimer=null, touchTimer=null, searchTimer=null, typingTimer=null, activeAudio=null

const activeConv = computed(() => messagingStore.activeConversation)
const canSend = computed(() => msg.value.trim().length > 0 || !!pendImg.value)
const filteredConvs = computed(() => {
  const q = search.value.toLowerCase()
  return messagingStore.conversations.filter(c => !q || c.name?.toLowerCase().includes(q))
})

// ── Keyboard-aware: move input up when keyboard opens
onMounted(async () => {
  await messagingStore.fetchConversations()
  // iOS/Android virtual keyboard detection
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', onViewport)
    window.visualViewport.addEventListener('scroll', onViewport)
  }
  // Auto-open conversation from query param
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
    window.visualViewport.removeEventListener('resize', onViewport)
    window.visualViewport.removeEventListener('scroll', onViewport)
  }
  cancelRec()
})

function onViewport() {
  // Move input bar above keyboard on mobile
  if (!inpBarEl.value) return
  const vv = window.visualViewport
  const offset = window.innerHeight - vv.height - vv.offsetTop
  inpBarEl.value.style.transform = offset > 50 ? `translateY(-${offset}px)` : ''
  if (offset > 50) scrollToBottom()
}

// ── Helpers
function showDate(idx) {
  if (idx === 0) return true
  const m = messagingStore.messages
  return new Date(m[idx-1]?.created_at).toDateString() !== new Date(m[idx]?.created_at).toDateString()
}
function fmtDate(d) {
  if (!d) return ''
  const dt = new Date(d), t = new Date()
  const y = new Date(); y.setDate(y.getDate()-1)
  if (dt.toDateString()===t.toDateString()) return 'Today'
  if (dt.toDateString()===y.toDateString()) return 'Yesterday'
  return dt.toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'})
}
function renderTxt(t) {
  if (!t) return ''
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/(https?:\/\/[^\s]+)/g,'<a href="$1" target="_blank" rel="noopener" class="msg-lnk">$1</a>')
    .replace(/\n/g,'<br/>')
}
function fmtSize(b) {
  if (!b) return ''
  return b<1024?b+' B':b<1048576?(b/1024).toFixed(1)+' KB':(b/1048576).toFixed(1)+' MB'
}
function fmtRecTime(s) { return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}` }
function isImgOnly(m) { return m.message_type==='image' && m.media_url && !m.is_deleted }
function hasRxn(m) { return m.reactions && Object.values(m.reactions).some(u=>u.length>0) }
function closeAll() { ctx.value.show=false; emojiP.value.show=false }
function scrollToBottom() { nextTick(()=>{ if(msgsEl.value) msgsEl.value.scrollTop=msgsEl.value.scrollHeight }) }
function scrollToMsg(id) { document.getElementById(`m-${id}`)?.scrollIntoView({behavior:'smooth',block:'center'}) }

// ── Conversation actions
function selectConv(conv) {
  messagingStore.setActiveConversation(conv)
  showMenu.value=false; showSearch.value=false; replyTo.value=null
  scrollToBottom()
}
async function deleteChat() {
  if (!activeConv.value) return
  await messagingStore.deleteConversation(activeConv.value.id)
  showMenu.value=false
}
function onScroll() {
  if (msgsEl.value?.scrollTop===0 && !messagingStore.loading) {
    const page = Math.ceil(messagingStore.messages.length/50)+1
    if (activeConv.value) messagingStore.fetchMessages(activeConv.value.id, page)
  }
}

// ── Input
function onInput() {
  autoResize()
  messagingStore.sendTyping()
  clearTimeout(typingTimer)
  typingTimer = setTimeout(()=>messagingStore.sendStopTyping(), 2500)
}
function autoResize() {
  if (!txtEl.value) return
  txtEl.value.style.height='auto'
  txtEl.value.style.height=Math.min(txtEl.value.scrollHeight,110)+'px'
}

// ── Send
async function send() {
  if (!activeConv.value) return
  clearTimeout(typingTimer); messagingStore.sendStopTyping()
  if (pendImg.value) { await sendAttachment(); return }
  const content = msg.value.trim()
  if (!content) return
  msg.value=''; if(txtEl.value) txtEl.value.style.height='auto'
  if (editId.value) {
    await messagingStore.editMessage(editId.value, content)
    editId.value=null; replyTo.value=null; scrollToBottom(); return
  }
  await messagingStore.sendMessage({ content, message_type:'text', reply_to_id:replyTo.value?.id||null })
  replyTo.value=null; scrollToBottom()
}

// ── File
function trigFile() { fileEl.value?.click() }
function onFile(e) {
  const f = e.target.files?.[0]; if(!f) return
  pendImg.value=f; pendPrev.value=URL.createObjectURL(f)
  if(fileEl.value) fileEl.value.value=''
}
function clearPend() { if(pendPrev.value) URL.revokeObjectURL(pendPrev.value); pendImg.value=null; pendPrev.value=null }
async function sendAttachment() {
  const f=pendImg.value; clearPend()
  try {
    const r = await messagingStore.uploadAttachment(f)
    const isAudio = f.type.startsWith('audio/')
    await messagingStore.sendMessage({
      content:'', message_type: isAudio?'voice': r.is_image?'image':'file',
      media_url:r.url, file_name:r.file_name, file_size:r.file_size,
      reply_to_id:replyTo.value?.id||null
    })
    replyTo.value=null; scrollToBottom()
  } catch(e){ console.error(e) }
}

// ── Voice recording
async function startRec() {
  if(isRec.value) return
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio:true})
    recChunks=[]; mediaRec=new MediaRecorder(stream,{mimeType:'audio/webm;codecs=opus'})
    mediaRec.ondataavailable=e=>{ if(e.data.size>0) recChunks.push(e.data) }
    mediaRec.start(100); isRec.value=true; recSecs.value=0
    recTimer=setInterval(()=>recSecs.value++,1000)
  } catch { alert('Microphone permission required') }
}
async function stopRec() {
  if(!isRec.value||!mediaRec) return
  clearInterval(recTimer); isRec.value=false
  await new Promise(res=>{mediaRec.onstop=res;mediaRec.stop();mediaRec.stream?.getTracks().forEach(t=>t.stop())})
  if(recSecs.value<1){recChunks=[];return}
  const blob=new Blob(recChunks,{type:'audio/webm'})
  const f=new File([blob],`voice-${Date.now()}.webm`,{type:'audio/webm'})
  recChunks=[]; pendImg.value=f
  await sendAttachment()
}
function cancelRec() {
  clearInterval(recTimer); isRec.value=false; recSecs.value=0; recChunks=[]
  if(mediaRec){try{mediaRec.stop();mediaRec.stream?.getTracks().forEach(t=>t.stop())}catch{} mediaRec=null}
}
function toggleVoice(m) {
  if(!m.media_url) return
  if(playingId.value===m.id){activeAudio?.pause();playingId.value=null;return}
  if(activeAudio){activeAudio.pause();activeAudio=null}
  playingId.value=m.id
  let a=voiceAudios[m.id]
  if(!a){
    a=new Audio(m.media_url); voiceAudios[m.id]=a
    a.ontimeupdate=()=>voiceProg.value={...voiceProg.value,[m.id]:a.currentTime/(a.duration||1)}
    a.onended=()=>{playingId.value=null;voiceProg.value={...voiceProg.value,[m.id]:0}}
  }
  activeAudio=a; a.currentTime=0; a.play().catch(()=>playingId.value=null)
}
function barH(id,b){const s=[...(id||'')].reduce((a,c)=>a+c.charCodeAt(0),0);return 4+((s*b*7+b*13)%14)}
function barProg(id,b){return b/22<=(voiceProg.value[id]||0)}
function voiceDur(m){const a=voiceAudios[m.id];return (a?.duration&&isFinite(a.duration))?fmtRecTime(Math.round(a.duration)):'0:00'}

// ── Reactions
async function doReact(m,emoji) {
  if(!activeConv.value||!m) return
  if(!m.reactions) m.reactions={}
  const uid=authStore.user?.id; if(!m.reactions[emoji])m.reactions[emoji]=[]
  const i=m.reactions[emoji].indexOf(uid)
  if(i>-1)m.reactions[emoji].splice(i,1); else m.reactions[emoji].push(uid)
  try { await messagingStore.reactToMessage(activeConv.value.id,m.id,emoji) } catch{}
}

// ── Reply
function setReply(m){replyTo.value=m;nextTick(()=>txtEl.value?.focus())}

// ── Context menu
function openCtx(m,e){
  ctx.value.show=false; emojiP.value.show=false
  nextTick(()=>{
    const x=Math.min(e.clientX,window.innerWidth-200)
    const y=Math.min(e.clientY,window.innerHeight-320)
    ctx.value={show:true,x,y,msg:m}
  })
}
function openEmoji(m){
  const el=document.getElementById(`m-${m.id}`)
  if(!el) return
  const r=el.getBoundingClientRect()
  emojiP.value={show:true,x:Math.min(r.left,window.innerWidth-260),y:r.top-56,msg:m}
}
function copyTxt(m){if(m?.content)navigator.clipboard.writeText(m.content).catch(()=>{}); ctx.value.show=false}
function beginEdit(m){msg.value=m.content||'';editId.value=m.id;nextTick(()=>txtEl.value?.focus())}

// ── Touch (long press = context menu)
function touchStart(m,e){touchTimer=setTimeout(()=>openCtx(m,{clientX:e.touches[0].clientX,clientY:e.touches[0].clientY}),500)}
function touchEnd(){clearTimeout(touchTimer)}

// ── Search
function toggleSearch(){showSearch.value=!showSearch.value;if(!showSearch.value){msgQ.value='';messagingStore.searchMessages('')}}
function closeSearch(){showSearch.value=false;msgQ.value=''}
function debounceSearch(){clearTimeout(searchTimer);searchTimer=setTimeout(()=>messagingStore.searchMessages(msgQ.value),300)}

// ── Calls
function startCall(type){messagingStore.sendCallSignal('call_initiate',{to:activeConv.value?.other_user_id,call_type:type,caller_name:authStore.profile?.full_name||'User',caller_avatar:authStore.profile?.avatar||''})}
function rejectCall(){if(incCall.value){messagingStore.sendCallSignal('call_reject',{to:incCall.value.from});incCall.value=null}}
function acceptCall(){if(incCall.value){messagingStore.sendCallSignal('call_accept',{to:incCall.value.from});incCall.value=null}}

watch(()=>messagingStore.callEvent,e=>{
  if(!e) return
  if(e.type==='incoming_call') incCall.value=e
  else if(['call_ended','call_rejected'].includes(e.type)) incCall.value=null
  messagingStore.clearCallEvent()
})
watch(()=>messagingStore.messages.length,()=>scrollToBottom())
</script>

<style scoped>
/* ═══ Root ═══ */
.msg-root{display:flex;height:calc(100vh - 72px);overflow:hidden;background:var(--background);}

/* ═══ Conversation sidebar ═══ */
.conv-side{width:320px;flex-shrink:0;display:flex;flex-direction:column;background:var(--surface-container-lowest);border-right:1px solid var(--outline-variant);}
.conv-topbar{display:flex;align-items:center;gap:.5rem;padding:1rem 1rem .5rem;flex-shrink:0;}
.conv-title{font-family:var(--font-headline);font-size:1.15rem;font-weight:800;color:var(--on-surface);flex:1;}
.conv-badge{min-width:20px;height:20px;border-radius:10px;background:var(--primary);color:#fff;font-size:.65rem;font-weight:800;display:flex;align-items:center;justify-content:center;padding:0 5px;}
.conv-search-row{position:relative;padding:.5rem .75rem .5rem;flex-shrink:0;}
.conv-si{position:absolute;left:1.35rem;top:50%;transform:translateY(-60%);font-size:18px;color:var(--on-surface-variant);pointer-events:none;}
.conv-search{width:100%;padding:.45rem .75rem .45rem 2.25rem;background:var(--surface-container);border:1px solid var(--outline-variant);border-radius:var(--radius-full);font-size:.83rem;color:var(--on-surface);outline:none;}
.conv-search:focus{border-color:var(--primary);}
.conv-list{flex:1;overflow-y:auto;}
/* Skeletons */
.conv-skeleton{display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;}
.cs-av{width:46px;height:46px;border-radius:50%;flex-shrink:0;}
.cs-lines{flex:1;display:flex;flex-direction:column;gap:.4rem;}
.cs-l1{height:13px;border-radius:4px;width:65%;}
.cs-l2{height:11px;border-radius:4px;width:45%;}
.shimmer{background:linear-gradient(90deg,var(--surface-container) 25%,var(--surface-container-high) 50%,var(--surface-container) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
/* Conv items */
.conv-item{display:flex;align-items:center;gap:.65rem;padding:.7rem 1rem;cursor:pointer;transition:background .12s;}
.conv-item:hover{background:var(--surface-container-low);}
.conv-item.active{background:color-mix(in srgb,var(--primary) 10%,transparent);}
.cv-av{position:relative;width:46px;height:46px;border-radius:50%;background:var(--primary-fixed);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;}
.cv-av-img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
.cv-av-img.tiny{width:28px;height:28px;border-radius:50%;}
.cv-av-txt{font-family:var(--font-headline);font-weight:700;color:var(--primary);font-size:.95rem;}
.cv-av-txt.sm{font-size:.75rem;}
.cv-av-txt.lg{font-size:1.5rem;}
.cv-av-txt.tiny{font-size:.65rem;}
.cv-online{position:absolute;bottom:1px;right:1px;width:11px;height:11px;border-radius:50%;background:#22c55e;border:2px solid var(--surface-container-lowest);}
.cv-info{flex:1;min-width:0;}
.cv-row1{display:flex;justify-content:space-between;align-items:center;}
.cv-name{font-size:.875rem;font-weight:600;color:var(--on-surface);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cv-time{font-size:.68rem;color:var(--on-surface-variant);flex-shrink:0;margin-left:.3rem;}
.cv-row2{display:flex;justify-content:space-between;align-items:center;margin-top:.15rem;}
.cv-preview{font-size:.78rem;color:var(--on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cv-preview.typing{color:#22c55e;font-style:italic;}
.cv-unread{min-width:18px;height:18px;border-radius:9px;background:#22c55e;color:#fff;font-size:.62rem;font-weight:800;display:flex;align-items:center;justify-content:center;padding:0 4px;flex-shrink:0;}
.conv-empty{display:flex;flex-direction:column;align-items:center;gap:.5rem;padding:3rem 1rem;color:var(--on-surface-variant);font-size:.85rem;}

/* ═══ Chat window ═══ */
.chat-win{flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative;background:var(--background);}
/* Background pattern */
.chat-win::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle,color-mix(in srgb,var(--primary) 4%,transparent) 1px,transparent 0);background-size:24px 24px;pointer-events:none;z-index:0;}

/* Mobile */
@media(max-width:767px){
  .conv-side{width:100%;}
  .conv-hidden{display:none !important;}
  .chat-win{display:none;}
  .chat-visible{display:flex !important;}
  .ch-back{display:flex !important;}
}

/* Header */
.chat-hdr{display:flex;align-items:center;gap:.6rem;padding:.7rem 1rem;background:var(--surface-container-lowest);border-bottom:1px solid var(--outline-variant);flex-shrink:0;position:relative;z-index:5;}
.ch-back{display:none;}
.ch-av{position:relative;width:38px;height:38px;border-radius:50%;background:var(--primary-fixed);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;}
.ch-info{flex:1;min-width:0;display:flex;flex-direction:column;}
.ch-name{font-size:.9rem;font-weight:700;color:var(--on-surface);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.ch-status{font-size:.73rem;color:var(--on-surface-variant);}
.ch-status.online{color:#22c55e;}
.ch-acts{display:flex;gap:.2rem;}
.icon-b{width:36px;height:36px;border-radius:50%;background:none;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--on-surface-variant);transition:.12s;}
.icon-b:hover{background:rgba(168,85,247,.08);color:var(--primary);}
.icon-b.icon-active{background:rgba(168,85,247,.12);color:var(--primary);}
.icon-b .material-symbols-outlined{font-size:20px;}
.icon-b.sm{width:28px;height:28px;}
.icon-b.sm .material-symbols-outlined{font-size:16px;}
.icon-b.ib-icon{color:var(--on-surface-variant);}
.more-w{position:relative;}
.drop-menu{position:absolute;top:calc(100%+4px);right:0;z-index:200;min-width:180px;background:var(--surface-container-high);border:1px solid var(--outline-variant);border-radius:var(--radius-lg);box-shadow:0 8px 24px rgba(0,0,0,.3);padding:.3rem;display:flex;flex-direction:column;}
.drop-item{display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;border:none;background:none;border-radius:var(--radius-md);font-size:.82rem;font-weight:500;color:var(--on-surface);cursor:pointer;}
.drop-item:hover{background:var(--surface-container);}
.drop-item.danger{color:#ef4444;}
.drop-item .material-symbols-outlined{font-size:17px;}

/* Search + E2E */
.srch-bar{display:flex;align-items:center;gap:.5rem;padding:.5rem 1rem;background:var(--surface-container-low);border-bottom:1px solid var(--outline-variant);flex-shrink:0;position:relative;z-index:5;}
.srch-inp{flex:1;padding:.4rem .75rem .4rem 2.1rem;background:var(--surface-container);border:1px solid var(--outline-variant);border-radius:var(--radius-full);font-size:.85rem;color:var(--on-surface);outline:none;}
.srch-inp:focus{border-color:var(--primary);}
.srch-results{position:absolute;left:0;right:0;z-index:100;background:var(--surface-container-high);border-bottom:1px solid var(--outline-variant);max-height:200px;overflow-y:auto;}
.srch-item{display:flex;justify-content:space-between;align-items:center;padding:.6rem 1rem;cursor:pointer;border-bottom:1px solid var(--outline-variant);}
.srch-item:hover{background:var(--surface-container);}
.srch-text{font-size:.82rem;color:var(--on-surface);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.srch-time{font-size:.7rem;color:var(--on-surface-variant);flex-shrink:0;margin-left:.5rem;}
.e2e-bar{display:flex;align-items:center;justify-content:center;gap:.3rem;padding:.25rem;background:color-mix(in srgb,#22c55e 8%,transparent);color:var(--on-surface-variant);font-size:.67rem;flex-shrink:0;position:relative;z-index:5;}

/* ═══ Messages area ═══ */
.msgs-area{flex:1;overflow-y:auto;padding:.75rem 1rem 1rem;display:flex;flex-direction:column;gap:.4rem;position:relative;z-index:1;}
.sk-row{display:flex;}
.sk-r{justify-content:flex-end;}
.sk-bubble{width:160px;height:42px;border-radius:18px;}
.date-sep{display:flex;justify-content:center;margin:.35rem 0;}
.date-sep span{background:color-mix(in srgb,var(--on-surface) 8%,transparent);color:var(--on-surface-variant);font-size:.7rem;font-weight:600;padding:.2rem .75rem;border-radius:var(--radius-full);}
.msg-row{display:flex;align-items:flex-end;gap:.4rem;max-width:74%;position:relative;}
.msg-row.mine{align-self:flex-end;flex-direction:row-reverse;}
.msg-av{width:28px;height:28px;flex-shrink:0;border-radius:50%;overflow:hidden;background:var(--primary-fixed);display:flex;align-items:center;justify-content:center;}
.msg-col{display:flex;flex-direction:column;gap:.2rem;}
.msg-row:hover .ha{display:flex;}

/* Reply preview */
.rp-snap{display:flex;gap:.4rem;border-radius:var(--radius-md);padding:.4rem .5rem;margin-bottom:.25rem;cursor:pointer;max-width:270px;}
.rp-mine{background:rgba(0,0,0,.12);}
.rp-theirs{background:rgba(0,0,0,.06);}
.rp-bar{width:3px;border-radius:2px;background:var(--primary);flex-shrink:0;}
.rp-body{display:flex;flex-direction:column;gap:.1rem;min-width:0;}
.rp-who{font-size:.72rem;font-weight:700;color:var(--primary);}
.rp-txt{font-size:.78rem;color:var(--on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

/* Bubble */
.bubble{padding:.55rem .85rem;border-radius:18px;word-break:break-word;position:relative;max-width:320px;min-width:60px;box-shadow:0 1px 2px rgba(0,0,0,.1);}
.b-mine{background:var(--primary);color:#fff;border-bottom-right-radius:4px;}
.b-theirs{background:var(--surface-container-high);color:var(--on-surface);border-bottom-left-radius:4px;}
[data-theme="dark"] .b-theirs{background:#252536;}
.b-del{opacity:.65;}
.b-img{padding:.3rem .3rem .55rem;}
.del-txt{font-size:.8rem;font-style:italic;opacity:.75;display:flex;align-items:center;gap:.3rem;}
.b-img-wrap{border-radius:10px;overflow:hidden;max-width:200px;cursor:pointer;}
.b-img-wrap img{width:100%;display:block;max-height:200px;object-fit:cover;border-radius:10px;}
.b-txt{font-size:.875rem;line-height:1.5;margin:0;white-space:pre-wrap;}
.b-mine :deep(.msg-lnk){color:#ddd6fe;}
.b-theirs :deep(.msg-lnk){color:var(--primary);}
.edited{font-size:.6rem;opacity:.65;font-style:italic;display:block;text-align:right;margin-top:.1rem;}
.b-foot{display:flex;align-items:center;gap:.2rem;justify-content:flex-end;margin-top:.2rem;}
.bt{font-size:.6rem;opacity:.7;}
.ti{font-size:13px;}
.btick.seen .ti{color:#ddd6fe;}
.b-theirs .btick.seen .ti{color:var(--primary);}

/* Voice player */
.voice-row{display:flex;align-items:center;gap:.5rem;min-width:180px;max-width:240px;padding:.25rem 0;}
.vp-btn{width:34px;height:34px;border-radius:50%;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;}
.vr-mine .vp-btn{background:rgba(255,255,255,.2);color:#fff;}
.vr-theirs .vp-btn{background:var(--primary);color:#fff;}
.vp-wave{display:flex;align-items:center;gap:2px;height:24px;flex:1;}
.vp-bar{width:3px;border-radius:2px;background:currentColor;transition:opacity .1s;}
.vr-mine .vp-wave{color:rgba(255,255,255,.85);}
.vr-theirs .vp-wave{color:var(--primary);}
.vp-dur{font-size:.68rem;font-weight:600;opacity:.75;min-width:28px;}

/* File chip */
.file-chip{display:flex;align-items:center;gap:.6rem;padding:.5rem .75rem;border-radius:var(--radius-lg);text-decoration:none;max-width:240px;}
.fc-mine{background:rgba(255,255,255,.15);color:#fff;}
.fc-theirs{background:var(--surface-container);color:var(--on-surface);}
.fc-icon{font-size:26px;}
.fc-meta{flex:1;min-width:0;display:flex;flex-direction:column;}
.fc-name{font-size:.8rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.fc-size{font-size:.68rem;opacity:.7;}
.fc-dl{font-size:20px;opacity:.8;}

/* Reactions */
.rxns{display:flex;flex-wrap:wrap;gap:.25rem;margin-top:.2rem;}
.rxns-mine{justify-content:flex-end;}
.rxn{padding:.15rem .45rem;border-radius:var(--radius-full);border:1px solid var(--outline-variant);background:var(--surface-container);font-size:.8rem;cursor:pointer;display:flex;align-items:center;gap:.15rem;}
.rxn.rxn-mine{background:color-mix(in srgb,var(--primary) 15%,transparent);border-color:var(--primary);}
.rxn-n{font-size:.7rem;font-weight:700;color:var(--on-surface-variant);}

/* Hover actions */
.ha{display:none;align-items:center;gap:.15rem;margin-bottom:.2rem;}
.ha-l{order:-1;margin-right:.25rem;}
.ha-r{margin-left:.25rem;}
.ha-btn{width:28px;height:28px;border-radius:50%;border:none;background:var(--surface-container-high);color:var(--on-surface-variant);display:flex;align-items:center;justify-content:center;cursor:pointer;}
.ha-btn:hover{background:var(--primary);color:#fff;}
.ha-btn .material-symbols-outlined{font-size:14px;}

/* Typing */
.typing-row{display:flex;align-items:center;gap:.5rem;align-self:flex-start;}
.typing-bub{display:flex;align-items:center;gap:4px;padding:.55rem .85rem;background:var(--surface-container-high);border-radius:18px;border-bottom-left-radius:4px;}
.td{width:6px;height:6px;border-radius:50%;background:var(--on-surface-variant);animation:td 1.4s infinite;}
.td:nth-child(2){animation-delay:.2s;}.td:nth-child(3){animation-delay:.4s;}
@keyframes td{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
.typing-name{font-size:.72rem;color:var(--on-surface-variant);font-style:italic;}

/* ═══ Bottom bars ═══ */
.prev-bar,.reply-bar,.rec-bar{display:flex;align-items:center;gap:.6rem;padding:.5rem 1rem;background:var(--surface-container-low);border-top:1px solid var(--outline-variant);flex-shrink:0;position:relative;z-index:5;}
.prev-thumb{width:44px;height:44px;border-radius:var(--radius-lg);object-fit:cover;flex-shrink:0;}
.prev-meta{flex:1;display:flex;flex-direction:column;gap:.1rem;min-width:0;}
.prev-name{font-size:.82rem;font-weight:600;color:var(--on-surface);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.prev-size{font-size:.7rem;color:var(--on-surface-variant);}
.rb-accent{width:3px;height:32px;border-radius:2px;background:var(--primary);flex-shrink:0;}
.rb-body{flex:1;display:flex;flex-direction:column;gap:.1rem;min-width:0;}
.rb-who{font-size:.72rem;font-weight:700;color:var(--primary);}
.rb-txt{font-size:.78rem;color:var(--on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.rec-dot{width:12px;height:12px;border-radius:50%;background:#ef4444;animation:tdot 1s ease-in-out infinite;flex-shrink:0;}
@keyframes tdot{0%,100%{opacity:1}50%{opacity:.3}}
.rec-time{font-family:var(--font-headline);font-size:.9rem;font-weight:700;color:#ef4444;min-width:2.5rem;}
.rec-hint{flex:1;font-size:.75rem;color:var(--on-surface-variant);}

/* Input bar — keyboard-aware via JS transform */
.inp-bar{display:flex;align-items:flex-end;gap:.4rem;padding:.6rem .75rem;background:var(--surface-container-lowest);border-top:1px solid var(--outline-variant);flex-shrink:0;position:relative;z-index:10;transition:transform .15s ease;}
.inp-wrap{flex:1;background:var(--surface-container-low);border:1px solid var(--outline-variant);border-radius:22px;padding:.5rem .875rem;transition:border-color .15s;}
.inp-wrap.inp-focus{border-color:var(--primary);}
.inp-ta{width:100%;background:transparent;border:none;outline:none;resize:none;font-family:var(--font-body);font-size:.9rem;color:var(--on-surface);line-height:1.5;max-height:110px;overflow-y:auto;}
.inp-ta::placeholder{color:var(--outline);}
.hidden-f{display:none;}
.send-btn{width:42px;height:42px;border-radius:50%;background:var(--primary);color:#fff;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;box-shadow:0 2px 8px rgba(99,14,212,.35);}
.send-btn .material-symbols-outlined{font-size:20px;}
.mic-btn{width:42px;height:42px;border-radius:50%;background:var(--surface-container);border:none;color:var(--on-surface-variant);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:.15s;}
.mic-btn:hover{background:var(--primary);color:#fff;}
.mic-btn.recording{background:#ef4444;color:#fff;animation:tdot .8s ease-in-out infinite;}
.mic-btn .material-symbols-outlined{font-size:22px;}

/* Empty */
.chat-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.75rem;position:relative;z-index:1;}
.ce-ico{width:80px;height:80px;border-radius:50%;background:color-mix(in srgb,var(--primary) 10%,transparent);display:flex;align-items:center;justify-content:center;color:var(--primary);}
.chat-empty h3{font-family:var(--font-headline);font-size:1.2rem;font-weight:700;color:var(--on-surface);margin:0;}
.chat-empty p{font-size:.875rem;color:var(--on-surface-variant);margin:0;}

/* ═══ Overlays ═══ */
.emoji-pop{position:fixed;z-index:1000;background:var(--surface-container-high);border:1px solid var(--outline-variant);border-radius:var(--radius-xl);box-shadow:0 8px 24px rgba(0,0,0,.3);padding:.5rem;display:flex;gap:.2rem;}
.ep-btn{width:36px;height:36px;border-radius:50%;background:none;border:none;font-size:1.25rem;cursor:pointer;transition:.12s;}
.ep-btn:hover{background:var(--surface-container);transform:scale(1.2);}
.ctx-menu{position:fixed;z-index:1000;background:var(--surface-container-high);border:1px solid var(--outline-variant);border-radius:var(--radius-xl);box-shadow:0 12px 32px rgba(0,0,0,.35);padding:.4rem;min-width:195px;}
.ctx-rxns{display:flex;gap:.2rem;padding:.3rem .4rem .5rem;}
.ctx-rxn{width:34px;height:34px;border-radius:50%;background:none;border:none;font-size:1.1rem;cursor:pointer;transition:.12s;}
.ctx-rxn:hover{background:var(--surface-container);transform:scale(1.2);}
.ctx-div{height:1px;background:var(--outline-variant);margin:.1rem 0;}
.ctx-it{display:flex;align-items:center;gap:.6rem;padding:.55rem .875rem;border:none;background:none;border-radius:var(--radius-md);font-size:.85rem;font-weight:500;color:var(--on-surface);cursor:pointer;width:100%;text-align:left;}
.ctx-it:hover{background:var(--surface-container);}
.ctx-it .material-symbols-outlined{font-size:18px;color:var(--on-surface-variant);}
.ctx-danger{color:#ef4444;}
.ctx-danger .material-symbols-outlined{color:#ef4444;}
.lb{position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:2000;display:flex;align-items:center;justify-content:center;}
.lb-close{position:absolute;top:1rem;right:1rem;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.15);border:none;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;}
.lb-img{max-width:92vw;max-height:92vh;object-fit:contain;border-radius:var(--radius-lg);}
.call-ov{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:3000;display:flex;align-items:center;justify-content:center;}
.call-card{background:var(--surface-container-highest);border-radius:var(--radius-2xl);padding:2.5rem 2rem;display:flex;flex-direction:column;align-items:center;gap:1rem;min-width:280px;}
.call-av{width:72px;height:72px;border-radius:50%;overflow:hidden;background:var(--primary-fixed);display:flex;align-items:center;justify-content:center;}
.call-nm{font-family:var(--font-headline);font-size:1.15rem;font-weight:700;color:var(--on-surface);margin:0;}
.call-sub{font-size:.85rem;color:var(--on-surface-variant);margin:0;}
.call-btns{display:flex;gap:1.75rem;margin-top:.5rem;}
.call-rej{width:60px;height:60px;border-radius:50%;background:#ef4444;border:none;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;}
.call-acc{width:60px;height:60px;border-radius:50%;background:#22c55e;border:none;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;}
.call-rej .material-symbols-outlined,.call-acc .material-symbols-outlined{font-size:24px;}

/* ═══ Transitions ═══ */
.slide-down-enter-active,.slide-down-leave-active{transition:all .2s ease;}
.slide-down-enter-from,.slide-down-leave-to{transform:translateY(-10px);opacity:0;}
.slide-up-enter-active,.slide-up-leave-active{transition:all .18s ease;}
.slide-up-enter-from,.slide-up-leave-to{transform:translateY(6px);opacity:0;}
.fade-enter-active,.fade-leave-active{transition:opacity .2s ease;}
.fade-enter-from,.fade-leave-to{opacity:0;}
.drop-enter-active,.drop-leave-active{transition:all .15s ease;}
.drop-enter-from,.drop-leave-to{transform:translateY(-6px) scale(.97);opacity:0;}
.ctx-enter-active,.ctx-leave-active{transition:all .12s ease;}
.ctx-enter-from,.ctx-leave-to{transform:scale(.93);opacity:0;}
.btn-swap-enter-active,.btn-swap-leave-active{transition:all .15s ease;}
.btn-swap-enter-from,.btn-swap-leave-to{opacity:0;transform:scale(.7);}
</style>
