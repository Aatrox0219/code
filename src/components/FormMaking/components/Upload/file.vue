<template>
  <div class="fm-upload-file">
    <el-upload
      class="upload-demo"
      :action="`/plm/common/upload/`"   
      name="multipartFile"
      :file-list="fileList"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :on-success="handleSuccess"
      multiple
      :on-exceed="handleExceed"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <template>
      <template v-for="item in fileList">
        <el-tooltip effect="dark" :content="item.name" placement="top-start">
          <el-link type="info" class="file-download" :href="`${serverUrl}/plm/common/download${item.url}`">
            {{ item.name }}</el-link
          >
        </el-tooltip>
      </template>
    </template>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import api from '@/api/index'
require('viewerjs/dist/viewer.css')

export default {
  components: {
    Draggable,
  },
  
  props: {
    value: {
      // type: Array,
      default: () => [],
    },
    token: {
      type: String,
      default: '',
    },
    domain: {
      type: String,
      default: '',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: 9,
    },
    isQiniu: {
      type: Boolean,
      default: false,
    },
    min: {
      type: Number,
      default: 0,
    },
    action: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    tip: {
      type: String,
      default: '123456',
    },
    headers: {
      type: Array,
      default: () => [],
    },
    ui: {
      type: String,
      default: 'element',
    },
  },
  data() {
    return {
      serverUrl: api.server_url,
      fileList: [],
      tooltipflag: false,
      selectFileListItem: '',
      index: 0,
    }
  },
  created() {
    if (this.value) {
      this.getFileList(this.value)
    }
  },
  computed: {
    miniWidth() {
      if (this.width > this.height) {
        return this.height
      } else {
        return this.width
      }
    },
  },
  methods: {
    //:action="`/apiUpload/sonline/common/upload/`"
    getFileList(value) {
      //将每一个文件信息fileName+dbpath处理成文件上传组件支持的fileList格式即name+url
      if (value.length != 0) {
        //将之前已有的文件格式由fileName+dbpath转换为name+url 并给转换之后的文件排序
        this.fileList = this.sortFileOfName(this.fileNameToName(JSON.parse(value)))
      } else {
        this.fileList = []
      }
    },
    handleSuccess(response, file, fileList) {
      let list = []
      if (this.value && JSON.stringify(this.value) != '[]') {
        //当点击编辑本身数据有文件的时候，会将文件数据value传过来的，value值是json字符串，要去掉value里面key值得双引号转换为对象数值
        list = JSON.parse(this.value)
      }
      var newresult = {}
      newresult.fileName = response.result.fileName
      newresult.dbpath = response.result.dbpath
      list.push(newresult) //将上传文件后返回回调结果添加到list里面再更新文件上传父组件的model值，不然提交的时候获取不到最新的文件上传列表值
      
      //将上传成功之后的文件和之前已有文件整合后的文件格式由fileName+dbpath转换为name+url 并给转换之后的文件排序
      this.fileList = this.sortFileOfName(this.fileNameToName(list))

      this.$emit('change', JSON.stringify(list))
    },
    handleRemove(file, fileList) {
      let fileList2 = []
      for (let i = 0; i < fileList.length; i++) {
        //handleRemove的参数fileList是删除文件后的文件列表数据
        let fileListItem = {}
        //删除的时候如果是点击编辑按钮之后的删除会导致数据格式不一样，一种直接是一个对象，另一种是一个file对象。两种数据的url位置不一样需要判断处理一下
        fileListItem.fileName = fileList[i].name 
        if (fileList[i].url) {
          fileListItem.dbpath = fileList[i].url
        } else {
          fileListItem.dbpath = fileList[i].response.result.dbpath
        }
        fileList2.push(fileListItem)
      }

      var newFileListAfterRemove = []
      //删掉一个文件之后最新的文件列表是由组件自带属性fileList获得，有序号且可能序号不是连续的，先删掉序号
      newFileListAfterRemove = this.deleteSort(fileList2)
      //将上传成功之后的文件和之前已有文件整合后的文件格式由fileName+dbpath转换为name+url 并给转换之后的文件排序
      this.fileList = this.sortFileOfName(this.fileNameToName(newFileListAfterRemove))
      this.$emit('change', JSON.stringify(this.deleteSort(fileList2)))
    },
    handlePreview(file) {
      alert(file.name)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeRemove(file, fileList) {
      // console.log('beforeRemove函数打印file', file, 'file', fileList)
      // return this.$confirm('确定删除？','消息',{
      //         confirmButtonText:'确定',
      //         callback:action => {
      //           //自动刷新页面
      //           window.location.reload()
      //         }
      //       });
      // this.$confirm({
      //   title: '确定删除',
      //   content: `确定移除 ${file.name}？`,
      //   okType: 'danger',
      //   onOk() {
      //    return handleRemove(file, fileList)
      //   },
      // })
    },
    // sortFileOfFileName(fileList){//给文件列表的名称排序，此时名称为fileName 上传数据库所用
    //   var index = 0
    //   var newFileList = []
    //   for (let i = 0; i < fileList.length; i++) {
    //     let fileListItem = {}
    //     index += 1
    //     fileListItem.fileName = index + '.' + fileList[i].fileName
    //     fileListItem.dbpath = fileListItem[i].dbpath
    //     newFileList.push(fileListItem)
    //   }
    //   return newFileList
    // },
    sortFileOfName(fileList){//给文件列表的名称排序，此时名称为name 文件列表显示所用
      var index = 0
      var newFileList = []
      for (let i = 0; i < fileList.length; i++) {
        let fileListItem = {}
        index += 1
        fileListItem.name = index + '.' + fileList[i].name
        fileListItem.url = fileList[i].url
        newFileList.push(fileListItem)
      }
      return newFileList
    },
    fileNameToName(fileList){//将文件列表fileName->name dbpath->url
      var newFileList = []
      for (let i = 0; i < fileList.length; i++) {
        let fileListItem = {}
        fileListItem.name = fileList[i].fileName
        fileListItem.url = fileList[i].dbpath
        newFileList.push(fileListItem)
      }
      return newFileList
    },
    // nameToFileName(fileList){//将文件列表name->fileName url->dbpath
    //   var newFileList = []
    //   for (let i = 0; i < fileList.length; i++) {
    //     let fileListItem = {}
    //     fileListItem.fileName = fileList[i].name
    //     fileListItem.dbpath = fileList[i].url
    //     newFileList.push(fileListItem)
    //   }
    //   return newFileList
    // },
    deleteSort(fileList) {//去掉文件列表前序号
      //去掉文件名称前的序号，由于根据“.”来分割，不能保证一个文件名字里面没有其他的“.”，所以只能删除掉第一个“.”及以前的序号
      let dealFileList = []
      for (let i = 0; i < fileList.length; i++) {
        let dealFileListItem = {}
        let listitem1 = fileList[i].fileName.split('.')
        listitem1.shift()
        listitem1.join('.')
        dealFileListItem.fileName = listitem1.join('.')
        dealFileListItem.dbpath = fileList[i].dbpath
        dealFileList.push(dealFileListItem)
      }
      return dealFileList
    },
  },
}
</script>

<style lang="scss" scoped>
.fm-upload-file {
  .el-upload-list__item {
    transition: none !important;
  }

  .upload_input {
    display: none !important;
  }

  .el-upload__input{
    display: none !important;
  }
  
  .file-download {
    width: 100%;
    .el-link--inner {
      display: inline-block !important;
      overflow: hidden !important;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
    }
  }

  .upload_tip {
    font-size: 12px;
    color: #606266;
    margin-top: 7px;
  }

  .upload-list {
    margin: 0;
    padding: 0;
    list-style: none;

    .list_item {
      font-size: 14px;
      color: #606266;
      line-height: 1.8;
      margin-top: 5px;
      position: relative;
      box-sizing: border-box;
      border-radius: 4px;
      width: 100%;

      &.is-disabled {
        // &::before{
        //   position: absolute;
        //   top:0;
        //   left: 0;
        //   bottom: 0;
        //   right: 0;
        //   z-index: 99;
        //   display: block;
        //   content: '';
        //   cursor: not-allowed;
        // }
        .icon-close {
          cursor: not-allowed;
        }
      }

      .el-progress,
      .ant-progress {
        position: absolute;
        top: 20px;
        width: 100%;
      }

      .el-progress__text,
      .ant-progress-text {
        position: absolute;
        right: 0;
        top: -13px;
      }

      .el-progress-bar,
      .ant-progress-outer {
        margin-right: 0;
        padding-right: 0;
      }

      &.is-success {
        .list_item-status-label {
          .icon-upload-success {
            display: inline-block;
            line-height: inherit;
          }
        }
      }

      .icon-close {
        display: none;
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
        color: #606266;
        font-weight: 400;
      }

      &:hover {
        background-color: #f5f7fa;

        .icon-close {
          display: inline-block;
        }

        .list_item-status-label {
          display: none;
        }

        .el-progress__text {
          display: none;
        }
      }

      .list_item-name {
        text-decoration: none;
        color: #606266;
        display: block;
        margin-right: 40px;
        overflow: hidden;
        padding-left: 4px;
        text-overflow: ellipsis;
        transition: color 0.3s;
        white-space: nowrap;

        &:hover {
          color: #409eff;
          cursor: pointer;
        }

        i {
          margin-right: 7px;
          color: #909399;
          height: 100%;
          line-height: inherit;
        }
      }

      .list_item-status-label {
        display: block;
        position: absolute;
        right: 5px;
        top: 0;
        line-height: inherit;

        .icon-upload-success {
          color: #67c23a;
          display: none;
        }
      }
    }
  }
}
</style>
