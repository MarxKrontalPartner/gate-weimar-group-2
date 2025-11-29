<template>
  <!-- LIGHT-ONLY VERSION -->
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
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'"
              >
                Viewer
              </button>

              <button
                v-if="isEditor"
                @click="activeTab = 'editor'"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition"
                :class="activeTab === 'editor'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'"
              >
                Editor
              </button>

              <button
                v-if="isEditor"
                @click="activeTab = 'settings'"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition"
                :class="activeTab === 'settings'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'"
              >
                Project Settings
              </button>

            </div>
          </div>

        </header>

        <!-- CONTENT AREA -->
        <main class="p-8 text-gray-800 text-sm">

          <!-- VIEWER -->
          <div v-if="activeTab === 'viewer'">
            <AgChartsVue :options="viewerChartOptions" class="w-full h-96 bg-white rounded shadow" />
          </div>


          <!-- EDITOR -->
          <div v-if="activeTab === 'editor' && isEditor">
            Editor mode content goes here...
          </div>

          <!-- SETTINGS -->
          <div v-if="activeTab === 'settings' && isEditor" class="space-y-10">

            <!-- =========== 1. RENAME PROJECT =========== -->
            <section>
              <h2 class="text-lg font-semibold mb-3">Rename Project</h2>
              <div class="flex gap-3">
                <input
                  v-model="projectName"
                  class="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-800 w-64"
                />
                <button
                  @click="saveName"
                  class="px-4 py-2 bg-black text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </section>

            <!-- =========== 2. USER MANAGEMENT =========== -->
            <section>
              <h2 class="text-lg font-semibold mb-3">Project Members</h2>

              <div class="max-w-md">
                <input
                  v-model="userSearch"
                  @input="searchUsers"
                  placeholder="Search username..."
                  class="w-full px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-800"
                />

                <ul v-if="userSuggestions.length"
                  class="border border-gray-300 mt-1 rounded-md bg-white shadow">
                  <li
                    v-for="u in userSuggestions"
                    :key="u.id"
                    class="px-3 py-2 cursor-pointer hover:bg-gray-100"
                    @click="selectUser(u)"
                  >
                    {{ u.username }}
                  </li>
                </ul>

                <button
                  @click="addSelectedUser"
                  :disabled="!selectedUser"
                  class="mt-3 w-full px-4 py-2 bg-black disabled:bg-gray-400 text-white rounded-md"
                >
                  Add as viewer
                </button>
              </div>

              <table class="w-full mt-6 border-collapse">
                <thead>
                  <tr class="text-left border-b border-gray-300">
                    <th class="py-2">Username</th>
                    <th class="py-2">Role</th>
                    <th v-if="isEditor" class="py-2">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="m in members"
                    :key="m.id"
                    class="border-b border-gray-300"
                  >
                    <td class="py-2">{{ m.user.username }}</td>

                    <td class="py-2">
                      <span v-if="m.user.id === project?.owner?.id">Owner</span>

                      <select
                        v-else-if="isEditor"
                        v-model="m.role"
                        @change="changeRole(m)"
                        class="bg-white border border-gray-300 text-gray-800 rounded-md px-2 py-1"
                      >
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </td>

                    <td v-if="isEditor" class="py-2">
                      <button
                        class="px-3 py-1 bg-red-600 text-white rounded-md"
                        :disabled="m.user.id === project?.owner?.id"
                        @click="removeMember(m)"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

            </section>

            <!-- =========== 3. DELETE PROJECT =========== -->
            <section v-if="isOwner">
              <h2 class="text-lg font-semibold mb-3 text-red-600">Delete Project</h2>
              <button
                @click="showDeleteModal = true"
                class="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800"
              >
                Delete Project Permanently
              </button>
            </section>

          </div>
        </main>
      </div>
    </v-main>
  </div>

  <!-- ========================= DELETE CONFIRM MODAL ========================= -->
  <div
    v-if="showDeleteModal"
    class="fixed inset-0 bg-gray-500/30 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg w-96 shadow-xl">

      <h2 class="text-lg font-semibold text-red-600 mb-4">
        Confirm Project Deletion
      </h2>

      <p class="text-sm mb-3">
        To confirm deletion, please type the project name:
      </p>

      <p class="text-sm font-semibold mb-3">
        "{{ projectName }}"
      </p>

      <input
        v-model="deleteInput"
        placeholder="Type project name..."
        class="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
      />

      <div class="flex justify-between">
        <button
          @click="showDeleteModal = false"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>

        <button
          @click="deleteProject"
          :disabled="deleteInput !== projectName"
          class="px-4 py-2 rounded-md text-white"
          :class="deleteInput === projectName ? 'bg-red-700 hover:bg-red-800' : 'bg-red-400 cursor-not-allowed'"
        >
          Delete
        </button>
      </div>

    </div>
  </div>

</template>




<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const projectId = route.params.id;

const project = ref<any | null>(null);
const projectName = ref("Loading...");
const members = ref<any[]>([]);
const userSearch = ref("");
const userSuggestions = ref<any[]>([]);
const selectedUser = ref<any | null>(null);

const activeTab = ref("viewer");

// DELETE MODAL STATE
const showDeleteModal = ref(false);
const deleteInput = ref("");

// API CONFIG
const api = axios.create({ baseURL: "http://127.0.0.1:8000/api" });
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

// LOAD PROJECT
const fetchProject = async () => {
  try {
    const res = await api.get(`/projects/${projectId}/`, { headers: authHeaders() });
    project.value = res.data;
    projectName.value = res.data.name;
    members.value = res.data.memberships || [];
  } catch (err: any) {
    // If the project does not belong to the user → redirect away
    if (err.response?.status === 403 || err.response?.status === 404) {
      router.push("/dashboard");
    } else {
      console.error("Unexpected error loading project:", err);
    }
  }
};

onMounted(fetchProject);

// ROLE LOGIC
const username = localStorage.getItem("username") || "";
const isOwner = computed(() => project.value?.owner?.username === username);
const isEditor = computed(() => {
  if (isOwner.value) return true;
  return members.value.some(m => m.user.username === username && m.role === "editor");
});

// SAVE NAME
const saveName = async () => {
  await api.patch(`/projects/${projectId}/`, { name: projectName.value }, { headers: authHeaders() });
};

// DELETE PROJECT (with modal)
const deleteProject = async () => {
  if (deleteInput.value !== projectName.value) return;

  await api.delete(`/projects/${projectId}/`, { headers: authHeaders() });
  router.push("/dashboard");
};

// USER SEARCH
const searchUsers = async () => {
  if (!userSearch.value.trim()) {
    userSuggestions.value = [];
    return;
  }
  const res = await api.get("/users/", {
    headers: authHeaders(),
    params: { search: userSearch.value },
  });
  userSuggestions.value = res.data;
};

const selectUser = (u: any) => {
  selectedUser.value = u;
  userSearch.value = u.username;
  userSuggestions.value = [];
};

const addSelectedUser = async () => {
  if (!selectedUser.value) return;
  const res = await api.post(
    `/projects/${projectId}/add_member/`,
    { username: selectedUser.value.username },
    { headers: authHeaders() }
  );
  members.value.push(res.data);
  selectedUser.value = null;
  userSearch.value = "";
};

const changeRole = async (membership: any) => {
  await api.post(
    `/projects/${projectId}/update_role/`,
    { membership_id: membership.id, role: membership.role },
    { headers: authHeaders() }
  );
};

const removeMember = async (membership: any) => {
  await api.post(
    `/projects/${projectId}/remove_member/`,
    { membership_id: membership.id },
    { headers: authHeaders() }
  );
  members.value = members.value.filter(m => m.id !== membership.id);
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const viewerChartOptions = ref({
  title: { text: "Viewer Graph Example" },
  data: [
    { label: "A", value: 30 },
    { label: "B", value: 55 },
    { label: "C", value: 42 },
  ],
  series: [
    {
      type: "line",
      xKey: "label",
      yKey: "value",
      stroke: "black",
      label: {
        fontWeight: "bold",
        formatter: ({ value }) => value.toFixed(0),
      },
      marker: {
        fill: "blue",
        size: 10,
        stroke: "blue",
        strokeWidth: 3,
        shape: "circle",
      },
    },
  ],
});

</script>
