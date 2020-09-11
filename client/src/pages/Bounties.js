import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isLoading, doneLoading } from '../actions/loadingActions';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar'
import '../css/Bounties.css';
import { Redirect } from 'react-router';

class Bounties extends React.Component {

  state = {
    vendors: [],
    bounties: new Map(),
    showAll: false,
    bungoAPI: true
  }

  async componentDidMount() {
    this.props.isLoading()
    let date = new Date()
    let tomorrow = new Date(date)
    tomorrow.setDate(tomorrow.getDate() + 1)

    console.log('Time accessed: ', date.toISOString())
    console.log('Date cached: ', localStorage.getItem('vendors-date'))

    //Check if data is cached
    if (localStorage.getItem('vendors')) {
      console.log('Found cached vendors')
      if (date.toISOString() >= localStorage.getItem('vendors-date')) {
        console.log('Daily reset')
        console.log('Grabbing vendors')
        //Overwrite saved date with date for next daily reset
        localStorage.setItem('vendors-date', tomorrow.toISOString().substr(0,11) + '17:00:00.000Z')
        console.log('Next reset:', localStorage.getItem('vendors-date'))
        try { 
          await fetch('/api/bounties')
            .then(res => {
              if (res.status !== 200)
                throw new Error('Bad Response')
              return res.json()
            })
            .then(json => {
              this.setState({ vendors: json })
              localStorage.setItem('vendors', JSON.stringify(json))   
            })

          let bountyLib = new Map()
          for (let vendor of this.state.vendors) 
            for (let i = 0; i < vendor.saleItems.length; i++)
              bountyLib.set(vendor.saleItems[i].itemHash, {vendorId: vendor.id, index: i})
              
          this.setState({ bounties: bountyLib })  
        }
        catch {
          this.setState({ bungoAPI: false })
        }
        return this.props.doneLoading()
      }
      
      let data = JSON.parse(localStorage.getItem('vendors'))
      console.log(data)        
      let bountyLib = new Map()
      for (let vendor of data) 
        for (let i = 0; i < vendor.saleItems.length; i++)
          bountyLib.set(vendor.saleItems[i].itemHash, {vendorId: vendor.id, index: i})
    
      this.setState({ vendors: data, bounties: bountyLib })
      return this.props.doneLoading()
    }

    //If no data is cached, grab bounties
    console.log('No cached bounties')
    //Save date for next daily reset
    localStorage.setItem('vendors-date', tomorrow.toISOString().substr(0,11) + '17:00:00.000Z')
    console.log('Next reset:',localStorage.getItem('vendors-date'))

    try {
      console.log('Grabbing bounties')
      await fetch('/api/bounties')
        .then(res => {
          if (res.status !== 200)
            throw new Error('Bad Response')
          return res.json()
        })
        .then(json => {
          this.setState({ vendors: json })
          localStorage.setItem('vendors', JSON.stringify(json))   
        })


      console.log(this.state.vendors)
      console.log('Mapping bounties to vendors')
      let bountyLib = new Map()
      for (let vendor of this.state.vendors) 
        for (let i = 0; i < vendor.saleItems.length; i++)
          bountyLib.set(vendor.saleItems[i].itemHash, {vendorId: vendor.id, index: i})
        
      this.setState({ bounties: bountyLib })
      console.log(this.state.bounties)  
    }
    catch {
      this.setState({ bungoAPI: false })
    }

    this.props.doneLoading()
  }

  toggle = (event) => {
    console.log(event)
    let arr = [...this.state.vendors]
    const vendorIndex = this.state.vendors.map(elem => elem.id).indexOf(this.state.bounties.get(event.itemHash).vendorId)
    const bountyIndex = this.state.bounties.get(event.itemHash).index
    //console.log(vendorIndex, bountyIndex)
    arr[vendorIndex].saleItems[bountyIndex].show = !arr[vendorIndex].saleItems[bountyIndex].show
    this.setState({ vendors: [...arr] })
  }

  onClick = () => {
    this.setState({ showAll: !this.state.showAll })
  }

  collapse = (event) => {
    console.log(event)
    const vendorIndex = this.state.vendors.map(elem => elem.id).indexOf(event)
    let arr = [...this.state.vendors]
    arr[vendorIndex].show = !arr[vendorIndex].show
    this.setState({ vendors: [...arr] })
  }

  render() {

    let display = this.state.vendors.map(elem =>
      <div key={elem.id}>
        {elem.show ? 
          <div className='vendorContainer'>
            <div className='vendorInfo'> 
              <h2>{elem.name}</h2>
              <div className='collapse-btn' onClick={this.collapse.bind(this, elem.id)}>&#9650;</div>          
              <img src={elem.icon} alt={elem.name} />
            </div>
            <div className='salesContainer'>
              {elem.saleItems.filter(elem => elem.bountyType.includes('Weekly')).length !== 0 ? 
                <div>
                  <h3>Weekly Bounties</h3>
                  <div className='bounties'>
                    {elem.saleItems.filter(elem => elem.bountyType.includes('Weekly')).map(elem =>
                      <div key={elem.itemHash}>
                        {this.state.showAll ? 
                          <div className='showAllContainer'>
                            <div className='header'> 
                              <img src={elem.icon} alt={elem.name} onMouseOver={this.toggle.bind(this, elem)} onMouseOut={this.toggle.bind(this, elem)}/>
                              <h4>{elem.name.toUpperCase()}</h4>
                            </div>
                            <h5>{elem.description}</h5>
                            <div className='body'>
                              {elem.objectives.map(elem => 
                                <div className='container' key={elem.id}>                   
                                  <div className='box'></div>
                                  <div className='objective'>
                                    <h5 className='description'>{elem.progressDescription}</h5>
                                    <h5 className='value'>{elem.completionValue}</h5>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div> :
                          <div key={elem.itemHash} className='itemContainer'> 
                            <img src={elem.icon} alt={elem.name} onMouseOver={this.toggle.bind(this, elem)} onMouseOut={this.toggle.bind(this, elem)}/>
                            <h4>{elem.name}</h4>
                            {elem.show ? 
                              <div className='tooltip'>
                                <h4>{elem.name.toUpperCase()}</h4>
                                <h5>{elem.description}</h5>
                                {elem.objectives.map(elem => 
                                  <div className='container' key={elem.id}>                   
                                    <div className='box'></div>
                                    <div className='objective'>
                                        <h5 className='description'>{elem.progressDescription}</h5>
                                        <h5 className='value'>{elem.completionValue}</h5>
                                    </div>
                                  </div>
                                )}
                              </div> : null
                            }
                          </div>
                        }
                      </div>                    
                    )}
                  </div> 
                </div> : null
              }

              {elem.saleItems.filter(elem => !elem.bountyType.includes('Weekly')).length !== 0 ?
              <div>
                <h3>Daily Bounties</h3>
                <div className='bounties'>
                  {elem.saleItems.filter(elem => !elem.bountyType.includes('Weekly')).map(elem => 
                    <div key={elem.itemHash}>
                      {this.state.showAll ? 
                        <div className='showAllContainer'>
                          <div className='header'> 
                            <img src={elem.icon} alt={elem.name} onMouseOver={this.toggle.bind(this, elem)} onMouseOut={this.toggle.bind(this, elem)}/>
                            <h4>{elem.name.toUpperCase()}</h4>
                          </div>
                          <h5>{elem.description}</h5>
                          <div className='body'>
                            {elem.objectives.map(elem => 
                              <div className='container' key={elem.id}>                   
                                <div className='box'></div>
                                <div className='objective'>
                                  <h5 className='description'>{elem.progressDescription}</h5>
                                  <h5 className='value'>{elem.completionValue}</h5>
                                </div>
                              </div>
                            )}
                          </div>
                        </div> :
                        <div key={elem.itemHash} className='itemContainer'> 
                          <img src={elem.icon} alt={elem.name} onMouseOver={this.toggle.bind(this, elem)} onMouseOut={this.toggle.bind(this, elem)}/>
                          <h4>{elem.name}</h4>
                          {elem.show ? 
                            <div className='tooltip'>
                              <h4>{elem.name.toUpperCase()}</h4>
                              <h5>{elem.description}</h5>
                              {elem.objectives.map(elem => 
                                <div className='container' key={elem.id}>                   
                                  <div className='box'></div>
                                  <div className='objective'>
                                      <h5 className='description'>{elem.progressDescription}</h5>
                                      <h5 className='value'>{elem.completionValue}</h5>
                                  </div>
                                </div>
                              )}
                            </div> : null
                          }
                        </div>
                      }
                    </div>          
                  )}
                </div>
              </div> : null}
            </div>
          </div> : 
          <div className='vendorContainer'>
            <div className='vendorInfo'> 
              <h2>{elem.name}</h2>
              <div className='collapse-btn' onClick={this.collapse.bind(this, elem.id)}>&#9660;</div> 
            </div> 
          </div>
        }
      </div>
    )

    let date = new Date(localStorage.getItem('vendors-date'))
    date.setDate(date.getDate() - 1)

    return (
      <div>
        {this.props.load.loadPage ? 
        <div className='bountiesContainer'>
          <Navbar />  
          <div className="main"></div>
          <div className="main-title"></div>
          {this.state.bungoAPI ? null: 
            <div className='error-container'>
              {this.state.vendors.length === 0 ? <Redirect to='/down'/> : null}
              <h4>
                The Bungie API is currently down and we are using cached data to display bounties.
                The bounties may or may not be correct depending on the last time you accessed this site.
              </h4>
            </div>
          }
          <div className="main-content">
            <h1>Vendor Bounties</h1>
            <div className='subHeader'>
              <h4>{date.toLocaleDateString()}</h4>
              <button className='showAll-btn' onClick={this.onClick}>{this.state.showAll ? 'Hide Info' : 'Show Info'}</button>
            </div>  
            {display}
          </div>
        </div> : <Loading /> }
      </div>
    )
  }
} 

Bounties.protoTypes = {
  load: PropTypes.object.isRequired,
  isLoading: PropTypes.func.isRequired,
  doneLoading: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  load: state
})

export default connect(mapStateToProps, { isLoading, doneLoading })(Bounties);