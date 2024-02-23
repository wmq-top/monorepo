import type { TableColumnType } from 'ant-design-vue'

type FilterType = 'input' | 'radio' | 'radioSelect' | 'multipleSelect' | 'checkbox' | 'operate' | 'custom'

type ColumnsFilterConfig = {
  type: FilterType
  width?: string,
  filterMultiple?: boolean
  defaultValue?: string
  filterOptions?: string[] | 'auto'
}

interface CustomColumnsType extends TableColumnType {
  dataIndex: string
  title: string
  groupName?: string,
  key?: string
  withFilter?: boolean
  customFilterDropdown?: boolean
  filterConfig?: ColumnsFilterConfig
  withSort?: boolean
  children?: Omit<CustomColumnsType, 'groupName'>[]
  fixed?: boolean | 'left' | 'right',
  alwaysShow?: boolean,
  desc?: string
}

type CustomListType = {
  [key: string | number]: {key: string, title: string, subColumns: string[]}
}

type DetailType = {label: string, value: string, disabled: boolean}
export type { CustomColumnsType, DetailType, CustomListType }
