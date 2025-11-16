<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h1>Projects</h1>
      <div class="user-info">
        {{ username }}
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
    </header>

    <div class="projects-grid">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-card"
        @click="openProject(project.id)"
      >
        <h3>{{ project.name }}</h3>
        <p class="project-owner">Owner: {{ project.owner.username }}</p>
      </div>

      <div class="project-card add-card" @click="showCreate = true">
        <span class="plus">+</span>
        <p>New Project</p>
      </div>
    </div>

    <div v-if="showCreate" class="modal-backdrop">
      <div class="modal">
        <h2>Create Project</h2>
        <input v-model="newProjectName" placeholder="Project name" />
        <div class="modal-actions">
          <button @click="createProject">Create</button>
          <button class="secondary" @click="closeModal">Cancel</button>
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const projects = ref<any[]>([])
const showCreate = ref(false)
const newProjectName = ref('')
const error = ref('')
const username = localStorage.getItem('username') || ''

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

const authHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchProjects = async () => {
  try {
    const res = await api.get('/projects/', { headers: authHeaders() })
    projects.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const createProject = async () => {
  if (!newProjectName.value.trim()) {
    error.value = 'Name required'
    return
  }
  try {
    error.value = ''
    const res = await api.post(
      '/projects/',
      { name: newProjectName.value },
      { headers: authHeaders() }
    )
    projects.value.push(res.data)
    newProjectName.value = ''
    showCreate.value = false
  } catch (e: any) {
    error.value = e.response?.data?.detail || 'Could not create project'
  }
}

const closeModal = () => {
  showCreate.value = false
  newProjectName.value = ''
  error.value = ''
}

const openProject = (id: number) => {
  router.push(`/projects/${id}`)
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  router.push('/login')
}

onMounted(fetchProjects)
</script>

<style src="../styles/dashboard.css"></style>
