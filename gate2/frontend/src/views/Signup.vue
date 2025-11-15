<template>
  <div>
    <h2>Sign Up</h2>

    <form @submit.prevent="signup">
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <input v-model="password2" type="password" placeholder="Retype Password" />
      <button type="submit">Create Account</button>
    </form>

    <p>{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const password = ref('')
const password2 = ref('')
const error = ref('')

const signup = async () => {
  try {
    await axios.post('http://127.0.0.1:8000/api/signup/', {
      username: username.value,
      password: password.value,
      password2: password2.value
    })
    router.push('/login')
  } catch (err: any) {
    error.value = err.response?.data || 'Signup failed'
  }
}
</script>
