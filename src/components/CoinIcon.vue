<template>
  <img
    :src="logoUrl"
    :alt="coin?.toUpperCase()"
    :width="size"
    :height="size"
    class="coin-logo-img"
    :style="{ width: size + 'px', height: size + 'px', borderRadius: '50%' }"
    loading="lazy"
    decoding="async"
    @error="onError"
    :key="coin"
  />
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  coin: { type: String, required: true },
  size: { type: Number, default: 32 },
})

const errored = ref(false)

// CoinGecko CDN — real official logos, no signup needed
const COINGECKO_IDS = {
  btc:  'bitcoin',
  eth:  'ethereum',
  sol:  'solana',
  usdt: 'tether',
  usdc: 'usd-coin',
}

// Fallback: cryptocurrency-icons open-source set
const FALLBACK_URLS = {
  btc:  'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  eth:  'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  sol:  'https://assets.coingecko.com/coins/images/4128/large/solana.png',
  usdt: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
  usdc: 'https://assets.coingecko.com/coins/images/6319/large/usdc.png',
}

const logoUrl = computed(() => {
  const key = props.coin?.toLowerCase()
  if (errored.value) return FALLBACK_URLS[key] || ''
  const id = COINGECKO_IDS[key]
  if (!id) return FALLBACK_URLS[key] || ''
  // Use thumb size for small icons, large for bigger
  const sz = props.size >= 40 ? 'large' : 'thumb'
  return `https://assets.coingecko.com/coins/images/${_cgId(key)}/${sz}/${id}.png`
})

// CoinGecko numeric IDs
function _cgId(coin) {
  return { btc: 1, eth: 279, sol: 4128, usdt: 325, usdc: 6319 }[coin] || 1
}

function onError() {
  errored.value = true
}
</script>

<style scoped>
.coin-logo-img {
  display: inline-block;
  object-fit: cover;
  flex-shrink: 0;
}
</style>
