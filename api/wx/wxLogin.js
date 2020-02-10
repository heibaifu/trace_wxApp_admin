import baseHttpProvider from '../base/baseHttpProvider'
import { frnId } from '../../config/app.config.js'
import { mobileValidate,verifyImageCodeValidate } from '../../utils/validate.js'

// 获取微信登录的code
const getLoginCode = () => {
  // 登录
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        resolve(res.code)
      },
      fail: res => {
        reject('err')
      }
    })
  })
}

// 登录
const getUserMobile = (code, iv, encryptedData) => {
  if (code && iv && encryptedData) {
    return baseHttpProvider.postFormApi('auth/login', {
      frnId,
      code,
      iv,
      encryptedData: encodeURIComponent(encryptedData)
    }, {
        toast: {
          required: true,
          failTitle: '登录失败！'
        },
        tokenless: true
      })
  }
}

// 设置用户数据
const setUserInfo = (userInfo) => {
  if (userInfo) {
    return baseHttpProvider.postFormApi('api/user/updateUserInfo', {
      avatarUrl: encodeURIComponent(userInfo.avatarUrl),
      city: userInfo.city,
      country: userInfo.country,
      gender: userInfo.gender,
      language: userInfo.language,
      nickName: userInfo.nickName,
      province: userInfo.province
    })
  }
}

// 获取用户数据
const getUserInfo = () => {
  return new Promise(resolve => {
    baseHttpProvider.getApi('api/user/getUserInfo', null, { toast: { required: false } }).then((data) => {
      if (data && data.avatarUrl) {
        data.avatarUrl = decodeURIComponent(data.avatarUrl)
        return resolve(data)
      }
    })
  })
}

// 获取验证码带token
const getVerifyCodeWithToken = (phoneNumber) => {

  if (!mobileValidate(phoneNumber)) {
    return
  }

  let data = {
    phoneNumber
  }
  return baseHttpProvider.getApi('api/sms/getVerifyCode', data)

}

// 获取验证码
const getVerifyCode = (phoneNumber, imageCaptcha) => {
  if (!mobileValidate(phoneNumber)) {
    return
  }

  if (!verifyImageCodeValidate(imageCaptcha)) {
    return
  }

  let data = {
    phoneNumber,
    imageCaptcha,
    frnId
  }
  return baseHttpProvider.getApi('sms/getVerifyCode', data, {
    header: data,
    tokenless: true
  })
}

// 验证码登录
const verifyCodeLogin = (params) => {
  let options = {
    toast: {
      required: true,
      failTitle: '登录失败！'
    },
    tokenless: true
  }
  if (params && params.code && params.verifyCode && params.phoneNumber) {
    return baseHttpProvider.postFormApi('auth/verifyCodeLogin', {
      frnId,
      code: params.code,
      verifyCode: params.verifyCode,
      phoneNumber: params.phoneNumber
    }, options)
  }
}

module.exports = {
  getLoginCode,
  getUserMobile,
  setUserInfo,
  getUserInfo,
  getVerifyCode,
  getVerifyCodeWithToken,
  verifyCodeLogin
}
