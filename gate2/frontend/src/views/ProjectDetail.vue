<template>
  <div class="project-page">
    <header class="project-header">

      <!-- Back -->
      <button class="back-btn" @click="goBack">← Back</button>

      <!-- Title + Owner + Delete -->
      <div class="title-block">
        <div v-if="isEditor" class="edit-title">
          <input v-model="projectName" class="title-input" />
          <button class="save-btn" @click="saveName">Save</button>
        </div>

        <h1 v-else>{{ projectName }}</h1>

        <p class="owner">Owner: {{ project?.owner?.username }}</p>

        <!-- ⭐ Delete Project BELOW title block -->
        <button
          v-if="isOwner"
          class="delete-project-btn"
          @click="deleteProject"
        >
          Delete Project
        </button>
      </div>
    </header>

    <!-- ========================= -->
    <!--       ADD USER AREA       -->
    <!-- ========================= -->
    <section class="members-section">

      <div v-if="isEditor" class="add-member">
        <h3>Add user</h3>

        <input
          v-model="userSearch"
          @input="searchUsers"
          placeholder="Search username..."
        />

        <ul v-if="userSuggestions.length" class="suggestions">
          <li v-for="u in userSuggestions" :key="u.id" @click="selectUser(u)">
            {{ u.username }}
          </li>
        </ul>

        <!-- ⭐ FULL-WIDTH BUTTON BELOW INPUT -->
        <button
          class="add-btn-full"
          @click="addSelectedUser"
          :disabled="!selectedUser"
        >
          Add as viewer
        </button>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>

      <!-- ========================= -->
      <!--       MEMBERS TABLE       -->
      <!-- ========================= -->
      <h2>Members</h2>

      <table v-if="members.length" class="members-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th v-if="isEditor">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="m in members" :key="m.id">
            <td>{{ m.user.username }}</td>

            <td>
              <span v-if="m.user.id === project?.owner?.id">
                Owner
              </span>

              <select
                v-else-if="isEditor"
                v-model="m.role"
                @change="changeRole(m)"
              >
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>

              <span v-else>{{ capitalize(m.role) }}</span>
            </td>

            <td v-if="isEditor">
              <button
                class="remove-btn"
                :disabled="m.user.id === project?.owner?.id"
                @click="removeMember(m)"
              >
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else>No members yet.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

// --------------------
// State
// --------------------
const route = useRoute();
const router = useRouter();
const projectId = route.params.id;

const project = ref<any | null>(null);
const projectName = ref("");
const members = ref<any[]>([]);
const currentUsername = localStorage.getItem("username") || "";
const error = ref("");

const userSearch = ref("");
const userSuggestions = ref<any[]>([]);
const selectedUser = ref<any | null>(null);

// --------------------
// API Setup
// --------------------
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// --------------------
// Fetch project
// --------------------
const fetchProject = async () => {
  try {
    const res = await api.get(`/projects/${projectId}/`, {
      headers: authHeaders(),
    });
    project.value = res.data;
    projectName.value = res.data.name;
    members.value = res.data.memberships || [];
  } catch (e: any) {
    error.value = e.response?.data?.detail || "Could not load project";
  }
};

// --------------------
// Role Checks
// --------------------
const isOwner = computed(
  () => project.value?.owner?.username === currentUsername
);

const isEditor = computed(() => {
  if (isOwner.value) return true;

  return members.value.some(
    (m) => m.user.username === currentUsername && m.role === "editor"
  );
});

// --------------------
// Update and Delete
// --------------------
const saveName = async () => {
  try {
    await api.patch(
      `/projects/${projectId}/`,
      { name: projectName.value },
      { headers: authHeaders() }
    );
  } catch (e: any) {
    error.value = e.response?.data?.detail || "Could not update name";
  }
};

const deleteProject = async () => {
  if (!confirm("Delete this project? This cannot be undone.")) return;

  try {
    await api.delete(`/projects/${projectId}/`, {
      headers: authHeaders(),
    });
    router.push("/dashboard");
  } catch {
    error.value = "Could not delete project";
  }
};

// --------------------
// Member operations
// --------------------
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
  members.value = members.value.filter((m) => m.id !== membership.id);
};

// --------------------
// Add user to project
// --------------------
const searchUsers = async () => {
  selectedUser.value = null;

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

const selectUser = (user: any) => {
  selectedUser.value = user;
  userSearch.value = user.username;
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

// --------------------
const goBack = () => router.push("/dashboard");
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

onMounted(fetchProject);
</script>

<style scoped>
.project-page {
  padding: 24px;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.project-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.back-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #4b5563;
}

.title-block {
  display: flex;
  flex-direction: column;
}

.title-input {
  font-size: 22px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  margin-right: 8px;
}

.save-btn {
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  background: #6366f1;
  color: white;
  cursor: pointer;
}

.owner {
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
}

/* Delete button neatly under owner */
.delete-project-btn {
  margin-top: 10px;
  padding: 8px 12px;
  border: none;
  background: #fee2e2;
  color: #b91c1c;
  border-radius: 6px;
  cursor: pointer;
  width: fit-content;
}
.delete-project-btn:hover {
  background: #fecaca;
}

.add-member {
  margin-top: 24px;
  max-width: 320px;
}

.add-member input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}

.add-btn-full {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.suggestions {
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  max-height: 150px;
  overflow-y: auto;
  background: white;
}

.suggestions li {
  padding: 6px 8px;
  cursor: pointer;
}

.members-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

.members-table th,
.members-table td {
  padding: 8px 10px;
  border-bottom: 1px solid #e5e7eb;
}

.remove-btn {
  padding: 4px 8px;
  border-radius: 4px;
  border: none;
  background: #fee2e2;
  color: #991b1b;
  cursor: pointer;
}
</style>