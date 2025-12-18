import { ref } from 'vue'
import axios from 'axios'
import type { ChartDataPoint } from '@/types/project.types'

export type PegelTimeseries = 'W' | 'Q' | 'T'
export type PegelPeriod = 'P1D' | 'P3D' | 'P7D' | 'P14D' | 'P30D'

export type QueryConfig =
  | {
      sourceType: 'PEGEL'
      station: string
      timeseries: PegelTimeseries
      period: PegelPeriod
    }
  | {
      sourceType: 'STATIC_JSON' | 'REST_API'
      url: string
      mapping: { x: string; y: string }
    }

export interface PegelTimeseriesMeta {
  longname: string
  shortname: string
  unit: string
}

type ApiDataItem = Record<string, unknown>

const PEGEL_BASE_URL = 'https://www.pegelonline.wsv.de/webservices/rest-api/v2'

export async function fetchPegelTimeseriesMeta(args: {
  station: string
  timeseries: PegelTimeseries
}): Promise<PegelTimeseriesMeta> {
  const { station, timeseries } = args

  const url = `${PEGEL_BASE_URL}/stations/${encodeURIComponent(station)}/${timeseries}.json`

  const res = await axios.get<PegelTimeseriesMeta>(url, {
    headers: { accept: 'application/json' },
  })

  return res.data
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
    if (!config) return []

    loading.value = true
    error.value = null

    try {
      // ✅ NEW: Pegel source
      if (config.sourceType === 'PEGEL') {
        const url = new URL(
          `https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/${encodeURIComponent(
            config.station,
          )}/${config.timeseries}/measurements.json`,
        )
        url.searchParams.set('start', config.period)

        const res = await axios.get<Array<{ timestamp: string; value: number }>>(url.toString(), {
          headers: { accept: 'application/json' },
        })

        const points: ChartDataPoint[] = res.data.map((d) => ({
          time: new Date(d.timestamp),
          value: Number(d.value),
        }))

        return points
      }

      // ✅ Keep old logic (optional, even if you hide it in UI)
      if (!('url' in config) || !config.url) return []

      let rawData: ApiDataItem[] = []

      if (config.sourceType === 'STATIC_JSON') {
        const res = await axios.get<ApiDataItem[]>(config.url)
        rawData = res.data
      } else if (config.sourceType === 'REST_API') {
        const startISO = getStartTimeISO(timeRange)
        const separator = config.url.includes('?') ? '&' : '?'
        const dynamicUrl = `${config.url}${separator}start=${encodeURIComponent(startISO)}`
        const res = await axios.get<ApiDataItem[]>(dynamicUrl)
        rawData = res.data
      }

      return rawData.map((item) => ({
        time: new Date(String(item[config.mapping.x])),
        value: Number(item[config.mapping.y]),
      }))
    } catch (err: unknown) {
      console.error('Data Fetch Error:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch data'
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    fetchData,
    loading,
    error,
  }
}
