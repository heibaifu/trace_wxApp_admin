// pages/user/userLogin/userLogin.js
import Toast from '../../../utils/toast.js'
import {
  adminLogin, imageCaptcha, getVersionFrn
} from '../../../api/user/login.js'
import loginCache from '../../../api/localStorage/login.js'
import router from '../../../router/router.js'
import {
  getImageCaptcha
} from '../../../api/SYS/SYS.js'
import {
  apiUrlPrefix
} from '../../../config/http.config.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  onShow() {

  },

  goLogin() {
    router.go('user.login');
  },
  cancelLogin() {
    router.goIndex();
  }
  
})