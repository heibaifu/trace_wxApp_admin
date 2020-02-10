import {
  parseUrl
} from "../../utils/urlUtil.js";
import {
  signMD5
} from "../../utils/signMD5.js";
import {
  getEnctrySign
} from '../../utils/sign';
import Toast from "../../utils/toast.js";
import {
  getServerCurrentTime
} from '../SYS/SYS';
import AppConfig from '../../config/app.config';


// 扫描二维码
const scanCode = () => {
  return new Promise((resolve, reject) => {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode','barCode'],
      success: function (res) {
        resolve(res);
      },
      fail: function (res) {
        // resolve('失败');
        // reject();
      }
    })
  });
};

// 扫描二维码加key的验证
const scanCodeWithKey = () => {
  // wx.showNavigationBarLoading();
  return new Promise((resolve, reject) => {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success(res) {
        let codeInfo = parseScanCode(res);
        if (!codeInfo) {
          reject();
        }
        resolve(codeInfo);
      },
      fail(res) {
        reject(res);
      },
      complete() {
        // wx.hideNavigationBarLoading();
      }
    })
  });
}

// 扫描二维码加key的验证
const scanTraceCodeWithKey = () => {
  // wx.showNavigationBarLoading();
  return new Promise((resolve, reject) => {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success(res) {
       
        let codeInfo = parseTraceScanCode(res);
        if (!codeInfo) {
          reject();
        }
        resolve(codeInfo);
      },
      fail(res) {
        reject(res);
      },
      complete() {
        // wx.hideNavigationBarLoading();
      }
    })
  });
}



const scanDeviceCode = () => new Promise((resolve, reject) => {
  scanCodeWithKey()
    .then(codeInfo => {
      if (!codeInfo) {
        reject();
      }
      if (!codeInfo.id || !codeInfo.codeType) {
        Toast("请扫描正确的二维码！");
        reject();
      }
      resolve(codeInfo);
    })
    .catch(() => {
      reject()
    })
})

const scanStationCode = (expire) => new Promise((resolve, reject) => {
  const stationExpireMinute = AppConfig.stationExpire.expireMinute;
  scanCodeWithKey()
    .then(codeInfo => {
      if (!codeInfo) {
        reject();
      }
      if (!codeInfo.id || !codeInfo.codeType || !codeInfo.stamp) {
        Toast("请扫描正确的二维码！");
        reject();
      }
      getServerCurrentTime()
        .then(res => {
          let expireMinute = expire ? expire.expireMinute || stationExpireMinute : stationExpireMinute;
          if (res && res.time) {
            let deltaTime = Math.abs(parseInt(res.time) - parseInt(codeInfo.stamp));
            if (deltaTime > 60 * expireMinute * 1000) {
              Toast("二维码已过期！");
              reject();
            } else {
              resolve({
                ...codeInfo,
                stopTime: res.time
              });
            }
          }
        })
        .catch(() => {
          reject();
        })
    })
    .catch(() => {
      reject();
    })

})

const commonScanTraceCode = () => {

}

//扫描二维码设备和站点都可用
const commonScanCode = () => {
  return scanCodeWithKey()
    .then(codeInfo => {
      if (!codeInfo) {
        return Promise.reject();
      }
      return isQrcodeInExpireTime(codeInfo);

    })
    .catch(() => {
      return Promise.reject();
    })
}

const isQrcodeInExpireTime = (codeInfo, expire) => new Promise((resolve, reject) => {

  const stationExpireMinute = AppConfig.stationExpire.expireMinute;

  getServerCurrentTime()
    .then(res => {
      let expireMinute = expire ? expire.expireMinute || stationExpireMinute : stationExpireMinute;
      if (res && res.time) {
        let deltaTime = Math.abs(parseInt(res.time) - parseInt(codeInfo.stamp));
        if (deltaTime > 60 * expireMinute * 1000) {
          Toast("二维码已过期！");
          reject();
        } else {
          resolve({
            ...codeInfo,
            stopTime: res.time
          });
        }
      } else {
        reject();
      }
    })
    .catch(() => {
      reject();
    })
})




// 解析二维码地址
const parseScanCode = (res) => {
  if (!res || !res.result || !(/[wx.xzs.adorsmart.com|www.ie-goal.com]/.test(res.result))) {
    return;
  }
  let urlObj = parseUrl(res.result);
  let codeType = getUriCodeType(res.result);
  if (!urlObj || !urlObj.args || !urlObj.args.id || !urlObj.args.key || !codeType) {
    return;
  }

  let result = validateKey(urlObj.args, AppConfig.qrCodeUriPrefix + codeType);
  if (!result) {
    return;
  }
  return {
    ...result,
    codeType
  };
}

// 解析二维码地址
const parseTraceScanCode = (res) => {
  if (!(/h5.trace.adorsmart.com/.test(res.result))) {
    let result={}
    result.code = res.result
    return result
     
  }
  if (!res || !res.result || !(/h5.trace.adorsmart.com/.test(res.result))) {
    return;
  }
  let urlObj = parseUrl(res.result);
  let adds = urlObj.location
  if (!urlObj || !urlObj.args || !urlObj.args.code || !urlObj.args.key) {
    return;
  }
  if (adds =='http://h5.trace.adorsmart.com/code/box'){
    let result = validateKey(urlObj.args, 'code/box');
    if (!result) {
      return;
    }
    return {
      ...result
    };
  }
  if (adds == 'http://h5.trace.adorsmart.com/code/product'){
    let result = validateKey(urlObj.args, 'code/product');
    if (!result) {
      return;
    }
    return {
      ...result
    };
  }
  if (adds == 'http://h5.trace.adorsmart.com/code/tray'){
    let result = validateKey(urlObj.args, 'code/tray');
    if (!result) {
      return;
    }
    return {
      ...result
    };
  }
    
  

}
// 验证key
const validateKey = (args, uri) => {

  let key = args.key;
  key = key.replace(/\@/g, '')
  delete args["key"];
  return key == getEnctrySign(uri, args, 'qrcodeSign') ? args : null
}


const getUriCodeType = (url) => {
  if (!url) {
    return;
  }
  let startIndex = url.lastIndexOf("/");
  let stopIndex = url.lastIndexOf("?");
  if (startIndex == -1 || stopIndex == -1) {
    return;
  }
  return url.slice(startIndex + 1, stopIndex);
}

module.exports = {
  scanCode,
  parseScanCode,
  scanDeviceCode,
  scanStationCode,
  commonScanCode,
  scanCodeWithKey,
  scanTraceCodeWithKey
};