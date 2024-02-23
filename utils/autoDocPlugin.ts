import { Plugin } from 'vite'
interface PluginOptions {
  targetFileName?: RegExp
  excludeString?: Array<string | RegExp>
}
function AutoDocPlugin(pluginOption: PluginOptions):Plugin {
  const defaultReplaceList = [
    `import { CodeDocBox } from '@weaiwork/nui-design'`,
    `const transFormDocStringRef = \`#transform-doc-region\``,
  ]
  function getReplaceString(source: string, options: PluginOptions['excludeString']) {
    let result = source
    const finalOptions = [...options!, ...defaultReplaceList]
    finalOptions.forEach((item) => {
      result = result.replaceAll(item, '')
    })
    result = result.replaceAll(/\n{2,}/g, '\n');
    result = result.replaceAll(/\s*\<CodeDocBox.*\/\>/g, '')
    result = result.replaceAll(/<doc>.*<\/doc>/g, '')
    result = result.replaceAll('\/', '\\\/')
    result = result.replaceAll('\`', '\\\`')
    result = result.replaceAll('\$', '\\\$`')
    return `
\\\`\\\`\\\`
${result}
\\\`\\\`\\\`
`
  }
  return {
    name: 'doc-auto-generate',
    enforce: 'pre',
    transform(code: string, id: string) {
      const rgx = pluginOption.targetFileName || /[a-zA-Z-_\/\\]+\/components\/[a-zA-Z\-]+\/[a-zA-Z-_]+Demo\.vue.*/g

      if(rgx.test(id)) {
        const replaceString = getReplaceString(code, pluginOption.excludeString || [])
        const replacedFileString = code.replace('#transform-doc-region', replaceString)
        return replacedFileString
      }
    }
  }
}

export { AutoDocPlugin }
