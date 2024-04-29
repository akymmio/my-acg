import require from '@/utils/require'

//查询用户点赞过的所有文章
export const getArticleLikedService = (userId) => {
  return require.get(`/liked/userLiked/${userId}`)
}
//点赞
export const addLikedCount = (articleId) => {
  return require.put(`/liked/${articleId}`)
}
//查询是否点赞
export const queryLiked = (articleId) => {
  return require.get(`/liked/likeOrNot/${articleId}`)
}
//查询用户被点赞的文章
export const getLikedNotification = (userId) => {
  return require.get(`/liked/${userId}`)
}
