<template>
  <div class="flex h-screen bg-gray-50">
    <div class="flex-1 flex flex-col">
      <v-main class="h-full flex flex-col">
        <!-- HEADER -->
        <div
          class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0"
        >
          <div class="flex items-center gap-2">
            <span class="text-lg font-medium text-gray-700">{{
              panelTitle || 'Untitled Panel'
            }}</span>
            <v-chip size="x-small" variant="outlined" class="ml-2">Draft</v-chip>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="router.back()"
              class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
            >
              Cancel
            </button>
            <button
              @click="handleApply"
              class="px-4 py-2 text-sm font-medium bg-blue-700 text-white rounded shadow-sm hover:bg-blue-800 transition"
            >
              {{ isEditMode ? 'Update Panel' : 'Apply to Dashboard' }}
            </button>
          </div>
        </div>

        <!-- WORKSPACE -->
        <div class="flex-1 flex overflow-hidden">
          <!-- LEFT: PREVIEW -->
          <div class="flex-1 flex flex-col bg-slate-50 min-w-0">
            <div class="flex-1 p-6 overflow-y-auto">
              <!-- Chart Container -->
              <div
                class="bg-white border border-gray-200 rounded-lg h-96 shadow-sm overflow-hidden relative"
              >
                <!-- Loading Overlay -->
                <div
                  v-if="isLoadingData"
                  class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center"
                >
                  <span class="text-blue-600 font-medium">Loading Data...</span>
                </div>

                <!-- Chart OR No Data Message -->
                <div class="h-full w-full flex items-center justify-center">
                  <template v-if="!hasNoData">
                    <ag-charts-vue :options="chartOptions" style="height: 100%; width: 100%" />
                  </template>

                  <template v-else>
                    <div class="text-center text-gray-500 px-6">
                      <p class="text-sm font-medium">No data available</p>
                      <p class="text-xs mt-1">
                        <strong>{{ selectedStationName || pegelStation }}</strong>
                        and timeseries <strong>{{ pegelTimeseries }}</strong>
                      </p>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <!-- BOTTOM: QUERY CONFIGURATION -->
            <div class="p-6">
              <div class="grid grid-cols-12 gap-6">
                <!-- River search (water field in JSON) -->
                <div class="col-span-4">
                  <label class="text-xs font-bold text-gray-500 uppercase block mb-2">River</label>
                  <v-text-field
                    v-model="riverSearch"
                    density="compact"
                    variant="outlined"
                    hide-details
                    clearable
                    placeholder="Type river name (water)..."
                    @click:clear="clearRiverSearch"
                  />
                  <p v-if="riverNeedsStationSelection" class="text-xs text-red-600 mt-1">
                    Select a station (by name) or enter a UUID after filtering by river.
                  </p>
                </div>

                <!-- Station search (separate input) -->
                <div class="col-span-4">
                  <label class="text-xs font-bold text-gray-500 uppercase block mb-2"
                    >Search Station</label
                  >
                  <v-text-field
                    v-model="stationSearch"
                    density="compact"
                    variant="outlined"
                    hide-details
                    clearable
                    placeholder="Type station shortname..."
                    @click:clear="clearStationSearch"
                  />
                </div>

                <!-- Station dropdown (must always show shortname, not UUID) -->
                <div class="col-span-4">
                  <label class="text-xs font-bold text-gray-500 uppercase block mb-2">Station</label>
                  <v-autocomplete
                    v-model="selectedStationUuid"
                    :items="stationsForDropdown"
                    item-title="shortname"
                    item-value="uuid"
                    density="compact"
                    variant="outlined"
                    hide-details
                    clearable
                    placeholder="Select station..."
                  />
                  <div v-if="selectedStationName" class="text-xs text-gray-500 mt-1">
                    Selected: <span class="font-medium">{{ selectedStationName }}</span>
                  </div>
                </div>

                <!-- UUID input -->
                <div class="col-span-4">
                  <label class="text-xs font-bold text-gray-500 uppercase block mb-2">UUID</label>
                  <v-text-field
                    v-model="stationUuidInput"
                    density="compact"
                    variant="outlined"
                    hide-details
                    placeholder="Enter station UUID"
                  />
                </div>

                <!-- Timeseries -->
                <div class="col-span-4">
                  <label class="text-xs font-bold text-gray-500 uppercase block mb-2"
                    >Timeseries</label
                  >
                  <v-select
                    v-model="pegelTimeseries"
                    :items="[
                      { title: 'W (Water Level)', value: 'W' },
                      { title: 'Q (Discharge)', value: 'Q' },
                      { title: 'T (Temperature)', value: 'T' },
                    ]"
                    item-title="title"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                    hide-details
                  />
                </div>

                <!-- Period -->
                <div class="col-span-4">
                  <label class="text-xs font-bold text-gray-500 uppercase block mb-2">Period</label>
                  <v-select
                    v-model="pegelPeriod"
                    :items="[
                      { title: '1 day', value: 'P1D' },
                      { title: '3 days', value: 'P3D' },
                      { title: '7 days', value: 'P7D' },
                      { title: '14 days', value: 'P14D' },
                      { title: '30 days', value: 'P30D' },
                    ]"
                    item-title="title"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                    hide-details
                  />
                </div>

                <!-- INFO section removed (as requested) -->
              </div>
            </div>
          </div>

          <!-- RIGHT: VISUAL SETTINGS -->
          <div
            class="w-80 bg-white border-l border-gray-200 overflow-y-auto flex flex-col shrink-0"
          >
            <div class="p-4 border-b border-gray-100">
              <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">
                Visualization
              </h3>
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="type in chartTypes"
                  :key="type.name"
                  @click="selectedChart = type.name"
                  :class="[
                    'cursor-pointer border rounded p-3 flex flex-col items-center justify-center transition hover:bg-blue-50',
                    selectedChart === type.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200',
                  ]"
                >
                  <v-icon
                    :icon="type.icon"
                    :class="selectedChart === type.name ? 'text-blue-600' : 'text-gray-400'"
                  ></v-icon>
                  <span
                    :class="[
                      'text-xs mt-2',
                      selectedChart === type.name ? 'text-blue-700 font-medium' : 'text-gray-500',
                    ]"
                    >{{ type.name }}</span
                  >
                </div>
              </div>
            </div>

            <div class="p-4 border-b border-gray-100">
              <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">
                Panel Options
              </h3>
              <div class="mb-4">
                <label class="text-xs text-gray-500 mb-1 block">Panel Title</label>
                <v-text-field
                  v-model="panelTitle"
                  density="compact"
                  variant="outlined"
                  hide-details
                ></v-text-field>
              </div>
            </div>
          </div>
        </div>
      </v-main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { createChartConfig } from '@/utils/chartFactory'
import { useMockData } from '@/composables/useMockData'
import { fetchPegelTimeseriesMeta, useDataFetcher } from '@/composables/useDataFetcher'

import type { ChartDataPoint } from '@/types/project.types'
import type {
  PegelPeriod,
  PegelTimeseries,
  PegelTimeseriesMeta,
  QueryConfig,
} from '@/composables/useDataFetcher'

const pegelStation = ref<string>('ILMENAU') // UUID used for API (or station id)
const pegelTimeseries = ref<PegelTimeseries>('W')
const pegelPeriod = ref<PegelPeriod>('P7D')

const pegelMeta = ref<PegelTimeseriesMeta | null>(null)

const router = useRouter()
const route = useRoute()
const { addPanelToProject, updatePanelInProject, getPanel } = useMockData()
const { fetchData, loading: isLoadingData } = useDataFetcher()

// Project ID from URL
const rawId = route.params.id
const projectId: string | number = Array.isArray(rawId)
  ? (rawId[0] ?? 'default_project')
  : rawId !== undefined
    ? rawId
    : 'default_project'

// Check if we are in EDIT MODE
const editingPanelId = route.query.panelId as string | undefined
const isEditMode = !!editingPanelId

// State
const selectedChart = ref('Time series')
const panelTitle = ref('New Panel')

// Query Configuration State
const queryConfig = computed<QueryConfig>(() => ({
  sourceType: 'PEGEL',
  station: pegelStation.value.trim(),
  timeseries: pegelTimeseries.value,
  period: pegelPeriod.value,
}))

type StationOption = {
  shortname: string
  uuid: string
  water?: string
  [key: string]: unknown
}

const stations = ref<StationOption[]>([])

// Inputs
const riverSearch = ref<string>('')
const stationSearch = ref<string>('')

const selectedStationUuid = ref<string>('') // dropdown stores uuid
const stationUuidInput = ref<string>('') // manual uuid input

const selectedStation = computed<StationOption | null>(() => {
  const uuid = selectedStationUuid.value
  if (!uuid) return null
  return stations.value.find((s) => String(s.uuid) === uuid) ?? null
})

const selectedStationName = computed<string>(() => {
  const s = selectedStation.value
  return s ? String(s.shortname) : ''
})

const previewData = ref<ChartDataPoint[]>([])
const hasNoData = computed(() => previewData.value.length === 0)

// River + station filtering
const riverFilteredStations = computed<StationOption[]>(() => {
  const q = riverSearch.value.trim().toLowerCase()
  if (!q) return stations.value
  return stations.value.filter((s) => String(s.water ?? '').toLowerCase().includes(q))
})

const stationFilteredStations = computed<StationOption[]>(() => {
  const q = stationSearch.value.trim().toLowerCase()
  const base = riverFilteredStations.value

  if (!q) return base
  return base.filter((s) => String(s.shortname).toLowerCase().includes(q))
})

// IMPORTANT: Ensure dropdown ALWAYS includes the selected station item,
// so Vuetify displays shortname instead of raw UUID.
const stationsForDropdown = computed<StationOption[]>(() => {
  const list = stationFilteredStations.value
  const sel = selectedStationUuid.value
  if (!sel) return list

  const already = list.some((s) => String(s.uuid) === sel)
  if (already) return list

  const selected = stations.value.find((s) => String(s.uuid) === sel)
  return selected ? [selected, ...list] : list
})

// Validation: if river is filled, user must select station or enter UUID
const riverNeedsStationSelection = computed(() => {
  const river = riverSearch.value.trim()
  if (!river) return false
  const hasStation = !!selectedStationUuid.value
  const hasUuid = stationUuidInput.value.trim().length > 0
  const hasStationSearch = stationSearch.value.trim().length > 0
  // If river is set, at least one of station selection / uuid / station search must be used
  return !hasStation && !hasUuid && !hasStationSearch
})

const loadPegelMeta = async (): Promise<void> => {
  try {
    pegelMeta.value = await fetchPegelTimeseriesMeta({
      station: pegelStation.value.trim(),
      timeseries: pegelTimeseries.value,
    })
  } catch (e) {
    console.warn('Failed to load Pegel meta', e)
    pegelMeta.value = null
  }
}

const loadStations = async (): Promise<void> => {
  const res = await fetch('/stations.json')
  stations.value = (await res.json()) as StationOption[]
}

const clearStationSearch = (): void => {
  stationSearch.value = ''
}

const clearRiverSearch = (): void => {
  riverSearch.value = ''
}

// Prevent watcher ping-pong loops
const isSyncingStation = ref(false)

const applyStationSelection = (uuid: string): void => {
  const id = uuid.trim()
  if (!id) return

  isSyncingStation.value = true
  selectedStationUuid.value = id
  stationUuidInput.value = id
  pegelStation.value = id
  isSyncingStation.value = false
}

const trySelectStationFromSearch = (): void => {
  const q = stationSearch.value.trim().toLowerCase()
  if (!q) return

  const base = riverFilteredStations.value

  const exact = base.find((s) => String(s.shortname).toLowerCase() === q)
  if (exact) {
    applyStationSelection(String(exact.uuid))
    return
  }

  const matches = base.filter((s) => String(s.shortname).toLowerCase().includes(q))
  if (matches.length === 1) {
  const onlyMatch = matches[0]
  if (onlyMatch) {
    applyStationSelection(String(onlyMatch.uuid))
  }
}

}


// 1) Selecting station in dropdown -> UUID + API station set
watch(
  selectedStationUuid,
  (uuid) => {
    if (isSyncingStation.value) return
    if (!uuid) return

    isSyncingStation.value = true
    stationUuidInput.value = uuid
    pegelStation.value = uuid
    isSyncingStation.value = false
  },
  { flush: 'sync' },
)

// 2) Typing UUID -> selects station name if found, and sets API station anyway
watch(
  stationUuidInput,
  (uuidRaw) => {
    if (isSyncingStation.value) return
    const uuid = uuidRaw.trim()
    if (!uuid) return

    isSyncingStation.value = true
    pegelStation.value = uuid

    const match = stations.value.find((s) => String(s.uuid) === uuid)
    if (match) {
      selectedStationUuid.value = String(match.uuid)
    } else {
      selectedStationUuid.value = ''
    }
    isSyncingStation.value = false
  },
  { flush: 'sync' },
)

// 3) Typing station name in Search Station -> auto-select matching station (and reflect UUID)
watch(
  stationSearch,
  () => {
    if (isSyncingStation.value) return
    trySelectStationFromSearch()
  },
  { flush: 'sync' },
)




// Load existing panel data if in edit mode
onMounted(async () => {
  await loadStations()

  if (isEditMode) {
    const existingPanel = getPanel(projectId, editingPanelId)
    if (existingPanel) {
      panelTitle.value = existingPanel.title
      selectedChart.value = existingPanel.type

      if (existingPanel.queryConfig && existingPanel.queryConfig.sourceType === 'PEGEL') {
        const qc = existingPanel.queryConfig
        pegelStation.value = qc.station
        pegelTimeseries.value = qc.timeseries
        pegelPeriod.value = qc.period

        // sync UI fields from saved UUID
        stationUuidInput.value = qc.station
        const match = stations.value.find((s) => String(s.uuid) === qc.station)
        if (match) {
          selectedStationUuid.value = String(match.uuid)
        }
      }

      await loadPegelMeta()
      await refreshPreview()
    }
  } else {
    stationUuidInput.value = pegelStation.value

    const match = stations.value.find((s) => String(s.uuid) === pegelStation.value)
    if (match) {
      selectedStationUuid.value = String(match.uuid)
    }

    await loadPegelMeta()
    await refreshPreview()
  }
})

const refreshPreview = async (): Promise<void> => {
  previewData.value = await fetchData(queryConfig.value, '24h')
}

watch([pegelStation, pegelTimeseries], () => {
  void loadPegelMeta()
})

watch(
  [pegelStation, pegelTimeseries, pegelPeriod],
  () => {
    void refreshPreview()
  },
  { immediate: true },
)

const chartOptions = computed(() => {
  const base = createChartConfig(selectedChart.value, panelTitle.value, previewData.value)

  const defaultTitle =
    pegelTimeseries.value === 'W'
      ? 'Water Level'
      : pegelTimeseries.value === 'Q'
        ? 'Discharge'
        : 'Temperature'

  const defaultUnit =
    pegelTimeseries.value === 'W'
      ? 'cm'
      : pegelTimeseries.value === 'Q'
        ? 'm³/s'
        : '°C'

  const titleText = pegelMeta.value?.longname ?? defaultTitle
  const unitText = pegelMeta.value?.unit ?? defaultUnit
 const stationLabel = selectedStationName.value || pegelStation.value.trim()
const subtitleText = `${stationLabel} · ${pegelTimeseries.value} · ${pegelPeriod.value}`

  const baseSeries = Array.isArray((base as Record<string, unknown>).series)
    ? ((base as Record<string, unknown>).series as unknown[])
    : []

  return {
    ...base,
    title: { text: titleText },
    subtitle: { text: subtitleText },
    axes: [
      { type: 'time', position: 'bottom', title: { text: 'Time' } },
      { type: 'number', position: 'left', title: { text: `${titleText} (${unitText})` } },
    ],
    series: baseSeries.map((s) => {
      const seriesObj = s as Record<string, unknown>
      return {
        ...seriesObj,
        marker: { enabled: false },
        strokeWidth: 2,
        tooltip: {
          renderer: ({ datum }: { datum: ChartDataPoint }) => ({
            title: datum.time instanceof Date ? datum.time.toLocaleString() : 'Time',
            content: `${datum.value} ${unitText}`,
          }),
        },
      }
    }),
  }
})

const chartTypes = [
  { name: 'Time series', icon: 'mdi-chart-line' },
  { name: 'Bar chart', icon: 'mdi-chart-bar' },
  { name: 'Stat', icon: 'mdi-numeric' },
  { name: 'Gauge', icon: 'mdi-gauge' },
]

const handleApply = () => {
  const panelData = {
    id: isEditMode ? editingPanelId : Date.now().toString(),
    title: panelTitle.value,
    type: selectedChart.value,
    gridPos: { w: 6, h: 4 },
    queryConfig: queryConfig.value,
    chartOptions: chartOptions.value,
  }

  if (isEditMode) {
    updatePanelInProject(projectId, panelData)
  } else {
    addPanelToProject(projectId, panelData)
  }
  router.push(`/projects/${projectId}`)
}
</script>
