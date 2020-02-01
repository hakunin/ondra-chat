
export default class Data {

  static get(url, data = null, options = {}) {
    return this._ajax('GET', url, data, options);
  }

  static post(url, data, options = {}) {
    return this._ajax('POST', url, data, options);
  }

  static put(url, data, options = {}) {
    return this._ajax('PUT', url, data, options);
  }

  static push(data) {
    Store.setAll(data);
  }

  static pushOne(record) {
    Store.set(record);
  }

  static fill(data) {
    Store.setAll(data);
  }

  static _ajax(method, url, data, options = {}) {
    let params = {
      method: method,
      url: url,
      success: (response) => {
        Store.processResponse(response);
      },
      ...options
    };
    if (method === 'GET') {
      params.data = data;
    } else if (data) {
      params.data = {json: JSON.stringify(data)};
      params.dataType = 'json';
    }
    return Store.wrapAjax(params);
  }

}


