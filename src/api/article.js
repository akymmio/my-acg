import require from '@/utils/require'

//发布文章
export const publishArticleService = (data) => {
  return require.post('/article/publish', data)
}
//获取文章
export const getArticleService = (param) => {
  return require.get('/article/list', {
    params: param // 直接传递params对象
  })
}

export const getArticleByChannelService = (channelId) => {
  return require.get(`/article?channel_id=${channelId}`)
}
//查询文章根据文章id
export const getArticleByIdService = (articleId) => {
  return require.get(`/article/${articleId}`)
}
//点赞
export const addLikedCount = (articleId) => {
  return require.put(`/article/like/${articleId}`)
}
//查询是否点赞
export const queryLiked = (articleId) => {
  return require.get(`/article/likeOrNot/${articleId}`)
}

//添加评论
export const addComment = (data) => {
  return require.post('/comment/add', data)
}

//根据用户id获取文章
export const getArticleByUserIdService = (userId) => {
  return require.get(`/article/myArticle/${userId}`)
}
//查询用户点赞过的所有文章
export const getArticleLikedService = (userId) => {
  return require.get(`/article/userLiked/${userId}`)
}
