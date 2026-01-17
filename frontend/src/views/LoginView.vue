<template>
  <div :class="['min-h-screen flex items-center justify-center px-4', isDark ? 'bg-gray-900' : 'bg-gray-100']">
    <div :class="['w-full max-w-md shadow-lg rounded-2xl p-8', isDark ? 'bg-gray-800' : 'bg-white']">
      <h1 :class="['text-2xl font-semibold text-center mb-6', isDark ? 'text-white' : '']">{{ $t('login.title') }}</h1>

      <div class="space-y-4">
        <input
          v-model="username"
          type="text"
          :placeholder="$t('login.username')"
          :class="[
            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none',
            isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
          ]"
        />
        <input
          v-model="password"
          type="password"
          :placeholder="$t('login.password')"
          :class="[
            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none',
            isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
          ]"
        />

        <button
          @click="login"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
        >
          {{ $t('login.button') }}
        </button>
      </div>

      <p :class="['text-center mt-4', isDark ? 'text-gray-400' : 'text-gray-600']">
        {{ $t('login.noaccount') }}
        <RouterLink to="/signup" class="text-indigo-500 hover:underline">{{ $t('login.signup') }}</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useLogin } from '@/composables/useLogin'

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

const { username, password, login } = useLogin()
</script>

