const setCacheFormId = (fromId) => {
  wx.setStorage({
    key: "_formIds",
    data: fromId
  })
};

const addCacheFormId = (fromId) => {
  if (fromId) {
    let fromIds = _getCacheFormIds();
    fromIds.push(fromId);
    setCacheFormId(fromIds);
  }
}

const clearCacheFormId = () => {
  setCacheFormId(null);
};

const _getCacheFormIds = () => {
  return wx.getStorageSync('_formIds') || [];
};

const getCacheFormId = () => {
  let fromIds = _getCacheFormIds();
  if (!fromIds || fromIds.length == 0) {
    return
  }
  return fromIds[0];
}
const shiftCacheFormId = () => {
  let fromIds = _getCacheFormIds();
  if (!fromIds) {
    return
  }
  let result = fromIds.shift();
  setCacheFormId(fromIds);
  return result;
}


module.exports = {
  getCacheFormId,
  setCacheFormId,
  addCacheFormId,
  clearCacheFormId,
  shiftCacheFormId
}