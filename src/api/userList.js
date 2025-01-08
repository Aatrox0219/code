import { axios } from '@/utils/request'
import api from './index'
import { depositList } from './processId'
import { nw_getAction, nw_getAllData } from '@api/newWorkApi'

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

//施工单位登录用户数据查看
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

//认领接口
function claimTask(record) {
    return nw_getAction(`/task/claimTask/` + record.taskId)
        .then((res) => {
            if (res.result) {
                console.log('认领成功', record)
                return true // 认领成功返回 true
            } else {
                console.error('认领失败')
                return false // 认领失败返回 false
            }
        })
        .catch((error) => {
            console.log(error)
            return false // 出现错误时返回 false
        })
}


//登录用户自动认领流程接口
export function AutoClaim(processIdList, categoryId) {
    let params = {
        processIdList: processIdList,
        applyState: ['claim'],
        pageSize: 1000,
        pageNum: 1,
        categoryId: categoryId,
    }
    nw_getAllData(`/generalList/getAllList`, params)
        .then((res) => {
            console.log('获取未认领的返回数据:', res.result.dataList)
            const loadClaimData = res.result.dataList
            if (loadClaimData.length > 0) {
                const claimPromises = [] // 用于存储所有认领任务的 Promise

                for (var i = 0; i < loadClaimData.length; i++) {
                    loadClaimData[i].state = '待领取'

                    const projectAddress = loadClaimData[i].allData.main_payment.project_address

                    //通过用户的部门地址和项目的地址进行匹配来自动认领
                    if (this.userInfo.orgAddress.some((addr) => addr === projectAddress)) {
                        const promise = claimTask(loadClaimData[i])
                        claimPromises.push(promise)
                    }
                }

                // 等待所有认领任务完成后更新界面
                Promise.all(claimPromises).then(() => { })
            }
        })
        .catch((res) => {
            console.log(res)
        })
}