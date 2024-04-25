import { defineStore } from 'pinia'
import moment from "moment";
import {useDataStore} from "@/stores/data.js";
const dataStore = useDataStore()
export const useHelperStore = defineStore('helpers', {
    getters: {
        packages() {
            return dataStore.packages
        },
        getPackageName(){
            return (id) => this.packages.find(item => item.id === id)?.name ?? ''
        },
        getPackageType(){
            return (type) => dataStore.packageType[type]
        },
        getPackageListPrice(){

            return (id) => {
                let selectedPackage = this.packages.find(item => item.id === id)
                if(!selectedPackage) {
                    return ''
                }
                let price = selectedPackage.price
                let currency = selectedPackage.currency
                if(selectedPackage) {
                    return this.formatPrice(price,currency)
                }
                return ''
            }
        }
    },
    actions: {
        readableDate (date) {
            return moment(date).format('DD.MM.YYYY');
        },

        isFinished(id, property,data) {
            let packages = this.packages
            let selectedPackage = packages.find(item => item.id === id)
            if(!selectedPackage){
                return ''
            }
            let max = selectedPackage[property]
            return data >= max
                ? `<span class="text-gray-400">${max} / ${data}</span>`
                : `<span>${max} / ${data}</span>`;
        },

        findEndDate(start,duration,unit){
            let endDate = moment(start).add(duration,unit)
            return {
                date: endDate.format('DD.MM.YYYY'),
                remainingDate: endDate.diff(moment(start), 'days')
            }
        },

        formatPrice(data,currency) {
            return data ? data.toLocaleString() + (data.toLocaleString().includes(',') ? ' ' : ',00 ') + dataStore.currencySymbols[currency] : ''
        },
        formatCurrency(data) {
            return dataStore.currencies.find(item => item.value  === data).text
        },
        formatDuration(data){
            return data.duration + ' ' + (dataStore.durationUnits.find(item => item.value === data.durationUnit)?.text ?? '')
        }
    },
})