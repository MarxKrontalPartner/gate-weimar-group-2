<template>
  <!-- DARK -->
  <div v-if="theme.global.current.value.dark" class="flex h-screen bg-background">

    <!-- MAIN AREA -->
    <div class="flex-1 flex flex-col">


      <!-- PAGE CONTENT -->
      <v-main>
        <div class="p-8">

          <!-- GRID -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            <!-- PROJECT CARD -->
            <div v-for="project in projects" :key="project.id" @click="openProject(project.id)"
              class="cursor-pointer bg-surface p-6 rounded-xl shadow-sm border border-mkpDarkGrey hover:shadow-md transition">
              <h3 class="text-lg font-semibold">{{ project.name }}</h3>
              <p class="text-sm text-white mt-8">Owner: {{ project.owner.username }}</p>
            </div>

            <!-- ADD NEW PROJECT -->
            <div @click="showCreate = true" class="cursor-pointer bg-surface p-6 rounded-xl shadow-sm border border-mkpDarkGrey
                     flex flex-col items-center justify-center transition">
              <div class="text-4xl font-light text-white">+</div>
              <p class="mt-2 text-gray-600">New Project</p>
            </div>

          </div>

        </div>
      </v-main>

    </div>

  </div>
  <!-- LIGHT -->
  <div v-else class="flex h-screen bg-gray-50">

    <!-- MAIN AREA -->
    <div class="flex-1 flex flex-col">


      <!-- PAGE CONTENT -->
      <v-main>
        <div class="p-8">

          <!-- GRID -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            <!-- PROJECT CARD -->
            <div v-for="project in projects" :key="project.id" @click="openProject(project.id)"
              class="cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <h3 class="text-lg font-semibold">{{ project.name }}</h3>
              <p class="text-sm text-gray-400 mt-8">Owner: {{ project.owner.username }}</p>
            </div>

            <!-- ADD NEW PROJECT -->
            <div @click="showCreate = true" class="cursor-pointer bg-white p-6 rounded-xl shadow-sm border-gray-100
                     flex flex-col items-center justify-center hover:bg-gray-100 transition">
              <div class="text-4xl font-light text-indigo-600">+</div>
              <p class="mt-2 text-gray-600">New Project</p>
            </div>

          </div>

        </div>
      </v-main>

    </div>

  </div>

  <!-- MODAL -->
  <div v-if="showCreate" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <!-- DARK -->
    <div v-if="theme.global.current.value.dark" class="bg-surface p-6 w-full max-w-md rounded-xl shadow-xl">

      <h2 class="text-xl text-white font-semibold mb-4">Create Project</h2>

      <input v-model="newProjectName" placeholder="Project name"
        class="w-full px-4 py-2 border border-mkpDarkGrey bg-background text-white rounded-lg mb-4 focus:ring focus:ring-primary" />

      <p v-if="error" class="text-error mb-3">{{ error }}</p>

      <div class="flex justify-end gap-3">
        <button @click="closeModal" class="px-4 py-2 rounded-lg bg-mkpDarkGrey text-white">
          Cancel
        </button>
        <button @click="createProject" class="px-4 py-2 rounded-lg bg-primary text-white">
          Create
        </button>
      </div>

    </div>

    <!-- LIGHT -->
    <div v-else class="bg-white p-6 w-full max-w-md rounded-xl shadow-xl">

      <h2 class="text-xl font-semibold mb-4">Create Project</h2>

      <input v-model="newProjectName" placeholder="Project name"
        class="w-full px-4 py-2 border border-gray-100 rounded-lg mb-4 focus:ring focus:ring-indigo-300" />

      <p v-if="error" class="text-red-600 mb-3">{{ error }}</p>

      <div class="flex justify-end gap-3">
        <button @click="closeModal" class="px-4 py-2 rounded-lg bg-gray-200">
          Cancel
        </button>
        <button @click="createProject" class="px-4 py-2 rounded-lg bg-primary text-white">
          Create
        </button>
      </div>

    </div>
  </div>

</template>
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

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useTheme } from "vuetify"
import axios from "axios"

const router = useRouter()
const theme = useTheme()

// STATE
const projects = ref<any[]>([])
const username = localStorage.getItem("username") || ""
const showCreate = ref(false)
const newProjectName = ref("")
const error = ref("")
const userMenuOpen = ref(false)

// API CONFIG
const api = axios.create({ baseURL: "http://127.0.0.1:8000/api" })
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` })

// LOGIC
const toggleUserMenu = () => { userMenuOpen.value = !userMenuOpen.value }

const fetchProjects = async () => {
  const res = await api.get("/projects/", { headers: authHeaders() })
  projects.value = res.data
}

const createProject = async () => {
  if (!newProjectName.value.trim()) {
    error.value = "Name required"
    return
  }
  try {
    const res = await api.post(
      "/projects/",
      { name: newProjectName.value },
      { headers: authHeaders() }
    )
    projects.value.push(res.data)
    showCreate.value = false
    newProjectName.value = ""
  } catch (err: any) {
    error.value = err.response?.data?.detail || "Could not create project"
  }
}

const closeModal = () => {
  showCreate.value = false
  newProjectName.value = ""
  error.value = ""
}

const openProject = (id: number) => {
  router.push(`/projects/${id}`)
}

const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("username")
  router.push("/login")
}

const menu = ref<HTMLElement | null>(null)

onMounted(() => {
  document.addEventListener("click", (e) => {
    if (menu.value && !menu.value.contains(e.target as Node)) {
      userMenuOpen.value = false
    }
  })
})

onMounted(fetchProjects)
</script>
