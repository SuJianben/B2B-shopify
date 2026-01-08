<template>
  <section class="home-news-section" ref="sectionRef">
    
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
            v-for="(article, index) in articleList" 
            :key="article.id" 
            class="news-card"
            :style="{ '--delay': index * 0.1 + 's' }" 
          >
            <a :href="article.url" class="news-link">
              
              <div class="img-wrapper">
                <img v-if="article.image" :src="article.image" :alt="article.title" loading="lazy" />
                <div v-else class="placeholder-img">No Image</div>
                
                <div class="hover-overlay">
                  <div class="arrow-circle">
                    <el-icon><Right /></el-icon>
                  </div>
                </div>
              </div>

              <div class="info-wrapper">
                <h3 class="news-title">{{ article.title }}</h3>
                <p class="news-excerpt">{{ article.excerpt }}</p>
                <span class="read-more">Read More <el-icon><ArrowRight /></el-icon></span>
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
import { ArrowLeft, ArrowRight, Right } from '@element-plus/icons-vue'

const props = defineProps({
  data: { type: Object, default: () => ({}) }
})

const settings = computed(() => ({
  title: props.data.title || 'NEWS'
}))

// 处理文章数据
const articleList = computed(() => {
  if (props.data.articles && props.data.articles.length > 0) {
    return props.data.articles
  }
  // 模拟数据
  return Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    title: 'Blog Post With Custom Quote ' + (i + 1),
    excerpt: 'Making a decision to do something – this is the first step. We strive to help you...',
    image: 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png',
    url: '#'
  }))
})

// === 响应式 & 滑动逻辑 (与推荐产品完全一致) ===
const windowWidth = ref(window.innerWidth)
const updateWidth = () => windowWidth.value = window.innerWidth
const isMobile = computed(() => windowWidth.value <= 768)

// 电脑 3 列，手机 1 列
const visibleColumns = computed(() => isMobile.value ? 1 : 3)

const currentIndex = ref(0)
const maxIndex = computed(() => Math.max(0, articleList.value.length - visibleColumns.value))

watch(maxIndex, (newMax) => {
  if (currentIndex.value > newMax) currentIndex.value = newMax
})

const trackStyle = computed(() => ({
  '--current-index': currentIndex.value,
  '--visible-cols': visibleColumns.value 
}))

const handlePrev = () => { if (currentIndex.value > 0) currentIndex.value-- }
const handleNext = () => { if (currentIndex.value < maxIndex.value) currentIndex.value++ }

// === 进场动画 ===
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
/* 复用容器样式 */
.home-news-section {
  padding: 0px 100px 50px;
  background-color: #ffffff;
  max-width: 1400px;
  margin: 0 auto;
}

/* 标题样式 */
.section-header { text-align: center; margin-bottom: 40px; }
.section-title { font-size: 32px; font-weight: 400; color: #333; margin: 0 0 10px; text-transform: uppercase; }
.section-decoration { display: flex; align-items: center; justify-content: center; gap: 8px; color: #ddd; }
.heart-icon { font-size: 16px; color: #d4af37; font-weight: bold; }

/* Slider */
.slider-container { position: relative; width: 100%; }
.slider-viewport { width: 100%; overflow-x: hidden; padding-bottom: 20px; padding-top: 10px; }
.slider-track {
  display: grid;
  grid-template-rows: 1fr;
  grid-auto-flow: column;
  gap: 0;
  --col-width: calc(100% / var(--visible-cols));
  grid-auto-columns: var(--col-width);
  transform: translateX(calc(var(--current-index) * -1 * var(--col-width)));
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform;
}

/* 卡片 */
.news-card {
  position: relative;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  opacity: 0;
  transform: translateX(50px);
}
.home-news-section.is-visible .news-card {
  animation: slideFadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: var(--delay);
}
@keyframes slideFadeIn {
  from { opacity: 0; transform: translateX(50px); }
  to { opacity: 1; transform: translateX(0); }
}

/* 图片区域 */
.img-wrapper {
  width: 100%; aspect-ratio: 4 / 3; /* 博客图片通常不需要正方形，4:3更自然 */
  position: relative; overflow: hidden;
  background: #f5f5f5;
}
.img-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }

/* ⭐ News 专属 Hover 遮罩样式 */
.hover-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.3); /* 灰色半透明遮罩 */
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0; /* 默认隐藏 */
  transition: opacity 0.3s ease;
  pointer-events: none; /* 让鼠标穿透 */
}

/* 中间的圆圈箭头 */
.arrow-circle {
  width: 50px; height: 50px;
  border-radius: 50%;
  border: 2px solid #fff; /* 白色边框 */
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
  transform: scale(0.8); /* 默认缩小一点 */
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Hover 触发 */
.news-card:hover .hover-overlay { opacity: 1; }
.news-card:hover .arrow-circle { transform: scale(1); } /* 弹跳放大效果 */
.news-card:hover img { transform: scale(1.05); }

/* 文字区域 */
.info-wrapper { margin-top: 20px; text-align: left; /* 博客通常左对齐 */ }
.news-title { 
  font-size: 16px; color: #333; margin: 0 0 10px; line-height: 1.4; 
  font-weight: 500;
  overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
}
.news-excerpt { 
  font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 15px;
  overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
}
.read-more {
  font-size: 13px; color: #333; font-weight: 600; 
  display: flex; align-items: center; gap: 5px;
  text-transform: uppercase;
  transition: color 0.3s;
}
.news-link { text-decoration: none; display: block; }
.news-link:hover .read-more { color: #d4af37; }

/* 底部导航 (复用) */
.custom-navigation {
  display: flex; align-items: center; justify-content: center; margin-top: 30px; gap: 20px;
}
.nav-line { flex: 0 0 100px; height: 1px; background: linear-gradient(90deg, transparent, #e0e0e0, transparent); }
.nav-buttons { display: flex; gap: 15px; }
.nav-btn {
  width: 40px; height: 40px; border-radius: 50%; border: 1px solid #eee; background: #fff; color: #999;
  cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;
}
.nav-btn:not(.disabled):hover { border-color: #d4af37; color: #d4af37; transform: scale(1.05); }
.nav-btn.disabled { opacity: 0.4; cursor: not-allowed; background-color: #f9f9f9; }

/* 响应式 */
@media (max-width: 990px) {
  .home-news-section { padding: 0px 20px 50px ; }
  .nav-line { flex-basis: 50px; }
  .section-title { font-size: 24px; }
}
</style>