<template>
  <div class="product-sidebar">
    
    <div class="sidebar-block">
      <div class="sidebar-header">PRODUCTS</div>
      
      <div v-if="menuItems.length === 0" style="padding: 20px; color: #999; font-size: 13px;">
        Please configure menu in Shopify.
      </div>

      <ul class="category-list" v-else>
        <li 
          v-for="(item, index) in menuItems" 
          :key="index" 
          class="category-item-wrapper"
        >
          <div 
            class="category-item" 
            :class="{ 'is-active': item.active || item.isOpen }"
            @click="toggleMenu(index)"
          >
            <a 
              :href="item.url" 
              class="cat-link" 
              @click.stop.prevent="handleLinkClick(item.url)"
            >
              {{ item.title }}
            </a>
            <span v-if="item.children && item.children.length > 0" class="toggle-icon">
              {{ item.isOpen ? '-' : '+' }}
            </span>
          </div>

          <div 
            class="sub-menu" 
            v-if="item.children && item.children.length > 0"
            v-show="item.isOpen"
          >
            <div 
              v-for="(child, cIndex) in item.children" 
              :key="cIndex" 
              class="sub-item"
            >
              <a 
                :href="child.url" 
                class="sub-link"
                @click.prevent="handleLinkClick(child.url)"
              >
                {{ child.title }}
              </a>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="sidebar-block" v-if="recommendedData && recommendedData.length > 0">
      <div class="sidebar-header">{{ recommendedTitle }}</div>
      <div class="recommend-list">
        <a 
          v-for="(prod, idx) in recommendedData" 
          :key="idx" 
          :href="prod.url"
          class="recommend-item"
        >
          <div class="rec-img-wrapper">
            <img :src="prod.image || placeholderImg" alt="Product" />
          </div>
          <div class="rec-info">
            <div class="rec-title">{{ prod.title }}</div>
            <div class="rec-desc">{{ prod.desc }}...</div>
          </div>
          <div class="rec-icon">+</div>
        </a>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  menuData: { type: Array, default: () => [] },
  recommendedData: { type: Array, default: () => [] },
  recommendedTitle: { type: String, default: 'RECOMMENDED' }
});

// [新增] 定义事件
const emits = defineEmits(['filter-click']);

const menuItems = ref([]);
const placeholderImg = 'https://via.placeholder.com/100x100?text=No+Img';

watch(() => props.menuData, (newVal) => {
  if (newVal) {
    menuItems.value = newVal.map(item => ({
      ...item,
      isOpen: item.active || item.child_active || false 
    }));
  }
}, { immediate: true });

const toggleMenu = (index) => {
  if (menuItems.value[index].children && menuItems.value[index].children.length > 0) {
    menuItems.value[index].isOpen = !menuItems.value[index].isOpen;
  }
};

// [新增] 处理链接点击，向上传递 URL 而不是直接跳转
const handleLinkClick = (url) => {
  emits('filter-click', url);
};
</script>

<style scoped>
/* 样式保持原样，无需变动 */
.product-sidebar { width: 100%; }
.sidebar-block { margin-bottom: 30px; }
.sidebar-header {
  background-color: #dcb765; color: #fff; padding: 15px 20px;
  font-weight: 700; text-transform: uppercase; font-size: 14px; letter-spacing: 0.5px;
}
.category-list { list-style: none; padding: 0; margin: 0; background: #f8f8f8; }
.category-item {
  padding: 15px 20px; border-bottom: 1px solid #e0e0e0; display: flex;
  justify-content: space-between; align-items: center; cursor: pointer; transition: background 0.2s;
}
.category-item:hover { background: #fff; }
.category-item.is-active .cat-link { color: #dcb765; font-weight: 700; }
.cat-link {
  text-decoration: none; color: #333; font-size: 13px; font-weight: 500;
  text-transform: uppercase; flex: 1;
}
.toggle-icon { font-weight: bold; font-size: 16px; color: #666; margin-left: 10px; }
.sub-menu { background: #fff; border-bottom: 1px solid #e0e0e0; }
.sub-item { padding: 10px 20px 10px 35px; border-top: 1px solid #f0f0f0; }
.sub-link { text-decoration: none; color: #666; font-size: 13px; display: block; transition: color 0.2s; }
.sub-link:hover { color: #dcb765; }
.recommend-list { background: #fff; border: 1px solid #eee; border-top: none; }
.recommend-item {
  display: flex; gap: 15px; padding: 20px; border-bottom: 1px solid #eee;
  text-decoration: none; color: inherit; position: relative; transition: background 0.2s;
}
.recommend-item:hover { background: #fcfcfc; }
.recommend-item:last-child { border-bottom: none; }
.rec-img-wrapper {
  width: 70px; height: 70px; background: #f9f9f9; flex-shrink: 0; display: flex;
  align-items: center; justify-content: center; border: 1px solid #f0f0f0;
}
.rec-img-wrapper img { max-width: 100%; max-height: 100%; object-fit: contain; }
.rec-info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.rec-title { font-size: 12px; font-weight: 700; color: #333; margin-bottom: 6px; line-height: 1.4; text-transform: uppercase; }
.rec-desc { font-size: 11px; color: #888; line-height: 1.3; }
.rec-icon {
  position: absolute; bottom: 5px; right: 5px; font-size: 10px; background: #666; color: #fff;
  width: 14px; height: 14px; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0.5;
}
.recommend-item:hover .rec-icon { background: #dcb765; opacity: 1; }
</style>