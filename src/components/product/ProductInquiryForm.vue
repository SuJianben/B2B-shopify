<template>
  <div class="inquiry-form-wrapper">
    <div class="form-header">
      Leave Your Message
    </div>

    <div class="contact-form">
      <div class="form-body">
        
        <div class="form-item">
          <el-input 
            v-model="formData.productName" 
            readonly 
            class="custom-input"
            placeholder="Product Name"
          />
        </div>

        <div class="form-item">
          <el-input 
            v-model="formData.name" 
            placeholder="* Name" 
            class="custom-input"
          />
        </div>

        <div class="form-item">
          <el-input 
            v-model="formData.email" 
            placeholder="* Email" 
            class="custom-input"
            type="email"
          />
        </div>

        <div class="form-item">
          <el-input 
            v-model="formData.phone" 
            placeholder="Phone" 
            class="custom-input"
          />
        </div>

        <div class="form-item">
          <el-input
            v-model="formData.message"
            type="textarea"
            :rows="4"
            placeholder="* Message"
            class="custom-input"
            resize="none"
          />
        </div>

        <div class="form-footer">
          <el-button 
            type="primary" 
            class="submit-btn" 
            :loading="loading" 
            @click="submitToShopify"
          >
            Send
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  productName: {
    type: String,
    default: ''
  }
});

const loading = ref(false);
// 数据结构对齐你的逻辑
const formData = reactive({
  productName: '',
  name: '',
  email: '',
  phone: '',
  message: '', // 原代码叫 body，改为 message 以匹配你的习惯
  city: '',
  country: ''
});

// 当 props 传入产品名时，自动填入
watch(() => props.productName, (newVal) => {
  formData.productName = newVal;
}, { immediate: true });

// === 3. 自动获取 IP 位置 (直接复用你的代码) ===
const fetchLocation = async () => {
  const IPINFO_TOKEN = '925ddc3573a788'; // 🔴 请务必替换为你的 Ipinfo Token

  // 🟢 Ipinfo
  try {
    const response = await fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`)
    if (!response.ok) throw new Error('Ipinfo limit')
    
    const data = await response.json()
    if (data.country && data.city) {
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      formData.country = regionNames.of(data.country);
      formData.city = data.city;
      return;
    }
  } catch (e) {
    console.warn('Primary location API failed, trying backup...')
  }
}

onMounted(() => {
  fetchLocation()
})

// === 4. 提交到 GAS (核心逻辑) ===
const submitToShopify = async () => {
  // 简单校验
  if (!formData.name || !formData.email || !formData.message) {
    ElMessage.warning('Please fill in Name, Email and Message.');
    return;
  }

  loading.value = true;

  try {
    const GAS_URL = window.themeConfig?.contactApiUrl;
    if (!GAS_URL) throw new Error('API URL missing');

    // ★ 关键点：把产品名称拼接到消息里，这样后台就能看到是咨询哪个产品的
    const finalMessage = `[Inquiry: ${formData.productName}] \n${formData.message}`;

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: finalMessage, // 组合后的消息
      city: formData.city || "",
      country: formData.country || "",
      shop_domain: window.Shopify?.shop || 'test-app-english.myshopify.com'
    };

    const response = await fetch(GAS_URL, {
      method: 'POST',
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.result === 'success') {
      ElMessage.success('Inquiry sent successfully!');
      // 清空表单，但保留产品名
      formData.name = '';
      formData.email = '';
      formData.phone = '';
      formData.message = '';
    } else {
      throw new Error(result.error || 'Unknown error');
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('Failed to send. Please try again.');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* === 保持同事原有的样式不变 === */
.inquiry-form-wrapper {
  margin-top: 50px;
  background: #fff;
  border: 1px solid #eee;
}

.form-header {
  background-color: #dcb765;
  color: #fff;
  padding: 15px 20px;
  font-size: 16px;
  font-weight: 700;
  text-transform: capitalize;
}

.form-body {
  padding: 20px;
}

.form-item {
  margin-bottom: 15px;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px #e0e0e0 inset;
  border-radius: 2px;
  padding: 8px 15px;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px #dcb765 inset;
}

:deep(.el-input.is-disabled .el-input__inner), 
:deep(.el-input__inner[readonly]) {
  color: #555;
  background-color: #f9f9f9;
  cursor: not-allowed;
}

.form-footer {
  margin-top: 10px;
}

.submit-btn {
  width: 100%;
  background-color: #dcb765;
  color: #fff;
  border: none;
  padding: 12px 0; /* 稍微调整以适应 el-button */
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  text-transform: capitalize;
  border-radius: 0; /* 保持原有方角风格 */
}

.submit-btn:hover {
  opacity: 0.9;
  background-color: #dcb765; /* 防止 el-button 默认 hover 变色 */
  border-color: #dcb765;
}
</style>