import baseHttpProvider from '../base/baseHttpProvider'
import { apiUrlPrefix } from '../../config/http.config.js'

// 获取当前服务器时间
const getServerCurrentTime = () => {
  return baseHttpProvider.getApi('auth/getCurrentTimeMillis', null, {
    tokenless: true
  })
}

// 获取IP地址
const getIp = () => {
  return baseHttpProvider.get('http://ip-api.com/json', null, {
    tokenless: true
  })
}

// 获取图片验证码
const getImageCaptcha = (phoneNumber) => {
  return baseHttpProvider.GET(apiUrlPrefix + 'frnImageCaptcha', { phoneNumber }, {
    tokenless: true
  })
}

// 获取客服服务中心电话号码
const getServiceData = (phoneNumber) => {
  return baseHttpProvider.getApi("api/service/getServiceData")
}
  
module.exports = {
  getIp,
  getServerCurrentTime,
  getImageCaptcha,
  getServiceData
}
