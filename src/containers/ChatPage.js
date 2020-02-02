import React from 'react';
import '../styles.css';
import Message from '../components/message.js';
import Compose from '../components/compose.js';

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

export default class Chat extends React.Component {

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
        </nav>

        {this.renderMessages()}

        <Compose 
          user={users.me}
          onSend={
            (message) => this.setState({messages: this.state.messages.concat(message) })
          }/>
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

