<template>
  <div class="product-main-container">
    <el-row :gutter="50">
      
      <el-col :xs="24" :md="11">
        <div class="gallery-wrapper">
          <div 
            class="main-image-box" 
            ref="zoomContainer"
            @mousemove="handleMouseMove"
            @mouseenter="showZoom = true"
            @mouseleave="showZoom = false"
          >
            <img :src="currentImage" class="origin-img" alt="Product Main" />
            <div 
              class="zoom-layer"
              v-show="showZoom"
              :style="{
                backgroundImage: `url(${currentImage})`,
                backgroundPosition: zoomPosition
              }"
            ></div>
          </div>

          <div class="thumbs-slider" v-if="imageList.length > 1">
            <button class="nav-btn prev" @click="scrollThumbs('left')"><el-icon><ArrowLeft /></el-icon></button>
            <div class="thumbs-track" ref="trackRef">
              <div 
                v-for="(img, index) in imageList" 
                :key="index"
                class="thumb-item"
                :class="{ 'active': currentImage === img }"
                @click="selectImage(img, index)"
              >
                <el-image :src="img" fit="cover" class="thumb-img" loading="lazy" />
              </div>
            </div>
            <button class="nav-btn next" @click="scrollThumbs('right')"><el-icon><ArrowRight /></el-icon></button>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :md="13">
        <div class="info-wrapper">
          <h1 class="product-title">{{ product.title }}</h1>
          <div class="divider"></div>

          <div class="description-content">
            <div class="desc-label">Short Description:</div>
            <div class="rich-text" v-html="product.description"></div>
          </div>

          <div class="action-buttons">
            <el-button type="primary" color="#00a0e9" class="action-btn" @click="scrollToForm">
              SEND EMAIL TO US
            </el-button>
            <el-button type="primary" color="#00a0e9" plain class="action-btn">
              DOWNLOAD AS PDF
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="product-tabs-section">
      <div class="tabs-header">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'detail' }"
          @click="activeTab = 'detail'"
        >
          PRODUCT DETAIL
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'tags' }"
          @click="activeTab = 'tags'"
        >
          PRODUCT TAGS
        </button>
      </div>

      <div class="tab-content">
        <div v-show="activeTab === 'detail'" class="rich-text detail-area">
          <div v-if="productDetailContent" v-html="productDetailContent"></div>
          <div v-else class="empty-tip">No details available.</div>
        </div>

        <div v-show="activeTab === 'tags'" class="rich-text tags-area">
          <div v-if="productTagsContent" v-html="productTagsContent"></div>
          <div v-else class="empty-tip"></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';

const props = defineProps({
  product: {
    type: Object,
    default: () => ({})
  }
});

// --- [新增] Tab 逻辑 ---
const activeTab = ref('detail'); // 默认显示 Detail

// 获取元字段内容 (从 props.product.metafields 中读取)
// 注意：这需要 Liquid 层正确传递了 "product_detail" 和 "product_tags"
const productDetailContent = computed(() => {
  return props.product.metafields?.product_detail || '';
});

const productTagsContent = computed(() => {
  return props.product.metafields?.product_tags || '';
});


// --- [原有] 滚动到表单逻辑 ---
const scrollToForm = () => {
  const formElement = document.getElementById('contact_form');
  if (formElement) {
    formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    console.warn('Form element #contact_form not found');
  }
};

// --- [原有] 相册与放大镜逻辑 ---
const currentImage = ref('');
const trackRef = ref(null);
const zoomContainer = ref(null);
const showZoom = ref(false);
const zoomPosition = ref('0% 0%');

const handleMouseMove = (e) => {
  if (!zoomContainer.value) return;
  const { left, top, width, height } = zoomContainer.value.getBoundingClientRect();
  const x = e.clientX - left;
  const y = e.clientY - top;
  let xPercent = (x / width) * 100;
  let yPercent = (y / height) * 100;
  if (xPercent < 0) xPercent = 0;
  if (xPercent > 100) xPercent = 100;
  if (yPercent < 0) yPercent = 0;
  if (yPercent > 100) yPercent = 100;
  zoomPosition.value = `${xPercent}% ${yPercent}%`;
};

const imageList = computed(() => {
  if (props.product.media && props.product.media.length > 0) {
    return props.product.media.map(m => m.src);
  }
  return ['https://via.placeholder.com/600x600?text=No+Image'];
});

onMounted(() => {
  if (imageList.value.length > 0) {
    currentImage.value = imageList.value[0];
  }
});

const selectImage = (img, index) => {
  currentImage.value = img;
};

const scrollThumbs = (direction) => {
  if (!trackRef.value) return;
  const scrollAmount = 100;
  const currentScroll = trackRef.value.scrollLeft;
  trackRef.value.scrollTo({
    left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
    behavior: 'smooth'
  });
};
</script>

<style scoped>
/* === [原有] 相册样式 === */
.main-image-box {
  width: 100%; height: 450px; border: 1px solid #f0f0f0; background: #fff;
  margin-bottom: 15px; position: relative; overflow: hidden; cursor: crosshair;
  display: flex; align-items: center; justify-content: center;
}
.origin-img { width: 100%; height: 100%; object-fit: contain; display: block; }
.zoom-layer {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-size: 200%; background-repeat: no-repeat; z-index: 10; background-color: #fff;
}
.thumbs-slider { display: flex; align-items: center; gap: 10px; height: 80px; }
.thumbs-track {
  flex: 1; display: flex; gap: 10px; overflow-x: auto; scroll-behavior: smooth;
  scrollbar-width: none; padding: 2px;
}
.thumbs-track::-webkit-scrollbar { display: none; }
.thumb-item {
  flex-shrink: 0; width: 70px; height: 70px; border: 1px solid #ddd; cursor: pointer;
  border-radius: 4px; overflow: hidden; transition: all 0.2s;
}
.thumb-item.active { border: 2px solid #00a0e9; opacity: 1; }
.thumb-img { width: 100%; height: 100%; display: block; }
.nav-btn {
  background: #fff; border: 1px solid #eee; width: 30px; height: 70px;
  cursor: pointer; display: flex; align-items: center; justify-content: center; color: #666;
}
.nav-btn:hover { background: #f5f5f5; color: #000; }

/* === [原有] 右侧信息样式 === */
.info-wrapper { padding-left: 20px; }
.product-title {
  font-size: 26px; font-weight: 700; color: #222; margin: 0 0 15px 0; line-height: 1.3;
}
.divider { height: 1px; background: #eee; margin-bottom: 25px; }
.desc-label { font-weight: 700; font-size: 14px; margin-bottom: 10px; color: #333; }
.rich-text { font-size: 14px; color: #444; line-height: 1.8; }
:deep(p) { margin-bottom: 15px; }
:deep(ul), :deep(ol) { padding-left: 20px; margin-bottom: 20px; }
:deep(li) { margin-bottom: 8px; position: relative; }
:deep(li::marker) { color: #e74c3c; font-weight: bold; }
.action-buttons { display: flex; gap: 15px; margin-top: 40px; }
.action-btn {
  border-radius: 2px; font-weight: 700; text-transform: uppercase;
  padding: 22px 30px; letter-spacing: 0.5px;
}

/* === [新增] Tab 区域样式 === */
.product-tabs-section {
  margin-top: 50px; /* 与上方内容拉开距离 */
  margin-bottom: 30px;
  border-top: 1px solid #eee; /* 可选：加一个顶部分隔线 */
  padding-top: 30px;
}

.tabs-header {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.tab-btn {
  background: #fff;
  border: 1px solid #ddd;
  padding: 12px 30px;
  font-size: 14px;
  font-weight: 700;
  color: #333;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn:hover {
  border-color: #333;
}

/* 激活状态：深灰背景，匹配截图风格 */
.tab-btn.active {
  background: #444;
  color: #fff;
  border-color: #444;
}

.tab-content {
  color: #555;
  font-size: 14px;
  line-height: 1.6;
}

.empty-tip {
  color: #999;
  font-style: italic;
  padding: 10px 0;
}

/* === 移动端适配 === */
@media (max-width: 768px) {
  .main-image-box { height: 300px; }
  .info-wrapper { padding-left: 0; margin-top: 20px; }
  .action-buttons { flex-direction: column; gap: 10px; }
  .action-btn { width: 100%; margin-left: 0 !important; }
  
  /* 移动端 Tab 按钮撑满 */
  .tabs-header {
    flex-direction: row; 
    gap: 10px;
  }
  .tab-btn {
    flex: 1; /* 平分宽度 */
    padding: 10px 5px;
    font-size: 12px;
    white-space: nowrap; /* 防止文字换行 */
  }
}
</style>