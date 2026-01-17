<template>
  <div :class="['flex h-screen', isDark ? 'bg-gray-900' : 'bg-gray-50']">
    <div class="flex-1 flex flex-col">
      <v-main class="h-full flex flex-col">
        <!-- HEADER -->
        <div
          :class="['border-b px-6 py-3 flex items-center justify-between shrink-0', isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200']"
        >
          <div class="flex items-center gap-2">
            <span :class="['text-lg font-medium', isDark ? 'text-white' : 'text-gray-700']">{{ panelTitle || $t('panelEditor.untitledPanel') }}</span>
            <v-chip size="x-small" variant="outlined" class="ml-2">Draft</v-chip>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="router.back()"
              :class="['px-4 py-2 text-sm font-medium transition', isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900']"
              type="button"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              @click="handleApply"
              class="px-4 py-2 text-sm font-medium bg-blue-700 text-white rounded shadow-sm hover:bg-blue-800 transition"
              type="button"
            >
              {{ isEditMode ? $t('panelEditor.updatePanel') : $t('panelEditor.applyToDashboard') }}
            </button>
          </div>
        </div>

        <!-- WORKSPACE -->
        <div class="flex-1 flex overflow-hidden">
          <!-- LEFT: PREVIEW -->
          <div :class="['flex-1 flex flex-col min-w-0', isDark ? 'bg-gray-850' : 'bg-slate-50']">
            <div class="flex-1 p-6 overflow-y-auto">
              <!-- Chart Container -->
              <div
                :class="['border rounded-lg h-96 shadow-sm overflow-hidden relative', isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200']"
              >
                <!-- Loading Overlay -->
                <div
                  v-if="isLoadingData"
                  :class="['absolute inset-0 z-10 flex items-center justify-center', isDark ? 'bg-gray-800/80' : 'bg-white/80']"
                >
                  <span class="text-blue-500 font-medium">{{ $t('panelEditor.loadingData') }}</span>
                </div>

                <!-- Chart OR No Data Message -->
                <div class="h-full w-full flex items-center justify-center">
                  <template v-if="!hasNoData">
                    <ag-charts-vue :options="chartOptions" style="height: 100%; width: 100%" />
                  </template>

                  <template v-else>
                    <div :class="['text-center px-6', isDark ? 'text-gray-400' : 'text-gray-500']">
                      <p class="text-sm font-medium">{{ $t('panelEditor.noDataAvailable') }}</p>
                      <p class="text-xs mt-1">
                        <strong>{{ selectedStationName || pegelStation }}</strong>
                              {{ $t('panelEditor.noDataMessage', { 
                                station: selectedStationName || pegelStation, 
                                timeseries: pegelTimeseries 
                              }) }}
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
                  <label :class="['text-xs font-bold uppercase block mb-2', isDark ? 'text-gray-400' : 'text-gray-500']">{{ $t('panelEditor.river') }}</label>
                  <v-text-field
                    v-model="riverSearch"
                    density="compact"
                    variant="outlined"
                    hide-details
                    clearable
                    :placeholder="$t('panelEditor.searchRiver')"
                    @click:clear="clearRiverSearch"
                  />
                  <p v-if="riverNeedsStationSelection" class="text-xs text-red-500 mt-1">
                    {{ $t('panelEditor.selectRiverFirst') }}
                  </p>
                </div>

                <!-- Station search (separate input) -->
                <div class="col-span-4">
                  <label :class="['text-xs font-bold uppercase block mb-2', isDark ? 'text-gray-400' : 'text-gray-500']">{{ $t('panelEditor.searchStation') }}</label>
                  <v-text-field
                    v-model="stationSearch"
                    density="compact"
                    variant="outlined"
                    hide-details
                    clearable
                    :placeholder="$t('panelEditor.searchStationPlaceholder')"
                    @click:clear="clearStationSearch"
                  />
                </div>

                <!-- Station dropdown (must always show shortname, not UUID) -->
                <div class="col-span-4">
                  <label :class="['text-xs font-bold uppercase block mb-2', isDark ? 'text-gray-400' : 'text-gray-500']">{{ $t('panelEditor.station') }}</label>
                  <v-autocomplete
                    v-model="selectedStationUuid"
                    :items="stationsForDropdown"
                    item-title="shortname"
                    item-value="uuid"
                    density="compact"
                    variant="outlined"
                    hide-details
                    clearable
                    :placeholder="$t('panelEditor.selectStation')"
                  />
                  <div v-if="selectedStationName" :class="['text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-500']">
                    {{ $t('panelEditor.selected') }} <span class="font-medium">{{ selectedStationName }}</span>
                  </div>
                </div>

                <!-- UUID input -->
                <div class="col-span-4">
                  <label :class="['text-xs font-bold uppercase block mb-2', isDark ? 'text-gray-400' : 'text-gray-500']">{{ $t('panelEditor.uuid') }}</label>
                  <v-text-field
                    v-model="stationUuidInput"
                    density="compact"
                    variant="outlined"
                    hide-details
                    :placeholder="$t('panelEditor.uuidPlaceholder')"
                  />
                </div>

                <!-- Timeseries -->
                <div class="col-span-4">
                  <label :class="['text-xs font-bold uppercase block mb-2', isDark ? 'text-gray-400' : 'text-gray-500']">{{ $t('panelEditor.timeseries') }}</label>
                  <v-select
                    v-model="pegelTimeseries"
                    :items="timeseriesOptions"
                    item-title="title"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                    hide-details
                  />
                </div>

                <!-- Period -->
                <div class="col-span-4">
                  <label :class="['text-xs font-bold uppercase block mb-2', isDark ? 'text-gray-400' : 'text-gray-500']">{{ $t('panelEditor.period') }}</label>
                  <v-select
                    v-model="pegelPeriod"
                    :items="periodOptions"
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
            :class="['w-80 border-l overflow-y-auto flex flex-col shrink-0', isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200']"
          >
            <div :class="['p-4 border-b', isDark ? 'border-gray-700' : 'border-gray-100']">
              <h3 :class="['text-xs font-bold uppercase tracking-wide mb-3', isDark ? 'text-white' : 'text-gray-900']">
                {{ $t('panelEditor.visualization') }}
              </h3>
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="type in chartTypes"
                  :key="type.name"
                  @click="selectedChart = type.name"
                  :class="[
                    'cursor-pointer border rounded p-3 flex flex-col items-center justify-center transition hover:bg-blue-50',
                    selectedChart === type.name ? 'border-blue-500 bg-blue-50' : isDark ? 'border-gray-600' : 'border-gray-200',
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
                  >
                    {{ type.name }}
                  </span>
                </div>
              </div>
            </div>

            <div :class="['p-4 border-b', isDark ? 'border-gray-700' : 'border-gray-100']">
              <h3 :class="['text-xs font-bold uppercase tracking-wide mb-3', isDark ? 'text-white' : 'text-gray-900']">
                {{ $t('panelEditor.panelOptions') }}
              </h3>
              <div class="mb-4">
                <label :class="['text-xs mb-1 block', isDark ? 'text-gray-400' : 'text-gray-500']">{{ $t('panelEditor.panelTitle') }}</label>
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
import { useTheme } from 'vuetify'

import { createChartConfig } from '@/utils/chartFactory'
import { useDashboardPanels } from '@/composables/useDashboardPanels'
import { fetchPegelTimeseriesMeta, useDataFetcher } from '@/composables/useDataFetcher'

import { useI18n } from 'vue-i18n'

import type { ChartDataPoint } from '@/types/project.types'
import type {
  PegelPeriod,
  PegelTimeseries,
  PegelTimeseriesMeta,
  QueryConfig,
} from '@/composables/useDataFetcher'

/**
 * Query state used to build the Pegel request
 */
const pegelStation = ref<string>('ILMENAU') // UUID used for API (or station id)
const pegelTimeseries = ref<PegelTimeseries>('W')
const pegelPeriod = ref<PegelPeriod>('P7D')

const pegelMeta = ref<PegelTimeseriesMeta | null>(null)

const router = useRouter()
const route = useRoute()
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)
const { fetchData, loading: isLoadingData } = useDataFetcher()

const { t, locale } = useI18n()

/**
 * ✅ NEW: type guards for query params (keeps TS + lint happy)
 * Allows deep-link: /dashboard/editor/default_project?station=<uuid>&timeseries=W&period=P7D
 */
const isPegelTimeseries = (v: unknown): v is PegelTimeseries => v === 'W' || v === 'Q' || v === 'T'

const isPegelPeriod = (v: unknown): v is PegelPeriod =>
  v === 'P1D' || v === 'P3D' || v === 'P7D' || v === 'P14D' || v === 'P30D'

/**
 * ✅ NEW: safely read query param as string (Vue router can return string | string[])
 */
const getQueryString = (v: unknown): string => {
  if (Array.isArray(v)) return String(v[0] ?? '').trim()
  return typeof v === 'string' ? v.trim() : ''
}

/**
 * ✅ FIX (required): Normalize projectId as STRING always
 * This prevents panels from being saved under numeric key vs string key (e.g. 1 vs "1").
 */
const rawId = route.params.id
const projectId = String(
  Array.isArray(rawId) ? (rawId[0] ?? 'default_project') : (rawId ?? 'default_project'),
)

// Dashboard Panels API
const { addPanelToProject, updatePanelInProject, getPanel } = useDashboardPanels(projectId)

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
  return stations.value.filter((s) =>
    String(s.water ?? '')
      .toLowerCase()
      .includes(q),
  )
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

// Computed properties for i18n dropdown options
const timeseriesOptions = computed(() => [
  { title: t('timeseries.W'), value: 'W' },
  { title: t('timeseries.Q'), value: 'Q' },
  { title: t('timeseries.T'), value: 'T' },
])

const periodOptions = computed(() => [
  { title: t('periods.P1D'), value: 'P1D' },
  { title: t('periods.P3D'), value: 'P3D' },
  { title: t('periods.P7D'), value: 'P7D' },
  { title: t('periods.P14D'), value: 'P14D' },
  { title: t('periods.P30D'), value: 'P30D' },
])


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

// ✅ NEW: apply route query defaults (Channels -> Editor)
const applyQueryDefaultsFromRoute = (): void => {
  const qStation = getQueryString(route.query.station)
  const qTimeseries = getQueryString(route.query.timeseries)
  const qPeriod = getQueryString(route.query.period)

  if (qStation.length > 0) {
    pegelStation.value = qStation
    stationUuidInput.value = qStation

    // Sync dropdown selection if station exists in stations.json
    const match = stations.value.find((s) => String(s.uuid) === qStation)
    selectedStationUuid.value = match ? String(match.uuid) : ''
  }

  if (qTimeseries.length > 0 && isPegelTimeseries(qTimeseries)) {
    pegelTimeseries.value = qTimeseries
  }

  if (qPeriod.length > 0 && isPegelPeriod(qPeriod)) {
    pegelPeriod.value = qPeriod
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

// ✅ NEW: if query params change while on editor, update (non-edit mode only)
watch(
  () => route.query,
  () => {
    if (!isEditMode) applyQueryDefaultsFromRoute()
  },
)

// Load existing panel data if in edit mode
onMounted(async () => {
  await loadStations()

  /**
   * ✅ NEW: Apply query params when opening from Channels page.
   * Edit mode ALWAYS wins over query params (so we only apply when not editing).
   */
  if (!isEditMode) {
    applyQueryDefaultsFromRoute()
  }

  if (isEditMode) {
    const existingPanel = await getPanel(editingPanelId)
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
    pegelTimeseries.value === 'W' ? 'cm' : pegelTimeseries.value === 'Q' ? 'm³/s' : '°C'

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
]

const handleApply = async () => {
  const panelData = {
    id: isEditMode ? editingPanelId : Date.now().toString(),
    title: panelTitle.value,
    type: selectedChart.value,
    gridPos: { w: 6, h: 4 },
    queryConfig: queryConfig.value,
    chartOptions: chartOptions.value,
  }

  if (isEditMode) {
    await updatePanelInProject(panelData)
  } else {
    await addPanelToProject(panelData)
  }
  router.push(`/projects/${projectId}`)
}
</script>
