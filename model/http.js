import { baseUrl } from '../config/config.js';

const request = Symbol('request');

export default class Http {

  [request] (opt = {})  {
    return new Promise((resolve, reject) => {
      let url = opt.url;
      if (!url) {
        throw new Error('非法请求，请填写正确的URL地址');
      }

      let method = opt.method || 'GET',
          header = opt.header || {},
          data = opt.data || null,
          dataType = opt.dataType || 'json',
          responseType = opt.responseType || 'text';

      wx.request({
        url: baseUrl + url,
        method,
        header,
        data,
        dataType,
        responseType,
        success: resolve,
        error: reject,
        complete: function () { }
      });
    });
  }

  ajax (opt) {
    return this[request](opt);
  }

  get (url, data = {}, opt = {}) {
    return this.ajax(Object.assign({}, opt, {
      url,
      data,
      method: 'GET'
    }));
  }

  post(url, data = {}, opt = {}) {
    return this[request](Object.assign({}, opt, {
      url,
      data,
      method: 'POST'
    }));
  }

}