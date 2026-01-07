<template>
  <div class="product-sidebar">
    <div class="sidebar-block">
      <div class="sidebar-header">PRODUCTS</div>
      <ul class="category-list">
        <li v-for="(item, index) in categories" :key="index" class="category-item">
          {{ item }}
          <span class="plus-icon">+</span>
        </li>
      </ul>
    </div>

    <div class="sidebar-block">
      <div class="sidebar-header">RECOMMENDED</div>
      <div class="recommend-list">
        <div v-for="i in 3" :key="i" class="recommend-item">
          <div class="rec-img"></div>
          <div class="rec-info">
            <div class="rec-title">THE CORE ELECTRIC FORKLIFT</div>
            <div class="rec-desc">Fixed calipers by Wilwood offer...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const categories = ref([
  'SCISSOR LIFT', 'AIR BLOWER', 'EARTHMOV', 'EXCAVATOR', 'Cable reel', 'Tripod'
]);
</script>

<style scoped>
.product-sidebar {
  width: 100%;
}

.sidebar-block {
  margin-bottom: 30px;
  background: #f9f9f9; /* 浅灰底色 */
}

/* 金色标题栏 */
.sidebar-header {
  background-color: #dcb765; /* 吸取的金色 */
  color: #fff;
  padding: 15px 20px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 16px;
}

/* 分类列表样式 */
.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  transition: background 0.2s;
}

.category-item:hover {
  background: #fff;
  color: #dcb765;
}

/* 推荐产品样式 */
.recommend-list {
  padding: 0;
}

.recommend-item {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  gap: 15px;
}

.rec-img {
  width: 60px;
  height: 60px;
  background: #ddd; /* 占位灰色 */
  flex-shrink: 0;
}

.rec-title {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 5px;
  line-height: 1.4;
}

.rec-desc {
  font-size: 12px;
  color: #777;
  line-height: 1.2;
}
</style>