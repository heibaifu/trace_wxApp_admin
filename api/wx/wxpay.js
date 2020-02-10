import wxprepay from "prepay.js";
import parEncry from "../../service/parEncrytion/parEncryption.js";
import wxpayConfig from "../../config/wxpay.config.js";
import Toast from "../../utils/toast.js";

const goWxpay = (money, orderId, payType) => {
  return wxprepay(money, orderId, payType).then(prepay_id => {
    return _wxpay(prepay_id);
  })
}

const _wxpay = (prepay_id) => {
  if (!prepay_id) {
    return;
  }
  return new Promise((resolve, reject) => {
    let appId = wxpayConfig.appId;
    let timeStamp = Date.now().toString().slice(0, -3);
    let nonceStr = parEncry.randomStr();
    let _package = 'prepay_id=' + prepay_id;
    let signType = "MD5";
    let params = {
      "appId": appId,
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': _package,
      "signType": signType
    }
    let paySign = parEncry.getWxEnctrySign(params);
    wx.requestPayment({
      appId,
      timeStamp,
      nonceStr,
      paySign,
      signType,
      "package": _package,
      success(res) {
        resolve({
          ...res,
          prepay_id
        });
      },
      fail(res) {
        if (res.errMsg) {
          if (res.errMsg.indexOf("cancel") != -1) {
            Toast("支付取消!");
          } else {
            let i = res.errMsg.indexOf("requestPayment");
            Toast(res.errMsg.substr(i));
          }
        }
        reject(res);
      }

    })
  })
};




module.exports = goWxpay