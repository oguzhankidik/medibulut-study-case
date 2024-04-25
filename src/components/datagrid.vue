<template>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-2">
    <table class="w-full text-sm text-left rtl:text-right ">
        <thead class="text-xs uppercase bg-gray-50">
            <tr>
              <th v-for="column in columns" scope="col" class="px-6 py-3 cursor-pointer" @click="sortData(column)">
                <div class="flex items-center">
                  {{ column.text.toUpperCase() }}
                  <a v-if="column.sortable" href="javascript:void(0)">
                    <svg class="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/>
                    </svg>
                  </a>
                </div>
              </th>

                <th v-if="isThereActions" scope="col" class="px-6 py-3">
                    <span class="sr-only">Edit</span>
                </th>
            </tr>
        </thead>
        <tbody v-if="data.length">
            <tr v-for="(item,index) in data" class=" border-b hover:bg-gray-200" :class="{ 'disabled-row' : isDisabled(item), 'cursor-pointer' : clickable }">
                <td v-for="header in columns" class="px-6 py-4" @click="handleSelect(item)">
                  <slot :name="header.value" :data="item">
                    <label v-if="header.value === 'status'" class="inline-flex items-center cursor-pointer">
                      <input type="checkbox" :checked="item[header.value]" value="" class="sr-only peer" @input="changeStatus(item)">
                      <div class=" ms-4 relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <span v-else>
                    {{ item[header.value] }}
                    </span>
                  </slot>
                </td>

                <td v-if="isThereActions" class="px-6 py-4 text-right">
                  <slot name="actions" :data="data[index]"></slot>
                </td>
            </tr>
        </tbody>
    </table>
    <div v-if="noData" class="flex justify-center py-12"> İlgili Kayıt Bulunamadı</div>
    <pagination v-model="params" :id="props.id" :data-length="dataLength" @change="getData('change')"/>
</div>

</template>

<script setup>
import {computed, inject, nextTick, onMounted, ref} from "vue";
import Pagination from "./pagination.vue";
import {initFlowbite} from "flowbite";
const props = defineProps({
  columns: Array,
  url: String,
  clickable: Boolean,
  prefix: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  }
})
let data = ref([])
const http = inject('http')
const emitter = inject('emitter')
const emit = defineEmits(['selected'])

const columns = computed(()=> props.columns.filter(item => item.value !== 'actions'))
const isThereActions = computed(() => props.columns.some(item => item.value === 'actions'))
onMounted(async ()=> {
  emitter.on('package-search',addSearchParam)
  emitter.on('refresh-datagrid',(val)=>{
    if(val && val === props.id){
      getData()
    }
  })

  params.value[props.id + '_page'] = 1
  params.value[props.id + '_limit'] = 5
  await getData()
  initFlowbite()
})

let dataLength = ref(0)
let noData = ref(false)
async function getData(type = 'init'){
  try {
    const params = getParams(type)
    const realParams = {
      _page: params[props.id+'_page'],
      _limit: params[props.id+'_limit'],
      _sort: params[props.id+'_sort'],
      name_like: params[props.id+'name_like'],
    }

    await http.get(props.url, { params: realParams }).then((response) => {
      data.value = response.data
      dataLength = response.headers.get('X-Total-Count')
      noData.value = !response.data.length
    })
    initFlowbite()
  }
  catch (e) {
    window.toastr.error('Bir şeyler yanlış gitti')
  }
}
const refresh = () => {
  getData()
}
defineExpose({ refresh })
const handleSelect = (data) => {
  emit('selected',data)
}
const changeStatus = (data) => {
  emit('selected',data)
}


import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter()

let params = ref({})
const getParams = (type = 'init') => {
  if(type === 'init' && Object.keys(route.query).length) {
    params.value = { ...params.value, ...route.query }
  }
  router.push({ query: { ...route.query, ...params.value } });
  return params.value
}

const sortData = (column) => {
  if(column.sortable) {
    params.value[props.id + '_sort'] = params.value[props.id + '_sort']?.includes(column.value)
        ? params.value[props.id + '_sort'].startsWith('-') ? column.value : `-${column.value}`
        : column.value;

    getData('change');
  }
}
const addSearchParam = (value) => {
  if(!value.length){
    delete params.value.name_like
  }
  else {
    params.value.name_like = value
  }
  getData('change');
}

function isDisabled(data){
  if('status' in data) {
    return !data.status
  }

  return false
}


</script>

<style scoped>
tr.disabled-row {
  @apply text-gray-200
}
tr.disabled-row:hover {
  @apply text-white
}
</style>