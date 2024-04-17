import require from '@/utils/require'

//注册请求
export const userRegisterService = (registerData) => {
  // return require.post('/user/register', { username, password, repassword })
  const params = new URLSearchParams()
  for (let key in registerData) {
    params.append(key, registerData[key])
  }
  return require.post('/user/register', params)
}
//登录请求
export const userLoginService = (loginData) => {
  // return require.post('/user/login', { username, password })
  const params = new URLSearchParams()
  for (let key in loginData) {
    params.append(key, loginData[key])
  }
  return require.post('/user/login', params)
}
// 获取用户信息
export const getUserInfoService = () => {
  return require.get('/user/userInfo')
}
