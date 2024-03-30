import { defineComponent, onMounted, ref, computed, toRefs, watch } from 'vue'
import { Cascader, RadioGroup, Radio } from 'ant-design-vue'
import { defaultProps, defaultEmits } from './pdu-selector-const'
import { generatePduOptions, doFilterForPduOptions, validateValueAndOptions } from './pdu-selector-utils'
import type { PduOptions } from './pdu-selector-types'
import './pdu-selector-style.less'

const PDUSelector = defineComponent({
  name: 'PDUSelector',
  props: defaultProps,
  emits: defaultEmits,
  // eslint-disable-next-line max-lines-per-function
  setup(props, { emit }) {
    const { withFavor, modelValue, dataSource, width } = toRefs(props)
    onMounted(() => {
      // use for static dataSource not have rpc
      optionsRef.value = [...dataSource.value] as any[]
    })
    const optionsRef = ref([] as PduOptions[])
    const selectValue = ref([...modelValue.value])
    const options = computed(() =>
      doFilterForPduOptions(generatePduOptions(optionsRef.value, withFavor.value, emit), filterModeChoice.value === '已收藏', selectValue.value))
    const idList = computed(() => {
      const result: Set<string | number> = new Set()

      const bfs = (inputArray: PduOptions[]) => {
        if(!inputArray || inputArray.length === 0) {
          return
        }
        inputArray.forEach((item) => {
          result.add(item.value || item.id)
          bfs(item.children!)
        })
      }
      bfs(optionsRef.value)
      return result
    })

    const filter = (inputValue: any, path: any[]) => path.some(option => option.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)

    const filterRender = ({ path }: {path: PduOptions[]}) => <div>{path.map(i => i.title).join('/')}</div>

    const popoverBox = ref()

    function getPopupContainer() {
      return popoverBox.value
    }
    const filterModeChoice = ref('全部')
    const filterModeList = ref(['全部', '已收藏'])
    const showPopupContainer = ref<boolean>(false)
    const clickInPop = ref<boolean>(false)
    const visibleTimer = ref()

    function popupVisibleChange(visible: boolean) {
      // 增加防抖处理，避免反复生成控制popup的定时器
      if (visible) {
        showPopupContainer.value = true

        return
      }
      clearTimeout(visibleTimer.value)
      visibleTimer.value = setTimeout(() => {
        if (clickInPop.value) {
          clickInPop.value = false

          return
        }
        emit('confirm')
        showPopupContainer.value = false
      }, 300)
    }
    function clickInPopup(e: MouseEvent) {
      e.stopPropagation()
      showPopupContainer.value = true
      clickInPop.value = true

      return false
    }

    function emitSelectChange(data: any, options: any[]) {
      emit('update:modelValue', data)
      emit('change', { data, options })
    }

    watch(() => modelValue.value, () => {
      if(!modelValue.value) {
        selectValue.value = []
        return
      }
      if(validateValueAndOptions(idList.value, modelValue.value)) {
        selectValue.value = [...modelValue.value]
      } else {
        console.warn(
          'some select value is invalid may effect sync render error, please check your modelValue all support in options',
          ['@nt/components/PDUSelector'],
        )
        selectValue.value = []
      }
    }, {
      deep: true,
      immediate: true
    })

    return () =>
      <div class={'nt-pdu-selector-content'}>
        <Cascader
          class={'nt-pdu-selector'}
          style={{width: width.value}}
          v-model={[selectValue.value, 'value']}
          options={options.value}
          show-search={{ filter, render: filterRender }}
          placeholder={'请选择PDU'}
          placement={'bottomRight'}
          getPopupContainer={getPopupContainer}
          onDropdownVisibleChange={popupVisibleChange}
          open={showPopupContainer.value}
          change-on-select
          allowClear={false}
          onChange={emitSelectChange}
        >
          {{ displayRender: ({ selectedOptions }: {selectedOptions: PduOptions[]}) =>
            selectedOptions.map(i => i.title).join('/') }}
        </Cascader>
        <div class={{ 'popover-box-content': true, 'hidden-box-content': !showPopupContainer.value }}
          onClick={(e: MouseEvent) => clickInPopup(e)}
        >
          {withFavor.value && <div class={'popover-mode-select'}>
            {
              popoverBox.value && showPopupContainer.value &&
               <RadioGroup v-model={[filterModeChoice.value, 'value']}>
                  {filterModeList.value.map(item =>
                  <Radio key={item} value={item} onClick={(e: MouseEvent) => clickInPopup(e)}>{item}</Radio>)}
               </RadioGroup>
            }
            </div>
          }
          <div class={'popover-box-contain'} ref={popoverBox} />
        </div>
      </div>
  },
})

export { PDUSelector }
