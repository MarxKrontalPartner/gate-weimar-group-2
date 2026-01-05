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
                {{ $t('projectView.tabs.viewer') }}
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
                {{ $t('projectView.tabs.editor') }}
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
                {{ $t('projectView.tabs.settings') }}
              </button>
            </div>
          </div>

          <!-- Add Panel Button  -->
          <div v-if="activeTab === 'editor'">
            <button
              @click="goToChartEditor"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              <span>+</span> {{ $t('projectView.addPanel') }}
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
                {{ $t('projectView.noPanelsViewer') }}
              </div>
            </div>

            <!-- Read-Only Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
              <div
                v-for="panel in panels"
                :key="panel.id"
                class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[350px]"
              >
                <ag-charts-vue :options="panel.chartOptions" style="height: 100%; width: 100%" />
              </div>
            </div>
          </div>

          <!-- TAB 2: EDITOR (Visual Edit Mode) -->
          <div v-if="activeTab === 'editor' && isEditor" class="h-full">
            <div
              v-if="panels.length === 0"
              class="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50"
            >
              <v-btn color="primary" @click="goToChartEditor">{{ $t('projectView.createFirstPanel') }}</v-btn>
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
                    :title="$t('projectView.editPanel')"
                  >
                    <v-icon icon="mdi-pencil" size="small"></v-icon>
                  </button>
                  <button
                    @click="handleDeletePanel(panel.id)"
                    class="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-red-600"
                    :title="$t('projectView.deletePanel')"
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
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { Ref } from 'vue'
import { createChartConfig } from '@/utils/chartFactory'

// Composables
import { useMockData, type DashboardPanel } from '@/composables/useMockData'
import { useProjectDetail } from '@/composables/useProjectDetail'
import { useDataFetcher } from '@/composables/useDataFetcher'
import { useI18n } from 'vue-i18n'

// Components
import ProjectEditor from '@/components/project/ProjectEditor.vue'
import ProjectSettings from '@/components/project/ProjectSettings.vue'
import type { Project, Membership, User } from '@/types/project.types'

const router = useRouter()
const route = useRoute()
const { fetchData } = useDataFetcher()

// Fix for ID type safety
const rawId = route.params.id
const projectId = (Array.isArray(rawId) ? rawId[0] : rawId) as string

// Mock Data Logic
const { getProjectPanels, deletePanelFromProject } = useMockData()
const panels = ref<DashboardPanel[]>([])

// Use useI18n for script
const { t } = useI18n()

const refreshPanels = () => {
  panels.value = getProjectPanels(projectId)
}

const goToChartEditor = () => {
  router.push(`/dashboard/editor/${projectId}`)
}

const editPanel = (panelId: string) => {
  console.log('Edit panel', panelId)
  router.push(`/dashboard/editor/${projectId}?panelId=${panelId}`)
}

const handleDeletePanel = (panelId: string) => {
  if (confirm(t('projectView.deleteConfirm'))) {
    deletePanelFromProject(projectId, panelId)
    refreshPanels()
  }
}

const timeRange = ref('24h') // Usually connected to a dropdown in the UI

// Function to Hydrate Panels
const hydratePanelsWithData = async () => {
  for (const panel of panels.value) {
    // 1. Check if panel has configuration
    if (panel.queryConfig) {
      // 2. Fetch Data using the Service
      const realData = await fetchData(panel.queryConfig, timeRange.value)

      // 3. Update Chart Options with Real Data
      panel.chartOptions = createChartConfig(panel.type, panel.title, realData)
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

  // viewerChartOptions: Ref<AgChartOptions>
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

  // viewerChartOptions,
} = useProjectDetail() as ProjectDetailReturn

onMounted(async () => {
  await fetchProject()
  refreshPanels()
  await hydratePanelsWithData()
})
</script>
