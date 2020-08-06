import React from 'react';
import vendors from '../DestinyVendorDefinition.json'

class Home extends React.Component {

  state = {
    bounties: []
  }

  async componentDidMount() {
    await fetch('/bounties')
      .then(res => res.json())
      .then(json => {
        console.log(json.data)
        Object.entries(json.data).map(elem => this.setState({ 
            bounties: [...this.state.bounties, {vendorHash: elem[0], sales: Object.keys(elem[1].saleItems)}] 
          })
        )     
      })
    //console.log(this.state.bounties)
  }

  render() {
    
    let filter = vendors['69482069'].itemList.filter(elem => elem.displayCategory === 'Bounties')
    console.log(filter)

    let display = this.state.bounties.map(elem => 
      <div key={elem.vendorHash}>
        {elem.vendorHash} : {elem.sales.map(elem => <span>{elem}  </span>)}
      </div>
    )
    
    return (
      <div>
        <h1>Hello World</h1>
        <h6>{display}</h6>
        <h1>Hello World</h1>
        <h1>Hello World</h1>
      </div>
    )
  }
} 

export default Home;