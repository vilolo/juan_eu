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

export function imgDescCategoryList(params) {
  return request({
    url: '/img_desc/categoryList',
    method: 'get',
    params: params
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

export function navigationList(params) {
  return request({
    url: '/navigation/list',
    method: 'get',
    params: params
  })
}

export function navigationAdd(data) {
  return request({
    url: '/navigation/add',
    method: 'post',
    data
  })
}

export function navigationStatus(data) {
  return request({
    url: '/navigation/changeStatus',
    method: 'post',
    data
  })
}

export function navigationPList(noId) {
  return request({
    url: '/navigation/pList',
    method: 'get',
    params: { noId: noId }
  })
}

export function navigationEdit(data) {
  return request({
    url: '/navigation/edit',
    method: 'post',
    data
  })
}
