<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Login</h2>

      <form @submit.prevent="login">
        <input v-model="username" placeholder="Username" />
        <input v-model="password" type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>

      <p class="error-message" v-if="error">{{ error }}</p>

      <div class="link">
        <p>Don't have an account? <a @click="goSignup">Sign up</a></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')

const login = async () => {
  try {
    const res = await axios.post('http://127.0.0.1:8000/api/login/', {
      username: username.value,
      password: password.value
    })

    localStorage.setItem('token', res.data.access)
    localStorage.setItem('username', username.value)

    router.push('/dashboard')
  } catch {
    error.value = 'Invalid credentials'
  }
}

const goSignup = () => {
  router.push('/signup')
}
</script>

<style src="../styles/login.css"></style>
