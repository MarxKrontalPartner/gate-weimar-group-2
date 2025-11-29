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
                Project Settings
              </button>

            </div>
          </div>
        </header>

        <!-- MAIN CONTENT -->
        <main class="p-8 text-gray-800 text-sm">

          <!-- VIEWER -->
          <ProjectViewer
            v-if="activeTab === 'viewer'"
            :options="viewerChartOptions"
          />

          <!-- EDITOR -->
          <ProjectEditor
            v-if="activeTab === 'editor' && isEditor"
            :members="members"
            :changeRole="changeRole"
            :removeMember="removeMember"
            :project="project"
            :isEditor="isEditor"
          />

          <!-- SETTINGS -->
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
import { onMounted } from "vue";
import type { Ref } from "vue";

import ProjectViewer from "@/components/project/ProjectViewer.vue";
import ProjectEditor from "@/components/project/ProjectEditor.vue";
import ProjectSettings from "@/components/project/ProjectSettings.vue";

import { useProjectDetail } from "@/composables/useProjectDetail";

// ---- TYPE for composable return ----
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

// ---- USE COMPOSABLE WITH CAST ----
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

  viewerChartOptions,
} = useProjectDetail() as ProjectDetailReturn;

onMounted(fetchProject);
</script>

