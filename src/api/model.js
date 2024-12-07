import request from '@/utils/request'

//发布文章
export const publishModelService = (data) => {
  return request.post('/model/publish', data)
}

// //更新文章
// export const updateArticleService = (data) => {
//   return request.put('/article/update', data)
// }
// //获取文章
export const getModelService = (param) => {
  return request.get('/model/list', {
    params: param // 直接传递params对象
  })
}
// export const getArticleByChannelService = (channelId) => {
//   return request.get(`/article?channel_id=${channelId}`)
// }
// //查询文章根据文章id
export const queryArticleByIdService = (modelId) => {
  return request.get(`/model/simple/${modelId}`)
}
// //根据文章id查询文章简单数据
// export const queryArticleByIdService = (articleId) => {
//   return request.get(`/article/simple/${articleId}`)
// }

// //添加评论
// export const addComment = (data) => {
//   return request.post('/comment/add', data)
// }
// //根据用户id获取文章
// export const getArticleByUserIdService = (userId) => {
//   return request.get(`/article/myArticle/${userId}`)
// }

// export const deleteArticleService = (articleId) => {
//   return request.delete(`/article/${articleId}`)
// }
