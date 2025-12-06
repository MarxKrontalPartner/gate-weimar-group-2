<template>
  <v-navigation-drawer v-model="props.drawer" color="background">
    <!-- content for the drawer -->
    <v-list density="compact" nav>
      <v-list-group value="monitoring">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Monitoring" prepend-icon="mdi-sine-wave"></v-list-item>
        </template>
        <v-list-item title="Dashboard" value="mon_messkonzept" />
        <v-list-item title="Channel" value="mon_messkonzept" />
      </v-list-group>

    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>

const props = defineProps({
  drawer: Boolean
})

const navMenuItems = [
  {
    title: 'Monitoring',
    value: 'monitoring',
    props: {
      prependIcon: 'mdi-sine-wave'
    }
  },
]


</script>
