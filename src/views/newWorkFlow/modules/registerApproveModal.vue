<template>
    <a-modal :visible="visible" :centered="true" :footer="null" width="1000px" :zIndex="100"
        :dialog-style="{ top: '20px' }" :closable="false" :destroyOnClose="true">
        <div class="buttonstyle"><a-button class="xbutton" type="dashed" @click="close()">X</a-button></div>
        <div style="margin-top:27px">
            <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
                <div class="info-section">
                    <!-- <a-divider>企业注册信息</a-divider> -->
                    <h2 style="color: black; text-align: center; font-size: 24px; font-weight: bold;">
                        企业注册信息
                    </h2>
                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="用户账号">
                                <a-input v-decorator="['username']" disabled />
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="企业名称">
                                <a-input v-decorator="['companyName']" disabled />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="统一社会信用代码" :label-col="{ span: 7 }">
                                <a-input v-decorator="['creditCode']" disabled />
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="通信地址">
                                <a-input v-decorator="['postalAddress']"  disabled />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="邮编" :label-col="{ span: 7 }">
                                <a-input v-decorator="['postCode']" disabled />
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="法定代表人">
                                <a-input v-decorator="['representative']" disabled />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="手机号码" :label-col="{ span: 7 }">
                                <a-input v-decorator="['phone']" disabled />
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="传真">
                                <a-input v-decorator="['fax']" disabled />
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="营业执照副本">
                                <div class="image-container" @click="previewImage(licenseDisplayUrl)"
                                    v-if="licenseDisplayUrl">
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
                                <div class="image-container" @click="previewImage(stampDisplayUrl)"
                                    v-if="stampDisplayUrl">
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

                <div class="approval-section">
                    <!-- <a-divider>审核</a-divider> -->

                    <a-row :gutter="16">
                        <a-col :span="12" style="padding-top: 10px;">
                            <a-form-item label="审核意见">
                                <a-select v-decorator="['approvalResult', {
                                    rules: [{ required: true, message: '请选择审核结果' }]
                                }]" placeholder="请选择审核意见" style="width: 150px;">
                                    <a-select-option value="同意">同意</a-select-option>
                                    <a-select-option value="拒绝">拒绝</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="备注" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
                                <a-textarea v-decorator="['approvalComment', {
                                }]" :rows="4" />
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <div class="form-footer">
                        <a-button type="primary" @click="approve()">同意</a-button>
                        <a-button type="danger" style="margin-left: 20px" @click="reject()">拒绝</a-button>
                    </div>
                </div>
            </a-form>
        </div>

        <!-- 图片预览 -->
        <a-modal :visible="previewVisible" :footer="null" @cancel="handlePreviewCancel" width="800px">
            <img alt="预览图片" style="width: 100%" :src="previewImageUrl" />
        </a-modal>
    </a-modal>
</template>

<script>
import { nw_postAction, nw_postAction1, nw_getAction } from '@api/newWorkApi'
import axios from 'axios'
import api from '@/api/index'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'

export default {
    name: 'RegisterApproveModal',
    
    data() {
        return {
            visible: false,
            form: this.$form.createForm(this),
            record: null,
            licenseCopy: '',
            stamp: '',
            taskId: '',
            processInstanceId: '',
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
            this.taskId = record.taskId
            this.processInstanceId = record.processInstanceId
            this.getRegistrationDetail(record.id)
        },
        close() {
            this.visible = false
            this.form.resetFields()
            this.licenseCopy = ''
            this.stamp = ''
            this.licenseDisplayUrl = ''
            this.stampDisplayUrl = ''
            this.record = null
            this.$emit('close')
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
        getRegistrationDetail(id) {
            // 调用获取企业注册详情的接口
            console.log('id是：', id)
            axios.get(`${this.registrationApiUrl}/registration/detail`, {
                params: { id }
            }).then(res => {
                if (res.data.success) {
                    const data = res.data.result
                    // 填充表单数据
                    this.form.setFieldsValue({
                        username: data.username,
                        companyName: data.companyName,
                        creditCode: data.creditCode,
                        postalAddress: data.postalAddress,
                        postCode: data.postCode,
                        representative: data.representative,
                        phone: data.phone,
                        fax: data.fax
                    })

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
                } else {
                    this.$message.error('获取企业注册详情失败：' + res.data.message)
                }
            }).catch(err => {
                console.error('获取企业注册详情错误：', err)
                this.$message.error('获取企业注册详情失败，请稍后再试')
            })
        },
        approve() {
            this.form.validateFields((err, values) => {
                if (err) {
                    this.$message.error('请完成必填项');
                    return;
                }

                const params = new URLSearchParams();
                params.append('id', this.record.id);
                params.append('review_remark', values.approvalComment || ''); 

                console.log('Sending params:', params);

                axios.post(`${this.registrationApiUrl}/registration/approve`, params)
                    .then(res => {
                        if (res.data.success) {
                            this.$message.success('审核通过成功');
                            // 先发送 refresh 事件，确保数据刷新
                            this.$emit('refresh');
                            this.close();
                        } else {
                            this.$message.error('审核通过失败：' + res.data.message);
                        }
                    })
                    .catch(err => {
                        console.error('审核通过请求错误：', err);
                        this.$message.error('审核操作失败，请稍后再试');
                    });
            });
        },
        reject() {
            this.form.validateFields((err, values) => {
                if (err) {
                    this.$message.error('请完成必填项');
                    return;
                }

                const params = new URLSearchParams();
                params.append('id', this.record.id);
                params.append('review_remark', values.approvalComment || ''); 

                console.log('Sending params:', params);

                axios.post(`${this.registrationApiUrl}/registration/reject`, params)
                    .then(res => {
                        if (res.data.success) {
                            this.$message.success('审核拒绝成功');
                            // 先发送 refresh 事件，确保数据刷新
                            this.$emit('refresh');
                            this.close();
                        } else {
                            this.$message.error('审核拒绝失败：' + res.data.message);
                        }
                    })
                    .catch(err => {
                        console.error('审核拒绝请求错误：', err);
                        this.$message.error('审核操作失败，请稍后再试');
                    });
            });
        }
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
</style>