import request from '@/utils/request'

//发布文章
export const publishArticleService = (data) => {
  return request.post('/article/publish', data)
}

//发布文章
export const updateArticleService = (data) => {
  return request.put('/article/update', data)
}
//获取文章
export const getArticleService = (param) => {
  return request.get('/article/list', {
    params: param // 直接传递params对象
  })
}
export const getArticleByChannelService = (channelId) => {
  return request.get(`/article?channel_id=${channelId}`)
}
//查询文章根据文章id
export const getArticleByIdService = (articleId) => {
  return request.get(`/article/${articleId}`)
}
//根据文章id查询文章简单数据
export const queryArticleByIdService = (articleId) => {
  return request.get(`/article/simple/${articleId}`)
}

//添加评论
export const addComment = (data) => {
  return request.post('/comment/add', data)
}
//根据用户id获取文章
export const getArticleByUserIdService = (userId) => {
  return request.get(`/article/myArticle/${userId}`)
}
// //查询用户点赞过的所有文章
// export const getArticleLikedService = (userId) => {
//   return request.get(`/article/userLiked/${userId}`)
// }
// //点赞
// export const addLikedCount = (articleId) => {
//   return request.put(`/article/like/${articleId}`)
// }
// //查询是否点赞
// export const queryLiked = (articleId) => {
//   return request.get(`/article/likeOrNot/${articleId}`)
// }
