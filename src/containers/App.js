import React, {Component} from 'react';
import {connect, Provider} from 'react-redux';
import {Route, Switch} from 'react-router';
import {BrowserRouter, Link} from 'react-router-dom';
import storeJs from 'store';

import configureAppStore from '../store/configureAppStore';
import WebsocketListener from '../utils/WebsocketListener';
import {websocket} from '../utils/all';

import ChatPage from '../containers/ChatPage';

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
    window.Store = store;
    window.Actions = actions;
    websocket.connect();
  }

  render() {
    return (
      <Provider store={this.redux}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={ChatPage} />
            <Route exact path="/chat" component={ChatPage} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }

}



