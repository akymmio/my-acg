import require from '@/utils/require'

export const publishArticleService = (data) => {
  return require.post('/article/publish', data)
}
