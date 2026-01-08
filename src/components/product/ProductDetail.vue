<template>
  <ProductLayout
    :banner-img="bannerImg"
    :breadcrumbs="breadcrumbList"
    :sidebar-menu="sidebarMenuList"
    :sidebar-rec="sidebarRecList"
    :sidebar-rec-title="sidebarRecTitle"
  >
    
    <ProductRightContent 
      :product="product"
      :related-products="relatedList"
      :related-title="relatedTitle"
    />

  </ProductLayout>
</template>

<script setup>
import { computed } from 'vue';
import ProductLayout from './ProductLayout.vue'; 
import ProductRightContent from './ProductRightContent.vue';

// 接收 main.js 传来的所有原始数据
const props = defineProps({
  productData: Object,
  breadcrumbsData: Array,
  bannerImg: String,
  relatedProducts: Array,
  relatedTitle: String,
  sidebarMenu: Array,
  sidebarRec: Array,
  sidebarRecTitle: String
});

// 计算属性 (保持不变)
const product = computed(() => props.productData || {});
const breadcrumbList = computed(() => props.breadcrumbsData);
const relatedList = computed(() => props.relatedProducts || []);
const relatedTitle = computed(() => props.relatedTitle || 'Products categories');
const sidebarMenuList = computed(() => props.sidebarMenu || []);
const sidebarRecList = computed(() => props.sidebarRec || []);
const sidebarRecTitle = computed(() => props.sidebarRecTitle || 'RECOMMENDED');
</script>