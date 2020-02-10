let App = getApp();

const getAppGlobaData = (key) => {
  return key ? App['globalData'][key] : App['globalData'];
}

const setAppGlobaData = (keyStr, value) => {
  if (!keyStr) {
    return;
  }
  let keysArr = keyStr.split(".");
  let key = keysArr[0];
  if (keysArr.length > 1) {
    let subKey = keysArr[1];
    if (!App['globalData'].hasOwnProperty(key)) {
      App['globalData'][key] = {};
    }
    App['globalData'][key][subKey] = value;
  } else {
    App['globalData'][key] = value;
  }
}


module.exports = {
  getAppGlobaData, setAppGlobaData
}
