<template>
  <Teleport to="body">
    <Transition name="call-fade">
      <div v-if="visible" class="call-screen" :class="{ 'is-video': isVideo }">

        <!-- Video streams -->
        <template v-if="isVideo">
          <!-- Remote video (full screen) -->
          <video ref="remoteVideoEl" class="remote-video" autoplay playsinline />
          <!-- Local video (pip) -->
          <video ref="localVideoEl"  class="local-video"  autoplay playsinline muted />
        </template>

        <!-- Voice call background -->
        <div v-else class="voice-bg">
          <div class="voice-ripple"/>
          <div class="voice-avatar">
            <img v-if="otherAvatar" :src="otherAvatar" class="voice-av-img" />
            <span v-else class="voice-av-ini">{{ (otherName||'?')[0].toUpperCase() }}</span>
          </div>
        </div>

        <!-- Header info -->
        <div class="call-info">
          <p class="call-peer-name">{{ otherName }}</p>
          <p class="call-status">{{ statusText }}</p>
        </div>

        <!-- Controls -->
        <div class="call-controls">
          <!-- Mute mic -->
          <button class="ctrl-btn" :class="{ active: micMuted }" @click="toggleMic" :title="micMuted ? 'Unmute' : 'Mute'">
            <span class="material-symbols-outlined">{{ micMuted ? 'mic_off' : 'mic' }}</span>
            <span class="ctrl-label">{{ micMuted ? 'Unmute' : 'Mute' }}</span>
          </button>

          <!-- Speaker / volume -->
          <button class="ctrl-btn" :class="{ active: speakerOff }" @click="toggleSpeaker" title="Speaker">
            <span class="material-symbols-outlined">{{ speakerOff ? 'volume_off' : 'volume_up' }}</span>
            <span class="ctrl-label">Speaker</span>
          </button>

          <!-- Camera toggle (video only) -->
          <button v-if="isVideo" class="ctrl-btn" :class="{ active: camOff }" @click="toggleCam" title="Camera">
            <span class="material-symbols-outlined">{{ camOff ? 'videocam_off' : 'videocam' }}</span>
            <span class="ctrl-label">Camera</span>
          </button>

          <!-- Flip camera (mobile video) -->
          <button v-if="isVideo" class="ctrl-btn" @click="flipCam" title="Flip">
            <span class="material-symbols-outlined">flip_camera_ios</span>
            <span class="ctrl-label">Flip</span>
          </button>

          <!-- End call -->
          <button class="ctrl-btn end-btn" @click="endCall" title="End call">
            <span class="material-symbols-outlined">call_end</span>
            <span class="ctrl-label">End</span>
          </button>
        </div>

      </div>
    </Transition>

    <!-- Incoming call overlay -->
    <Transition name="call-fade">
      <div v-if="incomingCall" class="incoming-overlay">
        <div class="incoming-card">
          <div class="inc-av">
            <img v-if="incomingCall.caller_avatar" :src="incomingCall.caller_avatar" class="voice-av-img" />
            <span v-else class="voice-av-ini">{{ (incomingCall.caller_name||'?')[0].toUpperCase() }}</span>
          </div>
          <div class="inc-pulse" />
          <p class="inc-name">{{ incomingCall.caller_name }}</p>
          <p class="inc-type">{{ incomingCall.call_type === 'video' ? '📹 Incoming video call' : '📞 Incoming voice call' }}</p>
          <div class="inc-btns">
            <button class="inc-btn reject" @click="rejectIncoming">
              <span class="material-symbols-outlined">call_end</span>
            </button>
            <button class="inc-btn accept" @click="acceptIncoming">
              <span class="material-symbols-outlined">{{ incomingCall.call_type === 'video' ? 'videocam' : 'call' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useMessagingStore } from '@/store/messaging'
import { useAuthStore } from '@/store/auth'
import { websocketService } from '@/services/websocket.service'

const messagingStore = useMessagingStore()
const authStore      = useAuthStore()

// ── State ──
const visible       = ref(false)
const isVideo       = ref(false)
const otherName     = ref('')
const otherAvatar   = ref('')
const otherUserId   = ref('')
const callStatus    = ref('connecting') // connecting | ringing | active | ended
const micMuted      = ref(false)
const speakerOff    = ref(false)
const camOff        = ref(false)
const incomingCall  = ref(null)
const isCaller      = ref(false)

// DOM refs for video
const localVideoEl  = ref(null)
const remoteVideoEl = ref(null)

// WebRTC
let pc           = null
let localStream  = null
let remoteStream = null
let facingMode   = 'user'

const statusText = computed(() => {
  if (callStatus.value === 'connecting') return 'Connecting…'
  if (callStatus.value === 'ringing')    return 'Ringing…'
  if (callStatus.value === 'active')     return callDuration.value
  return 'Call ended'
})

// ── Call duration timer ──
const callDuration  = ref('00:00')
let durationSecs    = 0
let durationTimer   = null

function startTimer() {
  durationSecs = 0
  durationTimer = setInterval(() => {
    durationSecs++
    const m = Math.floor(durationSecs / 60).toString().padStart(2, '0')
    const s = (durationSecs % 60).toString().padStart(2, '0')
    callDuration.value = `${m}:${s}`
  }, 1000)
}
function stopTimer() {
  clearInterval(durationTimer)
  callDuration.value = '00:00'
  durationSecs = 0
}

// ── WebRTC helpers ──
async function createPC() {
  const config = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  }
  pc = new RTCPeerConnection(config)

  // Add local tracks
  if (localStream) {
    localStream.getTracks().forEach(t => pc.addTrack(t, localStream))
  }

  // Receive remote stream
  pc.ontrack = (e) => {
    remoteStream = e.streams[0]
    if (remoteVideoEl.value) remoteVideoEl.value.srcObject = remoteStream
  }

  // Send ICE candidates via WebSocket
  pc.onicecandidate = (e) => {
    if (e.candidate) {
      websocketService.send({
        type:      'webrtc_ice',
        to:        otherUserId.value,
        candidate: e.candidate,
      })
    }
  }

  pc.onconnectionstatechange = () => {
    if (pc?.connectionState === 'connected') {
      callStatus.value = 'active'
      startTimer()
    }
    if (['disconnected', 'failed', 'closed'].includes(pc?.connectionState)) {
      endCall()
    }
  }
}

async function getMedia() {
  const constraints = {
    audio: true,
    video: isVideo.value ? { facingMode, width: 1280, height: 720 } : false,
  }
  try {
    localStream = await navigator.mediaDevices.getUserMedia(constraints)
    if (localVideoEl.value) {
      localVideoEl.value.srcObject = localStream
    }
  } catch (e) {
    console.error('Media access denied:', e)
    alert(`Camera/microphone access required for ${isVideo.value ? 'video' : 'voice'} calls.`)
    throw e
  }
}

// ── Start outgoing call ──
async function startCall(type, conv) {
  isVideo.value     = type === 'video'
  otherName.value   = conv.name || 'Unknown'
  otherAvatar.value = conv.avatar || ''
  otherUserId.value = conv.other_user_id || ''
  isCaller.value    = true
  callStatus.value  = 'ringing'
  visible.value     = true

  try {
    await getMedia()
    await createPC()

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    websocketService.send({
      type:         'call_initiate',
      to:           otherUserId.value,
      call_type:    type,
      caller_name:  authStore.profile?.full_name || 'User',
      caller_avatar: authStore.profile?.avatar || '',
      offer:        offer,
    })
  } catch (e) {
    cleanupCall()
  }
}

// ── Accept incoming call ──
async function acceptIncoming() {
  const call = incomingCall.value
  if (!call) return

  isVideo.value     = call.call_type === 'video'
  otherName.value   = call.caller_name || 'Unknown'
  otherAvatar.value = call.caller_avatar || ''
  otherUserId.value = call.from || ''
  isCaller.value    = false
  callStatus.value  = 'connecting'
  incomingCall.value = null
  visible.value     = true

  try {
    await getMedia()
    await createPC()

    // Set remote offer
    if (call.offer) {
      await pc.setRemoteDescription(new RTCSessionDescription(call.offer))
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      websocketService.send({
        type:   'call_accept',
        to:     otherUserId.value,
        answer: answer,
      })
    }
  } catch (e) {
    cleanupCall()
  }
}

// ── Reject incoming call ──
function rejectIncoming() {
  if (!incomingCall.value) return
  websocketService.send({ type: 'call_reject', to: incomingCall.value.from })
  incomingCall.value = null
}

// ── End call ──
function endCall() {
  websocketService.send({ type: 'call_end', to: otherUserId.value })
  cleanupCall()
}

function cleanupCall() {
  stopTimer()
  // Stop all tracks
  if (localStream) {
    localStream.getTracks().forEach(t => t.stop())
    localStream = null
  }
  // Close peer connection
  if (pc) { pc.close(); pc = null }
  // Clear video elements
  if (localVideoEl.value)  localVideoEl.value.srcObject = null
  if (remoteVideoEl.value) remoteVideoEl.value.srcObject = null
  visible.value      = false
  callStatus.value   = 'ended'
  micMuted.value     = false
  camOff.value       = false
  speakerOff.value   = false
}

// ── Controls ──
function toggleMic() {
  micMuted.value = !micMuted.value
  if (localStream) {
    localStream.getAudioTracks().forEach(t => t.enabled = !micMuted.value)
  }
}

function toggleCam() {
  camOff.value = !camOff.value
  if (localStream) {
    localStream.getVideoTracks().forEach(t => t.enabled = !camOff.value)
  }
}

function toggleSpeaker() {
  speakerOff.value = !speakerOff.value
  if (remoteVideoEl.value) remoteVideoEl.value.muted = speakerOff.value
}

async function flipCam() {
  facingMode = facingMode === 'user' ? 'environment' : 'user'
  if (!localStream) return
  const oldTrack = localStream.getVideoTracks()[0]
  if (oldTrack) {
    oldTrack.stop()
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode },
      audio: false,
    }).catch(() => null)
    if (newStream) {
      const newTrack = newStream.getVideoTracks()[0]
      localStream.removeTrack(oldTrack)
      localStream.addTrack(newTrack)
      if (localVideoEl.value) localVideoEl.value.srcObject = localStream
      // Replace track in peer connection
      if (pc) {
        const sender = pc.getSenders().find(s => s.track?.kind === 'video')
        if (sender) sender.replaceTrack(newTrack)
      }
    }
  }
}

// ── Handle WebSocket call events ──
function handleWsEvent(event) {
  const type = event.type || event.event

  if (type === 'incoming_call' || type === 'call_initiate') {
    incomingCall.value = {
      from:          event.from || event.caller_id,
      caller_name:   event.caller_name,
      caller_avatar: event.caller_avatar,
      call_type:     event.call_type,
      offer:         event.offer,
    }
    return
  }

  if (type === 'call_accept' || type === 'call_accepted') {
    callStatus.value = 'connecting'
    if (event.answer && pc) {
      pc.setRemoteDescription(new RTCSessionDescription(event.answer)).catch(console.error)
    }
    return
  }

  if (type === 'call_reject' || type === 'call_rejected') {
    if (visible.value) cleanupCall()
    incomingCall.value = null
    return
  }

  if (type === 'call_end' || type === 'call_ended') {
    if (visible.value) cleanupCall()
    incomingCall.value = null
    return
  }

  if (type === 'webrtc_ice' && event.candidate && pc) {
    pc.addIceCandidate(new RTCIceCandidate(event.candidate)).catch(console.error)
    return
  }
}

let wsUnsub = null

onMounted(() => {
  wsUnsub = websocketService.onEvent(handleWsEvent)
})

onUnmounted(() => {
  if (wsUnsub) wsUnsub()
  cleanupCall()
})

// ── Expose startCall so MessagingView can call it ──
defineExpose({ startCall })
</script>

<style scoped>
/* ── Call Screen ── */
.call-screen {
  position: fixed; inset: 0; z-index: 4000;
  background: #1a1a2e;
  display: flex; flex-direction: column;
  align-items: center; justify-content: space-between;
  padding: env(safe-area-inset-top, 0px) 0 env(safe-area-inset-bottom, 0px);
}

/* ── Video streams ── */
.remote-video {
  position: absolute; inset: 0;
  width: 100%; height: 100%; object-fit: cover;
  background: #000;
}
.local-video {
  position: absolute; top: 1rem; right: 1rem;
  width: 100px; height: 140px;
  border-radius: 12px; object-fit: cover;
  border: 2px solid rgba(255,255,255,.3);
  z-index: 10; background: #111;
}

/* ── Voice call background ── */
.voice-bg {
  flex: 1; display: flex; align-items: center; justify-content: center;
  width: 100%; position: relative;
}
.voice-ripple {
  position: absolute;
  width: 180px; height: 180px; border-radius: 50%;
  background: rgba(168,85,247,.15);
  animation: ripple 2s ease-out infinite;
}
@keyframes ripple {
  0%   { transform: scale(1);   opacity: .6; }
  100% { transform: scale(2.2); opacity: 0;  }
}
.voice-avatar {
  width: 110px; height: 110px; border-radius: 50%;
  overflow: hidden; background: rgba(168,85,247,.2);
  display: flex; align-items: center; justify-content: center;
  border: 3px solid rgba(168,85,247,.4);
  position: relative; z-index: 1;
}
.voice-av-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.voice-av-ini {
  font-size: 2.5rem; font-weight: 800; color: #fff;
  font-family: var(--font-headline);
}

/* ── Call info ── */
.call-info {
  position: relative; z-index: 5;
  text-align: center; padding: 2rem 1rem 0;
}
.call-peer-name {
  font-family: var(--font-headline); font-size: 1.5rem; font-weight: 800;
  color: #fff; margin: 0;
}
.call-status {
  font-size: .9rem; color: rgba(255,255,255,.65); margin-top: .3rem;
  font-variant-numeric: tabular-nums;
}

/* ── Controls ── */
.call-controls {
  position: relative; z-index: 5;
  display: flex; align-items: center; justify-content: center;
  gap: 1.25rem; padding: 1.5rem 1rem calc(2rem + env(safe-area-inset-bottom, 0px));
  flex-wrap: wrap;
}
.ctrl-btn {
  display: flex; flex-direction: column; align-items: center; gap: .3rem;
  width: 64px; height: 64px; border-radius: 50%; border: none;
  background: rgba(255,255,255,.12); color: #fff; cursor: pointer;
  transition: background .15s; justify-content: center;
}
.ctrl-btn:hover { background: rgba(255,255,255,.22); }
.ctrl-btn.active { background: rgba(255,255,255,.3); }
.ctrl-btn .material-symbols-outlined { font-size: 24px; }
.ctrl-label { font-size: .6rem; font-weight: 600; color: rgba(255,255,255,.75); }
.end-btn { background: #ef4444 !important; width: 72px; height: 72px; }
.end-btn:hover { background: #dc2626 !important; }

/* ── Incoming call overlay ── */
.incoming-overlay {
  position: fixed; inset: 0; z-index: 3500;
  background: rgba(0,0,0,.75); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}
.incoming-card {
  background: #1a1a2e;
  border: 1px solid rgba(168,85,247,.2);
  border-radius: 24px; padding: 2.5rem 2rem;
  display: flex; flex-direction: column; align-items: center;
  gap: 1rem; min-width: 280px; max-width: 360px; width: 100%;
  position: relative;
}
.inc-av {
  width: 80px; height: 80px; border-radius: 50%;
  overflow: hidden; background: rgba(168,85,247,.2);
  display: flex; align-items: center; justify-content: center;
}
.inc-pulse {
  position: absolute; top: calc(2.5rem - 8px); left: calc(50% - 48px);
  width: 96px; height: 96px; border-radius: 50%;
  border: 2px solid rgba(34,197,94,.5);
  animation: incpulse 1.5s ease-out infinite;
  pointer-events: none;
}
@keyframes incpulse {
  0%   { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.8); opacity: 0; }
}
.inc-name {
  font-family: var(--font-headline); font-size: 1.2rem; font-weight: 800;
  color: #fff; margin: 0;
}
.inc-type { font-size: .875rem; color: rgba(255,255,255,.6); margin: 0; }
.inc-btns { display: flex; gap: 2.5rem; margin-top: .5rem; }
.inc-btn {
  width: 64px; height: 64px; border-radius: 50%; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.inc-btn .material-symbols-outlined { font-size: 26px; color: #fff; }
.inc-btn.reject { background: #ef4444; }
.inc-btn.accept { background: #22c55e; animation: btnpulse 1s ease-in-out infinite; }
@keyframes btnpulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,.4); }
  50%     { box-shadow: 0 0 0 12px rgba(34,197,94,0); }
}

/* ── Transitions ── */
.call-fade-enter-active, .call-fade-leave-active { transition: all .3s ease; }
.call-fade-enter-from, .call-fade-leave-to { opacity: 0; transform: scale(.96); }
</style>
