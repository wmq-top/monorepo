import * as Utils from './index'
const testData = {
  name: '111',
  title: '2222',
  data: '333'
}

console.log(Utils.DefObject.getDeleteKeyRes(testData, 'data', true))