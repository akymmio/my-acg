import request from '@/utils/request'
//关注和取关
export const followService = (id, ifFollow) => {
  return request.post(`/follow/${id}/${ifFollow}`)
}
//查询是否关注
export const queryFollowService = (id) => {
  return request.get(`/follow/${id}`)
}
//查询谁关注我
export const getFollowMeService = () => {
  return request.get('/follow/followMe')
}

export const getFollowService = () => {
  return request.get('/follow')
}
