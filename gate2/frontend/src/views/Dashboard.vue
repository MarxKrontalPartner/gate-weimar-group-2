<template>
  <div>
    <div style="position: absolute; right: 20px; top: 20px;">
      {{ username }}
      <button
        @click="logout"
        style="margin-left: 10px; padding: 4px 10px; cursor: pointer;"
      >
        Logout
      </button>
    </div>

    <h1>Welcome!</h1>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref<string | null>(localStorage.getItem('username'))

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')

  router.push('/login')
}
</script>
