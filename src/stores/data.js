import { defineStore } from 'pinia'
import {ref} from "vue";

export const useDataStore = defineStore('data', {
    state: () => {
        return {
            packages: [],
            users: [],
            shortenedCurrencies: [
                { value: 'TRY', text: 'TRY'},
                { value: 'USD', text: 'USD'},
                { value: 'EUR', text: 'EUR'},
            ],
            packageType: {
                'examination': 'Muayene',
                'control': 'Kontrol'
            },
            packageTypeList: [
                { text: 'Muayene', value:'examination' },
                { text: 'Kontrol', value:'control' }
            ],
            currencies: [
                { value: 'TRY', text: 'Türk Lirası (₺)' },
                { value: 'USD', text: 'Amerikan Doları ($)' },
                { value: 'EUR', text: 'Euro (€)' },
            ],
            currencySymbols: {
                TRY: '₺',
                USD: '$',
                EUR: '€'
            },
            durationUnits: [
                { value: 'year', text: 'Yıl' },
                { value: 'day', text: 'Gün' },
                { value: 'month', text: 'Ay' },
                { value: 'week', text: 'Hafta' },
            ],
        }
    },

    actions: {
        async onServerPrefetch() {

            this.$http.all([
                this.$http.get('/packages'),
                this.$http.get('/users'),
            ])
                .then(responses => {
                    this.packages = responses[0].data;
                    this.users  = responses[1].data;

                })
                .catch(error => {
                    window.toastr.error('Bir şeyler yanlış gitti')
                });
        }
    },

    getters: {
        packagePrices: (state) => state.packages.map(item => ({ id: item.id,price: item.price })),
        packageList: (state) => state.packages.map(item => ({ text: item.name, value: item.id })),
        userList: (state) => {
            let list = state.users.map(user => ({ text: user.name, value: user.id  }))
            return [{ text:'Uzman Ata', value: null }, ...list]
        },
    }
})