import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref()
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }
    return { setToken, removeToken, token }
  },
  {
    persist: true
  }
)
/**
 *定义用户的pinia
 */
