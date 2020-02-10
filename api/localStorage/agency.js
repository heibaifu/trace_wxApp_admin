import baseHttpProvider from '../base/baseHttpProvider';
import {
  frnId
} from "../../config/app.config.js";
import md5 from '../../lib/md5/md5.js'
import Toast from '../../utils/toast.js'

//获取缓存拣货出库
const getSingleNumberInformationInfo = () => {
  let aInfo = wx.getStorageSync('_singleNumberInformation');
  let result = aInfo || {};
  return result
};

//设置缓存拣货出库
const setSingleNumberInformation = (singleNumberInformation) => {
  wx.setStorage({
    key: "_singleNumberInformation",
    data: singleNumberInformation
  })
};
//设置初始数据
const setInitializeData = (initializeData) => {
  wx.setStorage({
    key: "_initializeData",
    data: initializeData
  })
};
const getInitializeData = () => {
  let aInfo = wx.getStorageSync('_initializeData');
  let result = aInfo || {};
  return result
};
//设置初始数据
const setBoxArrData = (boxArrData) => {
  wx.setStorage({
    key: "_boxArrData",
    data: boxArrData
  })
};
const getBoxArrData = () => {
  let aInfo = wx.getStorageSync('_boxArrData');
  let result = aInfo || {};
  return result
};
//设置初始数据
const setCodeArrData = (codeArrData) => {
  wx.setStorage({
    key: "_codeArrData",
    data: codeArrData
  })
};
const getCodeArrData = () => {
  let aInfo = wx.getStorageSync('_codeArrData');
  let result = aInfo || {};
  return result
};

//缓存单号
const setTrackingNumber = (trackingNumber) => {
  wx.setStorage({
    key: "_trackingNumber",
    data: trackingNumber
  })
};
const getTrackingNumber= () => {
  let aInfo = wx.getStorageSync('_trackingNumber');
  let result = aInfo || {};
  return result
};


module.exports = {
  setSingleNumberInformation,
  getSingleNumberInformationInfo,
  setInitializeData,
  getInitializeData,
  getBoxArrData,
  setBoxArrData,
  setCodeArrData,
  getCodeArrData,
  setTrackingNumber,
  getTrackingNumber
}