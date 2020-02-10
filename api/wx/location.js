const getWxUserLocation = (noLoading) => new Promise((resolve, reject) => {
  if (!noLoading) {
    wx.showNavigationBarLoading();
  }
  wx.getLocation({
    type: 'gcj02',
    success: (res) => {
      resolve(res);
    },
    // 失败
    fail: () => {
      reject('failure');
    },
    // 完成
    complete: () => {
      wx.hideNavigationBarLoading();
    }
  })
});

module.exports = {
  getWxUserLocation
}