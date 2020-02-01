import {each, isArray, map} from 'lodash-es';

export default class Listener {
  constructor() {
    this.isReady = false;
    this.onReadyCallbacks = [];

    Listener.instance = this;
  }

  connect() {
    console.log('connecting');
    this.socket = new WebSocket("ws://127.0.0.1:7643/ws");
    this.socket.onmessage = this.onMessage;

    this.socket.onopen = () => {
      console.log('we are ready');
      Listener.instance.ready();
    }

    this.socket.onclose = () => {
      if (this.isReady) {
        console.log('server disconnected');
        this.isReady = false;
        Actions.connected.set(false);
      }

      this.reconnectTimer = setTimeout(() => {
        this.connect();
      }, 2000);
    }
  }

  ready () {
    console.log('set connected');
    this.isReady = true;
    Actions.connected.set(true);
    let cb;

    while (cb = this.onReadyCallbacks.shift()) {
      cb(this);
    }
  }

  onReady(cb) {
    if (this.isReady) {
      cb(this);
    } else {
      this.onReadyCallbacks.push(cb);
    }
  }

  onMessage(event) {
    //console.log("SERVER SAYS:", event.data);
    if (event.data[0] == "{") {
      let data = JSON.parse(event.data);

      if (data._format === 1) {
        Listener.instance.onRecords([data]);
      }
    }
    /*
    const lines = event.data.split("\n");
    let newLog = this.state.log.slice();

    // TODO read response format
    lines.forEach((line) => {
      if (line[0] == "{") {
        return;
      } else {
        newLog.unshift(line);
      }
    });
    */
  };

  send(message) {
    // TODO warn unless sending serializable object
    let payload = JSON.stringify(message);
    if (payload[0] != "{") {
      throw new Error("Server only accepts JSON objects");
      if (!message["action"]) {
        throw new Error("Server only accepts JSON objects with key 'action'");
      }
    }
    this.onReady(() => {
      console.log('WS SEND:', payload);
      this.socket.send(payload);
    });
  }

  // TODO plug this in
  // merge records by record type and push them do store
  onRecords(data) {
    console.log('on records', data);
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

}

