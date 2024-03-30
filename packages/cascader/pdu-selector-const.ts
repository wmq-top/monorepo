import type { PropType } from 'vue'
import type { pduSourceDataProps } from './pdu-selector-types'
const defaultProps = {
  modelValue: {
    type: Array as PropType<Array<string | number>>,
    default: []
  },
  withFavor: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  width: {
    type: String as PropType<string>,
    default: 'auto'
  },
  useRpc: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  dataSource: {
    type: Array as PropType<pduSourceDataProps[]>,
    default: []
  }
}

const defaultEmits = {
  "update:modelValue": (data: Array<string | number>) => true,
  change: ({data, options}: {data: Array<string | number>, options: any[]}) => true,
  confirm: () => true,
  favorChange: (data: any) => true
}

export { defaultProps, defaultEmits }
