<template>
  <div class="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
    <div class="max-w-md mx-auto">
      <header class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">
          {{ $t('settings.title') }}
        </h1>
      </header>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <section class="space-y-6">
          <h2 class="text-lg font-medium text-gray-800 dark:text-white">
            {{ $t('settings.general.title') }}
          </h2>

          <!-- Language -->
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              {{ $t('settings.general.language') }}
            </label>
            <select
              v-model="selectedLanguage"
              @change="changeLanguage"
              class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700
                     text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            >
              <option value="en">{{ $t('settings.languages.english') }}</option>
              <option value="de">{{ $t('settings.languages.german') }}</option>
            </select>
          </div>

          <!-- Theme -->
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              {{ $t('settings.general.theme') }}
            </label>
            <select
              v-model="theme"
              @change="applyTheme(theme)"
              class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700
                     text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            >
              <option value="light">{{ $t('settings.themes.light') }}</option>
              <option value="dark">{{ $t('settings.themes.dark') }}</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'

/* -------------------------
   Language
-------------------------- */
const { locale, t } = useI18n()
const selectedLanguage = ref('en')

const changeLanguage = () => {
  locale.value = selectedLanguage.value
  localStorage.setItem('app_language', selectedLanguage.value)
}

/* -------------------------
   Theme (Vuetify + Tailwind)
-------------------------- */
const theme = ref<'light' | 'dark'>('light')
const vuetifyTheme = useTheme()

const applyTheme = (value: 'light' | 'dark') => {
  console.log('Applying theme:', value)
  
  // 1. TAILWIND DARK MODE (CORRECTED)
  // Add/remove 'dark' class from <html> tag, not <body>
  const html = document.documentElement
  if (value === 'dark') {
    html.classList.add('dark')
    console.log('Added dark class to <html>')
  } else {
    html.classList.remove('dark')
    console.log('Removed dark class from <html>')
  }
  
  // 2. VUETIFY THEME
  vuetifyTheme.global.name.value = value === 'dark' ? 'mkpDarkTheme' : 'mkpLightTheme'
  console.log('Vuetify theme set to:', vuetifyTheme.global.name.value)
  
  // 3. PERSIST TO LOCALSTORAGE
  localStorage.setItem('theme', value)
  console.log('Saved theme to localStorage:', value)
  
  // 4. DEBUG: Check if it worked
  setTimeout(() => {
    console.log('DEBUG:', {
      htmlHasDarkClass: html.classList.contains('dark'),
      localStorageTheme: localStorage.getItem('theme'),
      vuetifyTheme: vuetifyTheme.global.name.value,
      bodyClass: document.body.className
    })
  }, 100)
}

// Watch for theme changes
watch(theme, (newTheme) => {
  applyTheme(newTheme)
})

/* -------------------------
   Init
-------------------------- */
onMounted(() => {
  console.log('SettingsView mounted')
  
  // Language
  const savedLang = localStorage.getItem('app_language') || 'en'
  selectedLanguage.value = savedLang
  locale.value = savedLang
  console.log('Language set to:', savedLang)

  // Theme
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
  theme.value = savedTheme ?? 'light'
  console.log('Initial theme:', theme.value)
  
  // Apply theme immediately
  applyTheme(theme.value)
})
</script>