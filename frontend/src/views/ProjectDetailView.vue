<template>
  <div class="flex h-screen bg-gray-50">
    <v-main>
      <div class="flex-1 flex flex-col">
        <!-- TOP BAR -->
        <header
          class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6"
        >
          <div class="flex items-center gap-3">
            <h1 class="text-m font-semibold">{{ projectName }}</h1>

            <!-- TABS -->
            <div class="flex items-center gap-3 ml-10">
              <!-- 1. Viewer Tab -->
              <button
                @click="activeTab = 'viewer'"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition"
                :class="
                  activeTab === 'viewer'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                "
              >
                Viewer
              </button>

              <!-- 2. Editor Tab -->
              <button
                v-if="isEditor"
                @click="activeTab = 'editor'"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition"
                :class="
                  activeTab === 'editor'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                "
              >
                Editor
              </button>

              <!-- 3. Settings Tab -->
              <button
                v-if="isEditor"
                @click="activeTab = 'settings'"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition"
                :class="
                  activeTab === 'settings'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                "
              >
                Settings
              </button>
            </div>
          </div>

          <!-- Add Panel Button  -->
          <div v-if="activeTab === 'editor'">
            <button
              @click="goToChartEditor"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              <span>+</span> Add Panel
            </button>
          </div>
        </header>

        <!-- MAIN CONTENT -->
        <main class="p-8 text-gray-800 text-sm h-full overflow-y-auto">
          <!-- TAB 1: VIEWER (Read Only) -->
          <div v-if="activeTab === 'viewer'" class="h-full">
            <div
              v-if="panels.length === 0"
              class="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50"
            >
              <div class="text-gray-400 mb-4">
                No panels to display. Switch to Editor mode to add one.
              </div>
            </div>

            <!-- Read-Only Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
              <div
                v-for="panel in panels"
                :key="panel.id"
                class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[350px] cursor-pointer hover:shadow-md transition"
                @click="openPanel(panel)"
              >
                <!-- Header row with title + info icon -->
                <div class="flex items-center justify-between mb-2">
                  <div class="text-sm font-semibold text-gray-800 truncate">
                    {{ panel.title }}
                  </div>

                  <v-tooltip location="bottom">
                    <template #activator="{ props }">
                      <!-- stop click so it doesn't open modal when clicking the icon -->
                      <v-btn
                        v-bind="props"
                        icon
                        variant="text"
                        size="small"
                        class="text-gray-500"
                        @click.stop
                      >
                        <v-icon icon="mdi-information-outline" size="small" />
                      </v-btn>
                    </template>

                    <div class="text-xs leading-5">
                      <div>
                        <span class="font-medium">Station:</span>
                        {{ getPanelInfo(panel).stationName }}
                      </div>
                      <div>
                        <span class="font-medium">UUID:</span> {{ getPanelInfo(panel).uuid }}
                      </div>
                      <div>
                        <span class="font-medium">River:</span> {{ getPanelInfo(panel).river }}
                      </div>
                      <div>
                        <span class="font-medium">Timeseries:</span>
                        {{ getPanelInfo(panel).timeseries }}
                      </div>
                    </div>
                  </v-tooltip>
                </div>

                <!-- Chart -->
                <div class="flex-1 min-h-0">
                  <ag-charts-vue :options="panel.chartOptions" style="height: 100%; width: 100%" />
                </div>
              </div>
            </div>

            <!-- Fullscreen Modal -->
            <div v-if="expandedPanel" class="fixed inset-0 z-50 flex items-center justify-center">
              <!-- overlay (click closes) -->
              <div
                class="absolute inset-0 bg-black/40 backdrop-blur-sm"
                @click="closeExpanded"
              ></div>

              <!-- modal content -->
              <div
                class="relative z-10 w-[95vw] max-w-6xl bg-white rounded-xl shadow-xl border border-gray-200"
              >
                <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div class="text-sm font-semibold text-gray-900 truncate">
                    {{ expandedPanel.title }}
                  </div>

                  <div class="flex items-center gap-2">
                    <v-tooltip location="bottom">
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon
                          variant="text"
                          size="small"
                          class="text-gray-600"
                        >
                          <v-icon icon="mdi-information-outline" size="small" />
                        </v-btn>
                      </template>

                      <div class="text-xs leading-5">
                        <div>
                          <span class="font-medium">Station:</span>
                          {{ getPanelInfo(expandedPanel).stationName }}
                        </div>
                        <div>
                          <span class="font-medium">UUID:</span>
                          {{ getPanelInfo(expandedPanel).uuid }}
                        </div>
                        <div>
                          <span class="font-medium">River:</span>
                          {{ getPanelInfo(expandedPanel).river }}
                        </div>
                        <div>
                          <span class="font-medium">Timeseries:</span>
                          {{ getPanelInfo(expandedPanel).timeseries }}
                        </div>
                      </div>
                    </v-tooltip>

                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      class="text-gray-600"
                      @click="closeExpanded"
                    >
                      <v-icon icon="mdi-close" size="small" />
                    </v-btn>
                  </div>
                </div>

                <div class="p-4">
                  <div class="h-[70vh] w-full">
                    <ag-charts-vue
                      :options="expandedPanel.chartOptions"
                      style="height: 100%; width: 100%"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: EDITOR (Visual Edit Mode) -->
          <div v-if="activeTab === 'editor' && isEditor" class="h-full">
            <div
              v-if="panels.length === 0"
              class="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50"
            >
              <v-btn color="primary" @click="goToChartEditor">Create First Panel</v-btn>
            </div>

            <!-- Editable Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
              <div
                v-for="panel in panels"
                :key="panel.id"
                class="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[350px] relative group hover:shadow-md transition"
              >
                <!-- Edit Controls Overlay -->
                <div
                  class="absolute top-2 right-2 flex gap-1 z-10 bg-white/90 p-1 rounded-md border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <button
                    @click="editPanel(panel.id)"
                    class="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600"
                    title="Edit Panel"
                  >
                    <v-icon icon="mdi-pencil" size="small"></v-icon>
                  </button>
                  <button
                    @click="handleDeletePanel(panel.id)"
                    class="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-red-600"
                    title="Delete Panel"
                  >
                    <v-icon icon="mdi-trash-can-outline" size="small"></v-icon>
                  </button>
                </div>

                <!-- Chart -->
                <div class="p-4 h-full w-full">
                  <ag-charts-vue :options="panel.chartOptions" style="height: 100%; width: 100%" />
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 3: MEMBERS (Renamed from old Editor Tab) -->
          <ProjectEditor
            v-if="activeTab === 'members' && isEditor"
            :members="members"
            :changeRole="changeRole"
            :removeMember="removeMember"
            :project="project"
            :isEditor="isEditor"
          />

          <!-- TAB 4: SETTINGS -->
          <ProjectSettings
            v-if="activeTab === 'settings' && isEditor"
            :project="project"
            :projectName="projectName"
            :members="members"
            :isOwner="isOwner"
            :isEditor="isEditor"
            :userSearch="userSearch"
            :userSuggestions="userSuggestions"
            :selectedUser="selectedUser"
            :showDeleteModal="showDeleteModal"
            :deleteInput="deleteInput"
            :saveName="saveName"
            :searchUsers="searchUsers"
            :selectUser="selectUser"
            :addSelectedUser="addSelectedUser"
            :changeRole="changeRole"
            :removeMember="removeMember"
            :deleteProject="deleteProject"
            @update:projectName="projectName = $event"
            @update:userSearch="userSearch = $event"
            @update:deleteInput="deleteInput = $event"
            @update:showDeleteModal="showDeleteModal = $event"
          />
        </main>
      </div>
    </v-main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { Ref } from 'vue'
import { createChartConfig } from '@/utils/chartFactory'

// Composables
import { useDashboardPanels, type DashboardPanel } from '@/composables/useDashboardPanels'
import { useProjectDetail } from '@/composables/useProjectDetail'
import { fetchPegelTimeseriesMeta, useDataFetcher } from '@/composables/useDataFetcher'

// Components
import ProjectEditor from '@/components/project/ProjectEditor.vue'
import ProjectSettings from '@/components/project/ProjectSettings.vue'
import type { Project, Membership, User, ChartDataPoint } from '@/types/project.types'
import type { PegelTimeseries, PegelTimeseriesMeta } from '@/composables/useDataFetcher'

const router = useRouter()
const route = useRoute()
const { fetchData } = useDataFetcher()

// Fix for ID type safety
const rawId = route.params.id
const projectId = String(Array.isArray(rawId) ? rawId[0] ?? '' : rawId ?? '')

// Dashboard Panels API
const { getProjectPanels, deletePanelFromProject, loading: panelsLoading, error: panelsError } = useDashboardPanels(projectId)
const panels = ref<DashboardPanel[]>([])

const refreshPanels = async () => {
  panels.value = await getProjectPanels()
}

const goToChartEditor = () => {
  router.push(`/dashboard/editor/${projectId}`)
}

const editPanel = (panelId: string) => {
  console.log('Edit panel', panelId)
  router.push(`/dashboard/editor/${projectId}?panelId=${panelId}`)
}

const handleDeletePanel = async (panelId: string) => {
  if (confirm('Are you sure you want to delete this panel?')) {
    await deletePanelFromProject(panelId)
    await refreshPanels()
  }
}

const timeRange = ref('24h') // Usually connected to a dropdown in the UI

// ---- NEW: Load stations.json for stationName + river in viewer tooltip ----
type StationOption = {
  shortname: string
  uuid: string
  water?: string
  [key: string]: unknown
}

const stations = ref<StationOption[]>([])

const loadStations = async (): Promise<void> => {
  const res = await fetch('/stations.json')
  stations.value = (await res.json()) as StationOption[]
}

const findStationByUuid = (uuid: string): StationOption | undefined => {
  return stations.value.find((s) => String(s.uuid) === uuid)
}

const getPanelInfo = (panel: DashboardPanel) => {
  const qc = panel.queryConfig
  if (qc && qc.sourceType === 'PEGEL') {
    const st = findStationByUuid(qc.station)
    return {
      stationName: st ? String(st.shortname) : qc.station,
      uuid: qc.station,
      river: st ? String(st.water ?? '-') : '-',
      timeseries: qc.timeseries,
    }
  }

  return {
    stationName: '-',
    uuid: '-',
    river: '-',
    timeseries: '-',
  }
}

// ---- NEW: Build viewer chartOptions exactly like editor (axes + tooltip + marker) ----
const buildPegelChartOptions = (
  panel: DashboardPanel,
  data: ChartDataPoint[],
  meta: PegelTimeseriesMeta | null,
): unknown => {
  const base = createChartConfig(panel.type, panel.title, data)

  const qc = panel.queryConfig
  if (!qc || qc.sourceType !== 'PEGEL') return base

  const defaultTitle =
    qc.timeseries === 'W' ? 'Water Level' : qc.timeseries === 'Q' ? 'Discharge' : 'Temperature'

  const defaultUnit = qc.timeseries === 'W' ? 'cm' : qc.timeseries === 'Q' ? 'm³/s' : '°C'

  const station = findStationByUuid(qc.station)
  const stationLabel = station ? String(station.shortname) : qc.station

  const titleText = meta?.longname ?? defaultTitle
  const unitText = meta?.unit ?? defaultUnit
  const subtitleText = `${stationLabel} · ${qc.timeseries} · ${qc.period}`

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
}

// Function to Hydrate Panels
const hydratePanelsWithData = async () => {
  for (const panel of panels.value) {
    // 1. Check if panel has configuration
    if (panel.queryConfig) {
      // 2. Fetch Data using the Service
      const realData = await fetchData(panel.queryConfig, timeRange.value)

      // ---- NEW: If PEGEL, apply same chart styling as editor ----
      if (panel.queryConfig.sourceType === 'PEGEL') {
        let meta: PegelTimeseriesMeta | null = null
        try {
          meta = await fetchPegelTimeseriesMeta({
            station: panel.queryConfig.station,
            timeseries: panel.queryConfig.timeseries as PegelTimeseries,
          })
        } catch {
          meta = null
        }
        panel.chartOptions = buildPegelChartOptions(
          panel,
          realData,
          meta,
        ) as DashboardPanel['chartOptions']
      } else {
        panel.chartOptions = createChartConfig(panel.type, panel.title, realData)
      }
    }
  }
}

type ProjectDetailReturn = {
  project: Ref<Project>
  projectName: Ref<string>
  members: Ref<Membership[]>
  userSearch: Ref<string>
  userSuggestions: Ref<User[]>
  selectedUser: Ref<User | null>
  activeTab: Ref<string>

  showDeleteModal: Ref<boolean>
  deleteInput: Ref<string>

  isOwner: Ref<boolean>
  isEditor: Ref<boolean>

  fetchProject: () => Promise<void>
  saveName: () => Promise<void>
  deleteProject: () => Promise<void>

  searchUsers: () => Promise<void>
  selectUser: (u: User) => void
  addSelectedUser: () => Promise<void>

  changeRole: (m: Membership) => Promise<void>
  removeMember: (m: Membership) => Promise<void>
}

const {
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
} = useProjectDetail() as ProjectDetailReturn

// ---- NEW: Expanded panel modal state ----
const expandedPanel = ref<DashboardPanel | null>(null)

const openPanel = (panel: DashboardPanel) => {
  expandedPanel.value = panel
}

const closeExpanded = () => {
  expandedPanel.value = null
}

/**
 * ✅ FIX (required): Vue reuses the same component instance.
 * After returning from editor -> viewer, onMounted does NOT run again.
 * So we refresh panels whenever route changes.
 */
watch(
  () => route.fullPath,
  async () => {
    refreshPanels()
    await hydratePanelsWithData()
  },
)

/**
 * ✅ FIX (required): When changing project id, also refresh and update active project id.
 */
watch(
  () => route.params.id,
  async (newId) => {
    const pid = String(Array.isArray(newId) ? newId[0] ?? '' : newId ?? '')
    if (!pid) return

    localStorage.setItem('mkp_active_project_id', pid)
    panels.value = getProjectPanels(pid)
    await hydratePanelsWithData()
  },
)

onMounted(async () => {
  // ✅ remember current project for Channels page
  localStorage.setItem('mkp_active_project_id', projectId)

  await fetchProject()
  await loadStations()
  await refreshPanels()
  await hydratePanelsWithData()
})
</script>
