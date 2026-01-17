<template>
  <div :class="['flex h-screen', isDark ? 'bg-gray-900' : 'bg-gray-50']">
    <!-- MAIN AREA -->
    <div class="flex-1 flex flex-col">
      <!-- PAGE CONTENT -->
      <v-main>
        <div class="p-8">
          <!-- GRID -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <!-- PROJECT CARD -->
            <div
              v-for="project in projects"
              :key="project.id"
              @click="openProject(project.id)"
              :class="[
                'cursor-pointer p-6 rounded-xl shadow-sm border hover:shadow-md transition',
                isDark
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                  : 'bg-white border-gray-100',
              ]"
            >
              <h3 :class="['text-lg font-semibold', isDark ? 'text-white' : '']">
                {{ project.name }}
              </h3>
              <p :class="['text-sm mt-8', isDark ? 'text-gray-400' : 'text-gray-400']">
                {{ $t('dashboard.owner') }}: {{ project.owner.username }}
              </p>
            </div>

            <!-- ADD NEW PROJECT -->
            <div
              @click="showCreate = true"
              :class="[
                'cursor-pointer p-6 rounded-xl shadow-sm border flex flex-col items-center justify-center transition',
                isDark
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                  : 'bg-white border-gray-100 hover:bg-gray-100',
              ]"
            >
              <div class="text-4xl font-light text-indigo-500">+</div>
              <p :class="['mt-2', isDark ? 'text-gray-300' : 'text-gray-600']">
                {{ $t('dashboard.newProject') }}
              </p>
            </div>
          </div>
        </div>
      </v-main>
    </div>
  </div>

  <!-- CREATE PROJECT MODAL -->
  <div v-if="showCreate" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div :class="['p-6 w-full max-w-md rounded-xl shadow-xl', isDark ? 'bg-gray-800' : 'bg-white']">
      <h2 :class="['text-xl font-semibold mb-4', isDark ? 'text-white' : '']">
        {{ $t('dashboard.createProject') }}
      </h2>

      <input
        v-model="newProjectName"
        :placeholder="$t('dashboard.projectNamePlaceholder')"
        :class="[
          'w-full px-4 py-2 border rounded-lg mb-4 focus:ring focus:ring-indigo-300',
          isDark
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
            : 'border-gray-200',
        ]"
      />

      <p v-if="error" class="text-red-500 mb-3">{{ error }}</p>

      <div class="flex justify-end gap-3">
        <button
          @click="closeModal"
          :class="[
            'px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200',
            isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300',
          ]"
        >
          {{ $t('common.cancel') }}
        </button>
        <button
          @click="createProject"
          :disabled="!newProjectName.trim()"
          class="px-4 py-2 rounded-lg text-white transition-all duration-200"
          :class="
            newProjectName.trim()
              ? 'bg-primary hover:bg-blue-600 hover:shadow-md'
              : 'bg-gray-400 cursor-not-allowed'
          "
        >
          {{ $t('dashboard.createButton') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useDashboards } from '@/composables/useDashboards'

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

const { projects, showCreate, newProjectName, error, createProject, closeModal, openProject } =
  useDashboards()
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
