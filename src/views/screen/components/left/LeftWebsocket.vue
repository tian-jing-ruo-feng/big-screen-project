<template>
  <div class="screen-block">
    <Title>销售统计</Title>
    <div style="width: 100%; height: 90%">
      <v-chart :options="options" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import Title from '../Title.vue';
import { getSalesList } from '@/api/modules/sales';
import { type Sales } from '@/api/interface';
import { useAsync } from '@/hooks/useAsync';
import { io, Socket } from 'socket.io-client'

// socketio
const socket = ref<Socket | null>(null)
const connectionStatus = ref<'connected' | 'disconnected'>('disconnected')
const initSocket = () => {
  socket.value = io('http://localhost:3000', {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  })
  // 链接事件
  socket.value.on('connect', () => {
    connectionStatus.value = 'connected'
    console.log('Socket.IO 已经连接')
  })
  socket.value.on('disconnet', () => {
    connectionStatus.value = 'disconnected'
    console.log('Socket.IO 已经断开')
  })
  socket.value.on('salesData', (data: Sales[]) => {
    setOption(data)
  })
}

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
      axisLabel: {
        color: '#fff', // 坐标轴文字颜色
      }
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

onMounted(() => {
  initSocket()
})

onBeforeUnmount(() => {
  socket.value!.disconnect()
})
// const { loading  } = useAsync(getSalesList, {
//   onSuccess: (res) => {
//     if (res.code === 200 && res.data) {
//       console.log('销售数据加载成功',res.data);
//       setOption(res.data)
//     }
//   },
//   onError: (err) => {
//     console.log('销售数据加载失败', err)
//   },
// })

</script>

<style lang="scss" scoped>
.screen-block {
  width: 100%;
  height: 100%;
}
</style>