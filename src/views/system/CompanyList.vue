<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="9" :xxl="6">
            <a-form-item label="企业名称/通信地址">
              <a-input placeholder="输入企业名称/通信地址模糊查询" v-model="queryParam.postalAddressorcompanyName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="10" :xxl="6">
            <a-form-item label="注册时间">
              <a-range-picker style="width: 320px" format="YYYY-MM-DD HH:mm:ss" :placeholder="['开始时间', '结束时间']"
                @change="onChange" :value="dateStrings" :showTime="true">
              </a-range-picker>
            </a-form-item>
          </a-col>

          <a-col :md="3" :xxl="6">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <a-button @click="handleAdd" type="primary" icon="plus">添加企业</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item key="1">
            <a-icon type="delete" @click="batchDel" />
            删除
          </a-menu-item>
          <a-menu-item key="2">
            <a-icon type="lock" @click="batchFrozen('2')" />
            冻结
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="unlock" @click="batchFrozen('1')" />
            解冻
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <!-- <j-super-query :fieldList="superQueryFieldList" @handleSuperQuery="handleSuperQuery" /> -->
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;<a style="font-weight: 600">{{
          selectedRowKeys.length
        }}</a>项&nbsp;&nbsp;
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table ref="table" bordered size="middle" rowKey="id" :columns="columns" :dataSource="dataSource"
        :pagination="ipagination" :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" @change="handleTableChange"
        :scroll="{ x: 1000 }">
        <template slot="avatarslot" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.avatar)" icon="user" />
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a href="javascript:;" @click="handleDetail(record)">查看</a>

          <a-divider type="vertical" />

          <a-dropdown>
            <a class="ant-dropdown-link"> 更多 <a-icon type="down" /> </a>
            <a-menu slot="overlay">
              <!-- <a-menu-item>
                                <a href="javascript:;" @click="handleDetail(record)">详情</a>
                            </a-menu-item> -->

              <a-menu-item>
                <a href="javascript:;" @click="handleChangePassword(record.username)">密码</a>
              </a-menu-item>

              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.userId)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>

              <a-menu-item v-if="record.status == 1">
                <a-popconfirm title="确定冻结吗?" @confirm="() => handleFrozen(record.id, 2, record.username)">
                  <a>冻结</a>
                </a-popconfirm>
              </a-menu-item>

              <a-menu-item v-if="record.status == 2">
                <a-popconfirm title="确定解冻吗?" @confirm="() => handleFrozen(record.id, 1, record.username)">
                  <a>解冻</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <company-modal ref="modalForm" @ok="modalFormOk"></company-modal>
    <password-modal ref="passwordmodal"></password-modal>

    <!-- 用户回收站 -->
    <!-- <user-recycle-bin-modal :visible.sync="recycleBinVisible" @ok="modalFormOk" /> -->
  </a-card>
</template>

<script>
import CompanyModal from './modules/CompanyModal'
import PasswordModal from './modules/PasswordModal'
import { putAction, getFileAccessHttpUrl } from '@/api/manage'
import { frozenBatch } from '@/api/api'
import { JeecgListMixinQiYe } from '@/mixins/JeecgListMixinQiYe'
// import SysUserAgentModal from "./modules/SysUserAgentModal";
import JInput from '@/components/jeecg/JInput'
import UserRecycleBinModal from './modules/UserRecycleBinModal'
import JSuperQuery from '@/components/jeecg/JSuperQuery'

export default {
  name: 'CompanyList',
  mixins: [JeecgListMixinQiYe],
  components: {
    // SysUserAgentModal,
    CompanyModal,
    PasswordModal,
    JInput,
    UserRecycleBinModal,
    JSuperQuery,
  },
  data() {
    return {
      description: '这是施工企业管理页面',
      queryParam: {
        postalAddressorcompanyName: '',
        startTime: '',
        endTime: ''
      },
      dateStrings: [],
      recycleBinVisible: false,
      columns: [
        {
          title: '企业账号',
          align: 'center',
          dataIndex: 'username',
          width: 120,
          sorter: true,
        },
        {
          title: '企业名称',
          align: 'center',
          width: 120,
          dataIndex: 'companyName',
        },
        // {
        //     title: '通信地址',
        //     align: "center",
        //     width: 100,
        //     dataIndex: 'postal_address',
        // },
        // {
        //     title: '邮编',
        //     align: "center",
        //     width: 100,
        //     dataIndex: 'postcode',
        // },
        {
          title: '统一社会信用代码',
          align: 'center',
          width: 140,
          dataIndex: 'creditCode',
        },
        {
          title: '法定代表人',
          align: 'center',
          width: 100,
          dataIndex: 'representative',
        },
        // {
        //     title: '电话',
        //     align: "center",
        //     width: 100,
        //     dataIndex: 'representative_phone'
        // },
        // {
        //     title: '传真',
        //     align: "center",
        //     width: 100,
        //     dataIndex: 'fax'
        // },
        // {
        //     title: '营业执照副本',
        //     align: "center",
        //     width: 120,
        //     dataIndex: 'license_copy',
        //     scopedSlots: { customRender: "license_copyslot" }
        // },
        // {
        //     title: '负责人签名',
        //     align: "center",
        //     width: 120,
        //     dataIndex: 'signature',
        //     scopedSlots: { customRender: "signatureslot" }
        // },
        // {
        //     title: '企业盖章',
        //     align: "center",
        //     width: 120,
        //     dataIndex: 'stamp',
        //     scopedSlots: { customRender: "stampslot" }
        // },
        {
          title: '注册时间',
          align: 'center',
          width: 100,
          dataIndex: 'createTime',
        },
        // {
        //     title: '状态',
        //     align: "center",
        //     width: 80,
        //     dataIndex: 'status_dictText'
        // },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 170,
        },
      ],
      // superQueryFieldList: [
      //     { type: 'input', value: 'username', text: '用户账号', },
      //     { type: 'input', value: 'realname', text: '用户姓名', },
      //     { type: 'select', value: 'sex', text: '性别', dictCode: 'sex' },
      // ],
      url: {
        syncCompany: '/act/process/extActProcess/doSyncUser',
        list: '/sys/user/list',
        delete: '/sys/user/delete',
        // deleteBatch: "/sys/user/deleteBatch",
        // exportXlsUrl: "/sys/user/exportXls",
        // importExcelUrl: "sys/user/importExcel",
      },
    }
  },
  computed: {
    // importExcelUrl: function () {
    //     return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    // }
  },
  methods: {
    onChange(dates, dateStrings) {
      this.dateStrings = dateStrings
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
      this.queryParam.startTime = dateStrings[0] || ''
      this.queryParam.endTime = dateStrings[1] || ''
    },
    getAvatarView: function (avatar) {
      return getFileAccessHttpUrl(avatar)
    },

    batchFrozen: function (status) {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return false
      } else {
        let ids = ''
        let that = this
        let isAdmin = false
        that.selectionRows.forEach(function (row) {
          if (row.username == 'admin') {
            isAdmin = true
          }
        })
        if (isAdmin) {
          that.$message.warning('管理员账号不允许此操作,请重新选择！')
          return
        }
        that.selectedRowKeys.forEach(function (val) {
          ids += val + ','
        })
        that.$confirm({
          title: '确认操作',
          content: '是否' + (status == 1 ? '解冻' : '冻结') + '选中账号?',
          onOk: function () {
            frozenBatch({ ids: ids, status: status }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadData()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          },
        })
      }
    },
    handleMenuClick(e) {
      if (e.key == 1) {
        this.batchDel()
      } else if (e.key == 2) {
        this.batchFrozen(2)
      } else if (e.key == 3) {
        this.batchFrozen(1)
      }
    },
    handleFrozen: function (id, status, username) {
      let that = this
      //TODO 后台校验管理员角色
      if ('admin' == username) {
        that.$message.warning('管理员账号不允许此操作！')
        return
      }
      frozenBatch({ ids: id, status: status }).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleChangePassword(username) {
      this.$refs.passwordmodal.show(username)
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>