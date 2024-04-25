<template>
  <div>
    <div class="flex justify-between">
      <span class="mt-2 ms-2 text-lg font-semibold">{{ $route.name }}</span>

      <button type="button" data-modal-target="apply-package-modal" data-modal-toggle="apply-package-modal"  class="btn-primary" @click="selectedData = null">Paket Uygula</button>
    </div>
    <applied-packages-create-modal :data="selectedData" />
    <applied-packages-use-package-modal :selectedPackage="selectedData"/>
    <delete-modal :destroy="destroy" />
    <datagrid id="ap" ref="datagrid" :columns="columns" url="/applied-packages" :clickable="true" @selected="showDetails">

      <template #userId="{ data }">
        <avatar-carousel :id-list="data.userId" />
      </template>
      <template #startedAt="{ data }">
        <span> {{ helper.readableDate(data.startedAt) }} </span>
      </template>
      <template #packageId="{ data }">
        <span> {{ helper.getPackageName(data.packageId) }} </span>
      </template>
      <template #examination="{ data }">
        <div v-html="helper.isFinished(data.packageId,'examination',data.examination)"></div>
      </template>
      <template #control="{ data }">
        <div v-html="helper.isFinished(data.packageId,'control',data.control)"></div>
      </template>
      <template #price="{ data }">
        <span>{{ helper.formatPrice(data.price,data.currency) }}</span>
      </template>
      <template #list_price="{ data }">
        <span>{{ helper.getPackageListPrice(data.packageId) }}</span>
      </template>
      <template #finishedAt="{ data }">
        <button type="button" :data-tooltip-target="data.id+'_remainingTime'" data-tooltip-placement="bottom"> {{ helper.findEndDate(data.startedAt,data.duration,data.durationUnit).date }} </button>
        <div :id="data.id+'_remainingTime'" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip">
          Kalan Süre: {{ helper.findEndDate(data.startedAt,data.duration,data.durationUnit).remainingDate }} Gün
          <div class="tooltip-arrow" data-popper-arrow></div>
        </div>
      </template>
      <template #actions="{ data }">
        <div class="relative">
          <dropdown-menu :id="data.id">
            <ul class="dropdown-menu">
              <li class="dropdown-item" data-modal-target="use-package-modal" data-modal-toggle="use-package-modal" @click="selectedData = data">Paketten Kullan</li>
              <li class="dropdown-item" data-modal-target="use-package-modal" data-modal-toggle="apply-package-modal" @click="selectedData = data">Paketi Düzenle</li>
              <li class="dropdown-item text-red-500" data-modal-target="deleteModal" data-modal-toggle="deleteModal" @click="selectedData = data">Paketi Sil</li>
            </ul>
          </dropdown-menu>
        </div>
      </template>
    </datagrid>
    <datagrid v-if="usageGridUrl.length" id="use" class="mt-5" :columns="usageColumns" :url="usageGridUrl">
      <template #usedAt>
        {{ helper.readableDate(usageGridData.startedAt) }}
      </template>
      <template #type="{ data }">
        {{ helper.getPackageType(data.type) }}
      </template>
      <template #packageId="{ data }">
        <span> {{ helper.getPackageName(data.packageId) }} </span>
      </template>
      <template #userId>
        <avatar-carousel type="text" :id-list="usageGridData.userId" />
      </template>
    </datagrid>
  </div>
</template>

<script setup>
import DropdownMenu from "../../components/dropdown-menu.vue";
import Datagrid from "../../components/datagrid.vue";
import DeleteModal from "../../components/delete-modal.vue";
import AvatarCarousel from "../../components/avatar-carousel.vue";
import { useHelperStore } from "@/stores/helper.js";
import {inject, nextTick, ref} from "vue";
import AppliedPackagesCreateModal from "@/pages/applied-packages/applied-packages-create-modal.vue";
import AppliedPackagesUsePackageModal from "@/pages/applied-packages/applied-packages-use-package-modal.vue";
const helper = useHelperStore()

let http = inject('http')

let selectedData = ref(null)
const datagrid = ref(null)
const refreshGrid = ()=> {
  datagrid.value.refresh()
}
const destroy = async () => {
  try{
    await http.delete('/applied-packages/' + selectedData.value.id)
    window.toastr.success('Başarıyla silindi')
    refreshGrid()
  }
  catch (e) {
    window.toastr.error('Bir şeyler yanlış gitti')
  }
}

let usageGridUrl = ref('');
let usageGridData = ref(null);

const showDetails =  (val) => {
  usageGridUrl.value = ''
  nextTick(()=> usageGridUrl.value = '/package-usages?packageId=' + val.packageId )
  usageGridData.value = val
}

const columns = [
  { text: 'başlangıç', value: 'startedAt', sortable: true},
  { text: 'uzman', value: 'userId' },
  { text: 'paket adı', value: 'packageId', sortable: true },
  { text: 'muayene', value: 'examination', sortable: true },
  { text: 'kontrol', value: 'control' },
  { text: 'bitiş tarihi', value: 'finishedAt' },
  { text: 'paket notu', value: 'note' },
  { text: 'liste fiyatı', value: 'list_price' },
  { text: 'uygulanan fiyat', value: 'price', sortable: true },
  { value: 'actions'},
]
const usageColumns = [
  { text: 'kullanım tarihi', value: 'usedAt', sortable: true },
  { text: 'paket türleri', value: 'type',sortable: true  },
  { text: 'paket adı', value: 'packageId' },
  { text: 'ilgili uzman', value: 'userId'},
  { text: 'görüşme notu', value: 'note' },
  { value: 'actions'},
]
</script>

<style scoped>

</style>