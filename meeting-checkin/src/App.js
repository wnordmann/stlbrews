import React, { Component } from 'react';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';

import './App.css';
import membersReducer from './reducer';
import OldMemberList from './memberList';

const store = createStore(combineReducers({
  members: membersReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header >
            <h1 className="App-title">Welcome to St. Louis Brews Meeting</h1>
          </header>
          <div className="App-intro">
            <OldMemberList/>
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;
