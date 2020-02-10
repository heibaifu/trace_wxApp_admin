import { deviceQRprefix, stationQRprefix } from '../config/app.config';
import { getEnctrySign } from "./sign";
import { getServerCurrentTime } from '../api/SYS/SYS';


const getQRid = (id, type) => {
  let md5Key, result = '';
  if (type == "device") {
    md5Key = getEnctrySign('code/product', { id }, 'qrcodeSign');
    result = `id=${id}&key=${md5Key}`;
    return result;
  }
}

const getQRCodeSourceUrl = (id, type) => {
  let qrprefix = "";
  let qrstr = "";
  if (type == "device") {
    qrprefix = deviceQRprefix;
    qrstr = getQRid(id, type)
    let result = qrprefix + "?" + qrstr;
    return result;
  }
  return
}

const getAsyncQRid = (id, type) => {

  return new Promise((resolve, reject) => {
    let md5Key, result = '';
    if (type == "station") {
      getServerCurrentTime()
        .then(res => {
          if (!res || !res.time) {
            reject();
          }
          let stamp = res.time;
          md5Key = getEnctrySign('wxapp/adorgroup/xzs/station', { id, stamp }, 'qrcodeSign');
          result = `id=${id}&stamp=${stamp}&key=${md5Key}`
          resolve(result);
        })
        .catch(() => { reject(); });
    }
  });
}

const getAsyncQRCodeSourceUrl = (id, type) => {
  return new Promise((resolve, reject) => {
    type = type || "station";
    let qrprefix = "";
    switch (type) {
      default:
      case "station":
        qrprefix = stationQRprefix;
        break;
    }
    getAsyncQRid(id, type)
      .then(qrstr => {
        if (!qrstr) {
          reject();
        }
        let result = qrprefix + "?" + qrstr;
        return resolve(result);
      })
      .catch(() => {
        return reject();
      })
  })
}


export {
  getQRCodeSourceUrl,
  getAsyncQRCodeSourceUrl
}