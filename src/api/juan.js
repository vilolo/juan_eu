import request from '@/utils/request'

export var uploadApi = 'http://juan.com/index.php/admin/v1/img_desc/uploadImg'

export function login(params) {
  return request({
    url: '/auth/login',
    method: 'post',
    params: params
  })
}
