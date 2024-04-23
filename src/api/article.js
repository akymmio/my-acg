import require from '@/utils/require'

export const publishArticleService = (data) => {
  return require.post('/article/publish', data)
}

export const getArticleService = (param) => {
  return require.get('/article/list', {
    params: param // 直接传递params对象
  })
}

export const getArticleByChannelService = (channelId) => {
  return require.get(`/article?channel_id=${channelId}`)
}
//根据id
export const getArticleByIdService = (articleId) => {
  return require.get(`/article/${articleId}`)
}
