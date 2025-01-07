import { axios } from '@/utils/request'
import api from './index'

//人社局员工列表获取
export function getRSJUser(data) {
    return axios({
        url: '/stj/sys/user/humanResourcesList',
        method: 'post',
        baseURL: api.server_url + api.global_workflow_baseURL,
        data: data,
        // headers: {
        //   'userId': Vue.ls.get(USER_ID),
        // },
    })
}

//施工单位用户列表获取
export function getQYUser(data) {
    return axios({
        url: '/stj/sys/user/constructionEnterprisesList',
        method: 'post',
        baseURL: api.server_url + api.global_workflow_baseURL,
        data: data,
        // headers: {
        //   'userId': Vue.ls.get(USER_ID),
        // },
    })
}

export function getSingleQYUser(userId) {
    return axios({
        url: '/stj/sys/user/constructionEnterprisesById',
        method: 'get',
        baseURL: api.server_url + api.global_workflow_baseURL,
        params: {
            userId: userId
        }
        // headers: {
        //   'userId': Vue.ls.get(USER_ID),
        // },
    })
}

//新增施工单位用户
export function addQYUser(data) {
    return axios({
        url: '/stj/sys/user/addConstructionEnterprises',
        method: 'post',
        baseURL: api.server_url + api.global_workflow_baseURL,
        data: data,
        // headers: {
        //   'userId': Vue.ls.get(USER_ID),
        // },
    })
}

//编辑施工单位用户
export function editQYUser(data) {
    return axios({
        url: '/stj/sys/user/editConstructionEnterprises',
        method: 'put',
        baseURL: api.server_url + api.global_workflow_baseURL,
        data: data,
        // headers: {
        //   'userId': Vue.ls.get(USER_ID),
        // },
    })
}


//图片预览接口
export function previewPicture(url) {
    return axios({
        url: `/file/static${url}`,
        method: 'get',
        baseURL: api.server_url + api.global_course_baseURL,
        data: data,
        // headers: {
        //   'userId': Vue.ls.get(USER_ID),
        // },
    })
}
