const Toast = (title, isResolve, duration) => {
  wx.showToast({
    title: title,
    duration: duration || 3000,
    icon: 'none',
    mask: true
  })
  if (isResolve) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, duration || 3000)
    });
  }
}

module.exports = Toast;