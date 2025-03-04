import request from '@/utils/request'

//发布活动
export const publishActivityService = (data) => {
  return request.post('/activity/publish', data)
}

//获取文章
export const getActivityService = (param) => {
  return request.get('/activity/list', {
    params: param // 直接传递params对象
  })
}

export const getActivityByIdService = (activityId) => {
  return request.get(`/activity/${activityId}`)
}
