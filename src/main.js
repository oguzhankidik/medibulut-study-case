import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router';
import './style.css'
import App from './App.vue'
import axios from "axios";
import 'flowbite';
import mitt from "mitt";
import toastr from 'toastr';
const emitter = mitt();
const pinia = createPinia()
const app = createApp(App)
const port = 3000;
window.toastr = toastr
axios.defaults.baseURL = location.protocol + '//' + location.hostname + ':' + port;

app.use(pinia)
app.use(router)
app.provide('http',axios)
app.provide('emitter',emitter)
pinia.use(({ store }) => {
    store.$http = axios
});
app.mount('#app')
