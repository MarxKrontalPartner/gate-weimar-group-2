<template>
  <div :class="['flex h-screen', isDark ? 'bg-gray-900' : 'bg-gray-50']">
    <div class="flex-1 flex flex-col">
      <v-main>
        <div class="p-8 h-full flex flex-col gap-6">
          <!-- Page Title -->
          <div>
            <h1 :class="['text-2xl font-semibold', isDark ? 'text-white' : '']">
              {{ $t('settings.title') }}
            </h1>
            <p :class="['text-sm mt-1', isDark ? 'text-gray-400' : 'text-gray-600']">
              {{ $t('settings.description') || 'Configure your application preferences' }}
            </p>
          </div>

          <!-- Content -->
          <div
            :class="[
              'border rounded-lg shadow-sm p-6 max-w-3xl',
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
            ]"
          >
            <!-- General Settings -->
            <section class="space-y-5">
              <h2 :class="['text-lg font-medium', isDark ? 'text-white' : 'text-gray-800']">
                {{ $t('settings.general.title') }}
              </h2>

              <div>
                <label :class="['block text-sm mb-1', isDark ? 'text-gray-400' : 'text-gray-600']">
                  {{ $t('settings.general.language') }}
                </label>
                <select
                  v-model="selectedLanguage"
                  :class="['input', isDark ? 'input-dark' : '']"
                  @change="changeLanguage"
                >
                  <option value="en">{{ $t('settings.languages.english') }}</option>
                  <option value="de">{{ $t('settings.languages.german') }}</option>
                </select>
              </div>

              <div>
                <label :class="['block text-sm mb-1', isDark ? 'text-gray-400' : 'text-gray-600']">
                  {{ $t('settings.general.theme') }}
                </label>
                <select
                  v-model="selectedTheme"
                  :class="['input', isDark ? 'input-dark' : '']"
                  @change="changeTheme"
                >
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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'
import { onMounted } from 'vue'

const { locale } = useI18n()
const theme = useTheme()

const selectedLanguage = ref('en')
const selectedTheme = ref('light')

// Computed property for dark mode styling
const isDark = computed(() => theme.global.current.value.dark)

// Load saved preferences
onMounted(() => {
  // Load language
  const savedLanguage = localStorage.getItem('app_language') || 'en'
  selectedLanguage.value = savedLanguage
  locale.value = savedLanguage

  // Load theme
  const savedTheme = localStorage.getItem('app_theme') || 'light'
  selectedTheme.value = savedTheme
  theme.global.name.value = savedTheme === 'dark' ? 'mkpDarkTheme' : 'mkpLightTheme'
})

const changeLanguage = () => {
  locale.value = selectedLanguage.value
  localStorage.setItem('app_language', selectedLanguage.value)
}

const changeTheme = () => {
  const themeName = selectedTheme.value === 'dark' ? 'mkpDarkTheme' : 'mkpLightTheme'
  theme.global.name.value = themeName
  localStorage.setItem('app_theme', selectedTheme.value)
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: white;
  color: #1f2937;
}

.input-dark {
  background-color: #374151;
  border-color: #4b5563;
  color: white;
}

.input-dark option {
  background-color: #374151;
  color: white;
}
</style>
