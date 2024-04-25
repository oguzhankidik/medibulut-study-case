<template>
  <modal modal-id="add-package-modal" :modal-title="title">
    <form @submit.prevent="submit">
      <m-text
        v-model="form.name"
        label="Paket Adı"
        class="mb-6"
      />
      <div class="grid gap-x-6 md:grid-cols-2">
        <m-text
            v-model="form.examination"
            label="Muayene Sayısı"
        />
        <m-text
            v-model="form.control"
            label="Kontrol Sayısı"
        />
        <div class="col-span-2">
          <div class="flex gap-6">
            <m-text
                v-model="form.duration"
                label="Paketin Geçerlilik Süresi"
                class="w-1/2"
            />
            <m-select
                v-model="form.durationUnit"
                :options="durationUnitList"
                class="w-1/2"
            />
          </div>
        </div>
        <m-text
            v-model="form.price"
            label="Ücret"
        />
        <m-select
            v-model="form.currency"
            label="Para Birimi"
            :options="currencyList"
        />
      </div>

      <div class="mb-6">
        <label for="users" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Uzman/Uzmanlar Ata</label>
        <select multiple v-model="form.userIds" id="users" class="bg-gray-50 !pr-0 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
          <option v-for="option in userList" :value="option.value">{{ option.text }}</option>
        </select>
      </div>
      <div class="flex items-center justify-end px-4 pt-3 rounded-b dark:border-gray-600">
        <button data-modal-hide="add-package-modal" type="button" class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">İptal</button>
        <button data-modal-hide="add-package-modal" type="submit" class="text-white ms-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{{ title }}</button>
      </div>
    </form>
  </modal>
</template>

<script setup>
import {computed, inject, ref, watch} from "vue";
import {useDataStore} from "@/stores/data.js";
import Modal from "@/components/modal.vue";
import Form from "form-backend-validation";
import MText from "@/components/form/m-text.vue";
import MSelect from "@/components/form/m-select.vue";
const optionsData = useDataStore()
const http = inject('http')
const emit = defineEmits(['updated'])
const props = defineProps({
  data: {
    type: Object,
    default: ()=> ({})
  }
})

let form = ref(new Form({
  name: '',
  examination: 0,
  control: 0,
  duration: 0,
  durationUnit: 'year',
  price: '',
  currency: 'TRY',
  userIds: [],
  status: 0
}))

const durationUnitList = optionsData.durationUnits
const currencyList = optionsData.currencies
const userList = computed(()=> optionsData.userList)
const modalType = computed(()=> props.data && Object.keys(props.data).length ? 'edit' : 'create')
const title = computed(()=> modalType.value === 'edit' ? 'Paketi Güncelle' : 'Paket Ekle')

watch(() => props.data, (val) => {
  if(val === null){
    form.value.reset()
    return;
  }
  form.value.populate(val)
});
const submit = ()=> {
  modalType.value === 'create' ? create() : update()
}
async function create() {
  try {
    await http.post('/packages',form.value.data())
    emit('updated')
    form.value.reset()
    window.toastr.success('Başarıyla eklendi')
  }
  catch (e) {
    window.toastr.error('Bir şeyler yanlış gitti')
  }
}
async function update() {
  try {
    await http.put('/packages/' + props.data.id,form.value.data())
    emit('updated')
    form.value.reset()
    window.toastr.success('Başarıyla güncellendi')
  }
  catch (e) {
    window.toastr.error('Bir şeyler yanlış gitti')
  }
}
</script>

<style scoped>

</style>