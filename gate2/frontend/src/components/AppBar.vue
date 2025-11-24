<template>
  <!-- App Bar with primary color -->
  <v-app-bar elevation="2">
    <v-btn icon @click="props.toggleDrawer">
      <v-icon>{{ drawer ? 'mdi-chevron-left' : 'mdi-menu' }}</v-icon>
    </v-btn>
    <span width="280px" v-if="theme.global.current.value.dark">
      <v-img :src="logoDark" />
    </span>
    <span width="280px" v-else>
      <v-img :src="logoLight" />
    </span>

    <!-- Spacer -->
    <v-spacer />

    <!-- Toggle button to switch themes -->
    <v-btn icon @click="toggleTheme">
      <v-icon> mdi-theme-light-dark</v-icon>
    </v-btn>
    <v-btn icon @click="router.push('/dashboard')">
      <v-icon> mdi-home-outline</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon> mdi-account-circle-outline</v-icon>
      <v-menu activator="parent">
        <v-list density="compact" :items="accountMenuItems" @click="logout"></v-list>
      </v-menu>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useTheme } from 'vuetify'
import { useRouter } from "vue-router"
import logoLight from '@/assets/MKP_Logo_Webseite.svg'
import logoDark from '@/assets/MKP_Logo_Webseite_inverted.svg'

const props = defineProps({
  drawer: Boolean,
  toggleDrawer: Function
})

const theme = useTheme()
const router = useRouter()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const accountMenuItems = [
  {
    title: 'Abmelden',
    value: 'logout',
    props: {
      prependIcon: 'mdi-logout'
    }
  },
]

const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("username")
  router.push("/login")
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
</style>
