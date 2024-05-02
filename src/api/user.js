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

export const logOutService = () => {
  return require.put('/user/logout')
}
// 获取用户信息
export const getUserInfoService = () => {
  return require.get('/user/userInfo')
}

// 获取用户信息
export const getUserInfoByIdService = (userId) => {
  return require.get(`/user/profile?id=${userId}`)
}

export const followService = (id, ifFollow) => {
  return require.post(`/follow/${id}/${ifFollow}`)
}

export const queryFollowService = (id) => {
  return require.get(`/follow/${id}`)
}

export const updateUserInfoService = (param) => {
  return require.put('/user/update', param)
}

export const updateUserAvatarService = (param) => {
  return require.put('/user/updateAvatar', param)
}
