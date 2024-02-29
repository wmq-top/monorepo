import type { PropType } from 'vue'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type ButtonType = {
  label: string
  value: string
}

type SizeType = 'small' | 'default' | 'large'
const defaultProps = {
  modelValue: {
    type: String as PropType<string>,
    default: '',
  },
  buttons: {
    type: Array as PropType<Array<ButtonType>>,
    default: [],
  },
  size: {
    type: String as PropType<SizeType>,
    default: 'default',
  },
  fillLine: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  activeColor: {
    type: String as PropType<string>,
    default: '#ffffff',
  },
  bgColor: {
    type: String as PropType<string>,
    default: '#f2f2f4',
  },
  color: {
    type: String as PropType<string>,
    default: '#000000',
  },
}
const defaultEmits = {
  'update:modelValue': (data: string) => true,
  'change': (data: string) => true,
}
export { defaultProps, defaultEmits }
