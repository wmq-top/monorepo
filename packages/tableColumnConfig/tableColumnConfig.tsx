import type { PropType } from 'vue'
import { defineComponent, ref, toRefs, watch, watchEffect } from 'vue'
import {
  Button, Card, Checkbox,
  CheckboxGroup, Col, Divider,
  Input, Modal,
  Row,
} from 'ant-design-vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import type { CustomColumnsType, CustomListType } from './table-column-config-types'
import { DraggableList } from './draggableList'
import './table-columns-config-style.less'

const colSettingProps = {
  allColumns: {
    type: Array as PropType<CustomColumnsType[]>,
    default: [],
  },
  activeColumns: {
    type: Array as PropType<CustomColumnsType[]>,
    default: [],
  },
  defaultColumns: {
    type: Array as PropType<CustomColumnsType[]>,
    default: [],
  },
  visable: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  customListTitle: {
    type: String as PropType<string>,
    default: '',
  },
  customList: {
    type: Object as PropType<CustomListType>,
    default: [],
  },
}

const ColumnsSetting = defineComponent({
  name: 'ColumnsSetting',
  props: colSettingProps,
  emits: {
    confirm: (data: any, columns: any) => true,
    save: (data: any, columns: any) => true,
    close: () => true,
  },

  setup(props, { emit, expose, slots }) {
    const { visable } = toRefs(props)
    const searchValue = ref<string>()

    const dragSortRef = ref()

    const columnsDetailMap = ref<Map<string, CustomColumnsType>>(new Map())

    // 获取所有的key所在哪个分组的Map映射
    const keyInGroupMap = ref<Map<string, string>>(new Map())
    const alwaysShowList = ref<Record<string, string[]>>({})

    const groupOptionsList = ref<Record<string, CustomColumnsType[]>>({})

    // 当前组是否被全选 key: boolean
    const checkAllList = ref<Record<string, boolean>>({} as Record<string, boolean>)
    // 当前组的全选状态是否确定
    const indeterminateList = ref<Record<string, boolean>>({} as Record<string, boolean>)

    const safeActiveProps = ref<CustomColumnsType[]>([])

    // 生成所有节点key到详情的映射
    function onAllColumnsChange(columns: CustomColumnsType[]) {
      columns.forEach((item) => {
        columnsDetailMap.value.set(item.dataIndex, item)
      })

      const dfs = (column: CustomColumnsType[], groupName: string | null) => {
        column.forEach((item) => {
          const currentGroup = item.groupName || groupName || '基本配置'

          // 如果不是子节点则向下递归
          if (item.children && item.children.length !== 0) {
            dfs(item.children, currentGroup)
            // 如果是叶子点则直接将其添加到选项分组中
          }
          else {
            keyInGroupMap.value.set(item.dataIndex, currentGroup)

            const currentGroupOptions = groupOptionsList.value[currentGroup] || []

            groupOptionsList.value[currentGroup] = [...currentGroupOptions, item]
            if (item.alwaysShow)
              alwaysShowList.value[currentGroup].push(item.dataIndex)
          }
        })
      }

      dfs(columns, null)
    }

    const groupCheckedList = ref<Record<string, string[]>>({})

    // 初始化所有的分组为默认空值做v-model
    function buildGroupListAndOptions(columns: CustomColumnsType[]) {
      columns.forEach((item) => {
        groupCheckedList.value[item.groupName || '基本配置'] = []
        groupOptionsList.value[item.groupName || '基本配置'] = []
        checkAllList.value[item.groupName || '基本配置'] = false
        indeterminateList.value[item.groupName || '基本配置'] = false
        alwaysShowList.value[item.groupName || '基本配置'] = []
      })
    }

    // 当某一组的勾选全部被选中
    function onCheckAllChange(key: string, e: any) {
      if (e.target.checked) {
        const checkedList = groupOptionsList.value[key]!.map(item => item.dataIndex)

        groupCheckedList.value[key] = checkedList
      }
      else {
        groupCheckedList.value[key] = groupOptionsList.value[key]!.filter(item => item.alwaysShow).map(i => i.dataIndex)
      }

      indeterminateList.value[key] = false
    }

    watch(() => props.allColumns, () => {
      buildGroupListAndOptions(props.allColumns)
      onAllColumnsChange(props.allColumns)
    }, {
      immediate: true,
      deep: true,
    })

    const customCheckboxList = ref<Record<string, CustomListType>>({})
    // customCheckBox 的选中和半选状态切换
    const customCheckboxStatus = ref<Record<string, { checked: boolean; halfChecked: boolean }>>({})

    function onCheckedGroupChange(effectColumns: string[], bool: boolean) {
      if (bool) {
        effectColumns.forEach((item) => {
          const group = keyInGroupMap.value.get(item)!
          const currentGroupSelectSet = new Set(groupCheckedList.value[group])

          currentGroupSelectSet.add(item)

          // 保持原顺序的重置新的选中列
          groupCheckedList.value[group] = groupOptionsList.value[group]
            .filter(colItem => currentGroupSelectSet.has(colItem.dataIndex)).map(i => i.dataIndex)
        })
      }
      else if (!bool) {
        effectColumns.forEach((item) => {
          const group = keyInGroupMap.value.get(item)!
          const currentGroupSelectSet = new Set(groupCheckedList.value[group])

          currentGroupSelectSet.delete(item)

          groupCheckedList.value[group] = groupOptionsList.value[group]
            .filter(colItem => currentGroupSelectSet.has(colItem.dataIndex)).map(i => i.dataIndex)
        })
      }
    }

    function setCustomList(customList: Record<string, CustomListType>) {
      customCheckboxList.value = customList
      Object.values(customList).forEach((data: any) => {
        customCheckboxStatus.value[data.key] = { checked: false, halfChecked: false }
      })
    }

    watch(() => props.customList, () => {
      setCustomList(props.customList as any)
    }, {
      immediate: true,
    })

    watchEffect(() => {
      Object.keys(groupCheckedList.value).forEach((key) => {
        indeterminateList.value[key]
        = Boolean(groupCheckedList.value[key]?.length)
        && groupCheckedList.value[key]?.length < groupOptionsList.value[key].length

        checkAllList.value[key] = groupCheckedList.value[key]?.length === groupOptionsList.value[key].length
      })
    })

    function mergeCheckAndOptions(target: string[], options: string[]): { checked: boolean; halfChecked: boolean } {
      const result = {
        checked: false,
        halfChecked: false,
      }

      if (target.every(item => options.includes(item))) {
        result.checked = true
        result.halfChecked = false

        return result
      }
      else if (target.some(item => options.includes(item))) {
        result.checked = false
        result.halfChecked = true

        return result
      }

      return result
    }

    function updateCheckboxStatus() {
      const allCheckBox: any[] = []

      Object.values(groupCheckedList.value).forEach((item) => {
        allCheckBox.push(...item)
      })
      Object.values(customCheckboxList.value).forEach((data: any) => {
        customCheckboxStatus.value[data.key] = mergeCheckAndOptions(data.subColumns, allCheckBox)
      })
    }

    watch(() => groupCheckedList.value, () => {
      updateCheckboxStatus()
    }, {
      deep: true,
    })

    // activeColumns参数变化时生成的 activeColumnsList
    const propsActiveList = ref<Record<string, string[]>>({} as Record<string, string[]>)
    // defaultColumns参数变化时生成的 defaultColumnsList
    const propsDefaultList = ref<Record<string, string[]>>({} as Record<string, string[]>)

    const setPropsCols = (columns: CustomColumnsType[], type: 'default' | 'active') => {
      const dfs = (column: CustomColumnsType[], key: string | undefined) => {
        if (!column || column.length === 0)
          return

        column.forEach((columnItem: CustomColumnsType) => {
          const currentKey = key || columnItem?.groupName || '基本配置'

          if (!columnItem.children || columnItem.children?.length === 0) {
            if (type === 'active') {
              if (propsActiveList.value[currentKey])
                propsActiveList.value[currentKey].push(columnItem.dataIndex)
              else
                propsActiveList.value[currentKey] = [columnItem.dataIndex]
            }
            else if (type === 'default') {
              if (propsDefaultList.value[currentKey])
                propsDefaultList.value[currentKey].push(columnItem.dataIndex)
              else
                propsDefaultList.value[currentKey] = [columnItem.dataIndex]
            }
          }
          else {
            dfs(columnItem.children, columnItem.groupName)
          }
        })
      }

      dfs(columns, undefined)
    }

    function mergeActiveAndSelect() {
      Object.keys(groupCheckedList.value).forEach((key) => {
        groupCheckedList.value[key] = Array.from(new Set([
          ...alwaysShowList.value[key] || [],
          ...propsActiveList.value[key] || []]))
      })
    }

    watch(() => props.activeColumns, () => {
      // 安全过滤 如果当前的active不包含在total内说明其为过期数据，直接将其过滤掉
      const safeActiveColumns = props.activeColumns.filter(item =>
        keyInGroupMap.value.has(item.dataIndex) || (item.children && item.children.length !== 0)).map(i => ({
        ...i,
        children: i.children?.filter(data => keyInGroupMap.value.has(data.dataIndex)),
      }))

      safeActiveProps.value = safeActiveColumns

      setPropsCols(safeActiveColumns, 'active')
      mergeActiveAndSelect()
    }, {
      immediate: true,
      deep: true,
    })

    watch(() => props.defaultColumns, () => {
      // 安全过滤 如果当前的default不包含在total内说明其为过期数据，直接将其过滤掉
      const safeDefaultColumns = props.defaultColumns.filter(item =>
        keyInGroupMap.value.has(item.dataIndex) || (item.children && item.children.length !== 0)).map(i => ({
        ...i,
        children: i.children?.filter(data => keyInGroupMap.value.has(data.dataIndex)),
      }))

      setPropsCols(safeDefaultColumns, 'default')
    }, {
      immediate: true,
      deep: true,
    })

    function cancelModify() {
      emit('close')
    }

    function resetDefaultSelect() {
      Object.keys(groupCheckedList.value).forEach((key) => {
        groupCheckedList.value[key] = Array.from(new Set([
          ...alwaysShowList.value[key] || [],
          ...propsDefaultList.value[key] || []]))
      })
    }

    function deleteActiveColumns(group: string, dataIndex: string) {
      groupCheckedList.value[group] = groupCheckedList.value[group].filter(item => item !== dataIndex)
    }

    function confirmConfig(type: 'save' | 'confirm') {
      const { finalColumns, finalData } = dragSortRef.value.getFinalData() || {}

      if (type === 'save')
        emit('save', finalColumns, finalData)
      else if (type === 'confirm')
        emit('confirm', finalColumns, finalData)
    }
    function getColumnsConfig() {
      const { finalColumns, finalData } = dragSortRef.value?.getFinalData() || {}
      return {
        finalColumns,
        finalData,
      }
    }

    expose({
      getColumnsConfig,
    })

    return () =>
      <Modal
        v-model={[visable.value, 'visible']}
        style={{ width: '70vw', borderRadius: '1rem', overflow: 'hidden', minWidth: '960px', maxWidth: '1080px' }}
        destroyOnClose={true}
        maskClosable={false}
        closable={false}
        footer={null}
        wrapClassName={'columns-reset-modal'}
      >
        <div>
          <div class={'columns-reset-content'}>
            <div class={'left-side-content'}>
              <div class={'columns-reset-title'}>表格设置</div>
              <Input
                class={'columns-reset-search'}
                v-model={[searchValue.value, 'value']}
                placeholder={'请输入搜索条件'}
              >
                {{
                  suffix: () => <SearchOutlined />,
                }}
              </Input>
              {props.customList && Object.values(props.customList).length !== 0 && props.customListTitle
              && <div class={'columns-reset-title'}>{props.customListTitle}</div>}
              {props.customList && Object.values(props.customList).length !== 0
                && <Card class={'columns-card'}>
                  {Object.values(props.customList).map(item =>
                    <Checkbox
                      v-model={[customCheckboxStatus.value[item.key].checked, 'checked']}
                      indeterminate={customCheckboxStatus.value[item.key].halfChecked}
                      onChange={e => onCheckedGroupChange(item.subColumns, e.target.checked)}>
                      {item.title}
                    </Checkbox>)
                  }
                </Card>
              }
              <div class={'columns-reset-title'}>可选列</div>
              <div class={'over-flow-box'}>
                {Object.keys(groupOptionsList.value).map(item =>
                  <Card class={'columns-card'}>
                    <div class={'reset-card-title'}>{item}</div>
                    <Checkbox
                      v-model={[checkAllList.value[item], 'checked']}
                      indeterminate={indeterminateList.value[item]}
                      onChange={e => onCheckAllChange(item, e)}
                    >
                      全选
                    </Checkbox>
                    <Divider class={'zero-margin-divider'} />
                    <CheckboxGroup
                      v-model={[groupCheckedList.value[item], 'value']}
                      class={'filter-column-group'}>
                      <Row style={{ width: '100%' }}>
                        {groupOptionsList.value[item].map(data =>
                          <Col span={8} style={{ margin: '4px 0' }}>
                            <Checkbox
                              value={data.dataIndex}
                              disabled={data.alwaysShow}
                              class={`${(searchValue.value && data.title.includes(searchValue.value))
                                ? 'active-check-box'
: ''}`}
                            >{data.title}</Checkbox>
                          </Col>)}
                      </Row>
                    </CheckboxGroup>
                  </Card>)}
              </div>

            </div>
            <div class={'right-side-content'}>
              <DraggableList
                allColumns={props.allColumns}
                activeList={groupCheckedList.value}
                onDelete={deleteActiveColumns} ref={dragSortRef}
                safeActiveProps={safeActiveProps.value}/>
            </div>
          </div>
          <div class={'columns-reset-button'}>
            <Button class={'columns-reset-button-item'} onClick={cancelModify}>取消</Button>
            <Button class={'columns-reset-button-item'} onClick={resetDefaultSelect}>重置</Button>
            <Button class={'columns-reset-button-item'} type={'primary'}
              onClick={() => confirmConfig('save')}>保存</Button>
            <Button class={'columns-reset-button-item'} type={'primary'}
              onClick={() => confirmConfig('confirm')}>确认</Button>
            {slots && slots.customButton && slots.customButton(getColumnsConfig) }
          </div>
        </div>
      </Modal>
  },
})

export { ColumnsSetting }
