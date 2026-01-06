<template>
  <div class="feature-bar-wrapper" ref="featureRef">

    <div v-for="(item, index) in features" :key="index" class="feature-item">
      <div class="icon-box">
        <el-icon v-if="index === 0"><DocumentChecked /></el-icon>
        <el-icon v-else-if="index === 1"><Medal /></el-icon>
        <el-icon v-else-if="index === 2"><TrendCharts /></el-icon>
      </div>
      <div class="text-box">
        <p>{{ item.text }}</p>
      </div>
    </div>

    <!-- <div class="feature-item">
      <div class="icon-box">
        <el-icon><Medal /></el-icon>
      </div>
      <div class="text-box">
        <p>We ensure that provide the best quality product and service to all our cooperator.</p>
      </div>
    </div>

    <div class="feature-item">
      <div class="icon-box">
        <el-icon><TrendCharts /></el-icon>
      </div>
      <div class="text-box">
        <p>With mass producting the which make the delivery date greatly short.</p>
      </div>
    </div> -->

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { DocumentChecked, Medal, TrendCharts } from '@element-plus/icons-vue'

const props = defineProps({
  items: { type: Array, default: () => [] }
})

const features = computed(() => {
  return props.items.length ? props.items : [
    { text: 'Default Feature 1' },
    { text: 'Default Feature 2' },
    { text: 'Default Feature 3' }
  ]
})

const featureRef = ref(null)
let observer = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.2 })

  if (featureRef.value) {
    const items = featureRef.value.querySelectorAll('.feature-item')
    items.forEach(el => observer.observe(el))
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.feature-bar-wrapper {
  background-color: #f9f9f9; /* 浅灰背景 */
  
  /* 增加内边距，让整体看起来更宽敞 */
  padding: 140px 140px 50px;       
  
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
  gap: 50px; /* 拉大间距 */
  align-items: center;
}

.feature-item {
  display: flex;
  align-items: center; 
  gap: 25px; /* 图标和文字的间距 */
  cursor: default; 
  
  /* 初始隐藏，等待滚动触发 */
  opacity: 0; 
}

.feature-item.is-visible {
  animation: fadeInUp 0.8s ease-out forwards;
}

/* 阶梯延迟 */
.feature-item:nth-child(1) { animation-delay: 0.1s; }
.feature-item:nth-child(2) { animation-delay: 0.3s; }
.feature-item:nth-child(3) { animation-delay: 0.5s; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

/* === 图标区域 === */
.icon-box {
  flex-shrink: 0;
  /* 稍微加大容器 */
  width: 70px; 
  height: 70px;
  display: flex; align-items: center; justify-content: center;
}

.icon-box .el-icon { 
  /* ⭐ 核心修改：加大图标 */
  font-size: 56px; 
  color: #222; /* 深黑色，更有质感 */
  transition: transform 0.3s ease; 
  transform-origin: center center; 
}

/* 文字样式优化 */
.text-box p {
  margin: 0; 
  font-size: 15px; /* 字号微调 */
  line-height: 1.6; 
  color: #555;     /* 深灰色文字 */
  font-weight: 500;
}

/* 摇晃动画 Keyframes */
@keyframes ring-shake {
  0% { transform: rotate(0); }
  15% { transform: rotate(15deg); }
  30% { transform: rotate(-15deg); }
  45% { transform: rotate(10deg); }
  60% { transform: rotate(-10deg); }
  75% { transform: rotate(5deg); }
  90% { transform: rotate(-5deg); }
  100% { transform: rotate(0); }
}

.feature-item:hover .icon-box .el-icon {
  animation: ring-shake 0.6s ease-in-out;
}

/* === 响应式 === */
@media (max-width: 990px) {
  .feature-bar-wrapper { padding: 40px 30px; gap: 30px; }
  .icon-box .el-icon { font-size: 40px; } /* 平板上稍微小点 */
  .text-box p { font-size: 13px; }
}

@media (max-width: 768px) {
  .feature-bar-wrapper {
    grid-template-columns: 1fr; 
    gap: 40px; 
    padding: 30px 20px;
  }
  /* .feature-item { 
    padding-bottom: 30px; 
    border-bottom: 1px solid #eee; 
  } */
  .feature-item:last-child { border-bottom: none; padding-bottom: 0; }
}
</style>