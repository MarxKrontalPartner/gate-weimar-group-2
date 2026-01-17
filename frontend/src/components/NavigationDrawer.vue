<template>
  <v-navigation-drawer
    :model-value="drawer"
    @update:model-value="$emit('update:drawer', $event)"
    color="background"
  >
    <!-- content for the drawer -->
    <v-list density="compact" nav>
      <v-list-group value="monitoring">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :title="$t('navigationdrawer.monitoring')" prepend-icon="mdi-sine-wave"></v-list-item>
        </template>
        <v-list-item :title="$t('navigationdrawer.dashboard')" value="dashboard" prepend-icon="mdi-grid" to="/dashboard" />
        <v-list-item
          :title="$t('navigationdrawer.channels')"
          value="channels"
          prepend-icon="mdi-view-list"
          to="/channels"
        />
        <v-list-item :title="$t('navigationdrawer.settings')" value="settings" prepend-icon="mdi-cog" to="/settings" />
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
defineProps({
  drawer: Boolean,
})

defineEmits(['update:drawer'])
</script>
