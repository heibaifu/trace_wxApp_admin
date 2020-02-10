import router from '../../router/router.js';

import { userLogout, isUserLogin } from '../../api/localStorage/login.js';
import { getCacheUserInfo } from '../../api/localStorage/login.js';
import Toast from "../../utils/toast.js";



Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    shipStatus: null,
    storeStatus: null,
    isFous: true
  },
onLoad(){
  let userInfo = getCacheUserInfo();
  this.setData({ userInfo})
},
  onShow() {
    let userInfo = getCacheUserInfo();
    if (userInfo) {
      // router.redirect('user.login');
      this.setData({
        userInfo,
        shipStatus: userInfo.shipStatus
      })
    }else{
      this.setData({
        userInfo:null
      })
    }

  },


  logoutClick() {
    
      wx.showModal({
        title: '提示',
        content: '确认要注销吗?',
        success(res) {
          if (res.confirm) {
            userLogout();
            wx.setStorage({
              key: "_agencyInfo",
              data: null
            })
            wx.setStorage({
              key: "_dealerName",
              data: null
            })
            wx.setStorage({
              key: "_logistics",
              data: null
            })
            wx.setStorage({
              key: "_shopInfo",
              data: null
            })
            router.go('user.login')
          }
        }
      })

    
  },
  // 拣货出库
  godeliverManage() {
    if (!isUserLogin()) {
      router.go('user.tipInfo');
      return
    }
    router.go('deliverManage');
  },
  goPassowrd() {
    if (!isUserLogin()) {
      router.go('user.tipInfo');
      return
    }
    router.go('passowrd')
  },
  // 拣货历史
  gohistoryList() {
    if (!isUserLogin()) {
      router.go('user.tipInfo');
      return
    }
    router.go('historyList')
  }

})