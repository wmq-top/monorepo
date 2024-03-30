import { message } from 'ant-design-vue'
import type { PduOptions }from './pdu-selector-types'

function labelRender<T extends (...args: any[]) => any>(label: string, target: PduOptions, withFavor: boolean, emitTrigger: T) {
  const changeTargetFavor = (e: MouseEvent, target: PduOptions) => {
    e.stopPropagation()
    target.isFavor = !target.isFavor

    emitTrigger('favorChange', target)
  
    message.success(`${target.isFavor ? '' : '取消'}收藏空间成功`)
  
    return false
  }
  return <div class={'cascader-label-slot'}>
    <span class={'cascader-label-label'}>{label}</span>
    {withFavor && <span class={{
        'cascader-label-favor-icon': true,
        'cascader-label-favor-leaf-icon': !target.children || target.children.length === 0,
        'cascader-label-disable-icon': target.disabled,
      }}
        onClick={e => changeTargetFavor(e, target)}>
        {target.isFavor ? '💛' : '🤍'}
      </span>
    }
    
  </div>
}

function generatePduOptions<T extends (...args: any[]) => any>(input: PduOptions[], withFavor: boolean, emitTrigger: T): PduOptions[] {
  if (!input || input.length === 0) {
    return [] as any
  }

  return input.map(item => ({
    ...item,
    label: labelRender(item.label, item, withFavor, emitTrigger),
    title: item.label,
    id: item.value || item.id,
    value: item.value || item.id,
    children: generatePduOptions(item.children!, withFavor, emitTrigger),
    isLeaf: !item.children || item.children.length === 0,
  }))
}

function doFilterForPduOptions(options: PduOptions[], filtered: boolean, currentChoice: (string | number)[]) {
  if (!filtered) {
    return options
  }
  const dfs = (optionsInput: PduOptions[]): PduOptions[] => {
    if (!optionsInput || optionsInput.length === 0) {
      return []
    }

    return optionsInput.filter(item => {
      item.children = dfs(item.children || [])

      return item.isFavor || currentChoice.includes(item.id) || dfs(item.children || []).length !== 0
    })
  }

  return dfs(options)
}

function validateValueAndOptions(options: Set<string | number>, values: (string | number)[]) {
  if(values.length === 0) {
    return true
  }
  return !values.some((i) => !options.has(i))
}
export { labelRender, generatePduOptions, doFilterForPduOptions, validateValueAndOptions, type PduOptions }
