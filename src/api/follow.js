import require from '@/utils/require'
//关注和取关
export const followService = (id, ifFollow) => {
  return require.post(`/follow/${id}/${ifFollow}`)
}
//查询是否关注
export const queryFollowService = (id) => {
  return require.get(`/follow/${id}`)
}
//查询谁关注我
export const getFollowMeService = () => {
  return require.get('/follow/followMe')
}
