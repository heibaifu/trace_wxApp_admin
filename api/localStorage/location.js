const setCacheLocation = (data) => {
  wx.setStorage({
    key: "_location",
    data: data
  })
};

//获取缓存位置信息
const getCacheLocation = () => {
  return wx.getStorageSync('_location') || null;
};

module.exports ={
  setCacheLocation,
  getCacheLocation
}