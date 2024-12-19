<template>
  <a-table bordered :columns="columnsList" :dataSource="dataSourceList" rowKey="id">
    <span slot="flowWillAnnounceaction" slot-scope="text, record, index">
      <a @click="announceTask(record)">处理该任务</a>
      <a-divider type="vertical" />
      <a @click="seeHistory(record)">历史</a>
    </span>
    <span slot="flowHistoryaction" slot-scope="text, record, index">
      <a @click="seeHistory(record)">历史</a>
    </span>
    <span slot="flowUseMoneycolumns" slot-scope="text, record, index">
      <a @click="startProcess(record)">申请使用</a>
    </span>
    <span slot="flowChangecolumns" slot-scope="text, record, index">
      <a @click="startFixedProcess(true, record)">申请存缴方式变更</a>
    </span>
  </a-table>
</template>

<script>
import { nw_getAllData } from '@api/newWorkApi'

export default {
  name: 'commonTable',
  props: {
    configurationParameter: {
      type: Object,
      default: () => {},
    },
    announceTask: {
      type: Function,
      default: () => {},
    },
    seeHistory: {
      type: Function,
      default: () => {},
    },
    startProcess: {
      type: Function,
      default: () => {},
    },
    startFixedProcess: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      dataSourceList: [],
      columnsList: [],
    }
  },
  methods: {
    getAllList() {
      let params = {
        ...this.configurationParameter.inquire,
      }
      nw_getAllData('generalList/getAllList', params).then((res) => {
        console.log('接口返回数据：', res)
        // 过滤掉 allData 为空的脏数据
        const validDataList = res.result.dataList.filter((dataItem) => {
          return dataItem.allData && Object.keys(dataItem.allData).length > 0 // 只有 allData 不为空对象时才保留
        })
        console.log('过滤之后的数据', validDataList)
        // 遍历dataList生成dataSourceList
        const dataSourceList = validDataList.map((dataItem) => {
          const item = {}
          //流程基本信息
          item.processName = dataItem.processName
          item.taskId = dataItem.taskId
          item.processId = dataItem.processId
          item.processInstanceId = dataItem.processInstanceId
          item.processHisInstanceId = dataItem.processHisInstanceId

          item.depositWay = dataItem.allData.main_payment.deposit_way     //保证金存缴方式
          item.flag = dataItem.flag // 用于判断是否是撤回的任务

          // 处理前置流程id
          const processMainTable = dataItem.processMainTable
          const processMainKey = dataItem.processMainKey
          item.frontId = dataItem.allData?.[processMainTable]?.[processMainKey] || null //该流程的前置流程id

          // 遍历columnsData来生成dataSource
          this.configurationParameter.columnsData.forEach((column) => {
            if (column.dataLocation) {
              // 判断dataLocation是否存在，并提取数据
              const keys = column.dataLocation.split('.')
              let value = dataItem
              keys.forEach((key) => {
                value = value[key] || null
              })
              item[column.dataIndex] = value
            }
          })
          return item
        })

        // 更新dataSourceList
        this.dataSourceList = dataSourceList

        // 去掉 columnsData 中的 show 和 dataLocation,生成 columnsList,只有show为true的列才会显示
        const columnsList = this.configurationParameter.columnsData
          .filter((column) => column.show)
          .map((column) => {
            const { dataLocation, show, ...rest } = column
            return rest
          })

        // 更新columnsList
        this.columnsList = columnsList
        console.log('dataSourceList:', this.dataSourceList)
        console.log('columnsList:', this.columnsList)
      })
    },
  },
  mounted() {
    this.getAllList()
  },
}
</script>

<style scoped>
</style>