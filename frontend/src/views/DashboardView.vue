<template>
  <!-- LIGHT ONLY -->
  <div class="flex h-screen bg-gray-50">
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
              class="cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <h3 class="text-lg font-semibold">{{ project.name }}</h3>
              <p class="text-sm text-gray-400 mt-8">Owner: {{ project.owner.username }}</p>
            </div>

            <!-- ADD NEW PROJECT -->
            <div
              @click="showCreate = true"
              class="cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:bg-gray-100 transition"
            >
              <div class="text-4xl font-light text-indigo-600">+</div>
              <p class="mt-2 text-gray-600">New Project</p>
            </div>
          </div>
        </div>
      </v-main>
    </div>
  </div>

  <!-- CREATE PROJECT MODAL -->
  <div v-if="showCreate" class="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
    <div class="bg-white p-6 w-full max-w-md rounded-xl shadow-xl">
      <h2 class="text-xl font-semibold mb-4">Create Project</h2>

      <input
        v-model="newProjectName"
        placeholder="Project name"
        class="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4 focus:ring focus:ring-indigo-300"
      />

      <p v-if="error" class="text-red-600 mb-3">{{ error }}</p>

      <div class="flex justify-end gap-3">
        <button @click="closeModal" class="px-4 py-2 rounded-lg bg-gray-200">Cancel</button>
        <button @click="createProject" class="px-4 py-2 rounded-lg bg-primary text-white">
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboards } from '@/composables/useDashboards'

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
