import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { createPinia } from 'pinia'
import { auth } from './firebase' // your Firebase auth instance
import { onAuthStateChanged } from 'firebase/auth'
const pinia = createPinia()
let app = null
onAuthStateChanged(auth, () => {
    if (!app) {
        app = createApp(App)
        app.use(pinia)
        app.use(router)
        app.use(Vue3Toastify, {
            autoClose: 2000,
            position: 'top-right'
        })
        app.mount('#app')
    }
})
