import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Directive from "@/directives";
import naive from 'naive-ui'



createApp(App).use(Directive).use(naive).use(router).mount('#app')
