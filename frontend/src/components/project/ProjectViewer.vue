<template>
  <AgChartsVue :options="options" class="w-full h-96 bg-white rounded shadow" />
</template>

<script setup lang="ts">
import { AgCharts } from "ag-charts-vue3";

defineProps<{
  options: any;
}>();
</script>
