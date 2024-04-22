import require from '@/utils/require'

export const publishArticleService = (data) => {
  return require.post('/article/publish', data)
}

export const getArticleService = (channelId) => {
  return require.get(`/article?channel_id=${channelId}`)
}

export const getArticleContentService = (articleId) => {
  return require.get(`/article/${articleId}`)
}
