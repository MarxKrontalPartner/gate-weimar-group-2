<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-5xl mx-auto">
      <!-- Page Title -->
      <header class="mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">
          {{ $t('settings.title') }}
        </h1>
      </header>

      <div class="flex flex-wrap gap-3 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="px-4 py-2 rounded-lg text-sm border"
          :class="activeTab === tab.key
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300'"
        >
          {{ $t(`settings.tabs.${tab.key}`) }}
        </button>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-lg shadow p-6">
        <!-- General -->
        <section v-if="activeTab === 'general'" class="space-y-5">
          <h2 class="text-lg font-medium text-gray-800">
            {{ $t('settings.general.title') }}
          </h2>

          <div>
            <label class="block text-sm text-gray-600 mb-1">
              {{ $t('settings.general.language') }}
            </label>
            <select v-model="selectedLanguage" class="input" @change="changeLanguage">
              <option value="en">{{ $t('settings.languages.english') }}</option>
              <option value="de">{{ $t('settings.languages.german') }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">
              {{ $t('settings.general.theme') }}
            </label>
            <select v-model="settings.general.theme" class="input">
              <option value="light">{{ $t('settings.themes.light') }}</option>
              <option value="dark">{{ $t('settings.themes.dark') }}</option>
            </select>
          </div>
        </section>

        <!-- Users -->
        <section v-else-if="activeTab === 'users'">
          <h2 class="text-lg font-medium text-gray-800">
            {{ $t('settings.users.title') }}
          </h2>
          <p class="text-sm text-gray-500 mt-2">
            {{ $t('settings.users.description') }}
          </p>
        </section>

        <!-- Security -->
        <section v-else-if="activeTab === 'security'">
          <h2 class="text-lg font-medium text-gray-800">
            {{ $t('settings.security.title') }}
          </h2>
          <p class="text-sm text-gray-500 mt-2">
            {{ $t('settings.security.description') }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'

const { locale, t } = useI18n()
const selectedLanguage = ref('en')

// Load saved language
onMounted(() => {
  const saved = localStorage.getItem('app_language') || 'en'
  selectedLanguage.value = saved
  locale.value = saved
})

const changeLanguage = () => {
  locale.value = selectedLanguage.value
  localStorage.setItem('app_language', selectedLanguage.value)
}

// Define tabs with translation keys
const tabs = [
  { key: 'general' },
  { key: 'users' },
  { key: 'security' }
]

const activeTab = ref('general')

const settings = reactive({
  general: {
    language: 'en',
    theme: 'light'
  }
})

const saveGeneral = () => {
  localStorage.setItem('app_language', selectedLanguage.value)
  localStorage.setItem('app_theme', settings.general.theme)
  
  alert(t('settings.buttons.save') + ' successful!')  
  
  console.log('General settings saved', settings.general)
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
}

.btn-primary {
  background: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}

.btn-primary:hover {
  background: #1d4ed8;
}
</style>s