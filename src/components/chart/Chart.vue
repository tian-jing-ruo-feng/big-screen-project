<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup lang="ts">
import { onMounted, shallowRef, watch, type Prop, type PropType } from 'vue';
import * as echarts from 'echarts'
import type { EChartsType, EChartsCoreOption } from 'echarts';
import { useScreenStore } from '@/stores';

const screenStore = useScreenStore()

const props = defineProps({
  options: {
    type: Object as PropType<EChartsCoreOption>,
    required: true,
    default: () => ({})
  },
  loading: Boolean
})

// 根据DOM 初始化 echarts 实例
const chartRef = shallowRef<HTMLElement | null>(null)
const chart = shallowRef<EChartsType | null>(null)


function init() {
  if (props.options) {
    chart.value = echarts.init(chartRef.value as HTMLElement, screenStore.theme)
    setOption(props.options)
  }
}

function setOption(option: any, notMerge?: boolean, layzUpdate?: boolean) {
  if (chart.value) { 
    chart.value.setOption(option, notMerge, layzUpdate)
  }
}

function resize() {
  if (chart.value) {
    chart.value?.resize()
  }
}

onMounted(() => {
  init()
})

watch(() => props.options, () => {
  setOption(props.options)
})
watch(() => screenStore.theme, () => {
  chart.value?.dispose()
  init()
})


defineExpose({
  chart,
  setOption,
  resize
})
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>