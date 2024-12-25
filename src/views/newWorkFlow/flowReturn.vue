<template>
  <div>
    <div>
      <a-card :bordered="false">
        <div id="formContent" style="margin-top: -10px">
          <div id="taskList">
            <div>
              <a-tabs :tabBarStyle="{ textAlign: 'center' }" v-model="taskTab.tabKey">
                <a-tab-pane key="3" tab="待返还" v-if="userInfo.username.endsWith('cb') || userInfo.username == 'admin'">
                  <div>
                    <div class="card-table" style="padding: 10px">
                      <a-card :bordered="false">
                        <div class="flowAnnounce">
                          <!-- <a-table bordered :columns="flowReturncolumns" :dataSource="flowReturnData" rowKey="id">
                              <span slot="flowReturncolumns" slot-scope="text, record, index">
                                <a @click="startProcess(record)">申请返还</a>
                              </span>
                            </a-table> -->
                          <commonTable ref="commonTableRef1" :configurationParameter="configurationParameter1"
                            :startProcess="startProcess">
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
                          <!-- <a-table bordered :columns="flowHistorycolumns" :dataSource="flowHistoryData" rowKey="id">
                            <span slot="flowHistoryaction" slot-scope="text, record, index">
                              <a @click="seeHistory(record)">历史</a>
                            </span>
                          </a-table> -->
                          <commonTable ref="commonTableRef2" :configurationParameter="configurationParameter2"
                            :seeHistory="seeHistory">
                          </commonTable>
                        </div>
                      </a-card>
                    </div>
                  </div>
                </a-tab-pane>
                <a-tab-pane key="1">
                  <template #tab>
                    <!-- <a-badge :count="pendingTasksCount"> -->
                    <a-badge :count=backlogNumber :offset="[10, 0]">
                      <span>待办事项</span>
                    </a-badge>
                  </template>
                  <div>
                    <div class="card-table" style="padding: 10px">
                      <a-card :bordered="false">
                        <div class="flowAnnounce">
                          <!-- <a-table bordered :columns="flowWillAnnouncecolumns" :dataSource="flowWillAnnounceData"
                            rowKey="id">
                            <span slot="flowWillAnnounceaction" slot-scope="text, record, index">
                              <a @click="announceTask(record)">处理该任务</a>
                              <a-divider type="vertical" />
                              <a @click="seeHistory(record)">历史</a>
                            </span>
                          </a-table> -->
                          <commonTable ref="commonTableRef3" :configurationParameter="configurationParameter3"
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
  name: 'flowReturn',
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
            title: '剩余金额（万元）',
            align: 'center',
            dataIndex: 'remainingAmount',
            dataLocation: 'allData.main_payment.remaining_amount',
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
            dataLocation: 'allData.main_payment.form_create_date',
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
            dataIndex: 'flowUseMoneycolumns',
            scopedSlots: { customRender: 'flowUseMoneycolumns' },
            show: true,
          },
        ],
      },
      configurationParameter2: {
        inquire: {
          categoryId: '1867119977859956738', //流程分类
          // 这里差一个返还的流程
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
            title: '保证金金额（万元）',
            align: 'center',
            dataIndex: 'Money',
            dataLocation: 'allData.main_payment.money',
            show: true,
          },
          {
            title: '剩余金额（万元）',
            align: 'center',
            dataIndex: 'remainingAmount',
            dataLocation: 'allData.main_payment.remaining_amount',
            show: true,
          },
          {
            title: '申请返还金额（万元）',
            align: 'center',
            dataIndex: 'returnAmount',
            dataLocation: 'allData.main_return.return_amount',
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
            dataLocation: 'allData.main_use.create_time',
            show: true,
          },
          {
            title: '操作',
            align: 'center',
            dataIndex: 'flowHistoryaction',
            scopedSlots: { customRender: 'flowHistoryaction' },
            show: true,
          },
        ],
      },
      configurationParameter3: {
        inquire: {
          categoryId: '1867119977859956738', //流程分类
          // 这里差一个返还的流程
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
            title: '保证金金额（万元）',
            align: 'center',
            dataIndex: 'Money',
            dataLocation: 'allData.main_payment.money',
            show: true,
          },
          {
            title: '剩余金额（万元）',
            align: 'center',
            dataIndex: 'remainingAmount',
            dataLocation: 'allData.main_payment.remaining_amount',
            show: true,
          },
          {
            title: '申请返还金额（万元）',
            align: 'center',
            dataIndex: 'returnAmount',
            dataLocation: 'allData.main_return.return_amount',
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
            dataLocation: 'allData.main_use.create_time',
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
      returnProcessId: 0,
      backlogNumber: 0,
      taskTab: {
        tabKey: '3', // 主 Tab 页的状态
      },
    }
  },
  computed: {
    userInfo() {
      // 从 Vue.ls 中获取 USER_INFO
      return Vue.ls.get(USER_INFO) || {}; // 如果没有值，默认为空对象
    },
  },

  created() {
    // 根据 userInfo.username 动态设置主 Tab 页
    if ((this.userInfo.username && this.userInfo.username.endsWith('cb')) || this.userInfo.username === 'admin') {
      this.taskTab.tabKey = '3'; // 显示 "使用申请" 页
    } else {
      this.taskTab.tabKey = '2'; // 显示 "历史" 页
    }
  },
  mounted() {
    this.startFixedProcess()
    this.getData()
    console.log('当前用户信息', this.userInfo)
  },
  methods: {
    //获取保证金返还的流程数据,1867119977859956738是保证金返还的流程分类id
    startFixedProcess() {
      let url = '/process/processList/{categoryId}?categoryId=1867119977859956738&category=1'
      nw_getAction(url)
        .then((res) => {
          console.log('保证金返还流程数据', res)
          if (res.success) {
            this.returnProcessId = res.result[0].processId
          } else {
            this.$message.error('查询可开启的流程失败')
          }
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('请求失败')
        })
    },
    //开启流程
    startProcess(record) {
      let userData = JSON.parse(localStorage.getItem('pro__Login_Userinfo'))
      axios.defaults.headers.common['userName'] = userData.value.username
      console.log('userData.value.username', userData.value.username)
      nw_getAction(`/process/startProcess/{processId}?processId=${this.returnProcessId}`)
        .then((res) => {
          if (res.success) {
            this.$message.success('开启流程成功')
            const { formDesignerId, onlineDataId, onlineTableId, processInstanceId } = res.result.startProcessVO
            const taskId = res.result.fistTaskId
            this.$refs.modalform.openModal(formDesignerId, onlineDataId, onlineTableId, taskId, processInstanceId, '返还', record)
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
    },
    // 更新表格数据
    getData() {
      const commonTableInstance1 = this.$refs.commonTableRef1;
      if (commonTableInstance1) {
        commonTableInstance1.getAllList();
      }
      const commonTableInstance2 = this.$refs.commonTableRef2;
      if (commonTableInstance2) {
        commonTableInstance2.getAllList();
      }
      const commonTableInstance3 = this.$refs.commonTableRef3;
      if (commonTableInstance3) {
        commonTableInstance3.getAllList();
      }
      this.getLoadClaim() // 获取未认领流程
    },
    //得到所有未认领的流程
    getLoadClaim() {
      let params = {
        // 这里差一个返还的流程
        processIdList: ['20010', '20013', '20016', '20019'],
        applyState: ['claim'],
        categoryId: '1867119977859956738',
      };
      nw_postAction1(`/generalList/getAllList`, params)
        .then((res) => {
          console.log('获取未认领的返回数据:', res.result.dataList);
          this.loadClaimData = res.result.dataList;
          if (this.loadClaimData.length > 0) {
            const claimPromises = []; // 用于存储所有认领任务的 Promise

            for (var i = 0; i < this.loadClaimData.length; i++) {
              this.loadClaimData[i].state = '待领取';

              const projectAddress = this.loadClaimData[i].allData.main_payment.project_address

              //通过当前用户的地址和项目的地址进行匹配来自动认领
              if (this.userInfo.currentLocation === projectAddress) {
                const promise = this.claimTask(this.loadClaimData[i]);
                claimPromises.push(promise);
              }

            }

            // 等待所有认领任务完成后更新界面
            Promise.all(claimPromises).then(() => { });
          }
        })
        .catch((res) => {
          console.log(res);
        });
    },
    claimTask(reocrd) {
      return nw_getAction(`/task/claimTask/` + reocrd.taskId)
        .then((res) => {
          if (res.result) {
            console.log('认领成功', reocrd);
            return true; // 认领成功返回 true
          } else {
            console.error('认领失败');
            return false; // 认领失败返回 false
          }
        })
        .catch((error) => {
          console.log(error);
          return false; // 出现错误时返回 false
        });
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