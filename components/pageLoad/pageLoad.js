// components/pageLoad/pageLoad.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showInit:{
      type: Boolean,
      value: true
    },
    showNoInfo:{
      type: Boolean,
      value: false
    },
    showLoading:{
      type: Boolean,
      value: false
    },
    showHasMore: {
      type: Boolean,
      value: false
    }
  }
})
