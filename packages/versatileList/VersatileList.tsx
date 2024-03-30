import { defineComponent, onMounted, ref, toRefs, TransitionGroup, nextTick } from 'vue'
import { Dropdown, Menu, MenuItem, message, Divider } from 'ant-design-vue'
import { SearchOutlined, ShareAltOutlined, StarOutlined, StarFilled, MoreOutlined, 
  EditOutlined, CopyOutlined, DeleteOutlined, DesktopOutlined, CloseCircleFilled, PlusOutlined } from '@ant-design/icons-vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { defaultProps } from './versatile-list-const'
import { guid } from './versatile-list-utils'
import type { VersatileData, refItem } from './versatile-list-types'
import "./versatile-list-style.less"

const VersatileList = defineComponent({
  name: 'VersatileList',
  props: defaultProps,
  setup(props) {
    const { modelValue, allowSort } = toRefs(props)

    const menuRef = ref<Record<string | number, any>>({})
    const listContent = ref<HTMLDivElement>()

    const dragList = ref([] as VersatileData[])
    const searchValue = ref<string>('')
    async function doListSearch(e: KeyboardEvent) {
      if (!(e.target as any).value) {
        dragList.value = [...modelValue.value]
      }
      if (e.code !== 'Enter') {
        return
      }
      const preventDefault = await props.onSearch(searchValue.value)
      if (preventDefault) {
        return
      }
      dragList.value = dragList.value.filter((i) => i.label.includes(searchValue.value))
    }
    function clearSearch() {
      searchValue.value = ''
      dragList.value = [...modelValue.value]
    }

    onMounted(() => {
      dragList.value = [...modelValue.value]
    })

    const searchActive = ref<boolean>(false)
    function changeSearchActive(bool: boolean) {
      searchActive.value = bool
    }

    const activeListKey = ref<string | number>('')
    function changeActiveNode(activeKey: string | number) {
      activeListKey.value = activeKey
    }

    function changeFavor(node: VersatileData, e: MouseEvent) {
      e.stopPropagation()
      e.preventDefault()
      node.isFavor = !node.isFavor

      return false
    }

    async function doListShare(data: VersatileData) {
      const preventDefault = await props.onShare({ data })
      if (preventDefault) {
        return
      }
      // TODO: default share logic
    }
    const editRowKey = ref<string | number>()
    async function doListEdit(data: VersatileData) {
      const preventDefault = await props.onEdit({ data })
      if (preventDefault) {
        return
      }
      editRowKey.value = data.value
      setTimeout(() => {
        menuRef.value[data.value].focus()
      })
    }
    async function doListDelete(data:VersatileData) {
      const preventDefault = await props.onDelete({ data })
      if (preventDefault) {
        return
      }
      dragList.value = dragList.value.filter((i) => i.value !== data.value)
    }
    function onEditKeydown(e: KeyboardEvent) {
      if (e.code === 'Enter') {
        if (!(e.target as any).value) {
          message.warning('请勿在列表中填入空值')
          return
        }
        editRowKey.value = ''
      }
    }
    function exitModify() {
      editRowKey.value = ''
    }
    function handleSetRef(el: refItem, key: string | number) {
      menuRef.value[key] = el
    }

    async function addNewRecord() {
      const preventDefault = await props.onAdd()

      if(preventDefault) {
        return
      }
      const newId = guid()
      const calcLabel = () => {
        let num = 0
        dragList.value.filter((i) => i.label.startsWith('新看板')).forEach((i) => {
          num = Math.max(Number(i.label.split('新看板')[1]), num)
        })
        return `新看板${num + 1}`
      }
      dragList.value.push({
        label: calcLabel(),
        value: newId,
        isFavor: false,
        source: {}
      })
      nextTick(() => {
        const scrollTop = listContent.value?.scrollHeight
        listContent.value?.scrollTo({top: scrollTop})
        activeListKey.value = newId
        editRowKey.value = newId
        setTimeout(() => {
          menuRef.value[newId].focus()
        })
      })
    }

    return () => <div class={'nt-versatile-list'}>
      <div class={'search-box-content'}>
        <input
          class={'nt-custom-search-input'}
          v-model={[searchValue.value]}
          placeholder={"请输入搜索内容..."}
          title={searchValue.value}
          onFocus={() => changeSearchActive(true)}
          onBlur={() => changeSearchActive(false)}
          onKeydown={(e) => doListSearch(e)}
        />
        {searchValue.value && <CloseCircleFilled class={'nt-custom-clear-icon'} onClick={clearSearch} />}
        <SearchOutlined class={{ 'nt-custom-search-icon': true, 'nt-custom-search-icon-active': searchActive.value }} />
      </div>
      <div class={'list-main-content'} ref={listContent}>
        {!allowSort.value && dragList.value.map((item) =>
          <div
            class={{ 'nt-versatile-list-item': true, 'nt-versatile-list-item-active': activeListKey.value === item.value }}
            key={item.value}
          >
            <div class={'nt-versatile-list-prefix-icon'}><DesktopOutlined /></div>
            <div onClick={() => changeActiveNode(item.value)} class={'nt-versatile-list-item-label'}>
              {editRowKey.value === item.value ?
                <input
                  v-model={item.label}
                  class={'fix-line-row'}
                  ref={(el: any) => handleSetRef(el, item.value)}
                  onKeydown={(e) => onEditKeydown(e)}
                  onBlur={() => exitModify()}
                >{item.label}</input> :
                <span class={'max-width-content'} onDblclick={() => doListEdit(item)}>{item.label}</span>
              }
            </div>
            <div class={'tool-list'}>
              <span class={'tool-list-icon tool-list-favor'} onClick={(e) => changeFavor(item, e)}>
                {item.isFavor ? <StarFilled style={{ color: '#fac532' }} title={'取消收藏'}/> : <StarOutlined style={{ color: '#757575' }} title={'收藏'}/>}
              </span>
              <span class={'tool-list-icon tool-list-share'} onClick={() => doListShare(item)}>
                <ShareAltOutlined title={'分享'}/>
              </span>
              <Dropdown trigger={'click'}>
                {{
                  default: () => <span class={'tool-list-icon tool-list-more'}><MoreOutlined style={{ color: '#757575' }} /></span>,
                  overlay: () => <Menu>
                    <MenuItem key={'edit'} class={'nt-versatile-list-drop-menu-item'} onClick={() => doListEdit(item)}>
                      <EditOutlined class={'nt-versatile-list-operate-icon'} />
                      <span class={'nt-versatile-list-drop-menu-text'}>编辑</span>
                    </MenuItem>
                    <MenuItem key={'copy'} class={'nt-versatile-list-drop-menu-item'}><CopyOutlined class={'nt-versatile-list-operate-icon'} />
                      <span class={'nt-versatile-list-drop-menu-text'}>复制</span></MenuItem>
                    <MenuItem key={'delete'} class={'nt-versatile-list-drop-menu-item'} onClick={() => doListDelete(item)}>
                      <DeleteOutlined class={'nt-versatile-list-operate-icon'} />
                      <span class={'nt-versatile-list-drop-menu-text'}>删除</span></MenuItem>
                  </Menu>
                }}
              </Dropdown>
            </div>
          </div>)}
        {allowSort.value && <VueDraggableNext list={dragList.value || []}>
          <TransitionGroup>
            {dragList.value.map((item) =>
              <div
                class={{ 'nt-versatile-list-item': true, 'nt-versatile-list-item-active': activeListKey.value === item.value }}
                key={item.value}
              >
                <div class={'nt-versatile-list-prefix-icon'}><DesktopOutlined /></div>
                <div onClick={() => changeActiveNode(item.value)} class={'nt-versatile-list-item-label'}>
                  {editRowKey.value === item.value ?
                    <input
                      v-model={item.label}
                      class={'fix-line-row'}
                      ref={(el: any) => handleSetRef(el, item.value)}
                      onKeydown={(e) => onEditKeydown(e)}
                      onBlur={() => exitModify()}
                    >{item.label}</input> :
                    <span class={'max-width-content'} onDblclick={() => doListEdit(item)}>{item.label}</span>
                  }
                </div>
                <div class={'tool-list'}>
                  <span class={'tool-list-icon tool-list-favor'} onClick={(e) => changeFavor(item, e)}>
                    {item.isFavor ? <StarFilled style={{ color: '#fac532' }} /> : <StarOutlined style={{ color: '#757575' }} />}
                  </span>
                  <span class={'tool-list-icon tool-list-share'} onClick={() => doListShare(item)}>
                    <ShareAltOutlined />
                  </span>
                  <Dropdown trigger={'click'}>
                    {{
                      default: () => <span class={'tool-list-icon tool-list-more'}><MoreOutlined style={{ color: '#757575' }} /></span>,
                      overlay: () => <Menu>
                        <MenuItem key={'edit'} class={'nt-versatile-list-drop-menu-item'} onClick={() => doListEdit(item)}>
                          <EditOutlined class={'nt-versatile-list-operate-icon'} />
                          <span class={'nt-versatile-list-drop-menu-text'}>编辑</span>
                        </MenuItem>
                        <MenuItem key={'copy'} class={'nt-versatile-list-drop-menu-item'}><CopyOutlined class={'nt-versatile-list-operate-icon'} />
                          <span class={'nt-versatile-list-drop-menu-text'}>复制</span></MenuItem>
                        <MenuItem key={'delete'} class={'nt-versatile-list-drop-menu-item'}><DeleteOutlined class={'nt-versatile-list-operate-icon'} />
                          <span class={'nt-versatile-list-drop-menu-text'}>删除</span></MenuItem>
                      </Menu>
                    }}
                  </Dropdown>
                </div>
              </div>)}
          </TransitionGroup>
        </VueDraggableNext>}
      </div>
      <Divider />
      <div class={'nt-versatile-operate-content'}>
        <button class={'nt-versatile-list-add-button'} onClick={addNewRecord}>新建看板</button>
        <button class={'nt-versatile-list-add-button'}>共享空间</button>
      </div>
    </div>
  }
})

export { VersatileList }
