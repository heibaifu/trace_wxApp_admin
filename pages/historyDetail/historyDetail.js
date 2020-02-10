// pages/historyDetail/historyDetail.js
import router from '../../router/router.js';
import { getCacheUserInfo } from '../../api/localStorage/login.js';
import { pickingHistory,pickingHistoryDetails } from '../../api/agency/agency.js';
import dateUtil from '../../utils/dateUtil';
import Toast from "../../utils/toast.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickingHistoryDetail:null,
    pickingHistoryDetailList:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options && options.id) {
      let id = options.id
      this.getPickingHistoryDetails(id)
    }
  },
// 获取历史详情数据
  getPickingHistoryDetails(id){
    pickingHistoryDetails({id})
    .then(data=>{
      let pickingHistoryDetail=data.data;
      pickingHistoryDetail.deliveryTime = dateUtil.getDateTime(pickingHistoryDetail.deliveryTime);
      console.log(pickingHistoryDetail)
      this.setData({
        pickingHistoryDetail,
        pickingHistoryDetailList: data.data.list
      })
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 格式化时间
  formatList(pickList) {
    if (!pickList || !pickList.length) {
      return pickList;
    }
    pickList[deliveryTime] = dateUtil.getDateTime(pickList.deliveryTime);
  
    return pickList;
  },
 
  // 查看详情
  golistDetail(e) {
    let item = e.currentTarget.dataset.list;
    let isShow=true
    item = JSON.stringify(item)
    router.go('listDetail', { item, isShow });
  },
})