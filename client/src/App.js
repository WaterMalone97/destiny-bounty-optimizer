import React from 'react';
import './css/Index.css';
import { Switch, Route } from 'react-router';
import Info from './pages/Info';
import Home from './pages/Home';
import Bounties from './pages/Bounties';
import Loading from './pages/Loading';
import Rank from './pages/Rank';
import Support from './pages/Support';
import querystring from 'querystring'

class App extends React.Component {

  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/info' component={Info}/>
          <Route path='/login' render={() => 
            window.location.replace('https://www.bungie.net/en/oauth/authorize?' + querystring.stringify({
              client_id: process.env.REACT_APP_CLIENT_ID,
              response_type: 'code',
              state: process.env.REACT_APP_STATE
            }))}/>
          <Route path='/dev' component={Home}/>
          <Route path='/bounties' component={Bounties}/>
          <Route path='/loading' component={Loading}/>
          <Route path='/support' component={Support}/>
          <Route path='/rank' component={Rank}/>
          <Route path='/' render={() => <h1>404: page not found</h1>}/>
        </Switch>
      </div>
    )
  }
} 

export default App;