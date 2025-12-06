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
              Apply to Dashboard
            </button>
          </div>
        </div>

        <!-- WORKSPACE -->
        <div class="flex-1 flex overflow-hidden">
          
          <!-- LEFT: PREVIEW -->
          <div class="flex-1 flex flex-col bg-slate-50 min-w-0">
            <div class="flex-1 p-6 overflow-y-auto">
              
              <!-- Preview Chart Container -->
              <div class="bg-white border border-gray-200 rounded-lg h-96 shadow-sm overflow-hidden">
                <!-- AG CHART COMPONENT -->
                <ag-charts-vue 
                  v-if="chartOptions"
                  :options="chartOptions"
                  style="height: 100%; width: 100%;"
                />
              </div>

            </div>

            <!-- Bottom Tabs (Static for now) -->
            <div class="bg-white border-t border-gray-200 h-64 flex flex-col shrink-0">
               <div class="p-4 text-gray-400 text-sm text-center mt-10">
                 Query builder configurations would go here...
               </div>
            </div>
          </div>

          <!-- RIGHT: SETTINGS -->
          <div class="w-80 bg-white border-l border-gray-200 overflow-y-auto flex flex-col shrink-0">
            
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
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { AgCharts } from 'ag-charts-vue3'
import { createChartConfig } from '@/utils/chartFactory'
import { useMockData } from '@/composables/useMockData' 

const router = useRouter()
const route = useRoute()
const { addPanelToProject } = useMockData()

// Project ID from URL (passed when navigating here)
const rawId = route.params.id
const projectId: string | number = Array.isArray(rawId)
  ? rawId[0] ?? 'default_project'
  : rawId !== undefined
    ? rawId
    : 'default_project'

// State
const selectedChart = ref('Time series')
const panelTitle = ref('New Panel')

// Chart Configuration (Computed so it updates when Title or Type changes)
const chartOptions = computed(() => {
  return createChartConfig(selectedChart.value, panelTitle.value)
})

const chartTypes = [
  { name: 'Time series', icon: 'mdi-chart-line' },
  { name: 'Bar chart', icon: 'mdi-chart-bar' },
  { name: 'Stat', icon: 'mdi-numeric' },
  { name: 'Gauge', icon: 'mdi-gauge' },
]

// Apply Action
const handleApply = () => {
  // 1. Construct the Panel Object
  const newPanel = {
    id: Date.now().toString(),
    title: panelTitle.value,
    type: selectedChart.value,
    gridPos: { w: 6, h: 4 }, // Default size for grid
    chartOptions: chartOptions.value // Save the generated config
  }

  // 2. Save to Mock Store
  addPanelToProject(projectId, newPanel)

  // 3. Navigate back to the Project Detail view
  router.push(`/projects/${projectId}`)
}
</script>