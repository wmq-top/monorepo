import { defineComponent, onMounted, ref } from 'vue'
import Clipboard from 'clipboard'
import { message } from 'ant-design-vue'
import { getMdRender } from '../../utils/highlightMd'
import { defaultProps } from './code-doc-box-const'
import 'highlight.js/styles/github.css'
import './code-doc-bar-style.less'

const CodeDocBox = defineComponent({
  name: 'CodeDocBox',
  props: defaultProps,
  setup(props) {
    const clipboard = ref<Clipboard>()
    const showCode = ref<boolean>(false)

    function changeShowCode() {
      showCode.value = !showCode.value
    }

    message.config({
      maxCount: 1
    })

    onMounted(() => {
      setTimeout(() => {
        clipboard.value = new Clipboard('.copy-btn')
        clipboard.value.on('success', () => {
          message.success('复制成功')
        })
        clipboard.value.on('error', () => {
          message.error('复制失败')
        })
      })
    })

    return () => <div class={'tool-box-content'}>
      <div class={'tool-item-box'} onClick={changeShowCode}>{
        showCode.value ? '隐藏代码' : '展示代码'
      }</div>
      {showCode.value && <div class={'inner-code-content'}
      innerHTML={getMdRender('typescript').render(props.mdString)}></div>}
    </div>
  },
})

export { CodeDocBox }
