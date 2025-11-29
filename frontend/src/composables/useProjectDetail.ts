import { ref, computed } from "vue"
import axios from "axios"
import { useRoute, useRouter } from "vue-router"

export function useProjectDetail() {
  const route = useRoute()
  const router = useRouter()
  const projectId = route.params.id

  const project = ref<any | null>(null)
  const projectName = ref("Loading...")
  const members = ref<any[]>([])
  const userSearch = ref("")
  const userSuggestions = ref<any[]>([])
  const selectedUser = ref<any | null>(null)

  const showDeleteModal = ref(false)
  const deleteInput = ref("")

  const activeTab = ref("viewer")

  const api = axios.create({ baseURL: "http://127.0.0.1:8000/api" })
  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  })

  // FETCH PROJECT
  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/`, {
        headers: authHeaders(),
      })
      project.value = res.data
      projectName.value = res.data.name
      members.value = res.data.memberships || []
    } catch (err: any) {
      if (err.response?.status === 403 || err.response?.status === 404) {
        router.push("/dashboard")
      } else {
        console.error("Unexpected error loading project:", err)
      }
    }
  }

  // ROLE LOGIC
  const username = localStorage.getItem("username") || ""

  const isOwner = computed(() => project.value?.owner?.username === username)

  const isEditor = computed(() => {
    if (isOwner.value) return true
    return members.value.some(
      (m) => m.user.username === username && m.role === "editor"
    )
  })

  // SAVE NAME
  const saveName = async () => {
    await api.patch(
      `/projects/${projectId}/`,
      { name: projectName.value },
      { headers: authHeaders() }
    )
  }

  // DELETE PROJECT
  const deleteProject = async () => {
    if (deleteInput.value !== projectName.value) return
    await api.delete(`/projects/${projectId}/`, { headers: authHeaders() })
    router.push("/dashboard")
  }

  // USER SEARCH
  const searchUsers = async () => {
    if (!userSearch.value.trim()) {
      userSuggestions.value = []
      return
    }
    const res = await api.get("/users/", {
      headers: authHeaders(),
      params: { search: userSearch.value },
    })
    userSuggestions.value = res.data
  }

  const selectUser = (u: any) => {
    selectedUser.value = u
    userSearch.value = u.username
    userSuggestions.value = []
  }

  const addSelectedUser = async () => {
    if (!selectedUser.value) return
    const res = await api.post(
      `/projects/${projectId}/add_member/`,
      { username: selectedUser.value.username },
      { headers: authHeaders() }
    )
    members.value.push(res.data)
    selectedUser.value = null
    userSearch.value = ""
  }

  // CHANGE ROLE
  const changeRole = async (membership: any) => {
    await api.post(
      `/projects/${projectId}/update_role/`,
      { membership_id: membership.id, role: membership.role },
      { headers: authHeaders() }
    )
  }

  // REMOVE MEMBER
  const removeMember = async (membership: any) => {
    await api.post(
      `/projects/${projectId}/remove_member/`,
      { membership_id: membership.id },
      { headers: authHeaders() }
    )
    members.value = members.value.filter((m) => m.id !== membership.id)
  }

  const viewerChartOptions = ref({
    title: { text: "Viewer Graph Example" },
    data: [
      { label: "A", value: 30 },
      { label: "B", value: 55 },
      { label: "C", value: 42 },
    ],
    series: [
      {
        type: "line",
        xKey: "label",
        yKey: "value",
        stroke: "black",
        label: {
          fontWeight: "bold",
          formatter: ({ value }: { value: number }) => value.toFixed(0),
        },
        marker: {
          fill: "blue",
          size: 10,
          stroke: "blue",
          strokeWidth: 3,
          shape: "circle",
        },
      },
    ],
  })

  return {
    project,
    projectName,
    members,

    userSearch,
    userSuggestions,
    selectedUser,

    activeTab,

    showDeleteModal,
    deleteInput,

    isOwner,
    isEditor,

    fetchProject,
    saveName,
    deleteProject,

    searchUsers,
    selectUser,
    addSelectedUser,

    changeRole,
    removeMember,

    viewerChartOptions,
  }
}
