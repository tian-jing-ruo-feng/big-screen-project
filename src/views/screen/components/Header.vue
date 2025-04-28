<template>
  <div class="screen-header">
    <h1 class="screen-logo">
      <span>Logo</span>
      <span style="font-size: 12px; padding-left: 20px; color: #F56C6C;">演示环境下展示的数据为模拟信息，不作为实际业务依据</span>
    </h1>
    <div class="screen-header-title">{{screenStore.title}}</div>
    <div class="screen-header-right">
      <img class="theme-change" :src="icon" @click="handleChangeTheme">
      <span class="datetime">{{ currentTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import switch_dark from '@/assets/img/switch_dark.png'
import switch_light from '@/assets/img/switch_light.png'
import dayjs from 'dayjs'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useScreenStore } from '@/stores';

const currentTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'));
let timer = ref()
const screenStore = useScreenStore()

function startTime() {
  timer.value = setTimeout(() => {
    currentTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
    startTime()
  }, 1000)
}

const icon = computed(() => screenStore.theme === 'light' ? switch_dark : switch_light)

const handleChangeTheme = () => {
  screenStore.$patch({
    theme: screenStore.theme === 'light' ? 'dark' : 'light',
  })
}
onMounted(() => {
  startTime()
})

onBeforeUnmount(() => {
  clearTimeout(timer.value)
})
</script>

<style lang="scss" scoped>
.screen-header {
  position: relative;
  width: 100%;
  height: var(--ds-header-height);
  background-size: 100%;
  background-image: url('@/assets/img/header.png');
  background-repeat: no-repeat;
  animation: fade 0.3s;

  &-title {
    display: flex;
    position: absolute;
    width: 490px;
    height: var(--ds-header-height);
    top: 50%;
    left: 50%;
    justify-content: center;
    align-items: center;
    transform: translate(-50%, -50%);
    font-size: 30px;
  }

  .screen-logo {
    display: flex;
    align-items: center;
    height: calc(var(--ds-header-height) - 20px);

  }

  &-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);

    img {
      width: 30px;
      height: 30px;
      margin-right: 16px;
      cursor: pointer;
      transition: 0.3s cubic-bezier(0.4175 0.88, 0.32, 1.275);

      &:hover {
        transform: scale(1.2);
      }
      stroke: #fff;
    }
  }
}

@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>