<template>
  <ScaleScreen>
    <div :class="['screen', screenStore.theme]">
      <Header />
      <div class="screen-main">
        <div class="screen-left">
          <Left />
        </div>
        <div class="screen-center">
          <Center />
        </div>
        <div class="screen-right">
          <Right />
        </div>
      </div>
    </div>
  </ScaleScreen>
</template>

<script setup lang="ts">
import ScaleScreen from '@/components/scale-screen'
import Header from '@/views/screen/components/Header.vue'
import Left from '@/views/screen/components/left/index.vue'
import Right from '@/views/screen/components/right/index.vue'
import Center from '@/views/screen/components/center/index.vue'
import { useScreenStore } from '@/stores'

const screenStore = useScreenStore()
</script>

<style lang="scss" scoped>
.screen {
  --ds-screen-width: 1920px;
  --ds-screen-height: 1080px;
  --ds-header-height: 72px;
  --ds-block-bg: #222733;
  --ds-screen-bg: rgb(22, 21, 24);
  --ds-screen-text-color: #fff;

  padding: 0 20px;
  background: var(--ds-screen-bg);
  color: var(--ds-screen-text-color);
  height: var(--ds-screen-height);

  &-main {
    position: relative;
    display: flex;
    height: calc(100% - var(--ds-header-height));
  }

  &-center  {
    flex: 1;
    width: calc(var(--ds-screen-width) - 1000px);
  }

  &-left,
  &-right {
    width: 460px;
  }
}

.light {
  --ds-screen-bg: rgb(238, 238, 238);
  --ds-block-bg: #fff;
  --ds-screen-text-color: rgb(22, 21, 30);
}
</style>