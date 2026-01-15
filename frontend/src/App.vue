<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import DefaultAppBar from '@/components/AppBar.vue'
import DefaultNavigationDrawer from '@/components/NavigationDrawer.vue'

const route = useRoute()
const drawer = ref(false)

// Reactive token state - updates when route changes (after login redirect)
const token = ref(localStorage.getItem('token'))

// Re-check token whenever route changes (triggered after login)
watch(
  () => route.path,
  () => {
    token.value = localStorage.getItem('token')
  },
  { immediate: true },
)

// Check if user is authenticated
const isAuthenticated = computed(() => !!token.value)

// Hide sidebar on login/signup pages or when not authenticated
const showSidebar = computed(() => {
  const publicRoutes = ['/login', '/signup', '/']
  return isAuthenticated.value && !publicRoutes.includes(route.path)
})

// Close drawer when navigating to public routes
watch(showSidebar, (canShow) => {
  if (!canShow) {
    drawer.value = false
  }
})

const toggleDrawer = () => {
  if (showSidebar.value) {
    drawer.value = !drawer.value
  }
}
</script>

<template>
  <v-app>
    <!-- TOPBAR -->
    <default-app-bar :drawer="drawer" :toggleDrawer="toggleDrawer" :showMenuButton="showSidebar" />
    <!-- SIDEBAR (only show when authenticated and not on public routes) -->
    <default-navigation-drawer v-if="showSidebar" v-model:drawer="drawer" />

    <router-view />
  </v-app>
</template>

<style scoped></style>
