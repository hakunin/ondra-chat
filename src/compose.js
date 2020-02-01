import React from 'react';
import './styles.css';
import Avatar from './avatar.js';

const style = {
  maxWidth: '70%',
}

const words = [
  'AHOJ', 'MAMI', 'TATI', 
  'JAK', 'SE', 'MAS',
]

export default class Compose extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };
  }
  
  handleClick() {
    this.setState({index: (this.state.index + 1) % words.length});
  }

  render() {
    return (
      <div
        className="p-2 fixed-bottom"
        style={{background: 'white', textAlign: 'center'}}
      >
        <div className="p-4">
          <h1 onClick={this.handleClick.bind(this)}>
            {words[this.state.index]}
          </h1>
        </div>
        <a
          className="btn btn-block btn-primary text-white"
          onClick={() => this.props.onSend({from: this.props.user, text: words[this.state.index]})}
        >OK</a>
      </div>
    );
  }
};
