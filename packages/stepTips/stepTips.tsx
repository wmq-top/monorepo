import { computed, defineComponent, onMounted, ref, toRefs, watch } from 'vue'
import { Button } from 'ant-design-vue'
import { defaultEmits, defaultProps } from './stepTips-const'
import type { RectType } from './stepTips-type'
import './stepTips-style.less'

const StepTips = defineComponent({
  name: 'StepTips',
  props: defaultProps,
  emits: defaultEmits,
  setup(props, { emit, slots }) {
    const { stepKey, activeKey, position, tipBoxStyle, text, scrollRef } = toRefs(props)
    const isActive = computed(() => stepKey.value === activeKey.value)
    const contentBox = ref<HTMLDivElement>()
    const dartBox = ref(null)
    const tipsBox = ref<HTMLDivElement>()
    const bodyObserve = ref()
    const targetObserve = ref()

    // 针对所有的标准流布局盒子计算整个content-box的size和position
    const getStaticBoxRect = (domList: HTMLDivElement[]): RectType | null => {
      const positionList: RectType[] = []
      const result: RectType = { left: Number.POSITIVE_INFINITY, top: Number.POSITIVE_INFINITY, right: Number.NEGATIVE_INFINITY, bottom: Number.NEGATIVE_INFINITY }
      for (const item of domList) {
        if (getComputedStyle(item).position === 'static')
          positionList.push(item.getClientRects()[0])
      }
      if (positionList.length === 0)
        return null

      // 获取所有出现的节点的四个边界
      positionList.forEach((item: RectType) => {
        result.left = Math.min(result.left, item.left)
        result.top = Math.min(result.top, item.top)
        result.right = Math.max(result.right, item.right)
        result.bottom = Math.max(result.bottom, item.bottom)
      })

      return result
    }
    const setTipsBoxPosition = (pos: RectType) => {
      const tipsSize = tipsBox.value?.getClientRects()[0]

      if (!tipsBox.value || !tipsSize)
        return

      if (position.value === 'bottom') {
        tipsBox.value.style.top = `${pos.bottom + 8}px`
        tipsBox.value.style.left = `${((pos.right + pos.left) - tipsSize.width) / 2}px`
      }
      if (position.value === 'top') {
        tipsBox.value.style.top = `${pos.top - tipsSize.height - 8}px`
        tipsBox.value.style.left = `${((pos.right + pos.left) - tipsSize.width) / 2}px`
      }
      if (position.value === 'left') {
        tipsBox.value.style.top = `${((pos.top + pos.bottom) - tipsSize.height) / 2}px`
        tipsBox.value.style.left = `${pos.left - tipsSize.width - 8}px`
      }
      if (position.value === 'right') {
        tipsBox.value.style.top = `${((pos.top + pos.bottom) - tipsSize.height) / 2}px`
        tipsBox.value.style.left = `${pos.right + 8}px`
      }
    }
    const buildChildBox = (pos: RectType): HTMLDivElement => {
      const result = document.createElement('div')
      const shouldAddHeight: boolean = pos.top > 8
      const shouldAddWidth: boolean = pos.left > 8

      result.className = 'step-box-range-cover'
      result.style.height = `${shouldAddHeight ? pos.bottom - pos.top + 8 : pos.bottom - pos.top}px`
      result.style.width = `${shouldAddWidth ? pos.right - pos.left + 8 : pos.right - pos.left}px`
      result.style.position = 'fixed'
      result.style.zIndex = '999'
      result.style.backgroundColor = 'white'
      result.style.top = `${shouldAddHeight ? pos.top - 4 : pos.top}px`
      result.style.left = `${shouldAddWidth ? pos.left - 4 : pos.left}px`
      result.style.border = '1px solid skyblue'

      setTipsBoxPosition(pos)

      return result
    }
    const initDescription = () => {
      const childNodes = contentBox.value?.children as unknown as HTMLDivElement[]

      if (!childNodes)
        return

      const activeBoxRect = getStaticBoxRect(childNodes)

      if (!activeBoxRect) {
        console.warn('StepTips can\'t use to wrap Elements without any \'static\' position', ['geeker-q/component', 'StepTips.ts'])
        return
      }

      const [bodyElement] = document.getElementsByTagName('body')

      document.getElementsByClassName('step-box-range-cover')[0]?.remove()

      bodyElement.appendChild(buildChildBox(activeBoxRect))
    }
    const constructObserver = (): ResizeObserver => {
      const resizeObserver = new ResizeObserver(() => {
        initDescription()
      })

      return resizeObserver
    }
    const nextFocus = () => {
      emit('next', String(Number(stepKey.value) + 1))
    }
    const jumpAll = () => {
      emit('jump')
    }

    watch(() => contentBox.value, () => {
      if (contentBox.value) {
        targetObserve.value = constructObserver()
        targetObserve.value.observe(contentBox.value)
      }
      initDescription()
    })
    onMounted(() => {
      bodyObserve.value = constructObserver()
      bodyObserve.value.observe(document.body)

      window.addEventListener('scroll', () => {
        initDescription()
      })
    })
    watch(() => isActive.value, () => {
      if (!isActive.value) {
        document.getElementsByClassName('step-box-range-cover')[0]?.remove()
        bodyObserve.value?.unobserve(document.body)
        targetObserve.value?.unobserve(contentBox.value)
      }
    })
    watch(() => scrollRef.value, () => {
      if (scrollRef.value) {
        scrollRef.value.addEventListener('scroll', () => {
          initDescription()
        })
        // scrollRef.value.scrollTo({ top: 0 })
      }
    }, {
      deep: true,
      immediate: true,
    })

    return () =>
      <>
        <div class={`step-tip-main ${isActive.value ? 'top-index' : ''}`} ref={isActive.value ? contentBox : dartBox}>{slots.default?.()}</div>
        {isActive.value
          && <div class={`step-tip-tip step-tip-${position.value}`} style={tipBoxStyle.value} ref={tipsBox}>
            {slots.tip?.() || <div class={'text-content'}>{text.value}</div>}
            <div class={'step-bottom-btn'}>
              <Button size="small" class="jump-btn" type={'primary'} onClick={jumpAll}>跳过全部</Button>
              <Button size="small" class="next-btn" type={'primary'} onClick={nextFocus}>下一步</Button>
            </div>
          </div>}
        {isActive.value && <div class={'global-mask'}/>}
      </>
  },
})

export { StepTips }
