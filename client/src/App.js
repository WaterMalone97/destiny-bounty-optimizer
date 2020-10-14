import React from 'react';
import './css/Index.css';
import { Switch, Route } from 'react-router';
import Info from './pages/Info';
import Home from './pages/Home';
import Bounties from './pages/Bounties';
import Rank from './pages/Rank';
import Support from './pages/Support';
import Unavailable from './pages/Unavailable'
import querystring from 'querystring'
import ReactGA from 'react-ga';

ReactGA.initialize('UA-177880022-1');

//history.listen((location) => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname + window.location.search);
//});

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
          <Route path='/support' component={Support}/>
          <Route path='/rank' component={Rank}/>
          <Route path='/down' component={Unavailable}/>
          <Route path='/' render={() => <h1>404: page not found</h1>}/>
        </Switch>
      </div>
    )
  }
} 

export default App;