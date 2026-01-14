<template>
  <div class="contact-form-wrapper" :style="wrapperStyle">
    <div class="form-header" :style="{ backgroundColor: themeColor }">
      <h3>{{ title }}</h3>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>

    <el-form 
      ref="formRef" 
      :model="formData" 
      :rules="rules" 
      class="custom-form"
      size="large"
      label-position="top"
    >
      <el-row :gutter="30">
        <el-col :span="12" :xs="24">
          <el-form-item prop="name">
            <el-input v-model="formData.name" placeholder="* Name" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item prop="phone">
            <el-input v-model="formData.phone" placeholder="Phone" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item prop="email">
            <el-input v-model="formData.email" placeholder="* Email" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item prop="message">
        <el-input 
          v-model="formData.message" 
          type="textarea" 
          :rows="6" 
          placeholder="* Message" 
          resize="none"
        />
      </el-form-item>

      <div class="form-footer">
        <el-button 
          type="primary" 
          class="submit-btn" 
          :loading="loading" 
          @click="submitToShopify"
          :style="{ backgroundColor: themeColor, borderColor: themeColor }"
        >
          SEND
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'

// === 1. Props 定义 ===
const props = defineProps({
  title: { type: String, default: 'Leave Your Message' },
  subtitle: { type: String, default: '' }, 
  themeColor: { type: String, default: '#333333' }
})

// === 2. 计算 CSS 变量 ===
const wrapperStyle = computed(() => {
  return {
    '--theme-color': props.themeColor
  }
})

// === 数据定义 ===
const loading = ref(false)
const formRef = ref(null)
const formData = reactive({ name: '', email: '', phone: '', message: '', city: '', country: '' })

// === 校验规则 ===
const rules = {
  name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' }, 
    { type: 'email', message: 'Invalid email format', trigger: 'blur' }
  ],
  message: [{ required: true, message: 'Message is required', trigger: 'blur' }]
}

// === IP 定位逻辑 (已升级为 Ipinfo + DB-IP) ===
const fetchLocation = async () => {
  const IPINFO_TOKEN = '925ddc3573a788'; // 🔴 请务必替换为你的 Ipinfo Token

  // 🟢 策略 1: Ipinfo (精准，带城市)
  try {
    const response = await fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`)
    if (!response.ok) throw new Error('Ipinfo limit')
    
    const data = await response.json()
    if (data.country && data.city) {
      // 转换国家代码 (如 CN -> China)
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      formData.country = regionNames.of(data.country);
      formData.city = data.city;
      return; // 成功则退出
    }
  } catch (e) {
    console.warn('Primary location API failed, trying backup...')
  }
}

// === 提交逻辑 ===
const submitToShopify = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const GAS_URL = window.themeConfig?.contactApiUrl;
        if (!GAS_URL) throw new Error('API URL is missing!')

        const payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          city: formData.city || "", // 确保为空时传空字符串
          country: formData.country || "",
          shop_domain: window.Shopify?.shop || 'your-shop.myshopify.com'
        }

        const response = await fetch(GAS_URL, {
          method: 'POST',
          body: JSON.stringify(payload)
        })

        const result = await response.json()

        if (result.result === 'success') {
          ElMessage.success('Message sent successfully!')
          formRef.value.resetFields() 
        } else {
          throw new Error('Script error')
        }

      } catch (error) {
        console.error('GAS Error:', error)
        ElMessage.error('Failed to send.')
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(() => {
  fetchLocation()
})
</script>

<style scoped>
.contact-form-wrapper {
  max-width: 1000px;
  margin: 50px auto;
  border: 1px solid #eee;
  padding: 0;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.form-header {
  text-align: left;
  padding: 20px 30px;
  color: #fff; 
}

.form-header h3 {
  font-size: 20px;
  margin: 0 0 5px 0;
  text-transform: capitalize;
  font-weight: 500;
}

.form-header p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  margin: 0;
}

.custom-form {
  padding: 30px 40px; 
}

.submit-btn {
  width: 100%;
  height: 45px;
  font-size: 16px;
  letter-spacing: 1px;
  border-radius: 2px;
  border: none;
  transition: opacity 0.3s;
}

.submit-btn:hover {
  opacity: 0.9;
}

/* === 样式变量逻辑 === */
:deep(.el-input__wrapper), 
:deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px #ddd inset;
  border-radius: 0;
  border-left: 3px solid var(--theme-color) !important; 
  padding-left: 12px;
}

:deep(.el-input__wrapper.is-focus), 
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px var(--theme-color) inset !important;
}
</style>