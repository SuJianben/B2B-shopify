import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// ==========================================
// 引入所有组件
// ==========================================
import AppHeader from './App.vue'; // 对应 Main 分支的重命名，指向 Header
import HomeHero from './components/home-hero/HomeHero.vue';
import ProductDetail from './components/product/ProductDetail.vue'; // [来自 HEAD] 产品详情页
import FeaturedProducts from './components/home-product/FeaturedProducts.vue'; // [来自 Main] 推荐产品
import AppFooter from './components/footer/Footer.vue'; // [来自 Main] Footer
import CollectionDetail from './components/collection/CollectionDetail.vue'; // [新增]

// ==========================================
// 1. 初始化 Header (采用 Main 的封装写法)
// ==========================================
const initHeader = () => {
  const mountPoint = document.getElementById('app');
  // 增加防止重复挂载的判断
  if (mountPoint && !mountPoint.dataset.__vueMounted) {
    const menuScript = document.getElementById('shopify-menu-data');
    let shopifyData = { menu: [], social: {} };

    if (menuScript && menuScript.textContent) {
      try {
        const parsedData = JSON.parse(menuScript.textContent);
        if (Array.isArray(parsedData)) {
          shopifyData.menu = parsedData;
        } else {
          shopifyData = parsedData;
        }
        console.log('Header Data Loaded:', shopifyData);
      } catch (e) {
        console.error('Header JSON Error:', e);
      }
    }

    const app = createApp(AppHeader, {
      menuItems: shopifyData.menu,
      socialLinks: shopifyData.social,
    });

    app.use(ElementPlus);
    app.mount(mountPoint);
    mountPoint.dataset.__vueMounted = true;
  }
};

// ==========================================
// 2. 初始化 Home Hero (合并逻辑)
// ==========================================
const initHeroSections = () => {
  const roots = document.querySelectorAll('.vue-home-hero-root');

  roots.forEach((el) => {
    if (el.dataset.__vueMounted) return; // 防止重复挂载

    let settings = {};
    try {
      if (el.dataset.settings) {
        settings = JSON.parse(el.dataset.settings);
      }
    } catch (e) {
      console.error('Home Hero JSON Error:', e);
    }

    const app = createApp(HomeHero, {
      sectionData: settings, // 统一使用 settings
    });

    app.use(ElementPlus);
    app.mount(el);
    el.dataset.__vueMounted = true;
  });
};

// ==========================================
// 3. 初始化 Product Detail (包含所有模块逻辑)
// ==========================================
const initProductApp = () => {
  const productRoot = document.getElementById('vue-product-app');

  if (!productRoot) return;
  if (productRoot.dataset.__vueMounted) return;

  try {
    // 1. 读取基础产品数据
    const productData = JSON.parse(productRoot.dataset.product || '{}');
    const breadcrumbsData = JSON.parse(productRoot.dataset.breadcrumbs || '[]');
    const bannerImg = productRoot.dataset.bannerImg || '';

    // 2. 读取底部相关产品数据
    const relatedProducts = JSON.parse(productRoot.dataset.related || '[]');
    const relatedTitle = productRoot.dataset.relatedTitle || 'Products categories';

    // 3. 读取侧边栏菜单数据
    const sidebarMenu = JSON.parse(productRoot.dataset.sidebarMenu || '[]');

    // 4. [新增] 读取侧边栏推荐产品数据
    // 对应我们在 Liquid 里增加的 data-sidebar-rec 和 data-sidebar-rec-title
    const sidebarRec = JSON.parse(productRoot.dataset.sidebarRec || '[]');
    const sidebarRecTitle = productRoot.dataset.sidebarRecTitle || 'RECOMMENDED';

    const app = createApp(ProductDetail, {
      productData,
      breadcrumbsData,
      bannerImg,
      relatedProducts,
      relatedTitle,
      sidebarMenu,
      // [新增] 传递给组件
      sidebarRec,
      sidebarRecTitle,
    });

    app.use(ElementPlus);
    app.mount(productRoot);

    productRoot.dataset.__vueMounted = true;
  } catch (e) {
    console.error('Product Detail JSON Error:', e);
  }
};

// ==========================================
// 4. 初始化 Featured Products (来自 Main 的新增逻辑)
// ==========================================
const initFeaturedProducts = () => {
  const roots = document.querySelectorAll('.vue-featured-products-root');
  roots.forEach((el) => {
    if (el.dataset.__vueMounted) return;
    let settings = {};
    try {
      if (el.dataset.settings) {
        settings = JSON.parse(el.dataset.settings);
      }
    } catch (e) {
      console.error('Featured Products JSON Error:', e);
    }
    const app = createApp(FeaturedProducts, { data: settings });
    app.use(ElementPlus);
    app.mount(el);
    el.dataset.__vueMounted = true;
  });
};

// ==========================================
// 5. 初始化 Footer (来自 Main 的新增逻辑)
// ==========================================
const initFooter = () => {
  const root = document.getElementById('vue-footer-root');

  if (root && !root.dataset.__vueMounted) {
    let settings = {};
    try {
      if (root.dataset.settings) {
        settings = JSON.parse(root.dataset.settings);
      }
    } catch (e) {
      console.error('Footer JSON Error:', e);
    }

    const app = createApp(AppFooter, { settings });
    app.use(ElementPlus);
    app.mount(root);
    root.dataset.__vueMounted = true;
  }
};

// ==========================================
// 6. 事件监听与执行 (整合所有功能)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initHeader(); // 初始化 Header
  initHeroSections(); // 初始化 Hero
  initProductApp(); // [HEAD] 初始化 Product Detail
  initFeaturedProducts(); // [Main] 初始化 Featured Products
  initFooter(); // [Main] 初始化 Footer
});

// 监听 Shopify 编辑器事件 (实现热重载)
document.addEventListener('shopify:section:load', (e) => {
  const target = e.target;

  // 1. 检查 Hero Section
  if (target.querySelector('.vue-home-hero-root')) {
    initHeroSections();
  }

  // 2. [HEAD] 检查 Product Section
  if (target.querySelector('#vue-product-app') || target.id === 'vue-product-app') {
    initProductApp();
  }

  // 3. [Main] 检查 Featured Products
  if (target.querySelector('.vue-featured-products-root')) {
    initFeaturedProducts();
  }

  // 4. [Main] 检查 Footer
  if (target.querySelector('#vue-footer-root')) {
    initFooter();
  }
});

// ==========================================
// [新增] 7. 初始化 Collection Page
// ==========================================
const initCollectionApp = () => {
  const root = document.getElementById('vue-collection-app');
  if (!root || root.dataset.__vueMounted) return;

  try {
    const productsData = JSON.parse(root.dataset.products || '[]');
    const breadcrumbsData = JSON.parse(root.dataset.breadcrumbs || '[]');
    const bannerImg = root.dataset.bannerImg || '';
    const sidebarMenu = JSON.parse(root.dataset.sidebarMenu || '[]');
    const sidebarRec = JSON.parse(root.dataset.sidebarRec || '[]');
    const sidebarRecTitle = root.dataset.sidebarRecTitle || 'RECOMMENDED';
    const collectionTitle = root.dataset.collectionTitle || 'Collection';

    // [新增] 读取分页数据
    const paginationData = JSON.parse(root.dataset.pagination || '{}');

    const app = createApp(CollectionDetail, {
      collectionTitle,
      productsData,
      breadcrumbsData,
      bannerImg,
      sidebarMenu,
      sidebarRec,
      sidebarRecTitle,
      paginationData // [新增]
    });

    app.use(ElementPlus);
    app.mount(root);
    root.dataset.__vueMounted = true;
  } catch (e) {
    console.error('Collection App JSON Error:', e);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeroSections();
  initProductApp();
  initCollectionApp(); // [新增] 启动集合页
  initFeaturedProducts();
  initFooter();
});

document.addEventListener('shopify:section:load', (e) => {
  const target = e.target;
  // ... 其他检查
  // [新增] 检查 Collection Section
  if (target.querySelector('#vue-collection-app') || target.id === 'vue-collection-app') {
    initCollectionApp();
  }
});
