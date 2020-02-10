import baseHttpProvider from '../base/baseHttpProvider'
import md5 from '../../lib/md5/md5.js'

// 更新密码

// 更新密码
const updatePassword = ({oldPassword, newPassword}) => {
  let params = {
    newPassword: md5(newPassword),
    oldPassword: md5(oldPassword)
  }
  return baseHttpProvider.postFormApi('api/factory/updatePassword', params)
}
module.exports = {
  updatePassword 
}
 