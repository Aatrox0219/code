<template>
  <div>
    <div>
      <a-card :bordered="false">
        <a-button
          type="primary"
          @click="startFixedProcess(true)"
          style="margin-right: 10px;"
        >
          开启保证金存缴流程
        </a-button>

        <div id="formContent" style="margin-top: -10px">
          <div id="taskList">
            <a-tabs :tabBarStyle="{ textAlign: 'center' }" @change="changeTab1()" v-model="taskTab.tabKey">
              <a-tab-pane key="1" tab="未认领">
                <div class="card-table">
                  <div class="claimSearchList">
                    <a class="selectText">选择流程: </a>
                    <a-select
                      v-model="instance"
                      style="width: 200px; margin-left: 10px; margin-top: 10px"
                      :defaultActiveFirstOption="true"
                    >
                      <a-select-option v-for="item in processInstance" :key="item.id" :value="item.id">
                        {{ item.name }}
                      </a-select-option>
                    </a-select>
                    <a class="selectText">任务名称: </a>
                    <a-input v-model="taskName" class="selectFrame"> </a-input>
                    <a class="selectText">选择时间: </a>
                    <a-range-picker
                      style="width: 250x"
                      :show-time="{ format: 'HH:mm' }"
                      format="YYYY-MM-DD HH:mm"
                      :placeholder="['开始时间', '结束时间']"
                      :value="dateStrings"
                      @change="onChange"
                    />
                    <a-button-group style="margin-left: 20px">
                      <a-button type="primary" icon="search" @click="getData()" style="margin-left: 20px"
                        >查询</a-button
                      >
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
                      <a-select v-model="instance" class="selectFrame" :defaultActiveFirstOption="true">
                        <a-select-option v-for="item in processInstance" :key="item.id" :value="item.id">
                          {{ item.name }}
                        </a-select-option>
                      </a-select>
                      <a class="selectText">任务名称: </a>
                      <a-input v-model="taskName" class="selectFrame"> </a-input>
                      <a class="selectText">选择时间: </a>
                      <a-range-picker
                        style="width: 250x"
                        :show-time="{ format: 'HH:mm' }"
                        format="YYYY-MM-DD HH:mm"
                        :placeholder="['开始时间', '结束时间']"
                        @change="onChange"
                        :value="dateStrings"
                      >
                      </a-range-picker>

                      <a-button-group style="margin-left: 20px">
                        <a-button type="primary" icon="search" @click="getData()" style="margin-left: 20px"
                          >查询</a-button
                        >
                        <a-button type="primary" icon="reload" @click="selectCondition()">重置</a-button>
                      </a-button-group>
                    </div>
                  </div>
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
              </a-tab-pane>
              <a-tab-pane key="3" tab="已完成">
                <div class="card-table">
                  <div class="finishSearchList">
                    <a class="selectText">选择流程: </a>
                    <a-select
                      v-model="instance"
                      style="width: 200px; margin-left: 10px; margin-top: 10px"
                      :defaultActiveFirstOption="true"
                    >
                      <a-select-option v-for="item in processInstance" :key="item.id" :value="item.id">
                        {{ item.name }}
                      </a-select-option>
                    </a-select>
                    <a-button-group style="margin-left: 20px">
                      <a-button type="primary" icon="search" @click="getData()" style="margin-left: 20px"
                        >查询</a-button
                      >
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
                    <a-select
                      v-model="instance"
                      style="width: 200px; margin-left: 10px; margin-top: 10px"
                      :defaultActiveFirstOption="true"
                    >
                      <a-select-option v-for="item in processInstance" :key="item.id" :value="item.id">
                        {{ item.name }}
                      </a-select-option>
                    </a-select>
                    <a-button-group style="margin-left: 20px">
                      <a-button type="primary" icon="search" @click="getData()" style="margin-left: 20px"
                        >查询</a-button
                      >
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
              <a-tab-pane key="5" tab="进行中">
                <div class="card-table">
                  <div class="doingSearchList">
                    <a class="selectText">选择流程: </a>
                    <a-select
                      v-model="instance"
                      style="width: 200px; margin-left: 10px; margin-top: 10px"
                      :defaultActiveFirstOption="true"
                    >
                      <a-select-option v-for="item in processInstance" :key="item.id" :value="item.id">
                        {{ item.name }}
                      </a-select-option>
                    </a-select>
                    <a-button-group style="margin-left: 20px">
                      <a-button type="primary" icon="search" @click="getData()" style="margin-left: 20px"
                        >查询</a-button
                      >
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
            </a-tabs>
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
export default {
  name: 'flowDeposit',
  components: { annTask, ApproveTask, ApproveNewTask, RollbackTask, approveModel, FlowHistory },
  data() {
    return {
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
      taskTab: {
        tabKey: '1',
      }, //标签页
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
          title: '状态',
          align: 'center',
          dataIndex: 'state',
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
          title: '流程唯一标识',
          align: 'center',
          dataIndex: 'processInstanceId',
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
  mounted() {
    this.startFixedProcess(false)
    this.getData()
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
      this.getData()
    },
    // 更新表格数据
    getData() {
      this.flowWillAnnounceData = []
      this.flowFinishData = []
      this.flowRejectData = []
      this.loadClaimData = []
      var tabKey = this.taskTab.tabKey
      switch (tabKey) {
        case '1':
          this.getLoadClaim()
          break
        case '2':
          this.getflowAnnounce()
          break
        case '3':
          this.getCompleteProcessInstance()
          break
        case '4':
          this.getCancelProcesses()
          break
        case '5':
          this.getDoingFlow()
          break
        default:
          break
      }
    },
    //得到所有未认领的流程
    getLoadClaim() {
      let params = {
        processId: this.instance,
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
        processId: this.instance,
        taskName: this.taskName,
        startTime: this.startTime,
        endTime: this.endTime,
      }
      nw_postAction1('/task/getPendingTakes', params)
        .then((res) => {
          this.flowWillAnnounceData = res.result
          for (var i = 0; i < this.flowWillAnnounceData.length; i++) {
            var state = this.flowWillAnnounceData[i].state
            switch (state) {
              case 'WaitReviewWorkload':
                this.flowWillAnnounceData[i].state = '工作量待审核'
                break
              case 'Ready':
                this.flowWillAnnounceData[i].state = '已开始'
                break
              case 'Completed':
                this.flowWillAnnounceData[i].state = '已完成'
                break
              case 'Reserved':
                this.flowWillAnnounceData[i].state = '已领取'
                break
              case 'Created':
                this.flowWillAnnounceData[i].state = '已创建'
                break
              default:
                break
            }
            var type = this.flowWillAnnounceData[i].type
            switch (type) {
              case 'Participative':
                this.flowWillAnnounceData[i].type = '竞争任务'
                break
              case 'Normal':
                this.flowWillAnnounceData[i].type = '正常任务'
                break
              default:
                break
            }
          }
        })
        .catch((error) => {
          // console.log(error)
        })
    },
    //获得已完成流程实例
    getCompleteProcessInstance() {
      const _this = this
      var id = this.instance
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
        processId: this.instance,
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
        processId: this.instance,
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