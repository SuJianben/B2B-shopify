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
            <img 
              :src="currentImage" 
              class="origin-img" 
              alt="Product Main" 
            />

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
            <button class="nav-btn prev" @click="scrollThumbs('left')">
              <el-icon><ArrowLeft /></el-icon>
            </button>

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

            <button class="nav-btn next" @click="scrollThumbs('right')">
              <el-icon><ArrowRight /></el-icon>
            </button>
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
            <el-button type="primary" color="#00a0e9" class="action-btn">
              SEND EMAIL TO US
            </el-button>
            <el-button type="primary" color="#00a0e9" plain class="action-btn">
              DOWNLOAD AS PDF
            </el-button>
          </div>

        </div>
      </el-col>
    </el-row>
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

// --- 相册与放大镜逻辑 ---
const currentImage = ref('');
const currentIndex = ref(0);
const trackRef = ref(null);
const zoomContainer = ref(null); // 绑定大图容器

// 控制放大镜状态
const showZoom = ref(false);
const zoomPosition = ref('0% 0%');

// 鼠标移动事件处理
const handleMouseMove = (e) => {
  if (!zoomContainer.value) return;

  // 1. 获取容器的大小和位置
  const { left, top, width, height } = zoomContainer.value.getBoundingClientRect();

  // 2. 计算鼠标在容器内的相对坐标 (0 - width, 0 - height)
  const x = e.clientX - left;
  const y = e.clientY - top;

  // 3. 转换为百分比 (0% - 100%)
  // 这里的逻辑是：鼠标在左上角(0,0) -> 背景位置0% 0%
  // 鼠标在右下角 -> 背景位置100% 100%
  let xPercent = (x / width) * 100;
  let yPercent = (y / height) * 100;

  // 4. 边界检查 (防止偶尔超出)
  if (xPercent < 0) xPercent = 0;
  if (xPercent > 100) xPercent = 100;
  if (yPercent < 0) yPercent = 0;
  if (yPercent > 100) yPercent = 100;

  // 5. 更新背景位置
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
  currentIndex.value = index;
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
/* === 大图与放大镜核心样式 === */
.main-image-box {
  width: 100%;
  height: 450px;
  border: 1px solid #f0f0f0;
  background: #fff;
  margin-bottom: 15px;
  
  position: relative; /* 关键：作为绝对定位子元素的父级 */
  overflow: hidden;   /* 关键：放大镜绝不出框 */
  cursor: crosshair;  /* 鼠标变成十字准星，提示可缩放 */
  
  display: flex;
  align-items: center;
  justify-content: center;
}

.origin-img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保证原图完整显示 */
  display: block;
}

/* 放大镜层 */
.zoom-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  /* 关键：背景图放大 2 倍 (200%) */
  background-size: 200%; 
  background-repeat: no-repeat;
  
  /* 盖在原图上面 */
  z-index: 10;
  background-color: #fff; /* 防止透明背景穿透 */
}

/* === 缩略图样式 (保持不变) === */
.thumbs-slider {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 80px;
}
.thumbs-track {
  flex: 1;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  padding: 2px;
}
.thumbs-track::-webkit-scrollbar { display: none; }
.thumb-item {
  flex-shrink: 0;
  width: 70px;
  height: 70px;
  border: 1px solid #ddd;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.2s;
}
.thumb-item.active {
  border: 2px solid #00a0e9;
  opacity: 1;
}
.thumb-img {
  width: 100%;
  height: 100%;
  display: block;
}
.nav-btn {
  background: #fff;
  border: 1px solid #eee;
  width: 30px;
  height: 70px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}
.nav-btn:hover { background: #f5f5f5; color: #000; }

/* === 右侧信息样式 (保持不变) === */
.info-wrapper { padding-left: 20px; }
.product-title {
  font-size: 26px;
  font-weight: 700;
  color: #222;
  margin: 0 0 15px 0;
  line-height: 1.3;
}
.divider {
  height: 1px;
  background: #eee;
  margin-bottom: 25px;
}
.desc-label {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 10px;
  color: #333;
}
.rich-text { font-size: 14px; color: #444; line-height: 1.8; }
:deep(p) { margin-bottom: 15px; }
:deep(ul), :deep(ol) { padding-left: 20px; margin-bottom: 20px; }
:deep(li) { margin-bottom: 8px; position: relative; }
:deep(li::marker) { color: #e74c3c; font-weight: bold; }
.action-buttons { display: flex; gap: 15px; margin-top: 40px; }
.action-btn {
  border-radius: 2px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 22px 30px;
  letter-spacing: 0.5px;
}
</style>