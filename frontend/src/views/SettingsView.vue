<template>
  <div class="flex h-screen bg-gray-50">
    <div class="flex-1 flex flex-col">
      <v-main>
        <div class="p-8 h-full flex flex-col gap-6">
          <!-- Page Title -->
          <div>
            <h1 class="text-2xl font-semibold">{{ $t('settings.title') }}</h1>
            <p class="text-sm text-gray-600 mt-1">
              {{ $t('settings.description') || 'Configure your application preferences' }}
            </p>
          </div>

          <!-- Content -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-3xl">
            <!-- General Settings -->
            <section class="space-y-5">
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
          </div>
        </div>
      </v-main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'

const { locale } = useI18n()
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

const settings = reactive({
  general: {
    language: 'en',
    theme: 'light'
  }
})


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
</style>
