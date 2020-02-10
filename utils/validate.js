import Toast from "./toast.js";

const mobileValidate = (num, noToast) => {
  if (!num || num.toString().length != 11 || !/^[1][3,4,5,7,8][0-9]{9}$/.test(num)) {
    !noToast && Toast("请输入正确的手机号！")
    return;
  }
  return true;
}

const verifyImageCodeValidate = (num) => {
  if (!num || num.toString().length < 4) {
    Toast("请输入正确的图片验证码！")
    return;
  }
  return true;
}



module.exports = {
  mobileValidate,
  verifyImageCodeValidate
}