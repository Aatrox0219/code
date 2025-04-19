<template>
  <a-modal :visible="visible" :centered="true" :footer="null" width="75%" :zIndex="100" :dialog-style="{ top: '20px' }"
    :closable="false" :destroyOnClose="true">
    <div class="buttonstyle"><a-button class="xbutton" type="dashed" @click="handleClose">X</a-button></div>
    <div style="margin-top:27px">
      <a-tabs default-active-key="1" tab-position="left">
        <!-- 注册详情标签页 -->
        <a-tab-pane key="1" tab="注册详情">
          <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
            <div class="task-info" v-if="visible">
              <span>任务名称：总包施工单位提交注册申请</span>
              <span style="margin-left: 15px;">申请时间：{{ formData.createTime || (record && record.createTime) || '未知'
                }}</span>
              <span style="margin-left: 15px;">申请人：{{ formData.companyName || (record && record.companyName) || (record
                && record.companyName) || '未知' }}</span>
            </div>
            <div class="info-section">
              <h2 style="color: black; text-align: center; font-size: 24px; font-weight: bold;">
                企业注册信息
              </h2>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="用户账号">
                    <a-input v-model="formData.username" disabled />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="企业名称">
                    <a-input v-model="formData.companyName" disabled />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="统一社会信用代码" :label-col="{ span: 7 }">
                    <a-input v-model="formData.creditCode" disabled />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="通信地址">
                    <a-input v-model="formData.postalAddress" disabled />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="邮编" :label-col="{ span: 7 }">
                    <a-input v-model="formData.postCode" disabled />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="法定代表人">
                    <a-input v-model="formData.representative" disabled />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="手机号码" :label-col="{ span: 7 }">
                    <a-input v-model="formData.phone" disabled />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="传真">
                    <a-input v-model="formData.fax" disabled />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="营业执照副本">
                    <div class="image-container" @click="previewImage(licenseDisplayUrl)" v-if="licenseDisplayUrl">
                      <img :src="licenseDisplayUrl" alt="营业执照副本" class="preview-image"
                        @error="handleImageError($event, 'license')" />
                      <div class="image-overlay">
                        <a-icon type="zoom-in" class="zoom-icon" />
                      </div>
                    </div>
                    <span v-else>暂无图片</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="企业盖章" :label-col="{ span: 7 }">
                    <div class="image-container" @click="previewImage(stampDisplayUrl)" v-if="stampDisplayUrl">
                      <img :src="stampDisplayUrl" alt="企业盖章" class="preview-image"
                        @error="handleImageError($event, 'stamp')" />
                      <div class="image-overlay">
                        <a-icon type="zoom-in" class="zoom-icon" />
                      </div>
                    </div>
                    <span v-else>暂无图片</span>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>

            <div v-if="approvalInfo.approvalResult !== null">
              <div class="task-info" v-if="visible">
                <span>任务名称：人社局管理员审核注册申请</span>
                <span style="margin-left: 15px;">处理时间：{{ formData.reviewTime || (record && record.reviewTime) || '未知' }}</span>
                <span style="margin-left: 15px;">处理人：人社局管理员</span>
              </div>
              <div class="approval-section">
                <a-row :gutter="16">
                  <a-col :span="12" style="padding-top: 10px;">
                    <a-form-item label="审核意见">
                      <a-input style="width: 150px;" :value="approvalInfo.approvalResult === 1 ? '同意' : '拒绝'" disabled />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row :gutter="16">
                  <a-col :span="24">
                    <a-form-item label="备注" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
                      <a-textarea v-model="approvalInfo.approvalComment" :rows="4" disabled />
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
            </div>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 图片预览 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="handlePreviewCancel" width="800px">
      <img alt="预览图片" style="width: 100%" :src="previewImageUrl" />
    </a-modal>
  </a-modal>
</template>

<script>
import axios from 'axios'
import api from '@/api/index'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'

export default {
  name: 'RegisterDetailModal',
  data() {
    return {
      visible: false,
      form: this.$form.createForm(this),
      record: null,
      licenseCopy: '',
      stamp: '',
      formData: {
        username: '',
        companyName: '',
        creditCode: '',
        postalAddress: '',
        postCode: '',
        representative: '',
        phone: '',
        fax: '',
        createTime: '',
        reviewTime: ''
      },
      approvalInfo: {
        approvalResult: null,
        approvalComment: '',
        approvalTime: ''
      },
      // 审核历史记录
      approvalHistory: [],
      // 图片预览相关
      previewVisible: false,
      previewImageUrl: '',
      licenseDisplayUrl: '',
      stampDisplayUrl: '',
      // 图片尝试URL索引
      licenseUrlIndex: 0,
      stampUrlIndex: 0,
      // 保存所有可能的URL
      licensePossibleUrls: [],
      stampPossibleUrls: [],
      // 系统配置
      registrationApiUrl: process.env.VUE_APP_COUESE_BASE_URL
    }
  },
  methods: {
    show(record) {
      this.visible = true
      this.record = record
      console.log('显示详情，记录数据:', record);

      // 重置表单，避免上次数据残留
      this.form.resetFields();

      if (!record || !record.id) {
        console.error('无效的记录数据，缺少ID');
        this.$message.error('无法获取详情：记录ID无效');
        return;
      }

      // 先使用列表中的数据进行初步填充，确保界面有内容显示
      this.useFallbackData();

      // 然后再请求完整详情
      this.getRegistrationDetail(record.id)

      // 同时加载审批历史记录
      this.$nextTick(() => {
        try {
          this.getApprovalHistory(record.id)
        } catch (error) {
          console.error('获取审批历史记录失败:', error)
        }
      });
    },
    close() {
      // 先重置表单和数据
      this.form.resetFields()
      this.licenseCopy = ''
      this.stamp = ''
      this.licenseDisplayUrl = ''
      this.stampDisplayUrl = ''
      this.approvalHistory = []
      this.approvalInfo = {
        approvalResult: null,
        approvalComment: '',
        approvalTime: ''
      }
      // 重置formData
      this.formData = {
        username: '',
        companyName: '',
        creditCode: '',
        postalAddress: '',
        postCode: '',
        representative: '',
        phone: '',
        fax: '',
        createTime: '',
        reviewTime: ''
      }
      // 最后再设置record为null和visible=false
      this.record = null
      this.visible = false
    },
    // 预览图片
    previewImage(url) {
      if (!url) return;

      const imageElement = document.createElement('img');
      imageElement.src = url;

      const viewer = new Viewer(imageElement, {
        inline: false,
        button: true,
        navbar: true,
        title: false,
        toolbar: true,
        tooltip: true,
        movable: true,
        zoomable: true,
        rotatable: true,
        scalable: true,
        transition: true,
      });
      viewer.show();
    },
    // 关闭预览
    handlePreviewCancel() {
      this.previewVisible = false;
    },
    // 处理图片加载错误
    handleImageError(event, type) {
      if (type === 'license' && this.licensePossibleUrls.length > this.licenseUrlIndex + 1) {
        this.licenseUrlIndex++;
        this.licenseDisplayUrl = this.licensePossibleUrls[this.licenseUrlIndex];
      } else if (type === 'stamp' && this.stampPossibleUrls.length > this.stampUrlIndex + 1) {
        this.stampUrlIndex++;
        this.stampDisplayUrl = this.stampPossibleUrls[this.stampUrlIndex];
      }
    },
    // 生成所有可能的URL
    generatePossibleUrls(serverPath) {
      if (!serverPath) return [];
      const urls = [];

      // 提取文件名
      const fileName = serverPath.split('/').pop();

      // 判断文件扩展名
      const fileExtension = fileName.split('.').pop().toLowerCase();

      if (fileExtension === 'png') {
        // PNG格式图片路径
        urls.push(`${this.registrationApiUrl}/file/static/opt/upFiles/image/png/${fileName}`);
      } else {
        // 默认按JPG/JPEG格式处理
        urls.push(`${this.registrationApiUrl}/file/static/opt/upFiles/image/jpeg/${fileName}`);
      }

      return urls;
    },
    // 使用备选数据（从记录中提取）
    useFallbackData() {
      if (!this.record) return;

      console.log("使用备选数据填充表单:", this.record);

      // 直接更新formData对象
      this.formData = {
        username: this.record.username || this.record.userName || '',
        companyName: this.record.companyName || '',
        creditCode: this.record.creditCode || '',
        postalAddress: this.record.postalAddress || '',
        postCode: this.record.postCode || this.record.postcode || '',
        representative: this.record.representative || '',
        phone: this.record.phone || '',
        fax: this.record.fax || '',
        review_remark: this.record.reviewRemark || '',
        createTime: this.record.createTime || '',
        reviewTime: this.record.reviewTime || ''
      };

      console.log("更新后的formData:", this.formData);

      // 尝试生成图片URLs（如果记录中有图片路径）
      if (this.record.licenseCopy) {
        this.licenseCopy = this.record.licenseCopy;
        this.licensePossibleUrls = this.generatePossibleUrls(this.record.licenseCopy);
        this.licenseDisplayUrl = this.licensePossibleUrls.length > 0 ? this.licensePossibleUrls[0] : '';
      }

      if (this.record.stamp) {
        this.stamp = this.record.stamp;
        this.stampPossibleUrls = this.generatePossibleUrls(this.record.stamp);
        this.stampDisplayUrl = this.stampPossibleUrls.length > 0 ? this.stampPossibleUrls[0] : '';
      }

      // 如果有审核信息，也设置
      if (this.record.status !== undefined && this.record.status !== 0) {
        this.approvalInfo = {
          approvalResult: this.record.status === 1 ? 1 : 0,
          approvalComment: this.record.reviewRemark || '',
          approvalTime: this.record.reviewTime || ''
        };
      }
    },
    getRegistrationDetail(id) {
      // 调用获取企业注册详情的接口
      console.log('请求详情数据，ID:', id, '请求URL:', `${this.registrationApiUrl}/registration/detail`);

      axios.get(`${this.registrationApiUrl}/registration/detail`, {
        params: { id },
        timeout: 8000 // 设置超时时间
      }).then(res => {
        console.log('详情接口响应:', res.data);

        if (res.data.success) {
          const data = res.data.result
          console.log('设置表单数据:', data);

          // 直接更新formData
          this.formData = {
            username: data.username || '',
            companyName: data.companyName || '',
            creditCode: data.creditCode || '',
            postalAddress: data.postalAddress || '',
            postCode: data.postCode || data.postcode || '',
            representative: data.representative || '',
            phone: data.phone || '',
            fax: data.fax || '',
            createTime: data.createTime || '',
            reviewTime: data.reviewTime || ''
          };

          // 保存原始图片路径
          this.licenseCopy = data.licenseCopy
          this.stamp = data.stamp

          // 生成所有可能的URL
          this.licensePossibleUrls = this.generatePossibleUrls(data.licenseCopy);
          this.stampPossibleUrls = this.generatePossibleUrls(data.stamp);

          // 设置初始URL
          this.licenseDisplayUrl = this.licensePossibleUrls.length > 0 ? this.licensePossibleUrls[0] : '';
          this.stampDisplayUrl = this.stampPossibleUrls.length > 0 ? this.stampPossibleUrls[0] : '';

          console.log('图片URLs:', {
            license: this.licenseDisplayUrl,
            stamp: this.stampDisplayUrl,
            allLicenseUrls: this.licensePossibleUrls,
            allStampUrls: this.stampPossibleUrls
          });

          // 设置审核信息（如果有）
          if (data.status !== 0) {
            this.approvalInfo = {
              approvalResult: data.status === 1 ? 1 : 0,
              approvalComment: data.reviewRemark || '',
              approvalTime: data.reviewTime || ''
            }
            // 同时更新formData中的reviewTime
            this.formData.reviewTime = data.reviewTime || '';
          }
        } else {
          console.error('获取详情失败，使用记录中的数据作为备选');
          this.$message.error('获取企业注册详情失败：' + res.data.message);
          this.useFallbackData();
        }
      }).catch(err => {
        console.error('获取企业注册详情错误：', err);
        this.$message.error('获取企业注册详情失败，使用记录中的数据');
        this.useFallbackData();
      });
    },
    // 获取审批历史记录
    getApprovalHistory(id) {
      // 先尝试使用模拟数据，生产环境可以对接实际接口
      this.approvalHistory = [];

      // 如果当前记录有审核信息，就添加到历史中
      if (this.record && this.record.status !== 0) {
        this.approvalHistory.push({
          result: this.record.status === 1 ? 1 : 0,
          time: this.record.reviewTime || '未知时间',
          comment: this.record.reviewRemark || '无备注'
        });
      }
    },
    handleClose() {
      console.log('关闭详情模态框');
      this.close();
    },
  }
}
</script>

<style lang="scss" scoped>
.buttonstyle {
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
}

.form-footer {
  text-align: center;
  margin-top: 20px;
}

.image-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  max-width: 100%;
  max-height: 150px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}

.preview-image {
  max-width: 100%;
  max-height: 150px;
  display: block;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s;
}

.image-container:hover .image-overlay {
  opacity: 1;
}

.zoom-icon {
  font-size: 24px;
  color: white;
}

/* 调整表单行间距 */
/deep/ .ant-form-item {
  margin-bottom: 12px;
}

/deep/ .ant-divider {
  margin: 16px 0;
}

/deep/ .ant-row {
  margin-bottom: 4px;
}

/* 修改字体颜色和禁用输入框样式 */
/deep/ .ant-form {
  color: #606266;
}

/deep/ .ant-form-item-label>label {
  color: #606266;
}

/deep/ .ant-input[disabled],
/deep/ .ant-input-disabled {
  color: #c0c4cc;
  background-color: #F5F7FA;
  border-color: #e8e8e8;
}

/deep/ .ant-select-disabled .ant-select-selection {
  background-color: #F5F7FA;
  color: #c0c4cc;
}

/deep/ .ant-textarea-disabled {
  color: #c0c4cc;
  background-color: #F5F7FA;
  border-color: #e8e8e8;
}

/deep/ .ant-input-disabled::placeholder {
  color: #c0c4cc;
}

/* 添加细线框 */
.info-section,
.approval-section {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 0 20px 20px;
  margin-bottom: 20px;
}

.info-section /deep/ .ant-divider,
.approval-section /deep/ .ant-divider {
  margin-left: -20px;
  margin-right: -20px;
  width: calc(100% + 40px);
  position: relative;
  top: -10px;
}

/* 标题间距调整 */
.info-section h2 {
  margin-top: 20px;
  margin-bottom: 20px;
}

.approval-section h2 {
  margin-top: 20px;
  margin-bottom: 20px;
}

/* 任务信息样式 */
.task-info {
  color: #1890ff;
  font-size: 14px;
  margin-top: 10px;
  padding-left: 10px;
  padding: 8px 12px;
  border-radius: 4px;
  font-weight: 500;
  width: 100%;
  display: block;
}
</style>