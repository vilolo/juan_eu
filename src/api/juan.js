import request from '@/utils/request'

export var uploadApi = process.env.VUE_APP_BASE_API + '/index.php/admin/v1/img_desc/uploadImg'

export function imgDescList(params) {
  return request({
    url: '/img_desc/list',
    method: 'get',
    params: params
  })
}

export function imgDescAdd(data) {
  return request({
    url: '/img_desc/add',
    method: 'post',
    data
  })
}

export function imgDescCategoryList() {
  return request({
    url: '/img_desc/categoryList',
    method: 'get'
  })
}

export function imgDescEdit(data) {
  return request({
    url: '/img_desc/edit',
    method: 'post',
    data
  })
}

export function imgDescDel(data) {
  return request({
    url: '/img_desc/del',
    method: 'post',
    data
  })
}

export function changeStatus(data) {
  return request({
    url: '/img_desc/changeStatus',
    method: 'post',
    data
  })
}
