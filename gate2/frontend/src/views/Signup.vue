<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
      
      <h1 class="text-2xl font-semibold text-center mb-6">Sign Up</h1>

      <form @submit.prevent="signup" class="space-y-4">
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg 
                 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg 
                 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <input
          v-model="password2"
          type="password"
          placeholder="Confirm Password"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg 
                 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <button
          type="submit"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
        >
          Create Account
        </button>
      </form>

      <p v-if="error" class="text-red-600 text-center mt-3 text-sm">
        {{ error }}
      </p>

      <p class="text-center mt-4 text-gray-600">
        Already have an account?
        <RouterLink to="/login" class="text-indigo-600 hover:underline">Login</RouterLink>
      </p>
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