import { defineComponent, PropType, TransitionGroup, ref, watch, computed } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { Tooltip } from 'ant-design-vue'
import { MenuOutlined, CloseOutlined, CaretDownOutlined, CaretRightOutlined,
  MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import type { CustomColumnsType } from './table-column-config-types'
import './table-columns-config-style.less'

const colSettingProps = {
  allColumns: {
    type: Array as PropType<CustomColumnsType[]>,
    default: [],
  },
  activeList: {
    type: Object as PropType<Record<string, string[]>>,
    default: {},
  },
  safeActiveProps: {
    type: Array as PropType<CustomColumnsType[]>,
    default: [],
  },
}

const DraggableList = defineComponent({
  name: 'DraggableList',
  props: colSettingProps,
  emits: {
    delete: (columns: string, dataIndex: string) => true,
  },
  // eslint-disable-next-line max-lines-per-function
  setup(props, { emit, expose }) {
    const allColumnsRef = ref<CustomColumnsType[]>([])

    const propActiveRef = ref<Record<string, string[]>>({})

    const groupItemRef = ref<Record<string, CustomColumnsType[]>>({})

    const flatActiveColumns = ref<string[]>([])

    const getMixData = (sourceArr: CustomColumnsType[], activeArr: string[]): CustomColumnsType[] =>
      sourceArr.filter((item: CustomColumnsType) => activeArr?.includes(item.dataIndex))

    const effectiveColumns = computed(() =>
      allColumnsRef.value.filter(item => item?.children?.length !== 0))

    const collapseRef = ref<Record<string, boolean>>({})

    function changeGroupItemRef() {
      effectiveColumns.value.forEach((item: CustomColumnsType) => {
        groupItemRef.value[item?.groupName || '基本配置'] = item.children!
      })
    }

    function eleOndrag(e: any) {
      e.target!.style.fontWeight = '800'
      e.target!.style.color = '#1890ff'
      e.target!.style.backgroundColor = '#ffffff'
    }

    function eleEndDrag(e: any) {
      e.target!.style.fontWeight = '400'
      e.target!.style.color = 'black'
      e.target!.style.backgroundColor = null
    }

    function deleteColumns(group: string, dataIndex: string) {
      emit('delete', group, dataIndex)
    }

    function getFinalData() {
      const finalColumns = allColumnsRef.value.filter(item => {
        if (item.children && item.children.length !== 0) {
          item.children = groupItemRef.value[item.groupName || '基本配置']
            .filter(data => flatActiveColumns.value?.includes(data.dataIndex))

          return item.children.length > 0
        } else {
          return flatActiveColumns.value?.includes(item.dataIndex)
        }
      })

      return {
        finalColumns,
        finalData: finalColumns.map(item => {
          if (item.children && item.children.length !== 0) {
            return {
              dataIndex: item.dataIndex,
              children: item.children.map(i => ({ dataIndex: i.dataIndex })),
            }
          }

          return {
            dataIndex: item.dataIndex,
          }
        }),
      }
    }

    expose({
      getFinalData,
    })

    function generateCollapseRef(columns: CustomColumnsType[]) {
      columns.forEach(item => {
        if (item.children && item.children.length !== 0) {
          collapseRef.value[item.groupName || '基本配置'] = true
        }
      })
    }
    function triggerCollapse(groupName: string, bool: boolean) {
      collapseRef.value[groupName] = bool
    }
    watch(() => props.allColumns, () => {
      // 通过assign方法消除响应式
      allColumnsRef.value = JSON.parse(JSON.stringify(props.allColumns))
      generateCollapseRef(allColumnsRef.value)
      changeGroupItemRef()
    }, {
      immediate: true,
      deep: true,
    })

    function sortForArr(source: CustomColumnsType[], sortArr: CustomColumnsType[]): CustomColumnsType[] {
      const result = new Array(source.length).fill(0)

      source.forEach((item, index) => {
        if (sortArr.findIndex(data => data.dataIndex === item.dataIndex) === -1) {
          result[index] = item
        }
      })
      let i = 0

      sortArr.forEach(item => {
        while (result[i] !== 0 && i <= result.length) {
          i++
        }
        const groupItem = source.find(data => data.dataIndex === item.dataIndex)

        if (groupItem?.children && groupItem.children.length !== 0) {
          result[i] = { ...groupItem, children: sortForArr(groupItem.children, item.children!) }
        } else {
          result[i] = groupItem
        }
        i++
      })

      return result.filter((item: CustomColumnsType) => item)
    }

    function triggerCollapseAll(bool: boolean) {
      Object.keys(collapseRef.value).forEach(key => {
        collapseRef.value[key] = bool
      })
    }

    watch(() => props.safeActiveProps, () => {
      allColumnsRef.value = sortForArr(allColumnsRef.value, props.safeActiveProps)
      changeGroupItemRef()
    }, {
      immediate: true,
      deep: true,
    })

    watch(() => props.activeList, () => {
      propActiveRef.value = JSON.parse(JSON.stringify(props.activeList))
      flatActiveColumns.value = []
      Object.keys(propActiveRef.value).forEach(item => {
        flatActiveColumns.value.push(...propActiveRef.value[item])
      })
    }, {
      immediate: true,
      deep: true,
    })

    return () =>
      <div class={'drag-area-content'}>
        <div class={'operate-icon-list'}>
          <Tooltip placement={'right'} title={'展开全部'}>
            <MenuUnfoldOutlined title={'展开全部'} class={'operate-all-icon'} onClick={() => triggerCollapseAll(true)} />
          </Tooltip>
          <span>拖拽排序</span>
          <Tooltip placement={'left'} title={'折叠全部'}>
            <MenuFoldOutlined class={'operate-all-icon'} onClick={() => triggerCollapseAll(false)}/>
          </Tooltip>
        </div>
        <div class={'drag-area-content-item'}>
        <VueDraggableNext list={allColumnsRef.value || []}>
          <TransitionGroup>
            {allColumnsRef.value.map(element => {
              if (propActiveRef.value[element.groupName || '基本配置']?.includes(element.dataIndex) && !element.alwaysShow) {
                return <div key={element.dataIndex} class={'list-item'} onDragstart={eleOndrag} onDragend={eleEndDrag}>
                  <MenuOutlined class={'drag-grip-icon'} />{element.title}<CloseOutlined class={'close-icon'}
                  onClick={() => deleteColumns(element.groupName || '基本配置', element.dataIndex)}/></div>
              } else if (element.children && element.children.length !== 0 &&
                 getMixData(element.children, propActiveRef.value[element.groupName!]).length > 0) {
                return <div key={element.dataIndex}
                class={`list-group-item ${collapseRef.value[element.groupName || '基本配置'] ? '' : 'collapse-group'}`}
                onDragstart={eleOndrag} onDragend={eleEndDrag}>
                <MenuOutlined class={'drag-grip-icon'} />{element.title}
                {collapseRef.value[element.groupName || '基本配置'] &&
                <CaretDownOutlined class={'expand-icon'} onClick={() => triggerCollapse(element.groupName!, false)}/>}
                {!collapseRef.value[element.groupName || '基本配置'] &&
                <CaretRightOutlined class={'expand-icon'} onClick={() => triggerCollapse(element.groupName!, true)}/>}
                  <VueDraggableNext list={groupItemRef.value[element.groupName!] || []}>
                    <TransitionGroup>
                      {groupItemRef.value[element.groupName! || '基本配置'].map(subItem => {
                        if (propActiveRef.value[element.groupName! || '基本配置']?.includes(subItem.dataIndex) &&
                        !subItem.alwaysShow) {
                          return <div class={'list-sub-item'} key={subItem.dataIndex}
                          onDragstart={eleOndrag} onDragend={eleEndDrag}>
                          <MenuOutlined class={'drag-grip-icon'} />{subItem.title}
                          <CloseOutlined class={'close-icon'}
                          onClick={() => deleteColumns(element.groupName || '基本配置', subItem.dataIndex)}/></div>
                        } else {
                          return <div key={subItem.dataIndex}></div>
                        }
                      })}
                    </TransitionGroup>
                  </VueDraggableNext>
                </div>
              } else {
                return <div key={element.dataIndex}></div>
              }
            })}
          </TransitionGroup>
        </VueDraggableNext>
        </div>

      </div>
  },
})

export { DraggableList }
