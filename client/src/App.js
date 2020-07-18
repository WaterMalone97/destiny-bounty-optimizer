import React from 'react';
import './index.css';

class App extends React.Component {
  render() {
    return (
      <div>
        <div class="main"></div>
        <div class="main-title">
          <h1>Destiny Bounty Optimizer</h1>
        </div>

        <div class="main-content">
          <h3>Welcome to the Destiny Bounty Optimizer</h3>
          <h5>This application will help you find the most efficent bounites to complete to get the most experience in shortest amount of time in Destiny 2.
              Detiny Bounty Optimizer is a node.js web application that will utilize Bungie's API to gather bounties from all the vendors where it will interpret the data and display 
              the optimzed route that the player should take. Players will be able to filter any type of bounties that they wish to complete or ignore.
              Whether we wanted it or not, we've stepped into a war with the Cabal on Mars. Destiny Bounty Optimzer is here to help!
          </h5>
        </div>
      </div>
    )
  }
} 

export default App;