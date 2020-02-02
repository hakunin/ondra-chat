import React from 'react';
import {connect} from 'react-redux';

export class LoginPage extends React.Component {

  componentWillMount() {
    if (!this.props.user.empty) {
      // TODO skip to contacts
      this.props.history.push('/contacts');
    }
  }

  handleClick = () => {
    const id = Math.random().toString(36).substring(7).toUpperCase();

    Actions.user.set({
      name: this.name.value,
      channel: id,
      id: id,
    });

    this.props.history.push('/contacts');
  }

  render() {
    return (
      <div className="LoginPage text-center">
        <h1>Ahoj!</h1>

        <br />
        <br />
        <h2>prezdivka</h2>
        <input
          ref={(el) => this.name = el}
          type="text"
          className="form-control text-center"
          autoFocus
          style={{fontSize: '2em'}}
        />

        <a 
          onClick={this.handleClick}
          className="btn btn-primary text-white btn-block mt-2"
        >OK</a>
      </div>
    );
  }

};

export default connect((state, props) => {
  return {
    user: state.user || {empty: true},
  };
})(LoginPage);
