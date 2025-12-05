// src/composables/useAuth.js
import { ref } from 'vue'
import { auth } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

const user = ref(null)

onAuthStateChanged(auth, (u) => {
  user.value = u
})

const getUser = () => {
  return user.value
}

const logout = async () => {
  await signOut(auth)
  user.value = null
}

export function useAuth() {
  return {
    user,
    getUser,
    logout,
  }
}
