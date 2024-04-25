<template>
  <div v-if="dataLength > 5" class="flex justify-between items-center my-4 px-5" >
    <button :data-dropdown-toggle="props.id + '_dropdown'" class="flex items-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700" type="button">
      Seçim
      <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
    </button>

    <div :id="props.id + '_dropdown'" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
        <li v-for="item in perPageList">
          <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" @click="changePerPage(item)">
            {{ item }}
          </a>
        </li>
      </ul>
    </div>

    <nav>
      <ul class="flex items-center -space-x-px h-8 text-sm">
        <li v-if="params[props.id + '_page'] > 1">
          <a href="#" class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700" @click="changePage(Number(params[props.id + '_page']) - 1)">
            <span class="sr-only">Previous</span>
            <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
            </svg>
          </a>
        </li>
        <li v-for="page in pageCount">
          <a href="#" class="pages" :class="{ 'active-page' : Number(params[props.id + '_page']) === page }" @click="changePage(page)">{{ page }}</a>
        </li>
        <li v-if="params[props.id + '_page'] < pageCount">
          <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700" @click="changePage(Number(params[props.id + '_page']) + 1)">
            <span class="sr-only">Next</span>
            <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
            </svg>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import {computed} from "vue";

const params = defineModel()
const props = defineProps({
  dataLength: [String,Number],
  id:{
    type: String,
    default: ''
  }
})
const emit = defineEmits(['change'])
let pageCount = computed(()=> {
  return Math.ceil(props.dataLength / params.value[props.id + '_limit'])
})

const perPageList = [5,10,20,30]

const changePage = (page) => {
  params.value[props.id + '_page'] = page
  emit('change')
}
const changePerPage = (page) => {
  params.value[props.id + '_page'] = '1'
  params.value[props.id + '_limit']= page
  emit('change')

}


</script>

<style scoped>

.pages {
  @apply flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700
}

.active-page {
  @apply z-10 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700
}
</style>