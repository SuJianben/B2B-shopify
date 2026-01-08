<template>
  <div class="collection-grid-container" v-loading="loading">
    <h2 class="collection-title">{{ title }}</h2>
    <div class="divider"></div>

    <el-row :gutter="10">
      <el-col 
        v-for="(product, index) in products" 
        :key="index"
        :xs="12" :sm="12" :md="8"
        class="grid-col"
      >
        <a :href="product.url" class="product-card">
          <div class="img-wrapper">
            <img :src="product.image || placeholderImg" loading="lazy" :alt="product.title">
          </div>
          <div class="card-info">
            <h3 class="product-name">{{ product.title }}</h3>
          </div>
        </a>
      </el-col>
    </el-row>
    
    <div v-if="products.length === 0" class="empty-state">
      No products found in this collection.
    </div>

    <div class="pagination-wrapper" v-if="pagination && pagination.total_pages > 1">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pagination.total_items"
        :page-size="pagination.page_size"
        :current-page="pagination.current_page"
        @current-change="handlePageChange"
        :pager-count="5" 
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  products: Array,
  pagination: Object,
  loading: Boolean // 接收 loading 状态
});

const emits = defineEmits(['page-change']);
const placeholderImg = 'https://via.placeholder.com/400x400?text=No+Image';

const handlePageChange = (newPage) => {
  // 构建新的 URL，但不跳转，而是传给父组件 fetch
  const url = new URL(window.location.href);
  url.searchParams.set('page', newPage);
  // 触发事件
  emits('page-change', url.toString());
};
</script>

<style scoped>
.collection-grid-container {
  padding-bottom: 40px;
  min-height: 400px; /* 防止加载时高度塌陷 */
}

.collection-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.divider {
  height: 1px;
  background: #eee;
  margin-bottom: 30px;
}

.grid-col {
  margin-bottom: 20px;
}

.product-card {
  display: block;
  text-decoration: none;
  background: #fff;
  border: 1px solid #eee;
  transition: all 0.3s;
  height: 100%;
}

.product-card:hover {
  border-color: #dcb765;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transform: translateY(-5px);
}

.img-wrapper {
  width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  background: #fff;
}

.img-wrapper img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.card-info {
  padding: 15px;
  text-align: center;
  border-top: 1px solid #f9f9f9;
}

.product-name {
  font-size: 14px;
  color: #333;
  margin: 0;
  line-height: 1.4;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty-state {
  text-align: center;
  color: #666;
  padding: 100px 0;
  font-size: 16px;
  background: #f9f9f9;
  border: 1px dashed #ddd;
  margin-top: 20px;
}

.pagination-wrapper {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

/* === 移动端适配 === */
@media (max-width: 768px) {
  .img-wrapper {
    height: 150px; 
    padding: 10px;
  }
  
  .card-info {
    padding: 10px 5px;
  }

  .product-name {
    font-size: 12px; 
  }

  .grid-col {
    margin-bottom: 10px;
  }
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #dcb765;
}
:deep(.el-pagination.is-background .el-pager li:hover) {
  color: #dcb765;
}
</style>