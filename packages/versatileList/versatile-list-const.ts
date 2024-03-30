import type { PropType } from 'vue'
import type { VersatileListProps, VersatileData } from './versatile-list-types'

const defaultProps = {
  modelValue: {
    type: Array as PropType<VersatileListProps['dataSource']>,
    default: []
  },
  allowSort: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  onEdit: {
    type: Function as PropType<VersatileListProps['onEdit']>,
    default: async ({data}: {data: VersatileData}) => false
  },
  onCopy: {
    type: Function as PropType<VersatileListProps['onCopy']>,
  },
  onDelete: {
    type: Function as PropType<VersatileListProps['onDelete']>,
    default: async ({data}: {data: VersatileData}) => false
  },
  onAdd: {
    type: Function as PropType<VersatileListProps['onAdd']>,
    default: async () => false
  },
  onSearch: {
    type: Function as PropType<VersatileListProps['onSearch']>,
    default: async (searchValue: string) => false
  },
  onShare: {
    type: Function as PropType<VersatileListProps['onShare']>,
    default: async ({data}: {data: VersatileData}) => false
  }
}

export { defaultProps }
