<template>
  <div 
    class="hero-slider-wrapper" 
    @mouseenter="stopAutoPlay" 
    @mouseleave="startAutoPlay"
  >
    <transition-group name="fade" tag="div" class="slides-container">
      <div 
        v-for="(item, index) in slides" 
        :key="index"
        v-show="currentIndex === index"
        class="slide-item"
        :style="{ backgroundImage: `url(${item.image})` }"
      >
        <div class="slide-overlay"></div>
        <div class="slide-text-container">
          <h3 class="slide-subtitle animate-up">{{ item.subtitle }}</h3>
          <h1 class="slide-title animate-up delay-1">{{ item.title }}</h1>
          <h1 class="slide-title-bold animate-up delay-1">{{ item.titleBold }}</h1>
        </div>
      </div>
    </transition-group>

    <button class="custom-arrow left-arrow" @click="handlePrev">
      <el-icon><ArrowLeft /></el-icon>
    </button>
    <button class="custom-arrow right-arrow" @click="handleNext">
      <el-icon><ArrowRight /></el-icon>
    </button>

    <div class="indicators">
      <span 
        v-for="(item, index) in slides" 
        :key="index" 
        :class="['dot', { active: currentIndex === index }]"
        @click="goToSlide(index)"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted,computed } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

// ⭐ 核心修改：定义 Props 接收父组件传来的数据
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

// 如果 Shopify 还没配数据，显示一个默认占位
const slides = computed(() => {
  return props.items.length ? props.items : [
    { image: '', subtitle: 'Setup in Theme Editor', title: 'WELCOME', titleBold: 'STORE' }
  ]
})

const currentIndex = ref(0)
let timer = null

const nextSlide = () => { currentIndex.value = (currentIndex.value + 1) % slides.value.length }
const prevSlide = () => { currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length }
const startAutoPlay = () => { if (timer) return; timer = setInterval(nextSlide, 5000) }
const stopAutoPlay = () => { if (timer) { clearInterval(timer); timer = null } }
const handleNext = () => { nextSlide(); stopAutoPlay(); startAutoPlay() }
const handlePrev = () => { prevSlide(); stopAutoPlay(); startAutoPlay() }
const goToSlide = (index) => { currentIndex.value = index; stopAutoPlay(); startAutoPlay() }

onMounted(() => startAutoPlay())
onUnmounted(() => stopAutoPlay())
</script>

<style scoped>
/* === 容器 === */
.hero-slider-wrapper {
  position: relative;
  width: 100%;
  height: 650px; /* 高度可以根据设计图微调，比如 700px */
  overflow: hidden;
  background-color: #333;
}

/* 响应式高度 */
@media (max-width: 1200px) { .hero-slider-wrapper { height: 500px; } }
@media (max-width: 768px) { .hero-slider-wrapper { height: 165px; } }

/* === 幻灯片 === */
.slides-container { width: 100%; height: 100%; position: relative; }

.slide-item {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-size: cover; background-position: center;
  display: flex; align-items: center; justify-content: center;
}

.fade-enter-active, .fade-leave-active { transition: opacity 1s ease-in-out; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.2); /* 遮罩稍微淡一点，让图片更透亮 */
  z-index: 1;
}
.slide-text-container {
  position: relative; z-index: 2; text-align: center; color: #fff; padding: 0 20px;
  /* 文字稍微往上提一点，避开叠压区域 */
  margin-bottom: 60px; 
}

/* === 按钮视觉垂直居中 === */
.custom-arrow {
  position: absolute;
  top: 50%; /* 上移40px以平衡底部遮挡 */
  transform: translateY(-50%);
  width: 50px; height: 50px;
  background: rgba(0,0,0,0.4); /* 半透明黑底 */
  border: 1px solid rgba(255,255,255,0.4); /* 细白边框 */
  color: #fff; border-radius: 50%; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: all 0.4s ease; z-index: 10;
  outline: none; padding: 0;
}
.left-arrow { left: -80px; }
.right-arrow { right: -80px; }

.hero-slider-wrapper:hover .custom-arrow { opacity: 1; }
/* 箭头飞入的位置：离边缘 30px */
.hero-slider-wrapper:hover .left-arrow { left: 30px; }
.hero-slider-wrapper:hover .right-arrow { right: 30px; }
.custom-arrow:hover { background: #d4af37; border-color: #d4af37; }

/* === 指示点 === */
.indicators {
  display: none /* 默认隐藏，手机端显示 */;
}
.dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.4);
  cursor: pointer; transition: all 0.3s;
}
.dot.active { background: #fff; transform: scale(1.2); }

/* === 文字排版 === */
.slide-subtitle { font-size: 16px; letter-spacing: 3px; margin-bottom: 15px; text-transform: uppercase; font-weight: 500; }
.slide-title, .slide-title-bold { font-size: 64px; line-height: 1.1; margin: 0; letter-spacing: 2px; }
.slide-title-bold { font-weight: 800; }
@media (max-width: 768px) {
  .slide-title, .slide-title-bold { font-size: 32px; }
  .custom-arrow { top: 50%; } /* 手机端回归物理居中 */
  .indicators { position: absolute;
  left: 50%; transform: translateX(-50%);
  display: flex; gap: 10px; z-index: 10;bottom: 20px; }
}
.animate-up { animation: fadeUp 1s forwards; opacity: 0; transform: translateY(30px); }
.delay-1 { animation-delay: 0.3s; }
@keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
</style>