<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
      <h1 class="text-2xl font-semibold text-center mb-6">Login</h1>

      <div class="space-y-4">
        <input v-model="username" type="text" placeholder="Username"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
        <input v-model="password" type="password" placeholder="Password"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />

        <button @click="login" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition">
          Login
        </button>
      </div>

      <p class="text-center mt-4 text-gray-600">
        Don't have an account?
        <RouterLink to="/signup" class="text-indigo-600 hover:underline">Sign up</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"

const router = useRouter()
const username = ref("")
const password = ref("")

const login = async () => {
  try {
    const res = await axios.post("http://127.0.0.1:8000/api/login/", {
      username: username.value,
      password: password.value,
    })

    localStorage.setItem("token", res.data.access)
    localStorage.setItem("username", username.value)

    router.push("/dashboard")
  } catch {
    alert("Invalid credentials")
  }
}
</script>
