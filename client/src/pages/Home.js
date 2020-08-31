import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isLoading, doneLoading } from '../actions/loadingActions';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar'
import '../css/Home.css';

class Home extends React.Component {

  state = {
    bounties: [],
    filters: [
      {
        name: 'Crucible',
        desc: 'Exclude Crucible bounties',
        toggle: false
      },
      {
        name: 'Gambit',
        desc: 'Exclude Gambit bounties',
        toggle: false
      },
      {
        name: 'Strikes',
        desc: 'Exclude Strike bounties',
        toggle: false
      },
      {
        name: 'Destinations',
        desc: 'Include destination bounties',
        toggle: false
      }   
    ]
  }

  async componentDidMount() {
    this.props.isLoading()
    await fetch('api/bounties/optimize?score=60')
      .then(res => res.json())
      .then(json => {
          this.setState({ bounties: json })
      })
    this.props.doneLoading()
    console.log(this.state.bounties)
  }

  handleClick = (event) => {
    console.log(event)
    let body = JSON.stringify({ type: event.name })
    this.setState(prevState => ({ 
      filters: prevState.filters.map((elem, index) => {
        if (index === event.index)
          return {...elem, toggle: !elem.toggle}
        return elem
      })
    }))
    fetch('/filter', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body
    })
  }

  render() {

    let filters = this.state.filters.map((elem, index) =>
      <div className='filter-option' key={elem.name}>                   
          {elem.toggle ? 
            <div className='filledBox' onClick={this.handleClick.bind(this, {elem, index})}>
              <div className='fill'></div>
            </div> : <div className='emptyBox' onClick={this.handleClick.bind(this, {elem, index})}></div>}
          <div>
          <h4>{elem.desc}</h4>
          </div>
      </div>
    )

    let display = this.state.bounties.map(elem =>
      <div key={elem.location}>
        <h3>{elem.location}</h3>
        <div className='vendors'>    
          {elem.bounties.map(elem => 
            <div key={elem.itemHash} className='item'> 
              <img src={elem.icon} alt={elem.name} />
              <h4>{elem.name}</h4>
              <h5>{elem.description}</h5>
              <p>Time: {elem.time}</p>
              <p>Score: {elem.score.toFixed(2)}</p>             
              {Object.entries(elem.constraints).map(elem => {
                  if (elem[1].length !== 0)
                    return <div key={elem[0]}>{elem[0]}: {elem[1]}</div>
                }
              )}
            </div>  
          )}
        </div>
      </div>
    )
    
    return (
      <div>
        {this.props.load.loadPage ?
        <div className='home'>
          <Navbar /> 
          <div className="main"></div>
          <div className="main-title">
            <h1>Destiny Bounty Optimizer</h1>
          </div>

          <div className="main-content">
            <div className='filter-container'>
              <h2>Filters</h2>
              {filters}
            </div>
            <h2>Bounties</h2>
            <div className='bounty-container'>          
              {display}
            </div>
            <div className='instructions-container'>
              <h2>Instructions</h2>

            </div>
            <div className='rewards-container'>
              <h2>Rewards</h2>

            </div>
          </div>
        </div>: <Loading /> }
      </div>
    )
  }
}

Home.protoTypes = {
  load: PropTypes.object.isRequired,
  isLoading: PropTypes.func.isRequired,
  doneLoading: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  load: state
})

export default connect(mapStateToProps, { isLoading, doneLoading })(Home);