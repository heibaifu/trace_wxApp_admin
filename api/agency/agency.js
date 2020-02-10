import baseHttpProvider from '../base/baseHttpProvider';
import {
  frnId
} from "../../config/app.config.js";
import md5 from '../../lib/md5/md5.js'
import Toast from '../../utils/toast.js'

// 获取货码详情
const getCodeDetail = (params)=>{
  return baseHttpProvider.postFormApi('api/factory/scanVerification', params, { showLoading: true })
}
// 确认发货
const confirmDelivery = (params) => {
  return baseHttpProvider.postFormApi('api/v1.0/pickingOut/picking', params, { showLoading: true })
}
//获取箱码详情
const getPackingDetails = (params) => {
  return baseHttpProvider.getApi('api/factory/getProduceScan', params, { showLoading: true })
}
// 获取拣货出库数据
const getSingleNumberInformation = (params) => {
  return baseHttpProvider.getApi('api/v1.0/pickingOut/getSingleNumberInformation', params, { showLoading: true })
}
// 拣货历史
const pickingHistory = (params) => {
  return baseHttpProvider.getApi('api/v1.0/pickingOut/pickingHistory', params, { showLoading: true ,total:true})
}
// 拣货历史
const pickingHistoryDetails = (params) => {
  return baseHttpProvider.getApi('api/v1.0/pickingOut/pickingHistoryDetails', params, { showLoading: true, total: true })
}
// 查看订单详情
const pickingDetail= (params) => {
  return baseHttpProvider.postFormApi('api/v1.0/pickingOut/pickingDetail', params, { showLoading: true })
}

module.exports = {
  getCodeDetail,
  confirmDelivery,
  getPackingDetails,
  getSingleNumberInformation,
  pickingHistory,
  pickingDetail,
  pickingHistoryDetails
 
}