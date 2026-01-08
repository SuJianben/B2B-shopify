<template>
  <div class="product-layout">
    <BreadcrumbBanner 
      v-if="bannerImg"
      :image="bannerImg" 
      :breadcrumbs="breadcrumbs || []" 
    />

    <div class="page-width main-content-wrapper">
      <el-row :gutter="40">
        <el-col :xs="0" :md="6" class="hidden-mobile">
          <ProductSidebar 
            :menu-data="sidebarMenu" 
            :recommended-data="sidebarRec"
            :recommended-title="sidebarRecTitle"
            @filter-click="(url) => emits('layout-navigate', url)"
          />
        </el-col>

        <el-col :xs="24" :md="18">
          <slot></slot>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import BreadcrumbBanner from './BreadcrumbBanner.vue';
import ProductSidebar from './ProductSidebar.vue';

defineProps({
  bannerImg: String,
  breadcrumbs: Array,
  sidebarMenu: Array,
  sidebarRec: Array,
  sidebarRecTitle: String
});

// 定义一个新的事件，告诉 CollectionDetail 页面需要跳转
const emits = defineEmits(['layout-navigate']);
</script>

<style scoped>
/* 样式不变 */
.product-layout { width: 100%; padding-bottom: 50px; }
.main-content-wrapper { max-width: 1400px; margin: 0 auto; padding: 40px 20px; }
@media (max-width: 992px) { .main-content-wrapper { padding: 20px; } }
@media (max-width: 768px) { .hidden-mobile { display: none !important; } }
</style>