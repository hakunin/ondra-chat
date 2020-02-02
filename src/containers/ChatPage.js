import React from 'react';
import {connect} from 'react-redux';
import '../styles.css';
import Message from '../components/message.js';
import Compose from '../components/compose.js';
import {Communication} from '../utils/Communication';

export class Chat extends React.Component {

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
          onSend={this.handleSend}
        />
      </div>
    );
  }

  renderMessages() {
    return this.props.messages.map((message, i) => {
      console.log('Message', message);
      return (
        <Message 
          key={i}
          from={message.from} 
          isMine={this.props.user.id === (message.from || {}).id}
        >
          {message.text}
        </Message>
      );
    });
  }
};

export default connect((state, props) => {
  console.log('PROPS', props);
  return {
    user: state.user,
    messages: state.messages[props.match.params.id] || [],
  }
})(Chat);
