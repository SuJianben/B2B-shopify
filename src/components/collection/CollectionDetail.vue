<template>
  <ProductLayout
    :banner-img="bannerImg"
    :breadcrumbs="breadcrumbList"
    :sidebar-menu="currentSidebarMenu" 
    :sidebar-rec="sidebarRecList"
    :sidebar-rec-title="sidebarRecTitle"
    @layout-navigate="handleFetchData"
  >
    <CollectionProductGrid 
      :title="currentTitle"
      :products="currentProducts"
      :pagination="currentPagination"
      :loading="loading"
      @page-change="handleFetchData"
    />
  </ProductLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProductLayout from '../product/ProductLayout.vue'; 
import CollectionProductGrid from './CollectionProductGrid.vue';

const props = defineProps({
  collectionTitle: String,
  productsData: Array,
  breadcrumbsData: Array,
  bannerImg: String,
  sidebarMenu: Array,
  sidebarRec: Array,
  sidebarRecTitle: String,
  paginationData: Object
});

// === 动态数据状态 ===
const currentProducts = ref(props.productsData || []);
const currentTitle = ref(props.collectionTitle || 'Collection');
const currentPagination = ref(props.paginationData || {});
const currentSidebarMenu = ref(props.sidebarMenu || []);

const loading = ref(false);

// === 静态数据 ===
const breadcrumbList = computed(() => props.breadcrumbsData || []);
const sidebarRecList = computed(() => props.sidebarRec || []);
const sidebarRecTitle = computed(() => props.sidebarRecTitle || 'RECOMMENDED');

// === [新增] 递归更新菜单高亮状态的辅助函数 ===
const updateMenuActiveState = (menu, currentPath) => {
  // 1. 获取当前路径（去掉 ?page=2 等参数，只比对路径部分）
  // 比如: "https://site.com/collections/a" -> "/collections/a"
  const normalize = (url) => {
    try {
      return new URL(url, window.location.origin).pathname;
    } catch (e) {
      return url; // 容错处理
    }
  };
  
  const targetPath = normalize(currentPath);

  return menu.map(item => {
    // 2. 判断当前项是否激活
    const itemPath = normalize(item.url);
    const isActive = itemPath === targetPath;

    // 3. 递归处理子菜单
    let children = [];
    let isChildActive = false;
    
    if (item.children && item.children.length > 0) {
      children = updateMenuActiveState(item.children, currentPath);
      // 如果任何一个子项是激活的，父级也标记为 child_active
      isChildActive = children.some(c => c.active || c.child_active);
    }

    return {
      ...item,
      children: children,
      active: isActive,         // 自身是否被点中
      child_active: isChildActive, // 子元素是否被点中
      // 如果自身激活或子元素激活，确保展开状态
      // 注意：这里我们让 isOpen 变为 true，但如果用户手动折叠了，下次刷新可能会重置展开，这是符合预期的
      isOpen: isActive || isChildActive || item.isOpen
    };
  });
};

// === 无刷新获取数据逻辑 ===
const handleFetchData = async (url) => {
  if (!url) return;
  
  loading.value = true;
  
  try {
    // 1. 修改浏览器 URL
    window.history.pushState({}, '', url);

    // 2. 请求 API
    const fetchUrl = url.includes('?') 
      ? `${url}&section_id=main-collection-vue` 
      : `${url}?section_id=main-collection-vue`;

    const response = await fetch(fetchUrl);
    const text = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const newRoot = doc.getElementById('vue-collection-app');

    if (newRoot) {
      // 3. 更新基础数据
      currentProducts.value = JSON.parse(newRoot.dataset.products || '[]');
      currentTitle.value = newRoot.dataset.collectionTitle || '';
      currentPagination.value = JSON.parse(newRoot.dataset.pagination || '{}');
      
      // 4. [修复菜单高亮] 
      // 先获取新菜单数据，如果为空则用旧数据
      let rawMenuData = JSON.parse(newRoot.dataset.sidebarMenu || '[]');
      if (!rawMenuData || rawMenuData.length === 0) {
        console.warn('New page returned empty menu, reusing existing menu.');
        // 深拷贝一份旧数据，避免直接修改引用
        rawMenuData = JSON.parse(JSON.stringify(currentSidebarMenu.value));
      }

      // 5. 强制根据当前 URL 刷新 active 状态
      // 这一步至关重要：它会把 rawMenuData 里旧的 active 清除，并把当前 URL 对应的项设为 active
      currentSidebarMenu.value = updateMenuActiveState(rawMenuData, url);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } catch (err) {
    console.error('Fetch error:', err);
    window.location.href = url; 
  } finally {
    loading.value = false;
  }
};
</script>