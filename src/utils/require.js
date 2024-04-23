import axios from 'axios'

import { useUserStore } from '@/stores'
import router from '@/router'

//基础地址
// const baseURL = 'https://big-event-vue-api-t.itheima.net'
const baseURL = '/api'
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
      message: res.data.message || 'test',
      type: 'error'
    })
    return Promise.reject(res.data.message)
  },
  function (error) {
    //权限不足
    if (error.response.status === 401) {
      // router.push('/login')
    }
    ElNotification({
      title: 'Error',
      message: error.response.data.message || '服务异常',
      type: 'error'
    })
    console.log(error)
    // 超出 2xx 范围的状态码都会触发该函数。
    return Promise.reject(error)
  }
)
export default instance
export { baseURL }
