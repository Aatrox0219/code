<template>
  <div>
    <div>
      <a-card :bordered="false">
        <a-button v-if="
          userInfo.username === 'corporation001' ||
          userInfo.username === 'corporation002' ||
          userInfo.username === 'admin' ||
          userInfo.username === 'ceshi001'
        " type="primary" @click="startFixedProcess(true)" style="margin-right: 10px">
          保证金存缴申请
        </a-button>
        <div id="formContent" style="margin-top: -10px">
          <div id="taskList">
            <div>
              <a-tabs :tabBarStyle="{ textAlign: 'center' }" v-model="taskTab.tabKey">
                <a-tab-pane key="2" tab="存缴历史">
                  <div>
                    <div class="card-table">
                      <a-card :bordered="false">
                        <div class="table-container">
                          <commonTable ref="commonTableRef1" :configurationParameter="configurationParameter1"
                            :seeHistory="seeHistory">
                          </commonTable>
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
                          <commonTable ref="commonTableRef2" :configurationParameter="configurationParameter2"
                            :seeHistory="seeHistory" :announceTask="announceTask">
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
    <a-modal title="保证金存缴方式" :visible="isModalVisible" @ok="startProcess" @cancel="handleCancel" width="800px">
      <div class="flowConfig">
        <div style="padding-top: 20px">
          <span>请选择存缴方式：</span>
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
import { nw_postAction, nw_postAction1, nw_getAction, nw_getAllData } from '@api/newWorkApi'
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
  name: 'flowDeposit',
  components: { annTask, ApproveTask, ApproveNewTask, RollbackTask, approveModel, FlowHistory, commonTable },
  data() {
    return {
      configurationParameter1: {
        inquire: {
          categoryId: '1847453055727501313', //流程分类
          processIdList: ['20010', '20013', '20016', '20019'], //想要显示的流程信息
          applyState: ['instance', 'cancel', 'complete'], //想要查询的流程类型
        },
        columnsData: [
          {
            title: '状态',
            align: 'center',
            dataIndex: 'nodeName',
            dataLocation: 'nodeName',
            show: true,
          },
          {
            title: '企业名称',
            align: 'center',
            dataIndex: 'companyName',
            dataLocation: 'allData.main_payment.enterprise_name',
            show: true,
          },
          {
            title: '项目名称',
            align: 'center',
            dataIndex: 'projectName',
            dataLocation: 'allData.main_payment.project_name',
            show: true,
          },
          {
            title: '所属区县',
            align: 'center',
            dataIndex: 'projectAddress',
            dataLocation: 'allData.main_payment.project_address',
            show: true,
          },
          {
            title: '合同金额（万元）',
            align: 'center',
            dataIndex: 'Money',
            dataLocation: 'allData.main_payment.contract_amount',
            show: true,
          },
          {
            title: '负责人',
            align: 'center',
            dataIndex: 'responsiblePerson',
            dataLocation: 'allData.main_payment.responsible_person',
            show: true,
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
            dataLocation: 'allData.main_payment.create_time',
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
      configurationParameter2: {
        inquire: {
          categoryId: '1847453055727501313', //流程分类
          processIdList: ['20010', '20013', '20016', '20019'], //想要显示的流程信息
          applyState: ['pending'], //想要查询的流程类型
        },
        columnsData: [
          {
            title: '状态',
            align: 'center',
            dataIndex: 'nodeName',
            dataLocation: 'nodeName',
            show: true,
          },
          {
            title: '企业名称',
            align: 'center',
            dataIndex: 'companyName',
            dataLocation: 'allData.main_payment.enterprise_name',
            show: true,
          },
          {
            title: '项目名称',
            align: 'center',
            dataIndex: 'projectName',
            dataLocation: 'allData.main_payment.project_name',
            show: true,
          },
          {
            title: '所属区县',
            align: 'center',
            dataIndex: 'projectAddress',
            dataLocation: 'allData.main_payment.project_address',
            show: true,
          },
          {
            title: '合同金额（万元）',
            align: 'center',
            dataIndex: 'Money',
            dataLocation: 'allData.main_payment.contract_amount',
            show: true,
          },
          {
            title: '负责人',
            align: 'center',
            dataIndex: 'responsiblePerson',
            dataLocation: 'allData.main_payment.responsible_person',
            show: true,
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
            dataLocation: 'allData.main_payment.create_time',
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
      annTaskData: {},
      backlogNumber: 0,
      selectedStatus: 'all', // 状态默认选择 "全部"
      taskTab: {
        tabKey: '2', // 主 Tab 页的状态
      },
      flowConfigData: [],
      isModalVisible: false,
      selectedProcessId: null,
      // processInstance: [{ id: '', name: '所有流程' }],
    }
  },
  computed: {
    userInfo() {
      // 从 Vue.ls 中获取 USER_INFO
      return Vue.ls.get(USER_INFO) || {}
    },
  },

  mounted() {
    this.startFixedProcess(false)
    this.getData()
    console.log('当前用户信息', this.userInfo)
  },
  methods: {
    //获取保证金存缴的流程数据,1847453055727501313是保证金存缴的流程分类id
    startFixedProcess(showModal) {
      let url = '/process/processList/{categoryId}?categoryId=1847453055727501313&category=1'
      nw_getAction(url)
        .then((res) => {
          console.log('保证金存缴流程数据', res)
          if (res.success) {
            let flowConfigData = res.result

            // 去掉name中的“存缴”后缀
            flowConfigData = flowConfigData.map((item) => {
              return {
                ...item,
                name: item.name.replace(/存缴$/, ''), // 移除后缀
              }
            })
            //是否显示弹窗
            if (showModal) {
              this.isModalVisible = true
            }
            this.flowConfigData = flowConfigData
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
    handleOk() {
      this.isModalVisible = false // 点击确定后隐藏弹窗
    },
    handleCancel() {
      this.isModalVisible = false // 点击取消后隐藏弹窗
    },
    //开启流程
    startProcess() {
      if (!this.selectedProcessId) {
        this.$message.warning('请选择一个流程')
        return
      }
      //在传给annTask组件的时候，将新的存缴方式传过去
      const selectedProcess = this.flowConfigData.find((item) => item.processId === this.selectedProcessId)
      if (selectedProcess) {
        // 去掉 "存缴" 后缀
        const processName = selectedProcess.name.replace(/存缴$/, '')
        // 将处理后的值赋给 newProjectStatus
        this.annTaskData.projectStatus = processName
      } else {
        console.log('未找到匹配的流程配置')
      }
      this.isModalVisible = false
      let userData = JSON.parse(localStorage.getItem('pro__Login_Userinfo'))
      axios.defaults.headers.common['userName'] = userData.value.username
      console.log('userData.value.username', userData.value.username)
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
              '存缴',
              this.annTaskData
            )
          } else {
            this.$message.error('开启流程失败')
          }
          this.selectedProcessId = null
        })
        .catch((error) => {
          console.log(error)
        })
    },
    //查看历史
    seeHistory(record) {
      this.$refs.flowHistory.openModal(record)
    },
    changeTab1() {
      // this.getData()
      // 根据 taskTab.tabKey 的变化处理子标签的状态
      if (this.taskTab.tabKey === '1') {
        this.subTaskTab.tabKey = '1' // 切换到待办事项下的默认状态
      } else if (this.taskTab.tabKey === '2') {
        this.subHistoryTab.tabKey = '5' // 切换到历史下的进行中
      }
    },
    // 更新表格数据
    getData() {
      // 先获取子组件实例
      const commonTableInstance1 = this.$refs.commonTableRef1;
      if (commonTableInstance1) {
        // 调用子组件的getAllList方法
        commonTableInstance1.getAllList();
      }

      const commonTableInstance2 = this.$refs.commonTableRef2;
      if (commonTableInstance2) {
        commonTableInstance2.getAllList();
      }
      this.getLoadClaim() // 获取未认领流程
    },

    //得到所有未认领的流程
    getLoadClaim() {
      let params = {
        processIdList: ['20010', '20013', '20016', '20019'],
        applyState: ['claim'],
        pageSize: 1000,
        pageNum: 1,
        categoryId: '1847453055727501313',
      }
      nw_getAllData(`/generalList/getAllList`, params)
        .then((res) => {
          console.log('获取未认领的返回数据:', res.result.dataList)
          this.loadClaimData = res.result.dataList
          if (this.loadClaimData.length > 0) {
            const claimPromises = [] // 用于存储所有认领任务的 Promise

            for (var i = 0; i < this.loadClaimData.length; i++) {
              this.loadClaimData[i].state = '待领取'

              const projectAddress = this.loadClaimData[i].allData.main_payment.project_address

              //通过当前用户的地址和项目的地址进行匹配来自动认领
              if (this.userInfo.currentLocation === projectAddress) {
                const promise = this.claimTask(this.loadClaimData[i])
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
}

.table-container {
  width: 100%;
  /* 使容器宽度自适应 */
  overflow-x: auto;
  /* 在小屏幕上支持水平滚动 */
}
</style>