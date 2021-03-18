import request from '@/utils/request'

var lumenApi = 'http://lumen.leu/index.php/admin/v1'
// var lumenApi = 'http://198.35.45.87:9021/index.php/admin/v1'
export function getMarketData(params) {
  return request({
    url: lumenApi + '/newOrganizeData',
    method: 'get',
    params: params
  })
}

export function getTemplate(params) {
  return request({
    url: lumenApi + '/showTemplate',
    method: 'get',
    params: params
  })
}

export function saveTemplate(params) {
  return request({
    url: lumenApi + '/saveTemplate',
    method: 'post',
    params: params
  })
}

export function getCategory(params) {
  return request({
    url: lumenApi + '/getCategory',
    method: 'get',
    params: params
  })
}

export function addCollect(params) {
  return request({
    url: lumenApi + '/addCollect',
    method: 'post',
    params: params
  })
}

export function delCollect(id) {
  return request({
    url: lumenApi + '/delCollect',
    method: 'post',
    params: { id: id }
  })
}

export function saveSearchLog(params) {
  return request({
    url: lumenApi + '/saveSearchLog',
    method: 'post',
    params: params
  })
}

export function showSearchLog(params) {
  return request({
    url: lumenApi + '/showSearchLog',
    method: 'get',
    params: params
  })
}

export function delSearchLog(id) {
  return request({
    url: lumenApi + '/delSearchLog',
    method: 'post',
    params: { id: id }
  })
}

export function allCategory() {
  return request({
    url: lumenApi + '/allCategory',
    method: 'get'
  })
}
