// ArrayBuffer转16进制字符串
const ab2U8str = (buffer) => {
  if (!buffer || !buffer.byteLength) {
    return "";
  }
  let hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function(byteItem) {
      return ('00' + byteItem.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

const u8arr2str = (u8arr) => {
  let result = Array.prototype.map.call(
    u8arr,
    function(byteItem) {
      return ('00' + byteItem.toString(16)).slice(-2)
    }
  )
  return result.join('');
}

// ArrayBuffer转16进制字符串
const ab2U16str = (buffer) => {
  if (!buffer || !buffer.byteLength) {
    return "";
  }
  let hexArr = Array.prototype.map.call(
    new Uint16Array(buffer),
    function(byteItem) {
      return ('0000' + byteItem.toString(16)).slice(-4)
    }
  )
  return hexArr.join('');
}
// ArrayBuffer转Uint8Array
const ab2U8arr = (buffer, isreverse) => {
  if (!buffer || !buffer.byteLength) {
    return;
  }
  let arr = new Uint8Array(buffer);
  return isreverse ? arr.reverse() : arr
}
// ArrayBuffer转Uint16Array
const ab2U16arr = (buffer, isreverse, islittleEndian) => {
  if (!buffer || !buffer.byteLength) {
    return;
  }
  let arr = new Uint16Array(buffer);
  isreverse ? arr.reverse() : null;
  return new Uint16Array(u16arr2ab(arr, false, islittleEndian));
}

// unit16数组转Arraybuffer,是否反转isreverse，是否小端序islittleEndian（默认大端序）
const u16arr2ab = (hexArr, isreverse, islittleEndian) => {
  let len = hexArr.length;
  isreverse ? hexArr.reverse() : null;
  let buffer = new ArrayBuffer(len * 2);
  let view = new DataView(buffer);
  for (let i = 0; i < len; i++) {
    view.setUint16(i * 2, hexArr[i], islittleEndian);
  }
  return buffer;
}

// unit8数组转Arraybuffer
const u8arr2ab = (hexArr, isreverse) => {
  let len = hexArr.length;
  isreverse ? hexArr.reverse() : null;
  let buffer = new ArrayBuffer(len);
  let view = new DataView(buffer);
  for (let i = 0; i < len; i++) {
    // 默认大端字节序
    view.setUint8(i, hexArr[i]);
  }
  return buffer;
}

// int转byte
const int2bytes = (n) => {
  let arr = new Uint16Array([n]);
  return new Uint8Array(arr.buffer);;
}
// 如果返回true，就是小端字节序；如果返回false，就是大端字节序。
const littleEndian = () => {
  var buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, 256, true);
  return new Int16Array(buffer)[0] === 256;
};

// 字符串转u8
const str2u8 = (str) => {
  let len = str.length;
  let arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(str.charCodeAt(i));
  }
  return new Uint8Array(arr);
};

const str2ab = (str) => {
  var buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};
const string2ab = (str) => {
  // 首先将字符串转为16进制
  let val = ""
  for (let i = 0; i < str.length; i++) {
    if (val === '') {
      val = str.charCodeAt(i).toString(16)
    } else {
      val += ',' + str.charCodeAt(i).toString(16)
    }
  }
  // 将16进制转化为ArrayBuffer
  return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function(h) {
    return parseInt(h, 16)
  })).buffer
}

//输入16进制数字字符转为16数字而非字符
const char2hex = (str) => {
  str = str.replace(/[^(a-f)|(A-F)\d]/ig, "");
  let arr = [];
  for (let i = 0; i <= str.length - 1; i++) {
    if (i % 2 == 0) {
      arr.push(parseInt(str.substr(i, 2), 16));
    }
  }
  return new Uint8Array(arr);
}

module.exports = {
  littleEndian,
  ab2U8str,
  ab2U16str,
  ab2U8arr,
  ab2U16arr,
  u16arr2ab,
  u8arr2ab,
  u8arr2str,
  int2bytes,
  str2ab,
  str2u8,
  string2ab,
  char2hex
}