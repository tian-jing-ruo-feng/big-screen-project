<template>
  <div class="screen-block">
    <Title>销售统计</Title>
    <div style="width: 100%; height: 90%">
      <v-chart :options="options" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import Title from '../Title.vue';
import { getSalesList } from '@/api/modules/sales';
import { type Sales } from '@/api/interface';
import { useAsync } from '@/hooks/useAsync';

const options = ref({})

const setOption = (state: Sales[]) => {
  options.value = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        z: 0,
        lineStyle: {
          color: '#6a7985',
          width: 1,
          type: 'solid'
        },
        label: {
          backgroundColor: '#6a7985'
        }
      },
      legend: {
        data: [{
          name: '销售额',
          icon: 'circle',
          textStyle: {
            color: '#fff'
          }
        }]
      }
    },
    xAxis: {
      splitLine: { show: false }, // 是否显示网格线
      axisLine: { show: true }, // 是否显示坐标轴线
      type: 'value', // 作为数据展示
      max(value: any) {
        return parseInt(value.max * 1.2 + '');
      }
    },
    yAxis: {
      type: 'category', // 作为数据展示
      data: state.map((item) => item.name), // 显示的名称
      inverse: true, // 是否反转坐标轴
      axisLine: { show: true }, // 是否显示坐标轴线
    },
    grid: {
      top: '3%',
      right: '4%',
      bottom: '3%',
      left: '3%',
      containLabel: true
    },
    series: [{
      type: 'bar',
      name: '销售额',
      data: state.map((item) => item.value), // 显示的值
      label: {
        show: true,
        position: 'right'
      },
      showBackground: true, // 是否显示背景
      roundCap: true, // 是否圆角
      backgroundStyle: {
        color: 'rgba(220, 220, 220, 0.3)'
      },
      itemStyle: {
        color: '#2f89cf', // 柱子颜色
        borderRadius :[0,5,5,0], // 圆角
        shadowColor:'rgba(0,0,0,0.5)', // 阴影颜色
        shadowBlur:'10', // 阴影
      }
    }]
  }
}

const mockData = (data: Sales[]) => {
  resData.value = data.map(item => {
    return {
      ...item,
      value: parseInt(((Math.random() + 1) * 200 + ''))
    }
  })
  timer.value = setTimeout(async () => {
    if (timer.value) {
      clearTimeout(timer.value)
    }
    setOption(resData.value)
    mockData(resData.value)
  }, 2000);
}

const timer = ref()
const resData = ref<Sales[]>([])
useAsync(getSalesList, {
  onSuccess: (res) => {
    if (res.code === 200 && res.data) {
      console.log('销售数据加载成功',res.data);
      setOption(res.data)
      resData.value = res.data
      mockData(resData.value)
    }
  },
  onError: (err) => {
    console.log('销售数据加载失败', err)
  },
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