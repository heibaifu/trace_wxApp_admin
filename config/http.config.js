let apiUrlPrefix = ""

//俊宝
//  apiUrlPrefix = "http://192.168.20.54:9300/";
// apiUrlPrefix = "http://47.103.71.160:9300/";
// 测试
// apiUrlPrefix = 'https://s.adorsmart.com/tta/'
// apiUrlPrefix = "https://api.trace.adorsmart.com/";
apiUrlPrefix = "https://gw.adorsmart.com/trace/";
// 
let picUrlPrefix = "http://ador-babycar.oss-cn-hangzhou.aliyuncs.com";
let signKey = "94a7cbbf8511a288d22d4cf8705d61d0";
let commonSign = '561wd03kkr86615s1de3x45s1d';
let qrcodeSign = '00461do1156916w1141c56r2ggw2';

module.exports = { 
  apiUrlPrefix,
  picUrlPrefix,
  signKey,
  commonSign,
  qrcodeSign
} 