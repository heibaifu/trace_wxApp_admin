import crc16 from '../lib/crc16/crc16_ccitt.js';
import arrbuffer from 'arrbuffer.js';

const crc16_u16arr = (pucBuf, length) => {
  let crcVal = crc16(pucBuf, length);
  return new Uint16Array([crcVal]);
};

const jsonCRC = (str) => {
  let arr = arrbuffer.str2u8(str);
  let crcCalVal = "0000" + crc16(arr).toString(16);
  let crcStr = crcCalVal.slice(-4);
  let resultStr = str + '"crc":"' + crcStr + '"}';
  return resultStr;
}

const crc16_u8arr = (pucBuf, isreverse, length) => {
  let u16 = crc16_u16arr(pucBuf, length)
  let u8 = new Uint8Array(u16.buffer);
  return isreverse ? u8.reverse() : u8;
};
// 是否小端序isbigEndian（默认大端序）
const concatCRC16 = (pucBuf, isLitteEndian, length) => {
  length = length || pucBuf.length;
  isLitteEndian = isLitteEndian || false;
  let crc16_value = crc16(pucBuf, length);
  let byte_len = length + 2;
  let buffer = new ArrayBuffer(byte_len);
  let view = new DataView(buffer);
  for (let i = 0; i < length; i++) {
    // 默认大端字节序
    view.setUint8(i, pucBuf[i]);
  }
  view.setUint16(length, crc16_value, isLitteEndian);
  return buffer;
};

module.exports = {
  jsonCRC,
  crc16,
  crc16_u16arr,
  crc16_u8arr,
  concatCRC16
};