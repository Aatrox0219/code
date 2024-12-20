import { axios } from '@/utils/request'
import api from './index'

//post
export function c_postAction(url, parameter) {
  return axios({
    url: url,
    method: 'post',
    data: parameter,
    baseURL: api.server_url + api.global_cms_baseURL
  })
}

//post method= {post | put}
export function c_httpAction(url, parameter, method) {
  return axios({
    url: url,
    method: method,
    data: parameter,
    baseURL:api.server_url + api.global_cms_baseURL
  })
}

//put
export function c_putAction(url, parameter) {
  return axios({
    url: url,
    method: 'put',
    data: parameter,
    baseURL:api.server_url + api.global_cms_baseURL
  })
}

//get
export function c_getAction(url, parameter) {
  return axios({
    url: url,
    method: 'get',
    params: parameter,
    baseURL:api.server_url + api.global_cms_baseURL
  })
}

//deleteAction
export function c_deleteAction(url, parameter) {
  return axios({
    url: url,
    method: 'delete',
    params: parameter,
    baseURL:api.server_url + api.global_cms_baseURL
  })
}

export function getUserList(parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList(parameter) {
  return axios({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList(parameter) {
  return axios({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions(parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService(parameter) {
  return axios({
    url: api.service,
    method: parameter.id == 0 ? 'post' : 'put',
    data: parameter
  })
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export function downFile(url, parameter) {
  return axios({
    url: url,
    params: parameter,
    method: 'get',
    responseType: 'blob'
  })
}

