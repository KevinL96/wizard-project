// src/router.js
import { createRouter, createWebHistory } from 'vue-router'

// Import your components here
import PersonalData from './components/PersonalData.vue'
import CompanyData from './components/CompanyData.vue'
const routes = [
    { path: '/', component: PersonalData },
    { path: '/company', component: CompanyData }
]

const router = createRouter({
  history: createWebHistory(),
  routes // short for `routes: routes`
})

export default router