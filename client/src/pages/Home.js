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
    ],
    showLocations: false,
    toggle: false
  }

  async componentDidMount() {
    this.props.isLoading()
    let date = new Date()
    let tomorrow = new Date(date)
    tomorrow.setDate(tomorrow.getDate() + 1)
    //console.log(tomorrow.toISOString().substr(0,11) + '17:00:00.000Z')
    //localStorage.removeItem('bounties')
    //localStorage.removeItem('date')

    if (localStorage.getItem('bounties')) {
      console.log('Found cached bounties')
      if (localStorage.getItem('date') >=  tomorrow.toISOString().substr(0,11) + '17:00:00.000Z') {
        console.log('Daily reset')
        console.log('Date cached: ', localStorage.getItem('date'))
        console.log('Grabbing new bounties')
        localStorage.setItem('date', date.toISOString())
        console.log(localStorage.getItem('date'))
        await fetch('api/bounties/optimize?score=60')
          .then(res => res.json())
          .then(json => {
            this.setState({ bounties: json })
            localStorage.setItem('bounties', JSON.stringify(json))
        })
        return this.props.doneLoading()
      }
      let data = JSON.parse(localStorage.getItem('bounties'))
      console.log(data)        
      this.setState({ bounties: data })
      return this.props.doneLoading()
    }
    
    console.log('No cached bounties')
    localStorage.setItem('date', date.toISOString())
    console.log(localStorage.getItem('date'))

    await fetch('api/bounties/optimize?score=60')
      .then(res => res.json())
      .then(json => {
        this.setState({ bounties: json })
        localStorage.setItem('bounties', JSON.stringify(json))
    })

    console.log('Caching bounties')
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
  }

  showLocations = () => {
    this.setState({ showLocations: !this.state.showLocations })
  }

  toggle = () => {
    this.setState({ toggle: !this.state.toggle })
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
            <div key={elem.itemHash} className='showAllContainer'>
              <div className='header'> 
                <img src={elem.icon} alt={elem.name} />
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
              <p>Time: {elem.time}</p>
              <p>Score: {elem.score.toFixed(2)}</p>             
              {Object.entries(elem.constraints).map(elem => {
                  if (elem[1].length !== 0)
                    return <div key={elem[0]}><p>{elem[0]}: {elem[1]}</p></div>
              })}
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
            <div className='bounty-container'>
              <h2>Bounties</h2>
              <button onClick={this.toggle}>Filters</button>
              {this.state.toggle ?
              <div>
                <div className='close' onClick={this.toggle}></div>
                <div className='filter-container'>
                  {filters}
                  <div>
                    <h4>Time: </h4>
                    <input type='range' />
                  </div>
                  </div>    
              </div> : null
              }
              <div className='bounties'>          
                {display}
              </div>
              <h4>Bounty Locations</h4>
              {this.state.showLocations ? 
                <div>
                  <button onClick={this.showLocations}>Hide Locations</button>            
                  <div className='locations'>
                    Locations
                  </div>
                </div> :
                <button onClick={this.showLocations}>Show Locations</button> 
              }
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