import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import axios from 'axios';
import rootReducer from './reducers';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import Login from './components/login.js';
import Signup from './components/signup.js';
import Main from './components/main.js';
import Chart from './components/chart.js';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

class App extends React.Component {
  render() {
    return (
      <Router>
        <Provider store={store}>
            <Route exact path="/vacations" component={Login}/>
            <Route exact path="/vacations/signup" component={Signup}/>
            <Route exact path="/vacations/main" component={Main}/>
            <Route exact path="/vacations/statistics" component={Chart}/>
        </Provider>
      </Router>
    )
  }
}

export default App;
