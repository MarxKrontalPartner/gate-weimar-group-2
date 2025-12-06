<template>
  <div class="flex h-screen bg-gray-50">
    <v-main>
      <div class="flex-1 flex flex-col">

        <!-- TOP BAR -->
        <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div class="flex items-center gap-3">
            <h1 class="text-m font-semibold">{{ projectName }}</h1>

            <!-- TABS -->
            <div class="flex items-center gap-3 ml-10">

              <button
                @click="activeTab = 'viewer'"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition"
                :class="activeTab === 'viewer'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'">
                Viewer
              </button>

              <button
                v-if="isEditor"
                @click="activeTab = 'editor'"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition"
                :class="activeTab === 'editor'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'">
                Editor
              </button>

              <button
                v-if="isEditor"
                @click="activeTab = 'settings'"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition"
                :class="activeTab === 'settings'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'">
                Settings
              </button>

            </div>
          </div>

          <div v-if="isEditor && activeTab === 'viewer'">
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

          <!-- TAB 1: DASHBOARD VIEWER -->
          <div v-if="activeTab === 'viewer'" class="h-full">
            
            <!-- Empty State -->
            <div v-if="panels.length === 0" class="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
              <div class="text-gray-400 mb-4">No charts added yet</div>
              <button 
                v-if="isEditor"
                @click="goToChartEditor"
                class="text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first panel
              </button>
            </div>

            <!-- Chart Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
              <div 
                v-for="panel in panels" 
                :key="panel.id" 
                class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[350px]"
              >
                <ag-charts 
                  :options="panel.chartOptions"
                  style="height: 100%; width: 100%;"
                />
              </div>
            </div>
          </div>

          <!-- TAB 2: MEMBER EDITOR -->
          <ProjectEditor
            v-if="activeTab === 'editor' && isEditor"
            :members="members"
            :changeRole="changeRole"
            :removeMember="removeMember"
            :project="project"
            :isEditor="isEditor"
          />

          <!-- TAB 3: SETTINGS -->
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
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { Ref } from "vue";

import { AgCharts } from "ag-charts-vue3";
import { useMockData } from "@/composables/useMockData"; // Ensure you created this file from previous response
import ProjectEditor from "@/components/project/ProjectEditor.vue";
import ProjectSettings from "@/components/project/ProjectSettings.vue";
import { useProjectDetail } from "@/composables/useProjectDetail";

// ---- Router Logic ----
const router = useRouter();
const route = useRoute();

const rawId = route.params.id
const projectId = (Array.isArray(rawId) ? rawId[0] : rawId) as string

// ---- Mock Data Logic for Charts ----
const { getProjectPanels } = useMockData();
const panels = ref<any[]>([]);

const goToChartEditor = () => {
  router.push(`/dashboard/editor/${projectId}`);
};

// ---- EXISTING LOGIC ----
type ProjectDetailReturn = {
  project: Ref<any | null>;
  projectName: Ref<string>;
  members: Ref<any[]>;
  userSearch: Ref<string>;
  userSuggestions: Ref<any[]>;
  selectedUser: Ref<any | null>;
  activeTab: Ref<string>;
  showDeleteModal: Ref<boolean>;
  deleteInput: Ref<string>;
  isOwner: Ref<boolean>;
  isEditor: Ref<boolean>;
  fetchProject: () => Promise<void>;
  saveName: () => Promise<void>;
  deleteProject: () => Promise<void>;
  searchUsers: () => Promise<void>;
  selectUser: (u: any) => void;
  addSelectedUser: () => Promise<void>;
  changeRole: (m: any) => Promise<void>;
  removeMember: (m: any) => Promise<void>;
  viewerChartOptions: Ref<any>;
};

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
} = useProjectDetail() as ProjectDetailReturn;

// ---- LIFECYCLE ----
onMounted(async () => {
  // 1. Fetch real project data (permissions, members)
  await fetchProject();
  
  // 2. Fetch mock panel data (charts)
  panels.value = getProjectPanels(projectId);
});
</script>

