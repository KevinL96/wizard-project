<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
  //
  
</script>

<style scoped>
.v-slide-x-transition {
  transition-duration: 1s; /* Adjust this value to change the speed of the transition */
}
</style>

