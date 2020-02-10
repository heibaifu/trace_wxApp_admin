const crc16_modbus = (pucBuf, uwLength) => {
  // 多项式
  let CRC_POLY = 0x1021;
  uwLength = uwLength || pucBuf.length;
  // 初始值
  let uiCRCValue = 0x0000;
  let resXORvalue = 0x0000;
  let ucLoop;
  let i = 0;
  while (uwLength--) {
    uiCRCValue ^= pucBuf[i];
    i++;
    for (ucLoop = 0; ucLoop < 8; ucLoop++) {
      if (uiCRCValue & 0x0001) {
        uiCRCValue >>= 1;
        uiCRCValue ^= CRC_POLY;
      } else {
        uiCRCValue >>= 1;
      }
    }
  }
  uiCRCValue ^= resXORvalue;
  return uiCRCValue;
}


module.exports = crc16_modbus;