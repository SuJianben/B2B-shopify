<template>
  <section class="recommended-products-section" ref="sectionRef">
    
    <div class="section-header">
      <h2 class="section-title">{{ settings.title }}</h2>
      <div class="section-decoration">
        <span class="line-deco">~~~~</span>
        <span class="heart-icon">❤</span>
        <span class="line-deco">~~~~</span>
      </div>
    </div>

    <div class="slider-container">
      
      <div class="slider-viewport">
        <div class="slider-track" :style="trackStyle">
          
          <div 
            v-for="(product, index) in productList" 
            :key="product.id" 
            class="product-card"
            :style="{ '--delay': index * 0.1 + 's' }" 
          >
            <a :href="product.url" class="product-link">
              <div class="img-wrapper">
                <img v-if="product.image" :src="product.image" :alt="product.title" loading="lazy" />
                <div v-else class="placeholder-img">No Image</div>
              </div>
              <div class="info-wrapper">
                <h3 class="product-title">{{ product.title }}</h3>
              </div>
            </a>
          </div>

        </div>
      </div>

      <div class="custom-navigation">
        <div class="nav-line"></div>
        
        <div class="nav-buttons">
          <button 
            class="nav-btn prev-btn" 
            :class="{ disabled: currentIndex === 0 }"
            @click="handlePrev"
          >
            <el-icon><ArrowLeft /></el-icon>
          </button>
          
          <button 
            class="nav-btn next-btn" 
            :class="{ disabled: currentIndex >= maxIndex }"
            @click="handleNext"
          >
            <el-icon><ArrowRight /></el-icon>
          </button>
        </div>

        <div class="nav-line"></div>
      </div>

    </div>

  </section>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  data: { type: Object, default: () => ({}) }
})

const settings = computed(() => ({
  title: props.data.title || 'Recommended PRODUCTS'
}))

// 处理产品数据
const productList = computed(() => {
  if (props.data.products && props.data.products.length > 0) {
    return props.data.products
  }
  // 模拟数据用于预览
  return Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    title: 'Recommended Item ' + (i + 1),
    image: 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png',
    url: '#'
  }))
})

// === 响应式视口逻辑 ===
const windowWidth = ref(window.innerWidth)
const updateWidth = () => windowWidth.value = window.innerWidth

const isMobile = computed(() => windowWidth.value <= 768)

// ⭐ 核心修改：电脑 3 列，手机 1 列
const visibleColumns = computed(() => isMobile.value ? 1 : 3)

// === Slider Logic ===
const currentIndex = ref(0)
// ⭐ 核心修改：因为只有一行，Total Columns 就是产品总数
const maxIndex = computed(() => Math.max(0, productList.value.length - visibleColumns.value))

watch(maxIndex, (newMax) => {
  if (currentIndex.value > newMax) currentIndex.value = newMax
})

const trackStyle = computed(() => ({
  '--current-index': currentIndex.value,
  '--visible-cols': visibleColumns.value // 传给 CSS 计算宽度
}))

const handlePrev = () => { if (currentIndex.value > 0) currentIndex.value-- }
const handleNext = () => { if (currentIndex.value < maxIndex.value) currentIndex.value++ }

// === 进场动画 Logic (复用) ===
const sectionRef = ref(null)
let observer = null

onMounted(() => {
  window.addEventListener('resize', updateWidth)
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.15 })
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
  if (observer) observer.disconnect()
})
</script>

<style scoped>
/* 复用 .featured-products-section 的容器样式 */
.recommended-products-section {
  padding: 50px 100px 50px; /* 稍微增加底部 Padding */
  background-color: #ffffff;
  max-width: 1400px;
  margin: 0 auto;
}

/* === 标题样式 (完全复用) === */
.section-header { text-align: center; margin-bottom: 40px; }
.section-title { font-size: 32px; font-weight: 400; color: #333; margin: 0 0 10px; text-transform: uppercase; }
.section-decoration { display: flex; align-items: center; justify-content: center; gap: 8px; color: #ddd; }
.heart-icon { font-size: 16px; color: #d4af37; font-weight: bold; } /* 金色爱心 */

/* === Slider (复用 + 修改 Grid) === */
.slider-container { position: relative; width: 100%; }
.slider-viewport { width: 100%; overflow-x: hidden; padding-bottom: 20px; padding-top: 10px; }

.slider-track {
  display: grid;
  /* ⭐ 核心修改：只显示 1 行 */
  grid-template-rows: 1fr; 
  grid-auto-flow: column;
  gap: 0;
  
  /* ⭐ 核心修改：列宽计算 (100% / 可见列数) */
  --col-width: calc(100% / var(--visible-cols));
  grid-auto-columns: var(--col-width);
  
  transform: translateX(calc(var(--current-index) * -1 * var(--col-width)));
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform;
}

/* === 卡片样式 & 动画 (完全复用) === */
.product-card {
  position: relative;
  transition: transform 0.3s ease;
  width: 100%;
  padding: 0 15px; /* 间距 */
  box-sizing: border-box;
  opacity: 0;
  transform: translateX(50px);
}

.recommended-products-section.is-visible .product-card {
  animation: slideFadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: var(--delay);
}

@keyframes slideFadeIn {
  from { opacity: 0; transform: translateX(50px); }
  to { opacity: 1; transform: translateX(0); }
}

.img-wrapper {
  width: 100%; aspect-ratio: 1 / 1;
  border: 1px solid #eee; padding: 20px; overflow: hidden; position: relative;
  box-sizing: border-box; display: flex; align-items: center; justify-content: center; background: #fff;
  transition: all 0.3s;
}
/* 中心微光特效 (复用) */
.img-wrapper::after {
  content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 100%; height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%);
  opacity: 0; transition: opacity 0.4s ease; pointer-events: none;
}
.img-wrapper img { max-width: 100%; max-height: 100%; object-fit: contain; }

.product-card:hover .img-wrapper { border-color: #d4af37; }
.product-card:hover .img-wrapper::after { opacity: 1; }

.info-wrapper { margin-top: 15px; text-align: center; }
.product-title { font-size: 14px; color: #666; margin: 0; }
.product-link { text-decoration: none; display: block; color: inherit; }

/* === 底部导航栏 (完全复用) === */
.custom-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px; /* 距离卡片底部的距离 */
  gap: 20px;
}

.nav-line {
  flex: 0 0 100px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
}

.nav-buttons { display: flex; gap: 15px; }

.nav-btn {
  width: 40px; height: 40px; border-radius: 50%;
  border: 1px solid #eee; background: #fff; color: #999;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.3s ease; outline: none;
}
.nav-btn:not(.disabled):hover {
  border-color: #d4af37; color: #d4af37; transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}
.nav-btn.disabled { opacity: 0.4; cursor: not-allowed; background-color: #f9f9f9; }

/* === 响应式 === */
@media (max-width: 990px) {
  .recommended-products-section { padding: 50px 20px 50px; }
  /* 手机端样式调整 */
  .nav-line { flex-basis: 50px; } /* 线条变短 */
  .section-title { font-size: 24px; }
}
</style>