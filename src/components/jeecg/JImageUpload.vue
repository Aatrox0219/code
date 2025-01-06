<template>
  <div class="img">
    <a-upload name="file" listType="picture-card" :multiple="isMultiple" :action="uploadAction" :headers="headers"
      :data="{ biz: bizPath }" :fileList="fileList" :fileListForLicense="fileListForLicense"
      :fileListForSignature="fileListForSignature" :fileListForStamp="fileListForStamp" :beforeUpload="beforeUpload"
      :disabled="disabled" :isMultiple="isMultiple" :showUploadList="isMultiple" @change="handleChange"
      @preview="handlePreview" :class="!isMultiple ? 'imgupload' : ''">
      <div :style="{ 'width': (!isMultiple ? '104px' : 'auto'), 'height': (!isMultiple ? '104px' : 'auto') }">
        <img v-if="!isMultiple && picUrl" :src="getAvatarView()" style="width:100%;height:100%" />
        <div v-else class="iconp">
          <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
          <div class="ant-upload-text">{{ text }}</div>
        </div>
      </div>
      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel()">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
    </a-upload>
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import { getFileAccessHttpUrl } from '@/api/manage'

const uidGenerator = () => {
  return '-' + parseInt(Math.random() * 10000 + 1, 10);
}
const getFileName = (path) => {
  if (path.lastIndexOf("\\") >= 0) {
    let reg = new RegExp("\\\\", "g");
    path = path.replace(reg, "/");
  }
  return path.substring(path.lastIndexOf("/") + 1);
}
export default {
  name: 'JImageUpload',
  data() {
    return {
      // uploadAction:window._CONFIG['domianURL']+"/sys/common/upload",
      uploadAction: window._CONFIG['DocumentURL'] + "/file/upload",
      uploadLoading: false,
      picUrl: false,
      headers: {},
      fileList: [],
      fileListForLicense: [],
      fileListForSignature: [],
      fileListForStamp: [],
      previewImage: "",
      previewVisible: false,
    }
  },
  props: {
    text: {
      type: String,
      required: false,
      default: "上传"
    },
    /*这个属性用于控制文件上传的业务路径*/
    bizPath: {
      type: String,
      required: false,
      default: "temp"
    },
    value: {
      type: [String, Array],
      required: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    isMultiple: {
      type: Boolean,
      required: false,
      default: false
    },
    //update-begin-author:wangshuai date:20201021 for:LOWCOD-969 新增number属性，用于判断上传数量
    number: {
      type: Number,
      required: false,
      default: 0
    },
    //update-end-author:wangshuai date:20201021 for:LOWCOD-969 新增number属性，用于判断上传数量
    dataType: {
      type: String,
      required: true,
      validator: function (value) {
        return ['avatar','license', 'signature', 'stamp'].includes(value);
      }
    }
  },
  watch: {
    value: {
      handler(val, oldValue) {
        if (val instanceof Array) {
          this.initFileList(val.join(','))
        } else {
          this.initFileList(val)
        }
        if (!val || val.length == 0) {
          this.picUrl = false;
        }
      },
      //立刻执行handler
      immediate: true
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN);
    this.headers = { "X-Access-Token": token }
  },
  methods: {
    initFileList(paths) {
      if (!paths || paths.length == 0) {
        this.fileList = [];
        this.fileListForLicense = [];
        this.fileListForSignature = [];
        this.fileListForStamp = [];
        return;
      }
      this.picUrl = true;
      let fileList = [];
      this.fileListForLicense = [];
      this.fileListForSignature = [];
      this.fileListForStamp = [];
      let arr = paths.split(",")
      console.log('arr', arr);
      for (var a = 0; a < arr.length; a++) {
        let url = getFileAccessHttpUrl(arr[a]);
        fileList.push({
          uid: uidGenerator(),
          name: getFileName(arr[a]),
          status: 'done',
          url: url,
          response: {
            status: "history",
            message: arr[a]
          }
        }),
          this.fileListForLicense.push({
            uid: uidGenerator(),
            name: getFileName(arr[a]),
            status: 'done',
            url: url,
            response: {
              status: "history",
              message: arr[a]
            }
          })
          this.fileListForSignature.push({
          uid: uidGenerator(),
          name: getFileName(arr[a]),
          status: 'done',
          url: url,
          response: {
            status: "history",
            message: arr[a]
          }
        })
        this.fileListForStamp.push({
          uid: uidGenerator(),
          name: getFileName(arr[a]),
          status: 'done',
          url: url,
          response: {
            status: "history",
            message: arr[a]
          }
        })
      }
      this.fileList = fileList
      this.fileListForLicense = this.fileListForLicense
      this.fileListForSignature = this.fileListForSignature
      this.fileListForStamp = this.fileListForStamp
    },
    beforeUpload: function (file) {
      var fileType = file.type;
      if (fileType.indexOf('image') < 0) {
        this.$message.warning('请上传图片');
        return false;
      }
    },
    handleChange(info) {
      console.log('info', info);
      this.picUrl = false;
      let fileList = info.fileList
      let fileListForLicense = info.fileListForLicense;
      let fileListForSignature = info.fileListForSignature;
      let fileListForStamp = info.fileListForStamp;
      //update-begin-author:wangshuai date:20201022 for:LOWCOD-969 判断number是否大于0和是否多选，返回选定的元素。
      if (this.number > 0 && this.isMultiple) {
        fileList = fileList.slice(-this.number);
        fileListForLicense = fileListForLicense.slice(-this.number);
        fileListForSignature = fileListForSignature.slice(-this.number);
        fileListForStamp = fileListForStamp.slice(-this.number);
      }
      //update-end-author:wangshuai date:20201022 for:LOWCOD-969 判断number是否大于0和是否多选，返回选定的元素。
      if (info.file.status === 'done') {
        if (info.file.response && info.file.response.success) {
          this.picUrl = true;
          fileList = fileList.map((file) => {
            if (file.response && file.response.result && file.response.result.uplodadFile) {
              file.url = file.response.result.uplodadFile;
            }
            return file;
          });
          fileListForLicense = fileListForLicense.map((file) => {
            if (file.response && file.response.result && file.response.result.uplodadFile) {
              file.url = file.response.result.uplodadFile;
            }
            return file;
          });
          fileListForSignature = fileListForSignature.map((file) => {
            if (file.response && file.response.result && file.response.result.uplodadFile) {
              file.url = file.response.result.uplodadFile;
            }
            return file;
          });
          fileListForStamp = fileListForStamp.map((file) => {
            if (file.response && file.response.result && file.response.result.uplodadFile) {
              file.url = file.response.result.uplodadFile;
            }
            return file;
          });
        }
        //this.$message.success(`${info.file.name} 上传成功!`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败.`);
      } else if (info.file.status === 'removed') {
        this.handleDelete(info.file)
      }
      this.fileList = fileList
      this.fileListForLicense = fileListForLicense
      this.fileListForSignature = fileListForSignature
      this.fileListForStamp = fileListForStamp
      if (info.file.status === 'done' || info.file.status === 'removed') {
        this.handlePathChange()
      }
    },
    // 预览
    handlePreview(file) {
      console.log('file预览', file);
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    getAvatarView() {
      if (this.fileList.length > 0) {
        let url = this.fileList[0].url
        return getFileAccessHttpUrl(url)
      }
      if (this.fileListForLicense.length > 0) {
        let url = this.fileListForLicense[0].url
        return getFileAccessHttpUrl(url)
      }
      if (this.fileListForSignature.length > 0) {
        let url = this.fileListForSignature[0].url
        return getFileAccessHttpUrl(url)
      }
      if (this.fileListForStamp.length > 0) {
        let url = this.fileListForStamp[0].url
        return getFileAccessHttpUrl(url)
      }
    },
    handlePathChange() {
      let uploadFiles
      let path = ''
      // 根据 dataType 属性来确定使用哪个文件列表
      switch (this.dataType) {
        case 'avatar':
          uploadFiles = this.fileList;
          break;
        case 'license':
          uploadFiles = this.fileListForLicense;
          break;
        case 'signature':
          uploadFiles = this.fileListForSignature;
          break;
        case 'stamp':
          uploadFiles = this.fileListForStamp;
          break;
      }
      if (!uploadFiles || uploadFiles.length == 0) {
        path = ''
      }
      let arr = [];
      if (!this.isMultiple) {
        arr.push(uploadFiles[uploadFiles.length - 1].response.result.uplodadFile)
      } else {
        for (let a = 0; a < uploadFiles.length; a++) {
          // update-begin-author:taoyan date:20200819 for:【开源问题z】上传图片组件 LOWCOD-783
          if (uploadFiles[a].status === 'done') {
            arr.push(uploadFiles[a].response.result.uplodadFile)
          } else {
            return;
          }
          // update-end-author:taoyan date:20200819 for:【开源问题z】上传图片组件 LOWCOD-783
        }
      }
      if (arr.length > 0) {
        path = arr.join(",")
      }

      // 根据 dataType 触发对应的自定义事件，传递处理后的路径数据
      switch (this.dataType) {
        case 'avatar':
          this.$emit('avatarChange', path);
          break;
        case 'license':
          this.$emit('licenseChange', path);
          break;
        case 'signature':
          this.$emit('signatureChange', path);
          break;
        case 'stamp':
          this.$emit('stampChange', path);
          break;
      }
    },
    handleDelete(file) {
      //如有需要新增 删除逻辑
      console.log(file)
    },
    handleCancel() {
      this.close();
      this.previewVisible = false;
    },
    close() {

    },
  },
  model: {
    prop: 'value',
    event: 'change'
  }
}
</script>

<style scoped>
/* update--begin--autor:lvdandan-----date:20201016------for：j-image-upload图片组件单张图片详情回显空白
  * https://github.com/zhangdaiscott/jeecg-boot/issues/1810
  * https://github.com/zhangdaiscott/jeecg-boot/issues/1779
  */
/deep/ .imgupload .ant-upload-select {
  display: block
}

/deep/ .imgupload .ant-upload.ant-upload-select-picture-card {
  width: 120px;
  height: 120px;
}

/deep/ .imgupload .iconp {
  padding: 32px;
}

/* update--end--autor:lvdandan-----date:20201016------for：j-image-upload图片组件单张图片详情回显空白*/
</style>
