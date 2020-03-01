// 查询本地历史是否收藏过该店家
export function loadFromLocal (id, key, def) {
// 看本地是否有__seller__
  let seller = window.localStorage.__seller__
  if (!seller) {
    return def
  }
  // 拿到seller的id
  let sellerID = JSON.parse(seller)[id]
  // 如果本地有这个店家的id，保存的第三个参数就保存为fasle
  if (sellerID) {
    return def
  }
  let ret = seller[key]
  // 返回店家的key或者def
  return ret || def
}

//  保存店家数据到本地
export function saveToLocal (id, key, value) {
  // 判断本地是否已有这个数据
  let seller = window.localStorage.__seller__
  // 如果没有这个数据就创建一个
  if (!seller) {
    seller = {}
    seller[id] = {}
  } else {
    // 如果本地已有这个店家的数据，先把它转换成JSON键值对的格式，方便下一步存储id和key
    seller = JSON.parse(seller)
    // 如果这个seller没有id,就创建一个id
    if (!seller[id]) {
      seller[id] = {}
    }
    // 把id和key保存到本地
    seller[id][key] = value
  }
  // 把数据格式重新转化为字符串保存到本地
  window.localStorage.__seller__ = JSON.stringify(seller)
}
