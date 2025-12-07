<template>
  <div class="flex h-screen bg-gray-50">
    <div class="flex-1 flex flex-col">
      <v-main class="h-full flex flex-col">
        
        <!-- HEADER -->
        <div class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2">
            <span class="text-lg font-medium text-gray-700">{{ panelTitle || 'Untitled Panel' }}</span>
            <v-chip size="x-small" variant="outlined" class="ml-2">Draft</v-chip>
          </div>
          <div class="flex items-center gap-3">
            <button @click="router.back()" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition">
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
              <div class="bg-white border border-gray-200 rounded-lg h-96 shadow-sm overflow-hidden relative">
                
                <!-- Loading Overlay -->
                <div v-if="isLoadingData" class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                  <span class="text-blue-600 font-medium">Loading Data...</span>
                </div>

                <ag-charts-vue 
                  v-if="chartOptions"
                  :options="chartOptions"
                  style="height: 100%; width: 100%;"
                />
              </div>
            </div>

            <!-- BOTTOM TABS: QUERY CONFIGURATION -->
            <div class="bg-white border-t border-gray-200 h-72 flex flex-col shrink-0 overflow-y-auto">
              <div class="border-b px-4">
                 <button class="px-4 py-2 text-sm font-medium border-b-2 border-blue-600 text-blue-600">Query</button>
                 <button class="px-4 py-2 text-sm font-medium text-gray-500">Transform</button>
              </div>

              <div class="p-6">
                <div class="grid grid-cols-12 gap-6">
                  
                  <!-- Source Type -->
                  <div class="col-span-3">
                    <label class="text-xs font-bold text-gray-500 uppercase block mb-2">Source Type</label>
                    <v-select
                      v-model="queryConfig.sourceType"
                      :items="['STATIC_JSON', 'REST_API']"
                      density="compact"
                      variant="outlined"
                      hide-details
                    ></v-select>
                  </div>

                  <!-- URL Input -->
                  <div class="col-span-9">
                     <label class="text-xs font-bold text-gray-500 uppercase block mb-2">
                       {{ queryConfig.sourceType === 'STATIC_JSON' ? 'File Path (/public)' : 'API Endpoint URL' }}
                     </label>
                     <v-text-field
                      v-model="queryConfig.url"
                      density="compact"
                      variant="outlined"
                      hide-details
                      placeholder="e.g. https://api.example.com/data"
                     ></v-text-field>
                     <p v-if="queryConfig.sourceType === 'REST_API'" class="text-xs text-gray-400 mt-1">
                       Tip: Input the api here. 
                       <!-- We will append  <code>?start=ISO_DATE</code> automatically. -->
                     </p>
                  </div>

                  <!-- Field Mapping -->
                  <div class="col-span-12 grid grid-cols-2 gap-6">
                    <div>
                      <label class="text-xs font-bold text-gray-500 uppercase block mb-2">Time Field (X-Axis)</label>
                      <v-text-field
                        v-model="queryConfig.mapping.x"
                        density="compact"
                        variant="outlined"
                        hide-details
                        placeholder="e.g. timestamp"
                      ></v-text-field>
                    </div>
                    <div>
                      <label class="text-xs font-bold text-gray-500 uppercase block mb-2">Value Field (Y-Axis)</label>
                       <v-text-field
                        v-model="queryConfig.mapping.y"
                        density="compact"
                        variant="outlined"
                        hide-details
                        placeholder="e.g. value"
                      ></v-text-field>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: VISUAL SETTINGS -->
          <div class="w-80 bg-white border-l border-gray-200 overflow-y-auto flex flex-col shrink-0">
             <!-- Same Sidebar Code as before -->
             <div class="p-4 border-b border-gray-100">
              <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">Visualization</h3>
              <div class="grid grid-cols-2 gap-2">
                <div 
                  v-for="type in chartTypes" 
                  :key="type.name"
                  @click="selectedChart = type.name"
                  :class="[
                    'cursor-pointer border rounded p-3 flex flex-col items-center justify-center transition hover:bg-blue-50',
                    selectedChart === type.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  ]"
                >
                  <v-icon :icon="type.icon" :class="selectedChart === type.name ? 'text-blue-600' : 'text-gray-400'"></v-icon>
                  <span :class="['text-xs mt-2', selectedChart === type.name ? 'text-blue-700 font-medium' : 'text-gray-500']">{{ type.name }}</span>
                </div>
              </div>
            </div>

            <div class="p-4 border-b border-gray-100">
              <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">Panel Options</h3>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { AgCharts } from 'ag-charts-vue3'
import { createChartConfig } from '@/utils/chartFactory'
import { useMockData } from '@/composables/useMockData'
import { useDataFetcher, type QueryConfig } from '@/composables/useDataFetcher'

const router = useRouter()
const route = useRoute()
const { addPanelToProject, updatePanelInProject, getPanel } = useMockData()
const { fetchData, loading: isLoadingData } = useDataFetcher()

// Project ID from URL
const rawId = route.params.id
const projectId: string | number = Array.isArray(rawId)
  ? rawId[0] ?? 'default_project'
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
const queryConfig = ref<QueryConfig>({
  sourceType: 'STATIC_JSON',
  url: '/mock_sensor_data.json', // Default example
  mapping: { x: 'timestamp', y: 'value' }
})

const previewData = ref<any[]>([]) // Holds the data for the editor preview

// Load existing panel data if in edit mode
onMounted(async () => {
  if (isEditMode) {
    const existingPanel = getPanel(projectId, editingPanelId)
    if (existingPanel) {
      panelTitle.value = existingPanel.title
      selectedChart.value = existingPanel.type
      
      // Load saved query config
      if (existingPanel.queryConfig) {
        queryConfig.value = existingPanel.queryConfig
      }
      
      // Trigger fetch for preview
      await refreshPreview()
    }
  } else {
    // Fetch default mock data on new panel load
    await refreshPreview()
  }
})

// Function to fetch data based on current config
const refreshPreview = async () => {
  previewData.value = await fetchData(queryConfig.value, '24h')
}

// Watch for changes in Query Config to update preview automatically
watch(queryConfig, () => {
  refreshPreview()
}, { deep: true })

// Chart Configuration (Computed so it updates when Title or Type changes)
const chartOptions = computed(() => {
  return createChartConfig(selectedChart.value, panelTitle.value, previewData.value)
})

const chartTypes = [
  { name: 'Time series', icon: 'mdi-chart-line' },
  { name: 'Bar chart', icon: 'mdi-chart-bar' },
  { name: 'Stat', icon: 'mdi-numeric' },
  { name: 'Gauge', icon: 'mdi-gauge' },
]

// Save
const handleApply = () => {
  const panelData = {
    id: isEditMode ? editingPanelId : Date.now().toString(),
    title: panelTitle.value,
    type: selectedChart.value,
    gridPos: { w: 6, h: 4 },
    queryConfig: queryConfig.value,
    chartOptions: chartOptions.value
  }

  if (isEditMode) {
    updatePanelInProject(projectId, panelData)
  } else {
    addPanelToProject(projectId, panelData)
  }
  router.push(`/projects/${projectId}`)
}
</script>
