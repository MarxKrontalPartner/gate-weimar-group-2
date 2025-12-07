import { ref } from 'vue'
import axios from 'axios'

export interface QueryConfig {
  sourceType: 'STATIC_JSON' | 'REST_API'
  url: string
  mapping: {
    x: string 
    y: string
  }
}

export function useDataFetcher() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Helper: Calculate Dynamic Start Time
  const getStartTimeISO = (range: string) => {
    const now = new Date()
    // Default to 24h if not specified
    let hoursToSubtract = 24 
    
    if (range === '6h') hoursToSubtract = 6
    if (range === '7d') hoursToSubtract = 24 * 7
    
    now.setHours(now.getHours() - hoursToSubtract)
    return now.toISOString()
  }

  const fetchData = async (config: QueryConfig | undefined, timeRange: string = '24h') => {
    if (!config || !config.url) return []

    loading.value = true
    error.value = null
    let rawData = []

    try {
      if (config.sourceType === 'STATIC_JSON') {
        // Fetch local file from /public
        const res = await axios.get(config.url)
        rawData = res.data
      } 
      else if (config.sourceType === 'REST_API') {
        // Handle Dynamic URL Construction
        const startISO = getStartTimeISO(timeRange)
        
        // Check if URL already has params
        const separator = config.url.includes('?') ? '&' : '?'
        
        // Append dynamic start time
        const dynamicUrl = `${config.url}${separator}start=${encodeURIComponent(startISO)}`
        
        console.log(`Fetching Live Data: ${dynamicUrl}`)
        const res = await axios.get(dynamicUrl)
        rawData = res.data
      }

      // Map Data to Standard Format { time, value }
      const mappedData = rawData.map((item: any) => ({
        time: new Date(item[config.mapping.x]), // Convert string to Date
        value: item[config.mapping.y]
      }))

      return mappedData

    } catch (err: any) {
      console.error("Data Fetch Error:", err)
      error.value = err.message || "Failed to fetch data"
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    fetchData,
    loading,
    error
  }
}