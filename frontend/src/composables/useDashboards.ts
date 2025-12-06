import { ref, onMounted } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

export function useDashboards() {
  const router = useRouter()

  // STATE
  const projects = ref<any[]>([])
  const showCreate = ref(false)
  const newProjectName = ref("")
  const error = ref("")

  // API CONFIG
  const api = axios.create({ baseURL: "http://127.0.0.1:8000/api" })
  const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` })

  // FETCH PROJECTS
  const fetchProjects = async () => {
    const res = await api.get("/projects/", { headers: authHeaders() })
    projects.value = res.data
  }

  // CREATE NEW PROJECT
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
      closeModal()
      
      router.push("/dashboard/editor")
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

  onMounted(fetchProjects)

  return {
    projects,
    showCreate,
    newProjectName,
    error,
    fetchProjects,
    createProject,
    closeModal,
    openProject,
  }
}