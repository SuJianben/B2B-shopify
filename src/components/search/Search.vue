<template>
  <transition name="slide">
    <div v-show="isVisible" class="search-overlay-wrapper">
      
      <div class="search-container">
        
        <div class="search-header">
          <el-input 
            v-model="query" 
            class="search-input"
            placeholder="Search..." 
            clearable
            @input="handleInput"
            @keyup.enter="handleEnter"
            ref="inputRef"
          >
            <template #prefix>
              <el-icon class="search-icon"><Search /></el-icon>
            </template>
          </el-input>
          
          <el-button link class="close-btn" @click="close">
            <el-icon class="close-icon"><Close /></el-icon>
          </el-button>
        </div>

        <div class="search-results-box" v-if="query.trim()">
          
          <div v-if="loading" class="status-text">Searching...</div>

          <div v-else-if="products.length > 0" class="results-wrapper">
            <div class="section-title">SUGGESTIONS</div>
            
            <div class="results-grid">
              <a 
                v-for="product in products" 
                :key="product.id" 
                :href="product.url" 
                class="product-item"
              >
                <div class="product-img">
                  <img v-if="product.image" :src="product.image" :alt="product.title">
                  <div v-else class="no-img">No Image</div>
                </div>
                <div class="product-info">
                  <div class="product-title">{{ product.title }}</div>
                </div>
              </a>
            </div>
            
            <div class="view-all">
               <el-button class="view-all-btn" text bg @click="handleEnter">
                 View all results ({{ query }})
               </el-button>
            </div>
          </div>

          <div v-else-if="!loading && query.trim()" class="status-text">
            No products found.
          </div>
        </div>

      </div>
      
      <div class="search-mask" @click="close"></div>
    </div>
  </transition>
</template>

<script setup>
import { ref, nextTick, defineExpose } from 'vue'
import { Search, Close } from '@element-plus/icons-vue'

const isVisible = ref(false)
const query = ref('')
const products = ref([]) 
const loading = ref(false)
const inputRef = ref(null) 
let debounceTimer = null

const open = () => {
  isVisible.value = true
  nextTick(() => { if (inputRef.value) inputRef.value.focus() })
}

const close = () => { isVisible.value = false }

const handleInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  loading.value = true
  debounceTimer = setTimeout(() => { fetchSuggestions() }, 300)
}

const fetchSuggestions = async () => {
  const keyword = query.value.trim()
  if (!keyword) {
    products.value = []
    loading.value = false
    return
  }
  try {
    const res = await fetch(`/search/suggest.json?q=${encodeURIComponent(keyword)}&resources[type]=product&resources[limit]=6`)
    const data = await res.json()
    const suggestions = data.resources.results.products
    products.value = suggestions.map(p => ({
      id: p.id,
      title: p.title,
      url: p.url,
      image: p.featured_image?.url || p.image 
    }))
  } catch (e) { console.error(e) } finally { loading.value = false }
}

const handleEnter = () => {
  if (!query.value.trim()) return
  window.location.href = `/search?type=product&options[prefix]=last&q=${encodeURIComponent(query.value)}`
  close()
}

defineExpose({ open })
</script>

<style scoped>
/* === 基础布局 (PC优先，Mobile 在底部覆盖) === */
.search-overlay-wrapper {
  position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
  z-index: 2000; display: flex; flex-direction: column;
}

.search-container {
  background: #fff; width: 100%; position: relative; z-index: 2002;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  display: flex; flex-direction: column;
  /* PC端最大高度限制 */
  max-height: 80vh; 
}

/* 头部 */
.search-header {
  width: 100%; max-width: 1400px; margin: 0 auto;
  padding: 30px 40px; /* PC 端宽敞间距 */
  display: flex; align-items: center; gap: 20px;
  border-bottom: 1px solid transparent; /* 预留边框位置 */
}

/* 输入框 PC 样式 */
.search-input { flex: 1; }
:deep(.el-input__wrapper) {
  box-shadow: none !important;
  border-bottom: 2px solid #eee !important;
  border-radius: 0; padding: 0; background: transparent;
}
:deep(.el-input__inner) {
  font-size: 32px; /* PC 端大字体 */
  height: 60px; color: #333; font-weight: 300;
}
:deep(.el-input__inner::placeholder) { color: #ddd; }
.search-icon { font-size: 32px; color: #ccc; margin-right: 15px; }

.close-btn { color: #999; }
.close-icon { font-size: 28px; }
.close-btn:hover { color: #000; }

/* 结果滚动区域 */
.search-results-box {
  width: 100%; max-width: 1400px; margin: 0 auto;
  padding: 0 40px 40px 40px;
  overflow-y: auto; /* 关键：内部滚动 */
  /* 确保有足够高度显示内容 */
  min-height: 100px; 
}

.section-title { font-size: 12px; color: #999; letter-spacing: 2px; margin-bottom: 20px; margin-top: 20px; text-transform: uppercase; font-weight: 600; }
.status-text { padding: 30px 0; color: #999; font-size: 14px; text-align: center; }

/* 网格布局 (PC) */
.results-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* PC 一行 6 个 */
  gap: 20px;
  margin-bottom: 30px;
}

/* 产品卡片 */
.product-item { text-decoration: none; color: #333; display: flex; flex-direction: column; group: hover; }
.product-item:hover .product-title { color: #d4af37; }
.product-img {
  width: 100%; aspect-ratio: 1; background: #f7f7f7; margin-bottom: 12px;
  border-radius: 4px; overflow: hidden; display: flex; align-items: center; justify-content: center;
}
.product-img img { width: 100%; height: 100%; object-fit: cover; }
.no-img { font-size: 12px; color: #ccc; }
.product-title { 
  font-weight: 600; font-size: 14px; line-height: 1.4; 
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.view-all { text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
.view-all-btn { font-size: 14px; }

/* 遮罩 */
.search-mask {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(5px); z-index: 2001;
}

/* 动画 */
.slide-enter-active, .slide-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { transform: translateY(-100%); opacity: 0; }


/* =========================================
   ⭐⭐⭐ 移动端适配 (Max Width 768px) ⭐⭐⭐
   ========================================= */
@media (max-width: 768px) {
  .search-container {
    max-height: 100vh; /* 手机端占满全屏，防止键盘顶起问题 */
    height: auto;
  }

  /* 头部压缩 */
  .search-header {
    padding: 15px 20px; /* 减小间距 */
    gap: 10px;
    border-bottom: 1px solid #f5f5f5; /* 手机端加个底边框区分 */
  }

  /* 输入框缩小 */
  :deep(.el-input__inner) {
    font-size: 18px; /* 字体变小 */
    height: 40px;
  }
  .search-icon { font-size: 20px; margin-right: 8px; }
  .close-icon { font-size: 22px; }

  /* 结果区域调整 */
  .search-results-box {
    padding: 0 20px 20px 20px; /* 减小内边距 */
  }

  /* 网格变双列 */
  .results-grid {
    grid-template-columns: repeat(2, 1fr); /* 手机端一行 2 个 */
    gap: 15px;
  }

  /* 标题微调 */
  .section-title {
    margin-top: 15px;
    margin-bottom: 15px;
    font-size: 11px;
  }

  .product-title {
    font-size: 13px; /* 手机端产品标题稍微小一点 */
  }
}
</style>