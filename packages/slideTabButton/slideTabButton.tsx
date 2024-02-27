import { defineComponent, toRefs, ref, onMounted, watch, onUnmounted } from "vue"
import { defaultProps, defaultEmits } from './slide-tab-button-const'
import './slide-tab-button-style.less'

const SlideTabButton = defineComponent({
  name: 'SlideTabButton',
  props: defaultProps,
  emits: defaultEmits,
  setup(props, { emit }) {
    const { modelValue, buttons, size, activeColor, bgColor, fillLine, color } = toRefs(props)
    const highLightRef = ref<HTMLDivElement>()
    const slideContentRef = ref<HTMLDivElement>()

    const resizeObserver = new ResizeObserver(function() {
      setActiveDiv(getTargetDom())
    });
    onMounted(() => {
      const btnIndex = buttons.value.findIndex((item) => item.value === modelValue.value)
      const domList = slideContentRef.value!.getElementsByClassName('nui-slide-tab-button-item')
      const targetDom = domList[btnIndex] as HTMLDivElement
      setActiveDiv(targetDom)
      resizeObserver.observe(slideContentRef.value!)
    })
    onUnmounted(() => {
      resizeObserver.disconnect()
    })
    function setActiveDiv(ele: HTMLDivElement) {
      const left = ele.offsetLeft
      const { width } = getComputedStyle(ele)
      highLightRef.value!.style.left = `${left}px`
      highLightRef.value!.style.width = width
    }
    function changeActive(e: any, btn: {label: string, value: string}) {
      setActiveDiv(e.target)
      emit('update:modelValue', btn.value)
      emit('change', btn.value)
    }
    function getTargetDom(): HTMLDivElement {
      const btnIndex = buttons.value.findIndex((item) => item.value === modelValue.value)
      const domList = slideContentRef.value!.getElementsByClassName('nui-slide-tab-button-item')
      const targetDom = domList[btnIndex] as HTMLDivElement
      return targetDom
    }

    watch(() => modelValue.value, () => {
      setActiveDiv(getTargetDom())
    })

    return () => <div class={'nui-slide-tab-button-wrap'}>
      <div class={`nui-slide-tab-button-content nui-slide-tab-button-content-${props.size} ${fillLine.value ? 'nui-slide-tab-button-content-fill' : ''}`} ref={slideContentRef} style={{backgroundColor: bgColor.value}}>
        { buttons.value.map((item, index) => 
          <span ref={slideContentRef} 
          class={`nui-slide-tab-button-item nui-slide-tab-button-item-${size.value} ${item.value === modelValue.value ? 'nui-slide-tab-item-active' : '' } ${index === buttons.value.length - 1 ? 'nui-slide-tab-item-last': ''}
          `} style={{ color: color.value }} onClick={(e) => changeActive(e, item)}>{item.label}</span>) 
        }
        <div 
          class={`nui-high-light-slide nui-high-light-slide-${size.value}`} 
          ref={highLightRef} 
          style={{backgroundColor: activeColor.value}}
        />
      </div>
    </div>
  }
})

export { SlideTabButton }
