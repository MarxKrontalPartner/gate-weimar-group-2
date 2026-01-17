<template>
  <!-- App Bar with primary color -->
  <v-app-bar elevation="2">
    <!-- Only show menu button when sidebar is available -->
    <v-btn v-if="showMenuButton" icon @click="props.toggleDrawer" color="background">
      <v-icon class="text-primary">{{ drawer ? 'mdi-chevron-left' : 'mdi-menu' }}</v-icon>
    </v-btn>

    <!-- LOGO (dark or light) -->
    <span width="280px" v-if="theme.global.current.value.dark">
      <v-img :src="logoDark" />
    </span>
    <span width="280px" v-else>
      <v-img :src="logoLight" />
    </span>

    <!-- Spacer pushes icons to the right -->
    <v-spacer />

    <!-- HOME BUTTON (only show when authenticated) -->
    <v-btn v-if="showMenuButton" icon @click="router.push('/dashboard')" color="background">
      <v-icon class="text-primary">mdi-home-outline</v-icon>
    </v-btn>

    <!-- LANGUAGE SWITCHER (always visible) -->
    <v-btn icon color="background">
      <v-icon class="text-primary">mdi-translate</v-icon>
      <v-menu activator="parent">
        <v-list density="compact">
          <v-list-item
            v-for="lang in languages"
            :key="lang.code"
            :value="lang.code"
            :class="{ 'bg-blue-50': currentLanguage === lang.code }"
            @click="changeLanguage(lang.code)"
          >
            <v-list-item-title class="flex items-center gap-2">
              <span>{{ lang.flag }}</span>
              <span>{{ lang.name }}</span>
              <v-icon
                v-if="currentLanguage === lang.code"
                size="small"
                class="ml-auto text-blue-600"
                >mdi-check</v-icon
              >
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>

    <!-- THEME TOGGLE (always visible) -->
    <v-btn icon color="background" @click="toggleTheme">
      <v-icon class="text-primary">{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
    </v-btn>

    <!-- ACCOUNT MENU (only show when authenticated) -->
    <v-btn v-if="showMenuButton" icon color="background">
      <v-icon class="text-primary">mdi-account-circle-outline</v-icon>
      <v-menu activator="parent">
        <v-list density="compact" :items="accountMenuItems($t)" @click="logout" />
      </v-menu>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import logoLight from '@/assets/MKP_Logo_Webseite.svg'
import logoDark from '@/assets/MKP_Logo_Webseite_inverted.svg'

const props = defineProps({
  drawer: Boolean,
  toggleDrawer: Function,
  showMenuButton: {
    type: Boolean,
    default: true,
  },
})

const theme = useTheme()
const router = useRouter()
const { locale } = useI18n()

// Language options
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
]

const currentLanguage = ref('en')
const isDark = ref(false)

onMounted(() => {
  currentLanguage.value = localStorage.getItem('app_language') || 'en'

  // Load saved theme
  const savedTheme = localStorage.getItem('app_theme') || 'light'
  isDark.value = savedTheme === 'dark'
})

const changeLanguage = (code: string) => {
  currentLanguage.value = code
  locale.value = code
  localStorage.setItem('app_language', code)
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  const newTheme = isDark.value ? 'dark' : 'light'
  theme.global.name.value = isDark.value ? 'mkpDarkTheme' : 'mkpLightTheme'
  localStorage.setItem('app_theme', newTheme)
}

const accountMenuItems = (t: (key: string) => string) => [
  {
    title: t('appBar.accountMenu.logout'),
    value: 'logout',
    props: {
      prependIcon: 'mdi-logout',
    },
  },
]

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.v-img {
  height: 30px !important;
  width: 250px !important;
  min-width: 250px !important;
}

.v-icon {
  min-height: 50px;
  min-width: 50px;
}

/* Button Hover Effects */
.v-btn:hover {
  background-color: rgba(var(--v-theme-primary), 0.15) !important;
}

/* Smooth Transition for Hover */
.v-btn {
  transition: background-color 0.2s ease !important;
}
</style>
