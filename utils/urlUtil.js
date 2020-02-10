const joinParam = (url, params) => {
    if (!params) {
      return url
    }

    return Object.keys(params).filter(item => (params[item] || params[item] === 0)).reduce((url, key) => {
        return url + key + "=" + params[key] + "&";
      }, url + "?").slice(0, -1);
    }

    //解析url
    const parseUrl = (url) => {
      let arr = url.split("?");
      let location = arr[0];
      let query = arr[1];
      let result = {
        location: location,
        args: null
      };
      let args = {};
      if (!query) {
        return result;
      }
      let items = query.split("&");
      let item = null,
        name = null,
        value = null;
      for (let i = 0; i < items.length; i++) {
        item = items[i].split("=");
        if (item[0]) {
          name = item[0];
          value = item[1] ? item[1] : "";
          args[name] = value;
        }
      }
      result.args = args;
      return result;
    }

    module.exports = {
      joinParam,
      parseUrl
    }