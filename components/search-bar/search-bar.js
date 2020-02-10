// components/search-bar/search-bar.js
import Toast  from '../../utils/toast.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: "输入要搜索的内容"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    searchText: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    searchClicked() {
      let searchText = this.data.searchText;
      if (searchText && searchText.length < 2) {
        Toast('请输入至少两个字符！');
        return;
      }
      this.triggerEvent("searchClicked", {
        searchText
      });
    },

    scanQrcodeClicked(){
      this.triggerEvent("scanQrcodeClicked");
    },

    clearSearchTextClicked(){
      let data = {
        searchText:''
      }
      this.setData(data);
      this.triggerEvent("clearSearchTextClicked");
    },

    getSearchText(e) {
      let data = {
        searchText: e.detail.value
      }
      this.setData(data);
    },
  }
})