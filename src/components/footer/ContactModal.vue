<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    :width="isMobile ? '90%' : '500px'" 
    class="custom-contact-modal"
    :show-close="false"
    :close-on-click-modal="false"
    append-to-body
    align-center
  >
    <div class="custom-close-btn" @click="$emit('update:visible', false)">
      <el-icon><CloseBold /></el-icon>
    </div>

    <div class="modal-content-wrapper">
      
      <div class="modal-header-strip">
        Leave Your Message
      </div>

      <el-form 
        ref="formRef" 
        :model="formData" 
        :rules="rules" 
        class="custom-form"
        size="large"
      >
        <el-form-item prop="name" class="styled-form-item">
          <el-input v-model="formData.name" placeholder="* Name" />
        </el-form-item>

        <el-form-item prop="email" class="styled-form-item">
          <el-input v-model="formData.email" placeholder="* Email" />
        </el-form-item>

        <el-form-item prop="phone" class="styled-form-item">
          <el-input v-model="formData.phone" placeholder="Phone" />
        </el-form-item>

        <el-form-item prop="message" class="styled-form-item">
          <el-input 
            v-model="formData.message" 
            type="textarea" 
            :rows="isMobile ? 4 : 5" 
            placeholder="* Message"
            resize="none" 
          />
        </el-form-item>

        <el-form-item style="margin-bottom: 0;">
          <el-button type="primary" class="submit-btn" :loading="loading" @click="submitToShopify">
            Send
          </el-button>
        </el-form-item>
      </el-form>

    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { CloseBold } from '@element-plus/icons-vue'

defineProps({ visible: Boolean })
const emit = defineEmits(['update:visible'])

const loading = ref(false)
const formRef = ref(null)
// 初始化数据
const formData = reactive({ name: '', email: '', phone: '', message: '', city: '' , country: ''})

// === 修改后的位置获取逻辑 ===
const fetchLocation = async () => {
  // 🟢 策略 1 (首选): Ipinfo.io
  // 优势：每月5万次免费，Token隔离，不受VPN共享IP影响，含城市信息
  const IPINFO_TOKEN = '925ddc3573a788'; // 🔴 请替换为你的 Token

  try {
    const response = await fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`)
    
    if (!response.ok) throw new Error('Ipinfo limit or error')
    
    const data = await response.json()
    
    if (data.country && data.city) {
      // ipinfo 返回的国家是简写 (如 CN, US)，需要转全称
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      formData.country = regionNames.of(data.country); 
      formData.city = data.city;
      
      console.log(`📍 Location (Ipinfo): ${formData.city}, ${formData.country}`)
      return; // 成功拿到，直接结束
    }
  } catch (e) {
    console.warn('Primary API (Ipinfo) failed, switching to backup...', e)
  }
}

// 组件挂载时获取位置
onMounted(() => {
  fetchLocation()
})

// 校验规则
const rules = {
  name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' }, 
    { type: 'email', message: 'Invalid email format', trigger: 'blur' }
  ],
  message: [{ required: true, message: 'Message is required', trigger: 'blur' }]
}

const submitToShopify = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const GAS_URL = window.themeConfig?.contactApiUrl;
        if (!GAS_URL) {
          throw new Error('API URL is missing! Please check Theme Settings.')
        }

        const payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          
          // 使用 formData 的值 (如果没有获取到，则为空字符串)
          city: formData.city || "", 
          country: formData.country || "",
          
          shop_domain: window.Shopify?.shop || 'test-app-english.myshopify.com'
        }

        // === 发送请求 (针对 GAS 优化) ===
        const response = await fetch(GAS_URL, {
          method: 'POST',
          redirect: "follow", 
          headers: {
            "Content-Type": "text/plain;charset=utf-8", 
          },
          body: JSON.stringify(payload)
        })

        const result = await response.json()

        if (result.result === 'success') {
          ElMessage.success('Message sent successfully!')
          emit('update:visible', false)
          formRef.value.resetFields()
        } else {
          throw new Error(result.error || 'Unknown script error')
        }

      } catch (error) {
        console.error('Submission Failed:', error)
        ElMessage.error('Failed: ' + error.message)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.modal-content-wrapper {
  padding: 0 10px 10px; 
}

.modal-header-strip {
  background-color: #d4af37;
  color: #fff;
  font-size: 18px;
  padding: 15px 20px;
  margin-bottom: 25px;
  font-weight: 500;
  border-radius: 2px;
}

.styled-form-item { margin-bottom: 20px; }

/* 左侧金边样式 */
:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  padding-left: 15px;
  border-radius: 2px;
  border-left: 3px solid #d4af37 !important; 
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px #d4af37 inset !important;
}

:deep(input::placeholder),
:deep(textarea::placeholder) {
  color: #999;
  font-size: 14px;
}

.submit-btn {
  width: 100%;
  background-color: #d4af37;
  border-color: #d4af37;
  height: 42px;
  font-size: 16px;
  border-radius: 2px;
  transition: opacity 0.3s;
}
.submit-btn:hover {
  background-color: #d4af37;
  border-color: #d4af37;
  opacity: 0.9;
}

/* === 关闭按钮 (PC默认) === */
.custom-close-btn {
  position: absolute;
  top: -15px;
  right: -15px;
  width: 30px;
  height: 30px;
  background-color: #000;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 9999;
  border: 2px solid #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  transition: transform 0.2s;
}
.custom-close-btn:hover { transform: scale(1.1);
}

/* === 2. 手机端样式优化 === */
@media (max-width: 768px) {
  .modal-header-strip {
    font-size: 16px;
    padding: 12px 15px;    
    margin-bottom: 20px;
  }
  
  .modal-content-wrapper {
    padding: 0;
  }

  .custom-close-btn {
    width: 26px;
    height: 26px;
    top: -12px;
    right: -10px; 
    font-size: 14px;
    border-width: 1.5px;
  }
}
</style>

<style>
/* 全局覆盖样式 */
.custom-contact-modal .el-dialog {
  border-radius: 4px;
  padding: 20px;
  overflow: visible;
  box-shadow: 0 15px 30px rgba(0,0,0,0.2) !important;
  max-width: 95vw;
}

@media (max-width: 768px) {
  .custom-contact-modal .el-dialog {
    padding: 15px !important;
    margin-top: 15vh !important; 
  }
}

.custom-contact-modal .el-dialog__header { display: none;
}
.custom-contact-modal .el-dialog__body { padding: 0 !important; }
</style>