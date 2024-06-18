import request from '@/utils/request'

export const getCommentNotifyService = () => {
  return request('/comment')
}

export const deleteCommentService = (commentId) => {
  return request.delete(`/comment/${commentId}`)
}

export const getCommentService = (articleId) => {
  return request.get(`/comment/${articleId}`)
}
