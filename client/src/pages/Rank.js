import React from 'react';

class Rank extends React.Component {

    state = {
        description: '',
        completionValue: '',
        itemTypeDisplayName: '',
        icon: '',
        id: '',
        updated: false
    };

    async componentDidMount() {
        await fetch('/bounties/rank')
        .then(res => res.json())
        .then(json => {
            this.setState({description: json.description});
            this.setState({completionValue: json.completionValue});
            this.setState({itemTypeDisplayName: json.itemTypeDisplayName});
            this.setState({icon: json.icon});
            this.setState({id: json.id});
        });
    }

    componentDidUpdate() {
      if (this.state.updated === true) {
        fetch('/bounties/rank')
        .then(res => res.json())
        .then(json => {
            this.setState({description: json.description});
            this.setState({completionValue: json.completionValue});
            this.setState({itemTypeDisplayName: json.itemTypeDisplayName});
            this.setState({icon: json.icon});
            this.setState({id: json.id});
        });
        this.setState({updated: false});
      }
    }

    handleClick = (event) => {
      let id = event.target.id
      let body = JSON.stringify({
        time: event.target.value,
        id
      });
      fetch('bounties/rank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body
      });
      this.setState({updated: true});
    }

    render() {        
        return (
          <div>
            <h1>Bounty Time To Completion</h1>
            <h2>Enter the estimated time to complete the bounty on a scale of 1 - 3</h2>
            <h5>1 = 1 - 5 minutes</h5>
            <h5>2 = 6 - 10 minutes</h5>
            <h5>3 = 11+ minutes</h5>
            <div>
              <img src = {this.state.icon}></img>
              <h3>Description: {this.state.description}</h3>
              <h3>Completion Value: {this.state.completionValue}</h3>
              <h3>Type: {this.state.itemTypeDisplayName}</h3>
            </div>
            <div>
              <button onClick={this.handleClick} value = '1' id = {this.state.id}>1</button>
              <button onClick={this.handleClick} value = '2' id = {this.state.id}>2</button>
              <button onClick={this.handleClick} value = '3' id = {this.state.id}>3</button>
              <button onClick={this.handleClick} value = '4' id = {this.state.id}>Don't Know</button>
            </div>
          </div>
        )
      }
}

export default Rank;