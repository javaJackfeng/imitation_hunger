export function formatDate (date, fmt) {
  // 匹配到格式化串里的年并进行替换
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, date.getFullYear())
  }
  // 替换月日时分
  let o = {
    // 匹配的月，日，时，分
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes()
  }
  for (let key in o) {
    // 构造正则表达式
    if (new RegExp(`(${key})`).test(fmt)) {
      let str = o[key] + ''
      // 替换要注意补0
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

// 补0
function padLeftZero (str) {
  // 从字符串的长度位开始截取
  return ('00' + str).substr(str.length)
}
