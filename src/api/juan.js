import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/auth/login',
    method: 'post',
    params: params
  })
}
