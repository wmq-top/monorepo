const docDemeComponentStr = `<script setup lang="ts">
import { CodeDocBox } from '@weaiwork/nui-design'
const transFormDocStringRef = \`#transform-doc-region\`
// your code here
</script>

<template>
  <!-- your code here -->
  <CodeDocBox :md-string="transFormDocStringRef"/>
</template>

<style lang="less" scoped>
</style>
`

function generateMatrixStr(dir: string, componentName: string) {
  return `<script setup lang="ts">
import ${componentName} from '@/components/${dir}/${componentName}.vue'
</script>
<template>
  <DemoMatrix>
    <${componentName} />
  </DemoMatrix>
</template>
<style lang="less" scoped>
</style>
`
}

function generateReadmeStr(componentName: string) {
  return `# ${componentName}

## 何时使用

## API

## 注意事项
`
}
export { docDemeComponentStr, generateMatrixStr, generateReadmeStr }

