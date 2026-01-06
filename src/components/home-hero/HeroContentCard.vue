<template>
  <div class="hero-content-card" ref="cardRef">
    
    <div class="card-header">
      <div class="text-group">
        <h2 class="title">{{ data.title }}</h2>
        <p class="subtitle">{{ data.subtitle }}</p>
      </div>
      <div class="action-group">
        <a href="#" class="explore-btn">{{ data.btnText }}</a>
      </div>
    </div>

    <div class="card-grid">

      <div 
        class="grid-item"
        v-for="(item, index) in gridItems"
        :key="index"
      >
        <div class="img-box">
          <img :src="item.image" :alt="item.title">
        </div>
        <div class="overlay-text">
          <h3>{{ item.title }}</h3>
          <h2>{{ item.subtitle }}</h2>
        </div>
      </div>

      <!-- <div class="grid-item">
        <div class="img-box">
          <img src="https://images.unsplash.com/photo-1531297461136-82lw9z1p1j8d?q=80&w=800&auto=format&fit=crop" alt="Decor">
        </div>
        <div class="center-content">
          <h3>Skull</h3>
          <h2>Decorative</h2>
          <a href="#" class="shop-now-btn">Shop Now</a>
        </div>
      </div>

      <div class="grid-item">
        <div class="img-box">
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop" alt="Drone">
        </div>
      </div> -->

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  data: { type: Object, default: () => ({}) }
})

const gridItems = computed(() => {
  return props.data.items || []
})

const cardRef = ref(null)
let observer = null

onMounted(() => {
  // 1. 创建观察者
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // 如果元素进入了屏幕 (isIntersecting 为 true)
      if (entry.isIntersecting) {
        // 给它加上 'is-visible' 类名，触发 CSS 动画
        entry.target.classList.add('is-visible')
        // 动画只播放一次，所以不再观察这个元素了
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.2 // 阈值：元素露出 20% 时触发，避免刚露个头就播放完了
  })

  // 2. 找到所有的 grid-item 并开始观察
  if (cardRef.value) {
    const items = cardRef.value.querySelectorAll('.grid-item')
    items.forEach(el => observer.observe(el))
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
/* === 保持之前的容器样式 === */
.hero-content-card {
  background-color: #ffffff;
  margin-top: -80px;
  position: relative;
  z-index: 10;
  padding: 40px 50px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
}

.card-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px; padding-bottom: 30px;
  border-bottom: 1px solid #eee;
}
.text-group { flex: 1; padding-right: 40px; }
.title { font-size: 20px; font-weight: 700; color: #333; margin-bottom: 10px; text-transform: uppercase; }
.subtitle { font-size: 14px; color: #666; line-height: 1.6; }

.explore-btn {
  display: inline-block; padding: 12px 35px; border: 1px solid #d4af37;
  color: #d4af37; text-decoration: none; font-size: 13px; font-weight: 600;
  border-radius: 30px; transition: 0.3s; text-transform: uppercase;
}
.explore-btn:hover { background-color: #d4af37; color: #fff; }

.card-grid {
  display: grid;
  grid-template-columns: 1fr 1.6fr 1fr;
  gap: 30px;
}

/* === ⭐ 核心修改区域 === */

.grid-item {
  position: relative;
  height: 350px;
  overflow: hidden;
  background-color: #f0f0f0;
  
  /* 初始状态：完全透明，且没有动画 */
  opacity: 0; 
  /* 这里不写 animation，移到下面去 */
}

/* ⭐ 当 JS 加上这个类名时，才开始执行动画 */
.grid-item.is-visible {
  animation: slideInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* 阶梯延迟：保持不变，等类名加上后会自动生效 */
.grid-item:nth-child(1) { animation-delay: 0.1s; }
.grid-item:nth-child(2) { animation-delay: 0.3s; }
.grid-item:nth-child(3) { animation-delay: 0.5s; }

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
}

/* === 其他样式保持不变 === */
.img-box { width: 100%; height: 100%; }
.img-box img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
.grid-item:hover .img-box img { transform: scale(1.05); }

.overlay-text { position: absolute; bottom: 40px; left: 30px; pointer-events: none; }
.overlay-text h3 { font-family: serif; font-style: italic; font-size: 24px; margin: 0; color: #333; }
.overlay-text h2 { font-size: 28px; font-weight: 700; text-transform: uppercase; margin: 5px 0 0 0; color: #111; }

.center-content { position: absolute; bottom: 40px; left: 30px; }
.center-content h3 { font-family: serif; font-size: 24px; margin: 0; color: #333; }
.center-content h2 { font-size: 28px; margin: 5px 0 20px 0; color: #111; }
.shop-now-btn {
  display: inline-block; background: #333; color: #fff; padding: 10px 25px;
  text-decoration: none; font-size: 12px; text-transform: uppercase; transition: 0.3s;
}
.shop-now-btn:hover { background: #d4af37; }

@media (max-width: 990px) {
  .hero-content-card { padding: 30px; }
  .grid-item { height: 300px; }
}
@media (max-width: 768px) {
  .hero-content-card { margin-top: 0; padding: 20px; }
  .card-header { flex-direction: column; text-align: center; }
  .text-group { padding-right: 0; margin-bottom: 20px; }
  .card-grid { grid-template-columns: 1fr; gap: 20px; }
}
</style>