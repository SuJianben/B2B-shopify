<template>
    <div class="vue-home-about-root">
        <section 
          class="home-about-section" 
          :class="{ 'is-fixed': settings.enable_parallax }" 
          :style="{ backgroundImage: `url(${bgImage})` }"
        >
          <div class="overlay"></div>
      
          <div class="content-container">
            <h2 class="section-title">{{ settings.title }}</h2>
            
            <p class="section-desc">
              {{ settings.description }}
            </p>
      
            <a :href="settings.btn_link || '#'" class="about-btn">
              <span class="btn-text">{{ settings.btn_label }}</span>
              
              <span class="icon-wrapper">
                 <el-icon><Right /></el-icon>
              </span>
            </a>
          </div>
        </section>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Right } from '@element-plus/icons-vue'

const props = defineProps({
  settings: {
    type: Object,
    default: () => ({ enable_parallax: true })
  }
})

const bgImage = computed(() => {
  return props.settings.bg_image || 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png'
})
</script>

<style scoped>
.vue-home-about-root{
  padding: 0 20px;
}
.home-about-section {
  position: relative;
  width: 100%;
  padding: 120px 0px;
  background-attachment: scroll; /* 默认 scroll */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #333;
  background-color: #f5f5f5;
}

/* ⭐ 视差开关生效时的样式 */
.home-about-section.is-fixed {
  background-attachment: fixed;
}

.overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(255, 255, 255, 0.85);
  z-index: 1;
}

.content-container {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  font-size: 36px;
  font-weight: 400;
  margin-bottom: 30px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.section-desc {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  margin-bottom: 40px;
}

/* === ⭐ 按钮高级动画 (Reveal Effect) === */
.about-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 8px 20px; /* 初始左右内边距 */
  
  border: 2px solid #d4af37;
  color: #d4af37;
  border-radius: 30px;
  
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: none;
  
  /* 所有的属性变化都用 0.35s 贝塞尔曲线过渡 */
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: transparent;
  overflow: hidden;
}

/* 文字部分 */
.btn-text {
  transition: transform 0.35s ease;
}

/* 图标包裹层：静止时把宽度压扁为0，完全隐藏 */
.icon-wrapper {
  max-width: 0;
  opacity: 0;
  transform: translateX(10px); /* 静止时让它在右边一点待命 */
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.icon-wrapper .el-icon {
  /* 1. 定义圆的大小 */
  width: 24px;
  height: 24px;
  
  /* 2. 白色背景 + 圆角 */
  background-color: #ffffff;
  border-radius: 50%;
  
  /* 3. 箭头颜色 (金色，跟外面的背景形成对比) */
  color: #d4af37;
  
  /* 4. 让箭头在圆里居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px; /* 箭头本身的大小 */
  
  margin-left: 12px; /* 圆圈离文字的距离 */
  flex-shrink: 0; /* 防止被挤扁 */
}

/* === Hover 状态 === */
.about-btn:hover {
  background-color: #d4af37;
  color: #fff;
  padding-right: 32px; /* 稍微调整右边距，视觉平衡 */
  padding-left: 32px;
}

/* Hover时：文字稍微向左让步 */
.about-btn:hover .btn-text {
  transform: translateX(-4px); 
}

/* Hover时：图标“展开”并出现 */
.about-btn:hover .icon-wrapper {
  max-width: 30px; /* 给出足够的宽度显示图标 */
  opacity: 1;
  transform: translateX(0); /* 回到原位 */
}

/* === 响应式 === */
@media (max-width: 768px) {
  .home-about-section.is-fixed {
    background-attachment: scroll; 
  }
  .section-title { font-size: 28px; }
  .vue-home-about-root{
    padding: 0px;
  }
  .section-desc{
    padding: 0 10px;
  }
}
</style>