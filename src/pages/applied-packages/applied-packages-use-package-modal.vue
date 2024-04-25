<template>
  <modal modal-id="use-package-modal" modal-title="Paketten Kullan">
    <div v-if="props.selectedPackage" class="flex justify-between px-6 border-b py-4 border-t text-sm">
      <span>İlgili Paket Adı</span>
      <span>{{ helper.getPackageName(props.selectedPackage.packageId) }}</span>
    </div>
    <form @submit.prevent="submit">
      <m-select
          v-model="form.type"
          label="Paket Türü"
          :options="data.packageTypeList"
      />
      <m-select
          v-model="form.userId"
          label="İlgili Uzman"
          :options="data.userList"
      />
      <m-text
          v-model="form.useDate"
          label="Kullanım Tarihi"
          type="date"
      />
      <m-text
          v-model="form.note"
          label="Görüşme Notu"
      />

      <div class="flex items-center justify-end px-4 pt-3 rounded-b dark:border-gray-600">
        <button data-modal-hide="use-package-modal" type="button" class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">İptal</button>
        <button type="submit" class="text-white ms-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Paketi Uygula</button>
      </div>
    </form>
  </modal>
</template>

<script setup>

import Modal from "@/components/modal.vue";
import MSelect from "@/components/form/m-select.vue";
import Form from "form-backend-validation";
import MText from "@/components/form/m-text.vue";
import {inject, ref, watch} from "vue";
import {useDataStore} from "@/stores/data.js";
import {useHelperStore} from "@/stores/helper.js";
const helper = useHelperStore()

const props = defineProps(['selectedPackage'])

let form = ref(new Form({
  type: 1,
  packageId: null,
  userId: null,
  useDate: null,
  note: '',
}))

watch(() => props.selectedPackage, (val) => {
  form.value.packageId = props.selectedPackage.packageId
});


const data = useDataStore()



const http = inject('http')
const emitter = inject('emitter')
const submit = async ()=> {
  try {
    if(form.value.userId) {
      await http.post('/package-usages', form.value.data())
      window.toastr.success('Başarıyla eklendi')
      document.querySelector('[data-modal-hide=use-package-modal]').click()
      emitter.emit('refresh-datagrid','use')
    }
    else {
      window.toastr.error('Uzman Seçin')
    }
  }
  catch (e) {
    window.toastr.error('Bir şeyler yanlış gitt')
  }
}
</script>

<style scoped>

</style>