<template>
  <div class="search-button mr-3">
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only ">Search</label>
    <div class="relative">
      <div class="absolute top-3 left-3">
        <svg class="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
      </div>
      <input v-model="searchValue" type="search" id="default-search" class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Paket ara" required />
    </div>
  </div>
</template>

<script setup>
import {useRoute} from "vue-router";
import {inject, onMounted, ref, watch} from "vue";
const route = useRoute()
const emitter = inject('emitter')
const searchValue = ref('')
onMounted(()=>{
  searchValue.value = route?.query?.name_like ?? ''
})

let timeout;
watch(() => searchValue.value, (val) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => emitter.emit('package-search',searchValue.value),1000)
});
</script>

<style scoped>

</style>