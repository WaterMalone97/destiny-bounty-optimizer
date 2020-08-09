import React from 'react'
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer'
import App from './App'

const store = createStore(rootReducer, applyMiddleware(thunk));

render((
  <Provider store={store}>
    <BrowserRouter>
        <App/>
    </BrowserRouter>
  </Provider>
), document.getElementById('root'));