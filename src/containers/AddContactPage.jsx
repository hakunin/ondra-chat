import React from 'react';
import {connect} from 'react-redux';
import {map} from 'lodash-es';
import {websocket} from '../utils/all';
import {Communication} from '../utils/Communication';

export class AddContactPage extends React.Component {

  handleClick = () => {
    Communication.instance.sendFriendRequest(
      this.code.value.toUpperCase()
    );

    this.props.history.push('/contacts');
  }

  render() {
    return (
      <div 
        className="AddContactPage"
        style={{paddingTop: 56}}
      >
        <nav className="navbar bg-primary fixed-top">
          <a 
            className="navbar-brand text-white" 
            href="#"
          >
            Pridat kontakt
          </a>

          <a
            className="btn text-white"
            style={{fontSize: '1.4em'}}
            onClick={() => this.props.history.push('/contacts')}
          >&times;</a>
        </nav>

        <div className="container text-align">
          <br/>
          <br/>
          <h4>Muj kod:</h4>
          <h2>{this.props.user.channel}</h2>
          <br/>

          <h4>Kamaraduv kod:</h4>
          <input 
            type="text" 
            className="form-control"
            ref={(el) => this.code = el}
          />

          <a 
            onClick={this.handleClick}
            className="btn btn-primary text-white btn-block mt-2"
          >OK</a>
        </div>
      </div>
    );
  }

};

export default connect((state, props) => {
  return {
    user: state.user,
    contacts: state.contacts || {},
  }
})(AddContactPage);

