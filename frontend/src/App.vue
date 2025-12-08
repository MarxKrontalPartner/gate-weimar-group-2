<script setup lang="ts">
import { ref } from 'vue'
import DefaultAppBar from '@/components/AppBar.vue'
import DefaultNavigationDrawer from '@/components/NavigationDrawer.vue'

const drawer = ref(false)

const toggleDrawer = () => {
  drawer.value = !drawer.value
}
</script>

<template>
  <v-app>
    <!-- TOPBAR -->
    <default-app-bar :drawer="drawer" :toggleDrawer="toggleDrawer" />
    <!-- SIDEBAR -->
    <default-navigation-drawer v-model:drawer="drawer" />

    <router-view />
  </v-app>
</template>

<style scoped></style>
