<template>
  <div class="screen-block">
    <Title>地区销量趋势图</Title>
    <div style="width: 100%; height: 90%">
      <v-chart :options="options"></v-chart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as echarts from 'echarts'
import Title from '@/views/screen/components/Title.vue'
import { useAsync } from '@/hooks/useAsync'
import { getTrendsList } from '@/api/modules/trend'
import type { Trends } from '@/api/interface'
import type { EChartsCoreOption, LineSeriesOption } from 'echarts/types/dist/echarts'


const options = ref<EChartsCoreOption>({
  grid: {
    top: '25%',
    right: '4%',
    bottom: '1%',
    left: '3%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    left: 20,
    top: '8%',
    icon: 'circle',
    data: [],
    textStyle: {
      color: '#aaa',
    },
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    boundaryGap: false,
  },
  yAxis: {
    type: 'value',
  },
  series: [],
})

function getSeries(data: Trends[]) {
  const colorArr1 = [
    'rgba(11, 168, 44, 0.5)',
    'rgba(44, 110, 255, 0.5)',
    'rgba(22, 242, 217, 0.5)',
    'rgba(254, 33, 30, 0.5)',
    'rgba(250, 105, 0, 0.5)',
  ]
  const colorArr2 = [
    'rgba(11, 168, 44, 0)',
    'rgba(44, 110, 255, 0)',
    'rgba(22, 242, 217, 0)',
    'rgba(254, 33, 30, 0)',
    'rgba(250, 105, 0, 0)',
  ]
  
  const seriesArr = data.map((item, index) => {
    return {
      name: item.name,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 2,
      },
      itemStyle: {
        borderWidth: 4,
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: colorArr1[index] },
          { offset: 1, color: colorArr2[index] },
        ]),
      },
      data: item.data.map((value) => parseFloat(value as unknown as string)),
    }
  })
  return seriesArr as LineSeriesOption[]
}

const setOption = (data: Trends[]) => {
  const series = getSeries(data)
  const xAxisData = data.map((item) => item.name)
  options.value = {
    ...options.value,
    legend: {
      data: xAxisData,
    },
    series,
  }
}

const timer = ref()

const getData = () => {
  useAsync(getTrendsList, {
    onSuccess: (res) => {
      if (res.code === 200 && res.data) {
        setOption(res.data)
        timer.value = setTimeout(() => {
          if (timer.value) {
              clearTimeout(timer.value)
            }
            getData()
          }, 2000);
        }
    },
    onError: (error) => {
      console.log('地区销量趋势加载失败');
      console.log(error);
    }
  })
}

onMounted(() => {
  getData()
})

onUnmounted(() => {
  clearTimeout(timer.value)
  timer.value = null
})

</script>

<style lang="scss" scoped>
.screen-block {
  width: 100%;
  height: 100%;
}
</style>