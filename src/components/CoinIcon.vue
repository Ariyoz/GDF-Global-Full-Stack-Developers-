<template>
  <span class="coin-icon-svg" :style="{ width: size + 'px', height: size + 'px' }">
    <svg v-if="coin === 'btc'" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#F7931A"/>
      <path d="M22.5 13.8c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.6-.4-.6 2.6c-.4-.1-.9-.2-1.3-.3l.6-2.6-1.6-.4-.7 2.7c-.3-.1-.7-.2-1-.3l-2-.5-.4 1.7s1.2.3 1.2.3c.6.2.8.6.7 1l-1.7 6.8c-.1.3-.4.6-.9.5 0 0-1.2-.3-1.2-.3l-.8 1.8 1.9.5.9.2-.7 2.7 1.6.4.7-2.7c.4.1.9.2 1.3.3l-.6 2.6 1.6.4.7-2.7c2.8.5 4.9.3 5.8-2.2.7-2-.03-3.2-1.5-3.9 1.1-.25 1.9-1 2.1-2.5zm-3.7 5.2c-.5 2-3.8 .9-4.9.6l.9-3.5c1.1.3 4.5.8 4 2.9zm.5-5.2c-.45 1.8-3.2.9-4.1.7l.8-3.2c.9.2 3.8.6 3.3 2.5z" fill="white"/>
    </svg>
    <svg v-else-if="coin === 'eth'" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#627EEA"/>
      <path d="M16 5.5l-.1.4v14l.1.1 6.4-3.8L16 5.5z" fill="white" fill-opacity="0.6"/>
      <path d="M16 5.5L9.6 16.2l6.4 3.8V5.5z" fill="white"/>
      <path d="M16 21.5l-.1.1v4.9l.1.3 6.4-9L16 21.5z" fill="white" fill-opacity="0.6"/>
      <path d="M16 26.8v-5.3l-6.4-3.8 6.4 9.1z" fill="white"/>
      <path d="M16 20l6.4-3.8-6.4-2.9V20z" fill="white" fill-opacity="0.2"/>
      <path d="M9.6 16.2L16 20v-6.7l-6.4 2.9z" fill="white" fill-opacity="0.6"/>
    </svg>
    <svg v-else-if="coin === 'sol'" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#9945FF"/>
      <path d="M9 20.5h11.5c.15 0 .3.06.4.17l1.85 1.97c.23.24.06.63-.27.63H10c-.15 0-.3-.06-.4-.17L7.75 21.1c-.23-.24-.06-.63.27-.63zM9 14.83h11.5c.15 0 .3.06.4.17l1.85 1.97c.23.24.06.63-.27.63H10c-.15 0-.3-.06-.4-.17l-1.85-1.97c-.23-.24-.06-.63.27-.63zM20.5 9.17H9c-.33 0-.5.39-.27.63l1.85 1.97c.1.11.25.17.4.17h11.5c.33 0 .5-.39.27-.63l-1.85-1.97c-.1-.11-.25-.17-.4-.17z" fill="white"/>
    </svg>
    <svg v-else-if="coin === 'usdt'" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#26A17B"/>
      <path d="M17.3 17.3v-.01c-.07.01-.43.03-1.3.03-.68 0-1.16-.02-1.33-.03v.01C10.85 17.1 8 16.4 8 15.5s2.85-1.6 6.67-1.8v2.87c.17.01.67.04 1.35.04.82 0 1.23-.03 1.28-.04v-2.87C21.15 13.9 24 14.6 24 15.5s-2.85 1.6-6.7 1.8zM14.67 13.5v-2.5H10.5V9H21.5v2H17.3v2.5c4.27.22 7.47 1.1 7.47 2.17s-3.2 1.95-7.47 2.17v3.86h-2.63v-3.86c-4.27-.22-7.47-1.1-7.47-2.17s3.2-1.95 7.47-2.17z" fill="white"/>
    </svg>
    <svg v-else-if="coin === 'usdc'" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#2775CA"/>
      <path d="M16 6C10.48 6 6 10.48 6 16s4.48 10 10 10 10-4.48 10-10S21.52 6 16 6zm2.5 14.5c-.39.13-.78.22-1.17.28v1.22h-1.33v-1.18c-.78-.1-1.52-.35-2.17-.72l.7-1.38c.56.32 1.17.52 1.8.6v-2.24c-1.27-.33-2.67-.78-2.67-2.36 0-1.15.78-2.1 2.17-2.37V11.1h1.33v1.27c.67.1 1.3.33 1.84.65l-.64 1.38c-.48-.27-1-.45-1.53-.53v2.16c1.3.33 2.7.8 2.7 2.43 0 1.18-.8 2.17-2.03 2.49zm.37-2.56c0-.55-.57-.78-1.37-1.03v2.1c.72-.13 1.37-.54 1.37-1.07zm-3.37-4.32c0 .52.55.75 1.3.98V13.5c-.67.13-1.3.52-1.3 1.12z" fill="white"/>
    </svg>
    <span v-else class="coin-fallback">{{ coin?.toUpperCase()?.slice(0,1) }}</span>
  </span>
</template>

<script setup>
defineProps({
  coin: { type: String, required: true },
  size: { type: Number, default: 32 },
})
</script>

<style scoped>
.coin-icon-svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.coin-icon-svg svg {
  width: 100%;
  height: 100%;
}
.coin-fallback {
  font-weight: 800;
  font-size: .9em;
}
</style>
