<template>
  <div class="space-y-10">

    <!-- =========== 1. RENAME PROJECT =========== -->
    <section>
      <h2 class="text-lg font-semibold mb-3">Rename Project</h2>

      <div class="flex gap-3">

        <!-- RENAME INPUT -->
        <input
          :value="projectName"
          @input="emit('update:projectName', ($event.target as HTMLInputElement).value)"
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

        <!-- SEARCH INPUT -->
        <input
          :value="userSearch"
          @input="emit('update:userSearch', ($event.target as HTMLInputElement).value); searchUsers()"
          placeholder="Search username..."
          class="w-full px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-800"
        />

        <!-- SUGGESTIONS -->
        <ul
          v-if="userSuggestions.length"
          class="border border-gray-300 mt-1 rounded-md bg-white shadow"
        >
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

      <!-- MEMBERS TABLE -->
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
              <span v-if="m.user.id === project.owner.id">
                Owner
              </span>

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
                :disabled="m.user.id === project.owner.id"
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
        @click="emit('update:showDeleteModal', true)"
        class="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800"
      >
        Delete Project Permanently
      </button>
    </section>

    <!-- DELETE MODAL -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-500/30 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-96 shadow-xl">

        <h2 class="text-lg font-semibold text-red-600 mb-4">
          Confirm Project Deletion
        </h2>

        <p class="text-sm mb-3">To confirm deletion, please type the project name:</p>

        <p class="text-sm font-semibold mb-3">
          "{{ projectName }}"
        </p>

        <!-- DELETE INPUT -->
        <input
          :value="deleteInput"
          @input="emit('update:deleteInput', ($event.target as HTMLInputElement).value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
        />

        <div class="flex justify-between">
          <button
            @click="emit('update:showDeleteModal', false)"
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

  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  project: any;
  projectName: string;
  members: any[];

  isOwner: boolean;
  isEditor: boolean;

  userSearch: string;
  userSuggestions: any[];
  selectedUser: any;

  showDeleteModal: boolean;
  deleteInput: string;

  saveName: () => void;
  searchUsers: () => void;
  selectUser: (u: any) => void;
  addSelectedUser: () => void;
  changeRole: (m: any) => void;
  removeMember: (m: any) => void;
  deleteProject: () => void;
}>();

// -------- FIXED EMIT TYPINGS ----------
const emit = defineEmits<{
  (e: "update:projectName", value: string): void;
  (e: "update:userSearch", value: string): void;
  (e: "update:deleteInput", value: string): void;
  (e: "update:showDeleteModal", value: boolean): void;
}>();
</script>
