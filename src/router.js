import { createWebHistory, createRouter } from 'vue-router'
import {initFlowbite} from "flowbite";

const routes = [
    { path: '/',name: 'Paketler', component: ()=> import('@/pages/packages/packages-grid.vue') },
    { path: '/applied-packages', name: 'Uygulanan Paketler', component: ()=> import('@/pages/applied-packages/applied-packages-grid.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router