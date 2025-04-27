<template>
  <div class="map-center">
    <Map />
  </div>
</template>

<script setup lang='ts'>
import Map from './Map.vue'
</script>

<style lang='scss' scoped>
.map-center {
  position: relative;
  width: 100%;
  height: 1000px;
  padding: 0 16px;
  animation: slideAndFide 1.75s;
}

@keyframes slideAndFide {
  0% {
    opacity: 0;
    transform: translateY(218px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
  
}
</style>