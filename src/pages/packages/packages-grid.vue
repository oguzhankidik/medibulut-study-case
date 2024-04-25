<template>
  <div>
    <div class="flex justify-between">
      <span class="mt-2 ms-2 text-lg font-semibold">{{ $route.name }}</span>
      <div class="flex">
        <package-search />
        <button type="button" data-modal-target="add-package-modal" data-modal-toggle="add-package-modal"  class="btn-primary" @click="selectedData = null">Yeni Paket Ekle</button>
      </div>
     </div>

    <packages-add-package-modal @updated="refreshGrid" :data="selectedData"/>
    <delete-modal :destroy="destroy" />
    <datagrid ref="datagrid" :columns="columns" url="/packages">

      <template #userIds="{ data }">
        <avatar-carousel :id-list="data.userIds" />
      </template>
      <template #duration="{ data }">
        <span> {{ helper.formatDuration(data) }} </span>
      </template>
      <template #currency="{ data }">
        <span> {{ helper.formatCurrency(data.currency) }}</span>
      </template>
      <template #price="{ data }">
        <span class="float-end"> {{ helper.formatPrice(data.price,data.currency) }} </span>
      </template>
      <template #actions="{ data }">
        <div class="relative">
          <dropdown-menu :id="data.id">
            <ul class="dropdown-menu">
              <li class="dropdown-item" data-modal-target="add-package-modal" data-modal-toggle="add-package-modal" @click="selectedData = data">Paketi Güncelle</li>
              <li class="dropdown-item text-red-500" data-modal-target="deleteModal" data-modal-toggle="deleteModal" @click="selectedData = data">Paketi sil</li>
            </ul>
          </dropdown-menu>
        </div>
      </template>
    </datagrid>
  </div>
</template>

<script setup>
import Datagrid from "@/components/datagrid.vue";
import {useHelperStore} from "@/stores/helper.js";
import PackagesAddPackageModal from "./packages-add-package-modal.vue";
import AvatarCarousel from "@/components/avatar-carousel.vue";
import {inject, ref} from "vue";
import DropdownMenu from "@/components/dropdown-menu.vue";
import DeleteModal from "@/components/delete-modal.vue";
import PackageSearch from "@/components/package-search.vue";
const helper = useHelperStore()
const http = inject('http')

const datagrid = ref(null)
const refreshGrid = ()=> {
  datagrid.value.refresh()
}
let selectedData = ref(null)

const destroy = async () => {
  try{
    await http.delete('/packages/' + selectedData.value.id)
    refreshGrid()
  }
  catch (e){
    window.toastr.error('Bir şeyler yanlış gitti')
  }
}
const columns = [
  { text: 'paket adı', value: 'name', sortable: true},
  { text: 'uzmanlar', value: 'userIds' },
  { text: 'muayene', value: 'examination', sortable: true },
  { text: 'kontrol', value: 'control', sortable: true },
  { text: 'geçerlilik', value: 'duration' },
  { text: 'hizmet ücreti', value: 'price' },
  { text: 'para birimi', value: 'currency' },
  { text: 'aktif/pasif', value: 'status', sortable: true },
  { value: 'actions'},
]

</script>