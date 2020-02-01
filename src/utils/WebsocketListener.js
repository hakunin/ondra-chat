import {Component} from 'react';
import PropTypes from 'prop-types';
import {each, isArray, map} from 'lodash-es';
import {connect} from 'react-redux';

import Store from '../persistance/Store';

/*

var PUSHR_BINDING = {
  record: 'onRecord',
  records: 'onRecords',
  replaceRecords: 'onReplaceRecords',
  destroy: 'onDestroy',
  custom_event: 'onCustomEvent',
  flash: 'onFlash',
};

export class WebsocketListener extends Component {

  componentWillMount() {
    WebsocketListener.instance = this;
    this.socket = new WebSocket("ws://127.0.0.1:7643/ws");
    this.socket.onmessage = this.onMessage;

    // TODO reconnect on disconnect
  }


  // TODO plug this in
  // merge records by record type and push them do store
  onRecords(data) {
    var merged = {};
    each(data, (records) => {
      each(records, (obj, _kind) => {
        // keep special parms untouched
        if (_kind[0] == '_') {
          merged[_kind] = obj;

        // process records normally
        } else {
          const kind = Store.name(_kind);
          if (isArray(obj)) {
            if (merged[kind] == null) {
              merged[kind] = [];
            }
            merged[kind] = merged[kind].concat(obj);
          } else {
            merged[kind] = obj;
          }
        }
      });
    });
    Store.setAll(merged);
  }

  onReplaceRecords(data) {
    each(data[0], (records, type) => {
      Store.replaceRecords(records);
    });
  }

  onRecord(data) {
    Store.setAll(data);
    return data;
  }

  onDestroy(data) {
    Store.remove(data);
  }

  onCustomEvent(data) {
    $(this).trigger(data.event_name, data);
  }

  onFlash(data) {
    each(data.flashes, ({severity, message}) => {
      Flash[severity](message);
    });
  }

  render() {
    return null;
  }
}

PusherListener.log = () => Debug.log;

PusherListener.propTypes = {
  currentUserId: PropTypes.number.isRequired,
  currentProjectId: PropTypes.number,
  privatePrefix: PropTypes.array.isRequired,
  publicPrefix: PropTypes.array.isRequired,
  pusherNamespace: PropTypes.string.isRequired,
};

export default connect((state) => {
  return {
    pusherNamespace: state.pusherNamespace,
    currentUserId: state.currentUserId,
    currentProjectId: state.currentProjectId,
    privatePrefix: ["private", state.pusherNamespace],
    publicPrefix:  ["public",  state.pusherNamespace],
  };
})(PusherListener);

// Because of ImportProgress.coffee
window.PusherListener = PusherListener;

*/
