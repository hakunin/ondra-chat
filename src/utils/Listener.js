import {each, isArray, map} from 'lodash-es';

/*
var ably = new Ably.Realtime('e8xKpg.c1_sWA:GrOOTXj2XuSzD9c0');
var channel = ably.channels.get('test');

// Publish a message to the test channel
channel.publish('greeting', 'hello');

// Subscribe to messages on channel
channel.subscribe('greeting', function(message) {
  alert(message.data);
});
*/

export default class Listener {
  constructor() {
    Listener.instance = this;
  }

  connect() {
    this.ably = new Ably.Realtime('e8xKpg.c1_sWA:GrOOTXj2XuSzD9c0');

    this.channel = ably.channels.get('test');
  }

}

