<template>
  <div>
    <div>
      <a-card :bordered="false">
        <div id="formContent" style="margin-top: -10px">
          <div id="taskList">
            <div>
              <a-tabs :tabBarStyle="{ textAlign: 'center' }" v-model="taskTab.tabKey">
                <a-tab-pane key="3" tab="待更换" v-if="!['经纪公司'].some((role) => userInfo.roleNames.includes(role))">
                  <div>
                    <div class="card-table" style="padding: 10px">
                      <a-card :bordered="false">
                        <div class="flowAnnounce">
                          <commonTable
                            ref="commonTableRef1"
                            :configurationParameter="configurationParameter1"
                            :urge="urge"
                            :startFixedProcess="startFixedProcess"
                            :userInfo="userInfo"
                          >
                          </commonTable>
                        </div>
                      </a-card>
                    </div>
                  </div>
                </a-tab-pane>

                <a-tab-pane key="2" tab="历史">
                  <div>
                    <div class="card-table">
                      <a-card :bordered="false">
                        <div class="table-container">
                          <div class="table-container">
                            <commonTable
                              ref="commonTableRef2"
                              :configurationParameter="configurationParameter2"
                              :seeHistory="seeHistory"
                            >
                            </commonTable>
                          </div>
                        </div>
                      </a-card>
                    </div>
                  </div>
                </a-tab-pane>
                <a-tab-pane key="1">
                  <template #tab>
                    <a-badge :count="backlogNumber" :offset="[10, 0]">
                      <span>待办事项</span>
                    </a-badge>
                  </template>
                  <div>
                    <div class="card-table" style="padding: 10px">
                      <a-card :bordered="false">
                        <div class="flowAnnounce">
                          <commonTable
                            ref="commonTableRef3"
                            :configurationParameter="configurationParameter3"
                            :seeHistory="seeHistory"
                            :announceTask="announceTask"
                          >
                          </commonTable>
                        </div>
                      </a-card>
                    </div>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
        </div>
      </a-card>
    </div>
    <a-modal
      title="更换保函/延长有效期"
      :visible="isModalVisible"
      @ok="startProcess"
      @cancel="handleCancel"
      width="800px"
    >
      <div class="flowConfig">
        <div style="padding-top: 20px">
          <span>请选择更换方式：</span>
          <a-select v-model="selectedProcessId" placeholder="请选择一个流程" style="width: 300px">
            <a-select-option v-for="item in flowConfigData" :key="item.processId" :value="item.processId">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </a-modal>
    <annTask ref="modalform" :getData="getData" :userInfo="userInfo"> </annTask>

    <approve-model ref="approveModel" @close="getData"></approve-model>
    <flow-history ref="flowHistory"></flow-history>
  </div>
</template>
<script>
import axios from 'axios'
import annTask from './modules/annTask'
import { o_postAction, o_getAction } from '@/api/onApi.js'
import { nw_postAction, nw_postAction1, nw_getAction } from '@api/newWorkApi'
import ApproveTask from './modules/approveTask'
import ApproveNewTask from './modules/approveNewTask'
import RollbackTask from './modules/rollbackTask'
import approveModel from './modules/approveModel'
import { w_postAction, w_postAction1, w_getAction } from '@/api/workapi'
import Template from '../identification/template.vue'
import FlowHistory from './modules/flowHistory'
import { USER_NAME, USER_INFO } from '@/store/mutation-types'
import Vue from 'vue'
import { mapState } from 'vuex'
import { taskStateMapping } from './taskStateMapping'
import commonTable from './modules/commonTable.vue'
export default {
  name: 'flowExtend',
  components: { annTask, ApproveTask, ApproveNewTask, RollbackTask, approveModel, FlowHistory, commonTable },
  data() {
    return {
      configurationParameter1: {
        inquire: {
          categoryId: '1847453055727501313', //流程分类
          processIdList: ['20010', '20013', '20016', '20019'], //想要显示的流程信息
          applyState: ['complete'], //想要查询的流程类型
        },
        columnsData: [
          {
            title: '企业名称',
            align: 'center',
            dataIndex: 'companyName',
            dataLocation: 'allData.main_payment.enterprise_name',
            show: true,
            filterType: 'select',
          },
          {
            title: '项目名称',
            align: 'center',
            dataIndex: 'projectName',
            dataLocation: 'allData.main_payment.project_name',
            show: true,
            filterType: 'mixedInput',
          },
          {
            title: '所属区县',
            align: 'center',
            dataIndex: 'projectAddress',
            dataLocation: 'allData.main_payment.project_address',
            show: true,
            filterType: 'mixedInput',
          },
          {
            title: '保证金金额（万元）',
            align: 'center',
            dataIndex: 'Money',
            dataLocation: 'allData.main_payment.money',
            show: true,
          },
          {
            title: '负责人',
            align: 'center',
            dataIndex: 'responsiblePerson',
            dataLocation: 'allData.main_payment.responsible_person',
            show: true,
            filterType: 'input',
          },
          {
            title: '联系方式',
            align: 'center',
            dataIndex: 'mobile',
            dataLocation: 'allData.main_payment.mobile',
            show: true,
          },
          {
            title: '存缴完成时间',
            align: 'center',
            dataIndex: 'createDate',
            dataLocation: 'endDate',
            show: true,
            filterType: 'date',
          },
          {
            dataIndex: 'creditCode',
            dataLocation: 'allData.main_payment.credit_code',
            show: false,
          },
          {
            dataIndex: 'companyAddress',
            dataLocation: 'allData.main_payment.company_address',
            show: false,
          },
          {
            dataIndex: 'postalCode',
            dataLocation: 'allData.main_payment.postal_code',
            show: false,
          },
          {
            dataIndex: 'addressDetail',
            dataLocation: 'allData.main_payment.address_detail',
            show: false,
          },
          {
            title: '操作',
            align: 'center',
            dataIndex: 'flowExtendcolumns',
            scopedSlots: { customRender: 'flowExtendcolumns' },
            show: true,
          },
        ],
      },
      configurationParameter2: {
        inquire: {
          categoryId: '1867119925569568769', //流程分类
          processIdList: [], //想要显示的流程信息
          applyState: ['instance', 'cancel', 'complete'], //想要查询的流程类型
        },
        columnsData: [
          {
            title: '状态',
            align: 'center',
            dataIndex: 'nodeName',
            dataLocation: 'nodeName',
            show: true,
            filterType: 'select',
          },
          {
            title: '企业名称',
            align: 'center',
            dataIndex: 'companyName',
            dataLocation: 'allData.main_payment.enterprise_name',
            show: true,
            filterType: 'select',
          },
          {
            title: '项目名称',
            align: 'center',
            dataIndex: 'projectName',
            dataLocation: 'allData.main_payment.project_name',
            show: true,
            filterType: 'mixedInput',
          },
          {
            title: '所属区县',
            align: 'center',
            dataIndex: 'projectAddress',
            dataLocation: 'allData.main_payment.project_address',
            show: true,
            filterType: 'mixedInput',
          },
          {
            title: '保证金金额（万元）',
            align: 'center',
            dataIndex: 'Money',
            dataLocation: 'allData.main_payment.money',
            show: true,
          },
          {
            title: '负责人',
            align: 'center',
            dataIndex: 'responsiblePerson',
            dataLocation: 'allData.main_payment.responsible_person',
            show: true,
            filterType: 'input',
          },
          {
            title: '联系方式',
            align: 'center',
            dataIndex: 'mobile',
            dataLocation: 'allData.main_payment.mobile',
            show: true,
          },
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createDate',
            dataLocation: 'allData.main_extend.create_time',
            show: true,
          },
          {
            title: '详情',
            align: 'center',
            dataIndex: 'flowHistoryaction',
            scopedSlots: { customRender: 'flowHistoryaction' },
            show: true,
          },
        ],
      },
      configurationParameter3: {
        inquire: {
          categoryId: '1867119925569568769', //流程分类
          processIdList: [], //想要显示的流程信息
          applyState: ['pending'], //想要查询的流程类型
        },
        columnsData: [
          {
            title: '状态',
            align: 'center',
            dataIndex: 'nodeName',
            dataLocation: 'nodeName',
            show: true,
            filterType: 'select',
          },
          {
            title: '企业名称',
            align: 'center',
            dataIndex: 'companyName',
            dataLocation: 'allData.main_payment.enterprise_name',
            show: true,
            filterType: 'select',
          },
          {
            title: '项目名称',
            align: 'center',
            dataIndex: 'projectName',
            dataLocation: 'allData.main_payment.project_name',
            show: true,
            filterType: 'mixedInput',
          },
          {
            title: '所属区县',
            align: 'center',
            dataIndex: 'projectAddress',
            dataLocation: 'allData.main_payment.project_address',
            show: true,
            filterType: 'mixedInput',
          },
          {
            title: '保证金金额（万元）',
            align: 'center',
            dataIndex: 'Money',
            dataLocation: 'allData.main_payment.money',
            show: true,
          },
          {
            title: '负责人',
            align: 'center',
            dataIndex: 'responsiblePerson',
            dataLocation: 'allData.main_payment.responsible_person',
            show: true,
            filterType: 'input',
          },
          {
            title: '联系方式',
            align: 'center',
            dataIndex: 'mobile',
            dataLocation: 'allData.main_payment.mobile',
            show: true,
          },
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createDate',
            dataLocation: 'allData.main_extend.create_time',
            show: true,
          },
          {
            title: '操作',
            align: 'center',
            dataIndex: 'flowWillAnnounceaction',
            scopedSlots: { customRender: 'flowWillAnnounceaction' },
            show: true,
          },
        ],
      },
      extendProcessId: 0,
      backlogNumber: 0,
      taskTab: {
        tabKey: '3', // 主 Tab 页的状态
      },
      selectedProcessId: null,
    }
  },
  computed: {
    userInfo() {
      // 从 Vue.ls 中获取 USER_INFO
      return Vue.ls.get(USER_INFO) || {} // 如果没有值，默认为空对象
    },
  },

  created() {
    if (!['经纪公司'].some((role) => this.userInfo.roleNames.includes(role))) {
      this.taskTab.tabKey = '3' // 显示 "待更换" 页
    } else {
      this.taskTab.tabKey = '2' // 显示 "历史" 页
    }
  },
  mounted() {
    this.startFixedProcess(false)
    this.getData()
    console.log('当前用户信息', this.userInfo)
  },
  methods: {
    //获取保函变更/延长有效期的流程数据,1867119925569568769是保函变更/延长有效期的流程分类id
    startFixedProcess(record) {
      // 获取当前点击的项目名称和存缴方式
      this.currentProjectStatus = record ? record.depositWay : ''
      this.currentRecord = record
      let url = '/process/processList/{categoryId}?categoryId=1867119925569568769&category=1'
      nw_getAction(url)
        .then((res) => {
          console.log('更换保函/延长有效期流程数据', res)
          if (res.success) {
            this.$message.success('加载成功')
          } else {
            this.$message.error('查询可开启的流程失败')
          }
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('请求失败')
        })
    },

    //TODO 预警 发送短信
    urge() {},

    //开启流程
    startProcess(record) {
      let userData = JSON.parse(localStorage.getItem('pro__Login_Userinfo'))
      axios.defaults.headers.common['userName'] = userData.value.username
      console.log('userData.value.username', userData.value.username)
      if (record.depositWay === '担保公司保函') {
        this.selectedProcessId = ''
      } else if (record.depositWay === '保险公司保函') {
        this.selectedProcessId = ''
      } else if (record.depositWay === '银行保函') {
        this.selectedProcessId = ''
      } else if (record.depositWay === '银行现金存单') {
        this.selectedProcessId = ''
      }
      nw_getAction(`/process/startProcess/{processId}?processId=` + this.selectedProcessId)
        .then((res) => {
          if (res.success) {
            this.$message.success('开启流程成功')
            const { formDesignerId, onlineDataId, onlineTableId, processInstanceId } = res.result.startProcessVO
            const taskId = res.result.fistTaskId
            this.$refs.modalform.openModal(
              formDesignerId,
              onlineDataId,
              onlineTableId,
              taskId,
              processInstanceId,
              '补缴',
              this.currentRecord
            )
          } else {
            this.$message.error('开启流程失败')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    //查看历史
    seeHistory(record) {
      this.$refs.flowHistory.openModal(record)
    }, // 更新表格数据
    getData() {
      const commonTableInstance1 = this.$refs.commonTableRef1
      if (commonTableInstance1) {
        commonTableInstance1.getAllList()
      }
      const commonTableInstance2 = this.$refs.commonTableRef2
      if (commonTableInstance2) {
        commonTableInstance2.getAllList()
      }
      const commonTableInstance3 = this.$refs.commonTableRef3
      if (commonTableInstance3) {
        commonTableInstance3.getAllList()
      }
      this.getLoadClaim() // 获取未认领流程
    },
    //得到所有未认领的流程
    getLoadClaim() {
      let params = {
        processIdList: [],
        applyState: ['claim'],
        categoryId: '1867119925569568769',
      }
      nw_postAction1(`/generalList/getAllList`, params)
        .then((res) => {
          console.log('获取未认领的返回数据:', res.result.dataList)
          this.loadClaimData = res.result.dataList
          if (this.loadClaimData.length > 0) {
            const claimPromises = [] // 用于存储所有认领任务的 Promise

            for (var i = 0; i < this.loadClaimData.length; i++) {
              this.loadClaimData[i].state = '待领取'

              const projectAddress = this.loadClaimData[i].allData.main_payment.project_address

              //通过用户的部门地址和项目的地址进行匹配来自动认领
              if (this.userInfo.orgAddress.some((addr) => addr === projectAddress)) {
                const promise = this.claimTask(this.loadClaimData[i])
                claimPromises.push(promise)
              }
            }

            // 等待所有认领任务完成后更新界面
            Promise.all(claimPromises).then(() => {})
          }
        })
        .catch((res) => {
          console.log(res)
        })
    },
    claimTask(reocrd) {
      return nw_getAction(`/task/claimTask/` + reocrd.taskId)
        .then((res) => {
          if (res.result) {
            console.log('认领成功', reocrd)
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
    },
    //处理该任务
    announceTask(record) {
      console.log('record1', record)
      if (record.flag) {
        this.$refs.approveModel.announceRollTask(record)
      } else {
        this.$refs.approveModel.announceTask(record)
      }
    },
  },
}
</script>
<style scoped>
.card-table {
  background-color: white;
  min-height: 650px;
}

.table-container {
  width: 100%;
  /* 使容器宽度自适应 */
  overflow-x: auto;
  /* 在小屏幕上支持水平滚动 */
}
</style>