<template>
  <section class="home-logos-section">
    <div class="container">
      
      <h3 v-if="settings.title" class="section-title">{{ settings.title }}</h3>

      <div class="logos-wrapper">
        <div class="logos-grid" :style="gridStyle">
          <div 
            v-for="(block, index) in blocks" 
            :key="block.id" 
            class="logo-item"
          >
            <component 
              :is="block.link ? 'a' : 'div'" 
              :href="block.link" 
              class="logo-link"
              target="_blank"
            >
              <img 
                v-if="block.image" 
                :src="block.image" 
                :alt="'Partner logo ' + index" 
                loading="lazy" 
              />
            </component>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Object, default: () => ({}) }
})

const settings = computed(() => ({
  title: props.data.title || ''
}))

const blocks = computed(() => props.data.blocks || [])

// ⭐ 核心逻辑：把 Liquid 传来的数值转为 CSS 变量
const gridStyle = computed(() => ({
  '--logo-w-pc': (props.data.logo_width_pc || 150) + 'px',
  '--logo-w-mb': (props.data.logo_width_mb || 100) + 'px'
}))
</script>

<style scoped>
.home-logos-section {
  padding: 0 0 100px;
  background-color: #ffffff;
  border-top: 1px solid #eee;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.section-title {
  font-size: 32px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 50px;
  font-weight: 600;
}

.logos-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  
  /* Logo 之间的间距 */
  gap: 40px 60px; 
}

.logo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* ⭐ 核心修改：使用 CSS 变量控制宽度 */
  /* 使用 flex-basis 让容器占据固定空间 */
  flex: 0 0 var(--logo-w-pc); 
  width: var(--logo-w-pc);
  
  /* 高度不限制，按比例缩放，但限制最大高度防止太离谱 */
  height: auto; 
  max-height: 80px; 
}

.logo-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-decoration: none;
}

.logo-item img {
  /* 确保图片不超出设定的宽度 */
  width: 100%; 
  height: 100%;
  object-fit: contain; /* 保持图片比例 */
  
  filter: grayscale(100%);
  opacity: 0.5;
  transition: all 0.4s ease;
  /* cursor: pointer; */
}

.logo-item:hover img {
  filter: grayscale(0%);
  opacity: 1;
  transform: scale(1.05);
}

/* === 响应式 === */
@media (max-width: 768px) {
  .logos-grid {
    gap: 20px 30px; /* 手机端间距小一点 */
  }

  .logo-item {
    /* ⭐ 核心修改：手机端切换变量 */
    flex: 0 0 var(--logo-w-mb);
    width: var(--logo-w-mb);
    
    max-height: 60px; /* 手机端高度限制也小一点 */
  }
  
  .section-title {
    font-size: 24px;
  }

  .home-logos-section {
    padding: 0 0 50px;
  }
}
</style>