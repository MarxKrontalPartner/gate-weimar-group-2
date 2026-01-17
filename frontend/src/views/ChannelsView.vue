<template>
  <div :class="['flex h-screen', isDark ? 'bg-gray-900' : 'bg-gray-50']">
    <div class="flex-1 flex flex-col">
      <v-main>
        <div class="p-8 h-full flex flex-col gap-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h1 :class="['text-2xl font-semibold', isDark ? 'text-white' : '']">
                {{ $t('channels.title') }}
              </h1>
              <p :class="['text-sm mt-1', isDark ? 'text-gray-400' : 'text-gray-600']">
                {{ $t('channels.description') }}
              </p>
            </div>

            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span :class="['text-sm', isDark ? 'text-gray-300' : 'text-gray-700']">{{
                  $t('channels.selectByRiver')
                }}</span>
                <v-switch v-model="selectByRiver" density="compact" hide-details inset />
              </div>

              <button
                class="px-4 py-2 text-sm font-medium bg-blue-700 text-white rounded shadow-sm hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!canVisualize"
                @click="handleVisualize"
                type="button"
              >
                {{ $t('channels.visualizeButton') }}
              </button>
            </div>
          </div>

          <!-- STATION SECTION -->
          <div
            :class="[
              'border rounded-lg shadow-sm p-5 flex-1 min-h-0',
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
            ]"
          >
            <div class="flex items-center justify-between gap-4 flex-wrap">
              <div class="min-w-[260px] flex-1">
                <label
                  :class="[
                    'text-xs font-bold uppercase block mb-2',
                    isDark ? 'text-gray-400' : 'text-gray-500',
                  ]"
                  >{{ $t('channels.stationLabel') }}</label
                >
                <v-text-field
                  v-model="stationSearch"
                  density="compact"
                  variant="outlined"
                  hide-details
                  clearable
                  :placeholder="$t('channels.searchStationPlaceholder')"
                />
              </div>

              <div class="min-w-[260px]">
                <label
                  :class="[
                    'text-xs font-bold uppercase block mb-2',
                    isDark ? 'text-gray-400' : 'text-gray-500',
                  ]"
                  >{{ $t('channels.selectedLabel') }}</label
                >

                <!-- River + Station + Reading -->
                <div :class="['text-sm', isDark ? 'text-gray-300' : 'text-gray-700']">
                  <span class="font-medium">{{ selectedStationRiver || '—' }}</span>
                  <span :class="isDark ? 'text-gray-500' : 'text-gray-500'"> · </span>
                  <span class="font-medium">{{ selectedStation?.shortname || '—' }}</span>
                  <span :class="isDark ? 'text-gray-500' : 'text-gray-500'"> · </span>
                  <span class="font-medium">{{ selectedTimeseries || '—' }}</span>
                </div>

                <p v-if="selectionError" class="text-xs text-red-500 mt-1">{{ selectionError }}</p>
              </div>
            </div>

            <div class="mt-5 h-[calc(100%-88px)] overflow-y-auto pr-1">
              <div v-if="loading" :class="['text-sm', isDark ? 'text-gray-400' : 'text-gray-600']">
                {{ $t('channels.loadingStations') }}
              </div>

              <div
                v-else-if="filteredStations.length === 0"
                :class="['text-sm', isDark ? 'text-gray-400' : 'text-gray-600']"
              >
                {{ $t('channels.noStationsFound') }}
              </div>

              <!-- SMALLER + CENTERED GRID + UP TO 5 COLUMNS -->
              <div
                v-else
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 mx-auto w-full max-w-[1700px]"
              >
                <div
                  v-for="st in filteredStations"
                  :key="st.uuid"
                  :class="[
                    'border rounded-md p-3 shadow-sm transition cursor-pointer',
                    isDark ? 'bg-gray-700' : 'bg-white',
                    st.uuid === selectedStationUuid
                      ? 'border-blue-500 ring-1 ring-blue-200'
                      : isDark
                        ? 'border-gray-600'
                        : 'border-gray-200',
                    shakeStationUuid === st.uuid ? 'shake' : '',
                  ]"
                  @click="handleStationClick(st.uuid)"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <div
                        :class="[
                          'text-[13px] font-semibold truncate',
                          isDark ? 'text-white' : 'text-gray-900',
                        ]"
                      >
                        {{ st.shortname }}
                      </div>
                      <div
                        :class="[
                          'text-[11px] truncate',
                          isDark ? 'text-gray-400' : 'text-gray-500',
                        ]"
                      >
                        {{ st.water || '—' }}
                      </div>
                    </div>
                  </div>

                  <!-- ✅ Show ONLY available chips -->
                  <div class="mt-2 flex flex-wrap gap-1.5">
                    <button
                      v-for="ts in timeseriesButtons.filter((t) => t.available(st))"
                      :key="ts.value"
                      class="px-2 py-1 text-[11px] rounded border transition"
                      :class="getTimeseriesChipClass(st.uuid, ts.value, true)"
                      @click.stop="handleTimeseriesPick(st.uuid, ts.value, true)"
                      type="button"
                    >
                      {{ ts.value }}
                    </button>
                  </div>

                  <div :class="['mt-2 text-[11px]', isDark ? 'text-gray-400' : 'text-gray-500']">
                    <span :class="['font-medium', isDark ? 'text-gray-300' : 'text-gray-700']"
                      >Available:</span
                    >
                    <span class="ml-1">{{ availableLabel(st) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIVER DRAWER (stays visible while selectByRiver is ON) -->
        <v-navigation-drawer
          v-model="riverDrawer"
          location="right"
          :width="360"
          :temporary="false"
          :permanent="selectByRiver"
          :class="isDark ? 'border-l border-gray-700' : 'border-l border-gray-200'"
        >
          <div class="p-5">
            <div class="flex items-center justify-between">
              <h2 :class="['text-sm font-semibold', isDark ? 'text-white' : 'text-gray-900']">
                {{ $t('channels.riversTitle') }}
              </h2>

              <button
                :class="[
                  'text-sm',
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900',
                ]"
                type="button"
                @click="riverDrawer = false"
              >
                {{ $t('common.close') }}
              </button>
            </div>

            <div class="mt-4">
              <v-text-field
                v-model="riverSearch"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                :placeholder="$t('channels.searchRiverPlaceholder')"
              />
            </div>

            <div class="mt-3">
              <button
                class="w-full text-left px-3 py-2 text-sm rounded border transition"
                :class="
                  selectedRiver ? 'border-gray-200 hover:bg-gray-50' : 'border-blue-500 bg-blue-50'
                "
                type="button"
                @click="selectRiver('')"
              >
                {{ $t('channels.allRiversButton') }}
              </button>
            </div>

            <div class="mt-3 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
              <div class="flex flex-col gap-2">
                <button
                  v-for="r in filteredRivers"
                  :key="r"
                  class="w-full text-left px-3 py-2 text-sm rounded border transition"
                  :class="
                    r === selectedRiver
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  "
                  type="button"
                  @click="selectRiver(r)"
                >
                  {{ r }}
                </button>
              </div>
            </div>
          </div>
        </v-navigation-drawer>
      </v-main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'

type PegelTimeseries = 'W' | 'Q' | 'T'

type StationRow = {
  shortname: string
  uuid: string
  water?: string
  hasW: boolean
  hasQ: boolean
  hasT: boolean
}

const router = useRouter()

const { t } = useI18n()
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

const loading = ref(false)
const stations = ref<StationRow[]>([])

const stationSearch = ref('')
const riverSearch = ref('')

const selectByRiver = ref(false)
const riverDrawer = ref(false)

const selectedRiver = ref('')
const selectedStationUuid = ref('')
const selectedTimeseries = ref<PegelTimeseries | ''>('')
const selectionError = ref('')

const shakeStationUuid = ref('')

const timeseriesButtons: Array<{ value: PegelTimeseries; available: (s: StationRow) => boolean }> =
  [
    { value: 'W', available: (s) => s.hasW },
    { value: 'Q', available: (s) => s.hasQ },
    { value: 'T', available: (s) => s.hasT },
  ]

/**
 * Helpers (TS + lint friendly)
 */
const normalize = (v: unknown): string => String(v ?? '').trim()

const isTruthyCell = (v: unknown): boolean => {
  const s = normalize(v).toLowerCase()
  if (!s) return false
  if (s === '0' || s === 'false' || s === 'no' || s === 'n' || s === '-') return false
  return true
}

const pickKey = (row: Record<string, unknown>, candidates: string[]): string | null => {
  const keys = Object.keys(row)
  const lower = new Map(keys.map((k) => [k.toLowerCase().trim(), k] as const))
  for (const c of candidates) {
    const k = lower.get(c.toLowerCase().trim())
    if (k) return k
  }
  return null
}

/**
 * ✅ UPDATED: derive availability from either lowercase keys (w/q/t) OR uppercase (W/Q/T) etc.
 */
const deriveAvailability = (
  row: Record<string, unknown>,
): { hasW: boolean; hasQ: boolean; hasT: boolean } => {
  const wKey = pickKey(row, ['w', 'W', 'w_available', 'has_w', 'timeseries_w'])
  const qKey = pickKey(row, ['q', 'Q', 'q_available', 'has_q', 'timeseries_q'])
  const tKey = pickKey(row, ['t', 'T', 't_available', 'has_t', 'timeseries_t'])

  // If there are no availability hints at all, default to true
  if (!wKey && !qKey && !tKey) return { hasW: true, hasQ: true, hasT: true }

  return {
    hasW: wKey ? isTruthyCell(row[wKey]) : false,
    hasQ: qKey ? isTruthyCell(row[qKey]) : false,
    hasT: tKey ? isTruthyCell(row[tKey]) : false,
  }
}

const isNotNull = <T,>(v: T | null): v is T => v !== null
const getValue = (r: Record<string, unknown>, key: string): unknown => r[key]

/**
 * Load stations from /public.
 * Supports:
 * - /public/stations.json OR /public/stations/stations.json
 * - /public/stations.xlsx OR /public/stations/stations.xlsx (and .xls)
 */
const loadStationsFromPublic = async (): Promise<StationRow[]> => {
  // 1) Try JSON first
  const jsonCandidates = ['/stations.json', '/stations/stations.json']

  for (const url of jsonCandidates) {
    try {
      const res = await fetch(url)
      if (!res.ok) continue

      const raw = (await res.json()) as Array<Record<string, unknown>>

      const parsed = raw
        .map((r) => {
          const shortname = normalize(
            getValue(r, 'shortname') ??
              getValue(r, 'name') ??
              getValue(r, 'station') ??
              getValue(r, 'station_name'),
          )

          const uuid = normalize(
            getValue(r, 'uuid') ?? getValue(r, 'id') ?? getValue(r, 'station_uuid'),
          )

          const water = normalize(
            getValue(r, 'water') ?? getValue(r, 'river') ?? getValue(r, 'fluss'),
          )

          if (!shortname || !uuid) return null

          // ✅ NEW: derive from row (W/Q/T columns etc.) first
          const derived = deriveAvailability(r)

          // If JSON explicitly provides booleans, those win; otherwise derived values are used.
          const hasWRaw = getValue(r, 'hasW')
          const hasQRaw = getValue(r, 'hasQ')
          const hasTRaw = getValue(r, 'hasT')

          const hasW = typeof hasWRaw === 'boolean' ? hasWRaw : derived.hasW
          const hasQ = typeof hasQRaw === 'boolean' ? hasQRaw : derived.hasQ
          const hasT = typeof hasTRaw === 'boolean' ? hasTRaw : derived.hasT

          const station: StationRow = { shortname, uuid, water, hasW, hasQ, hasT }
          return station
        })
        .filter(isNotNull)

      return parsed.sort((a, b) => a.shortname.localeCompare(b.shortname))
    } catch {
      continue
    }
  }

  // 2) If JSON not found, try Excel
  const excelCandidates = [
    '/stations.xlsx',
    '/stations.xls',
    '/stations/stations.xlsx',
    '/stations/stations.xls',
  ]

  const tryFetchArrayBuffer = async (url: string): Promise<ArrayBuffer | null> => {
    try {
      const res = await fetch(url)
      if (!res.ok) return null
      return await res.arrayBuffer()
    } catch {
      return null
    }
  }

  let data: ArrayBuffer | null = null
  for (const url of excelCandidates) {
    data = await tryFetchArrayBuffer(url)
    if (data) break
  }

  if (!data) {
    throw new Error(
      'No stations file found. Add stations.json or stations.xlsx to /public (or /public/stations/).',
    )
  }

  const XLSX = await import('xlsx')
  const wb = XLSX.read(data, { type: 'array' })
  const firstSheetName = wb.SheetNames[0]
  if (!firstSheetName) return []

  const sheet = wb.Sheets[firstSheetName]
  if (!sheet) return []

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })

  const out: StationRow[] = []
  for (const r of rows) {
    const shortKey = pickKey(r, ['shortname', 'station', 'name', 'station_name'])
    const uuidKey = pickKey(r, ['uuid', 'id', 'station_uuid'])
    const waterKey = pickKey(r, ['water', 'river', 'fluss'])

    const shortname = shortKey ? normalize(r[shortKey]) : ''
    const uuid = uuidKey ? normalize(r[uuidKey]) : ''
    const water = waterKey ? normalize(r[waterKey]) : ''

    if (!shortname || !uuid) continue

    const { hasW, hasQ, hasT } = deriveAvailability(r)
    out.push({ shortname, uuid, water, hasW, hasQ, hasT })
  }

  return out.sort((a, b) => a.shortname.localeCompare(b.shortname))
}

/**
 * Rivers derived from stations.
 */
const allRivers = computed<string[]>(() => {
  const set = new Set<string>()
  for (const s of stations.value) {
    const r = normalize(s.water)
    if (r) set.add(r)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

watch(selectByRiver, (v) => {
  if (v) {
    riverDrawer.value = true
  } else {
    riverDrawer.value = false
    selectedRiver.value = ''
    riverSearch.value = ''
  }
})

const filteredRivers = computed<string[]>(() => {
  const q = riverSearch.value.trim().toLowerCase()
  if (!q) return allRivers.value
  return allRivers.value.filter((r) => r.toLowerCase().includes(q))
})

const filteredStations = computed<StationRow[]>(() => {
  const q = stationSearch.value.trim().toLowerCase()
  const river = selectedRiver.value.trim().toLowerCase()

  return stations.value.filter((s) => {
    const matchesName = !q || s.shortname.toLowerCase().includes(q)
    const matchesRiver = !river || normalize(s.water).toLowerCase() === river
    return matchesName && matchesRiver
  })
})

const selectedStation = computed<StationRow | null>(() => {
  const uuid = selectedStationUuid.value
  if (!uuid) return null
  return stations.value.find((s) => s.uuid === uuid) ?? null
})

const selectedStationRiver = computed<string>(() => {
  const st = selectedStation.value
  const fromStation = st ? normalize(st.water) : ''
  return fromStation || selectedRiver.value || ''
})

const canVisualize = computed<boolean>(() => {
  const st = selectedStation.value
  const ts = selectedTimeseries.value
  if (!st || !ts) return false
  if (ts === 'W' && !st.hasW) return false
  if (ts === 'Q' && !st.hasQ) return false
  if (ts === 'T' && !st.hasT) return false
  return true
})

const availableLabel = (s: StationRow): string => {
  const list: PegelTimeseries[] = []
  if (s.hasW) list.push('W')
  if (s.hasQ) list.push('Q')
  if (s.hasT) list.push('T')
  return list.length ? list.join(', ') : '—'
}

const vibrate = (uuid: string): void => {
  shakeStationUuid.value = uuid
  setTimeout(() => {
    if (shakeStationUuid.value === uuid) shakeStationUuid.value = ''
  }, 500)
}

const selectRiver = (river: string): void => {
  selectedRiver.value = river
  selectionError.value = ''

  if (river) {
    const st = selectedStation.value
    if (st && normalize(st.water).toLowerCase() !== river.trim().toLowerCase()) {
      selectedStationUuid.value = ''
      selectedTimeseries.value = ''
    }
  }
}

const handleStationClick = (uuid: string): void => {
  selectionError.value = ''
  selectedStationUuid.value = uuid

  const st = selectedStation.value
  const ts = selectedTimeseries.value

  if (st && ts) {
    const ok = (ts === 'W' && st.hasW) || (ts === 'Q' && st.hasQ) || (ts === 'T' && st.hasT)

    if (!ok) {
      selectedTimeseries.value = ''
      selectionError.value = t('channels.errors.readingNotAvailable')
      vibrate(uuid)
    }
  }

  if (!selectedTimeseries.value) vibrate(uuid)
}

const handleTimeseriesPick = (uuid: string, ts: PegelTimeseries, isAvailable: boolean): void => {
  selectionError.value = ''
  selectedStationUuid.value = uuid

  if (!isAvailable) {
    selectionError.value = t('channels.errors.readingNotAvailableShort')
    vibrate(uuid)
    return
  }
  selectedTimeseries.value = ts
}

const getTimeseriesChipClass = (
  stationUuid: string,
  ts: PegelTimeseries,
  isAvailable: boolean,
): string[] => {
  const isSelected = selectedStationUuid.value === stationUuid && selectedTimeseries.value === ts
  if (!isAvailable) return ['border-gray-200', 'text-gray-300', 'bg-gray-50', 'cursor-not-allowed']
  if (isSelected) return ['border-blue-500', 'bg-blue-50', 'text-blue-700']
  return ['border-gray-200', 'bg-white', 'text-gray-700', 'hover:bg-gray-50']
}

const handleVisualize = (): void => {
  const st = selectedStation.value
  const ts = selectedTimeseries.value

  if (!st || !ts) {
    if (st) vibrate(st.uuid)
    selectionError.value = t('channels.errors.selectStationAndReading')
    return
  }

  const activeProjectId = localStorage.getItem('mkp_active_project_id') || 'default_project'

  router.push({
    path: `/dashboard/editor/${activeProjectId}`,
    query: {
      station: st.uuid,
      timeseries: ts,
      period: 'P7D',
    },
  })
}

onMounted(async () => {
  loading.value = true
  try {
    stations.value = await loadStationsFromPublic()
    if (stations.value.length === 0) {
      selectionError.value = t('channels.errors.noValidStations')
    }
  } catch (e) {
    console.warn(e)
    selectionError.value = t('channels.errors.failedToLoadStations')
    stations.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@keyframes shake {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-6px);
  }
  40% {
    transform: translateX(6px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
  100% {
    transform: translateX(0);
  }
}

.shake {
  animation: shake 0.45s ease-in-out;
}
</style>
