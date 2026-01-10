import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import type { QueryConfig } from '@/composables/useDataFetcher'

export interface DashboardPanel {
    id: string
    title: string
    type: string
    gridPos: { w: number; h: number }
    chartOptions: Record<string, unknown>
    queryConfig?: QueryConfig
}

export function useDashboardPanels(projectId: string | number) {
    const router = useRouter()
    const panels = ref<DashboardPanel[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const api = axios.create({ baseURL: 'http://127.0.0.1:8000/api' })
    const authHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    })

    // Get all panels for the project
    const getProjectPanels = async (): Promise<DashboardPanel[]> => {
        loading.value = true
        error.value = null
        try {
            const res = await api.get(`/projects/${projectId}/panels/`, {
                headers: authHeaders(),
            })
            panels.value = res.data
            return res.data
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('username')
                router.push('/login')
            }
            error.value = axios.isAxiosError(err)
                ? err.response?.data?.detail || 'Failed to fetch panels'
                : 'Failed to fetch panels'
            return []
        } finally {
            loading.value = false
        }
    }

    // Get a single panel by ID
    const getPanel = async (panelId: string): Promise<DashboardPanel | null> => {
        loading.value = true
        error.value = null
        try {
            const res = await api.get(`/projects/${projectId}/panels/${panelId}/`, {
                headers: authHeaders(),
            })
            return res.data
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('username')
                router.push('/login')
            }
            error.value = axios.isAxiosError(err)
                ? err.response?.data?.detail || 'Failed to fetch panel'
                : 'Failed to fetch panel'
            return null
        } finally {
            loading.value = false
        }
    }

    // Add a new panel to the project
    const addPanelToProject = async (panel: DashboardPanel): Promise<boolean> => {
        loading.value = true
        error.value = null
        try {
            await api.post(`/projects/${projectId}/panels/`, panel, {
                headers: authHeaders(),
            })
            return true
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('username')
                router.push('/login')
            }
            error.value = axios.isAxiosError(err)
                ? err.response?.data?.detail || 'Failed to create panel'
                : 'Failed to create panel'
            return false
        } finally {
            loading.value = false
        }
    }

    // Update an existing panel
    const updatePanelInProject = async (panel: DashboardPanel): Promise<boolean> => {
        loading.value = true
        error.value = null
        try {
            await api.put(`/projects/${projectId}/panels/${panel.id}/`, panel, {
                headers: authHeaders(),
            })
            return true
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('username')
                router.push('/login')
            }
            error.value = axios.isAxiosError(err)
                ? err.response?.data?.detail || 'Failed to update panel'
                : 'Failed to update panel'
            return false
        } finally {
            loading.value = false
        }
    }

    // Delete a panel from the project
    const deletePanelFromProject = async (panelId: string): Promise<boolean> => {
        loading.value = true
        error.value = null
        try {
            await api.delete(`/projects/${projectId}/panels/${panelId}/`, {
                headers: authHeaders(),
            })
            panels.value = panels.value.filter((p) => p.id !== panelId)
            return true
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('username')
                router.push('/login')
            }
            error.value = axios.isAxiosError(err)
                ? err.response?.data?.detail || 'Failed to delete panel'
                : 'Failed to delete panel'
            return false
        } finally {
            loading.value = false
        }
    }

    return {
        panels,
        loading,
        error,
        getProjectPanels,
        getPanel,
        addPanelToProject,
        updatePanelInProject,
        deletePanelFromProject,
    }
}
