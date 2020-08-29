import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isLoading, doneLoading } from '../actions/loadingActions';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar'
import '../css/Bounties.css';

class Bounties extends React.Component {

  state = {
    vendors: [],
    toggle: false,
    top: '',
    left: '',
    bounties: new Map()
  }

  async componentDidMount() {
    this.props.isLoading()
    await fetch('/bounties')
      .then(res => res.json())
      .then(json => {
         this.setState({ vendors: json })
      })
    console.log(this.state.vendors)
    let bountyLib = new Map()
    for (let vendor of this.state.vendors) 
      for (let i = 0; i < vendor.saleItems.length; i++)
        bountyLib.set(vendor.saleItems[i].itemHash, {vendorId: vendor.id, index: i})
    
    this.setState({ bounties: bountyLib })
    console.log(this.state.bounties)
    this.props.doneLoading()
  }

  toggle = (event) => {
    console.log(event)
    let arr = [...this.state.vendors]
    const vendorIndex = this.state.vendors.map(elem => elem.id).indexOf(this.state.bounties.get(event.itemHash).vendorId)
    const bountyIndex = this.state.bounties.get(event.itemHash).index
    //console.log(vendorIndex, bountyIndex)
    arr[vendorIndex].saleItems[bountyIndex].toggle = !arr[vendorIndex].saleItems[bountyIndex].toggle
    this.setState({ vendors: [...arr] })
  }

  hide = () => {
    this.setState({ toggle: false })
  }

  render() {
    //console.log(this.state.vendors)
    //console.log(this.props.load)

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
                  <img src={elem.icon} alt={elem.name} onMouseOver={this.toggle.bind(this, elem)} onMouseOut={this.toggle.bind(this, elem)}/>
                  <h4>{elem.name}</h4>
                  {elem.toggle ? 
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
                  </div> : null}
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

    let style = {
      top: this.state.top,
      left: this.state.left,
      height: "100px",
      width: "100px",
      position: 'fixed',
      backgroundColor: 'magenta',
      zIndex: 4
    }

    return (
      <div>
        {this.props.load.loadPage ? 
        <div className='bountiesContainer'>
          <Navbar />  
          <div className="main"></div>
          <div className="main-title"></div>
          {this.state.toggle ? <div style={style}>asdfs</div> : null}
          <div className="main-content">
            <h1>Today's Bounties</h1>
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