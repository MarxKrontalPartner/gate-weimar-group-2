<template>
  <div :class="['min-h-screen flex items-center justify-center px-4', isDark ? 'bg-gray-900' : 'bg-gray-100']">
    <div :class="['w-full max-w-md shadow-lg rounded-2xl p-8', isDark ? 'bg-gray-800' : 'bg-white']">
      <h1 :class="['text-2xl font-semibold text-center mb-6', isDark ? 'text-white' : '']">{{ $t('signup.title') }}</h1>

      <form @submit.prevent="signup" class="space-y-4">
        <input
          v-model="username"
          type="text"
          :placeholder="$t('signup.username')"
          :class="[
            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none',
            isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
          ]"
        />

        <input
          v-model="password"
          type="password"
          :placeholder="$t('signup.password')"
          :class="[
            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none',
            isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
          ]"
        />

        <input
          v-model="password2"
          type="password"
          :placeholder="$t('signup.confirmPassword')"
          :class="[
            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none',
            isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
          ]"
        />

        <button
          type="submit"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
        >
          {{ $t('signup.button') }}
        </button>
      </form>

      <p v-if="error" class="text-red-500 text-center mt-3 text-sm">
        {{ error }}
      </p>

      <p :class="['text-center mt-4', isDark ? 'text-gray-400' : 'text-gray-600']">
        {{ $t('signup.haveaccount') }}
        <RouterLink to="/login" class="text-indigo-500 hover:underline">{{ $t('signup.login') }}</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useSignup } from '@/composables/useSignup'

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

const { username, password, password2, error, signup } = useSignup()
</script>