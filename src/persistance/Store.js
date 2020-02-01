import Promise from 'promise';
import {each, find, isEqual, merge} from 'lodash-es';
import {pluralize, camelize} from 'inflection';
import Debug from '../utils/Debugger';
import $ from 'jquery';

const GENERIC_ERROR = "Sorry, something went wrong";
const CONNECTION_RETRY_MESSAGE = "Connection problem, retrying in <N> seconds";

// Whitelist, anything else won't be retried
const HTTP_RETRY = [
  0, // server did not respond
  499, // https://devcenter.heroku.com/articles/error-codes#h27-client-request-interrupted
  503, // generic heroku error code
];

const HTTP_MESSAGES = {
  401: "Sorry, you don't have permission to do that.",
  404: "Record is no longer there, please refresh the page",
  422: "Validation failed, please check your input",
  500: GENERIC_ERROR,
};

$.ajaxPrefilter((options, originalOptions, xhr) => {
  try {
    const token = $('meta[name="csrf-token"]').attr('content');

    if (token) {
      xhr.setRequestHeader('X-CSRF-Token', token);
    }
  } catch(e) {
    console.error(e);
  }
});



export default class Store {

  static RETRY_TIMES = 4;
  static GENERIC_ERROR = GENERIC_ERROR;
  static HTTP_MESSAGES = HTTP_MESSAGES;
  static CONNECTION_RETRY_MESSAGE = CONNECTION_RETRY_MESSAGE;

  // Private method, do not use!
  _get(record) {
    const records = this.store.getState()[this.name(record._t)];
    return find(records, ({id}) => id === record.id);
  }

  constructor(store, actions) {
    this.store = store;
    this.actions = actions;
    this.temporary = {};
    if (Object.keys(actions).length === 0) {
      throw new Error("Actions don't have any keys");
    }
  }

  name(type) {
    return pluralize(camelize(type, true));
  }

  set(record) {
    this.action(record._t).set(record);
  }

  clear(type) {
    this.action(type).clear();
  }

  remove(record) {
    this.action(record._t).remove(record);
  }

  getStore(record) {
    return this.action(record._t);
  }

  action(_t) {
    const key = this.name(_t);
    const action = this.actions[key];

    if (action) {
      return action;
    } else {
      const actions = Object.keys(this.actions).join(", ");
      throw new Error(`Actions (${actions}) don't contain key ${key}`);
    }
  }

  setAll(records) {
    let updateRecords = {};
    let swapRecords = {};

    // we need to make sure we swap the temporary records
    const temp = this.temporary[records._request_id];
    let temp_type, temp_records;
    if (temp) {
      [temp_type, temp_records] = temp;
      temp_type = this.name(temp_type);
      delete this.temporary[records._request_id];
    }

    // don't use the record's _t for a store name but the key

    if (records.constructor === Array) {
      if (records.length === 0) { return; }
      updateRecords[this.name(records[0]._t)] = records;
    } else {
      each(records, (records_array, type) => {
        if (type[0] === '_') { return; }
        if (type === temp_type) {
          swapRecords[this.name(type)] = [temp_records, records_array];
        } else {
          // skip empty arrays and nulls
          if (records_array && records_array.length > 0) {
            updateRecords[this.name(type)] = records_array;
          }
        }
      });
    }

    this.store.dispatch({
      type: 'batchUpdateArrays',
      update: updateRecords,
      swap: swapRecords,
    });
  }

  replaceRecords(records_array) {
    // skip empty arrays
    if (records_array.length == 0) {
      return;
    }
    this.actions[this.name(records_array[0]._t)].replaceAll(records_array);
  }

  setTemporary(request_id, records) {
    this.temporary[request_id] = [records[0]._t, records];
  }

  // -------- pushing stuff to the backend ------------

  randomId() {
    return Math.floor(Math.random()*100000000000000);
  }

  save(attributes) {
    try {
      return this._save(attributes);
    } catch (error) {
      console.error(error);
      return new Promise((resolve, reject) => { reject(); });
    }
  }

  _save(attributes) {
    if (!attributes._t) {
      throw new Error("Cannot save without type: " + JSON.stringify(attributes));
    }

    if (attributes.temp_record) {
      console.warn("Sorry, the record is still saving.");
      return new Promise((resolve, reject) => { reject(); });
    }

    // save only when there was a change or force is true
    // or when it's a temp_record (having negative id)
    if (attributes.id > 0) {
      if (isEqual(this._get(attributes), attributes)) {
        Debug.log('Saving same items');
        // no change was made
        return new Promise((resolve) => resolve());
      }
    }

    let method = 'POST';

    let controller = pluralize(attributes._t);
    let url = "/api/"+controller;
    if (attributes.id && attributes.id > 0) {
      url += "/"+attributes.id;
      method = 'PATCH';
    }

    let _temp_id = this.randomId();

    let data = {
      _request_id: _temp_id
    };
    this.setTemporary(_temp_id, [{...attributes, id: _temp_id}]);
    data[attributes._t] = attributes;

    let was_new = false;
    let temp_record = attributes;
    let old_record;
    if (!attributes.id || attributes.id < 0) {
      was_new = true;
      temp_record = {
        ...attributes,
        id: _temp_id,
        temp_record: true
      };
    } else {
      old_record = this._get(temp_record);
    }

    this.set(temp_record);

    // add the token here

    return this.wrapAjax({
      url: url,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      dataType: 'json',
      method: method,
      error: (response, retryInfo) => {
        if (was_new) {
          this.remove(temp_record);
        } else {
          this.set(old_record);
        }
      },
      success: (response, retryInfo) => {
        this.processResponse(response);
        retryInfo.resolve(response);
      }
    });
  }

  destroy (attributes) {
    let controller = pluralize(attributes._t);
    if (!attributes.id) {
      throw new Error("Can't remove unsaved record");
    }

    this.remove(attributes);

    return this.wrapAjax({
      url: "/api/"+controller+"/"+attributes.id,
      method: 'DELETE',
      success: (response) => {
        this.processResponse(response);
      },
      error: (response) => {
        // push the record back to store
        this.set(attributes);
      }
    });
  }

  // this setup allows us to retry multiple times
  wrapAjax(options) {
    // add CSRF token
    if (!options.data) { options.data = {}; }

    let send = (retryInfo) => {
      $.ajax({
        ...options,
        headers: {
          'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        },
        success: (response) => {
          if (retryInfo.retries > 0) {
            console.log("Success!");
          }
          if (options.success) {
            // the callback can handle resolve() itself if it has 2 arguments
            if (options.success.length > 1) {
              options.success(response, retryInfo);
            } else {
              options.success(response);
              retryInfo.resolve(response);
            }
          } else {
            retryInfo.resolve(response);
          }
        },
        error: (response) => {
          this.responseError(
            response, retryInfo,
          );
        }
      });
    };

    let promise = new Promise((resolve, reject) => {
      let retryInfo = {
        resolve: (response) => {
          resolve(response);
        },
        reject: (response) => {
          if (options.error) {
            options.error(response, retryInfo);
          }
          reject(response.responseJSON || response.statusText);
        },
        retries: 0,
        retry: send,
      };

      send(retryInfo);
    });

    return promise;
  }


  responseError(response, retryInfo) {
    // retry if the status code is whitelisted
    if (HTTP_RETRY.indexOf(response.status) > -1) {
      if (retryInfo.retries <= Store.RETRY_TIMES) {
        // step back timeout
        retryInfo.retries += 1;
        let delay = Math.pow(2, retryInfo.retries);

        // retry
        setTimeout(() => {
          retryInfo.retry(retryInfo);
        }, delay*1000);

        // apologize
        console.warn(CONNECTION_RETRY_MESSAGE.replace('<N>', delay), delay);
        return;
      }
    }

    const json = response.responseJSON;
    if (json && json.error && typeof(json.error) === "string") {
      console.error(json.error);
    } else if (json && json.notice) {
      console.log(json.notice);
    } else if (Store.HTTP_MESSAGES[response.status]) {
      console.error(Store.HTTP_MESSAGES[response.status]);
    } else {
      console.error(GENERIC_ERROR);
    }

    // definitive error, no more retries
    retryInfo.reject(response);
  }

  processResponse(response) {
    // destroy callback can just return true
    if (response === true) {
      return false;
    }

    if (!response) {
      return;
    }

    if (response.id) {
      throw new Error('Old response type: '+ JSON.stringify(response));
    }

    if (response._format === 1) {
      this.setAll(response);
    }
  }

}







