<template>
  <div class="related-products-section" v-if="products && products.length > 0">
    <div class="section-header">
      <h2 class="section-title">{{ title }}</h2>
      
      <div class="nav-buttons">
        <button class="circle-btn prev" @click="scroll('left')">
          <svg viewBox="0 0 1024 1024" width="16" height="16"><path d="M603.3 228.3l-256 256c-12.5 12.5-12.5 32.8 0 45.3l256 256c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L415.1 506.9l233.5-233.5c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z" fill="currentColor"></path></svg>
        </button>
        <button class="circle-btn next" @click="scroll('right')">
          <svg viewBox="0 0 1024 1024" width="16" height="16"><path d="M420.7 228.3c-12.5 12.5-12.5 32.8 0 45.3L654.2 507 420.7 740.5c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l256-256c12.5-12.5 12.5-32.8 0-45.3l-256-256c-12.5-12.5-32.8-12.5-45.3 0z" fill="currentColor"></path></svg>
        </button>
      </div>
    </div>

    <div class="slider-track" ref="trackRef">
      <div v-for="(item, index) in products" :key="index" class="product-card">
        <a :href="item.url" class="card-link">
          <div class="img-wrapper">
            <img :src="item.image || placeholderImg" alt="Product" loading="lazy" />
          </div>
          <div class="card-info">
            <h3 class="card-title">{{ item.title }}</h3>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: { type: String, default: 'Products categories' },
  products: { type: Array, default: () => [] }
});

const trackRef = ref(null);
const placeholderImg = 'https://via.placeholder.com/400x400?text=No+Image';

const scroll = (direction) => {
  if (!trackRef.value) return;
  const scrollAmount = 320; 
  const currentScroll = trackRef.value.scrollLeft;
  trackRef.value.scrollTo({
    left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
    behavior: 'smooth'
  });
};
</script>

<style scoped>
.related-products-section {
  margin-top: 60px;
  margin-bottom: 50px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #333;
}
.nav-buttons {
  display: flex;
  gap: 10px;
}
.circle-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
}
.circle-btn:hover {
  background: #333;
  color: #fff;
  border-color: #333;
}
.slider-track {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 5px;
  scrollbar-width: none;
}
.slider-track::-webkit-scrollbar { display: none; }

/* 卡片样式 */
.product-card {
  flex-shrink: 0;
  width: 300px; /* 固定卡片宽度 */
}
.card-link {
  text-decoration: none;
  display: block;
}
.img-wrapper {
  width: 100%;
  height: 300px;
  border: 1px solid #eee; /* 边框 */
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  transition: transform 0.3s;
}
.img-wrapper img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.card-link:hover .img-wrapper {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.08);
}
.card-info {
  margin-top: 15px;
  text-align: center;
}
.card-title {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}
</style>