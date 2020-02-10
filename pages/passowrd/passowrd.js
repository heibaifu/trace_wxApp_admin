import Toast from '../../utils/toast.js'
import {
  updatePassword
} from '../../api/user/setting.js'
import router from "../../router/router.js";

Page({
  data: {
    oldPassword: null,
    newPassword: null,
  },

  onLoad(options) {
    
  },

  // 获取原始密码input
  getOldPassword(e) {
    this.setData({
      oldPassword: e.detail.value
    })
  },

  // 获取新密码input
  getNewPassword(e) {
    this.setData({
      newPassword: e.detail.value
    })
  },

  // 提交修改密码
  submitChangeClicked() {
    let oldPassword = this.data.oldPassword
    let newPassword = this.data.newPassword

    if (!oldPassword || oldPassword.length != 6) {
      Toast('请输入6位原始密码！')
      return
    }

    if (!newPassword || newPassword.length != 6) {
      Toast('请输入6位新密码！')
      return
    }
    if (oldPassword == newPassword) {
      Toast('原始密码与新密码一致，请重新输入！')
      return
    }
    updatePassword({oldPassword, newPassword}).then(() => {
      Toast("修改成功,请重新登录")
      router.go('user.login')
    })
    
  }

})