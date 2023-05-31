import { defineComponent } from 'vue'
import './stepTips-style.less'

const StepTips = defineComponent({
  name: 'StepTips',
  // props: defaultProps,
  // emits: emitsDefined,

  setup(props, { emit, slots, expose }) {
    return () =>
      <div class={'step-tip-content'}>
        <div class={'step-tip-main'}>{slots.default?.()}</div>
        <div class={'step-tip-tip'}>{slots.tip?.()}</div>
      </div>
  },
})

export { StepTips }
