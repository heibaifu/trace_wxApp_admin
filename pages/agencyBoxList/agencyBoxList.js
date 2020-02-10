// pages/agencyBoxList/agencyBoxList.js
import { getPackingDetails } from "../../api/agency/agency.js";
import router from '../../router/router.js';
import Toast from "../../utils/toast.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    packList:[]
  },
  onLoad: function (options) {
    if (options && options.id) {
      let id = options.id;
      this.setData({id});
    }
  },
  // 获取数据
  getPageData() {
    let { id } = this.data;
    getPackingDetails({ id })
      .then(res => {
        this.setData({packList:res});    
      })
  },

  onShow: function () {
    this.getPageData();
  },

  

})