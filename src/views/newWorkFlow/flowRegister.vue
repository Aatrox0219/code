<template>
    <div>
        <div>
            <a-card :bordered="false">
                <div id="formContent" style="margin-top: -10px">
                    <div id="taskList">
                        <div>
                            <a-tabs :tabBarStyle="{ textAlign: 'center' }" v-model="taskTab.tabKey" @change="handleTabChange">
                                <a-tab-pane key="1">
                                    <template #tab>
                                        <a-badge :count="backlogNumber" :offset="[10, 0]">
                                            <span>待审核</span>
                                        </a-badge>
                                    </template>
                                    <div>
                                        <div class="card-table" style="padding: 10px">
                                            <a-card :bordered="false">
                                                <div class="flowAnnounce">
                                                    <commonTable ref="commonTableRef2"
                                                        :configurationParameter="configurationParameter2"
                                                        :review="review" :details="details">
                                                    </commonTable>
                                                </div>
                                            </a-card>
                                        </div>
                                    </div>
                                </a-tab-pane>
                                <a-tab-pane key="2" tab="审核历史">
                                    <div>
                                        <div class="card-table">
                                            <a-card :bordered="false">
                                                <div class="table-container">
                                                    <commonTable ref="commonTableRef1"
                                                        :configurationParameter="configurationParameter1"
                                                        :details="details">
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
        <register-approve-modal ref="registerApproveModal" @close="getData" @refresh="getData"></register-approve-modal>
        <register-detail-modal ref="registerDetailModal"></register-detail-modal>
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
import { registerList, registerCategoryId } from '@/api/processId'
import { downloadDocument } from '@/api/userList'
import RegisterApproveModal from './modules/registerApproveModal.vue'
import RegisterDetailModal from './modules/registerDetailModal.vue'

export default {
    name: 'flowUse',
    components: {
        annTask,
        ApproveTask,
        ApproveNewTask,
        RollbackTask,
        approveModel,
        FlowHistory,
        commonTable,
        RegisterApproveModal,
        RegisterDetailModal
    },
    data() {
        return {
            configurationParameter2: {
                inquire: {
                    status: '0'
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
                        title: '企业账号',
                        align: 'center',
                        dataIndex: 'userName',
                        show: true,
                        filterType: 'mixedInput',
                    },
                    {
                        title: '企业名称',
                        align: 'center',
                        dataIndex: 'companyName',
                        show: true,
                        filterType: 'mixedInput',
                    },
                    {
                        title: '统一社会信用代码',
                        align: 'center',
                        dataIndex: 'creditCode',
                        show: true,
                    },
                    {
                        title: '法定代表人',
                        align: 'center',
                        dataIndex: 'representative',
                        show: true,
                    },
                    {
                        title: '申请时间',
                        align: 'center',
                        dataIndex: 'createTime',
                        show: true,
                    },
                    {
                        title: '操作',
                        align: 'center',
                        dataIndex: 'review',
                        scopedSlots: { customRender: 'review' },
                        show: true,
                    },
                ],
            },
            configurationParameter1: {
                inquire: {
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
                        title: '企业账号',
                        align: 'center',
                        dataIndex: 'userName',
                        show: true,
                        filterType: 'mixedInput',
                    },
                    {
                        title: '企业名称',
                        align: 'center',
                        dataIndex: 'companyName',
                        show: true,
                        filterType: 'mixedInput',
                    },
                    {
                        title: '统一社会信用代码',
                        align: 'center',
                        dataIndex: 'creditCode',
                        show: true,
                    },
                    {
                        title: '法定代表人',
                        align: 'center',
                        dataIndex: 'representative',
                        show: true,
                    },
                    {
                        title: '申请时间',
                        align: 'center',
                        dataIndex: 'createTime',
                        show: true,
                    },
                    {
                        title: '处理时间',
                        align: 'center',
                        dataIndex: 'reviewTime',
                        show: true,
                    },
                    
                    {
                        title: '详情',
                        align: 'center',
                        dataIndex: 'details',
                        scopedSlots: { customRender: 'details' },
                        show: true,
                    },
                ],
            },
            useProcessId: 0,
            backlogNumber: 0,
            taskTab: {
                tabKey: '1', // 主 Tab 页的状态
            },
            review: null,
            details: null,
        }
    },
    props: ['columnsData', 'dataSource'],
    computed: {
        userInfo() {
            // 从 Vue.ls 中获取 USER_INFO
            return Vue.ls.get(USER_INFO) || {} // 如果没有值，默认为空对象
        },
    },
    created() {
        // 在created中初始化这些方法，确保methods已经定义
        this.review = this.reviewRegistration;
        this.details = this.showDetails;
    },
    mounted() {
        this.getData()
        console.log('当前用户信息', this.userInfo)
        // 添加路由参数主动检查
        if (this.$route.query.tab) {
            this.taskTab.tabKey = this.$route.query.tab
        }
    },
    methods: {
        //查看历史
        seeHistory(record) {
            this.$refs.flowHistory.openModal(record)
        },
        // 更新表格数据
        getData() {
            // 先获取子组件实例
            const commonTableInstance1 = this.$refs.commonTableRef1
            if (commonTableInstance1) {
                commonTableInstance1.getRegistrationList()
            }
            const commonTableInstance2 = this.$refs.commonTableRef2
            if (commonTableInstance2) {
                commonTableInstance2.getRegistrationList()
            }
            
            // 获取待审核数量
            this.getBacklogNumber()
        },
        // 获取待审核数量
        getBacklogNumber() {
            axios.get(`${process.env.VUE_APP_COUESE_BASE_URL}/registration/count`, {
                params: { status: 0 }  // 0表示待审核状态
            }).then(res => {
                if (res.data.success) {
                    this.backlogNumber = res.data.result || 0
                }
            }).catch(err => {
                console.error('获取待审核数量失败：', err)
                this.backlogNumber = 0
            })
        },
        // 审核企业注册
        reviewRegistration(record) {
            console.log('审核企业注册', record)
            this.$refs.registerApproveModal.show(record)
        },
        // 查看详情
        showDetails(record) {
            console.log('查看详情', record)
            this.$refs.registerDetailModal.show(record)
        },
        handleTabChange(key) {
            this.taskTab.tabKey = key;
            this.$nextTick(() => {
                this.getData()
            })
        }
    },
    watch: {
        '$route.query.tab': {
            immediate: true,
            deep: true,
            handler(newVal) {
                if (newVal) {
                    this.taskTab.tabKey = newVal;
                } else {
                    this.taskTab.tabKey = '1'
                }
                this.$nextTick(() => {
                    this.getData()
                })
            }
        }
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