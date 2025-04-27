<template>
  <div class="screen-block">
    <Title>天气</Title>
    <div style="width: 100%; height: 90%;">
      <v-chart ref="vchartRef" :options="option"></v-chart>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { type EChartsCoreOption } from 'echarts';
import {  onUnmounted, ref } from 'vue';
import Title from '../Title.vue';
import { useAsync } from '@/hooks/useAsync';
import { getWetherList } from '@/api/modules/wether';
import type { Wether } from '@/api/interface';
import { nextTick } from 'vue';

const ROOT_PATH = 'https://echarts.apache.org/examples'
const weatherIcons = {
  Sunny: ROOT_PATH + '/data/asset/img/weather/sunny_128.png',
  Cloudy: ROOT_PATH + '/data/asset/img/weather/cloudy_128.png',
  Showers: ROOT_PATH + '/data/asset/img/weather/showers_128.png'
};

const vchartRef = ref()
const option = ref<EChartsCoreOption>({})
const timer = ref()

// 循环选中高亮显示
function handleSelectHighlight(len: number, ind = 0) {
  timer.value = setTimeout(() => {
    if (timer.value) {
      clearTimeout(timer.value)
    }
    vchartRef.value.chart.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: ind - 1 < 0 ? len - 1 : ind - 1
    })
    vchartRef.value.chart.dispatchAction({
      type: 'toggleSelect',
      seriesIndex: 0,
      dataIndex: ind
    })
    vchartRef.value.chart.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: ind
    })
    if (++ind < len) {
      handleSelectHighlight(len, ind)
    } else {
      ind = 0
      handleSelectHighlight(len, ind)
    }
  }, 2000);
}

useAsync(getWetherList, {
  onSuccess: async (res) => {
    if (res.code === 200 && res.data) {
      setOption(res.data)
      const len = res.data.length
      let ind = 0
      await nextTick()
      handleSelectHighlight(len, ind)
    }
  },
  onError: (err) => {
    console.log(err, '天气数据加载失败', err);
  }
})

function setOption(state: Wether[]) {
  option.value = {
    grid: {
      top: '10%',
      right: 'right',
      bottom: '2%',
      left: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      data: state.map(item => item.name),
      orient: 'vertical',
      left: 'left',
      top: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '50%'],
        padAngle: 10,
        itemStyle: {
          borderRadius: 6,
        },
        selectedMode: 'single', // 设置间隙
        data: [
          {
            value: state[0].value,
            name: state[0].name,
            label: {
              formatter: [
                '{title|{b}}{abg|}',
                '  {weatherHead|天气}{valueHead|天数}{rateHead|Percent}',
                '{hr|}',
                '  {Sunny|}{value|202}{rate|55.3%}',
                '  {Cloudy|}{value|142}{rate|38.9%}',
                '  {Showers|}{value|21}{rate|5.8%}'
              ].join('\n'),
              backgroundColor: '#eee',
              borderColor: '#777',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                title: {
                  color: '#eee',
                  align: 'center'
                },
                abg: {
                  backgroundColor: '#333',
                  width: '100%',
                  align: 'right',
                  height: 25,
                  borderRadius: [4, 4, 0, 0]
                },
                Sunny: {
                  height: 30,
                  align: 'left',
                  backgroundColor: {
                    image: weatherIcons.Sunny
                  }
                },
                Cloudy: {
                  height: 30,
                  align: 'left',
                  backgroundColor: {
                    image: weatherIcons.Cloudy
                  }
                },
                Showers: {
                  height: 30,
                  align: 'left',
                  backgroundColor: {
                    image: weatherIcons.Showers
                  }
                },
                weatherHead: {
                  color: '#333',
                  height: 24,
                  align: 'left'
                },
                hr: {
                  borderColor: '#777',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                value: {
                  width: 20,
                  padding: [0, 20, 0, 30],
                  align: 'left'
                },
                valueHead: {
                  color: '#333',
                  width: 20,
                  padding: [0, 20, 0, 30],
                  align: 'center'
                },
                rate: {
                  width: 40,
                  align: 'right',
                  padding: [0, 10, 0, 0]
                },
                rateHead: {
                  color: '#333',
                  width: 40,
                  align: 'center',
                  padding: [0, 10, 0, 0]
                }
              }
            }
          },
          ...state.slice(1)
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
}

onUnmounted(() => {
  clearTimeout(timer.value)
  timer.value = null
})


</script>

<style lang='scss' scoped>
</style>