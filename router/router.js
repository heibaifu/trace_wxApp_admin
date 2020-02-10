import routerConfig from "../config/router.config.js";
import {
  joinParam
} from '../utils/urlUtil.js';
import {
  getCacheToken
} from '../api/localStorage/login.js';

let _forbidRouterChange = getApp().globalData._forbidRouterChange;

// 跳转首页
const goIndex = () => {
  if (_forbidRouterChange) {
    return;
  }

  setRouterChange();
  let length = getCurrentPages().length;
  wx.navigateBack({
    delta: length
  })
}

const _loginRequired = (loginRequired, holdRoute) => {

  if (!loginRequired) {
    return true;
  }

  if (!getCacheToken()) {
    if (!holdRoute) {
      goLogin();
    }
    return
  }
  return true;
}

// 跳转
const go = (route, params, goType) => {

  if (_forbidRouterChange) {
    return;
  }

  setRouterChange();
  let routeObj = routerConfig[route];
  let loginRequired = routeObj['loginRequired'];

  if (!_loginRequired(loginRequired)) {
    return;
  }

  let routeUrl = joinParam(routeObj['route'], params);
  let paramsObj = {
    url: routeUrl
  }

  if (!goType) {
    wx.navigateTo(paramsObj)
  } else if (goType == "redirect") {
    wx.redirectTo(paramsObj)
  } else if (goType == "tab") {
    wx.switchTab(paramsObj)
  }
}

// 重定向
const redirect = (route, params) => go(route, params, "redirect");
const goTab = (route, params) => go(route, params, "tab");
const getRoute = (route) => routerConfig[route];

const setRouterChange = () => {
  _forbidRouterChange = true;
  setTimeout(() => {
    _forbidRouterChange = false;
  }, 800)
}

const goLogin = () => {
  wx.navigateTo({
    url: routerConfig['user.login']['route']
  })
}

const goBack = (delta) => {
  delta = delta || 1;
  wx.navigateBack({
    delta: delta
  })
}

module.exports = {
  loginRequired: _loginRequired,
  redirect,
  go,
  goLogin,
  goIndex,
  getRoute,
  goBack,
  goTab
};