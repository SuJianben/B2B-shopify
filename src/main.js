import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// ==========================================
// 引入所有组件
// ==========================================
import AppHeader from './App.vue'; // 对应 Main 分支的重命名，指向 Header
import HomeHero from './components/home-hero/HomeHero.vue';
import ProductDetail from './components/product/ProductDetail.vue'; 
import FeaturedProducts from './components/home-product/FeaturedProducts.vue'; 
import HomeAbout from './components/home-about/HomeAbout.vue' 
import HomeRecommended from './components/home-recommended/HomeRecommended.vue' 
import HomeNews from './components/home-news/HomeNews.vue' 
import HomeLogos from './components/home-logos/HomeLogos.vue' 
import CollectionDetail from './components/collection/CollectionDetail.vue';
import AppFooter from './components/footer/Footer.vue'; // [来自 Main] 新增 Footer

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
      socialLinks: shopifyData.social
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
// 3. 初始化 Product Detail (来自 HEAD 的新增逻辑)
// ==========================================
const initProductApp = () => {
  const productRoot = document.getElementById('vue-product-app');

  if (!productRoot) return;
  if (productRoot.dataset.__vueMounted) return;

  try {
    const productData = JSON.parse(productRoot.dataset.product || '{}');
    const breadcrumbsData = JSON.parse(productRoot.dataset.breadcrumbs || '[]');

    // [新增] 读取自定义背景图 URL
    const bannerImg = productRoot.dataset.bannerImg || '';

    const app = createApp(ProductDetail, {
      productData,
      breadcrumbsData,
      bannerImg, // [新增] 传递给根组件
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
  roots.forEach(el => {
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
// 5. 初始化 Home Recommended (新增逻辑)
// ==========================================
const initRecommended = () => {
  const roots = document.querySelectorAll('.vue-home-recommended-root')

  roots.forEach(el => {
    if (el.dataset.__vueMounted) return;

    let settings = {}
    try {
      if (el.dataset.settings) {
        settings = JSON.parse(el.dataset.settings)
      }
    } catch (e) {
      console.error('Recommended JSON Error:', e)
    }

    const app = createApp(HomeRecommended, { data: settings })
    app.use(ElementPlus) 
    app.mount(el)
    el.dataset.__vueMounted = true
  })
}

// ==========================================
// 6. 初始化 Home About (来自 Main 的新增逻辑)
// ==========================================
const initHomeAbout = () => {
  const roots = document.querySelectorAll('.vue-home-about-root')

  roots.forEach(el => {
    if (el.dataset.__vueMounted) return;

    let settings = {}
    try {
      if (el.dataset.settings) {
        settings = JSON.parse(el.dataset.settings)
      }
    } catch (e) {
      console.error('Home About JSON Error:', e)
    }

    const app = createApp(HomeAbout, { settings })
    // 如果用到了 ElementPlus 记得 use，没用到可以不加，这个组件纯 CSS 写的其实不需要
    app.use(ElementPlus) 
    app.mount(el)
    el.dataset.__vueMounted = true
  })
}

// ==========================================
// 7. 初始化 Home News (新增逻辑)
// ==========================================
const initNews = () => {
  const roots = document.querySelectorAll('.vue-home-news-root')
  roots.forEach(el => {
    if (el.dataset.__vueMounted) return;
    let settings = {}
    try {
      if (el.dataset.settings) settings = JSON.parse(el.dataset.settings)
    } catch (e) { console.error(e) }

    const app = createApp(HomeNews, { data: settings })
    app.use(ElementPlus)
    app.mount(el)
    el.dataset.__vueMounted = true
  })
}

// ==========================================
// 8. 初始化 Home Logos (新增逻辑)
// ==========================================
const initLogos = () => {
  const roots = document.querySelectorAll('.vue-home-logos-root')
  roots.forEach(el => {
    if (el.dataset.__vueMounted) return;
    let settings = {}
    try {
      if (el.dataset.settings) settings = JSON.parse(el.dataset.settings)
    } catch (e) { console.error(e) }

    const app = createApp(HomeLogos, { data: settings })
    app.mount(el)
    el.dataset.__vueMounted = true
  })
}

// ==========================================
//  9. 初始化 Collection Page
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

// ==========================================
// 10. 初始化 Footer (来自 Main 的新增逻辑)
// ==========================================
const initFooter = () => {
  // 这里的 ID 'vue-footer-root' 对应我们在 liquid 里写的 <div id="vue-footer-root">
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

    const app = createApp(AppFooter, { settings }); // 创建 Footer 应用
    app.use(ElementPlus);
    app.mount(root);
    root.dataset.__vueMounted = true;
  }
};

// ==========================================
// 11. 事件监听与执行 (整合所有功能)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initHeader();           // 初始化 Header
  initHeroSections();     // 初始化 Hero
  initProductApp();       // [HEAD] 初始化 Product Detail
  initFeaturedProducts(); // [Main] 初始化 Featured Products
  initHomeAbout();       // [Main] 初始化 Home About
  initRecommended();      // [Main] 初始化 Home Recommended
  initNews();             // [Main] 初始化 Home News
  initLogos();            // [Main] 初始化 Home Logos
  initCollectionApp();    // [Main] 初始化 Collection
  initFooter();           // [Main] 初始化 Footer
});

// 监听 Shopify 编辑器事件 (实现热重载)
document.addEventListener('shopify:section:load', (e) => {
  const target = e.target;

  // 1. 检查 Hero Section
  if (target.querySelector('.vue-home-hero-root')) {
    initHeroSections();
  }

  // 2. [HEAD] 检查 Product Section
  // 注意：Shopify 编辑器重载时，e.target 通常是 section 容器
  if (target.querySelector('#vue-product-app') || target.id === 'vue-product-app') {
    initProductApp();
  }

  // 3. [Main] 检查 Featured Products
  if (target.querySelector('.vue-featured-products-root')) {
    initFeaturedProducts();
  }

  // 4. [Main] 检查 Home About
  if (target.querySelector('.vue-home-about-root')) {
    initHomeAbout();
  }

  // 5. [Main] 检查 Home Recommended
  if (target.querySelector('.vue-home-recommended-root')) {
    initRecommended();
  }

  // 6. [Main] 检查 Home News
  if (target.querySelector('.vue-home-news-root')) {
    initNews();
  }

  // 7. [Main] 检查 Home Logos
  if (target.querySelector('.vue-home-logos-root')) {
    initLogos();
  }

  // 8. [Main] 检查 Footer
  if (target.querySelector('#vue-footer-root')) {
    initFooter();
  }
});