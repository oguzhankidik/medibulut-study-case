<template>
  <modal modal-id="apply-package-modal" modal-title="Paket Uygula">
    <form @submit.prevent="submit">
      <m-select
        v-model="form.userId"
        label="Uzman/Uzmanlar Ata"
        :options="optionsData.userList"
        @update:modelValue="getPackages"
      />
      <div v-if="packageExists">
        <m-select
            v-model="form.packageId"
            label="Paket Listesi"
            :options="packageList"
            :disabled="isDisabled"
            @update:modelValue="getPackageDetails"
        />
        <div class="grid gap-x-6 md:grid-cols-2">
          <m-text
              v-model="form.examination"
              label="Muayene Sayısı"
              type="number"
              :disabled="isDisabled"
          />
          <m-text
              v-model="form.control"
              label="Kontrol Sayısı"
              type="number"
              :disabled="isDisabled"
          />
        </div>
        <label for="input-group-1" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Paketin Geçerlilik Süresi</label>
        <div class="relative mb-6">
          <div  class="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none text-sm">
            {{ form.durationUnit }}
          </div>
          <input v-model="form.duration" :disabled="isDisabled" :class="{ 'cursor-not-allowed' : isDisabled }" type="text" id="input-group-1" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pe-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com">
        </div>
        <div class="flex">
          <m-text
              v-model="form.price"
              label="Paket Ücreti"
              class="w-3/4 me-3"
              :disabled="isDisabled"
          />
          <m-select
              v-model="form.currency"
              :options="optionsData.shortenedCurrencies"
              label=""
              class="w-1/4"
              :disabled="isDisabled"
          />
        </div>
        <m-text
            v-model="form.startedAt"
            label="Paket Başlangıç Tarihi"
            type="date"
            class="mb-5"
            :disabled="isDisabled"
        />
        <m-text
            v-model="form.note"
            label="Paket Notu"
            :disabled="isDisabled"
        />
      </div>

      <div v-else class="h-[376px] content-center">
        <div class="flex items-center p-4 mb-4 py-24 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800" role="alert">
          <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <span class="sr-only">Info</span>
          <div>
            <span class="font-medium">Info alert!</span> Bu uzmana ait paket bulunamadı
          </div>
        </div>
      </div>
      <div class="flex items-center justify-end px-4 pt-3 rounded-b dark:border-gray-600">
        <button data-modal-hide="apply-package-modal" type="button" class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">İptal</button>
        <button data-modal-hide="apply-package-modal" type="submit" class="text-white ms-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Paketi Uygula</button>
      </div>
    </form>
  </modal>
</template>

<script setup>

import Modal from "@/components/modal.vue";
import {computed, inject, ref, watch} from "vue";
import MSelect from "@/components/form/m-select.vue";
import {useDataStore} from "@/stores/data.js";
import MText from "@/components/form/m-text.vue";
import Form from "form-backend-validation";
const optionsData = useDataStore()
const http = inject('http')
const emitter = inject('emitter')
const props = defineProps({
  data: {
    type: Object,
    default: ()=> ({})
  }
})
const modalType = computed(()=> props.data && Object.keys(props.data).length ? 'edit' : 'create')

watch(() => props.data, (val) => {
  if(val === null){
    form.value.reset()
    return;
  }
  form.value.populate(val)
  form.value.packageId = val.packageId
  selectedPackages.value = optionsData.packages.filter(item => item.userIds.includes(val.userId))
  packageExists.value = !!selectedPackages.value.length
  packageList.value = selectedPackages.value.map(item => ({ text: item.name, value: item.id }))
});
const submit = () => {
  modalType.value === 'create' ? create() : update()
}
const create = async () => {
  try{
    if(form.value.userId && form.value.packageId){
      await http.post('/applied-packages',form.value.data())
      emitter.emit('refresh-datagrid','ap')
      window.toastr.success('Başarıyla eklendi')
      form.value.reset()
    }
    else {
      window.toastr.error('Uzman ve Paket Seçin')
    }
  }
  catch (e) {
    window.toastr.error('Bir şeyler yanlış gitti')
  }
}
const update = async () => {
  try{
    if(form.value.userId && form.value.packageId){
      await http.put('/applied-packages/' + props.data.id,form.value.data())
      emitter.emit('refresh-datagrid','ap')
      window.toastr.success('Başarıyla güncellendi')
      form.value.reset()
    }
    else {
      window.toastr.error('Uzman ve Paket Seçin')
    }
  }
  catch (e) {
    window.toastr.error('Bir şeyler yanlış gitti')
  }
}

let form = ref(new Form({
  startedAt: new Date(),
  userId: null,
  packageId: null,
  examination: 0,
  control: 0,
  duration: 0,
  durationUnit: "week",
  note: "",
  price: 0,
  currency: "TRY"
}))
let selectedPackages = ref(null)
let packageList = ref(null)
let packageExists = ref(true)
const getPackages = (userId)=> {
  if(userId){
    form.value.reset()
    form.value.userId = userId
    selectedPackages.value = optionsData.packages.filter(item => item.userIds.includes(userId))
    packageExists.value = !!selectedPackages.value.length
    packageList.value = selectedPackages.value.map(item => ({ text: item.name, value: item.id }))
  }
  else {
    form.value.reset()
    packageExists.value = true
    selectedPackages.value = null
    packageList.value = null
  }
}
const getPackageDetails = () => {
  if(form.value.packageId) {
    let selectedPackage = selectedPackages.value.find(item => item.id === form.value.packageId)

    form.value.populate(selectedPackage)
  }
}

const isDisabled = computed(()=> {
  return !(packageList && packageList.value?.length)
})
</script>

<style scoped>

</style>