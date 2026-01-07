<template>
  <div class="product-detail-page">
    <BreadcrumbBanner 
      :image="bannerImg" 
      :breadcrumbs="breadcrumbList" 
    />

    <div class="page-width main-content-wrapper">
      <el-row :gutter="40">
        
        <el-col :xs="24" :md="6">
          <ProductSidebar />
        </el-col>

        <el-col :xs="24" :md="18">
          <ProductMainInfo :product="product" />
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BreadcrumbBanner from './BreadcrumbBanner.vue';
// 引入新组件
import ProductSidebar from './ProductSidebar.vue';
import ProductMainInfo from './ProductMainInfo.vue';

const props = defineProps({
  productData: Object,
  breadcrumbsData: Array,
  bannerImg: String
});

const product = computed(() => props.productData);
const breadcrumbList = computed(() => props.breadcrumbsData);
</script>

<style scoped>
.product-detail-page {
  width: 100%;
  padding-bottom: 50px;
}

/* 核心内容区的容器，确保居中且有宽度限制 */
.main-content-wrapper {
  max-width: 1400px; /* 限制最大宽 */
  margin: 0 auto;    /* 居中 */
  padding: 40px 20px; /* 上下留白 */
}

/* 手机端适配调整 */
@media (max-width: 992px) {
  .main-content-wrapper {
    padding: 20px;
  }
}
</style>