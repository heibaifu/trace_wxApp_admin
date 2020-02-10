// pages/agencyChoose/agencyChoose.js

import router from '../../router/router.js';
import {
  getSingleNumberInformationInfo, setSingleNumberInformation, setInitializeData, getInitializeData, getBoxArrData,
  setBoxArrData,
  setCodeArrData,
  getCodeArrData
} from '../../api/localStorage/agency.js';
import { getSingleNumberInformation, getCodeDetail, confirmDelivery } from '../../api/agency/agency.js';
import dateUtil from '../../utils/dateUtil';
import { scanTraceCodeWithKey } from '../../api/wx/wxScanCode.js';
import Toast from '../../utils/toast.js'
Page({

  data: {
    oddNumber: null,
    pickList: null,
    dealerName: null,
    phone: null,
    uniqueCode: null,
    codeArr: [],
    boxArr: [],
    oddId: null,
    list: null,
    boxUniqueCodeList: null,
    productUniqueCodeList: null,
    productCodeList: null,
    boxArrList: [],
    boxArrList: [],
    isScanning: false
  },
  onLoad: function (options) {
    setBoxArrData([]);
    setCodeArrData([]);
    if (options && options.trackingNumber) {
      let oddNumber = options.trackingNumber;
      this.getSingleInformation(oddNumber);
      this.setData({
        oddNumber
      });
    }

  },


  onShow: function () {

    if (this.data.isScanning) {
      this.setData({
        isScanning: false
      })
      return;
    }

    let pickList = getSingleNumberInformationInfo('_singleNumberInformation');
    this.setData({ pickList });

  },
  // 获取拣货数据
  getSingleInformation(oddNumber) {
    getSingleNumberInformation({
      oddNumber
    })
      .then(res => {
        setSingleNumberInformation(res.list);
        // // 缓存初始化数据
        setInitializeData(res.list);
        this.setData({
          pickList: res.list,
          dealerName: res.dealerName || '--',
          phone: res.phone || '--',
          oddId: res.id
        })
      })
  },
  scanCode() {
    this.setData({
      isScanning: true
    })
    scanTraceCodeWithKey()
      .then(res => {
        this.getCodeDetail(res.code)
      })
  },
  // 获取码详情
  getCodeDetail(uniqueCode) {
    getCodeDetail({ uniqueCode })
      .then(data => {
        if (!data.boxVo && !data.productVo) {
          Toast(data.log);
          return
        }
        let { pickList } = this.data;
        let boxArr = getBoxArrData('_boxArrData');
        let boxArrList = getBoxArrData('_boxArrData');;
        let codeArrList = getCodeArrData('_codeArrData');
        let codeArr = getCodeArrData('_codeArrData');
        let list = {};
        let initializeData = getInitializeData('_initializeData');
        var result = pickList.some(item => {
          if (item.number == data.number) {
            return true
          }
        })
        if (result) {

          let isValid = this.verifyCOde({
            pickList, number: data.number, initializeData, uniqueCode, codeArr,
            productVo: data.productVo, boxArr, boxVo: data.boxVo, productUniqueCodeList: data.productUniqueCodeList
          })
          if (isValid) {
            this.formatCode(pickList, uniqueCode, data.productVo, data.number, codeArrList, boxArrList, data.boxVo);
          }

        } else {
          wx.showModal({
            title: '提示',
            content: '该商品不在订单列表中',
            success: (res) => {
            }
          })
          return;

        }
        this.setData({ pickList });
        setSingleNumberInformation(pickList);
      })
  },
  // 验证码是否有效
  verifyCOde(verifyData) {
    let { pickList, number, initializeData, uniqueCode, codeArr, productVo, boxArr, boxVo, productUniqueCodeList } = verifyData
    let productCodeList = this.data.productCodeList
    let isValid = pickList.some(v => {
      if (v.number === number) {
        let res = this.isDelivery(initializeData, uniqueCode, productCodeList);
        
        if (res) {
          return
        }

        if (productVo) {

          if (!codeArr && !codeArr.length) {
            codeArr = []
          }
          if (productCodeList && productCodeList.find(value => value === uniqueCode)) {
            Toast("此为箱子里面的码!");
            return false;
          } else {
            if (codeArr.find(item => item.uniqueCode === uniqueCode)) {
              Toast("请勿重复添加!");
              return false;
            } else {
              return true
            }
          }
        }
        if (boxVo) {
          if (!boxArr && !boxArr.length) {
            boxArr = []
          }
          productCodeList = productUniqueCodeList
          let result = this.deepValidate(productCodeList, v.uniqueCode);
          if (!result){
Toast('此码已出库')
return
          }
          this.setData({ productCodeList })
          if (codeArr.find(item => this.data.productCodeList.indexOf(item.uniqueCode) > -1)) {
            Toast('请勿重复添加,箱码')
            return false
          } else {
            if (boxArr.find(item => item.uniqueCode === uniqueCode)) {
              Toast("请勿重复添加!");
              return false;
            } else {
              return true
            }
          }
        }
        // this.formatCode(pickList, uniqueCode, productVo, number, codeArrList, boxArrList, boxVo);
      }
    })
    return isValid
  },
  // 格式化码 (把码放入列表)
  formatCode(pickList, uniqueCode, productVo, number, codeArrList, boxArrList, boxVo) {
    let list = {};
    list.uniqueCode = uniqueCode;
    pickList.forEach(v => {
      if (v.number === number) {
        if (productVo) {
          codeArrList.push(list);
          setCodeArrData(codeArrList)
          v.sweepEdCount++;
          v.oneCount++;
          v.uniqueCode = v.uniqueCode ? (v.uniqueCode + ',' + uniqueCode) : uniqueCode;
        }
        if (boxVo) {
          boxArrList.push(list);
          setBoxArrData(boxArrList)
          v.boxCount++;
          let specification = JSON.parse(boxVo.specification)
          v.sweepEdCount = v.sweepEdCount + specification.boxCapacity;
          v.boxCode = v.boxCode ? (v.boxCode + ',' + uniqueCode) : uniqueCode;
        }
        v.detail = v.detail ? (v.detail + ',' + uniqueCode) : uniqueCode;
      }
    })
    return
  },
  // 判断码是否出库
  isDelivery(initializeData, uniqueCode, productCodeList) {
    let res = initializeData.some(item => {
      if (item.boxCode.indexOf(uniqueCode) > -1 || item.uniqueCode.indexOf(uniqueCode) > -1) {
        Toast("此码已出库！");
        return true
      }
    })
    return res
  },




  //深度检测
  deepValidate (codeList, validateList) {
    
    if (!codeList || !codeList.length || !validateList || !validateList.length) {
      return true;
    }
    // codeList = codeList.split(',')
    validateList = validateList.split(',')
    for (let i = 0; i < codeList.length; i++) {
      let item = codeList[i];
      let index = validateList.indexOf(item);
      if (index != -1) {
        return false;
        break;
      }
    }
    return true;
  },


  // 确认发货
  confirmDelivery() {
    this.getParams()
    let { list, boxUniqueCodeList, productUniqueCodeList, oddId, oddNumber } = this.data
    let parmas = { list, id: oddId, trackingNumber: oddNumber }
    if (productUniqueCodeList && productUniqueCodeList.length) {
      parmas.productUniqueCodeList = productUniqueCodeList;
    }
    if (boxUniqueCodeList && boxUniqueCodeList.length) {
      parmas.boxUniqueCodeList = boxUniqueCodeList;
    }

    if (!boxUniqueCodeList.length && !productUniqueCodeList.length) {
      Toast('请先扫描二维码!')
      return;
    }

    wx.showModal({
      title: '提示',
      content: '请确认出库？',
      success: (res) => {
        if (res.confirm) {
          confirmDelivery(parmas)
            .then(data => {
              wx.showToast({
                title: "发货成功",
                icon: "success",
                duration: 2000
              });
              setTimeout(() => {
                this.goIndex();
              }, 500)
            })
        }
      }
    })

  },

  // 格式化参数
  formatParams(pickList) {
    if (!pickList || !pickList.length) {
      return []
    }

    let result = pickList.map(item => {
      let { boxCode, id, sweepEdCount, uniqueCode } = item;
      return {
        id, sweepEdCount,
        boxCode: this.getCodeArrStrWithoutSymbol(boxCode),
        uniqueCode: this.getCodeArrStrWithoutSymbol(uniqueCode)
      }
    })
    return result;
  },

  // 去除多余的逗号
  getCodeArrStrWithoutSymbol(str) {
    if (!str || !str.length || str == 'null') {
      return "";
    }
    let arr = str.split(',').filter(item => Boolean(item));
    return arr.length ? arr.join() : "";
  },

  // 删除没有码的列表
  delateList(pickList) {
    pickList.forEach(item => {
      if (!item.boxCode && !item.uniqueCode && !item.sweepEdCount) {
        var index = pickList.indexOf(item);
        if (index > -1) {
          pickList.splice(index, 1);
        }
      }
    })
  },
  // 过滤已出库的码
  filteCode(pickList) {
    let initializeData = getInitializeData('_initializeData');
    initializeData.forEach(v => {
      pickList.map(item => {
        if (item.uniqueCode.indexOf(v.uniqueCode) > -1) {
          item.uniqueCode = item.uniqueCode.replace(v.uniqueCode, '')
        }
        if (item.boxCode.indexOf(v.boxCode) > -1) {
          item.boxCode = item.boxCode.replace(v.boxCode, '')
        }
      })
    })

  },
  // 处理参数
  getParams() {
    let { pickList } = this.data;
    let boxArr = getBoxArrData('_boxArrData')
    let codeArr = getCodeArrData('_codeArrData');
    // this.filteCode(pickList);
    pickList = this.formatParams(pickList);
    console.log(pickList)
    // this.delateList(pickList);
    let boxUniqueCodeList = ''
    let productUniqueCodeList = ''
    let list = JSON.stringify(pickList);
  
    if (boxArr && boxArr.length) {
      boxUniqueCodeList = boxArr.map(v => v.uniqueCode);
    }
    if (codeArr && codeArr.length) {
      productUniqueCodeList = codeArr.map(v => v.uniqueCode);
    }
    this.setData({ list, boxUniqueCodeList, productUniqueCodeList });
  },

  onUnload() {
    setBoxArrData(null)
    setCodeArrData(null)
    setSingleNumberInformation(null)
    setInitializeData(null)
  },
  /**************************, boxUniqueCodeList*************跳转路由************************************/
  // 查看详情
  golistDetail(e) {
    let item = e.currentTarget.dataset.list;
    item = JSON.stringify(item)
    let isShow = false
    router.go('listDetail', { item, isShow });
  },
  // 拣货出库
  godeliverManage() {
    wx.setStorage({
      key: '_trackingNumber',
      data: null,
    })
    router.goBack('deliverManage');
  },
  goIndex() {
    router.goIndex();
  }
})