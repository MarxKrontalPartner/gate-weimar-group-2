<template>
  <div class="flex h-screen bg-gray-50">

    <!-- OPTIONAL SIDEBAR (can be removed later) -->
    <aside class="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col">
      <div class="p-6 font-semibold text-lg">MKP Monitoring</div>
      <nav class="flex-1 p-4 space-y-2 text-gray-700">
        <RouterLink 
          to="/dashboard"
          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3.75 3.75h6.5v6.5h-6.5v-6.5zM13.75 3.75h6.5v6.5h-6.5v-6.5zM3.75 13.75h6.5v6.5h-6.5v-6.5zM13.75 13.75h6.5v6.5h-6.5v-6.5z" />
          </svg>

          Dashboard
        </RouterLink>


      </nav>
    </aside>

    <!-- MAIN AREA -->
    <div class="flex-1 flex flex-col">

      <!-- TOPBAR -->
      <header class="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
        
        <h1 class="text-m font-semibold">Projects</h1>

        <!-- USER DROPDOWN -->
        <div class="relative" ref="menu" @click.stop="toggleUserMenu">
          <button 
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" 
                fill="none" viewBox="0 0 24 24" 
                stroke-width="1.5" stroke="currentColor"
                class="w-5 h-5 text-black">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M6 20a6 6 0 0112 0" />
            </svg>
            {{ username }}
          </button>

          <!-- DROPDOWN -->
          <!-- DROPDOWN -->
          <transition name="fade">
            <div 
              v-if="userMenuOpen"
              class="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg border border-gray-100 py-2 z-20"
            >
              <button 
                @click="logout"
                class="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </transition>
        </div>

      </header>

      <!-- PAGE CONTENT -->
      <main class="p-8">

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
            class="cursor-pointer bg-white p-6 rounded-xl shadow-sm border-gray-100
                   flex flex-col items-center justify-center hover:bg-gray-100 transition"
          >
            <div class="text-4xl font-light text-indigo-600">+</div>
            <p class="mt-2 text-gray-600">New Project</p>
          </div>

        </div>

      </main>

    </div>

    <!-- MODAL -->
    <div 
      v-if="showCreate"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 w-full max-w-md rounded-xl shadow-xl">

        <h2 class="text-xl font-semibold mb-4">Create Project</h2>

        <input
          v-model="newProjectName"
          placeholder="Project name"
          class="w-full px-4 py-2 border border-gray-100 rounded-lg mb-4 focus:ring focus:ring-indigo-300"
        />

        <p v-if="error" class="text-red-600 mb-3">{{ error }}</p>

        <div class="flex justify-end gap-3">
          <button @click="closeModal" class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
            Cancel
          </button>
          <button @click="createProject" class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
            Create
          </button>
        </div>

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
import axios from "axios"

const router = useRouter()

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
