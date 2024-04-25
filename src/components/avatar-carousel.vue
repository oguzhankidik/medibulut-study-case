<template>
  <div v-if="type === 'image'">
    <div v-if="props.idList && props.idList.length" class="flex -space-x-4 rtl:space-x-reverse">
      <img v-for="id in filteredList" class="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
           :src="getUserInfo(id,'photoUr')" alt="avatar" :title="getUserInfo(id,'name')">
      <a v-if="Array.isArray(idList) && idList.length > 3" class="flex cursor-default items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full " href="#">
        {{ remainingUserCount }}
      </a>
    </div>

    <div v-else class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
      <svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20"
           xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
      </svg>
    </div>
  </div>
  <div v-else>
    <span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{{ getAllUserName }}</span>
  </div>
</template>
<script setup>
import {computed, ref} from "vue";

const props = defineProps({
  idList: {
    type: [Array,String],
    default: []
  },
  type: {
    type: String,
    default: 'image'
  }
})
import {useDataStore} from "../stores/data.js";

const data = useDataStore()

const filteredList = computed(() =>  {
  if(!Array.isArray(props.idList)){
    return [props.idList]
  }
  if(props.idList.length > 3) {
    return props.idList.slice(0,3)
  }
  return props.idList
})
const remainingUserCount = computed(() =>  {
  return '+' + (5 - props.idList.length)
})

const getUserInfo = (id, property) => {
  if (!id || !id.length) return '';
  const user = data.users.find(item => item.id === id[0]);
  return user ? user[property] || '' : '';
};

const getAllUserName = computed( () => {
  let names = ref([])
  filteredList.value.forEach(id => {
    names.value.push(data.users.find(item => item.id === id).name)
  })
  return names.value.toString()
})

</script>
<style scoped>

</style>