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

export function navigationDel(data) {
  return request({
    url: '/navigation/del',
    method: 'post',
    data
  })
}

export function navigationTypeList() {
  return request({
    url: '/navigation/typeList',
    method: 'get'
  })
}

export function companyInfoEdit(data) {
  return request({
    url: '/company_info/edit',
    method: 'post',
    data
  })
}

export function companyInfo() {
  return request({
    url: '/company_info/info',
    method: 'get'
  })
}

export function acList() {
  return request({
    url: '/article_category/list',
    method: 'get'
  })
}

export function acAdd(data) {
  return request({
    url: '/article_category/add',
    method: 'post',
    data
  })
}

export function acEdit(data) {
  return request({
    url: '/article_category/edit',
    method: 'post',
    data
  })
}

export function acDel(data) {
  return request({
    url: '/article_category/del',
    method: 'post',
    data
  })
}

export function acStatus(data) {
  return request({
    url: '/article_category/changeStatus',
    method: 'post',
    data
  })
}

export function articleList(params) {
  return request({
    url: '/article/list',
    method: 'get',
    params: params
  })
}

export function articleCategoryList(params) {
  return request({
    url: '/article/clist',
    method: 'get',
    params: params
  })
}

export function articleAdd(data) {
  return request({
    url: '/article/add',
    method: 'post',
    data
  })
}

export function acAllList() {
  return request({
    url: '/article_category/allList',
    method: 'get'
  })
}

export function articleEdit(data) {
  return request({
    url: '/article/edit',
    method: 'post',
    data
  })
}

export function articleDel(data) {
  return request({
    url: '/article/del',
    method: 'post',
    data
  })
}

export function articleStatus(data) {
  return request({
    url: '/article/changeStatus',
    method: 'post',
    data
  })
}

export function setArticleOption(data) {
  return request({
    url: '/article/setOption',
    method: 'post',
    data
  })
}
