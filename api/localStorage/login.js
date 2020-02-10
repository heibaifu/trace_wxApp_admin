const setCacheUserInfo = (userInfo) => {
  wx.setStorage({
    key: "_userInfo",
    data: userInfo
  })
};

const getCacheUserInfo = () => {
  return wx.getStorageSync('_userInfo') || null;
};

const getCachePhoneNumber = () => {
  let cacheUserInfo = getCacheUserInfo()
  if (cacheUserInfo && cacheUserInfo.phoneNumber) {
    return cacheUserInfo.phoneNumber
  }
};

const getCacheFrnId=()=>{
  let cacheUserInfo = getCacheUserInfo();
  if (cacheUserInfo && cacheUserInfo.frnId) {
    return cacheUserInfo.frnId;
  } 
}

const getCacheToken = () => {
  let cacheUserInfo = getCacheUserInfo();
  if (cacheUserInfo && cacheUserInfo.token) {
    return cacheUserInfo.token;
  }
};

const getCacheOpenId = () => {
  let cacheUserInfo = getCacheUserInfo();
  if (cacheUserInfo && cacheUserInfo.openid) {
    return cacheUserInfo.openid;
  }
};

const isUserLogin = ()=>{
  if(getCacheToken()){
    return true;
  }
  return false
}

const userLogout=()=>{
  wx.setStorage({
    key: "_userInfo",
    data: null
  })
}

module.exports = {
  setCacheUserInfo,
  getCacheUserInfo,  
  getCacheToken,
  getCachePhoneNumber,
  getCacheOpenId,
  isUserLogin,
  userLogout,
  getCacheFrnId
}