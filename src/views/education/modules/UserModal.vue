<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    :width="drawerWidth"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
    style="height: 100%; overflow: auto; padding-bottom: 53px"
  >
    <template slot="title">
      <div style="width: 100%">
        <span>{{ title }}</span>
        <span style="display: inline-block; width: calc(100% - 51px); padding-right: 10px; text-align: right">
          <a-button @click="toggleScreen" icon="appstore" style="height: 20px; width: 20px; border: 0px"></a-button>
        </span>
      </div>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <!-- <a-form-item label="用户账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户账号" v-decorator.trim="[ 'username', validatorRules.username]" :readOnly="!!model.id"/>
        </a-form-item> -->

        <!-- <template v-if="!model.id">
          <a-form-item label="登录密码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input type="password" placeholder="请输入登录密码" v-decorator="[ 'password',validatorRules.password]" />
          </a-form-item>

          <a-form-item label="确认密码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input type="password" @blur="handleConfirmBlur" placeholder="请重新输入登录密码" v-decorator="[ 'confirmpassword', validatorRules.confirmpassword]"/>
          </a-form-item>
        </template> -->

        <a-form-item label="学号" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="isStudent">
          <a-input placeholder="请输入学号" v-decorator.trim="['work_no', validatorRules.work_no]" :disabled="isEdit" />
        </a-form-item>

        <a-form-item label="工号" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="!isStudent">
          <a-input placeholder="请输入工号" v-decorator.trim="['work_no', validatorRules.work_no]" :disabled="isEdit" />
        </a-form-item>

        <a-form-item label="用户姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户姓名" v-decorator.trim="['realname', validatorRules.realname]" />
        </a-form-item>

        <a-form-item label="专业" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="isEdit">
          <a-input v-decorator.trim="['subject_name', validatorRules.subject_name]" disabled />
        </a-form-item>

        <a-form-item label="班级" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="isEdit && isStudent">
          <a-input v-decorator.trim="['class_name', validatorRules.class_name]" disabled />
        </a-form-item>

        <a-form-item label="头像" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-image-upload class="avatar-uploader" text="上传" v-model="fileList"></j-image-upload>
        </a-form-item>

        <a-form-item label="生日" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            style="width: 100%"
            placeholder="请选择生日"
            v-decorator="['birthday', { initialValue: !model.birthday ? null : moment(model.birthday, dateFormat) }]"
            :getCalendarContainer="(node) => node.parentNode"
          />
        </a-form-item>

        <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['sex', {}]"
            placeholder="请选择性别"
            :getPopupContainer="(target) => target.parentNode"
          >
            <a-select-option :value="1">男</a-select-option>
            <a-select-option :value="2">女</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入邮箱" v-decorator="['email', validatorRules.email]" />
        </a-form-item>

        <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入手机号码" v-decorator="['phone', validatorRules.phone]" />
        </a-form-item>

        <a-form-item label="座机" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入座机" v-decorator="['telephone', validatorRules.telephone]" />
        </a-form-item>
      </a-form>
    </a-spin>
    <depart-window ref="departWindow" @ok="modalFormOk"></depart-window>

    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
        <a-button style="margin-right: 0.8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment'
import Vue from 'vue'
// 引入搜索部门弹出框的组件
import departWindow from '../../system/modules/DepartWindow'
import JSelectPosition from '@/components/jeecgbiz/JSelectPosition'

import { ACCESS_TOKEN, TENANT_ID } from '@/store/mutation-types'
import { getAction } from '@/api/manage'
import { addUser, editUser, queryUserRole, queryall, getUserList } from '@/api/api'
import { disabledAuthFilter } from '@/utils/authFilter'
import { duplicateCheck } from '@/api/api'
import JImageUpload from '../../../components/jeecg/JImageUpload'
import { postAction, putAction } from '../../../api/manage'

export default {
  name: 'UserModal',
  components: {
    JImageUpload,
    departWindow,
    JSelectPosition,
  },
  props: ['isStudent' , 'nowParentDepart'],
  data() {
    return {
      class_code: '',
      roleStudentId: '',
      roleTeacherId: '',
      departDisabled: false, //是否是我的部门调用该页面
      roleDisabled: true, //是否是角色维护调用该页面
      modalWidth: 800,
      drawerWidth: 700,
      modaltoggleFlag: true,
      confirmDirty: false,
      selectedDepartKeys: [], //保存用户选择部门id
      checkedDepartKeys: [],
      checkedDepartNames: [], // 保存部门的名称 =>title
      checkedDepartNameString: '', // 保存部门的名称 =>title
      resultDepartOptions: [],
      userId: '', //保存用户id
      disableSubmit: false,
      userDepartModel: { userId: '', departIdList: [] }, // 保存SysUserDepart的用户部门中间表数据需要的对象
      dateFormat: 'YYYY-MM-DD',
      validatorRules: {
        username: {
          rules: [
            {
              required: true,
              message: '请输入用户账号!',
            },
            {
              validator: this.validateUsername,
            },
          ],
        },
        password: {
          rules: [
            {
              required: true,
              pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,}$/,
              message: '密码由8位数字、大小写字母和特殊符号组成!',
            },
            {
              validator: this.validateToNextPassword,
            },
          ],
        },
        confirmpassword: {
          rules: [
            {
              required: true,
              message: '请重新输入登录密码!',
            },
            {
              validator: this.compareToFirstPassword,
            },
          ],
        },
        realname: { rules: [{ required: true, message: '请输入用户名称!' }] },
        phone: { rules: [{ validator: this.validatePhone }] },
        email: {
          rules: [
            {
              validator: this.validateEmail,
            },
          ],
        },
        roles: {},
        //  sex:{initialValue:((!this.model.sex)?"": (this.model.sex+""))}
        work_no: {
          rules: [{ required: true, message: '请输入工号' }, { validator: this.validatework_no }],
        },
        telephone: {
          rules: [{ pattern: /^0\d{2,3}-[1-9]\d{6,7}$/, message: '请输入正确的座机号码' }],
        },
      },
      departIdShow: false,
      departIds: [], //负责部门id
      title: '操作',
      visible: false,
      model: {},
      roleList: [],
      selectedRole: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      uploadLoading: false,
      confirmLoading: false,
      headers: {},
      form: this.$form.createForm(this),
      picUrl: '',
      url: {
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        userWithDepart: '/sys/user/userDepartList', // 引入为指定用户查看部门信息需要的url
        userId: '/sys/user/generateUserId', // 引入生成添加用户情况下的url
        syncUserByUserName: '/act/process/extActProcess/doSyncUserByUserName', //同步用户到工作流
        queryTenantList: '/sys/tenant/queryList',
      },
      identity: '1',
      fileList: [],
      tenantList: [],
      currentTenant: [],
      studentUrl: {
        insert: '/online/cgform/api/form/46487d65227f45338ff2cff1b4e748a7',
        edit: '/online/cgform/api/form/46487d65227f45338ff2cff1b4e748a7',
      },
      teacherUrl: {
        insert: '/online/cgform/api/form/45e06c958a3b40be83e712cfff43ec68',
        edit: '/online/cgform/api/form/45e06c958a3b40be83e712cfff43ec68',
      },
      params: {},
      selectNode: {},
      isEdit: false,
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    this.initTenantList()
  },
  computed: {
    uploadAction: function () {
      return this.url.fileUpload
    },
  },
  methods: {
    isDisabledAuth(code) {
      return disabledAuthFilter(code)
    },
    initTenantList() {
      getAction(this.url.queryTenantList).then((res) => {
        if (res.success) {
          this.tenantList = res.result
        }
      })
    },
    //窗口最大化切换
    toggleScreen() {
      if (this.modaltoggleFlag) {
        this.modalWidth = window.innerWidth
      } else {
        this.modalWidth = 800
      }
      this.modaltoggleFlag = !this.modaltoggleFlag
    },
    initialRoleList() {
      queryall().then((res) => {
        if (res.success) {
          this.roleList = res.result
        } else {
          console.log(res.message)
        }
      })
    },
    loadUserRoles(userid) {
      queryUserRole({ userid: userid }).then((res) => {
        if (res.success) {
          this.selectedRole = res.result
        } else {
          console.log(res.message)
        }
      })
    },
    refresh() {
      this.selectedDepartKeys = []
      this.checkedDepartKeys = []
      this.checkedDepartNames = []
      this.checkedDepartNameString = ''
      this.userId = ''
      this.resultDepartOptions = []
      this.departId = []
      this.departIdShow = false
      this.currentTenant = []
    },
    add(node) {
      console.log('选中的信息', this.node)
      this.params = node.params
      this.selectNode = node.info
      this.picUrl = ''
      this.refresh()
      this.edit({ activitiSync: '1' }, false)
    },
    edit(record, isEdit) {
      this.resetScreenSize() // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
      let that = this
      console.log('isEdit', isEdit)
      this.isEdit = isEdit
      that.checkedDepartNameString = ''
      that.form.resetFields()
      if (record.hasOwnProperty('id')) {
        // that.loadUserRoles(record.id);
        setTimeout(() => {
          this.fileList = record.avatar
        }, 5)
      }
      that.userId = record.uid
      that.visible = true
      that.model = Object.assign({}, record)
      that.$nextTick(() => {
        that.form.setFieldsValue(
          pick(
            this.model,
            'username',
            'sex',
            'realname',
            'email',
            'phone',
            'class_name',
            'subject_name',
            'activitiSync',
            'work_no',
            'telephone',
            'post'
          )
        )
      })
      //身份为上级显示负责部门，否则不显示
      if (this.model.userIdentity == '2') {
        this.identity = '2'
        this.departIdShow = true
      } else {
        this.identity = '1'
        this.departIdShow = false
      }
      // 调用查询用户对应的部门信息的方法
      that.checkedDepartKeys = []
      that.loadCheckedDeparts()

      //update-begin-author:taoyan date:2020710 for:多租户配置
      if (!record.relTenantIds || record.relTenantIds.length == 0) {
        this.currentTenant = []
      } else {
        this.currentTenant = record.relTenantIds.split(',').map(Number)
      }
      //update-end-author:taoyan date:2020710 for:多租户配置
    },
    //
    loadCheckedDeparts() {
      let that = this
      if (!that.userId) {
        return
      }
      getAction(that.url.userWithDepart, { userId: that.userId }).then((res) => {
        that.checkedDepartNames = []
        if (res.success) {
          var depart = []
          var departId = []
          for (let i = 0; i < res.result.length; i++) {
            that.checkedDepartNames.push(res.result[i].title)
            this.checkedDepartNameString = this.checkedDepartNames.join(',')
            that.checkedDepartKeys.push(res.result[i].key)
            //新增负责部门选择下拉框
            depart.push({
              key: res.result[i].key,
              title: res.result[i].title,
            })
            departId.push(res.result[i].key)
          }
          that.resultDepartOptions = depart
          //判断部门id是否存在，不存在择直接默认当前所在部门
          if (this.model.departIds) {
            this.departIds = this.model.departIds.split(',')
          } else {
            this.departIds = departId
          }
          that.userDepartModel.departIdList = that.checkedDepartKeys
        } else {
          console.log(res.message)
        }
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = false
      this.selectedRole = []
      this.userDepartModel = { userId: '', departIdList: [] }
      this.checkedDepartNames = []
      this.checkedDepartNameString = ''
      this.checkedDepartKeys = []
      this.selectedDepartKeys = []
      this.resultDepartOptions = []
      this.departIds = []
      this.departIdShow = false
      this.identity = '1'
      this.fileList = []
    },
    moment,
    handleSubmit() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          if (!values.birthday) {
            values.birthday = ''
          } else {
            values.birthday = values.birthday.format(this.dateFormat)
          }
          let formData = Object.assign(this.model, values)
          if (that.fileList != '') {
            formData.avatar = that.fileList
          } else {
            formData.avatar = null
          }
          //update-begin-author:taoyan date:2020710 for:多租户配置
          formData.relTenantIds = this.currentTenant.length > 0 ? this.currentTenant.join(',') : ''
          //update-end-author:taoyan date:2020710 for:多租户配置

          //此处是默认的内容：用户名，密码初始化都为学号
          formData.username = values.work_no
          formData.password = values.work_no
          formData.confirmpassword = values.work_no
          //角色只能是学生
          if (this.isStudent) {
            formData.selectedroles = this.roleStudentId
          } else {
            formData.selectedroles = this.roleTeacherId
            this.identity = '2'
          }
          formData.selecteddeparts = this.selectNode.sys_org_code
          formData.relTenantIds = this.selectNode.tenant_id
          formData.userIdentity = this.identity
          //如果是上级择传入departIds,否则为空
          if (this.identity === '2') {
            // formData.departIds = this.departIds.join(',')
            formData.departIds = this.nowParentDepart
          } else {
            formData.departIds = ''
          }
          console.log('formData', formData)
          // that.addDepartsToUser(that,formData); // 调用根据当前用户添加部门信息的方法
          let obj
          if (!this.model.id) {
            formData.id = this.userId
            obj = addUser(formData)
          } else {
            formData.id = this.userId
            this.$delete(formData, 'uid')
            obj = editUser(formData)
          }
          obj
            .then((res) => {
              if (res.success) {
                that.addStuTeaTable(formData)
                // that.$emit('ok');
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.checkedDepartNames = []
              that.userDepartModel.departIdList = { userId: '', departIdList: [] }
              that.close()
            })
        }
      })
    },
    async addStuTeaTable(res) {
      console.log('添加时的数据', res)
      let that = this
      let params = this.params //查询条件
      let data
      let msg = '添加'
      if (res.id) {
        data = res
        msg = '编辑'
        var id = res.id,
          work_no = res.work_no,
          realname = res.realname, //真名
          username = res.username //用户名
      } else {
        data = await getUserList({
          username: username,
          column: 'createTime',
          order: 'desc',
          pageNo: 1,
          pageSize: 10,
        }).then()
        if (data.success && data.result && data.result.records && data.result.records[0]) {
          var id = data.result.records[0].id,
            work_no = data.result.records[0].workNo,
            realname = data.result.records[0].realname, //真名
            username = data.result.records[0].username
        } else {
          that.$message.warning(`${msg}失败`)
          return
        }
      }
      let formParams
      if (this.isStudent) {
        formParams = {
          uid: id,
          work_no: work_no,
          student_name: realname,
          class_code: that.selectNode.id || res.class_code,
          class_name: that.selectNode.title || res.class_name,
          subject_code: that.selectNode.subject_code || res.subject_code,
          subject_name: that.selectNode.subject_name || res.subject_name,
          tenant_id: res.tenant_id || Vue.ls.get(TENANT_ID),
        }

        if (res.id) {
          formParams.id = res.stuId
          putAction(that.studentUrl.edit, formParams)
            .then((res) => {
              that.$message.success(`${msg}成功`)
              that.$emit('ok')
            })
            .catch((e) => {
              that.$message.warning(`${msg}失败`)
            })
        } else {
          postAction(that.studentUrl.insert, formParams)
            .then((res) => {
              that.$message.success(`${msg}成功`)
              that.$emit('ok')
            })
            .catch((e) => {
              that.$message.warning(`${msg}失败`)
            })
        }
      } else {
        formParams = {
          uid: id,
          work_no: work_no,
          teacher_name: realname,
          subject_code: that.selectNode.id || res.subject_code,
          subject_name: that.selectNode.departName || res.subject_name || res.orgCodeTxt,
          tenant_id: Vue.ls.get(TENANT_ID) || res.tenant_id,
        }
        if (res.id) {
          formParams.id = res.teaId
          putAction(that.teacherUrl.edit, formParams)
            .then((res) => {
              if (res.success) {
                that.$message.success(`${msg}成功`)
                that.$emit('ok')
              } else {
                that.$message.warning(`${msg}失败`)
              }
            })
            .catch((e) => {
              that.$message.warning(`${msg}失败`)
            })
        } else {
          console.log('插入online表的数据', formParams)
          postAction(that.teacherUrl.insert, formParams)
            .then((res) => {
              if (res.success) {
                that.$message.success(`${msg}成功`)
                that.$emit('ok')
              } else {
                that.$message.warning(`${msg}失败`)
              }
            })
            .catch((e) => {
              that.$message.warning(`${msg}失败`)
            })
        }
      }
    },
    handleCancel() {
      this.close()
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form
      const confirmpassword = form.getFieldValue('confirmpassword')

      if (value && confirmpassword && value !== confirmpassword) {
        callback('两次输入的密码不一样！')
      }
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback('两次输入的密码不一样！')
      } else {
        callback()
      }
    },
    validatePhone(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        //update-begin--Author:kangxiaolin  Date:20190826 for：[05] 手机号不支持199号码段--------------------
        if (new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)) {
          //update-end--Author:kangxiaolin  Date:20190826 for：[05] 手机号不支持199号码段--------------------

          var params = {
            tableName: 'sys_user',
            fieldName: 'phone',
            fieldVal: value,
            dataId: this.userId,
          }
          duplicateCheck(params).then((res) => {
            if (res.success) {
              callback()
            } else {
              callback('手机号已存在!')
            }
          })
        } else {
          callback('请输入正确格式的手机号码!')
        }
      }
    },
    validateEmail(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (
          new RegExp(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ).test(value)
        ) {
          var params = {
            tableName: 'sys_user',
            fieldName: 'email',
            fieldVal: value,
            dataId: this.userId,
          }
          duplicateCheck(params).then((res) => {
            console.log(res)
            if (res.success) {
              callback()
            } else {
              callback('邮箱已存在!')
            }
          })
        } else {
          callback('请输入正确格式的邮箱!')
        }
      }
    },
    validateUsername(rule, value, callback) {
      var params = {
        tableName: 'sys_user',
        fieldName: 'username',
        fieldVal: value,
        dataId: this.userId,
      }
      duplicateCheck(params).then((res) => {
        if (res.success) {
          callback()
        } else {
          callback('用户名已存在!')
        }
      })
    },
    validatework_no(rule, value, callback) {
      var params = {
        tableName: 'sys_user',
        fieldName: 'work_no',
        fieldVal: value,
        dataId: this.userId,
      }
      duplicateCheck(params).then((res) => {
        if (res.success) {
          callback()
        } else {
          callback('工号已存在!')
        }
      })
    },
    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },

    normFile(e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    beforeUpload: function (file) {
      var fileType = file.type
      if (fileType.indexOf('image') < 0) {
        this.$message.warning('请上传图片')
        return false
      }
      //TODO 验证文件大小
    },
    handleChange(info) {
      this.picUrl = ''
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        this.uploadLoading = false
        console.log(response)
        if (response.success) {
          this.model.avatar = response.message
          this.picUrl = 'Has no pic url yet'
        } else {
          this.$message.warning(response.message)
        }
      }
    },
    // 搜索用户对应的部门API
    // onSearch(){
    //   this.$refs.departWindow.add(this.checkedDepartKeys,this.userId);
    // },

    // 获取用户对应部门弹出框提交给返回的数据
    modalFormOk(formData) {
      this.checkedDepartNames = []
      this.selectedDepartKeys = []
      this.checkedDepartNameString = ''
      this.userId = formData.userId
      this.userDepartModel.userId = formData.userId
      this.departIds = []
      this.resultDepartOptions = []
      var depart = []
      for (let i = 0; i < formData.departIdList.length; i++) {
        this.selectedDepartKeys.push(formData.departIdList[i].key)
        this.checkedDepartNames.push(formData.departIdList[i].title)
        this.checkedDepartNameString = this.checkedDepartNames.join(',')
        //新增部门选择，如果上面部门选择后不为空直接付给负责部门
        depart.push({
          key: formData.departIdList[i].key,
          title: formData.departIdList[i].title,
        })
        this.departIds.push(formData.departIdList[i].key)
      }
      this.resultDepartOptions = depart
      this.userDepartModel.departIdList = this.selectedDepartKeys
      this.checkedDepartKeys = this.selectedDepartKeys //更新当前的选择keys
    },
    // 根据屏幕变化,设置抽屉尺寸
    resetScreenSize() {
      let screenWidth = document.body.clientWidth
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth
      } else {
        this.drawerWidth = 700
      }
    },
    identityChange(e) {
      if (e.target.value === '1') {
        this.departIdShow = false
      } else {
        this.departIdShow = true
      }
    },
  },
}
</script>

<style scoped>
.avatar-uploader > .ant-upload {
  width: 104px;
  height: 104px;
}
.ant-upload-select-picture-card i {
  font-size: 49px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 10px;
  padding-bottom: 10px;
}

.drawer-bootom-button {
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>