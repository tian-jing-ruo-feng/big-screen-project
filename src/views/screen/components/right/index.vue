<template>
  <div>
    <component
      v-for="item in components"
      :key="item.name"
      :is="item.component"
      :name="item.name"
      class="screen-right-item">
    </component>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import Right1 from './Right1.vue';
import Right2 from './Right2.vue';
import Right3 from './Right3.vue'
import Right4 from './Right4.vue'

const components = shallowRef([
  {
    name: 'right3',
    component: Right3
  },
  {
    name: 'right4',
    component: Right4
  },
  {
    name: 'right1',
    component: Right1
  },
  {
    name: 'right2',
    component: Right2
  },
]);

</script>

<style lang="scss" scoped>
.screen-right-item {
  width: 100%;
  height: 430px;
  background-color: var(--ds-block-bg);
  padding: 16px;
  animation-name: slide;

  & + & {
    margin-top: 20px;
  }

  &[name="right1"] {
    height: 235px;
    animation-duration: 1.2s;
  }
  &[name="right2"] {
    height: 235px;
    animation-duration: 1.5s;
  }
  &[name="right3"] {
    height: 235px;
    animation-duration: 0.8s;
  }
  &[name="right4"] {
    height: 235px;
    animation-duration: 1s;
  }
}

@keyframes slide {
  0% {
    transform: translateX(100%);
  }
  20% {
    transform: translateX(80%);
  }
  100% {
    transform: translateX(0);
  }
}
</style>