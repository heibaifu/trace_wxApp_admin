const Modal = (title, content, confirmText, cancelText) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: title || "",
      content: content || "",
      showCancel: true,
      cancelText: cancelText || '取消',
      cancelColor: '#000000',
      confirmText: confirmText || '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          resolve()
        } else {
          reject()
        }
      },
      fail: () => {
        reject()
      }
    });
  })
}


module.exports = {
  Modal
};