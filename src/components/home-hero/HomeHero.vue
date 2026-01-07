<template>
  <section class="home-hero-section">
    
    <div class="breakout-banner">
      <HeroSlider :items="heroData.slides"/>
    </div>

    <div class="content-flow">
      <HeroContentCard :data="heroData.contentCard"/>
    </div>

    <div class="feature-section">
      <FeatureBar :items="heroData.features"/>
    </div>

  </section>
</template>

<script setup>
import HeroSlider from './HeroSlider.vue'
import HeroContentCard from './HeroContentCard.vue'
import FeatureBar from './FeatureBar.vue'
import { computed } from 'vue';

// ⭐ 接收从 main.js (Liquid) 传进来的大对象
const props = defineProps({
  sectionData: {
    type: Object,
    default: () => ({})
  }
})

const heroData = computed(() => {
  return {
    // 获取 slides 数组，如果没有则返回空数组
    slides: props.sectionData.slides || [],
    features: props.sectionData.features || [],
    contentCard: props.sectionData.contentCard || {}
  }
})
</script>

<style scoped>
.home-hero-section {
  padding-bottom: 50px;
}

/* === ⭐ 核心修复：智能突围布局 === */
.breakout-banner {
  position: relative;
  z-index: 1;
  
  /* 公式解释：
    width: 100vw; -> 强制宽度等于屏幕视口宽度
    margin-left: calc(50% - 50vw); -> 通过计算，强制把元素拉到屏幕最左边
  */
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

/* 如果你希望在大屏幕上 Banner 不要无限宽，而是限制在 1700px */
@media (min-width: 1700px) {
  .breakout-banner {
    width: 1700px;
    /* (1400px父容器 - 1700px子元素) / 2 = -150px */
    margin-left: -150px; 
    margin-right: -150px;
  }
}

/* 之前写的 max-width: 1440px 这种兜底逻辑现在不需要了，
   因为 calc(50% - 50vw) 在小屏幕下会自动计算为 0，完美适配手机。
*/

.content-flow {
  position: relative;
  z-index: 10;
  padding: 0 80px;
  max-width: 100%; /* 防止内容溢出 */
  box-sizing: border-box;
}

.feature-section {
  position: relative;
  z-index: 9;
  margin-top: -70px;
  padding: 0 20px;
}

/* === 手机端微调 === */
@media (max-width: 768px) {
  .content-flow {
    padding: 15px 20px;
  }
  .feature-section{
    margin-top: 0px;
    padding: 0px;
  }
}
</style>