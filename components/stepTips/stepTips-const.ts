import type { PropType, Ref } from 'vue'
import type { StepTipsPosType } from './stepTips-type'

const defaultProps = {
  text: {
    type: String as PropType<string>,
    default: 'step Tips text',
  },
  position: {
    type: String as PropType<StepTipsPosType>,
    default: 'bottom',
  },
  stepKey: {
    type: String as PropType<string>,
    default: '1',
  },
  activeKey: {
    type: String as PropType<string>,
    default: '1',
  },
  tipBoxStyle: {
    type: Object as PropType<Record<'minWidth' | 'maxWidth' | 'border', string>>,
    default: {
      minWidth: '200px',
      maxWidth: '400px',
      border: '1.5px dashed #1890ff',
    },
  },
  withMask: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  // staging props for develop user,make stepTips more stable
  scrollRef: {
    type: Object as PropType<Ref<Element>>,
    default: null,
  },
}
const defaultEmits = {
  next: (_data: string) => true,
  jump: () => true,
}

export { defaultProps, defaultEmits }
