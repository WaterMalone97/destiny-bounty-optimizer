import React from 'react';
import './css/Index.css';
import { Switch, Route } from 'react-router';
import Info from './pages/Info';
import Home from './pages/Home';
import Bounties from './pages/Bounties';
import Test from './pages/Test';
import Loading from './pages/Loading';
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
          <Route path='/bounties' component={Bounties}/>
          <Route exact path='/' component={Home}/>
          <Route path='/loading' component={Loading}/>
          <Route path='/' render={() => <h1>404: page not found</h1>}/>
        </Switch>
      </div>
    )
  }
} 

export default App;