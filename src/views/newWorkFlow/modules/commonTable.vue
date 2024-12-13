<template>
  <a-table bordered :columns="columns" :dataSource="dataSource" rowKey="id">
    <span slot="flowWillAnnounceaction" slot-scope="text, record, index">
      <a @click="announceTask(record)">处理该任务</a>
      <a-divider type="vertical" />
      <a @click="seeHistory(record)">历史</a>
    </span>
    <span slot="flowHistoryaction" slot-scope="text, record, index">
      <a @click="seeHistory(record)">历史</a>
    </span>
  </a-table>
</template>

<script>
export default {
  name: 'commonTable',
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    announceTask: {
      type: Function,
      default: () => {},
    },
    seeHistory: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {}
  },
}
</script>

<style scoped>
</style>