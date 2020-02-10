import baseHttpProvider from '../base/baseHttpProvider'
import AppConfig from "../../config/app.config.js";
import {
  getNowDate
} from "../../utils/dateUtil.js";
import {
  getCacheOpenId
} from "../../api/localStorage/login.js";

import {
  shiftCacheFormId,
  getCacheFormId
} from "../../api/localStorage/formIds.js";

// 获取Wx token
const getAccessToken = () => {
  let appid = AppConfig.appId;
  let secret = AppConfig.aps;
  return baseHttpProvider.GET('https://api.weixin.qq.com/cgi-bin/token', {
    grant_type: "client_credential",
    appid,
    secret
  })
}



const postTemplateMsg = (options) => {
  let openid = getCacheOpenId();

  if (!openid || !options || !options.length == 0) {
    return Promise.reject();
  }

  let baseUrl = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=';

  return getAccessToken().then(resToken => {
  
    if (!resToken.access_token) {
      return Promise.reject();
    }
    let form_id = getCacheFormId() || Date.now();
 
    if (!options.form_id && !form_id) {
      return Promise.reject();
    }
    let url = baseUrl + encodeURIComponent(resToken.access_token);
    let params = {
      "touser": openid, //用户的openid
      "template_id": "eijn5zLrZA7Qu1xWKOqbO8MYrHojeSrLuYPOt-CLtyo", //模板id
      // "page": "",
      "form_id": form_id, //表单id
      "data": _getTemplateData(options.keywordData)
    }
  
    return baseHttpProvider.POST(url, params).then(() => {
      shiftCacheFormId();
      return Promise.resolve();
    });
  })
}

const _getTemplateData = (keywordData, color) => {
  if (!keywordData || keywordData.length == 0) {
    return
  }
  let result = {};
  color = color || "#173177";
  keywordData.forEach((item, index) => {
    let keyName = "keyword" + parseInt(index + 1);
    result[keyName] = {
      "value": item,
      "color": color
    }
  })
  return result;
}
module.exports = {
  getAccessToken,
  postTemplateMsg
}