import request from '@/utils/request'

export const getCommentNotifyService = () => {
  return request('/comment')
}
