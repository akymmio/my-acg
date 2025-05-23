import axios from 'axios'
import { useUserStore } from '@/stores'

//基础地址
const baseURL = '/api'
// const baseURL = 'http://47.120.46.231:8081'
const instance = axios.create({
  baseURL,
  timeout: 10000
  // headers: { 'X-Custom-Header': 'foobar' }
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    const userStore = useUserStore()
    //pinia中获取token
    if (userStore.token) {
      //请求头携带token
      config.headers.Authorization = userStore.token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (res) {
    // 2xx 范围内的状态码都会触发该函数。
    if (res.data.code === 0) return res
    //业务处理失败，抛出错误
    ElNotification({
      title: 'Error',
      message: res.data.message,
      type: 'error'
    })
    return Promise.reject(res.data.message)
  },
  function (error) {
    //权限不足
    if (error.response.status === 401) {
      ElNotification({
        title: '请先登录',
        type: 'error',
        duration: 1000,
        position: 'top-left'
      })
      const userStore = useUserStore()
      userStore.removeUser()
      userStore.removeToken()
    } else ElMessage.error('服务异常')
    // 超出 2xx 范围的状态码都会触发该函数。
    return Promise.reject(error)
  }
)
export default instance
export { baseURL }
