import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isLoading, doneLoading } from '../actions/loadingActions';
import Loading from './Loading';
import '../css/Bounties.css';

class Bounties extends React.Component {

  state = {
    vendors: [],
    toggle: false,
    top: '',
    left: ''
  }

  async componentDidMount() {
    this.props.isLoading()
    await fetch('/bounties')
      .then(res => res.json())
      .then(json => {
         this.setState({ vendors: json })
      })
    console.log(this.state.vendors)
    this.props.doneLoading()
  }

  toggle = (event) => {
    console.log(event)
    this.setState({ toggle: true })
    window.addEventListener('mousemove', (event) => {
      //console.log(event.x, event.y)
      //left event.x
      this.setState({ top: '50%', left: event.x})
    })
    for (let item of this.state.vendors) {
      
    }
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
                  <img src={elem.icon} alt={elem.name} onMouseOver={this.toggle.bind(this, elem)} onMouseOut={this.hide}/>
                  <h4>{elem.name}</h4>
                  {elem.toggle ? <div>Show info</div> : null}
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
          <div className="main"></div>
          <div className="main-title"></div>
          {this.state.toggle ? <div style={style}>asdfs</div> : null}
          <div className="main-content">
            <a href='/home'><h5>Back to optimizer</h5></a>
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