import { argv } from 'process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { docDemeComponentStr, generateMatrixStr, generateReadmeStr } from './constants'
const cwd = process.cwd()
interface RouterConfigData {
  groupKey: string
  groupName: string
  children: Record<'label' | 'key', string>[]
}

function capitalizeFirstLetter2(str: string) {
  const [first, ...rest] = str
  return first.toUpperCase() + rest.join('')
}
async function init() {
  const componentName = argv[2].toLocaleLowerCase()
  const componentLabel = argv[3]?.toLocaleUpperCase() || componentName.toLocaleUpperCase()

  const routerViewConfigUri = path.join(cwd, './src/views/components-view/constants.json')
  const routerViewConfigStr = readFileSync(routerViewConfigUri, {
    encoding: 'utf-8',
  })
  const routerViewConfigObj = JSON.parse(routerViewConfigStr)
  const currentComponentList: string[] = []
  routerViewConfigObj.forEach((ele: RouterConfigData) => {
    ele.children.forEach((item) => {
      currentComponentList.push(item.key)
    })
  })

  if (currentComponentList.includes(componentName)) {
    console.error('当前的组件已存在请更换组件名称')
    return
  }
  routerViewConfigObj[0].children.push({
    label: componentLabel,
    key: componentName,
  })
  const concatString = JSON.stringify(routerViewConfigObj)
  writeFileSync(routerViewConfigUri, concatString)

  const componentDirUri = path.join(cwd, `./src/components/${componentName}`)
  mkdirSync(componentDirUri, {
    recursive: true,
  })

  const DemoFileName = `${componentName.split('-').map(i => capitalizeFirstLetter2(i.toLocaleLowerCase())).join('')}Demo`

  writeFileSync(path.join(componentDirUri, `${DemoFileName}.vue`), docDemeComponentStr)
  writeFileSync(path.join(componentDirUri, 'index.vue'), generateMatrixStr(componentName, DemoFileName))
  writeFileSync(path.join(componentDirUri, 'README.md'), generateReadmeStr(componentLabel))

  console.log(`${DemoFileName} 创建成功`)
}
try {
  init()
}
catch (e) {
  console.error(e)
}
