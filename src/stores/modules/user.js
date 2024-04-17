import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfoService } from '@/api/user'
export const useUserStore = defineStore(
  'userinfo',
  () => {
    const token = ref()
    //用户信息

    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }
    // 获取用户信息
    const user = ref({})
    const getUser = async () => {
      const res = await getUserInfoService()
      user.value = res.data.data
    }
    const removeUser = () => {
      user.value = {}
    }
    return { setToken, removeToken, token, user, getUser, removeUser }
  },
  {
    persist: true
  }
)
/**
 *定义用户的pinia
 */
