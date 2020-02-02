import React, {Component} from 'react';
import {connect, Provider} from 'react-redux';
import {Route, Switch, MemoryRouter} from 'react-router';
import {BrowserRouter, Link} from 'react-router-dom';
import storeJs from 'store';

import configureAppStore from '../store/configureAppStore';
import WebsocketListener from '../utils/WebsocketListener';

import ChatPage from '../containers/ChatPage';
import LoginPage from '../containers/LoginPage';
import ContactsPage from '../containers/ContactsPage';
import AddContactPage from '../containers/AddContactPage';
import Communication from '../utils/Communication';

export default class App extends Component {

  constructor(props) {
    super(props);

    const {actions, redux, store} = configureAppStore({
      state: {
        //...window.__REDUX_INIT_CONTEXT,
        //filteredStrategies: storeJs.get('filtered-strategies') || [],
      }
    });
    this.redux = redux;
    window.redux = redux;
    window.Store = store;
    window.Actions = actions;
  }

  render() {
    return (
      <Provider store={this.redux}>
        <Communication />
        <MemoryRouter>
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <Route exact path="/contacts/add" component={AddContactPage} />
            <Route exact path="/contacts" component={ContactsPage} />
            <Route exact path="/chat/:id" component={ChatPage} />
          </Switch>
        </MemoryRouter>
      </Provider>
    );
  }

}



