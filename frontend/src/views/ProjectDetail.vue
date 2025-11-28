<template>
  <!-- DARK -->
  <div v-if="theme.global.current.value.dark" class="flex h-screen bg-background">

    <v-main>

      <!-- MAIN AREA -->
      <div class="flex-1 flex flex-col">

        <!-- TOPBAR (same as dashboard but with project name) -->
        <header class="h-16 bg-surface border-b border-mkpDarkGrey flex items-center justify-between px-6">

          <div class="flex items-center gap-3">

            <!-- PROJECT NAME -->
            <h1 class="text-m font-semibold text-white">{{ projectName }}</h1>

            <!-- BUTTON GROUP -->
            <div class="flex items-center gap-3 ml-10">

              <!-- VIEWER BUTTON -->
              <button @click="activeTab = 'viewer'"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition" :class="activeTab === 'viewer'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-background text-white border-mkpDarkGrey hover:bg-mkpDarkGrey'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5"
                  :class="activeTab === 'viewer' ? 'text-white' : 'text-gray-500'" fill="none" viewBox="0 0 24 24"
                  stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 4.5c-5 0-9 3.5-10 7.5 1 4 5 7.5 10 7.5s9-3.5 10-7.5c-1-4-5-7.5-10-7.5zM12 15a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
                Viewer
              </button>

              <!-- EDITOR BUTTON -->
              <button @click="activeTab = 'editor'"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition" :class="activeTab === 'editor'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-background text-white border-mkpDarkGrey hover:bg-mkpDarkGrey'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5"
                  :class="activeTab === 'editor' ? 'text-white' : 'text-gray-500'" fill="none" viewBox="0 0 24 24"
                  stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.862 3.487l3.651 3.65-9.563 9.565-4.237.587.586-4.236 9.563-9.566z" />
                </svg>
                Editor
              </button>

              <!-- USER MANAGEMENT BUTTON -->
              <button @click="activeTab = 'users'"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition" :class="activeTab === 'users'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-background text-white border-mkpDarkGrey hover:bg-mkpDarkGrey'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5"
                  :class="activeTab === 'users' ? 'text-white' : 'text-gray-500'" fill="none" viewBox="0 0 24 24"
                  stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M14 10a4 4 0 11-8 0 4 4 0 018 0zM21 20v-1a4 4 0 00-3-3.87M17 10a3 3 0 110-6 3 3 0 010 6z" />
                </svg>
                User Management
              </button>

            </div>


          </div>


        </header>

        <!-- EMPTY CONTENT AREA -->
        <main class="p-8 text-white text-sm">
          This is the project overview page. Add content here later.
        </main>

      </div>
    </v-main>
  </div>

  <!-- LIGHT -->
  <div v-else class="flex h-screen bg-gray-50">

    <v-main>

      <!-- MAIN AREA -->
      <div class="flex-1 flex flex-col">

        <!-- TOPBAR (same as dashboard but with project name) -->
        <header class="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">

          <div class="flex items-center gap-3">

            <!-- PROJECT NAME -->
            <h1 class="text-m font-semibold">{{ projectName }}</h1>

            <!-- BUTTON GROUP -->
            <div class="flex items-center gap-3 ml-10">

              <!-- VIEWER BUTTON -->
              <button @click="activeTab = 'viewer'"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition" :class="activeTab === 'viewer'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5"
                  :class="activeTab === 'viewer' ? 'text-white' : 'text-gray-500'" fill="none" viewBox="0 0 24 24"
                  stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 4.5c-5 0-9 3.5-10 7.5 1 4 5 7.5 10 7.5s9-3.5 10-7.5c-1-4-5-7.5-10-7.5zM12 15a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
                Viewer
              </button>

              <!-- EDITOR BUTTON -->
              <button @click="activeTab = 'editor'"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition" :class="activeTab === 'editor'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5"
                  :class="activeTab === 'editor' ? 'text-white' : 'text-gray-500'" fill="none" viewBox="0 0 24 24"
                  stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.862 3.487l3.651 3.65-9.563 9.565-4.237.587.586-4.236 9.563-9.566z" />
                </svg>
                Editor
              </button>

              <!-- USER MANAGEMENT BUTTON -->
              <button @click="activeTab = 'users'"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition" :class="activeTab === 'users'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5"
                  :class="activeTab === 'users' ? 'text-white' : 'text-gray-500'" fill="none" viewBox="0 0 24 24"
                  stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M14 10a4 4 0 11-8 0 4 4 0 018 0zM21 20v-1a4 4 0 00-3-3.87M17 10a3 3 0 110-6 3 3 0 010 6z" />
                </svg>
                User Management
              </button>

            </div>


          </div>


        </header>

        <!-- EMPTY CONTENT AREA -->
        <main class="p-8 text-gray-500 text-sm">
          This is the project overview page. Add content here later.
        </main>

      </div>
    </v-main>
  </div>

</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTheme } from "vuetify";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const theme = useTheme();
const projectId = route.params.id;

const project = ref<any | null>(null);
const projectName = ref("Loading...");
const username = ref(localStorage.getItem("username") || "");

// DROPDOWN
const userMenuOpen = ref(false);
const menu = ref<HTMLElement | null>(null);
const toggleUserMenu = () => userMenuOpen.value = !userMenuOpen.value;

onMounted(() => {
  document.addEventListener("click", (e) => {
    if (menu.value && !menu.value.contains(e.target as Node)) {
      userMenuOpen.value = false;
    }
  });
});

const activeTab = ref('viewer') // default

// API
const api = axios.create({ baseURL: "http://127.0.0.1:8000/api" });
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

// LOAD PROJECT
const fetchProject = async () => {
  const res = await api.get(`/projects/${projectId}/`, { headers: authHeaders() });
  project.value = res.data;
  projectName.value = res.data.name;
};

onMounted(fetchProject);

// ROLE LOGIC
const currentUsername = username.value;
const isOwner = computed(() => project.value?.owner?.username === currentUsername);
const isEditor = computed(() => {
  if (isOwner.value) return true;
  return project.value?.memberships?.some((m: any) =>
    m.user.username === currentUsername && m.role === "editor"
  );
});

// LOGOUT
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  router.push("/login");
};
</script>
