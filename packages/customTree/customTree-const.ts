import type { PropType } from 'vue'
import type { CheckNodeType, ExpandNodeType, FieldParams, Key, SearchParams, SelectNodeType } from './customTree-type'

const defaultSearchOption = {
  immediate: false,
  mode: 'locating',
  targetList: ['title'],
  placeHolder: 'please input search',
} as SearchParams
const defaultProps = {
  scrollHeight: {
    type: String as PropType<string | 'auto'>,
    default: 'auto',
  },
  treeData: {
    type: Array as PropType<unknown[]>,
    default: [],
  },
  fieldParams: {
    type: Object as PropType<Record<FieldParams, string>>,
    default: { name: 'name', id: 'id', children: 'children' },
  },
  isFlatData: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  checkable: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  checkedKeys: {
    type: Array as PropType<Key[]>,
    default: [],
  },
  checkStrictly: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  expandKeys: {
    type: Array as PropType<Key[]>,
    default: [],
  },
  withSearch: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  searchOptions: {
    type: Object as PropType<SearchParams>,
    default: defaultSearchOption,
  },
}

const emitsDefined = {
  change: () => true,
  expand: (_node: Record<string, any>, _isExpand: boolean, _data: { keys: ExpandNodeType['keys']; nodes: any[] }) => true,
  check: (_node: Record<string, any>, _isChecked: boolean, _data: CheckNodeType) => true,
  select: (_node: Record<string, any>, _isSelect: boolean, _data: SelectNodeType) => true,
}

export { defaultProps, defaultSearchOption, emitsDefined }
