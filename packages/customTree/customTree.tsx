/* eslint-disable unicorn/no-new-array */
import { computed, defineComponent, onMounted, ref, toRefs, watch } from 'vue'
import { Input, Tree, message } from 'ant-design-vue'
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons-vue'
import 'ant-design-vue/dist/antd.css'
import { TreeConstructor, gethashcode } from '../utils'
import { defaultProps, defaultSearchOption, emitsDefined } from './customTree-const'
import type { CheckNodeType, CustomTreeRef, ExpandNodeType, Key, SelectNodeType } from './customTree-type'
import './customTree-style.less'

const CustomTree = defineComponent({
  name: 'W3Login',
  props: defaultProps,
  emits: emitsDefined,

  setup(props, { emit, slots, expose }) {
    const hashCode = ref<string>(`${gethashcode()}`)
    const { treeData, fieldParams, scrollHeight, checkable, checkedKeys, expandKeys, withSearch, searchOptions } = toRefs(props)
    const currentTree = ref()
    const finalTreeData = computed(() => TreeConstructor.buildTree(treeData.value, fieldParams.value))
    const allNodeData = computed(() => Array.from(TreeConstructor.getAllNodeKeys(finalTreeData.value).nodes.values()))

    const searchValue = ref<string>()
    const searchOps = computed(() => ({ ...defaultSearchOption, ...searchOptions.value }))
    const searchTree = ref<any[]>([])

    // #region expand logic
    const expandedNode = ref<ExpandNodeType>({ keys: [], nodes: new Map() as Map<string, any> })
    const onExpandNode = (expandedKeys: Key[], { expanded, node }: { expanded: boolean; node: Record<string, any> }) => {
      expandedNode.value.keys = expandedKeys
      if (expanded)
        expandedNode.value.nodes.set(node.id, node.dataRef)

      else
        expandedNode.value.nodes.delete(node.id)

      // 解构传递使其失去响应性
      emit('expand', node.dataRef, expanded, { keys: [...expandedNode.value.keys], nodes: [...expandedNode.value.nodes.values()] })
    }
    const expandAllNode = async () => {
      if (searchTree.value.length !== 0) {
        expandedNode.value.keys = TreeConstructor.getAllNodeKeys(searchTree.value, 'id').keys
        expandedNode.value.nodes = TreeConstructor.getAllNodeKeys(searchTree.value, 'id').nodes
      }
      else if (searchTree.value.length === 0) {
        expandedNode.value.keys = TreeConstructor.getAllNodeKeys(finalTreeData.value, 'id').keys
        expandedNode.value.nodes = TreeConstructor.getAllNodeKeys(finalTreeData.value, 'id').nodes
      }

      return { keys: [...expandedNode.value.keys], nodes: [...expandedNode.value.nodes.values()] }
    }
    const closedAllNode = async () => {
      expandedNode.value.keys = []
      expandedNode.value.nodes = new Map()

      return { keys: [...expandedNode.value.keys], nodes: [...expandedNode.value.nodes.values()] }
    }
    const getAllExpandNodes = (target: 'keys' | 'nodes' = 'keys') =>
      target === 'keys' ? [...expandedNode.value.keys] : [...expandedNode.value.nodes.values()]
    // #endregion

    // #region checked logic
    const checkedNode = ref<CheckNodeType>({ keys: [], nodes: [] })
    const onCheckedNode = (checkKeys: Key[], { checked, checkedNodes, node }:
    { checked: boolean; checkedNodes: Record<string, any>[]; node: Record<string, any> }) => {
      checkedNode.value.keys = checkKeys
      checkedNode.value.nodes = checkedNodes
      emit('check', node.dataRef, checked, checkedNode.value)
    }
    const checkedAllNode = async () => {
      if (!checkable.value)
        return { keys: [], nodes: [] }

      if (searchTree.value.length !== 0) {
        checkedNode.value.keys = TreeConstructor.getAllNodeKeys(searchTree.value, 'id').keys
        checkedNode.value.nodes = Array.from(TreeConstructor.getAllNodeKeys(searchTree.value, 'id').nodes.values())
      }
      else if (searchTree.value.length === 0) {
        checkedNode.value.keys = TreeConstructor.getAllNodeKeys(finalTreeData.value, 'id').keys
        checkedNode.value.nodes = Array.from(TreeConstructor.getAllNodeKeys(finalTreeData.value, 'id').nodes.values())
      }

      return { keys: [...checkedNode.value.keys], nodes: [...checkedNode.value.nodes] }
    }
    const disCheckedAllNode = async () => {
      checkedNode.value.keys = []
      checkedNode.value.nodes = []

      return { keys: [...checkedNode.value.keys], nodes: [...checkedNode.value.nodes] }
    }
    const getAllCheckedNode = async () => checkedNode.value
    // #endregion

    const reflectSetData = (keys: Key[], target: 'check' | 'expand') => {
      if (target === 'check')
        checkedNode.value.nodes = allNodeData.value.filter((i: any) => keys.includes(i.id))

      if (target === 'expand') {
        const map = new Map()

        allNodeData.value.forEach((i: any) => {
          if (keys.includes(i.id))
            map.set(i.id, i)
        })
        expandedNode.value.nodes = map
      }
    }

    const preSelectNode = ref<Key>('')
    const selectNodes = ref<SelectNodeType>({ keys: [], nodes: [] })
    const selectNode = (selectedKey: Key[], { selected, selectedNodes, node }: { selected: boolean; selectedNodes: any[]; node: any }) => {
      selectNodes.value.keys = selectedKey
      selectNodes.value.nodes = selectedNodes
      preSelectNode.value = ''
      emit('select', node, selected, selectNodes.value)
    }
    const scrollTo = (key: Key, keepExpand: boolean, offset?: number) => {
      const targetNode = allNodeData.value.find((i: any) => i.id === key)

      if (!targetNode) {
        message.warning('当前定位的节点不存在~')

        return
      }

      if (keepExpand)
        expandedNode.value.keys = Array.from(new Set([...TreeConstructor.getNodePath(targetNode, 'id'), ...expandedNode.value.keys]))

      else
        expandedNode.value.keys = TreeConstructor.getNodePath(targetNode, 'id')

      reflectSetData(expandedNode.value.keys, 'expand')
      selectNodes.value = { keys: [], nodes: [] }
      setTimeout(() => {
        currentTree.value?.scrollTo({ key, align: 'top', offset: offset || 30 })
        preSelectNode.value = key
      })
    }

    watch(() => checkedKeys.value, () => {
      checkedNode.value.keys = checkedKeys.value
      reflectSetData(checkedNode.value.keys, 'check')
    }, {
      deep: true,
      immediate: true,
    })

    watch(() => expandKeys.value, () => {
      expandedNode.value.keys = expandKeys.value
      reflectSetData(expandedNode.value.keys, 'expand')
    }, {
      deep: true,
      immediate: true,
    })
    const rectHeight = ref<number>(500)
    const constructObserver = (): ResizeObserver => {
      const resizeObserver = new ResizeObserver((entry) => {
        rectHeight.value = entry[0].contentRect.height
      })

      return resizeObserver
    }
    const observeWrapper = () => {
      const domList = document.getElementsByClassName('custom-tree-wrapper')
      let wrapperDom = null

      for (const item of Array.from(domList)) {
        const data = item.attributes['data-hash' as keyof typeof item.attributes] as { value: string }

        if (data.value === hashCode.value)
          wrapperDom = item
      }
      constructObserver().observe(wrapperDom as Element)
    }

    onMounted(() => {
      observeWrapper()
    })

    const doSearchInTree = () => {
      closedAllNode()
      disCheckedAllNode()
      const filterList = allNodeData.value.filter(node => searchOps.value.targetList?.some(key => node[key]?.includes(searchValue.value)))

      if (filterList.length === 0) {
        message.config({ maxCount: 3 })
        message.warning({ content: '没有匹配的节点~' })

        return
      }
      const set: Set<string> = new Set()
      const result: any[] = []

      filterList.forEach((item: Record<string, any> | null) => {
        if (!item)
          return

        let temp = { ...item }

        while (temp) {
          if (set.has(temp.onlyKey)) {
            return
          }
          else {
            set.add(temp.onlyKey)
            result.push(temp)
          }
          temp = temp.parentNode
        }
      })

      searchTree.value = TreeConstructor.buildTree(TreeConstructor.getTreeConstruct(
        result,
        { connectKey: 'parentId', rootKeyValue: 'root' },
      ), fieldParams.value)
      expandAllNode()
    }
    const changeSearchValue = (e: any) => {
      searchValue.value = e.target?.value
      if (!searchValue.value)
        searchTree.value = []

      if (searchOps.value.immediate)
        doSearchInTree()
    }

    expose({
      expandAllNode,
      closedAllNode,
      getAllExpandNodes,
      checkedAllNode,
      disCheckedAllNode,
      getAllCheckedNode,
      scrollTo,
    } as CustomTreeRef)

    return () =>
    <div class={'custom-tree-content'}>
      {withSearch.value
        && <Input
          value={searchValue.value}
          onChange={changeSearchValue}
          onPressEnter={doSearchInTree}
          placeholder={searchOps.value.placeHolder}
        />
      }
      <div class={'custom-tree-wrapper'} data-hash={hashCode.value}>
        <Tree
        ref={currentTree}
        class={'custom-tree'}
        fieldNames={{ key: 'id' }}
        treeData={searchTree.value.length === 0 ? finalTreeData.value as any[] : searchTree.value}
        height={scrollHeight.value === 'auto' ? rectHeight.value : Number(scrollHeight.value)}
        // checkStrictly={checkStrictly.value}
        checkable={checkable.value}
        checkedKeys={checkedNode.value.keys}
        onCheck={(checkKeys, { checked, checkedNodes, node }) => onCheckedNode(checkKeys as Key[], { checked, checkedNodes, node })}
        expandedKeys={expandedNode.value.keys}
        onExpand={(expandedKeys, { expanded, node }) => onExpandNode(expandedKeys, { expanded, node })}
        selectedKeys={selectNodes.value.keys}
        onSelect={selectNode}
      >
        {{
          switcherIcon: ({ dataRef, expanded }: { dataRef: any; expanded: boolean }) =>
          <>
            {[...new Array(dataRef.level)].map((_, i) => <span class={`self-indent ${dataRef.prevArr[i + 1] ? 'show-line' : ''}`}/>)}
            <span class={`${dataRef.level === '0' ? 'root-icon' : 'expand-icon'}`}>
              {!expanded && !dataRef.isRealLeaf && <PlusSquareOutlined class={'custom-svg-icon'} style={{ color: '#878988' }} />}
              {expanded && !dataRef.isRealLeaf && <MinusSquareOutlined class={'custom-svg-icon'} style={{ color: '#878988' }} />}
              {dataRef.isRealLeaf && <span class={'last-self-indent'}/>}
            </span>
          </>,
          title: ({ dataRef }: { dataRef: any }) =>
          <>
            <span class={preSelectNode.value === dataRef.id ? 'custom-title pre-focus' : 'custom-title'}>
              {slots.tag ? slots.tag({ dataRef }) : ''}
              {/* <span class={`custom-tag ${tagProps.value.tagMap[dataRef[tagProps.value.key]].toLocaleLowerCase()}-tag`}>
                {slots.tag({ dataRef })}
              </span> */}
              <span class={'custom-title-item'}>{slots.title ? slots.title({ dataRef }) : dataRef.title}</span>
              {slots.operate ? slots.operate({ dataRef }) : ''}
            </span>
          </>,
        }}

        </Tree>
      </div>
    </div>
  },
})

export { CustomTree }
