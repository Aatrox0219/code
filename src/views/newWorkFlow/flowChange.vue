<template>
  <div>
    <div>
      <a-card :bordered="false">
        <div id="formContent" style="margin-top: -10px">
          <div id="taskList">
            <div>
              <a-tabs :tabBarStyle="{ textAlign: 'center' }" v-model="taskTab.tabKey">
                <a-tab-pane
                  key="3"
                  tab="可变更"
                  v-if="
                    userInfo.username === 'corporation001' ||
                    userInfo.username === 'corporation002' ||
                    userInfo.username === 'admin' ||
                    userInfo.username === 'ceshi001'
                  "
                >
                  <div>
                    <div class="card-table" style="padding: 10px">
                      <a-card :bordered="false">
                        <div class="flowAnnounce">
                          <!-- <a-table bordered :columns="flowChangecolumns" :dataSource="flowChangeData" rowKey="id">
                            <span slot="flowChangecolumns" slot-scope="text, record, index">
                              <a @click="startFixedProcess(true, record)">申请存缴方式变更</a>
                            </span>
                          </a-table> -->
                          <commonTable
                            :configurationParameter="configurationParameter1"
                            :startFixedProcess="startFixedProcess"
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
                      <div class="doingSearchList">
                        <a class="selectText">项目所在地: </a>
                        <a-select
                          v-model="selectedAddress"
                          style="width: 100px; margin-left: 10px; margin-top: 10px"
                          :defaultActiveFirstOption="true"
                        >
                          <a-select-option value="all">全部</a-select-option>
                          <a-select-option value="黄州区">黄州区</a-select-option>
                          <a-select-option value="团风县">团风县</a-select-option>
                          <a-select-option value="红安县">红安县</a-select-option>
                          <a-select-option value="罗田县">罗田县</a-select-option>
                          <a-select-option value="英山县">英山县</a-select-option>
                          <a-select-option value="浠水县">浠水县</a-select-option>
                          <a-select-option value="蕲春县">蕲春县</a-select-option>
                          <a-select-option value="黄梅县">黄梅县</a-select-option>
                          <a-select-option value="龙感湖管理区">龙感湖管理区</a-select-option>
                          <a-select-option value="麻城市">麻城市</a-select-option>
                          <a-select-option value="武穴市">武穴市</a-select-option>
                        </a-select>

                        <a class="selectText">变更申请进度: </a>
                        <a-select
                          v-model="selectedState"
                          style="width: 100px; margin-left: 10px; margin-top: 10px"
                          :defaultActiveFirstOption="true"
                        >
                          <a-select-option value="all">全部</a-select-option>
                          <a-select-option value="complete">已完成</a-select-option>
                          <a-select-option value="cancel">已拒绝</a-select-option>
                          <a-select-option value="instance">进行中</a-select-option>
                        </a-select>

                        <a class="selectText">项目名称: </a>
                        <a-input v-model="taskName" style="width: 200px; margin-left: 10px"></a-input>

                        <a-button-group style="margin-left: 20px">
                          <a-button type="primary" icon="search" @click="getData()" style="margin-left: 20px"
                            >查询</a-button
                          >
                          <a-button type="primary" icon="reload" @click="selectCondition()">重置</a-button>
                        </a-button-group>
                      </div>
                      <a-card :bordered="false">
                        <div class="table-container">
                          <!-- <a-table bordered :columns="flowHistorycolumns" :dataSource="flowHistoryData" rowKey="id">
                            <span slot="flowHistoryaction" slot-scope="text, record, index">
                              <a @click="seeHistory(record)">历史</a>
                            </span>
                          </a-table> -->
                          <commonTable
                            :configurationParameter="configurationParameter2"
                            :seeHistory="seeHistory"
                          >
                          </commonTable>
                        </div>
                      </a-card>
                    </div>
                  </div>
                </a-tab-pane>
                <a-tab-pane key="1">
                  <template #tab>
                    <!-- <a-badge :count="pendingTasksCount"> -->
                    <a-badge :count="backlogNumber" :offset="[10, 0]">
                      <span>待办事项</span>
                    </a-badge>
                  </template>
                  <div>
                    <div class="card-table" style="padding: 10px">
                      <a-card :bordered="false">
                        <div class="flowAnnounce">
                          <a-table
                            bordered
                            :columns="flowWillAnnouncecolumns"
                            :dataSource="flowWillAnnounceData"
                            rowKey="id"
                          >
                            <span slot="flowWillAnnounceaction" slot-scope="text, record, index">
                              <a @click="announceTask(record)">处理该任务</a>
                              <a-divider type="vertical" />
                              <a @click="seeHistory(record)">历史</a>
                            </span>
                          </a-table>
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
    <a-modal :title="modalTitle" :visible="isModalVisible" @ok="startProcess" @cancel="handleCancel" width="800px">
      <div class="flowConfig">
        <div style="padding-top: 20px">
          <span>请选择变更的存缴方式：</span>
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
  name: 'flowDeposit',
  components: { annTask, ApproveTask, ApproveNewTask, RollbackTask, approveModel, FlowHistory, commonTable },
  data() {
    return {
      currentRecord: {},
      currentProjectStatus: '',
      backlogNumber: 0,
      selectedStatus: 'all', // 状态默认选择 "全部"
      taskTab: {
        tabKey: '3', // 主 Tab 页的状态
      },
      instanceClaim: '', // 未认领的选择流程
      instanceProcessing: '', // 待处理的选择流程
      instanceHistory: '', // 历史的选择流程
      form: '',
      name: '',
      id: '',
      flowConfigData: [],
      isModalVisible: false,
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
      projectName: '',
      selectedAddress: 'all',
      selectedState: 'all',
      startTime: '',
      endTime: '',
      flowWillAnnounceData: [],
      flowHistoryData: [],
      flowChangeData: [],
      loadClaimData: [],
      configurationParameter1: {
        inquire: {
          //基本信息
          processId: '', //流程id
          startTime: '', //时间筛选
          endTime: '',
          categoryId: '1847453055727501313', //流程分类

          //通用接口信息
          pageSize: 100, //页面显示条数
          pageNum: 1, //当前页面
          processIdList: ['1', '5125', '5127', '5129', '5131'], //想要显示的流程信息
          applyState: ['complete'], //想要查询的流程类型
        },
        columnsData: [
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
            title: '保证金金额（万元）',
            align: 'center',
            dataIndex: 'Money',
            dataLocation: 'allData.main_payment.money',
            show: true,
          },
          {
            title: '原存缴方式',
            align: 'center',
            dataIndex: 'depositWay',
            dataLocation: 'allData.main_payment.deposit_way',
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
            dataLocation: 'allData.main_payment.form_create_date',
            show: true,
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
            dataIndex: 'contractAmount',
            dataLocation: 'allData.main_payment.contract_amount',
            show: false,
          },
          {
            dataIndex: 'addressDetail',
            dataLocation: 'allData.main_payment.address_detail',
            show: false,
          },
          {
            dataIndex: 'formCreateDate',
            dataLocation: 'allData.main_payment.form_create_date',
            show: false,
          },
          {
            dataIndex: 'formEndDate',
            dataLocation: 'allData.main_payment.form_end_date',
            show: false,
          },
          {
            dataIndex: 'proportions',
            dataLocation: 'allData.main_payment.proportions',
            show: false,
          },
          {
            dataIndex: 'reason',
            dataLocation: 'allData.main_payment.reason',
            show: false,
          },
          {
            title: '详情',
            align: 'center',
            dataIndex: 'flowChangecolumns',
            scopedSlots: { customRender: 'flowChangecolumns' },
            show: true,
          },
        ],
      },
      configurationParameter2: {
        inquire: {
          //基本信息
          processId: '', //流程id
          startTime: '', //时间筛选
          endTime: '',
          categoryId: '1860602147955077121', //流程分类

          //通用接口信息
          pageSize: 100, //页面显示条数
          pageNum: 1, //当前页面
          processIdList: ['1', '5125', '5127', '5129', '15125', '15127', '15129', '15131'], //想要显示的流程信息
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
            title: '保证金金额（万元）',
            align: 'center',
            dataIndex: 'Money',
            dataLocation: 'allData.main_payment.money',
            show: true,
          },
          {
            title: '原存缴方式',
            align: 'center',
            dataIndex: 'depositWay',
            dataLocation: 'allData.main_payment.deposit_way',
            show: true,
          },
          {
            title: '现存缴方式',
            align: 'center',
            dataIndex: 'depositWay',
            dataLocation: 'allData.main_payment.deposit_way',
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
            dataLocation: 'allData.main_payment.form_create_date',
            show: true,
          },
          {
            title: '详情',
            align: 'center',
            dataIndex: 'flowChangecolumns',
            scopedSlots: { customRender: 'flowChangecolumns' },
            show: true,
          },
        ],
      },
      flowChangecolumns: [
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
          title: '所属区县',
          align: 'center',
          dataIndex: 'projectAddress',
        },
        {
          title: '保证金金额（万元）',
          align: 'center',
          dataIndex: 'Money',
        },
        {
          title: '原存缴方式',
          align: 'center',
          dataIndex: 'depositWay',
        },
        {
          title: '负责人',
          align: 'center',
          dataIndex: 'responsiblePerson',
        },
        {
          title: '联系方式',
          align: 'center',
          dataIndex: 'mobile',
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createDate',
        },
        {
          title: '操作',
          align: 'center',
          width: '15%',
          dataIndex: 'flowHistoryaction',
          scopedSlots: { customRender: 'flowHistoryaction' },
        },
      ],
      flowWillAnnouncecolumns: [
        {
          title: '状态',
          align: 'center',
          dataIndex: 'nodeName',
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
          title: '所属区县',
          align: 'center',
          dataIndex: 'projectAddress',
        },
        {
          title: '保证金金额（万元）',
          align: 'center',
          dataIndex: 'Money',
        },
        {
          title: '原存缴方式',
          align: 'center',
          dataIndex: 'oldDepositMethod',
        },
        {
          title: '现存缴方式',
          align: 'center',
          dataIndex: 'newDepositMethod',
        },
        {
          title: '负责人',
          align: 'center',
          dataIndex: 'responsiblePerson',
        },
        {
          title: '联系方式',
          align: 'center',
          dataIndex: 'mobile',
        },
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
      flowHistorycolumns: [
        {
          title: '状态',
          align: 'center',
          dataIndex: 'nodeName',
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
          title: '所属区县',
          align: 'center',
          dataIndex: 'projectAddress',
        },
        {
          title: '保证金金额（万元）',
          align: 'center',
          dataIndex: 'Money',
        },
        {
          title: '原存缴方式',
          align: 'center',
          dataIndex: 'oldDepositMethod',
        },
        {
          title: '现存缴方式',
          align: 'center',
          dataIndex: 'newDepositMethod',
        },
        {
          title: '负责人',
          align: 'center',
          dataIndex: 'responsiblePerson',
        },
        {
          title: '联系方式',
          align: 'center',
          dataIndex: 'mobile',
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createDate',
        },
        {
          title: '详情',
          align: 'center',
          dataIndex: 'flowHistoryaction',
          scopedSlots: { customRender: 'flowHistoryaction' },
        },
      ],
      dateStrings: [],
    }
  },
  computed: {
    modalTitle() {
      return (
        <div>
          <span style="color: #52c41a;">当前存缴方式：{this.currentProjectStatus}</span>
        </div>
      )
    },
    userInfo() {
      // 从 Vue.ls 中获取 USER_INFO
      return Vue.ls.get(USER_INFO) || {} // 如果没有值，默认为空对象
    },
  },

  created() {
    // 根据 userInfo.username 动态设置主 Tab 页
    if (
      this.userInfo.username &&
      (this.userInfo.username === 'corporation001' ||
        this.userInfo.username === 'corporation002' ||
        this.userInfo.username === 'admin' ||
        this.userInfo.username === 'ceshi001')
    ) {
      this.taskTab.tabKey = '3' // 显示 "可变更" 页
    } else {
      this.taskTab.tabKey = '2' // 显示 "历史" 页
    }
  },
  mounted() {
    this.startFixedProcess(false, null)
    this.getData()
    console.log('当前用户信息', this.userInfo)
  },
  methods: {
    //获取存缴方式变更的流程数据,1860602147955077121是存缴方式变更的流程分类id
    startFixedProcess(showModal, record) {
      //获取当前点击的项目名称和存缴方式
      // this.currentProjectName = record ? record.projectName : ''
      this.currentProjectStatus = record ? record.depositWay : ''
      this.currentRecord = record
      console.log('currentRecord', record)
      let url = '/process/processList/{categoryId}?categoryId=1860602147955077121&category=1'
      nw_getAction(url)
        .then((res) => {
          console.log('存缴方式变更流程数据', res)
          if (res.success) {
            let flowConfigData = res.result
            console.log('flowConfigData', flowConfigData)

            // 去掉name中的“变更为”前缀
            flowConfigData = flowConfigData.map((item) => {
              return {
                ...item,
                name: item.name.replace(/^变更为/, ''), // 移除前缀
              }
            })

            console.log('处理后的flowConfigData', flowConfigData)

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

            this.flowConfigData = flowConfigData.filter((item) => {
              // 如果当前存缴方式包含某些关键词，就过滤掉对应的流程
              if (this.currentProjectStatus.includes('银行现金存单') && item.name.includes('银行现金存单')) {
                return false
              }
              if (this.currentProjectStatus.includes('保险公司保函') && item.name.includes('保险公司保函')) {
                return false
              }
              if (this.currentProjectStatus.includes('银行保函') && item.name.includes('银行保函')) {
                return false
              }
              if (this.currentProjectStatus.includes('担保公司保函') && item.name.includes('担保公司保函')) {
                return false
              }
              return true
            })
            console.log('this.flowConfigData', this.flowConfigData)
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
      this.selectedProcessId = null
    },
    handleCancel() {
      this.isModalVisible = false // 点击取消后隐藏弹窗
      this.selectedProcessId = null
    },
    //开启流程
    startProcess() {
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
            //在传给annTask组件的时候，将新的存缴方式传过去
            const selectedProcess = this.flowConfigData.find((item) => item.processId === this.selectedProcessId)
            if (selectedProcess) {
              // 去掉 "变更为" 前缀
              const processName = selectedProcess.name.replace(/^变更为/, '')
              // 将处理后的值赋给 newProjectStatus
              this.currentRecord.newProjectStatus = processName
            } else {
              console.log('未找到匹配的流程配置')
            }
            this.$refs.modalform.openModal(
              formDesignerId,
              onlineDataId,
              onlineTableId,
              taskId,
              processInstanceId,
              '变更',
              this.currentRecord
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
    //条件重置
    selectCondition() {
      this.dateStrings = []
      this.instance = ''
      this.selectAddress = 'all'
      this.selectedState = 'all'
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
    // 更新表格数据
    getData() {
      // this.flowWillAnnounceData = []
      // this.loadClaimData = []
      // this.flowHistoryData = []
      // this.flowChangeData = []
      // this.getChangeFlow()
      // this.getflowAnnounce() // 获取待处理流程
      // this.getHistoryFlow()
      this.getLoadClaim() // 获取未认领流程
    },
    //得到所有未认领的流程
    getLoadClaim() {
      let params = {
        processId: this.instanceClaim,
        taskName: this.taskName,
        startTime: this.startTime,
        endTime: this.endTime,
      }
      nw_postAction1(`/list/getClaim`, params)
        .then((res) => {
          console.log('获取未认领的返回数据:', res)
          this.loadClaimData = res.result
          if (this.loadClaimData.length > 0) {
            const claimPromises = [] // 用于存储所有认领任务的 Promise

            for (var i = 0; i < this.loadClaimData.length; i++) {
              this.loadClaimData[i].state = '待领取'

              const projectAddress = this.loadClaimData[i].projectAddress

              //通过当前用户的地址和项目的地址进行匹配来自动认领
              if (this.userInfo.currentLocation === projectAddress) {
                const promise = this.claimTask(this.loadClaimData[i])
                claimPromises.push(promise)
              }
            }

            // 等待所有认领任务完成后更新界面
            Promise.all(claimPromises).then(() => {
              this.getChangeFlow()
              this.getHistoryFlow() // 更新历史数据
              this.getflowAnnounce() // 更新待办事项
            })
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

    //获取可以申请变更的流程
    getChangeFlow() {
      let params = {
        processId: this.instanceClaim,
        address: this.userInfo.currentLocation,
        categoryId: '1847453055727501313',
      }

      nw_postAction1('/list/getCompleteProcessInstance', params)
        .then((res) => {
          console.log('res321', res)

          const processNameMapping = {
            银行现金存单存缴: '银行现金存单',
            银行保函存缴: '银行保函',
            保险公司保函存缴: '保险公司保函',
            担保公司保函存缴: '担保公司保函',
          }

          // 使用后端返回的 data 属性

          const flowChangeData = res.result.map((item, index) => ({
            ...item,
            key: item.id || `${item.nodeName}_${index}`,
            nodeName: taskStateMapping[item.nodeName],
            processName: processNameMapping[item.processName],
            companyName: item.enterpriseName,
            projectName: item.projectName,
            Money: item.ensureMoney,
            projectAddress: item.projectAddress,
            responsiblePerson: item.responsiblePerson,
            mobile: item.mobile,
            Proportions: item.proportions,
            // 判断 depositWay 是否为空，若为空则使用 processName
            depositWay: item.depositWay || processNameMapping[item.processName],
          }))

          // 按创建时间排序（从近到远）
          const sortedData = flowChangeData.sort((a, b) => new Date(b.createDate) - new Date(a.createDate))

          this.flowChangeData = sortedData
          console.log('flowChangeData查询', this.flowChangeData)
        })
        .catch((error) => {
          console.error(error)
        })
    },

    //获取历史
    getHistoryFlow() {
      let params = {
        processId: this.instanceHistory,
        taskName: this.taskName,
        startTime: this.startTime,
        endTime: this.endTime,
        categoryId: '1860602147955077121',
        address: this.selectedAddress === 'all' ? '' : this.selectedAddress, // 如果选择了全部，则发送空字符串
        applyState: this.selectedState === 'all' ? '' : this.selectedState, // 如果选择了全部，则发送空字符串
        processName: this.processName,
      }
      nw_postAction1('/list/getProcessAllState', params)
        .then((res) => {
          console.log('res321', res)

          const processNameMapping = {
            银行现金存单存缴: '银行现金存单',
            银行保函存缴: '银行保函',
            保险公司保函存缴: '保险公司保函',
            担保公司保函存缴: '担保公司保函',
          }

          const newDepositMethodMapping = {
            变更为银行保函: '银行保函',
            变更为银行现金存单: '银行现金存单',
            变更为保险公司保函: '保险公司保函',
            变更为担保公司保函: '担保公司保函',
          }
          // 使用后端返回的 data 属性
          const flowHistoryData = res.result.data.map((item) => {
            let nodeName
            if (item.state === 'cancel') {
              nodeName = '已拒绝'
            } else if (item.state === 'complete') {
              nodeName = '已完成'
            } else {
              nodeName = taskStateMapping[item.nodeName] || item.nodeName
            }

            return {
              ...item,
              nodeName,
              processName: processNameMapping[item.processName],
              newDepositMethod: newDepositMethodMapping[item.newDepositMethod],
              companyName: item.enterpriseName, // 添加企业名称
              projectName: item.projectName, // 添加项目名称
              Money: item.ensureMoney, // 添加保证金金额
              projectAddress: item.projectAddress, // 添加项目地址
              responsiblePerson: item.responsiblePerson,
              mobile: item.mobile,
              Proportions: item.proportions,
              oldDepositMethod: item.oldDepositMethod,
              newDepositMethod: item.newDepositMethod,
            }
          })
          // 按创建时间排序（从近到远）
          const sortedHistoryData = flowHistoryData.sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
          this.flowHistoryData = sortedHistoryData
        })
        .catch((error) => {
          console.error(error)
        })
    },
    //获得待处理任务
    getflowAnnounce() {
      let params = {
        processId: this.instanceProcessing,
        taskName: this.taskName,
        startTime: this.startTime,
        endTime: this.endTime,
        categoryId: '1860602147955077121',
      }

      nw_postAction1('/list/getPendingTakes', params)
        .then((res) => {
          console.log('res321', res)
          // this.flowWillAnnounceData = res.result
          const processNameMapping = {
            银行现金存单存缴: '银行现金存单',
            银行保函存缴: '银行保函',
            保险公司保函存缴: '保险公司保函',
            担保公司保函存缴: '担保公司保函',
          }

          const newDepositMethodMapping = {
            变更为银行保函: '银行保函',
            变更为银行现金存单: '银行现金存单',
            变更为保险公司保函: '保险公司保函',
            变更为担保公司保函: '担保公司保函',
          }
          // 使用后端返回的 data 属性
          this.backlogNumber = res.result.length
          const flowWillAnnounceData = res.result.map((item) => ({
            ...item,
            nodeName: taskStateMapping[item.nodeName],
            processName: processNameMapping[item.processName],
            newDepositMethod: newDepositMethodMapping[item.newDepositMethod],
            companyName: item.enterpriseName,
            projectName: item.projectName,
            Money: item.ensureMoney,
            projectAddress: item.projectAddress,
            responsiblePerson: item.responsiblePerson,
            mobile: item.mobile,
            Proportions: item.proportions,
            oldDepositMethod: item.oldDepositMethod,
            newDepositMethod: item.newDepositMethod,
          }))

          // 按创建时间排序（从近到远）
          const sortedData = flowWillAnnounceData.sort((a, b) => new Date(b.createDate) - new Date(a.createDate))

          this.flowWillAnnounceData = sortedData
          console.log('flowWillAnnounceData查询', this.flowWillAnnounceData)
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
  font-size: 13px;
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

.table-container {
  width: 100%;
  /* 使容器宽度自适应 */
  overflow-x: auto;
  /* 在小屏幕上支持水平滚动 */
}
</style>