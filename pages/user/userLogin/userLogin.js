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
    phone: null,
    password: null,
    code: null,
    verifyImage: null,
    frnId:73,
    status:1
  },

  onShow() {
    
  },
  // 获取用户输入的手机号
  getUsername(e) {
    let phone = e.detail.value
    this.setData({
      phone
    })
    if (phone.length == 11) {
      this.setImageUrl()
    }
  },
  // 获取用户输入的密码
  getPassword(e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 获取验证码的值
  getVerifyCode(e) {
    let code = e.detail.value;
    this.setData({
      code
    })
  },
  
  // 点击登录
  loginClicked() {
    let { phone, password, code, frnId} = this.data;
    adminLogin({
      phone,
      password,
      code,
      frnId
    }).then(data => {
      this._loginSuccess(data);
    })
  },


  // 登录成功
  _loginSuccess(data) {
    if (!data || !data.token) {
      Toast('登录失败!');
      return
    }
    let token = data.token
    data.token = decodeURIComponent(token)
    loginCache.setCacheUserInfo(data);
    wx.showLoading({
      title: '登录中...',
    })
    setTimeout(() => {
      router.goIndex()
      wx.hideLoading();
    }, 1000)

  },

  // 设置图片验证码url
  setImageUrl() {
    let { phone } = this.data;
    let type=1
    let stamp = Date.now()
    let verifyImage = imageCaptcha({ phone, type, stamp })
    this.setData({
      verifyImage
    })
  },
})