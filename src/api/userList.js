import { axios } from '@/utils/request'
import api from './index'

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