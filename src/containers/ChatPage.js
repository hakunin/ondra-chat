import React from 'react';
import {connect} from 'react-redux';
import '../styles.css';
import Message from '../components/message.js';
import Compose from '../components/compose.js';
import {Communication} from '../utils/Communication';

const users = {
  dad: {
    avatar: "👩‍🦲",
  },
  mom: {
    avatar:"👩",
  },
  me: {
    isMe: true,
    avatar: "🧒",
  }
};

export class Chat extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      messages: [
        {from: users.dad, text: 'AHOJ'},
        {from: users.dad, text: 'ONDRO'},
        {from: users.me, text: 'AHOJ'},
        {from: users.me, text: 'TATI'},
      ],
    };
  }

  handleSend = (message) => {
    Communication.instance.sendMessage(
      this.props.match.params.id,
      message
    );

    Actions.messages.merge(
      {[this.props.match.params.id]: 
        this.props.messages.concat(message)
      }
    );
  }

  render() {
    return (
      <div className="ChatPage">
        <nav className="navbar bg-primary fixed-top">
          <a 
            className="navbar-brand text-white" 
            href="#"
          >
            Tata
          </a>

          <a
            className="btn text-white"
            style={{fontSize: '1.4em'}}
            onClick={() => this.props.history.push('/contacts')}
          >&times;</a>
        </nav>

        {this.renderMessages()}

        <Compose 
          user={users.me}
          onSend={this.handleSend}
        />
      </div>
    );
  }

  renderMessages() {
    return this.state.messages.map((message, i) => {
      return (
        <Message key={i} from={message.from}>
          {message.text}
        </Message>
      );
    });
  }
};

export default connect((state, props) => {
  console.log('PROPS', props);
  return {
    messages: state.messages[props.match.params.id] || [],
  }
})(Chat);
