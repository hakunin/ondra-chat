import React from 'react';
import {connect} from 'react-redux';
import {map} from 'lodash-es';

export class Communication extends React.Component {

  constructor(props) {
    super(props);
    Communication.instance = this;
    this.ably = new Ably.Realtime('e8xKpg.c1_sWA:GrOOTXj2XuSzD9c0');
  }

  connect() {
    this.channel = this.ably.channels.get(this.props.user.channel);
    this.channel.subscribe('friendRequest', this.onFriendRequest);
    this.channel.subscribe('message', this.onMessage);
  }

  componentWillMount() {
    if (this.channel) { return; }

    if (this.props.user.channel) {
      this.connect();
    }
  }

  componentDidUpdate() {
    if (this.channel) { return; }

    if (this.props.user.channel) {
      this.connect();
    }
  }

  sendFriendRequest(channelName) {
    let channel = this.ably.channels.get(channelName);
    channel.publish("friendRequest", this.props.user);
  }

  sendMessage(channel, message) {
    console.log('SEND MESSAGE', channel, message);
    this.ably.channels.get(channel).publish("message", message);
  }

  onFriendRequest(e) {
    Actions.contacts.merge({
      [e.data.channel]: e.data
    });
  }

  onMessage(e) {
    console.log('GOT A MESSAGE!', e);

    const channel = e.data.from.channel;
    const messages = redux.getState().messages[channel] || [];

    Actions.messages.merge({
      [channel]: messages.concat(e.data)
    });
  }

  render() {
    return null;
  }
};

export default connect((state, props) => {
  return {
    user: state.user || {},
  }
})(Communication);

