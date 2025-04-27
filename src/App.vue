<template>
    <!-- <ScaleScreen>
      <img src="./assets/bg.jpg" alt="">
    </ScaleScreen> -->
    <div class="screen-ap">
      <router-view />
    </div>
</template>

<script setup lang="ts">
// import { getSalesList } from './api/modules/sales';

// import ScaleScreen from '@/components/scale-screen'
// import axios from 'axios';
// axios.get('/api/trend/list').then((res) => {
//   console.log(res);
// });
// getSalesList()
</script>

<style scoped>
.screen-app {
  width: 100%;
  height: 100%;
}
</style>