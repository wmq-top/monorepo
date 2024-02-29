import type { ExcludeObj, FieldNamesType } from './type'
import { DefObject } from './defObject'

type TreeNodeType = {
  isLeaf: boolean
  dataDetail: Record<string, any>
} & RequestParamsType & InjectParamsType

interface InjectParamsType {
  level: number
  onlyKey: string
  parentId: string
  prevArr: boolean[]
  parentNode?: ExcludeObj<TreeNodeType, 'children'> | null
}
interface RequestParamsType {
  title: string
  id: string
  children: TreeNodeType[]
}
interface ConstructOptions {
  fieldKey?: string
  connectKey?: string
  rootKeyValue: string
}
class TreeConstructor {
  static defaultParams: FieldNamesType = {
    name: 'name' as const,
    children: 'children' as const,
    id: 'id' as const,
  }

  static defaultRootInfo: InjectParamsType = {
    level: 0,
    onlyKey: '0',
    parentId: 'root',
    parentNode: null,
    prevArr: [],
  }

  static defaultConstructOptions: NonNullable<ConstructOptions> = {
    fieldKey: 'id',
    connectKey: 'parentId',
    rootKeyValue: 'root',
  }

  static buildTree(data: any[], fieldParams: FieldNamesType = this.defaultParams, rootInfo: InjectParamsType = this.defaultRootInfo): TreeNodeType[] {
    if (!data || data.length === 0)
      return []

    return data.map((item: any, index: number): TreeNodeType => {
      const newPrevArr = [...rootInfo.prevArr]

      if (index === data.length - 1)
        newPrevArr.push(false)

      else
        newPrevArr.push(true)

      const parentForChildren = {
        title: item[fieldParams.name] as string,
        id: item[fieldParams.id] as string,
        level: rootInfo.level,
        onlyKey: `${rootInfo.onlyKey}-${index}`,
        key: `${rootInfo.onlyKey}-${index}`,
        parentId: rootInfo.parentId,
        parentNode: rootInfo.parentNode,
        // isLeaf: false || !item[fieldParams.children] || item[fieldParams.children]?.length === 0,
        isLeaf: false,
        isRealLeaf: !item[fieldParams.children] || item[fieldParams.children]?.length === 0,
        prevArr: [...rootInfo.prevArr, true],
        dataDetail: DefObject.getDeleteKeyRes(item, fieldParams.children),
      }
      const newRootInfo: InjectParamsType = {
        level: rootInfo.level + 1,
        onlyKey: `${rootInfo.onlyKey}-${index}`,
        prevArr: newPrevArr,
        parentId: item[fieldParams.id] as string,
        parentNode: { ...parentForChildren },
      }

      return {
        ...parentForChildren,
        children: this.buildTree(item[fieldParams.children], fieldParams, newRootInfo),
      }
    })
  }

  static getNodePath(node: TreeNodeType, desc: 'title' | 'id' | 'onlyKey' = 'title') {
    const resPathArr = []
    let currentNode = { ...node }

    while (currentNode) {
      resPathArr.push(currentNode[desc])
      currentNode = currentNode.parentNode as TreeNodeType
    }

    return resPathArr.reverse()
  }

  static getNodeData(treeData: TreeNodeType[], onlyKey: string, desc: 'onlyKey' = 'onlyKey'): TreeNodeType | null {
    const res = treeData.filter(item => onlyKey.startsWith(item[desc]))

    if (!res[0])
      return null

    if (res[0]?.onlyKey === onlyKey)
      return res[0]

    return this.getNodeData(res[0].children, onlyKey)
  }

  static getTreeConstruct<T extends Record<string, any>>(data: T[], options: ConstructOptions) {
    const { fieldKey, connectKey, rootKeyValue } = { ...this.defaultConstructOptions, ...options }
    const rootChildren: T[] = []
    const map = new Map()

    data.forEach((item: T) => {
      if (item[connectKey as string] === rootKeyValue)
        rootChildren.push({ ...item })

      else
        map.set(item[fieldKey as string], item)
    })

    const result = rootChildren.map(item => ({
      ...item,
      children: this.getChildren(map, item[fieldKey as string], fieldKey as string, connectKey as string),
    }))

    return result
  }

  static getChildren(map: Map<string, any>, targetKey: string, fieldKey: string, connectKey: string) {
    const res: any[] = []

    Array.from(map.values()).forEach((data) => {
      if (data[connectKey] === targetKey)
        res.push(data)
    })
    if (res.length === 0)
      return []

    res.forEach((item) => {
      map.delete(item[fieldKey])
    })

    const result: any[] = res.map(item => ({
      ...item,
      children: this.getChildren(map, item[fieldKey], fieldKey, connectKey),
    }))

    return result
  }

  static getAllNodeKeys(treeData: any[], onlyKey = 'onlyKey'): { keys: string[]; nodes: Map<string, any> } {
    const result: { keys: string[]; nodes: Map<string, any> } = { keys: [], nodes: new Map() }
    const dfs = (data: any[]) => {
      if (!data || data.length === 0)
        return

      data.forEach((item) => {
        result.keys.push(item[onlyKey])
        result.nodes.set(item[onlyKey], item)
        dfs(item.children)
      })
    }

    dfs(treeData)

    return result
  }
}

export { TreeConstructor }
