<template>
  <div class="mb-6">
    <label for="users" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white h-[20px]">{{ label }}</label>
    <select v-model="model" id="users" :disabled="disabled" :class="{ 'cursor-not-allowed' : disabled }" class="bg-gray-50 !pr-0 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
      <option v-for="option in props.options" :value="option.value">{{ option.text }}</option>
    </select>
  </div>
</template>

<script setup>

const props = defineProps(['options','label','disabled'])
const model = defineModel()

</script>

<style scoped>

</style>