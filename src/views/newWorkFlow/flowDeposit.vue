<template>
  <div>
    <div>
      <a-card :bordered="false">
        <a-button
          v-if="userInfo.username === 'corporation001' || userInfo.username === 'corporation002' || userInfo.username === 'admin'"
          type="primary" @click="startFixedProcess(true)" style="margin-right: 10px">
          开启保证金存缴流程
        </a-button>
        <div id="formContent" style="margin-top: -10px">
          <div id="taskList">
            <div>
              <a-tabs :tabBarStyle="{ textAlign: 'center' }" @change="changeTab1()" v-model="taskTab.tabKey">
                <a-tab-pane
                  v-if="userInfo.username === 'kezhang' || userInfo.username === 'zhuguan' || userInfo.username === 'admin' || userInfo.username === 'Brokerage001' || userInfo.username === 'Brokerage002'"
                  key="1" tab="待办事项">
                  <div>
                    <a-tabs :tabBarStyle="{ textAlign: 'center' }" v-model="subTaskTab.tabKey">
                      <a-tab-pane key="1" tab="未认领">
                        <div class="card-table">
                          <div class="claimSearchList">
                            <a class="selectText">选择流程: </a>
                            <a-select v-model="instanceClaim" style="width: 200px; margin-left: 10px; margin-top: 10px"
                              :defaultActiveFirstOption="true">
                              <a-select-option v-for="item in processInstance" :key="item.id" :value="item.id">
                                {{ item.name }}
                              </a-select-option>
                            </a-select>
                            <a class="selectText">任务名称: </a>
                            <a-input v-model="taskName" class="selectFrame"> </a-input>
                            <a class="selectText">选择时间: </a>
                            <a-range-picker style="width: 250x" :show-time="{ format: 'HH:mm' }"
                              format="YYYY-MM-DD HH:mm" :placeholder="['开始时间', '结束时间']" :value="dateStrings"
                              @change="onChange" />
                            <a-button-group style="margin-left: 20px">
                              <a-button type="primary" icon="search" @click="getData()"
                                style="margin-left: 20px">查询</a-button>
                              <a-button type="primary" icon="reload" @click="selectCondition()">重置</a-button>
                            </a-button-group>
                          </div>
                          <a-card :bordered="false">
                            <div class="flowAnnounce">
                              <a-table bordered :columns="loadClaimcolumns" :dataSource="loadClaimData" rowKey="id">
                                <span slot="flowClaimName">待领取 </span>
                                <span slot="loadClaimaction" slot-scope="text, record, index">
                                  <a @click="claimTask(record)">认领</a>
                                </span>
                              </a-table>
                            </div>
                          </a-card>
                        </div>
                      </a-tab-pane>
                      <a-tab-pane key="2" tab="待处理">
                        <div class="card-table" style="padding: 10px">
                          <div class="announceSearchList">
                            <div>
                              <a class="selectText">选择流程: </a>
                              <a-select v-model="instanceProcessing" class="selectFrame"
                                :defaultActiveFirstOption="true">
                                <a-select-option v-for="item in processInstance" :key="item.id" :value="item.id">
                                  {{ item.name }}
                                </a-select-option>
                              </a-select>
                              <a class="selectText">任务名称: </a>
                              <a-input v-model="taskName" class="selectFrame"> </a-input>
                              <a class="selectText">选择时间: </a>
                              <a-range-picker style="width: 250x" :show-time="{ format: 'HH:mm' }"
                                format="YYYY-MM-DD HH:mm" :placeholder="['开始时间', '结束时间']" @change="onChange"
                                :value="dateStrings">
                              </a-range-picker>

                              <a-button-group style="margin-left: 20px">
                                <a-button type="primary" icon="search" @click="getData()"
                                  style="margin-left: 20px">查询</a-button>
                                <a-button type="primary" icon="reload" @click="selectCondition()">重置</a-button>
                              </a-button-group>
                            </div>
                          </div>
                          <a-card :bordered="false">
                            <div class="flowAnnounce">
                              <a-table bordered :columns="flowWillAnnouncecolumns" :dataSource="flowWillAnnounceData"
                                rowKey="id">
                                <span slot="flowWillAnnounceaction" slot-scope="text, record, index">
                                  <a @click="announceTask(record)">处理该任务</a>
                                  <a-divider type="vertical" />
                                  <a @click="seeHistory(record)">历史</a>
                                </span>
                              </a-table>
                            </div>
                          </a-card>
                        </div>
                      </a-tab-pane>
                    </a-tabs>
                  </div>
                </a-tab-pane>
                <a-tab-pane
                  v-if="userInfo.username === 'kezhang' || userInfo.username === 'zhuguan' || userInfo.username === 'admin' || userInfo.username === 'corporation001' || userInfo.username === 'corporation002'"
                  key="2" tab="历史">
                  <div>
                    <a-tabs :tabBarStyle="{ textAlign: 'center' }" v-model="subHistoryTab.tabKey">
                      <a-tab-pane key="5" tab="进行中">
                        <div class="card-table">
                          <div class="doingSearchList">
                            <a class="selectText">选择流程: </a>
                            <a-select v-model="instanceInProgress"
                              style="width: 200px; margin-left: 10px; margin-top: 10px"
                              :defaultActiveFirstOption="true">
                              <a-select-option v-for="item in processInstance" :key="item.id" :value="item.id">
                                {{ item.name }}
                              </a-select-option>
                            </a-select>
                            <a-button-group style="margin-left: 20px">
                              <a-button type="primary" icon="search" @click="getData()"
                                style="margin-left: 20px">查询</a-button>
                              <a-button type="primary" icon="reload" @click="selectCondition()">重置</a-button>
                            </a-button-group>
                          </div>
                          <a-card :bordered="false">
                            <div class="">
                              <a-table bordered :columns="flowDoingcolumns" :dataSource="flowDoingData" rowKey="id">
                                <span slot="flowDoingaction" slot-scope="text, record, index">
                                  <a @click="seeHistory(record)">历史</a>
                                </span>
                              </a-table>
                            </div>
                          </a-card>
                        </div>
                      </a-tab-pane>
                      <a-tab-pane key="3" tab="已完成">
                        <div class="card-table">
                          <div class="finishSearchList">
                            <a class="selectText">选择流程: </a>
                            <a-select v-model="instanceCompleted"
                              style="width: 200px; margin-left: 10px; margin-top: 10px"
                              :defaultActiveFirstOption="true">
                              <a-select-option v-for="item in processInstance" :key="item.id" :value="item.id">
                                {{ item.name }}
                              </a-select-option>
                            </a-select>
                            <a-button-group style="margin-left: 20px">
                              <a-button type="primary" icon="search" @click="getData()"
                                style="margin-left: 20px">查询</a-button>
                              <a-button type="primary" icon="reload" @click="selectCondition()">重置</a-button>
                            </a-button-group>
                          </div>
                          <a-card :bordered="false">
                            <div class="">
                              <a-table bordered :columns="flowFinishcolumns" :dataSource="flowFinishData" rowKey="id">
                                <span slot="flowFinishName">已完成 </span>
                                <span slot="flowFinishaction" slot-scope="text, record, index">
                                  <a @click="seeHistory(record)">历史</a>
                                </span>
                              </a-table>
                            </div>
                          </a-card>
                        </div>
                      </a-tab-pane>
                      <a-tab-pane key="4" tab="已拒绝">
                        <div class="card-table">
                          <div class="rejectSearchList">
                            <a class="selectText">选择流程: </a>
                            <a-select v-model="instanceRejected"
                              style="width: 200px; margin-left: 10px; margin-top: 10px"
                              :defaultActiveFirstOption="true">
                              <a-select-option v-for="item in processInstance" :key="item.id" :value="item.id">
                                {{ item.name }}
                              </a-select-option>
                            </a-select>
                            <a-button-group style="margin-left: 20px">
                              <a-button type="primary" icon="search" @click="getData()"
                                style="margin-left: 20px">查询</a-button>
                              <a-button type="primary" icon="reload" @click="selectCondition()">重置</a-button>
                            </a-button-group>
                          </div>
                          <a-card :bordered="false">
                            <div class="">
                              <a-table bordered :columns="flowRejectcolumns" :dataSource="flowRejectData" rowKey="id">
                                <span slot="flowRejectName">已拒绝 </span>
                                <span slot="flowRejectaction" slot-scope="text, record, index">
                                  <a @click="seeHistory(record)">历史</a>
                                </span>
                              </a-table>
                            </div>
                          </a-card>
                        </div>
                      </a-tab-pane>

                    </a-tabs>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
        </div>
      </a-card>
    </div>
    <a-modal title="保证金存缴流程" :visible="isModalVisible" @ok="startProcess" @cancel="handleCancel" width="800px">
      <div class="flowConfig">
        <div style="padding-top: 20px">
          <span>请选择存缴流程：</span>
          <a-select v-model="selectedProcessId" placeholder="请选择一个流程" style="width: 300px">
            <a-select-option v-for="item in flowConfigData" :key="item.processId" :value="item.processId">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </a-modal>


    <div>
      <annTask ref="modalform"> </annTask>
    </div>

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
import { mapState } from 'vuex'
export default {
  name: 'flowDeposit',
  components: { annTask, ApproveTask, ApproveNewTask, RollbackTask, approveModel, FlowHistory },
  data() {
    return {
      taskTab: {
        tabKey: '1', // 主 Tab 页的状态
      },
      subTaskTab: {
        tabKey: '1', // 待办事项下的子 Tab 页状态
      },
      subHistoryTab: {
        tabKey: '1', // 历史下的子 Tab 页状态
      },
      instanceClaim: '', // 未认领的选择流程
      instanceProcessing: '', // 待处理的选择流程
      instanceCompleted: '', // 已完成的选择流程
      instanceRejected: '', // 已拒绝的选择流程
      instanceInProgress: '', // 进行中的选择流程
      form: '',
      name: '',
      id: '',
      flowConfigData: [],
      isModalVisible: false,
      selectedProcessId: null,
      selectedProcessId: null,
      columns: [
        {
          title: '流程名称',
          align: 'center',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      processCategories: [{ category_name: '所有流程', functional_department: '', id: '' }],
      instance: '',
      processInstance: [{ id: '', name: '所有流程' }],
      taskName: '',
      startTime: '',
      endTime: '',
      flowWillAnnounceData: [],
      flowFinishData: [],
      flowRejectData: [],
      flowDoingData: [],
      loadClaimData: [],
      loadClaimcolumns: [
        {
          title: '状态',
          align: 'center',
          dataIndex: 'flowClaimName',
          scopedSlots: { customRender: 'flowClaimName' },
        },
        {
          title: '任务名称',
          align: 'center',
          dataIndex: 'nodeName',
        },
        {
          title: '流程名称',
          align: 'center',
          dataIndex: 'processName',
        },
        {
          title: '类型',
          align: 'center',
          dataIndex: 'type',
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createDate',
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'loadClaimaction',
          scopedSlots: { customRender: 'loadClaimaction' },
        },
      ],
      flowWillAnnouncecolumns: [
        {
          title: '任务名称',
          align: 'center',
          dataIndex: 'nodeName',
        },
        {
          title: '流程名称',
          align: 'center',
          dataIndex: 'processName',
        },
        {
          title: '企业名称',
          align: 'center',
          dataIndex: 'companyName',
        },
        {
          title: '项目名称',
          align: 'center',
          dataIndex: 'projectName',
        },
        {
          title: '保证金金额',
          align: 'center',
          dataIndex: 'Money',
        },
        // {
        //   title: '流程唯一标识',
        //   align: 'center',
        //   dataIndex: 'processInstanceId',
        // },
        // {
        //   title: '类型',
        //   align: 'center',
        //   dataIndex: 'type',
        // },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createDate',
        },
        {
          title: '操作',
          align: 'center',
          width: '20%',
          dataIndex: 'flowWillAnnounceaction',
          scopedSlots: { customRender: 'flowWillAnnounceaction' },
        },
      ],
      flowFinishcolumns: [
        {
          title: '状态',
          align: 'center',
          dataIndex: 'flowFinishName',
          scopedSlots: { customRender: 'flowFinishName' },
        },
        {
          title: '流程名称',
          align: 'center',
          dataIndex: 'processName',
        },
        {
          title: '开始时间',
          align: 'center',
          dataIndex: 'createDate',
        },
        {
          title: '结束时间',
          align: 'center',
          dataIndex: 'endDate',
        },
        {
          title: '详情',
          align: 'center',
          dataIndex: 'flowFinishaction',
          scopedSlots: { customRender: 'flowFinishaction' },
        },
      ],
      flowRejectcolumns: [
        {
          title: '状态',
          align: 'center',
          dataIndex: 'flowRejectName',
          scopedSlots: { customRender: 'flowRejectName' },
        },
        {
          title: '流程名称',
          align: 'center',
          dataIndex: 'processName',
        },
        {
          title: '开始时间',
          align: 'center',
          dataIndex: 'createDate',
        },
        {
          title: '结束时间',
          align: 'center',
          dataIndex: 'endDate',
        },
        {
          title: '详情',
          align: 'center',
          dataIndex: 'flowRejectaction',
          scopedSlots: { customRender: 'flowRejectaction' },
        },
      ],
      flowDoingcolumns: [
        {
          title: '流程名称',
          align: 'center',
          dataIndex: 'processName',
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createDate',
        },
        {
          title: '当前任务',
          align: 'center',
          dataIndex: 'currentTask',
        },
        {
          title: '详情',
          align: 'center',
          dataIndex: 'flowDoingaction',
          scopedSlots: { customRender: 'flowDoingaction' },
        },
      ],
      dateStrings: [],
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info // 假设用户信息存储在user模块中的info
    })
  },

  mounted() {
    this.startFixedProcess(false)
    this.getData()
    // 在获取到用户信息后，设置默认tab
    if (this.userInfo.username === 'corporation001' || this.userInfo.username === 'corporation002') {
      this.taskTab.tabKey = '2'; // 默认显示历史tab
      this.subHistoryTab.tabKey = '5'; // 默认显示进行中
    }
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
            console.log('flowConfigData', flowConfigData)
            console.log('flowConfigData', flowConfigData)
            //是否显示弹窗
            if (showModal) {
              this.isModalVisible = true
            } else {
              for (let i = 0; i < res.result.length; i++) {
                this.processInstance.push({
                  id: res.result[i].processId,
                  name: res.result[i].name,
                })
              }
            }
            let processCategories = this.processCategories
            for (var i = 0; i < flowConfigData.length; i++) {
              for (var j = 0; j < processCategories.length; j++) {
                if (flowConfigData[i].categoryId == processCategories[j].id) {
                  flowConfigData[i].categoryName = processCategories[j].category_name
                }
              }
            }
            this.flowConfigData = flowConfigData
            this.$message.success('流程数据加载成功')
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
      this.isModalVisible = false
      let userData = JSON.parse(localStorage.getItem('pro__Login_Userinfo'))
      axios.defaults.headers.common['userName'] = userData.value.username
      console.log('userData.value.username', userData.value.username)
      nw_getAction(`/process/startProcess/{processId}?processId=` + this.selectedProcessId)
      console.log('userData.value.username', userData.value.username)
      nw_getAction(`/process/startProcess/{processId}?processId=` + this.selectedProcessId)
        .then((res) => {
          if (res.success) {
            this.$message.success('开启流程成功')
            const { formDesignerId, onlineDataId, onlineTableId } = res.result.startProcessVO
            const taskId = res.result.fistTaskId
            this.$refs.modalform.openModal(formDesignerId, onlineDataId, onlineTableId, taskId)
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
    //条件重置
    selectCondition() {
      this.dateStrings = []
      this.instance = ''
      this.startTime = ''
      this.endTime = ''
      this.taskName = ''
      this.getData()
    },
    onChange(dates, dateStrings) {
      this.dateStrings = dateStrings
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
      this.startTime = dateStrings[0]
      this.endTime = dateStrings[1]
    },
    changeTab1() {
      // this.getData()
      // 根据 taskTab.tabKey 的变化处理子标签的状态
      if (this.taskTab.tabKey === '1') {
        this.subTaskTab.tabKey = '1'; // 切换到待办事项下的默认状态
      } else if (this.taskTab.tabKey === '2') {
        this.subHistoryTab.tabKey = '5'; // 切换到历史下的进行中
      }
    },
    // 更新表格数据
    getData() {
      this.flowWillAnnounceData = []
      this.flowFinishData = []
      this.flowRejectData = []
      this.loadClaimData = []
      // const tabKey = this.taskTab.tabKey
      // if (tabKey === '1') {
      //   // 待办事项
      //   if (this.subTaskTab.tabKey === '1') {
      //     this.getLoadClaim(); // 未认领
      //   } else if (this.subTaskTab.tabKey === '2') {
      //     this.getflowAnnounce(); // 待处理
      //   }
      // } else if (tabKey === '2') {
      //   // 历史
      //   if (this.subHistoryTab.tabKey === '5') {
      //     this.getDoingFlow(); // 进行中
      //   } else if (this.subHistoryTab.tabKey === '3') {
      //     this.getCompleteProcessInstance(); // 已完成
      //   } else if (this.subHistoryTab.tabKey === '4') {
      //     this.getCancelProcesses(); // 已拒绝
      //   }
      // }
      this.getLoadClaim(); // 获取未认领流程
      this.getflowAnnounce(); // 获取待处理流程
      this.getCompleteProcessInstance(); // 获取已完成流程
      this.getCancelProcesses(); // 获取已拒绝流程
      this.getDoingFlow(); // 获取进行中流程
    },
    //得到所有未认领的流程
    getLoadClaim() {
      let params = {
        processId: this.instanceClaim,
        taskName: this.taskName,
        startTime: this.startTime,
        endTime: this.endTime,
      }
      nw_postAction1(`/task/getClaim`, params)
        .then((res) => {
          this.loadClaimData = res.result
          if (this.loadClaimData.length > 0) {
            for (var i = 0; i < this.loadClaimData.length; i++) {
              this.loadClaimData[i].state = '待领取'
              var type = this.loadClaimData[i].type
              switch (type) {
                case 'Participative':
                  this.loadClaimData[i].type = '竞争任务'
                  break
                case 'Normal':
                  this.loadClaimData[i].type = '正常任务'
                  break
                default:
                  break
              }
            }
          }
        })
        .catch((res) => {
          console.log(res)
        })
    },
    claimTask(reocrd) {
      nw_getAction(`/task/claimTask/` + reocrd.id)
        .then((res) => {
          if (res.result) {
            this.$message.success('认领成功')
            this.getLoadClaim()
          } else {
            this.$message.error('认领失败')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },


    //获得待处理任务
    getflowAnnounce() {
      let params = {
        processId: this.instanceProcessing,
        taskName: this.taskName,
        startTime: this.startTime,
        endTime: this.endTime,
        categoryId: '1847453055727501313',
      }


      nw_postAction1('/task/getPendingTakes', params)
        .then((res) => {
          console.log('res321', res)
          this.flowWillAnnounceData = res.result
          console.log('flowWillAnnounceData查询', this.flowWillAnnounceData)
          // 使用Promise.all和限制并发
          const requests = []
          const maxConcurrentRequests = 5 // 限制并发数量
          const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

          const processItems = async () => {
            for (let i = 0; i < this.flowWillAnnounceData.length; i++) {
              // 处理状态和类型
              this.processStateAndType(this.flowWillAnnounceData[i])

              // 生成请求
              const request = nw_getAction(
                `/diagram/getByProcInstId?procInstId=${this.flowWillAnnounceData[i].processInstanceId}`
              )
                .then((res) => {
                  let url = res.result.historyInfo[1].url
                  let tableId = url.substring(33, 65)
                  let dataId = url.substring(66, 87)

                  return o_getAction('/cgform/api/form/' + tableId + '/' + dataId)
                })
                .then((res) => {
                  if (res.result.company_name) {
                    // this.flowWillAnnounceData[i].companyName = res.result.company_name
                    // this.flowWillAnnounceData[i].projectName = res.result.project_name
                    // this.flowWillAnnounceData[i].Money = res.result.money
                    // 使用 Vue.set 来更新对象属性
                    this.$set(this.flowWillAnnounceData[i], 'companyName', res.result.company_name);
                    this.$set(this.flowWillAnnounceData[i], 'projectName', res.result.project_name);
                    this.$set(this.flowWillAnnounceData[i], 'Money', res.result.money);
                  }
                })
                .catch((err) => {
                  console.log(err)
                })

              requests.push(request)

              // 限制并发
              if (requests.length >= maxConcurrentRequests) {
                await Promise.all(requests)
                requests.length = 0 // 清空已完成的请求
                await delay(100) // 适当延迟
              }
            }

            // 处理剩余的请求
            await Promise.all(requests)

            // 在所有请求完成后打印flowWillAnnounceData
            console.log('最终数据', this.flowWillAnnounceData)
          }

          processItems()
        })
        .catch((error) => {
          console.error(error)
        })
    },

    // 处理状态和类型
    processStateAndType(item) {
      const stateMapping = {
        WaitReviewWorkload: '工作量待审核',
        Ready: '已开始',
        Completed: '已完成',
        Reserved: '已领取',
        Created: '已创建',
      }
      item.state = stateMapping[item.state] || item.state

      const typeMapping = {
        Participative: '竞争任务',
        Normal: '正常任务',
      }
      item.type = typeMapping[item.type] || item.type
    },

    // 处理状态和类型
    processStateAndType(item) {
      const stateMapping = {
        WaitReviewWorkload: '工作量待审核',
        Ready: '已开始',
        Completed: '已完成',
        Reserved: '已领取',
        Created: '已创建',
      }
      item.state = stateMapping[item.state] || item.state

      const typeMapping = {
        Participative: '竞争任务',
        Normal: '正常任务',
      }
      item.type = typeMapping[item.type] || item.type
    },
    //获得已完成流程实例
    getCompleteProcessInstance() {
      const _this = this
      var id = this.instanceCompleted
      this.dialogVisibleFinish = false
      let params = {
        processId: this.instance,
        // startTime: this.startTime,
        // endTime: this.endTime,
      }
      nw_postAction1(`/process/getCompleteProcessInstance`, params)
        .then((res) => {
          if (res.result.length == 0) {
            _this.$message.success('此流程无数据')
            return
          }
          this.flowFinishData = res.result
        })
        .catch((error) => {
          _this.$message.error('查询流程失败')
          console.log(error)
        })
    },
    //获得已拒绝的流程
    getCancelProcesses() {
      let params = {
        processId: this.instanceRejected,
        // startTime: this.startTime,
        // endTime: this.endTime,
      }
      nw_postAction1(`/process/getCancelProcesses`, params)
        .then((res) => {
          console.log(res)
          if (res.result.length == 0) {
            _this.$message.success('此流程无数据')
            return
          }
          this.flowRejectData = res.result
        })
        .catch((error) => {
          _this.$message.error('查资源失败')
          console.log(error)
        })
    },
    //得到所有的正在进行的流程
    getDoingFlow() {
      let params = {
        processId: this.instanceInProgress,
        // taskName: this.taskName,
        // startTime: this.startTime,
        // endTime: this.endTime,
      }
      nw_postAction1(`/process/getInProgressProcessInstance`, params)
        .then((res) => {
          console.log(res)
          this.flowDoingData = res.result
          console.log('fsdf', this.flowDoingData)
        })
        .catch((error) => {
          _this.$message.error('查资源失败')
          console.log(error)
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
.flowNameSpan {
  display: inline-block;
  width: 100%;
}

.iconfont {
  font-size: 20px;
}

.iconfont .icon-liucheng {
  float: left;
}

.ididididi {
  margin-top: 20px;
}

.buttonstyle {
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 50px;
  zoom: 1;
}

.buttonstyle .xbutton {
  float: right;
  height: 30px;
  width: 40px;
  margin-top: 10px;
  margin-right: 10px;
}

.buttonstyle::after {
  content: '';
  height: 0;
  clear: both;
}

.addQA1 {
  z-index: 10;
  border: 1px solid #aaa;
  border-radius: 5px;
  width: 80%;
  height: 60%;
  background-color: #fff;
  height: auto;
  position: fixed;
  top: 27%;
  left: 18%;
}

.addQA1 .closeButton {
  font-size: 20px;
  float: right;
  margin: 14px;
  cursor: pointer;
}

.showHead {
  border-radius: 5px 5px 0px 0px;
  height: 40px;
  color: black;
  font-size: 20px;
  position: relative;
  background-color: #1890ff;
}

.showHead .showHeadContent {
  margin-left: 20px;
  line-height: 40px;
}

.overflow {
  transition: all 0.3s ease;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 5;
  background-color: rgba(70, 60, 60, 0.49);
  top: 0px;
}

.card-table {
  background-color: white;
}

.selectText {
  color: black;
  font-size: 20px;
  margin-left: 22px;
}

.seeInformation {
  z-index: 300;
  width: 95%;
  border: 1px solid #aaa;
  border-radius: 5px;
  margin: 20px;
  background-color: white;
}

.seeContent {
  margin-top: 7%;
  margin-bottom: 7%;
  margin-left: 7%;
  margin-right: 7%;
}

.selectFrame {
  width: 200px;
}
</style>