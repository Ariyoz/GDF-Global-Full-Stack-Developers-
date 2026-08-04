<template>
  <div class="home-view">
    <HeroSection />
    <FeaturedDevelopers />
    <WhyGfd />
    <TrendingProjects />
    <HowItWorks />
    <TestimonialsSection />
    <HomeCta />
  </div>
</template>

<script setup>
import { useSeo, pageSeo } from '@/composables/useSeo'
import HeroSection         from '@/components/common/HeroSection.vue'
import FeaturedDevelopers  from '@/components/common/FeaturedDevelopers.vue'
import WhyGfd              from '@/components/common/WhyGfd.vue'
import TrendingProjects    from '@/components/common/TrendingProjects.vue'
import HowItWorks          from '@/components/common/HowItWorks.vue'
import TestimonialsSection from '@/components/common/TestimonialsSection.vue'
import HomeCta             from '@/components/common/HomeCta.vue'

useSeo(pageSeo.home)
</script>
