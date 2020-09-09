import React from 'react';
import '../css/Rank.css'

class Rank extends React.Component {

    state = {
        item: {
            description: '',
            completionValue: '',
            itemTypeDisplayName: '',
            progressDescription: '',
            icon: '',
            id: '',
            updated: false,          
        },
        bounties: [],
        toggle: false
    }

    async componentDidMount() {
        await fetch('api/bounties/all')
        .then(res => res.json())
        .then(json => this.setState({bounties: json}))
        console.log(this.state.bounties)

        await fetch('api/bounties/rank')
        .then(res => res.json())
        .then(json => {
            let item = {
              description: json.description,
              completionValue: json.completionValue,
              itemTypeDisplayName: json.itemTypeDisplayName,
              progressDescription: json.progressDescription,
              icon: json.icon,
              id: json.id
            }
            this.setState({ item })
        });
    }

    async handleClick(event) {
      let id = event.target.id
      let body = JSON.stringify({
        time: event.target.value,
        id
      });
      await fetch('/api/bounties/rank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body
      });
      await fetch('/api/bounties/rank')
        .then(res => res.json())
        .then(json => {
          let item = {
            description: json.description,
            completionValue: json.completionValue,
            itemTypeDisplayName: json.itemTypeDisplayName,
            progressDescription: json.progressDescription,
            icon: json.icon,
            id: json.id
          }
          this.setState({ item })
        });
    }

    onClick = () => {
      this.setState({ toggle: !this.state.toggle })
    }

    render() {     

        let bounties = this.state.bounties.map((elem, index) => 
          <tr key={elem.id} className='ranked'>
            <td><h4>{index}</h4></td>
            <td className='span'><img src={elem.icon} alt=''/><h4>{elem.description}</h4></td>
            <td><h4>{elem.completionValue} {elem.progressDescription}</h4></td>
            <td><h4>{elem.time}</h4></td>
          </tr>
        )

        return (
          <div>
            <div className='ranking-container'>
              <h1>Bounty Time To Completion</h1>
              <h2>Enter the estimated time to complete the bounty on a scale of 1 - 3</h2>
              <h5>1 = 1 - 5 minutes</h5>
              <h5>2 = 6 - 10 minutes</h5>
              <h5>3 = 11+ minutes</h5>
              <div>
                <img src = {this.state.item.icon} alt="Bounty"></img>
                <h3>Description: {this.state.item.description}</h3>
                <h3>Completion Value: {this.state.item.completionValue}</h3>
                <h3>Progress Description: {this.state.item.progressDescription}</h3>
                <h3>Type: {this.state.item.itemTypeDisplayName}</h3>
              </div>
              <div>
                <button onClick={this.handleClick.bind(this)} value = '1' id = {this.state.item.id}>1</button>
                <button onClick={this.handleClick.bind(this)} value = '2' id = {this.state.item.id}>2</button>
                <button onClick={this.handleClick.bind(this)} value = '3' id = {this.state.item.id}>3</button>
                <button onClick={this.handleClick.bind(this)} value = '4' id = {this.state.item.id}>Don't Know</button>
              </div>
            </div>
            <div className='ranked-container'>       
              {this.state.toggle ?
                <div>
                  <button onClick={this.onClick}>Hide All Rankings</button>
                  <table>
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Description</th>
                        <th>Progress</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bounties}
                    </tbody>
                  </table>
                </div> : <button onClick={this.onClick}>Show All Rankings</button>
              }
            </div>
          </div>
        )
      }
}

export default Rank;