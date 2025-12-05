// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from './composables/useAuth'  // Import the useAuth composable
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import NotFound from './components/NotFound.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/home', component: Home, meta: { requiresAuth: true } },  // Protect the /home route
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }, // 404 catch-all
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const { getUser } = useAuth()  // Access the getUser function from the composable
  try {
    const user = await getUser()  // Wait for the user to be resolved

    // If the route requires authentication and the user is not logged in
    if (to.matched.some(record => record.meta.requiresAuth) && !user) {
      next('/')  // Redirect to the login page if not authenticated
    } else if (to.path === '/' && user) {
      next('/home')  // Prevent logged-in users from visiting the login page
    } else {
      next()  // Otherwise, continue with the navigation
    }
  } catch (error) {
    console.error('Error checking authentication:', error)
    next('/')  // If an error occurs during authentication check, redirect to login
  }
})


