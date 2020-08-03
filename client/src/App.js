import React from 'react';
import './index.css';
import { Switch, Route } from 'react-router';
import Info from './pages/Info';
import Home from './pages/Home';
import Test from './pages/Test'
import querystring from 'querystring'

class App extends React.Component {

  render() {
    return (
      <div>
        <Switch>
          <Route path='/info' component={Info}/>
          <Route path='/login' render={() => 
            window.location.replace('https://www.bungie.net/en/oauth/authorize?' + querystring.stringify({
              client_id: process.env.REACT_APP_CLIENT_ID,
              response_type: 'code',
              state: process.env.REACT_APP_STATE
            }))}/>
          <Route path='/test' component={Test}/>
          <Route path='/dev' component={Home}/>
          <Route exact path='/' component={Home}/>
          <Route path='/' render={() => <h1>404: page not found</h1>}/>
        </Switch>
      </div>
    )
  }
} 

export default App;