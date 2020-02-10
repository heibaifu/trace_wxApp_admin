// pages/agencyChoose/agencyChoose.js

import router from '../../router/router.js';
import { getCacheUserInfo } from '../../api/localStorage/login.js';
import { pickingHistory } from '../../api/agency/agency.js';
import dateUtil from '../../utils/dateUtil';
import Toast from '../../utils/toast.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: dateUtil.getNowDate(),
    loading: {
      hasMore: true,
      show: false,
      pageIndex: 1,
      init: true,
      size: '10'
    },
    page:1,
    size:5,
    pickingHistoryList: []
  },
  onLoad() {
    this.getPickingHistory();

  },


  onShow: function () {


  },

  bindDateChange(e) {
    this.setData({ date: e.detail.value });
    this.getPickingHistory()

  },

  //  获取拣货历史数据
  getPickingHistory(isLoadMore) {
    this.setData({
      'loading.hasMore': false
    })
    if (isLoadMore) {
      this.setData({
        "loading.show": true,
      })
    } else {
      this.setData({
       page: 1,
      })
    }
    let { date } = this.data;
    if (!date) {
      Toast('请选择时间！');
      return;
    }
    pickingHistory({
      page: this.data.page,
      size: this.data.size,
      date
    })
      .then((res) => {
        let list = null;
        let hasMore = res.hasMore
        let { pickingHistoryList } = this.data;
        if (this.data.page == 1) {
          pickingHistoryList = []
        }
        if (res.data && res.data.length) {
          list = res.data;
          list = pickingHistoryList.concat(list);
        }else{
          list = pickingHistoryList;
        }
        this.setData({
          pickingHistoryList: this.formatList(list),
          'loading.hasMore': hasMore,
          'loading.pageIndex': this.data.loading.pageIndex + 1,
          'loading.show': false,
          "loading.init": false
        })
      })
      .catch(() => {
        this.setData({
          'loading.show': false,
          "loading.init": false,
        })
      })
  },

  //  加载更多
  loadMoreList() {
    if (this.data.loading.hasMore) {
      this.setData({
        page: this.data.loading.pageIndex + 1,
      })
      this.getPickingHistory(true);
    }
  },
  // 格式化时间
  formatList(pickList)  {
    if (!pickList || !pickList.length) {
      return pickList;
    }
    pickList.forEach((item => {
      item.startActTime = dateUtil.getDateTime(item.deliveryTime);
    }))

    return pickList;
  },

  /***********************跳转路由********************/
  gohistoryDetail(e) {
    let id = e.currentTarget.dataset.id;
    router.go('historyDetail',{id});
  }
})