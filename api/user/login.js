
import baseHttpProvider from '../base/baseHttpProvider'
import md5 from '../../lib/md5/md5.js'
import { frnId } from "../../config/app.config";
// 登录
const adminLogin = (params) => {
  let { code,password} = params
  code = code.toLowerCase();
  password = md5(password);
  return baseHttpProvider.postFormApi('api/factory/login', { ...params, code, password },
  {tokenless:true,showLoading:true})
}
const imageCaptcha = (params) => {
  params = params ? baseHttpProvider.filterNullKeyInParams(params) : {};
  let result = baseHttpProvider.getReqObj('api/imageCaptcha', { ...params },false,true);
  if (result.url) {
    return result.url
  }
}

const getVersionFrn = (params) => {
  return baseHttpProvider.getApi('auth/versionFrn', params, { showLoading: true })
}


module.exports = {
  adminLogin,
  imageCaptcha,
  getVersionFrn
}
