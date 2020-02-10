import { DEVICE_STATUS} from '../../enum/station.js';
import numberFilter from '../../utils/filter/number.js';
import {getDateTime} from '../../utils/dateUtil.js'
// 格式化订单详情
const formatDeviceList = (list) => {
  if (!list || !list.length){
    return list
  }
  list.forEach(item=>{
    item.statusName = DEVICE_STATUS[item.status];   
    item.unitPrice = numberFilter(item.unitPrice);

    if (item.status == 0){
      //可使用
      if (item.endTime){
        item.showDateDetail = `归还时间：${getDateTime(item.endTime, true)}`
      }      
    } else if(item.status == 1){
      if (item.startTime) {
        item.showDateDetail = `借出时间：${getDateTime(item.startTime, true)}`
      }
    }
  })
  return list;
}

// 格式化订单详情
const formatStationList = (list) => {
  if (!list || !list.length) {
    return list
  }
  list.forEach(item => {  
    item.unitPrice = numberFilter(item.unitPrice);
  })
  return list;
}

module.exports = {
  formatDeviceList,
  formatStationList
}