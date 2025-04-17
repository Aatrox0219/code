<template>
  <a-modal title="企业账号注册申请" :visible="visible" :width="1000" :footer="null" @cancel="handleCancel">
    <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="用户账号">
            <a-input v-decorator="['username', {
              rules: [{ required: true, message: '请输入用户账号' }],
              validateTrigger: ['change', 'blur']
            }]" placeholder="请输入用户账号" @blur="validateField('username')" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <div class="psw-message">注: 系统的初始密码为123456，请及时修改密码。</div>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="企业名称">
            <a-input v-decorator="['companyName', {
              rules: [{ required: true, message: '请输入企业名称' }],
              validateTrigger: ['change', 'blur']
            }]" placeholder="请输入企业名称" @blur="validateField('companyName')" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="统一社会信用代码" :label-col="{ span: 7 }">
            <a-input v-decorator="['creditCode', {
              rules: [
                { required: true, message: '请输入统一社会信用代码' },
                { pattern: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/, message: '请输入正确的统一社会信用代码' }
              ],
              validateTrigger: ['change', 'blur']
            }]" placeholder="请输入统一社会信用代码" @blur="validateField('creditCode')" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="通信地址">
            <a-input v-decorator="['postalAddress', {
              rules: [{ required: true, message: '请输入通信地址' }],
              validateTrigger: ['change', 'blur']
            }]" placeholder="请输入通信地址" @blur="validateField('postalAddress')" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="邮编" :label-col="{ span: 7 }">
            <a-input v-decorator="['postcode', {
              rules: [
                { required: true, message: '请输入邮编' },
                { pattern: /^[1-9]\d{5}$/, message: '请输入正确的邮编' }
              ],
              validateTrigger: ['change', 'blur']
            }]" placeholder="请输入邮编" @blur="validateField('postcode')" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="法定代表人">
            <a-input v-decorator="['representative', {
              rules: [
                { required: false, message: '请输入法定代表人!' },
                { pattern: /^([\u4e00-\u9fa5]{1,6})$/, message: '请输入正确的法定代表人姓名' }
              ],
              validateTrigger: ['change', 'blur']
            }]" placeholder="请输入法定代表人" @blur="validateField('representative')" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="手机号码" :label-col="{ span: 7 }">
            <a-input v-decorator="['phone', {
              rules: [
                { required: true, message: '请输入手机号码' },
                { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '请输入正确的手机号码' }
              ],
              validateTrigger: ['change', 'blur']
            }]" placeholder="请输入手机号码" @blur="validateField('phone')" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="传真">
            <a-input v-decorator="['fax', {
              rules: [
                { required: false, message: '请输入传真!' },
                { pattern: /^(?:\d{3,4}-)?\d{7,8}(?:-\d{1,6})?$/, message: '请输入正确的传真号码' }
              ],
              validateTrigger: ['change', 'blur']
            }]" placeholder="请输入传真" @blur="validateField('fax')" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item>
            <div class="file-message">注: 以下需上传图片，格式为jpg或png。</div>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="营业执照副本" :required="true">
            <j-image-upload-one :isAdd="isAdd" :isEdit="isEdit" class="avatar-uploader" text="上传"
              v-model="licenseCopy"></j-image-upload-one>
          </a-form-item>
          <a-form-item label="企业盖章" :required="true">
            <j-image-upload-three :isAdd="isAdd" :isEdit="isEdit" class="avatar-uploader" text="上传"
              v-model="stamp"></j-image-upload-three>
          </a-form-item>
        </a-col>
      </a-row>

      <div class="form-footer">
        <a-button type="primary" @click="handleSubmit">提交</a-button>
        <a-button style="margin-left: 20px" @click="handleCancel">返回</a-button>
      </div>
    </a-form>
  </a-modal>
</template>

<script>
import { postAction } from '@/api/manage'
import JImageUploadOne from '@/components/jeecg/JImageUploadOne'
import JImageUploadThree from '@/components/jeecg/JImageUploadThree'

export default {
  name: 'EnterpriseRegister',
  components: {
    JImageUploadOne,
    JImageUploadThree
  },
  data() {
    return {
      visible: false,
      form: this.$form.createForm(this),
      businessLicenseFileList: [],
      qualificationFileList: [],
      licenseCopy: [],
      stamp: [],
      isAdd: true,
      isEdit: true
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    handleCancel() {
      var _this = this
      this.$elementConfirm('是否关闭处理界面 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          _this.resetForm()
          _this.visible = false
        })
        .catch(() => { })
    },
    resetForm() {
      // 重置表单内容
      this.form.resetFields()
      // 清空上传内容
      this.businessLicenseFileList = []
      this.qualificationFileList = []
      this.licenseCopy = []
      this.stamp = []
    },
    validateField(field) {
      this.form.validateFields([field], { force: true })
    },
    handleBusinessLicenseChange(info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1) // 只保留最后上传的一个文件
      this.businessLicenseFileList = fileList
    },
    handleQualificationChange(info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1) // 只保留最后上传的一个文件
      this.qualificationFileList = fileList
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          // 检查是否上传了必要的图片
          if (this.licenseCopy.length === 0) {
            this.$message.error('请上传营业执照副本')
            return
          }

          if (this.stamp.length === 0) {
            this.$message.error('请上传企业盖章')
            return
          }

          // 构建提交的数据
          const formData = {
            ...values,
            licenseCopy: this.licenseCopy,
            stamp: this.stamp
          }

          // 发送请求到后端
          postAction('http://139.199.159.36:37192/registration/submit', formData).then(res => {
            if (res.success) {
              this.$message.success('提交成功!')
              this.close()
            } else {
              this.$message.error(res.message || '提交失败!')
            }
          }).catch(err => {
            console.error(err)
            this.$message.error('提交失败，请稍后再试!')
          })
        }
      })
    },
    edit(record) {
      console.log('record', record)
      this.resetScreenSize() // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
      let that = this
      that.initialRoleList()
      that.checkedDepartNameString = ''
      that.form.resetFields()

      if (record.hasOwnProperty('id')) {
        that.loadUserRoles(record.id)
        setTimeout(() => {
          this.licenseCopy = record.licenseCopy
          this.stamp = record.stamp
        }, 5)
      }
      that.userId = record.id
      that.visible = true
      that.model = Object.assign({}, record)

      //编辑和查看时用来自动填入表单
      that.$nextTick(() => {
        that.form.setFieldsValue(
          pick(
            this.model,
            'username',
            'companyName',
            'postalAddress',
            'postcode',
            'creditCode',
            'phone',
            'representative',
            'fax'
          )
        )
      })
    },
    close() {
      this.$emit('close')
      this.resetForm() // 使用重置表单方法
      this.visible = false
      this.disableSubmit = false
    },
  }
}
</script>

<style scoped>
.form-footer {
  text-align: center;
  margin-top: 24px;
}

.upload-container {
  position: relative;
}

.psw-message {
  color: #ff0000;
  font-size: 15px;
  margin-top: 8px;
}

.file-message {
  color: #ff0000;
  font-size: 15px;
}

/* 统一调整行间距 */
.ant-row {
  margin-bottom: 5px;
}

/* 表单项底部边距 */
.ant-form-item {
  margin-bottom: 10px;
}

/* 确保表单布局一致 */
.ant-form-item-label {
  text-align: right;
  line-height: 40px;
}

/* 统一输入框高度 */
.ant-input {
  height: 32px;
}

/* 上传组件间距 */
.ant-upload-list-picture-card .ant-upload-list-item {
  margin-bottom: 10px;
}

.avatar-uploader>.ant-upload {
  width: 104px;
  height: 104px;
}

.upload-hint {
  font-size: 12px;
  color: #f56c6c;
  margin-top: 5px;
}
</style>

<!-- 全局样式，不受scoped限制 -->
<style>
/* 错误提示文字样式 */
.ant-form-explain, .ant-form-item-explain {
  font-size: 12px !important;
  color: #f56c6c !important;
}
</style>
