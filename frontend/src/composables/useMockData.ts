import { ref } from 'vue'

export interface DashboardPanel {
  id: string
  title: string
  type: string
  gridPos: { w: number; h: number } // For grid sizing
  chartOptions: any // The AG Chart JSON config
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

  // Save a new Panel to a specific Project ID
  const addPanelToProject = (projectId: string | number, panel: DashboardPanel) => {
    const db = loadFromStorage()
    
    if (!db[projectId]) {
      db[projectId] = []
    }

    db[projectId].push(panel)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  }

  return {
    getProjectPanels,
    addPanelToProject
  }
}