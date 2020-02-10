import wxpayConfig from "../../config/wxpay.config.js";
import parEncry from "../../service/parEncrytion/parEncryption.js";
import Parser from '../../lib/xmlParse/dom-parser';
import Toast from '../../utils/toast';
import {
  getCacheOpenId
} from "../../api/localStorage/login.js";

const ip = getApp().globalData.ip || '0.0.0.0';

// 微信预支付订单
const goWxPrepay = (money, orderId, orderType) => {
  return new Promise((reslove, reject) => {

    if (!money || !orderId) {
      reject("err");
      return;
    }
    let params = _getWxPrepayParams(money, orderId, orderType);
    let data = _getDataXMLStr(params);
    if (!params) {
      reject("err");
      return;
    }
    wx.request({
      url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      data: data,
      method: "POST",
      success(res) {
     
        let XMLParser = new Parser.DOMParser();
        let doc = XMLParser.parseFromString(res.data);
        let return_code = doc.getElementsByTagName('return_code')['0'].childNodes[0].nodeValue;
        let return_msg = doc.getElementsByTagName('return_msg')['0'].childNodes[0].nodeValue;
        let prepay_id = null;
        let err_code = null;
        let err_code_des = null;
        if (doc.getElementsByTagName('prepay_id')['0']) {
          prepay_id = doc.getElementsByTagName('prepay_id')['0'].childNodes[0].nodeValue;
        }
        if (doc.getElementsByTagName('err_code')['0']) {
          err_code = doc.getElementsByTagName('err_code')['0'].childNodes[0].nodeValue;
        }
        if (doc.getElementsByTagName('err_code_des')['0']) {
          err_code_des = doc.getElementsByTagName('err_code_des')['0'].childNodes[0].nodeValue;
        }
        if (return_code == "SUCCESS") {
          reslove(prepay_id);      
        } else {
          Toast(return_msg);
          reject();
        }

      },
      fail(res) {
        Toast("网络故障，微信下单失败！");
        reject();
      }
    })
  })
}

// 获取微信预支付参数
const _getWxPrepayParams = (money, orderId, orderType = "order") => {

  let total_fee = parseInt(money * 100);
  let notify_domain = wxpayConfig.notify_domain;
  let notify_url_type = wxpayConfig.notify_url_type;
  let notify_url = notify_domain + notify_url_type[orderType];
  let openid = getCacheOpenId();
  if (!openid) {
    Toast("登录已过期，请重新登录");
    return;
  }
  let rawParams = {
    //微信分配的小程序ID
    "appid": wxpayConfig.appId,
    //微信支付分配的商户号
    "mch_id": wxpayConfig.mch_id,
    //自定义参数，可以为终端设备号(门店号或收银设备ID)，PC网页或公众号内支付可以传"WEB"
    // "device_info":"WEB",
    //随机字符串，长度要求在32位以内。推荐随机数生成算法
    "nonce_str": parEncry.randomStr(),
    // 商品简单描述，该字段请按照规范传递
    "body": "共享婴儿车支付",
    //商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*且在同一个商户号下唯一。
    "out_trade_no": orderId,
    // 订单总金额，单位为分，详见支付金额
    "total_fee": total_fee,
    // 异步接收微信支付结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数。
    "notify_url": notify_url,
    // APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。
    "spbill_create_ip": ip,
    // 小程序取值如下：JSAPI
    "trade_type": "JSAPI",
    // trade_type=JSAPI，此参数必传，用户在商户appid下的唯一标识。
    "openid": openid
  }
  // 通过签名算法计算得出的签名值，详见签名生成算法
  let sign = parEncry.getWxEnctrySign(rawParams);
  return Object.assign(rawParams, {
    sign
  });
}

// 微信预支付参数转XML
const _getDataXMLStr = (params) => {
  let xmlStr = "<xml>";
  for (let _key in params) {
    let _val = params[_key];
    xmlStr += `<${_key}>${_val}</${_key}>`
  }
  xmlStr += "</xml>";
  return xmlStr;
}

// 微信预支付订单生成，时间戳+随机三位数字
const _generatePayOrderId = () => {
  let now = Date.now();
  let randomNum = ("000" + parseInt(Math.random() * 1000)).slice(-3);
  let orderId = now + randomNum;
  return orderId;
}

module.exports = goWxPrepay