function hashCode(str: string) {
  let h = 0
  const len = str.length
  const t = 2147483648
  for (let i = 0; i < len; i++) {
    h = 31 * h + str.charCodeAt(i)
    if (h > 2147483647)
      h %= t // java int溢出则取模
  }
  /* var t = -2147483648 * 2;
     while (h > 2147483647) {
     h += t
     } */
  return h
}

function randomWord(randomFlag: boolean, min: number, max: number) {
  let str = ''
  let range = min
  const arr = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ]
  // 随机产生
  if (randomFlag)
    range = Math.round(Math.random() * (max - min)) + min

  for (let i = 0; i < range; i++) {
    const pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}
// 获取hashcode
function gethashcode() {
  // 定义一个时间戳，计算与1970年相差的毫秒数  用来获得唯一时间
  const timestamp = new Date().valueOf()
  const myRandom = randomWord(false, 6, 29)
  const hashcode = hashCode(myRandom + timestamp.toString())
  return hashcode
}
export { gethashcode }
