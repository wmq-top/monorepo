import { ref, watch } from 'vue'
import type { CustomColumnsType, DetailType, CustomListType } from './type'

// eslint-disable-next-line max-lines-per-function
function useColumnSetting() {
  // 根据totalColumns 构建生成mapRef作为数据源使用生成全量的数据选项
  const mapRef = ref<Map<string, CustomColumnsType[]>>(new Map())
  // 获取所有的key所在哪个分组的Map映射
  const keyInGroupMap = ref<Map<string, string>>(new Map())
  // 当前组是否被全选 key: boolean
  const checkAllList = ref<Record<string, boolean>>({} as Record<string, boolean>)
  // 当前组的全选状态是否确定
  const indeterminateList = ref<Record<string, boolean>>({} as Record<string, boolean>)
  // 各个分组中始终显示的配置列，在columns中配置了alwaysShow的列将无法通过配置隐藏及调整位置
  const alwaysShowList = ref<Record<string, string[]>>({})
  // 选项列表, 分组后的选项列表
  const optionsList = ref<Record<string, DetailType[]>>({})
  // 详情Map, 为方便使用checkboxGroup的v-model提供一个key到全量值的映射map
  const detailMap = ref<Map<string, DetailType>>(new Map())
  // 核心数据, 整个配置弹窗的选择数据
  const checkedList = ref<Record<string, string[]>>({})
  // 核心数据, 排序后的基本配置列数据（同时绑定与vue-draggable）
  const checkedListSort = ref<DetailType[]>([])
  // 核心数据, 排序后的分组数据（同时绑定与vue-draggable）
  const groupList = ref<{groupName: string}[]>([])
  // activeColumns参数变化时生成的 activeColumnsList
  const propsActiveList = ref<Record<string, string[]>>({} as Record<string, string[]>)
  // defaultColumns参数变化时生成的 defaultColumnsList
  const propsDefaultList = ref<Record<string, string[]>>({} as Record<string, string[]>)
  // const customCheckbox
  const customCheckboxList = ref<Record<string, CustomListType>>({})
  // customCheckBox 的选中和半选状态切换
  const customCheckboxStatus = ref<Record<string, {checked: boolean, halfChecked: boolean}>>({})

  // 根据数据源构建全量的mapRef方法
  const generateSettingMap = (columns: CustomColumnsType[], groupName?: string) => {
    columns.forEach((columnItem: CustomColumnsType) => {
      const currentGroup = groupName || columnItem.groupName || '基本配置'
      const prevData = mapRef.value.get(currentGroup)

      if (prevData) {
        mapRef.value.set(currentGroup, [...prevData, { ...columnItem, groupName: currentGroup }])
      } else {
        mapRef.value.set(currentGroup, [{ ...columnItem, groupName: currentGroup }])
      }
    })
  }
  // 将所有分组中的叶子节点添加到选项列表中并根据其alwaysShow属性配置disabled
  const getAllChildCols = (columns: CustomColumnsType[], key: string): DetailType[] => {
    const result = [] as DetailType[]
    const dfs = (column: CustomColumnsType[]) => {
      if (!column || column.length === 0) {
        return
      }
      column.forEach((columnItem: CustomColumnsType) => {
        if (!columnItem.children || columnItem.children?.length === 0) {
          if (columnItem.alwaysShow) {
            alwaysShowList.value[key].push(columnItem.dataIndex)
          }
          result.push({
            label: columnItem.title,
            value: columnItem.dataIndex,
            disabled: Boolean(columnItem.alwaysShow),
          })
        } else {
          dfs(columnItem.children)
        }
      })
    }

    dfs(columns)

    return result
  }
  // 将选项列表进行分组并初始化所有的数据到初始值
  const generateOptions = () => {
    mapRef.value.forEach((value, key) => {
      checkAllList.value[key] = false
      indeterminateList.value[key] = false
      alwaysShowList.value[key] = []
      optionsList.value[key] = getAllChildCols(value, key)
      checkedList.value[key] = alwaysShowList.value[key]
    })
  }
  // 构建基本配置分组中的key -> item的映射
  const generateKeyToDetailMap = () => {
    optionsList.value['基本配置'].forEach(item => {
      detailMap.value.set(item.value, item)
    })
  }

  // 根据activeColumns构建分组排序数组
  const buildGroupList = (columns: CustomColumnsType[]) => {
    groupList.value = Object.keys(checkedList.value).filter(i => i !== '基本配置').map(data => ({
      groupName: data,
    }))
      .sort((a, b) => columns.findIndex(item => item.groupName === a.groupName) -
      columns.findIndex(item => item.groupName === b.groupName))
  }

  const generateKeyInGroupMap = <T extends Array<CustomColumnsType>>(allColumns: T, groupName: string) => {
    allColumns.forEach(item => {
      const finalGroupName = item.groupName || groupName || '基本配置'

      if (item.children && item.children.length !== 0) {
        generateKeyInGroupMap(item.children, finalGroupName)

        return
      }
      keyInGroupMap.value.set(item.dataIndex, finalGroupName)
    })
  }

  // 在全量的columns数据变化时触发
  const onAllColumnsChange = (allColumns: CustomColumnsType[], activeColumns: CustomColumnsType[]) => {
    mapRef.value = new Map()
    mapRef.value.set('基本配置', [])
    keyInGroupMap.value = new Map()
    generateSettingMap(allColumns)
    generateOptions()
    generateKeyToDetailMap()
    buildGroupList(activeColumns)
    generateKeyInGroupMap(allColumns, '')
  }

  // 生成当前激活的列和默认配置列
  const setPropsCols = (columns: CustomColumnsType[], type: 'default' | 'active') => {
    const dfs = (column: CustomColumnsType[], key: string | undefined) => {
      if (!column || column.length === 0) {
        return
      }
      column.forEach((columnItem: CustomColumnsType) => {
        const currentKey = key || columnItem?.groupName || '基本配置'

        if (!columnItem.children || columnItem.children?.length === 0) {
          if (type === 'active') {
            if (propsActiveList.value[currentKey]) {
              propsActiveList.value[currentKey].push(columnItem.dataIndex)
            } else {
              propsActiveList.value[currentKey] = [columnItem.dataIndex]
            }
          } else if (type === 'default') {
            if (propsDefaultList.value[currentKey]) {
              propsDefaultList.value[currentKey].push(columnItem.dataIndex)
            } else {
              propsDefaultList.value[currentKey] = [columnItem.dataIndex]
            }
          }

        } else {
          dfs(columnItem.children, columnItem.groupName)
        }
      })
    }

    dfs(columns, undefined)
  }

  // 排序最终的基本配置信息
  const sortFinalConfig = () => {
    const res = new Array(checkedList.value['基本配置'].length).fill('')

    alwaysShowList.value['基本配置'].forEach(data => {
      const currentIndex = optionsList.value['基本配置'].findIndex(item => item.value === data)

      res[currentIndex] = data
    })
    let currentPos = 0

    checkedListSort.value.forEach(item => {
      while (res[currentPos] !== '' && currentPos < res.length) {
        currentPos++
      }
      res[currentPos] = item.value
    })

    return res.filter((item: string) => item !== '')
  }

  function buildFinalColumnsItem(columns: CustomColumnsType[]) {
    const dfs = (column: any[], groupName?: string): any[] => {
      if (!column || column.length === 0) {
        return []
      }

      return column.filter(item => {
        const currentGroup = groupName || item.groupName || '基本配置'
        let flag = true

        flag = flag && (checkedList.value[currentGroup].includes(item.dataIndex) ||
        dfs(item.children, currentGroup).length !== 0)

        return flag
      }).map(item => {
        const currentGroup = groupName || item.groupName || '基本配置'

        return {
          ...item,
          children: dfs(item.children, currentGroup),
        }
      })
    }

    const basicColumns = sortFinalConfig()
    const result = dfs(columns, undefined)
    const groupOrder = groupList.value.map(i => i.groupName)
    const basicCol = basicColumns.map(key => result.find(item => item.dataIndex === key))
    const groupCols = result.filter(item => item.groupName && item.groupName !== '基本配置').sort((a, b) =>
      groupOrder.indexOf(a.groupName) - groupOrder.indexOf(b.groupName))

    return [...basicCol, ...groupCols]
  }

  function onCheckedGroupChange(effectColumns: string[], bool: boolean) {
    if (bool) {
      effectColumns.forEach(item => {
        const group = keyInGroupMap.value.get(item)!
        const currentGroupSelectSet = new Set(checkedList.value[group])

        currentGroupSelectSet.add(item)

        checkedList.value[group] = Array.from(currentGroupSelectSet)
        if (group === '基本配置') {
          const sortKeyGroupSelectSet = new Set(checkedListSort.value.map(i => i.value))

          sortKeyGroupSelectSet.add(detailMap.value.get(item)!.value)

          checkedListSort.value = Array.from(sortKeyGroupSelectSet).map((key: string) => detailMap.value.get(key)!)
        }
      })
    } else if (!bool) {
      effectColumns.forEach(item => {
        const group = keyInGroupMap.value.get(item)!
        const currentGroupSelectSet = new Set(checkedList.value[group])

        currentGroupSelectSet.delete(item)

        checkedList.value[group] = Array.from(currentGroupSelectSet)
        if (group === '基本配置') {
          const sortKeyGroupSelectSet = new Set(checkedListSort.value.map(i => i.value))

          sortKeyGroupSelectSet.delete(detailMap.value.get(item)!.value)

          checkedListSort.value = Array.from(sortKeyGroupSelectSet).map((key: string) => detailMap.value.get(key)!)
        }
      })
    }
  }

  function setCustomList(customList: Record<string, CustomListType>) {
    customCheckboxList.value = customList
    Object.values(customList).forEach((data: any) => {
      customCheckboxStatus.value[data.key] = { checked: false, halfChecked: false }
    })

  }

  function mergeCheckAndOptions(target: string[], options: string[]): {checked: boolean, halfChecked: boolean} {
    const result = {
      checked: false,
      halfChecked: false,
    }

    if (target.every(item => options.includes(item))) {
      result.checked = true
      result.halfChecked = false

      return result
    } else if (target.some(item => options.includes(item))) {
      result.checked = false
      result.halfChecked = true

      return result
    }

    return result
  }

  function updateCheckboxStatus() {
    const allCheckBox: any[] = []

    Object.values(checkedList.value).forEach(item => {
      allCheckBox.push(...item)
    })
    Object.values(customCheckboxList.value).forEach((data: any) => {
      customCheckboxStatus.value[data.key] = mergeCheckAndOptions(data.subColumns, allCheckBox)
    })
  }

  watch(() => checkedList.value, () => {
    updateCheckboxStatus()
  }, {
    deep: true,
  })

  return {
    mapRef,
    checkAllList,
    indeterminateList,
    alwaysShowList,
    optionsList,
    detailMap,
    checkedList,
    checkedListSort,
    groupList,
    propsActiveList,
    propsDefaultList,
    customCheckboxStatus,
    keyInGroupMap,
    onAllColumnsChange,
    setPropsCols,
    sortFinalConfig,
    buildGroupList,
    buildFinalColumnsItem,
    onCheckedGroupChange,
    setCustomList,
  }
}

export { useColumnSetting }
export default useColumnSetting
