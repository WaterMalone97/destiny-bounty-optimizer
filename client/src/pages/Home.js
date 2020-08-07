import React from 'react';

class Home extends React.Component {

  state = {
    bounties: []
  }

  async componentDidMount() {
    await fetch('/bounties')
      .then(res => res.json())
      .then(json => {
        console.log(json)
         
      })
    //console.log(this.state.bounties)
  }

  render() {

    /* let display = this.state.bounties.map(elem => 
      <div key={elem.vendorHash}>
        {elem.vendorHash} : {elem.sales.map(elem => <span>{elem}  </span>)}
      </div>
    ) */
    
    return (
      <div>
        <h1>Hello World</h1>
        <h6>Hello World</h6>
        <h1>Hello World</h1>
        <h1>Hello World</h1>
      </div>
    )
  }
} 

export default Home;