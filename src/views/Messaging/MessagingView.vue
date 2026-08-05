<template>
  <div class="msg-root">

    <!-- ═══ Conversation List ═══ -->
    <div class="conv-side" :class="{ 'conv-hidden': !!activeConv }">
      <!-- Glass Header -->
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
          <div class="conv-empty-ico">
            <span class="material-symbols-outlined">chat_bubble_outline</span>
          </div>
          <p class="conv-empty-title">No conversations yet</p>
          <p class="conv-empty-sub">Start a new chat to get going</p>
        </div>
      </div>
    </div>

    <!-- ═══ Chat Window ═══ -->
    <div class="chat-win" :class="{ 'chat-active': !!activeConv }">
      <template v-if="activeConv">

        <!-- ── Header ── -->
        <div class="chat-hdr">
          <button class="hdr-btn ch-back" @click="messagingStore.setActiveConversation(null)">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div class="ch-av">
            <img v-if="activeConv.avatar" :src="activeConv.avatar" class="cv-av-img" />
            <span v-else class="cv-av-ini sm">{{ (activeConv.name||'?')[0].toUpperCase() }}</span>
            <span v-if="activeConv.online" class="cv-dot cv-dot-pulse" />
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
            <button v-if="(authStore.isClient || authStore.isAdmin) && activeConv" class="hdr-btn contract-btn"
              :title="activeContract ? 'View Contract' : 'Start Contract'"
              @click="activeContract ? showViewContract = true : showContractModal = true">
              <span class="material-symbols-outlined">handshake</span>
            </button>
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

        <!-- ── Active Contract Banner ── -->
        <Transition name="slide-down">
          <div v-if="activeContract" class="contract-banner">
            <span class="material-symbols-outlined" style="font-size:16px;color:#16a34a">handshake</span>
            <span class="contract-banner-text">Active Contract: <strong>{{ activeContract.title }}</strong></span>
            <span class="contract-banner-badge">Active</span>
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
                    <span class="rs-txt">
                      {{ m.reply_preview.content?.startsWith('{') ? '📋 Contract Proposal' : m.reply_preview.content }}
                    </span>
                  </div>
                </div>

                <!-- Bubble -->
                <div class="bubble"
                  :class="[m.mine?'bub-mine':'bub-theirs', {'bub-del':m.is_deleted,'bub-media':isImgOnly(m),'bub-contract':m.message_type==='contract'}]">

                  <span v-if="m.is_deleted" class="del-msg">
                    <span class="material-symbols-outlined" style="font-size:14px">block</span>
                    Message was deleted
                  </span>

                  <template v-else>
                    <!-- Image -->
                    <div v-if="m.message_type==='image' && m.media_url"
                      class="bub-img-wrap" @click.stop="lightbox=m.media_url">
                      <img :src="m.media_url" class="bub-img" loading="lazy" />
                      <div class="bub-img-overlay">
                        <span class="material-symbols-outlined">zoom_in</span>
                      </div>
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
                    <!-- Contract proposal -->
                    <div v-else-if="m.message_type === 'contract'" class="contract-card" :class="m.mine ? 'cc-mine' : 'cc-theirs'">
                      <div class="cc-header">
                        <span class="material-symbols-outlined cc-icon">handshake</span>
                        <div>
                          <p class="cc-label">Contract Proposal</p>
                          <p class="cc-title">{{ parseContract(m).title }}</p>
                        </div>
                        <span class="cc-status-badge" :class="parseContract(m).status">{{ parseContract(m).status }}</span>
                      </div>
                      <div class="cc-body">
                        <p class="cc-desc">{{ parseContract(m).description }}</p>
                        <div class="cc-details">
                          <span v-if="parseContract(m).billing_type === 'fixed'">
                            💰 Fixed: ${{ parseContract(m).amount }}
                          </span>
                          <span v-else>
                            ⏱ ${{ parseContract(m).hourly_rate }}/hr · {{ parseContract(m).weekly_limit }}h/wk limit
                          </span>
                          <span v-if="parseContract(m).deadline">📅 Due: {{ parseContract(m).deadline }}</span>
                        </div>
                      </div>
                      <div v-if="!m.mine && parseContract(m).status === 'pending'" class="cc-actions">
                        <button class="cc-btn cc-accept" @click.stop="respondContract(m, 'accept')">
                          <span class="material-symbols-outlined" style="font-size:15px">check</span>
                          Accept
                        </button>
                        <button class="cc-btn cc-decline" @click.stop="respondContract(m, 'decline')">
                          <span class="material-symbols-outlined" style="font-size:15px">close</span>
                          Decline
                        </button>
                      </div>
                      <div v-else-if="m.mine && parseContract(m).status === 'pending'" class="cc-pending">
                        <span class="material-symbols-outlined" style="font-size:14px">hourglass_empty</span>
                        Pending acceptance
                      </div>
                    </div>
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
          <button class="attach-fab" @click="trigFile" title="Attach file">
            <span class="material-symbols-outlined">add</span>
          </button>
          <input ref="fileEl" type="file" class="hidden-f"
            accept="image/*,video/*,application/pdf,application/zip,audio/*"
            @change="onFile" />
          <div class="inp-pill" :class="{ focused: inputFocused }">
            <textarea
              ref="txtEl"
              v-model="msg"
              class="inp-ta"
              placeholder="Message…"
              rows="1"
              @input="onInput"
              @focus="inputFocused=true; scrollToBottom()"
              @blur="inputFocused=false"
              @keydown.enter.exact.prevent="send"
              @keydown.enter.shift.exact="() => {}"
            />
          </div>
          <Transition name="btn-swap">
            <button v-if="canSend" key="send" class="send-fab" @click="send">
              <span class="material-symbols-outlined">send</span>
            </button>
            <button v-else key="mic" class="mic-fab" :class="{ rec: isRec }"
              @mousedown="startRec" @mouseup="stopRec"
              @touchstart.prevent="startRec" @touchend.prevent="stopRec">
              <span class="material-symbols-outlined">mic</span>
            </button>
          </Transition>
        </div>

      </template>

      <!-- ── Empty state ── -->
      <div v-else class="chat-empty">
        <div class="empty-glow"/>
        <div class="empty-ico">
          <span class="material-symbols-outlined">forum</span>
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

    <!-- ── Contract Modal ── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showContractModal" class="modal-overlay-full" @click.self="showContractModal = false">
          <div class="contract-modal">
            <div class="cm-header">
              <span class="material-symbols-outlined" style="color:var(--primary)">handshake</span>
              <h3>Start a Contract</h3>
              <button class="hdr-btn" @click="showContractModal = false">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="cm-body">
              <div class="cm-field">
                <label>Project Title *</label>
                <input v-model="contractForm.title" type="text" placeholder="e.g. Build a React Dashboard" />
              </div>
              <div class="cm-field">
                <label>Description *</label>
                <textarea v-model="contractForm.description" rows="3" placeholder="Describe the scope of work…"></textarea>
              </div>
              <div class="cm-field">
                <label>Billing Type</label>
                <div class="billing-toggle">
                  <button class="bt-btn" :class="{ active: contractForm.billing_type === 'fixed' }" @click="contractForm.billing_type = 'fixed'">
                    Fixed Price
                  </button>
                  <button class="bt-btn" :class="{ active: contractForm.billing_type === 'hourly' }" @click="contractForm.billing_type = 'hourly'">
                    Hourly
                  </button>
                </div>
              </div>
              <div v-if="contractForm.billing_type === 'fixed'" class="cm-field">
                <label>Total Amount (USD) *</label>
                <input v-model.number="contractForm.amount" type="number" placeholder="e.g. 500" min="1" />
              </div>
              <div v-else class="cm-row">
                <div class="cm-field">
                  <label>Hourly Rate (USD) *</label>
                  <input v-model.number="contractForm.hourly_rate" type="number" placeholder="e.g. 25" min="1" />
                </div>
                <div class="cm-field">
                  <label>Weekly Hour Limit</label>
                  <input v-model.number="contractForm.weekly_limit" type="number" placeholder="e.g. 40" min="1" />
                </div>
              </div>
              <div class="cm-field">
                <label>Deadline (optional)</label>
                <input v-model="contractForm.deadline" type="date" :min="today" />
              </div>
              <p v-if="contractError" class="cm-error">{{ contractError }}</p>
            </div>
            <div class="cm-footer">
              <button class="btn-ghost" @click="showContractModal = false">Cancel</button>
              <button class="btn-primary" :disabled="contractSending" @click="submitContract">
                <span v-if="contractSending" class="btn-spinner"></span>
                <span v-else class="material-symbols-outlined" style="font-size:16px">send</span>
                {{ contractSending ? 'Sending…' : 'Send Contract' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── View Contract Modal ── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showViewContract && activeContract" class="modal-overlay-full" @click.self="showViewContract = false">
          <div class="contract-modal">
            <div class="cm-header">
              <span class="material-symbols-outlined" style="color:#16a34a">handshake</span>
              <h3>Active Contract</h3>
              <button class="hdr-btn" @click="showViewContract = false">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="cm-body">
              <div class="cm-view-row"><span>Title</span><strong>{{ activeContract.title }}</strong></div>
              <div class="cm-view-row"><span>Status</span><span class="cc-status-badge active">Active</span></div>
              <div class="cm-view-row"><span>Billing</span><strong>{{ activeContract.billing_type === 'fixed' ? 'Fixed Price' : 'Hourly' }}</strong></div>
              <div v-if="activeContract.billing_type === 'fixed'" class="cm-view-row"><span>Amount</span><strong>${{ activeContract.amount }}</strong></div>
              <div v-else>
                <div class="cm-view-row"><span>Rate</span><strong>${{ activeContract.hourly_rate }}/hr</strong></div>
                <div class="cm-view-row"><span>Weekly Limit</span><strong>{{ activeContract.weekly_limit }}h</strong></div>
              </div>
              <div v-if="activeContract.deadline" class="cm-view-row"><span>Deadline</span><strong>{{ activeContract.deadline }}</strong></div>
              <div class="cm-view-row"><span>Developer</span><strong>{{ activeContract.developer_name }}</strong></div>
              <p v-if="activeContract.description" class="cm-desc-view">{{ activeContract.description }}</p>
            </div>
            <div class="cm-footer">
              <button class="btn-primary" @click="showViewContract = false">Close</button>
            </div>
          </div>
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

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', _onVV)
    window.visualViewport.addEventListener('scroll', _onVV)
    _onVV()
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
  const root = document.querySelector('.msg-root')
  if (root) {
    root.style.position = ''
    root.style.top = ''
    root.style.left = ''
    root.style.width = ''
    root.style.height = ''
  }
  cancelRec()
  if (activeAudio) { activeAudio.pause(); activeAudio = null }
  Object.values(voiceAudios).forEach(a => { a.pause(); a.src = '' })
  Object.keys(voiceAudios).forEach(k => delete voiceAudios[k])
})

function _onVV() {
  const vv = window.visualViewport
  const root = document.querySelector('.msg-root')
  if (!root) return
  root.style.position = 'fixed'
  root.style.top = vv.offsetTop + 'px'
  root.style.left = vv.offsetLeft + 'px'
  root.style.width = vv.width + 'px'
  root.style.height = vv.height + 'px'
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
  if (msgsEl.value) { msgsEl.value.scrollTop = msgsEl.value.scrollHeight }
  nextTick(() => { if (msgsEl.value) { msgsEl.value.scrollTop = msgsEl.value.scrollHeight } })
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
    clearTimeout(typingTimer); typingTimer = null
    messagingStore.sendStopTyping(); return
  }
  if (!typingTimer) { messagingStore.sendTyping() }
  clearTimeout(typingTimer)
  typingTimer = setTimeout(() => { messagingStore.sendStopTyping(); typingTimer = null }, 2500)
}
function autoResize() {
  if (!txtEl.value) return
  txtEl.value.style.height = 'auto'
  txtEl.value.style.height = Math.min(txtEl.value.scrollHeight, 120) + 'px'
}

// ── Send ──
async function send() {
  if (!activeConv.value) return
  clearTimeout(typingTimer); typingTimer = null
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
      content: '', message_type: isAudio ? 'voice' : isVideo ? 'video' : r.is_image ? 'image' : 'file',
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
    const keys = Object.keys(voiceAudios)
    if (keys.length >= MAX_VOICE_CACHE) {
      const oldKey = keys[0]; voiceAudios[oldKey]?.pause(); voiceAudios[oldKey].src = ''; delete voiceAudios[oldKey]
    }
    a = new Audio(m.media_url); voiceAudios[m.id] = a
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
  messagingStore.messages = messagingStore.messages.filter(x => x.id !== m.id)
  try {
    await messagingStore.sendMessage({
      content: m.content, message_type: m.message_type || 'text',
      media_url: m.media_url || null, file_name: m.file_name || null, file_size: m.file_size || null,
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

// ── Calls ──
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

// ── Contract ──────────────────────────────────────────────────────────────
const showContractModal = ref(false)
const showViewContract  = ref(false)
const contractSending   = ref(false)
const contractError     = ref('')
const today = new Date().toISOString().split('T')[0]

const contractForm = ref({
  title: '', description: '', billing_type: 'fixed',
  amount: null, hourly_rate: null, weekly_limit: null, deadline: '',
})

const activeContract = computed(() => {
  const contracts = messagingStore.messages.filter(m => m.message_type === 'contract')
  for (const c of [...contracts].reverse()) {
    const data = parseContract(c)
    if (data.status === 'active') return data
  }
  return null
})

function parseContract(m) {
  try { return JSON.parse(m.content || '{}') } catch { return {} }
}

async function submitContract() {
  contractError.value = ''
  const f = contractForm.value
  if (!f.title.trim()) { contractError.value = 'Title is required'; return }
  if (!f.description.trim()) { contractError.value = 'Description is required'; return }
  if (f.billing_type === 'fixed' && !f.amount) { contractError.value = 'Amount is required'; return }
  if (f.billing_type === 'hourly' && !f.hourly_rate) { contractError.value = 'Hourly rate is required'; return }

  contractSending.value = true
  try {
    const result = await messagingStore.sendMessage({
      content: JSON.stringify({ ...f, status: 'pending', client_id: authStore.user?.id, client_name: authStore.user?.full_name || '' }),
      message_type: 'contract',
    })
    showContractModal.value = false
    contractForm.value = { title:'', description:'', billing_type:'fixed', amount:null, hourly_rate:null, weekly_limit:null, deadline:'' }
    scrollToBottom()
  } catch (e) {
    contractError.value = e?.response?.data?.detail || 'Failed to send contract. Please try again.'
  } finally {
    contractSending.value = false
  }
}

async function respondContract(m, action) {
  const contract = parseContract(m)
  const updatedContract = {
    ...contract,
    status: action === 'accept' ? 'active' : 'declined',
    developer_id: authStore.user?.id,
    developer_name: authStore.user?.full_name || authStore.profile?.full_name || '',
  }

  const idx = messagingStore.messages.findIndex(msg => msg.id === m.id)
  if (idx !== -1) {
    messagingStore.messages.splice(idx, 1, {
      ...messagingStore.messages[idx],
      content: JSON.stringify(updatedContract),
    })
  }

  try {
    const result = await messagingService.respondContract(m.id, action)
    if (result?.contract && idx !== -1) {
      messagingStore.messages.splice(idx, 1, {
        ...messagingStore.messages[idx],
        content: JSON.stringify(result.contract),
      })
    }
  } catch (e) {
    if (idx !== -1) {
      messagingStore.messages.splice(idx, 1, {
        ...messagingStore.messages[idx],
        content: JSON.stringify(contract),
      })
    }
    const errMsg = e?.response?.data?.detail || e?.message || 'Failed'
    console.error('Contract response failed:', e?.response?.status, errMsg)
    const { useUiStore } = await import('@/store/ui')
    useUiStore().showError(`Contract ${action} failed: ${errMsg}`)
  }
}

watch(() => messagingStore.messages, () => {}, { deep: true })
</script>

<style scoped>
/* ══════════════════════════════════════════
   ROOT — Fixed viewport, sidebar-aware
══════════════════════════════════════════ */
.msg-root {
  display: flex;
  overflow: hidden;
  background: var(--background);
  position: fixed !important;
  top: 72px !important;
  left: 256px !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 50 !important;
  width: auto !important;
  height: auto !important;
}

@media (max-width: 767px) {
  .msg-root {
    top: 0 !important;
    left: 0 !important;
    z-index: 200 !important;
  }
}

/* ══════════════════════════════════════════
   CONVERSATION SIDEBAR — Frosted glass
══════════════════════════════════════════ */
.conv-side {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--surface-container-lowest);
  border-right: 1px solid var(--outline-variant);
  position: relative;
}

/* Glass gradient header */
.conv-topbar {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: 1rem 1rem .75rem;
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--surface-container-low) 0%, var(--surface-container-lowest) 100%);
  border-bottom: 1px solid var(--outline-variant);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.conv-back-btn {
  display: none;
  width: 34px; height: 34px;
  border-radius: 50%;
  align-items: center; justify-content: center;
  color: var(--on-surface-variant);
  text-decoration: none;
  transition: all .15s;
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
}
.conv-back-btn:hover { background: rgba(168,85,247,.1); color: var(--primary); transform: scale(1.05); }
.conv-back-btn .material-symbols-outlined { font-size: 20px; }
@media (max-width: 767px) { .conv-back-btn { display: flex; } }

.conv-title {
  font-family: var(--font-headline);
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--on-surface);
  flex: 1;
  letter-spacing: -.02em;
}

.conv-badge {
  min-width: 22px; height: 22px;
  border-radius: 11px;
  background: var(--gradient-primary);
  color: #fff;
  font-size: .62rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  padding: 0 6px;
  box-shadow: 0 0 0 3px rgba(99,14,212,.2), var(--shadow-primary);
  animation: badge-pulse 2s ease-in-out infinite;
}
@keyframes badge-pulse {
  0%,100% { box-shadow: 0 0 0 3px rgba(99,14,212,.2), var(--shadow-primary); }
  50% { box-shadow: 0 0 0 5px rgba(99,14,212,.15), 0 4px 16px rgba(99,14,212,.3); }
}

/* Search */
.conv-search-wrap {
  position: relative;
  padding: .625rem .75rem;
  flex-shrink: 0;
  background: var(--surface-container-lowest);
}
.conv-search-ico {
  position: absolute; left: 1.375rem; top: 50%;
  transform: translateY(-50%);
  font-size: 17px; color: var(--on-surface-variant);
  pointer-events: none;
}
.conv-search {
  width: 100%;
  padding: .55rem .875rem .55rem 2.25rem;
  background: var(--surface-container);
  border: 1.5px solid transparent;
  border-radius: 999px;
  font-size: .85rem; color: var(--on-surface);
  outline: none;
  transition: all .2s;
}
.conv-search::placeholder { color: var(--outline); }
.conv-search:focus {
  border-color: var(--primary);
  background: var(--surface-container-low);
  box-shadow: 0 0 0 3px rgba(99,14,212,.1);
}

/* Conv list */
.conv-list { flex: 1; overflow-y: auto; }
.conv-list::-webkit-scrollbar { width: 3px; }
.conv-list::-webkit-scrollbar-track { background: transparent; }
.conv-list::-webkit-scrollbar-thumb { background: var(--outline-variant); border-radius: 99px; }

/* Skeletons */
.conv-skel { display: flex; align-items: center; gap: .75rem; padding: .75rem 1rem; }
.skel-av { width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0; }
.skel-lines { flex: 1; display: flex; flex-direction: column; gap: .4rem; }
.skel-l1 { height: 12px; border-radius: 4px; width: 60%; }
.skel-l2 { height: 10px; border-radius: 4px; width: 40%; }
.shimmer {
  background: linear-gradient(90deg, var(--surface-container) 25%, var(--surface-container-high) 50%, var(--surface-container) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* Conv item */
.conv-item {
  display: flex; align-items: center; gap: .75rem;
  padding: .75rem 1rem;
  cursor: pointer;
  transition: all .15s ease;
  border-bottom: 1px solid var(--outline-variant);
  position: relative;
}
.conv-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity .15s;
  pointer-events: none;
}
.conv-item:hover { background: color-mix(in srgb, var(--primary) 5%, var(--surface-container-lowest)); }
.conv-item.active {
  background: color-mix(in srgb, var(--primary) 9%, var(--surface-container-lowest));
  border-left: 3px solid var(--primary);
}
.conv-item.active .cv-name { color: var(--primary); }

/* Avatars */
.cv-av {
  position: relative;
  width: 48px; height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-container) 0%, var(--primary-fixed) 100%);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,.1);
}
.cv-av-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.cv-av-ini {
  font-family: var(--font-headline);
  font-weight: 800; color: var(--primary);
  font-size: 1rem; line-height: 1;
}
.cv-av-ini.sm { font-size: .875rem; }
.cv-av-ini.xs { font-size: .7rem; }
.cv-av-ini.lg { font-size: 1.6rem; }

/* Online dot */
.cv-dot {
  position: absolute; bottom: 2px; right: 2px;
  width: 12px; height: 12px; border-radius: 50%;
  background: #22c55e;
  border: 2.5px solid var(--surface-container-lowest);
}
.cv-dot-pulse {
  animation: dot-pulse 2s ease-in-out infinite;
}
@keyframes dot-pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,.4); }
  50% { box-shadow: 0 0 0 4px rgba(34,197,94,.0); }
}

.cv-body { flex: 1; min-width: 0; }
.cv-top  { display: flex; justify-content: space-between; align-items: baseline; }
.cv-name {
  font-size: .9rem; font-weight: 700;
  color: var(--on-surface);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  transition: color .15s;
}
.cv-time { font-size: .67rem; color: var(--on-surface-variant); flex-shrink: 0; margin-left: .5rem; }
.cv-bot  { display: flex; justify-content: space-between; align-items: center; margin-top: .2rem; }
.cv-prev {
  font-size: .78rem; color: var(--on-surface-variant);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  display: flex; align-items: center; gap: .25rem; flex: 1;
}
.cv-prev.typing { color: #22c55e; font-style: italic; font-weight: 600; }

.cv-badge-sm {
  min-width: 20px; height: 20px; border-radius: 10px;
  background: var(--gradient-primary);
  color: #fff;
  font-size: .6rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  padding: 0 5px; flex-shrink: 0; margin-left: .35rem;
  box-shadow: 0 2px 8px rgba(99,14,212,.35);
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

/* Empty state */
.conv-empty {
  display: flex; flex-direction: column; align-items: center; gap: .625rem;
  padding: 3rem 1rem; color: var(--on-surface-variant);
}
.conv-empty-ico {
  width: 72px; height: 72px; border-radius: 50%;
  background: color-mix(in srgb, var(--primary) 8%, transparent);
  display: flex; align-items: center; justify-content: center;
  color: var(--primary);
}
.conv-empty-ico .material-symbols-outlined { font-size: 2rem; }
.conv-empty-title { font-family: var(--font-headline); font-weight: 700; font-size: .95rem; color: var(--on-surface); margin: 0; }
.conv-empty-sub   { font-size: .8rem; margin: 0; }

/* ══════════════════════════════════════════
   CHAT WINDOW
══════════════════════════════════════════ */
.chat-win {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column;
  overflow: hidden; position: relative;
  background: var(--background);
}

/* Subtle geometric pattern background */
.chat-win::before {
  content: '';
  position: absolute; inset: 0;
  pointer-events: none; z-index: 0;
  background-image:
    radial-gradient(circle, color-mix(in srgb, var(--primary) 4%, transparent) 1px, transparent 0);
  background-size: 24px 24px;
  opacity: .6;
}

/* Mobile responsive */
@media (max-width: 767px) {
  .conv-side { width: 100%; }
  .conv-hidden { display: none !important; }
  .chat-win { display: none; }
  .chat-active { display: flex !important; }
  .ch-back { display: flex !important; }
}

/* ── Chat Header ── */
.chat-hdr {
  display: flex; align-items: center; gap: .5rem;
  padding: .75rem 1rem;
  background: var(--surface-container-lowest);
  border-bottom: 1px solid var(--outline-variant);
  flex-shrink: 0;
  position: relative; z-index: 20;
  box-shadow: 0 1px 0 var(--outline-variant), var(--shadow-sm);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.ch-back { display: none; }
.ch-av {
  position: relative;
  width: 40px; height: 40px; border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-container) 0%, var(--primary-fixed) 100%);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,.12);
}
.ch-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.ch-name {
  font-size: .95rem; font-weight: 700;
  color: var(--on-surface);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  letter-spacing: -.01em;
}
.ch-status {
  font-size: .72rem; color: var(--on-surface-variant);
  display: flex; align-items: center; gap: .25rem;
}
.ch-status.online { color: #22c55e; font-weight: 600; }
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
  width: 36px; height: 36px; border-radius: 50%;
  background: none; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--on-surface-variant);
  transition: all .15s ease;
  flex-shrink: 0;
}
.hdr-btn:hover {
  background: color-mix(in srgb, var(--primary) 10%, transparent);
  color: var(--primary);
  transform: scale(1.05);
}
.hdr-btn.active { background: color-mix(in srgb, var(--primary) 14%, transparent); color: var(--primary); }
.hdr-btn.sm { width: 28px; height: 28px; }
.hdr-btn .material-symbols-outlined { font-size: 20px; }

/* Dropdown menu */
.more-wrap { position: relative; }
.drop-menu {
  position: absolute; top: calc(100% + 6px); right: 0; z-index: 200;
  min-width: 200px;
  background: var(--surface-container-highest);
  border: 1px solid var(--outline-variant);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  padding: .375rem;
  display: flex; flex-direction: column;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.drop-item {
  display: flex; align-items: center; gap: .6rem;
  padding: .625rem .875rem; border: none; background: none;
  border-radius: 10px; font-size: .85rem; font-weight: 500;
  color: var(--on-surface); cursor: pointer; text-align: left;
  transition: background .1s;
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
  transition: all .15s;
}
.srch-inp:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,14,212,.1); }
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
  transition: background .1s;
}
.srch-item:hover { background: var(--surface-container); }
.srch-text { font-size: .82rem; color: var(--on-surface); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.srch-ts { font-size: .7rem; color: var(--on-surface-variant); flex-shrink: 0; margin-left: .5rem; }

/* Contract banner */
.contract-banner {
  display: flex; align-items: center; gap: .5rem;
  padding: .5rem 1rem;
  background: rgba(22,163,74,.07);
  border-bottom: 1px solid rgba(22,163,74,.2);
  flex-shrink: 0; position: relative; z-index: 10;
  font-size: .78rem; color: var(--on-surface);
}
.contract-banner-text { flex: 1; }
.contract-banner-badge {
  padding: .15rem .5rem; border-radius: 999px;
  background: rgba(22,163,74,.15); color: #16a34a;
  font-size: .65rem; font-weight: 700; text-transform: uppercase;
}

/* E2E bar */
.e2e-bar {
  display: flex; align-items: center; justify-content: center; gap: .3rem;
  padding: .3rem; font-size: .67rem;
  background: color-mix(in srgb, #22c55e 5%, transparent);
  color: var(--on-surface-variant);
  flex-shrink: 0; position: relative; z-index: 5;
  letter-spacing: .01em;
}

/* ══════════════════════════════════════════
   MESSAGES AREA
══════════════════════════════════════════ */
.msgs-area {
  flex: 1; min-height: 0;
  overflow-y: auto; overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding: .875rem 1rem 1.25rem;
  display: flex; flex-direction: column;
  gap: .15rem;
  position: relative; z-index: 1;
}
.msgs-area::-webkit-scrollbar { width: 4px; }
.msgs-area::-webkit-scrollbar-track { background: transparent; }
.msgs-area::-webkit-scrollbar-thumb { background: var(--outline-variant); border-radius: 99px; }

/* Skeletons */
.sk-row { display: flex; margin: .2rem 0; }
.sk-l { justify-content: flex-start; }
.sk-r { justify-content: flex-end; }
.sk-bub { height: 44px; border-radius: 18px; flex-shrink: 0; }

/* Date chip */
.date-chip {
  display: flex; justify-content: center;
  margin: .75rem 0 .5rem; flex-shrink: 0;
}
.date-chip span {
  background: color-mix(in srgb, var(--on-surface) 8%, transparent);
  color: var(--on-surface-variant);
  font-size: .7rem; font-weight: 600;
  padding: .3rem 1.125rem; border-radius: 999px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--outline-variant);
}

/* ── Message row ── */
.msg-row {
  display: flex; align-items: flex-end; gap: .375rem;
  max-width: 78%; position: relative;
  align-self: flex-start;
  margin-bottom: 2px;
}
.msg-row.mine { align-self: flex-end; flex-direction: row-reverse; }
@media (max-width: 767px) { .msg-row { max-width: 90%; } }

/* Avatar */
.msg-av {
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, var(--primary-container) 0%, var(--primary-fixed) 100%);
  overflow: hidden; display: flex; align-items: center; justify-content: center;
  align-self: flex-end; margin-bottom: 2px;
  box-shadow: 0 1px 4px rgba(0,0,0,.12);
}

.msg-col { display: flex; flex-direction: column; gap: .15rem; min-width: 0; }
.msg-row:hover .msg-actions { opacity: 1; pointer-events: all; }

/* Reply snap */
.reply-snap {
  display: flex; gap: .4rem;
  border-radius: 10px; padding: .35rem .5rem;
  cursor: pointer; margin-bottom: .2rem;
  max-width: 260px; transition: opacity .15s;
}
.rs-mine   { background: rgba(0,0,0,.12); }
.rs-theirs { background: rgba(0,0,0,.05); }
:global([data-theme="dark"]) .rs-theirs { background: rgba(255,255,255,.07); }
.rs-bar { width: 3px; border-radius: 2px; background: var(--primary); flex-shrink: 0; align-self: stretch; }
.rs-body { display: flex; flex-direction: column; gap: .1rem; min-width: 0; overflow: hidden; }
.rs-who  { font-size: .7rem; font-weight: 700; color: var(--primary); }
.rs-txt  { font-size: .77rem; color: var(--on-surface-variant); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ── Bubble ── */
.bubble {
  padding: .5rem .875rem .35rem;
  border-radius: 20px;
  word-break: break-word;
  min-width: 52px; max-width: 100%;
  position: relative;
}

/* Sent — gradient purple */
.bub-mine {
  background: var(--gradient-primary);
  color: #fff;
  border-bottom-right-radius: 6px;
  box-shadow: 0 4px 16px rgba(99,14,212,.3), 0 1px 4px rgba(0,0,0,.15);
}

/* Received — glass card */
.bub-theirs {
  background: var(--surface-container-lowest);
  color: var(--on-surface);
  border-bottom-left-radius: 6px;
  border: 1px solid var(--outline-variant);
  box-shadow: 0 2px 8px rgba(0,0,0,.06);
}

.bub-del   { opacity: .55; }
.bub-media { padding: .3rem .3rem .4rem; }
.bub-contract {
  background: transparent !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  padding: 0 !important;
  border: none !important;
}
.del-msg {
  font-size: .82rem; font-style: italic; opacity: .7;
  display: flex; align-items: center; gap: .3rem;
}

/* Image inside bubble */
.bub-img-wrap {
  border-radius: 14px; overflow: hidden;
  max-width: 240px; cursor: pointer;
  line-height: 0; position: relative;
}
.bub-img {
  width: 100%; display: block;
  max-height: 260px; object-fit: cover;
  border-radius: 14px;
  transition: filter .2s;
}
.bub-img-wrap:hover .bub-img { filter: brightness(.85); }
.bub-img-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,.2);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity .2s; border-radius: 14px;
  color: #fff;
}
.bub-img-overlay .material-symbols-outlined { font-size: 2rem; }
.bub-img-wrap:hover .bub-img-overlay { opacity: 1; }

/* Video */
.bub-vid-wrap { border-radius: 14px; overflow: hidden; max-width: 260px; line-height: 0; }
.bub-vid { width: 100%; display: block; max-height: 220px; border-radius: 14px; background: #000; outline: none; }

/* Text */
.bub-txt {
  font-size: .9rem; line-height: 1.55;
  margin: 0; white-space: pre-wrap;
}
.bub-mine  :deep(.msg-lnk) { color: rgba(255,255,255,.85); text-decoration: underline; }
.bub-theirs :deep(.msg-lnk) { color: var(--primary); text-decoration: underline; }
.bub-edited { font-size: .6rem; opacity: .5; font-style: italic; }

/* Footer: time + ticks */
.bub-foot {
  display: flex; align-items: center; justify-content: flex-end;
  gap: .2rem; margin-top: .3rem;
}
.bub-ts   { font-size: .64rem; opacity: .65; line-height: 1; }
.tick-ico { font-size: 13px; line-height: 1; }
.bub-ticks.seen  .tick-ico { color: rgba(255,255,255,.9); }
.bub-ticks.delivered .tick-ico { color: rgba(255,255,255,.65); }
.bub-failed { cursor: pointer; display: flex; align-items: center; }

/* Voice player — redesigned */
.voice-player {
  display: flex; align-items: center; gap: .625rem;
  min-width: 200px; max-width: 260px; padding: .3rem 0;
}
.vp-play {
  width: 38px; height: 38px; border-radius: 50%;
  border: none; cursor: pointer; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: transform .15s, box-shadow .15s;
}
.vp-play:hover { transform: scale(1.08); }
.vp-mine   .vp-play { background: rgba(255,255,255,.25); color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.2); }
.vp-theirs .vp-play { background: var(--gradient-primary); color: #fff; box-shadow: var(--shadow-primary); }
.vp-waves { display: flex; align-items: center; gap: 2.5px; height: 28px; flex: 1; }
.vp-bar {
  width: 3px; border-radius: 2px;
  background: currentColor;
  transition: opacity .1s, height .15s;
}
.vp-mine   .vp-waves { color: rgba(255,255,255,.9); }
.vp-theirs .vp-waves { color: var(--primary); }
.vp-time { font-size: .68rem; font-weight: 700; opacity: .7; min-width: 34px; }

/* File chip */
.file-chip {
  display: flex; align-items: center; gap: .625rem;
  padding: .625rem .875rem; border-radius: 14px;
  text-decoration: none; max-width: 240px;
  transition: opacity .15s;
}
.file-chip:hover { opacity: .85; }
.fc-mine   { background: rgba(255,255,255,.18); color: #fff; }
.fc-theirs {
  background: var(--surface-container);
  color: var(--on-surface);
  border: 1px solid var(--outline-variant);
}
.fc-ico    { font-size: 28px; }
.fc-info   { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.fc-name   { font-size: .8rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fc-sz     { font-size: .68rem; opacity: .65; }
.fc-dl     { font-size: 20px; opacity: .7; }

/* Reactions */
.rxns { display: flex; flex-wrap: wrap; gap: .25rem; margin-top: .375rem; }
.rxns-r { justify-content: flex-end; }
.rxn-chip {
  padding: .2rem .5rem; border-radius: 999px;
  border: 1px solid var(--outline-variant);
  background: var(--surface-container-lowest);
  font-size: .82rem; cursor: pointer;
  display: flex; align-items: center; gap: .15rem;
  transition: all .15s;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
}
.rxn-chip:hover { border-color: var(--primary); transform: scale(1.08); }
.rxn-chip.rxn-mine {
  background: color-mix(in srgb, var(--primary) 10%, var(--surface-container-lowest));
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
.msg-row:not(.mine) .msg-actions { left: calc(100% + 4px); }
.msg-row.mine .msg-actions { right: calc(100% + 4px); }
@media (max-width: 767px) { .msg-actions { display: none; } }
.ma-btn {
  width: 28px; height: 28px; border-radius: 50%; border: none;
  background: var(--surface-container-highest);
  border: 1px solid var(--outline-variant);
  color: var(--on-surface-variant);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .15s;
  box-shadow: 0 2px 6px rgba(0,0,0,.1);
}
.ma-btn:hover { background: var(--primary); color: #fff; border-color: var(--primary); transform: scale(1.1); }
.ma-btn .material-symbols-outlined { font-size: 14px; }

/* Typing indicator */
.typing-row {
  display: flex; align-items: flex-end; gap: .375rem;
  align-self: flex-start; margin-top: .375rem;
}
.typing-bub {
  display: flex; align-items: center; gap: 5px;
  padding: .625rem 1rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: 20px; border-bottom-left-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,.06);
}
.td {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--primary);
  animation: td 1.3s ease-in-out infinite;
}
.td:nth-child(2) { animation-delay: .18s; }
.td:nth-child(3) { animation-delay: .36s; }
@keyframes td {
  0%,60%,100% { transform: translateY(0); opacity: .35; }
  30% { transform: translateY(-6px); opacity: 1; }
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
  width: 44px; height: 44px;
  border-radius: 10px; object-fit: cover; flex-shrink: 0;
  border: 1px solid var(--outline-variant);
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
  animation: pulse-rec .8s ease-in-out infinite;
}
@keyframes pulse-rec { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .4; transform: scale(.9); } }
.rec-time { font-family: var(--font-headline); font-size: .9rem; font-weight: 700; color: #ef4444; }
.rec-hint { flex: 1; font-size: .75rem; color: var(--on-surface-variant); }

/* ══════════════════════════════════════════
   INPUT BAR — Floating pill design
══════════════════════════════════════════ */
.inp-bar {
  display: flex; align-items: flex-end; gap: .5rem;
  padding: .625rem .875rem calc(.75rem + env(safe-area-inset-bottom, 0px));
  background: var(--surface-container-lowest);
  border-top: 1px solid var(--outline-variant);
  flex-shrink: 0;
  position: relative; z-index: 20;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Attach FAB */
.attach-fab {
  width: 42px; height: 42px; border-radius: 50%;
  background: var(--surface-container);
  border: 1.5px solid var(--outline-variant);
  color: var(--on-surface-variant);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
  transition: all .2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.attach-fab .material-symbols-outlined { font-size: 22px; transition: transform .2s; }
.attach-fab:hover {
  background: color-mix(in srgb, var(--primary) 10%, var(--surface-container));
  border-color: var(--primary);
  color: var(--primary);
  transform: rotate(45deg);
}

/* Message pill */
.inp-pill {
  flex: 1;
  background: var(--surface-container);
  border: 1.5px solid var(--outline-variant);
  border-radius: 26px;
  padding: .6rem 1.125rem;
  transition: all .2s;
  display: flex; align-items: center;
  min-height: 44px;
}
.inp-pill.focused {
  border-color: var(--primary);
  background: var(--surface-container-low);
  box-shadow: 0 0 0 3px rgba(99,14,212,.1);
}
.inp-ta {
  width: 100%; background: transparent; border: none; outline: none;
  resize: none; line-height: 1.5;
  font-family: var(--font-body);
  font-size: max(.9rem, 16px);
  color: var(--on-surface);
  max-height: 120px; overflow-y: auto;
}
.inp-ta::placeholder { color: var(--outline); }
.hidden-f { display: none; }

/* Send FAB — gradient glow */
.send-fab {
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--gradient-primary);
  color: #fff; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
  box-shadow: var(--shadow-primary), 0 4px 16px rgba(99,14,212,.4);
  transition: all .2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.send-fab:hover { transform: scale(1.1); box-shadow: var(--shadow-primary-lg), 0 6px 20px rgba(99,14,212,.5); }
.send-fab:active { transform: scale(.93); }
.send-fab .material-symbols-outlined { font-size: 20px; }

/* Mic FAB */
.mic-fab {
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--surface-container);
  border: 1.5px solid var(--outline-variant);
  color: var(--on-surface-variant);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
  transition: all .2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.mic-fab:hover { background: var(--primary); color: #fff; border-color: var(--primary); transform: scale(1.08); }
.mic-fab.rec {
  background: #ef4444; color: #fff; border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239,68,68,.2);
  animation: pulse-rec .8s ease-in-out infinite;
}
.mic-fab .material-symbols-outlined { font-size: 22px; }

/* Mobile keyboard layout */
@media (max-width: 767px) {
  .inp-bar { position: relative !important; flex-shrink: 0; }
  .aux-bar { position: relative !important; flex-shrink: 0; }
  .msgs-area { padding-top: 110px !important; padding-bottom: 1rem !important; }
  .chat-hdr { position: fixed !important; top: 0; left: 0; right: 0; z-index: 150; }
  .e2e-bar  { position: fixed !important; top: 65px; left: 0; right: 0; z-index: 149; }
  .srch-bar { position: fixed !important; top: 65px; left: 0; right: 0; z-index: 148; }
}

/* ══════════════════════════════════════════
   EMPTY STATE — Gradient illustration
══════════════════════════════════════════ */
.chat-empty {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: .875rem; position: relative; z-index: 1;
  overflow: hidden;
}
.empty-glow {
  position: absolute;
  width: 300px; height: 300px; border-radius: 50%;
  background: radial-gradient(circle, rgba(99,14,212,.08) 0%, transparent 70%);
  pointer-events: none;
}
.empty-ico {
  width: 88px; height: 88px; border-radius: 50%;
  background: var(--gradient-primary);
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  box-shadow: var(--shadow-primary-lg);
  position: relative;
}
.empty-ico::after {
  content: '';
  position: absolute; inset: -8px;
  border-radius: 50%;
  border: 2px solid color-mix(in srgb, var(--primary) 20%, transparent);
  animation: ring-pulse 2.5s ease-in-out infinite;
}
@keyframes ring-pulse {
  0%,100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0; }
}
.empty-ico .material-symbols-outlined { font-size: 2.75rem; }
.empty-title { font-family: var(--font-headline); font-size: 1.25rem; font-weight: 800; color: var(--on-surface); margin: 0; letter-spacing: -.02em; }
.empty-sub   { font-size: .9rem; color: var(--on-surface-variant); margin: 0; text-align: center; max-width: 280px; line-height: 1.6; }

/* ══════════════════════════════════════════
   OVERLAYS
══════════════════════════════════════════ */
/* Emoji picker */
.emoji-pop {
  position: fixed; z-index: 1000;
  background: var(--surface-container-highest);
  border: 1px solid var(--outline-variant);
  border-radius: 18px;
  box-shadow: var(--shadow-lg);
  padding: .5rem .375rem;
  display: flex; gap: .15rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.ep-btn {
  width: 40px; height: 40px; border-radius: 50%;
  background: none; border: none; font-size: 1.3rem;
  cursor: pointer; transition: all .15s;
  display: flex; align-items: center; justify-content: center;
}
.ep-btn:hover { background: var(--surface-container); transform: scale(1.3); }

/* Context menu */
.ctx-menu {
  position: fixed; z-index: 1000;
  background: var(--surface-container-highest);
  border: 1px solid var(--outline-variant);
  border-radius: 18px;
  box-shadow: var(--shadow-lg);
  padding: .4rem; min-width: 210px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.ctx-emojis { display: flex; gap: .15rem; padding: .3rem .4rem .5rem; }
.ctx-e {
  width: 36px; height: 36px; border-radius: 50%;
  background: none; border: none; font-size: 1.15rem;
  cursor: pointer; transition: all .12s;
  display: flex; align-items: center; justify-content: center;
}
.ctx-e:hover { background: var(--surface-container); transform: scale(1.25); }
.ctx-sep { height: 1px; background: var(--outline-variant); margin: .15rem 0; }
.ctx-row {
  display: flex; align-items: center; gap: .625rem;
  padding: .6rem .875rem; border: none; background: none;
  border-radius: 12px; font-size: .875rem; font-weight: 500;
  color: var(--on-surface); cursor: pointer; width: 100%; text-align: left;
  transition: background .1s;
}
.ctx-row:hover { background: var(--surface-container); }
.ctx-row .material-symbols-outlined { font-size: 18px; color: var(--on-surface-variant); }
.ctx-del { color: #ef4444; }
.ctx-del .material-symbols-outlined { color: #ef4444; }

/* Lightbox */
.lightbox {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.94); z-index: 2000;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
.lb-x {
  position: absolute; top: 1.25rem; right: 1.25rem;
  width: 44px; height: 44px; border-radius: 50%;
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2);
  color: #fff; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .15s; backdrop-filter: blur(8px);
}
.lb-x:hover { background: rgba(255,255,255,.2); transform: scale(1.08); }
.lb-img { max-width: 92vw; max-height: 92vh; object-fit: contain; border-radius: 14px; box-shadow: 0 24px 64px rgba(0,0,0,.5); }

/* ══════════════════════════════════════════
   CONTRACT CARDS & MODALS
══════════════════════════════════════════ */
.contract-btn { color: var(--primary) !important; }

/* Contract bubble card */
.contract-card {
  border-radius: 16px; overflow: hidden;
  border: 1.5px solid rgba(168,85,247,.2);
  background: var(--surface-container-lowest);
  min-width: 250px; max-width: 290px;
  box-shadow: 0 4px 16px rgba(99,14,212,.1);
}
.cc-mine  { border-color: rgba(168,85,247,.4); }
.cc-theirs { border-color: rgba(168,85,247,.15); }
.cc-header {
  display: flex; align-items: center; gap: .5rem;
  padding: .625rem .875rem .5rem;
  background: linear-gradient(135deg, rgba(99,14,212,.08) 0%, rgba(168,85,247,.05) 100%);
  border-bottom: 1px solid rgba(168,85,247,.12);
}
.cc-icon { font-size: 22px; color: var(--primary); flex-shrink: 0; }
.cc-label { font-size: .64rem; font-weight: 600; color: var(--on-surface-variant); text-transform: uppercase; letter-spacing: .06em; }
.cc-title { font-size: .875rem; font-weight: 700; color: var(--on-surface); margin-top: 2px; }
.cc-status-badge {
  padding: .2rem .6rem; border-radius: 999px;
  font-size: .65rem; font-weight: 700; text-transform: capitalize;
  margin-left: auto; flex-shrink: 0;
}
.cc-status-badge.pending  { background: rgba(245,158,11,.12); color: #f59e0b; border: 1px solid rgba(245,158,11,.25); }
.cc-status-badge.active   { background: rgba(22,163,74,.12); color: #16a34a; border: 1px solid rgba(22,163,74,.25); }
.cc-status-badge.declined { background: rgba(239,68,68,.12); color: #ef4444; border: 1px solid rgba(239,68,68,.25); }
.cc-body { padding: .5rem .875rem; }
.cc-desc { font-size: .8rem; color: var(--on-surface-variant); line-height: 1.55; margin-bottom: .4rem; }
.cc-details { display: flex; flex-direction: column; gap: .25rem; font-size: .75rem; color: var(--on-surface-variant); }
.cc-actions { display: flex; gap: .5rem; padding: .5rem .875rem .625rem; }
.cc-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: .3rem;
  padding: .45rem; border-radius: 10px; border: 1px solid;
  font-size: .78rem; font-weight: 600; cursor: pointer; transition: all .15s;
}
.cc-accept  { background: rgba(22,163,74,.08); border-color: rgba(22,163,74,.25); color: #16a34a; }
.cc-accept:hover  { background: rgba(22,163,74,.16); transform: scale(1.02); }
.cc-decline { background: rgba(239,68,68,.08); border-color: rgba(239,68,68,.25); color: #ef4444; }
.cc-decline:hover { background: rgba(239,68,68,.16); transform: scale(1.02); }
.cc-pending { display: flex; align-items: center; gap: .35rem; padding: .4rem .875rem .5rem; font-size: .73rem; color: var(--on-surface-variant); font-style: italic; }

/* Contract / View Modal */
.modal-overlay-full {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 2000; display: flex; align-items: flex-end; justify-content: center;
}
@media (min-width: 640px) { .modal-overlay-full { align-items: center; padding: 1rem; } }
.contract-modal {
  width: 100%; max-width: 480px;
  background: var(--surface-container-lowest);
  border-radius: 24px 24px 0 0;
  border: 1px solid var(--outline-variant);
  overflow: hidden; display: flex; flex-direction: column;
  max-height: 92vh;
  box-shadow: var(--shadow-lg);
}
@media (min-width: 640px) { .contract-modal { border-radius: 24px; } }
.cm-header {
  display: flex; align-items: center; gap: .625rem;
  padding: 1.25rem 1.25rem .875rem;
  border-bottom: 1px solid var(--outline-variant);
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--surface-container-low) 0%, var(--surface-container-lowest) 100%);
}
.cm-header h3 { font-family: var(--font-headline); font-size: 1.05rem; font-weight: 800; color: var(--on-surface); flex: 1; letter-spacing: -.02em; }
.cm-body { flex: 1; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
.cm-field { display: flex; flex-direction: column; gap: .35rem; }
.cm-field label { font-family: var(--font-headline); font-size: .78rem; font-weight: 700; color: var(--on-surface-variant); text-transform: uppercase; letter-spacing: .03em; }
.cm-field input, .cm-field textarea {
  padding: .7rem .875rem;
  background: var(--surface-container-low);
  border: 1.5px solid var(--outline-variant);
  border-radius: 12px;
  font-size: .9rem; color: var(--on-surface); outline: none; resize: none; width: 100%;
  transition: all .15s;
}
.cm-field input:focus, .cm-field textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99,14,212,.1);
}
.cm-row { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
.billing-toggle { display: flex; gap: .375rem; }
.bt-btn {
  flex: 1; padding: .55rem; border-radius: 12px;
  border: 1.5px solid var(--outline-variant);
  background: var(--surface-container);
  font-size: .82rem; font-weight: 700;
  color: var(--on-surface-variant); cursor: pointer;
  transition: all .15s;
}
.bt-btn:hover { border-color: var(--primary); color: var(--primary); }
.bt-btn.active { background: var(--gradient-primary); color: #fff; border-color: var(--primary); box-shadow: var(--shadow-primary); }
.cm-error { font-size: .8rem; color: #ef4444; padding: .5rem .75rem; background: rgba(239,68,68,.08); border-radius: 10px; border: 1px solid rgba(239,68,68,.2); }
.cm-footer { display: flex; gap: .625rem; justify-content: flex-end; padding: .875rem 1.25rem 1.375rem; border-top: 1px solid var(--outline-variant); flex-shrink: 0; }
.cm-view-row { display: flex; justify-content: space-between; align-items: center; padding: .625rem 0; border-bottom: 1px solid var(--outline-variant); font-size: .875rem; }
.cm-view-row span:first-child { color: var(--on-surface-variant); font-size: .8rem; }
.cm-view-row strong { color: var(--on-surface); font-weight: 700; }
.cm-desc-view { font-size: .875rem; color: var(--on-surface-variant); line-height: 1.6; background: var(--surface-container-low); padding: .75rem; border-radius: 10px; margin-top: .25rem; }

/* ══════════════════════════════════════════
   SHARED BUTTONS
══════════════════════════════════════════ */
.btn-ghost {
  padding: .6rem 1.125rem;
  border-radius: 10px;
  border: 1.5px solid var(--outline-variant);
  background: none;
  color: var(--on-surface-variant);
  font-size: .875rem; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; gap: .35rem;
  transition: all .15s;
}
.btn-ghost:hover { border-color: var(--primary); color: var(--primary); background: color-mix(in srgb, var(--primary) 5%, transparent); }

.btn-primary {
  display: flex; align-items: center; gap: .4rem;
  padding: .65rem 1.375rem;
  border-radius: 10px;
  background: var(--gradient-primary);
  color: #fff; border: none;
  font-family: var(--font-headline);
  font-size: .9rem; font-weight: 700;
  cursor: pointer; transition: all .15s;
  box-shadow: var(--shadow-primary);
  letter-spacing: .01em;
}
.btn-primary:disabled { opacity: .5; cursor: not-allowed; box-shadow: none; }
.btn-primary:not(:disabled):hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: var(--shadow-primary-lg); }

.btn-spinner {
  width: 15px; height: 15px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: #fff;
  animation: spin .7s linear infinite; flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ══════════════════════════════════════════
   TRANSITIONS
══════════════════════════════════════════ */
.slide-down-enter-active, .slide-down-leave-active { transition: all .2s ease; }
.slide-down-enter-from,  .slide-down-leave-to      { transform: translateY(-8px); opacity: 0; }
.slide-up-enter-active,  .slide-up-leave-active    { transition: all .18s ease; }
.slide-up-enter-from,    .slide-up-leave-to        { transform: translateY(8px); opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity .22s ease; }
.fade-enter-from,   .fade-leave-to     { opacity: 0; }
.drop-enter-active, .drop-leave-active { transition: all .15s ease; }
.drop-enter-from,   .drop-leave-to     { transform: translateY(-6px) scale(.97); opacity: 0; }
.ctx-enter-active,  .ctx-leave-active  { transition: all .12s ease; }
.ctx-enter-from,    .ctx-leave-to      { transform: scale(.93); opacity: 0; }
.modal-enter-active { transition: all .28s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-leave-active { transition: all .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: translateY(24px); }
.btn-swap-enter-active, .btn-swap-leave-active { transition: all .18s ease; }
.btn-swap-enter-from,   .btn-swap-leave-to     { opacity: 0; transform: scale(.6) rotate(20deg); }
</style>
