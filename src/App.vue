<script setup>
import {useDataStore} from "./stores/data.js";
import Navbar from "./components/navbar.vue";

const store = useDataStore()
store.onServerPrefetch()

</script>

<template>
  <navbar />
  <div class=" mx-auto h-screen pt-12 container">
    <RouterView class="bg-white py-12 px-5" :key="$route.path" />
  </div>

</template>

<style scoped>

</style>
