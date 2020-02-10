import md5 from "../lib/md5/md5.js";
import wxpayConfig from "../config/wxpay.config.js";

// json key转小写
const lowerJSONKey = (jsonObj) => {
  let result = {};
  for (let key in jsonObj) {
    let lower = key.toLowerCase();
    result[lower] = jsonObj[key];
  }
  return result;
}

// json序列化转字符串
const joinObj2Str = (jsonObj, tolowerKey, joinStr) => {
  if (!jsonObj) {
    return;
  }

  joinStr = joinStr || "&";
  if (tolowerKey) {
    jsonObj = lowerJSONKey(jsonObj);
  }
  let keys = Object.keys(jsonObj).sort();
  let str = '';
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let value = jsonObj[key];

    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      for (let index = 0; index < value.length; index++) {
        let k = key + "[" + index + "]";
        let v = value[index];
        if (str.length > 1) str += joinStr;
        str += k + "=" + v;
      }
    } else if (isObject(value)) {
      for (let subKey in value) {
        if (value.hasOwnProperty(subKey)) {
          let v = value[subKey];
          if (v === null) continue;

          let k = key + "[" + subKey + "]";
          if (str.length > 1) str += joinStr;
          str += k + "=" + v;
        }
      }
    } else {
      if (str.length > 1) {
        str += joinStr
      };
      str += key + "=" + value;
    }
  }
  return str;
}

const isObject = (val) => {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

// 获取随机字符串
const randomStr = (upperCase, len) => {
  len = len || 16;
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return upperCase ? pwd.toUpperCase() : pwd;
}

//微信的签名方式
const getWxEnctrySign = (params) => {
  let str = joinObj2Str(params) + "&key=" + wxpayConfig.key;

  let result = md5(str).toUpperCase();
  return result;
}



module.exports = {
  joinObj2Str,
  getWxEnctrySign,
  randomStr
}