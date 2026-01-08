<template>
  <div class="right-content-container">
    <ProductMainInfo :product="product" />

    <ProductInquiryForm :product-name="product.title" />
    
    <RelatedProducts 
      :products="relatedProducts"
      :title="relatedTitle"
    />
  </div>
</template>

<script setup>
// 引入这三个核心组件
import ProductMainInfo from './ProductMainInfo.vue';
import ProductInquiryForm from './ProductInquiryForm.vue';
import RelatedProducts from './RelatedProducts.vue';

defineProps({
  product: { type: Object, default: () => ({}) },
  relatedProducts: { type: Array, default: () => [] },
  relatedTitle: String
});
</script>

<style scoped>
/* 如果右侧整体需要样式，写在这里，目前通常不需要 */
</style>