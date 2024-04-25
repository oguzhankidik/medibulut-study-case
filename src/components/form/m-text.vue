<template>
  <div class="mb-6">
    <label for="examination" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>
    <input v-model="model" :type="type" :disabled="disabled" id="examination" :class="{ 'cursor-not-allowed' : disabled }" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 " placeholder=""  />
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  disabled: Boolean
})
const model = defineModel()
</script>

<style scoped>

</style>