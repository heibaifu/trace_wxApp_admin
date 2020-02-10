import router from '../../router/router.js';
import { getCacheUserInfo } from '../../api/localStorage/login.js';
import { scanCode } from '../../api/wx/wxScanCode.js';
import Toast from "../../utils/toast.js";
import { setTrackingNumber, getTrackingNumber } from '../../api/localStorage/agency.js';
import { getSingleNumberInformation } from '../../api/agency/agency.js';

Page({
  data: {
    trackingNumber: null,
    isScanning: false,
    isFous: false,
    brand: null,
    token: null,
    webUrl: null
  },
  onLoad: function (options) {
    setTrackingNumber(null)
    let brand = wx.getStorageSync('_brand');
    let userInfo = getCacheUserInfo();
    let token = userInfo.token;
    let webUrl = `https://s.adorsmart.com/tracePda/frontEnd/index?token=${token}&isShow=1`
    console.log(webUrl)
    this.setData({ brand, token, webUrl });
  },
  /** 生命周期************************************************************************/
  onShow() {
    if (this.data.isScanning) {
      this.setData({
        isScanning: false
      })
      return;
    }

  },


  getFous() {
    this.setData({ isFous: true })
  },
  // 点击扫描物流单号
  scanlogistics() {
    this.setData({
      isScanning: true
    })
    scanCode()
      .then((res) => {
        if (!res || !res.result || res.result.length != 12 || res.result.substr(0, 2) !== "JY") {
          Toast('请扫描正确的单号!');
          return;
        }
        this.setData({ trackingNumber: res.result });
        this.getSingleInformation(res.result);
      })
      .catch(data => {
        Toast('请扫描正确的单号!')
      })
  },

  // 获取拣货数据
  getSingleInformation(oddNumber) {
    getSingleNumberInformation({ oddNumber })
      .then(res => {
        if (!res) {
          Toast('订单不存在！')
          return
        } else {
          this.goAgency(oddNumber)
        }
      })
  },
  // 获取物流单号
  getNumber(e) {
    let trackingNumber = e.detail.value;
    this.setData({ trackingNumber });
    if (!trackingNumber || trackingNumber.length != 12) {
      return;
    }
    if (trackingNumber.substr(0, 2) !== "JY") {
      Toast('单号不正确，请重新输入！');
      return;
    }
    this.getSingleInformation(trackingNumber)

  },
  clearTrackingNumber() {
    this.setData({ trackingNumber: null });
  },
  onUnload() {
    setTrackingNumber(null);
  },

  //************************跳转路由******************** */
  // 查看箱                      
  goAgencyBoxList(e) {
    let id = e.currentTarget.dataset.id;
    router.go('agencyBoxList', { id });

  },
  // 拣货登记
  goAgency(trackingNumber) {
    // let trackingNumber = getTrackingNumber('_trackingNumber')
    router.go('agency', { trackingNumber });
  },

  goIndex() {
    router.goIndex();
  },

})