import request from '@/utils/request'

//注册请求
export const userRegisterService = (registerData) => {
  // return request.post('/user/register', { username, password, repassword })
  const params = new URLSearchParams()
  for (let key in registerData) {
    params.append(key, registerData[key])
  }
  return request.post('/user/register', params)
}
//登录请求
export const userLoginService = (loginData) => {
  // return request.post('/user/login', { username, password })
  const params = new URLSearchParams()
  for (let key in loginData) {
    params.append(key, loginData[key])
  }
  return request.post('/user/login', params)
}

export const logOutService = () => {
  return request.put('/user/logout')
}
// 获取用户信息
export const getUserInfoService = () => {
  return request.get('/user/userInfo')
}

// 获取用户信息
export const getUserInfoByIdService = (userId) => {
  return request.get(`/user/profile?id=${userId}`)
}

export const followService = (id, ifFollow) => {
  return request.post(`/follow/${id}/${ifFollow}`)
}

export const queryFollowService = (id) => {
  return request.get(`/follow/${id}`)
}

export const updateUserInfoService = (param) => {
  return request.put('/user/update', param)
}

export const updateUserAvatarService = (param) => {
  return request.put('/user/updateAvatar', param)
}
