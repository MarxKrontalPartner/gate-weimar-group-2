<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
      <h1 class="text-2xl font-semibold text-center mb-6">{{ $t('signup.title')}}</h1>

      <form @submit.prevent="signup" class="space-y-4">
        <input
          v-model="username"
          type="text"
          :placeholder="$t('signup.username')"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <input
          v-model="password"
          type="password"
          :placeholder="$t('signup.password')"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <input
          v-model="password2"
          type="password"
          :placeholder="$t('signup.confirmPassword')"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <button
          type="submit"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
        >
          {{ $t('signup.button')}}
        </button>
      </form>

      <p v-if="error" class="text-red-600 text-center mt-3 text-sm">
        {{ error }}
      </p>

      <p class="text-center mt-4 text-gray-600">
        {{ $t('signup.haveaccount')}}
        <RouterLink to="/login" class="text-indigo-600 hover:underline">{{ $t('signup.login')}}</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSignup } from '@/composables/useSignup'
import { useI18n } from 'vue-i18n'

const { username, password, password2, error, signup } = useSignup()
</script>
