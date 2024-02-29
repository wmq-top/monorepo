<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import { Table } from 'ant-design-vue'

const tableRef = shallowRef()
const tableData = ref([] as any)
const startIndex = ref(0)
const vEle = ref()

const columns = ref([
  {
    title: 'Full Name',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    fixed: 'left',
  },
  {
    title: 'Column 1',
    dataIndex: 'address',
    key: '1',
  },
  {
    title: 'Column 2',
    dataIndex: 'address',
    key: '2',
  },
  {
    title: 'Column 3',
    dataIndex: 'address',
    key: '3',
  },
])
for (let i = 0; i < 100; i++) {
  tableData.value.push({
    key: i,
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  })
}

onMounted(() => {
  vEle.value = document.createElement('div')
  vEle.value.style.position = 'absolute'
  tableRef.value.$el.querySelector('.ant-table-body').style.position = 'relative'
  tableRef.value.$el.querySelector('.ant-table-body').appendChild(vEle.value)
})
// const sliceTable = computed(() => {
//   return tableData.value.slice(startIndex.value, startIndex.value + 9)
// })

// onBeforeMount(() => {
//   // 创建一个空元素，这个空元素用来撑开 table 的高度，模拟所有数据的高度
//   vEle.value = document.createElement('div')
//   loadData()
// })
// onMounted(() => {
//   console.log(tableRef.value.$el.querySelector('.ant-table-tbody'))
//   tableRef.value.$el
//     .querySelector('.ant-table-body')
//     .addEventListener('scroll', tableScroll, {
//       passive: false,
//     })
//   nextTick(() => {
//     // 设置成绝对定位，这个元素需要我们去控制滚动
//     tableRef.value.$el.querySelector('.ant-table-tbody').style.position = 'absolute'
//     // 计算表格所有数据所占内容的高度
//     vEle.value.style.height = `${tableData.value.length * 48}px`
//     // 把这个节点加到表格中去，用它来撑开表格的高度
//     // tableRef.value.$el.querySelector('.ant-table-body').appendChild(vEle.value)
//   })
// })

function loadData() {
  for (let i = 0; i < 100; i++) {
    tableData.value.push({
      key: i,
      name: `Edrward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
    })
  }
}

function tableScroll() {
  const bodyWrapperEle = tableRef.value.$el.querySelector('.ant-table-body')
  // 滚动的高度
  const scrollTop = bodyWrapperEle.scrollTop
  // 下一次开始的索引
  startIndex.value = Math.floor(scrollTop / 48)
  // 滚动操作
  // bodyWrapperEle.querySelector('.ant-table-tbody').style.transform = `translateY(${startIndex.value * 48}px)`
}
</script>

<template>
  <div>
    <div>
      <Table
        ref="tableRef"
        border
        :scroll="{ x: 'max-content', y: 418 }"
        :data-source="tableData"
        :columns="columns"
        :row-key="(row:any) => row.id"
      />
    </div>
  </div>
</template>
