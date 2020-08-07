import React from 'react';
import '../css/Bounties.css'

class Home extends React.Component {

  state = {
    vendors: []
  }

  async componentDidMount() {
    await fetch('/bounties')
      .then(res => res.json())
      .then(json => {
         this.setState({ vendors: json })
      })
  }

  render() {
    console.log(this.state.vendors)

    let display = this.state.vendors.map(elem => 
      <div key={elem.id} className='vendorContainer'>
        <div className='vendorInfo'> 
          <h2>{elem.name}</h2>
          <img src={elem.icon} alt={elem.name} />
        </div>
        <div className='salesContainer'>
          {elem.saleItems.filter(elem => elem.bountyType.includes('Weekly')).length !== 0 ? 
          <div>
            <h3>Weekly Bounties</h3>
            <div className='bounties'>
              {elem.saleItems.filter(elem => elem.bountyType.includes('Weekly')).map(elem => 
                <div key={elem.itemHash} className='itemContainer'> 
                  <img src={elem.icon} alt={elem.name} />
                  <h4>{elem.name}</h4>
                </div>                    
              )}
            </div> 
          </div> : null}

          {elem.saleItems.filter(elem => !elem.bountyType.includes('Weekly')).length !== 0 ?
          <div>
            <h3>Daily Bounties</h3>
            <div className='bounties'>
              {elem.saleItems.filter(elem => !elem.bountyType.includes('Weekly')).map(elem => 
                <div key={elem.itemHash} className='itemContainer'> 
                  <img src={elem.icon} alt={elem.name} />
                  <h4>{elem.name}</h4>
                </div>           
              )}
            </div>
          </div> : null}
        </div>
      </div>
    )

    return (
      <div className='bountiesContainer'>
        <div className="main"></div>
        <div className="main-title"></div>
        <div className="main-content">
          <h1>Today's Bounties</h1>
          {display}
        </div>
      </div>
    )
  }
} 

export default Home;