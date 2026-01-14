<template>
  <div class="contact-info-section page-width">
    <div class="info-grid">
      <div 
        v-for="(block, index) in blocks" 
        :key="index" 
        class="info-item"
      >
        <div class="icon-circle">
          <img :src="block.icon" :alt="block.title" v-if="block.icon" />
          <span v-else>📍</span>
        </div>

        <h3 class="info-title">{{ block.title }}</h3>

        <div class="info-text" v-html="block.content"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  // 接收从 Liquid 传来的数组
  blocks: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.contact-info-section {
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.info-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
}

.info-item {
  flex: 1;
  min-width: 220px; /* 手机端自动换行 */
  max-width: 300px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 圆形灰色背景 */
.icon-circle {
  width: 80px;
  height: 80px;
  background-color: #f5f5f5; /* 浅灰背景 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.icon-circle:hover {
  transform: translateY(-5px); /* 鼠标悬停微微上浮 */
}

.icon-circle img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.info-title {
  font-size: 20px;
  color: #555;
  margin-bottom: 15px;
  font-weight: 600;
}

.info-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

/* 强制让里面的邮箱/电话链接变色 */
:deep(.info-text a) {
  color: #333;
  text-decoration: none;
  transition: color 0.2s;
}
:deep(.info-text a:hover) {
  color: #d99c39; /* 悬停变橙色 */
}
</style>