import React, { Component } from 'react';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';

import logo from './logo.svg';
import './App.css';
import membersReducer from './reducer';
import MemberList from './memberList';

const store = createStore(combineReducers({
  members: membersReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <div className="App-intro">
            <MemberList/>
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;
