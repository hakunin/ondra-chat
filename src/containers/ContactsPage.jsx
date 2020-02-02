import React from 'react';
import {connect} from 'react-redux';
import {map} from 'lodash-es';

export class ContactsPage extends React.Component {

  render() {
    return (
      <div className="ContactsPage">
        <nav className="navbar bg-primary fixed-top">
          <a 
            className="navbar-brand text-white" 
            href="#"
          >
            Kontakty
          </a>
          <div className="float-right">
            <a
              className="btn text-white"
              style={{fontSize: '1.4em'}}
              onClick={() => this.props.history.push('/contacts/add')}
            >+</a>
          </div>
        </nav>

        {this.renderContacts()}
      </div>
    );
  }

  renderContacts() {
    return map(this.props.contacts, (contact) => {
      return (
        <a className="Contact p-3">
          {contact.name}
        </a>
      );
    });
  }
};

export default connect((state, props) => {
  return {
    contacts: state.contacts || {},
  }
})(ContactsPage);

