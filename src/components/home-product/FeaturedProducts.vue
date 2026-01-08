<template>
  <section class="featured-products-section" ref="sectionRef">
    
    <div class="section-header">
      <h2 class="section-title">{{ settings.title }}</h2>
      <div class="section-decoration">
        <span class="line-deco">~~~~</span>
        <el-icon class="heart-icon" color="#d4af37"><StarFilled /></el-icon>
        <span class="line-deco">~~~~</span>
      </div>
    </div>

    <div class="slider-container">
      
      <div class="slider-viewport">
        <div class="slider-track" :style="trackStyle">
          <div 
            v-for="(product, index) in rawProductList" 
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
import { StarFilled, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  data: { type: Object, default: () => ({}) }
})

const settings = computed(() => ({
  title: props.data.title || 'PRODUCTS'
}))

const rawProductList = computed(() => {
  if (props.data.products && props.data.products.length > 0) {
    return props.data.products
  }
  return Array.from({ length: 16 }).map((_, i) => ({
    id: i,
    title: 'Demo Product ' + (i + 1),
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
    url: '#'
  }))
})

const windowWidth = ref(window.innerWidth)

const updateWidth = () => {
  windowWidth.value = window.innerWidth
}

// 判断是否是手机/平板 (<= 990px)
const isMobile = computed(() => windowWidth.value <= 990)

// 视口显示的列数：电脑4列，手机2列
const visibleColumns = computed(() => isMobile.value ? 2 : 4)

// === Slider Logic ===
const currentIndex = ref(0)
const totalColumns = computed(() => Math.ceil(rawProductList.value.length / 2))
const maxIndex = computed(() => Math.max(0, totalColumns.value - visibleColumns.value))

watch(maxIndex, (newMax) => {
  if (currentIndex.value > newMax) {
    currentIndex.value = newMax
  }
})

const trackStyle = computed(() => ({
  '--current-index': currentIndex.value
}))

// 新增：按钮点击事件
const handlePrev = () => {
  if (currentIndex.value > 0) currentIndex.value--
}
const handleNext = () => {
  if (currentIndex.value < maxIndex.value) currentIndex.value++
}

// === ⭐ 进场动画 Logic ===
const sectionRef = ref(null)
let observer = null

onMounted(() => {
  window.addEventListener('resize', updateWidth) // 监听屏幕旋转/缩放
  // 创建观察者：当元素进入屏幕 15% 时触发
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 给最外层加一个类名，触发 CSS 动画
        entry.target.classList.add('is-visible')
        // 动画只播一次，所以取消观察
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.15 })

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
})

onUnmounted(() => {
    window.removeEventListener('resize', updateWidth) // 取消监听
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.featured-products-section {
  padding: 0px 100px 50px;
  background-color: #ffffff;
  max-width: 1400px;
  margin: 0 auto;
  /* 初始状态：虽然不可见，但不隐藏布局，防止闪烁 */
}

/* === 标题样式 === */
.section-header { text-align: center; margin-bottom: 30px; }
.section-title { font-size: 32px; font-weight: 400; color: #333; margin: 0 0 10px; text-transform: uppercase; }
.section-decoration { display: flex; align-items: center; justify-content: center; gap: 8px; color: #ddd; }
.heart-icon { font-size: 14px; color: #d4af37; }

/* === Slider === */
.slider-container { position: relative; width: 100%; }
.slider-viewport { width: 100%; overflow-x: hidden; padding-bottom: 40px; padding-top: 10px; padding-right: 10px;}

.slider-track {
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-auto-flow: column;
  gap: 0;
  
  /* ⭐ 定义默认列宽 (电脑端) */
  --col-width: 25%;
  grid-auto-columns: var(--col-width);
  
  /* ⭐ 核心魔法：用 CSS calc 计算移动距离 */
  /* 公式：当前索引 * -1 * 列宽 */
  transform: translateX(calc(var(--current-index) * -1 * var(--col-width)));
  
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform;
}

/* === ⭐ 卡片样式 & 进场动画 === */
.product-card {
  position: relative;
  transition: transform 0.3s ease;
  width: 100%;

  padding: 0 15px 15px;

  box-sizing: border-box;
  
  /* 动画初始状态：透明 + 向右偏移 */
  opacity: 0;
  transform: translateX(50px);
}

/* 只有当 section 加了 .is-visible 类名后，才开始播放动画 */
.featured-products-section.is-visible .product-card {
  /* 这里的 animation-delay 用到了上面绑定的 var(--delay) */
  animation: slideFadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: var(--delay);
}

/* 卡片悬浮效果 (注意要保留 hover transform，不要被 animation 覆盖) */
/* 为了解决 animation fill-mode forwards 可能会锁死 transform 的问题，
   我们通常让 animation 结束后 opacity 变 1，然后把 transform 交还给 hover */
@keyframes slideFadeIn {
  from { opacity: 0; transform: translateX(50px); }
  to { opacity: 1; transform: translateX(0); }
}

.img-wrapper {
  width: 100%; aspect-ratio: 1 / 1; border: 1px solid #eee; padding: 20px; overflow: hidden; position: relative;
  box-sizing: border-box; display: flex; align-items: center; justify-content: center; background: #fff; transition: all 0.3s;
}
/* ⭐ 新增：定义中心微光 */
.img-wrapper::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 严格居中 */
  width: 100%;
  height: 100%;
  
  /* 核心：径向渐变 */
  /* 中间是淡淡的白色(0.2透明度)，向外扩散为透明。你可以调大 0.2 让它更亮 */
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%);
  
  opacity: 0; /* 默认隐藏 */
  transition: opacity 0.4s ease; /* 柔和过渡 */
  pointer-events: none; /* 让鼠标能穿透光效点到图片 */
}
.img-wrapper img { max-width: 100%; max-height: 100%; object-fit: contain; }
.product-card:hover .img-wrapper { border-color: #d4af37; }
.product-card:hover .img-wrapper::after {
  opacity: 1;
}
.info-wrapper { margin-top: 15px; text-align: center; }
.product-title { font-size: 14px; color: #666; margin: 0; }
.product-link { text-decoration: none; display: block; color: inherit; }

/* === ⭐ 新版导航栏样式 === */
.custom-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -10px;
  gap: 20px; /* 线条和按钮的距离 */
}

/* 装饰线条 */
.nav-line {
  flex: 0 0 100px; /* 线条长度，可调 */
  height: 1px;
  background: linear-gradient(90deg, transparent, #e0e0e0, transparent); /* 渐变线条更高级 */
}

.nav-buttons {
  display: flex;
  gap: 15px; /* 两个按钮的间距 */
}

.nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #eee;
  background: #fff;
  color: #999;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.3s ease;
  outline: none;
}

.nav-btn .el-icon { font-size: 16px; }

/* 悬浮状态 */
.nav-btn:not(.disabled):hover {
  border-color: #d4af37;
  color: #d4af37;
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

/* 禁用状态 (滑到头了) */
.nav-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background-color: #f9f9f9;
}

/* === 响应式 === */
@media (max-width: 990px) {
  .slider-track { --col-width: 50%; }
  .featured-products-section {
    padding: 0px 20px 50px;
  }
  .section-title { font-size: 24px; }
}
</style>