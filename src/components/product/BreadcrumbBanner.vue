<template>
  <div class="breadcrumb-banner" :style="{ backgroundImage: `url(${image})` }">
    <div class="overlay"></div>

    <div class="banner-content page-width">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item v-for="(item, index) in items" :key="index">
          <a :href="item.link" class="breadcrumb-link">
            {{ item.text }}
          </a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // 接收从 Liquid -> main.js -> ProductDetail 传进来的图片
  image: {
    type: String,
    default: ''
  },
  breadcrumbs: {
    type: Array,
    default: () => []
  }
});

const items = computed(() => props.breadcrumbs);
</script>

<style scoped>
/* === 核心布局修改 === */
.breadcrumb-banner {
  /* 1. 宽度计算：比父容器(白纸)宽 80px (左右各凸出 40px) */
  width: calc(100% + 80px);
  
  /* 2. 位置修正：向左拉回 40px，实现居中 */
  margin-left: -40px;
  
  /* 3. 上下边距：与 Header 拉开一点距离 */
  margin-top: 30px;
  margin-bottom: 30px;

  /* 4. 高度 */
  height: 300px;
  
  /* 5. 阴影：因为它凸出去了，加个阴影会让它看起来更有层次感 */
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);

  /* 标准背景属性 */
  position: relative;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; 
}

/* 遮罩层 (保持不变) */
.overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

/* 内容区域 (保持不变) */
.banner-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

/* Element Plus 样式覆盖 (保持不变) */
:deep(.el-breadcrumb) {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

:deep(.el-breadcrumb__inner a),
:deep(.el-breadcrumb__separator) {
  color: #ffffff !important;
  font-weight: 500;
}

:deep(.el-breadcrumb__inner a:hover) {
  color: #ffd04b !important;
  cursor: pointer;
}

/* === 手机端适配 === */
/* 手机屏幕很窄，就不要凸出去了，否则会撑破屏幕产生横向滚动条 */
@media (max-width: 768px) {
  .breadcrumb-banner {
    width: 100%;       /* 手机上回归 100% 宽度 */
    margin-left: 0;    /* 取消左移 */
    border-radius: 0;  /* 手机上通常直角更好看 */
    margin-top: 0;
    height: 200px;     /* 高度变小 */
  }
}
</style>