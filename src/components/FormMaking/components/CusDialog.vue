<template>
  <el-dialog
    class="cus-dialog-container"
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    center
    :width="width"
    ref="elDialog"
    :id="id"
    v-drag-dialog="true"
    :fullscreen="fullscreen"
    >
    <span v-if="show">
      <slot></slot>
    </span>

    <span v-if="action" slot="footer" class="dialog-footer" v-loading="loading"
      :element-loading-text="loadingText">
      <slot name="action">
        <!-- <el-button type="primary" @click="submit" >{{$t('fm.actions.confirm')}}</el-button>
         <el-button @click="close">{{$t('fm.actions.cancel')}}</el-button> -->
        <el-button type="primary" @click="submit" >确 定</el-button>
         <el-button @click="close">取 消</el-button>
      </slot>
    </span>
  </el-dialog>
</template>

<script>
import DragDialog from '../directive/drag-dialog'

export default {
  directives: {
    DragDialog
  },
  props: {
    visible: Boolean,
    loadingText: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '600px'
    },
    form: {
      type: Boolean,
      default: true
    },
    action: {
      type: Boolean,
      default: true
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    show () {
      if (this.form) {
        return this.showForm
      } else {
        return true
      }
    }
  },
  data () {
    return {
      loading: false,
      dialogVisible: this.visible,
      id: 'dialog_' + new Date().getTime(),
      showForm: false
    }
  },
  methods: {
    close () {
      this.dialogVisible = false
    },
    submit () {
      this.loading = true

      this.$emit('on-submit')
    },
    end () {
      this.loading = false
    }
  },
  mounted () {
  },
  watch: {
    dialogVisible (val) {
      if (!val) {
        this.loading = false
        this.$emit('on-close')
        setTimeout(() => {
          this.showForm = false
        }, 300)
      } else {
        this.showForm = true
      }
    },
    visible (val) {
      this.dialogVisible = val
    }
  }
}
</script>

<style lang="scss" scoped>
.cus-dialog-container{
  .el-dialog__header{
    background: rgb(230, 239, 245);
    padding: 10px;

    .el-dialog__headerbtn{
      top:10px;
      right: 10px;
      font-size: 20px;
    }
  }

  &.notitle{
    .el-dialog__header{
      padding: 0;
    }
  }

  .el-dialog--center .el-dialog__body{
    padding: 20px;
  }

  .el-dialog__footer{
    margin: 0 20px;
    /* // border-top: 1px dashed #ccc; */
    padding: 15px 0 16px;
    text-align: center;
    position: relative;

    .dialog-footer{
      display: block;

      .circular{
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
        width: 24px;
        height: 24px;
      }

      .el-loading-text{
        display: inline-block;
        vertical-align: middle;
      }

      .el-loading-spinner{
        margin-top: -12px;
      }
    }
  }
}
</style>
