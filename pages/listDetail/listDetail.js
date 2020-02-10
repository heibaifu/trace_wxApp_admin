// pages/listDetail/listDetail.js
import router from '../../router/router.js';
import Toast from '../../utils/toast.js';
import { pickingDetail } from '../../api/agency/agency.js';
import {
  getSingleNumberInformationInfo, setSingleNumberInformation, getInitializeData, getBoxArrData,
  setBoxArrData,
  setCodeArrData,
  getCodeArrData
} from '../../api/localStorage/agency.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetailArr: null,
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options && options.item) {
      let list = JSON.parse(options.item);
      let isShow = options.isShow
      let number = list.detail
      if (number && number.length) {
        number = number.replace('null,', '')
        number = number.replace('null', '')
        if (number.substr(0, 1) == ',') {
          number = number.substr(1);
        }
        this.setData({ list, isShow })
        number = this.getCodeArrStrWithoutSymbol(number)
        this.getDetail(number)
      }
    }
  },
  // 去除多余的逗号
  getCodeArrStrWithoutSymbol (str) {
    if (!str || !str.length || str == 'null') {
      return "";
    }
    let arr = str.split(',').filter(item => Boolean(item));
    return arr.length ? arr.join() : "";
  },

  // 获取拣货详情
  getDetail(number) {

    pickingDetail({ number })
      .then(data => {
        this.setData({ goodsDetailArr: data })
      })
  },

  // 点击删除
  clickDelete(e) {
    let uniqueCode = e.target.dataset.id;
    let index = e.target.dataset.index;
    var goodsDetailArr = this.data.goodsDetailArr;
    let initializeData = getInitializeData('_initializeData');
    var result = initializeData.some(v => {
      if (v.uniqueCode.indexOf(uniqueCode) > -1 || v.boxCode.indexOf(uniqueCode) > -1) {
        return true
      }
    })
    if (result) {
      Toast('不能删除已出库数据');
    } else {
      this.setDelateData(uniqueCode);
      goodsDetailArr.splice(index, 1);
    }
    this.setData({
      goodsDetailArr
    })

  },

  // 设置删除后的缓存数据
  setDelateData(uniqueCode) {
    let { list, goodsDetailArr } = this.data
    let pickList = getSingleNumberInformationInfo('_singleNumberInformation');
    let boxArr = getBoxArrData('_boxArrData');
    let codeArr = getCodeArrData('_codeArrData')
    boxArr = this.removeByValue(boxArr, uniqueCode);
    codeArr = this.removeByValue(codeArr, uniqueCode);
    pickList.forEach(v => {
      if (v.id == list.id) {
        if (uniqueCode.substr(0, 1) == "X") {
          goodsDetailArr.forEach(item => {
            if (item.uniqueCode.indexOf(uniqueCode) > -1) {
              v.sweepEdCount = v.sweepEdCount - item.capacity
            }
          })
          v.boxCount--
          v.boxCode = v.boxCode.replace(uniqueCode , '');
          v.detail = v.detail.replace('null', '');
          v.detail = v.detail.replace(uniqueCode, '');
        } else {
          v.oneCount--
          v.uniqueCode = v.uniqueCode.replace(uniqueCode , '');
          v.detail = v.detail.replace('null', '');
          v.detail = v.detail.replace( uniqueCode, '');
          v.sweepEdCount--
        }
        
      }
    })

    setSingleNumberInformation(pickList);
    if (boxArr){
    setBoxArrData(boxArr);
    } else { setBoxArrData([]);}
    if (codeArr){
    setCodeArrData(codeArr);
    }else{
      setCodeArrData([]); 
    }
  },

  removeByValue(arr, val) {
    if (arr && arr.length) {
      arr.forEach(item => {
        if (item.uniqueCode == val) {
          var index = arr.indexOf(item);
          if (index > -1) {
            arr.splice(index, 1);
          }
        }
      })
     
      return arr
    }

  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  goAgencyBoxList(e) {
    let id = e.currentTarget.dataset.id;
    router.go('agencyBoxList', { id });
  },



})