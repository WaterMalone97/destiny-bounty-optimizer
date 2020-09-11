import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isLoading, doneLoading } from '../actions/loadingActions';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar'
import '../css/Home.css';
import { Redirect } from 'react-router';

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
        desc: 'Exclude destination bounties',
        toggle: false
      }   
    ],
    showBounties: true,
    showInstructions: true,
    showRewards: true,
    showLocations: false,
    toggleFilters: false,
    time: 0.5,
    bungoAPI: true
  }

  async componentDidMount() {
    this.props.isLoading()

    //Check if in current session
    if (sessionStorage.getItem('bounties')) {
      console.log('Loading current session')
      let bounties = JSON.parse(sessionStorage.getItem('bounties'))
      let filters = JSON.parse(sessionStorage.getItem('filters'))
      console.log(bounties)        
      this.setState({ 
        filters,
        time: sessionStorage.getItem('time'),
        bounties
      })
      return this.props.doneLoading()
    }

    let date = new Date()
    let tomorrow = new Date(date)
    tomorrow.setDate(tomorrow.getDate() + 1)

    console.log('Time accessed: ', date.toISOString())
    console.log('Date cached: ', localStorage.getItem('date'))

    //Check if data is cached
    if (localStorage.getItem('bounties')) {
      console.log('Found cached bounties')
      if (date.toISOString() >= localStorage.getItem('date')) {
        console.log('Daily reset')
        console.log('Grabbing new bounties')
        //Overwrite saved date with date for next daily reset
        localStorage.setItem('date', tomorrow.toISOString().substr(0,11) + '17:00:00.000Z')
        console.log('Next reset:',localStorage.getItem('date'))
        try { 
          let opts = {
            method: 'POST',
            body: JSON.stringify({
              score: 50,
            }),
            headers: { "Content-Type": "application/json" },
          };
          
          await fetch('api/bounties/optimize', opts)
            .then(res => {
              if (res.status !== 200)
                throw new Error('Bad Response')
              return res.json()
            })
            .then(json => {
              this.setState({ bounties: json })
              localStorage.setItem('bounties', JSON.stringify(json))
            })
        }
        catch {
          this.setState({ bungoAPI: false })
        }
        return this.props.doneLoading()
      }
      let bounties = JSON.parse(localStorage.getItem('bounties'))
      console.log(bounties)        
      this.setState({ bounties })
      return this.props.doneLoading()
    }
    
    //If no data is cached, grab bounties
    console.log('No cached bounties')
    //Save date for next daily reset
    localStorage.setItem('date', tomorrow.toISOString().substr(0,11) + '17:00:00.000Z')
    console.log('Next reset:', localStorage.getItem('date'))

    try {
      let opts = {
        method: 'POST',
        body: JSON.stringify({
          score: 50,
        }),
        headers: { "Content-Type": "application/json" },
      };

      await fetch('api/bounties/optimize', opts)
        .then(res => {
          if (res.status !== 200)
            throw new Error('Bad Response')
          return res.json()
        })
        .then(json => {
          this.setState({ bounties: json })
          console.log('Caching bounties')
          localStorage.setItem('bounties', JSON.stringify(json))
        })
    }
    catch {
      this.setState({ bungoAPI: false })
    }

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

  toggle = (event) => {
    this.setState({ [event]: !this.state[event] })
  }

  onChange = (event) => {
    this.setState({ time: event.target.value})
  }

  sumbit = async() => {
    console.log('Filtering bounties')
    this.props.isLoading()
    this.setState({ toggleFilters: false })
    sessionStorage.setItem('time', this.state.time)
    sessionStorage.setItem('filters', JSON.stringify(this.state.filters))
    try {
      await fetch('api/bounties/optimize', {
        method: 'POST',
        body: JSON.stringify({
          score: Math.round(this.state.time * 100),
          filters: this.state.filters.filter(f => f.toggle === true)
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then(res => {
          if (res.status !== 200)
            throw new Error('Bad Response')
          return res.json()
        })
        .then(json => {
          this.setState({ bounties: json })
          sessionStorage.setItem('bounties', JSON.stringify(json))
      })
    }
    catch {
      this.setState({ bungoAPI: false })
    }
    
    this.props.doneLoading()
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

    let toggledFilters = this.state.filters.map(elem => 
      <div key={elem.name}>
        {elem.toggle ? 
          <div className='toggled'>
            <h5>{elem.desc}</h5>
          </div> : null
        }
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
    
    let date = new Date(localStorage.getItem('vendors-date'))
    date.setDate(date.getDate() - 1)          

    return (
      <div>
        {this.props.load.loadPage ?
          <div className='home'>
            <Navbar /> 
            <div className="main"></div>
            <div className="main-title">
              <h1>Destiny Bounty Optimizer</h1>
            </div>
            {this.state.bungoAPI ? null: 
              <div className='error-container'>
                {this.state.bounties.length === 0 ? <Redirect to='/down'/> : null}
                <h4>
                  The Bungie API is currently down and we are using cached data to display bounties.
                  The bounties may or may not be correct depending on the last time you accessed this site.
                </h4>
              </div>
            }
            <div className="main-content">
              {this.state.toggleFilters ?
                <div>               
                  <button className="filterbtn" onClick={this.toggle.bind(this, 'toggleFilters')}>Filters <span id="filter-arrow">&#9650;</span></button>
                  <div className='close' onClick={this.toggle.bind(this, 'toggleFilters')}></div>
                  <div className='filter-container'>
                    {filters}
                    <div>
                      <h4 id="time-number">Time: {Math.round(this.state.time * 100)}</h4>
                      <input type='range' id='time' min='0' max='1' defaultValue={this.state.time} step='0.1' onChange={this.onChange}/>
                    </div>
                    <button className="recalculatebtn" onClick={this.sumbit}>Recalculate</button>
                  </div>    
                </div> : <button className="filterbtn" onClick={this.toggle.bind(this, 'toggleFilters')}>Filters <span id="filter-arrow">&#9660;</span></button>               
              }
              <div className='filters'>  
                <div className='toggled-container'>
                  {toggledFilters}
                </div>
              </div>

              <h2>Optimized Bounties - {date.toLocaleDateString()}</h2>
              <div className='bounty-container'>
                {this.state.showBounties ? 
                  <div>
                    <div className='collapse-btn' onClick={this.toggle.bind(this, 'showBounties')}>&#9650;</div>
                    {display}
                  </div> : <div className='collapse-btn' onClick={this.toggle.bind(this, 'showBounties')}>&#9660;</div>  
                }                                               
              </div>

              <h2>Instructions</h2>
              <div className='instructions-container'>
              {this.state.showInstructions ?
                <div>
                  <div className='collapse-btn' onClick={this.toggle.bind(this, 'showInstructions')}>&#9650;</div>
                  <h4>Bounty Locations</h4>
                  {this.state.showLocations ? 
                    <div>
                      <button onClick={this.toggle.bind(this, 'showLocations')}>Hide Locations</button>            
                      <div className='locations'>
                        Locations
                      </div>
                    </div> : <button onClick={this.toggle.bind(this, 'showLocations')}>Show Locations</button> 
                  }
                </div> : <div className='collapse-btn' onClick={this.toggle.bind(this, 'showInstructions')}>&#9660;</div>
              }
              </div>

              <h2>Rewards</h2>
              <div className='rewards-container'>
                {this.state.showRewards ? 
                  <div>
                    <div className='collapse-btn' onClick={this.toggle.bind(this, 'showRewards')}>&#9650;</div>
                    Place rewards here
                  </div> : <div className='collapse-btn' onClick={this.toggle.bind(this, 'showRewards')}>&#9660;</div> 
                }                    
              </div>
            </div>
          </div>: <Loading /> 
        }
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