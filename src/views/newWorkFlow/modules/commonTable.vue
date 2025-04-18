<template>
  <div>
    <!-- 筛选部分 -->
    <a-row v-if="hasFilterOptions" :gutter="24" style="margin-bottom: 20px">
      <!-- 普通筛选控件 -->
      <a-col v-for="column in configurationParameter.columnsData" :key="column.dataIndex" :md="8" :xxl="5"
        v-if="column.filterType && column.filterType !== 'mixedInput'" style="display: flex; align-items: center">
        <!-- 控件的左侧标签 -->
        <span style="width: 100px; text-align: right; margin-right: 8px; font-weight: bold">{{ column.title }}：</span>

        <!-- 根据 filterType 渲染不同的筛选控件,目前支持 input、select和日期选择器 -->
        <a-input v-if="column.filterType === 'input'" v-model="filterConditions[column.dataIndex]"
          :placeholder="`请输入${column.title}`" style="flex: 1; max-width: 200px" allowClear />

        <a-select v-if="column.filterType === 'select'" v-model="filterConditions[column.dataIndex]"
          :placeholder="`请选择${column.title}`" style="flex: 1; max-width: 200px">
          <a-select-option v-for="(item, index) in getSelectOptions(column.dataIndex)" :key="index" :value="item">
            {{ item }}
          </a-select-option>
        </a-select>

        <a-range-picker v-if="column.filterType === 'date'" v-model="filterConditions[column.dataIndex]"
          style="flex: 1; max-width: 300px" />
      </a-col>

      <!-- 混合筛选控件 -->
      <a-col v-if="mixedFilterColumns.length" style="display: flex; align-items: center" :md="8" :xxl="5">
        <span style="width: 150px; text-align: right; margin-right: 8px;  font-weight: bold">
          {{ mixedFilterTitles }}：
        </span>
        <a-input v-model="mixedFilterValue" placeholder="请输入关键字" style="flex: 1; max-width: 400px" allowClear />
      </a-col>

      <!-- 筛选按钮和清空按钮 -->
      <div v-if="hasFilterOptions" style="margin-bottom: 20px" :md="4" :xxl="5">
        <a-button type="primary" @click="handleFilter" style="margin-right: 8px">筛选</a-button>
        <a-button @click="clearFilters">清空筛选</a-button>
      </div>
    </a-row>

    <!-- 表格 -->
    <a-table 
      bordered 
      :columns="columnsList" 
      :dataSource="filteredDataSourceList" 
      rowKey="id"
      :locale="{ emptyText: '暂无数据' }"
      :pagination="{ 
        showTotal: (total, range) => `共 ${total} 条`,
        showQuickJumper: true
      }"
      class="custom-empty-table"
    >
      <!-- 自定义空状态 -->
      <template slot="emptyText">
        <div style="padding: 64px 0; text-align: center;">
          <a-icon type="inbox" style="font-size: 48px; color: #bbb;" />
          <p style="font-size: 16px; color: #999; margin-top: 16px;">暂无数据</p>
        </div>
      </template>
      <span slot="flowWillAnnounceaction" slot-scope="text, record, index">
        <a @click="announceTask(record)">处理该任务</a>
        <a-divider type="vertical" />
        <a @click="seeHistory(record)">历史</a>
      </span>
      <span slot="flowHistoryaction" slot-scope="text, record, index">
        <a @click="seeHistory(record)">历史</a>
        <a-divider v-if="record.is_export === 'true'" type="vertical" />
        <a v-if="record.is_export === 'true'" @click="download(record)">下载文书</a>
      </span>
      <span slot="review" slot-scope="text, record, index">
        <a @click="review(record)">审核</a>
        <a-divider type="vertical" />
        <a @click="details(record)">详情</a>
      </span>
      <span slot="details" slot-scope="text, record, index">
        <a @click="details(record)">详情</a>
      </span>
      <span slot="flowUseMoneycolumns" slot-scope="text, record, index">
        <a @click="startProcess(record)">申请使用</a>
      </span>
      <span slot="flowChangecolumns" slot-scope="text, record, index">
        <a @click="startFixedProcess(true, record)">申请存缴方式变更</a>
      </span>
      <span slot="flowBackPaycolumns" slot-scope="text, record, index">
        <a @click="urge(record)" v-if="['承办人员', '业务分管', '人社分管'].some(role => userInfo.roleNames.includes(role))">催缴</a>
        <a @click="startProcess(record)" v-if="['施工企业', '管理员'].some(role => userInfo.roleNames.includes(role))">补缴</a>
      </span>
      <span slot="flowExtendcolumns" slot-scope="text, record, index">
        <a @click="urge(record)" v-if="['承办人员', '业务分管', '人社分管'].some(role => userInfo.roleNames.includes(role))">预警</a>
        <a @click="startProcess(record)"
          v-if="['施工企业', '管理员'].some(role => userInfo.roleNames.includes(role))">更换保函/延长有效期</a>
      </span>
      <span slot="flowReturncolumns" slot-scope="text, record, index">
        <a @click="startProcess(record)">申请返还</a>
      </span>
    </a-table>
  </div>
</template>

<script>
import { nw_getAllData } from '@api/newWorkApi'
import { taskStateMapping } from '../taskStateMapping'
import axios from 'axios'

export default {
  name: 'commonTable',
  props: {
    configurationParameter: {
      type: Object,
      default: () => { },
    },
    announceTask: {
      type: Function,
      default: () => { },
    },
    seeHistory: {
      type: Function,
      default: () => { },
    },
    startProcess: {
      type: Function,
      default: () => { },
    },
    startFixedProcess: {
      type: Function,
      default: () => { },
    },
    download: {
      type: Function,
      default: () => { },
    },
    userInfo: {
      type: Object,
      default: () => { },
    },
    urge: {
      type: Function,
      default: () => { },
    },
    review: {
      type: Function,
      default: () => { },
    },
    details: {
      type: Function,
      default: () => { },
    },
  },
  data() {
    return {
      dataSourceList: [], // 原始数据
      registrationDataList: [], // 注册接口返回的原始数据
      filteredDataSourceList: [], // 筛选后的数据
      columnsList: [], // 表格列配置
      filterConditions: {}, // 存储筛选条件
      mixedFilterValue: '', // 混合筛选的输入框值
      dataSource: 'registration', // 当前使用的数据源：'registration'或'all'
    }
  },
  created() {
    // 确保columnsList在创建组件时就有值，防止表头消失
    if (this.configurationParameter && this.configurationParameter.columnsData) {
      this.columnsList = this.configurationParameter.columnsData
        .filter(column => column.show)
        .map(column => {
          const { dataLocation, show, filterType, ...rest } = column;
          return rest;
        });
    }
  },
  computed: {
    // 判断是否有筛选项
    hasFilterOptions() {
      return this.configurationParameter.columnsData.some((column) => column.filterType)
    },
    // 筛选出 filterType 为 mixedInput 的列
    mixedFilterColumns() {
      return this.configurationParameter.columnsData.filter((column) => column.filterType === 'mixedInput')
    },
    // 拼接混合筛选框的标题
    mixedFilterTitles() {
      return this.mixedFilterColumns.map((column) => column.title).join('/')
    },
  },
  methods: {
    // 获取表格数据并初始化
    async getAllList() {
      // 先设置数据源类型为all
      this.dataSource = 'all'

      let params = {
        ...this.configurationParameter.inquire,
      }
      try {
        const res = await nw_getAllData('generalList/getAllList', params)

        // 处理可能的空响应
        if (!res || !res.result || !res.result.dataList) {
          console.warn('getAllList接口未返回有效数据，但仍保留表格列配置')
          
          // 即使没有数据，也要生成columnsList
          const columnsList = this.configurationParameter.columnsData
            .filter((column) => column.show)
            .map((column) => {
              const { dataLocation, show, filterType, ...rest } = column
              return rest
            })
          
          // 更新columnsList
          this.columnsList = columnsList
          this.dataSourceList = []
          this.filteredDataSourceList = []
          return []
        }

        // 过滤掉 allData 为空的脏数据
        const validDataList = res.result.dataList.filter((dataItem) => {
          return dataItem.allData && Object.keys(dataItem.allData).length > 0 // 只有 allData 不为空对象时才保留
        })
        console.log('getAllList过滤之后的数据', validDataList)

        // 即使没有有效数据，也要生成columnsList
        const columnsList = this.configurationParameter.columnsData
          .filter((column) => column.show)
          .map((column) => {
            const { dataLocation, show, filterType, ...rest } = column
            return rest
          })
        
        // 更新columnsList
        this.columnsList = columnsList
        
        // 如果没有有效数据，提前返回空数组
        if (!validDataList.length) {
          console.warn('getAllList过滤后无有效数据，但仍保留表格列配置')
          this.dataSourceList = []
          this.filteredDataSourceList = []
          return []
        }

        // 遍历 dataList 生成 dataSourceList
        const dataSourceList = validDataList.map((dataItem) => {
          const item = {}
          // 流程基本值
          item.processName = dataItem.processName
          item.taskId = dataItem.taskId
          item.processId = dataItem.processId
          item.processInstanceId = dataItem.processInstanceId
          item.processHisInstanceId = dataItem.processHisInstanceId
          // 某些流程需要取下面这些值
          if (dataItem.allData.main_payment) { // 确保main_payment存在
            item.depositWay = dataItem.allData.main_payment.deposit_way // 保证金存缴方式
          }
          item.flag = dataItem.flag // 用于判断是否是撤回的任务

          // 处理前置流程 id
          const processMainTable = dataItem.processMainTable
          const processMainKey = dataItem.processMainKey
          item.frontId = dataItem.allData?.[processMainTable]?.[processMainKey] || null // 该流程的前置流程 id

          // 遍历 columnsData 来生成 dataSource
          this.configurationParameter.columnsData.forEach((column) => {
            if (column.dataLocation) {
              // 判断 dataLocation 是否存在，并提取数据
              const keys = column.dataLocation.split('.')
              let value = dataItem
              keys.forEach((key) => {
                value = (value && value[key] !== undefined) ? value[key] : null
              })
              // 特殊处理 nodeName
              if (column.dataLocation === 'nodeName') {
                const dataType = dataItem.dataType // 获取 dataType 值,来判断流程是否已完成或者已终止
                if (dataType === 'complete') {
                  value = '已完成'
                } else if (dataType === 'cancel') {
                  value = '已终止'
                } else {
                  // 映射 nodeName 值
                  value = taskStateMapping[value] || value
                }
              }
              item[column.dataIndex] = value
            }
          })
          return item
        })

        // 更新 dataSourceList
        this.dataSourceList = dataSourceList

        // 在all数据源时，直接更新filteredDataSourceList
        this.filteredDataSourceList = [...dataSourceList]

        console.log('getAllList - 数据源: all, 数据:', this.dataSourceList)
        console.log('getAllList - 列表配置:', this.columnsList)

        // 生成 dataSourceList 后添加以下代码
        if (this.configurationParameter.filterFunction) {
          this.dataSourceList = this.configurationParameter.filterFunction(this.dataSourceList);
          this.filteredDataSourceList = [...this.dataSourceList];
        }

        console.log('getAllList - 筛选后的显示数据:', this.filteredDataSourceList)
        return this.dataSourceList
      } catch (error) {
        console.error('getAllList获取数据失败：', error)
        
        // 错误处理：确保即使出错也会保留表头
        const columnsList = this.configurationParameter.columnsData
          .filter((column) => column.show)
          .map((column) => {
            const { dataLocation, show, filterType, ...rest } = column
            return rest
          })
        
        // 更新columnsList
        this.columnsList = columnsList
        this.dataSourceList = []
        this.filteredDataSourceList = []
        return []
      }
    },

    // 从注册列表获取数据
    async getRegistrationList() {
      // 先设置数据源类型为registration
      this.dataSource = 'registration'

      let params = {
        ...this.configurationParameter.inquire,
      }

      try {
        console.log('发送请求到registration/list接口，参数:', params)
        // 添加跨域头和超时设置
        let config = {
          params,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          timeout: 10000
        }

        let res;
        try {
          // 尝试使用axios
          res = await axios.get('http://139.199.159.36:37192/registration/list', config)
        } catch (axiosError) {
          console.warn('axios请求失败，尝试使用this.$http方式', axiosError)
          try {
            // 尝试使用Vue实例的$http
            res = await this.$http.get('http://139.199.159.36:37192/registration/list', config)
          } catch (httpError) {
            console.warn('this.$http方式失败，尝试使用fetch', httpError)
            // 尝试使用fetch API
            const fetchRes = await fetch('http://139.199.159.36:37192/registration/list?' + new URLSearchParams(params).toString(), {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              }
            })
            res = { data: await fetchRes.json() }
          }
        }

        console.log('注册列表接口响应数据:', res.data)

        // 如果API响应成功但没有数据，尝试使用getAllList获取数据
        if (!res.data || !res.data.success) {
          console.warn('注册列表接口未返回有效数据，将使用getAllList方法')
          return this.getAllList()
        }

        // 从正确的嵌套结构中提取records数据
        const records = res.data.result.records || []
        
        // 即使没有记录数据，也要保证生成columnsList
        // 这样即使表格数据为空，表头也能显示
        const columnsList = this.configurationParameter.columnsData
          .filter((column) => column.show)
          .map((column) => {
            const { dataLocation, show, filterType, ...rest } = column
            return rest
          })

        // 更新columnsList，不管有没有数据都执行这一步
        this.columnsList = columnsList
        
        if (!records.length) {
          console.warn('注册列表接口未返回记录数据，但仍保留表格列配置')
          this.registrationDataList = []
          this.filteredDataSourceList = []
          return []
        }

        // 遍历数据生成registrationDataList
        const registrationDataList = records.map((dataItem) => {
          const item = {}

          // 基本信息
          item.id = dataItem.id
          item.userName = dataItem.username
          item.companyName = dataItem.companyName
          item.creditCode = dataItem.creditCode
          item.representative = dataItem.representative
          item.createDate = dataItem.createTime

          // 根据status值设置不同的状态文本
          if (dataItem.status === 0) {
            item.nodeName = '待审核'
          } else if (dataItem.status === 1) {
            item.nodeName = '审核通过'
          } else if (dataItem.status === 2) {
            item.nodeName = '审核未通过'
          } else {
            item.nodeName = '未知状态'
          }

          item.is_export = 'false' // 默认不允许导出

          // 保存原始数据，可能在某些场景下需要
          item.rawData = dataItem

          return item
        })

        // 更新registrationDataList
        this.registrationDataList = registrationDataList

        // 在registration数据源时，直接更新filteredDataSourceList
        this.filteredDataSourceList = [...registrationDataList]

        console.log('getRegistrationList - 数据源: registration, 数据:', this.registrationDataList)
        console.log('getRegistrationList - 列表配置:', this.columnsList)

        // 应用筛选函数（如果有）
        if (this.configurationParameter.filterFunction) {
          this.registrationDataList = this.configurationParameter.filterFunction(this.registrationDataList)
          this.filteredDataSourceList = [...this.registrationDataList]
        }

        console.log('getRegistrationList - 筛选后的显示数据:', this.filteredDataSourceList)
        return this.registrationDataList
      } catch (error) {
        console.error('getRegistrationList获取数据失败：', error)
        console.warn('将使用getAllList方法作为备选')
        // 如果请求失败，尝试使用getAllList
        return this.getAllList()
      }
    },

    // 获取 select 下拉选项的方法
    getSelectOptions(dataIndex) {
      const column = this.columnsList.find(col => col.dataIndex === dataIndex);
      // 如果列标题是"状态"，返回固定选项
      if (column && column.title === '状态') {
        // 如果当前数据源是registration，使用新的状态选项
        if (this.dataSource === 'registration') {
          return ['全部', '待审核', '审核通过', '审核未通过'];
        }
        // 否则使用原来的状态选项
        return ['全部', '进行中', '已完成', '已终止'];
      }

      // 根据当前数据源选择正确的数据列表
      const sourceData = this.dataSource === 'registration' ? this.registrationDataList : this.dataSourceList;

      // 动态生成选项
      const uniqueValues = new Set(sourceData.map((item) => item[dataIndex]));
      return Array.from(uniqueValues).filter((value) => value !== undefined && value !== null);
    },

    // 筛选方法
    async handleFilter() {
      try {
        console.log('开始筛选，当前数据源：', this.dataSource)

        // 获取最新数据
        if (this.dataSource === 'registration') {
          await this.getRegistrationList()
          // 筛选注册数据
          this.filteredDataSourceList = this.registrationDataList.filter(item => this.filterItem(item))
        } else {
          await this.getAllList()
          // 筛选流程数据
          this.filteredDataSourceList = this.dataSourceList.filter(item => this.filterItem(item))
        }

        // 应用额外的筛选函数（如果有）
        if (this.configurationParameter.filterFunction) {
          this.filteredDataSourceList = this.configurationParameter.filterFunction(this.filteredDataSourceList);
        }

        console.log('筛选后的数据：', this.filteredDataSourceList)
      } catch (error) {
        console.error('筛选数据失败：', error)
      }
    },

    // 筛选单个项目
    getSelectOptions(dataIndex) {
      const column = this.columnsList.find(col => col.dataIndex === dataIndex);
      // 如果列标题是"状态"，返回固定选项
      if (column && column.title === '状态') {
        return ['全部', '进行中', '已完成', '已终止'];
      }
      // 否则动态生成选项
      const uniqueValues = new Set(this.dataSourceList.map((item) => item[dataIndex]));
      return Array.from(uniqueValues).filter((value) => value !== undefined && value !== null);
    },

    // 筛选方法
    async handleFilter() {
      try {
        await this.getAllList()
        // 在数据更新后执行筛选逻辑
        this.filteredDataSourceList = this.dataSourceList.filter((item) => {
          const basicFilter = Object.keys(this.filterConditions).every((key) => {
            const filterValue = this.filterConditions[key]
            if (!filterValue) return true // 如果没有筛选条件，默认不过滤

            const column = this.configurationParameter.columnsData.find((col) => col.dataIndex === key)
            const itemValue = item[key]

            if (column.filterType === 'input') {
              // 输入框模糊匹配
              return itemValue && itemValue.toString().includes(filterValue.toString())
            } else if (column.filterType === 'select') {
              // 当列标题为状态时特殊处理
              if (column.title && column.title === '状态') {
                if (filterValue === '已完成') {
                  return itemValue === '已完成';
                } else if (filterValue === '已终止') {
                  return itemValue === '已终止';
                } else if (filterValue === '全部') {
                  return true;
                } else if (filterValue === '进行中') {
                  return itemValue !== '已完成' && itemValue !== '已终止';
                }
              }
              // 下拉框完全匹配（非状态列的处理）
              return itemValue === filterValue
            } else if (column.filterType === 'date') {
              // 日期范围筛选
              if (!Array.isArray(filterValue) || filterValue.length !== 2) return true
              const [startDate, endDate] = filterValue
              const itemDate = new Date(itemValue).getTime()
              return itemDate >= new Date(startDate).getTime() && itemDate <= new Date(endDate).getTime()
            }

            return true // 如果没有匹配到类型，则默认不过滤
          })

          // 混合条件筛选
          const mixedFilter = this.mixedFilterColumns.some((column) => {
            const itemValue = item[column.dataIndex]
            return itemValue && itemValue.toString().toLowerCase().includes(this.mixedFilterValue.toLowerCase())
          })

          // 过滤出同时满足普通条件和混合筛选条件的数据
          return basicFilter && (!this.mixedFilterValue || mixedFilter)
        })

        if (this.configurationParameter.filterFunction) {
          this.filteredDataSourceList = this.configurationParameter.filterFunction(this.filteredDataSourceList);
        }

        console.log('筛选后的数据：', this.filteredDataSourceList)
      } catch (error) {
        console.error('获取数据失败：', error)
      }
    },

    // 清空筛选条件
    clearFilters() {
      console.log('清空筛选条件，当前数据源：', this.dataSource)
      this.filterConditions = {}
      this.mixedFilterValue = ''

      // 根据当前数据源重新获取数据
      if (this.dataSource === 'registration') {
        this.getRegistrationList()
      } else {
        this.getAllList()
      }
    },
  },

  mounted() {
    console.log('commonTable mounted, 初始化数据获取')

    // 检查configurationParameter中的inquire参数，判断应该使用哪个数据源
    const inquire = this.configurationParameter.inquire || {}

    // 如果有processIdList或categoryId参数，说明是flowRegister相关的流程数据，使用getAllList
    if (inquire.processIdList || inquire.categoryId) {
      console.log('检测到流程相关参数，使用getAllList获取数据')
      this.getAllList()
    } else {
      // 否则，尝试使用getRegistrationList
      console.log('无流程相关参数，尝试使用getRegistrationList获取数据')
      this.getRegistrationList().catch(() => {
        console.warn('从registration获取数据失败，尝试使用getAllList')
        this.getAllList()
      })
    }
  },
}
</script>

<style scoped>
.custom-empty-table >>> .ant-table-placeholder {
  padding: 80px 0;
}

.custom-empty-table >>> .ant-empty-normal {
  margin: 32px 0;
}

.custom-empty-table >>> .ant-empty-normal .ant-empty-image {
  height: 60px;
}

.custom-empty-table >>> .ant-empty-description {
  font-size: 16px;
  color: #999;
}
</style>