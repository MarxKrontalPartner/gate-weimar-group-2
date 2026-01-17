<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
      <h1 class="text-2xl font-semibold text-center mb-6">{{$t('login.title')}}</h1>

      <div class="space-y-4">
        <input
          v-model="username"
          type="text"
          :placeholder="$t('login.username')"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <input
          v-model="password"
          type="password"
          :placeholder="$t('login.password')"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <button
          @click="login"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
        >
          {{ $t('login.button') }}
        </button>
      </div>

      <p class="text-center mt-4 text-gray-600">
        {{ $t('login.noaccount') }}
        <RouterLink to="/signup" class="text-indigo-600 hover:underline">{{ $t('login.signup')}}</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogin } from '@/composables/useLogin'
import { useI18n } from 'vue-i18n'

const { username, password, login } = useLogin()
</script>
