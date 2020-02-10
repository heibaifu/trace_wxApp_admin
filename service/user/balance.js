import { getDate_stamp10, getDateTime_stamp10 } from "../../utils/dateUtil.js";

const formatBalanceNumArray = (numArr) => {

  if (!numArr || numArr.length == 0) {
    return numArr;
  }
  return numArr.map(item => {
    if (item.giftAmount && item.endTime > 0) {
      item.endActTime = getDate_stamp10(item.endTime, true);
    }
    return item
  })
}

// remark: "充值0.01", createTime: 1543219719, changeAmount: 0.01, changeType: 3
const formatBalanceLog = (numArr) => {

  if (!numArr || numArr.length == 0) {
    return numArr;
  }
  return numArr.map(item => {
    if (item.createTime) {
      item.createActTime = getDateTime_stamp10(item.createTime, true);
    }
    return item;
  });
}


module.exports = {
  formatBalanceNumArray,
  formatBalanceLog
}