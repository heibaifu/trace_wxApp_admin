// private double stationIntervalTime = 1; //站点收费 间隔时间
// private double stationUnitPrice = 1; //站点收费 单价
// private double deviceIntervalTime = 1; //设备 收费 间隔时间
// private double deviceUnitPrice = 1; //设备收费单价
import dateUtil from "../../utils/dateUtil.js";
import {
  setCacheOrderInfo
} from "../../api/localStorage/order.js";
import {
  fetchOrderList,
  fetchOrderDetail
} from "../../api/order/order.js";

import numberFilter from "../../utils/filter/number.js";

// 计算价格
const calPrice = (priceData) => {
  let st = priceData.stationIntervalTime;
  let sp = priceData.stationUnitPrice;
  let dt = priceData.deviceIntervalTime;
  let dp = priceData.deviceUnitPrice;

  let unitPrice = null;
  let intervalTime = null;
  if (st == dt) {
    unitPrice = sp + dp;
    intervalTime = st;
  } else if (st > dt) {
    intervalTime = st;
    unitPrice = sp + (dp * st) / dt
  } else {
    intervalTime = dt;
    unitPrice = dp + (sp * dt) / st
  }

  return {
    price: numberFilter(unitPrice),
    time: intervalTime,
    stationIntervalTime: priceData.stationIntervalTime,
    stationUnitPrice: priceData.stationUnitPrice,
    deviceIntervalTime: priceData.deviceIntervalTime,
    deviceUnitPrice: priceData.deviceUnitPrice
  }
}

// 计算金额
const calAmount = (priceData, timeStamp) => {
  let st = priceData.stationIntervalTime;
  let sp = priceData.stationUnitPrice;
  let dt = priceData.deviceIntervalTime;
  let dp = priceData.deviceUnitPrice;

  let staAmount = sp * Math.ceil(timeStamp / (st * 3600));
  let dvcAmount = dp * Math.ceil(timeStamp / (dt * 3600));
  return numberFilter(staAmount + dvcAmount);
}

// 格式化订单列表
const formatOrderList = (orderList, orderDateMap) => {
  if (!orderList || orderList.length == 0) {
    return orderDateMap;
  }
  orderList.forEach((order => {
    let actDateNum = Math.ceil(parseInt(order.createTime) / (3600 * 24) * -1);
    order.startActTime = dateUtil.getDateTime(order.createTime, false);
    order.overActTime = dateUtil.getDateTime(order.overtimeTime, false);
    order.startActDate = dateUtil.getDateTime(order.createTime, false, null, true);
    let startActDate = order.startActDate;
    if (!orderDateMap.hasOwnProperty(actDateNum)) {
      orderDateMap[actDateNum] = {
        date: startActDate,
        list: []
      } 
    }
    orderDateMap[actDateNum]['list'].push(order);
  }))
  return orderDateMap;
}

// 格式化订单列表
const formatStationOrderList = (orderList) => {
  if (!orderList || !orderList.length) {
    return orderList;
  }
  orderList.forEach((order => {
    order.startActTime = dateUtil.getDateTime(order.createTime);
    order.endActTime = order.endTime ? dateUtil.getDateTime(order.endTime) : null;
    order.overActTime = dateUtil.getDateTime(order.overtimeTime, false);
    order.amount = order.amount ? numberFilter(order.amount) : null;
  }))
  return orderList;
}

// 格式化订单详情
const formatOrderDetail = (orderDetail) => {
  if (orderDetail) {
    let duration = Math.ceil((parseInt(orderDetail.endTime) - parseInt(orderDetail.createTime))/1000);
    orderDetail.startActTime = dateUtil.getDateTime(orderDetail.createTime);
    orderDetail.endActTime = dateUtil.getDateTime(orderDetail.endTime);
    orderDetail.overActTime = dateUtil.getDateTime(orderDetail.overtimeTime);
    orderDetail.duration = dateUtil.formatDuration_hanzi(duration);  
    return orderDetail;
  }
}

// 订单完成支付
const orderPayFinished = () => {
  setCacheOrderInfo(null);
}

// 查找未完成的订单
const searchUnfinishedOrder = () => {
  return fetchOrderList(1, 1).then((res) => {
    if (res && res.totalNum > 0) {
      let orderNum = res.data[0].orderNum;
      return fetchOrderDetail(orderNum)
    }

    if (res && res.totalNum == 0) {
      return Promise.resolve(0);
    }
  })
}
const getFormatUnfinishedOrderList = (orderList, time, stamp13) => {
  let serverTime = time;
  let newOrderList = orderList.map(item => {
    if (stamp13) {
      item.startTime = item.startTime ? parseInt(item.startTime / 1000) : null;
      item.endTime = item.endTime ? parseInt(item.endTime / 1000) : null;
    }

    let startActTime = dateUtil.getDateTime_stamp10(item.startTime);
    let endActTime = item.endTime ? dateUtil.getDateTime_stamp10(item.endTime) : null;
    let amount = item.amount ? numberFilter(item.amount) : null;
    if (!item.endTime || item.endTime <= 0) {
      let endTime = Math.ceil(serverTime / 1000);
      let secords = Math.ceil(endTime) - item.startTime;
      let timeUnit = getDuaringUnit(secords, item.unitPriceType);
      let minTimeUnit = parseInt(item.minimumTerm);
      // let intervalUnit = Math.ceil(timeUnit / item.devicePriceInterval);
      let duration = timeUnit + unitTypeEnum[item.unitPriceType];
      let actUnit = timeUnit < minTimeUnit ? minTimeUnit : timeUnit;
      let actAmount = item.expression ? getExpressionAmount(actUnit, item.expression) : getConstantPriceAmount(actUnit, item.deviceUnitPrice);
      return {
        ...item,
        startActTime,
        endActTime,
        duration,
        amount,
        actAmount
      }
    } else {
      let endTime = item.endTime;
      let secords = Math.ceil(endTime) - item.startTime;
      let timeUnit = getDuaringUnit(secords, item.unitPriceType);
      let duration = timeUnit + unitTypeEnum[item.unitPriceType];
      let amount = numberFilter(item.amount);
      return {
        ...item,
        amount,
        startActTime,
        endActTime,
        duration
      }
    }
  })
  return newOrderList
}

module.exports = {
  formatOrderList,
  formatStationOrderList,
  formatOrderDetail,
  calPrice,
  calAmount,
  orderPayFinished,
  searchUnfinishedOrder,
  getFormatUnfinishedOrderList
}