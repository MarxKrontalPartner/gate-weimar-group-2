import type { QueryConfig } from '@/composables/useDataFetcher'

export interface DashboardPanel {
  id: string
  title: string
  type: string
  gridPos: { w: number; h: number }
  chartOptions: Record<string, unknown>
  queryConfig?: QueryConfig
}

const STORAGE_KEY = 'mkp_mock_dashboards'

export function useMockData() {
  // get data from localStorage
  const loadFromStorage = (): Record<string, DashboardPanel[]> => {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  }

  // Get Panels for a specific Project ID
  const getProjectPanels = (projectId: string | number) => {
    const db = loadFromStorage()
    return db[projectId] || []
  }

  // Get a single panel to populate the editor
  const getPanel = (projectId: string | number, panelId: string) => {
    const panels = getProjectPanels(projectId)
    return panels.find((p) => p.id === panelId)
  }

  // Save a new Panel to a specific Project ID
  const addPanelToProject = (projectId: string | number, panel: DashboardPanel) => {
    const db = loadFromStorage()

    if (!db[projectId]) {
      db[projectId] = []
    }

    db[projectId].push(panel)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  }

  // Delete a Panel from a specific Project ID
  const deletePanelFromProject = (projectId: string | number, panelId: string) => {
    const db = loadFromStorage()
    if (db[projectId]) {
      db[projectId] = db[projectId].filter((p) => p.id !== panelId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
    }
  }

  // Update an existing panel
  const updatePanelInProject = (projectId: string | number, updatedPanel: DashboardPanel) => {
    const db = loadFromStorage()
    if (db[projectId]) {
      const index = db[projectId].findIndex((p) => p.id === updatedPanel.id)
      if (index !== -1) {
        db[projectId][index] = updatedPanel
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
      }
    }
  }

  return {
    getProjectPanels,
    getPanel,
    addPanelToProject,
    deletePanelFromProject,
    updatePanelInProject,
  }
}
