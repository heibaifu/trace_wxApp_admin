import router from '../../router/router.js';
import { userLogout } from '../../api/localStorage/login.js';
import {clearCacheAgencyInfo,setCacheDealerName} from '../../api/localStorage/agency.js';
// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  logoutClick() {
    wx.showModal({
      title: '提示',
      content: '确认要注销吗?',
      success(res) {
        if (res.confirm) {
          userLogout();
          router.redirect('user.login')
        }
      }
    })
    clearCacheAgencyInfo();
    setCacheDealerName(null);
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /******************跳转路由*****************/ 

  goPassowrd() {
    router.go('passowrd')
  }

 
})