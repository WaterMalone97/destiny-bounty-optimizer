import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadPage } from '../actions/loadingActions';
import '../css/Loading.css';

class Loading extends React.Component {

    state = {
        width: 0,
        done: false
    }

    componentDidMount() {
        this.load = setInterval(
            () => this.progress(),
            10
          );
    }

    componentWillUnmount() {
        console.log('Unmounting')
        clearInterval(this.load);  
    }

    progress() {
        if (!this.props.load.loading) {
            clearInterval(this.load);
            console.log('done loading')
            this.setState({ width: 438 })
            setTimeout(() => this.props.loadPage(), 2000);  
        }

        if (this.state.width === 438) {
            setTimeout(() => this.setState({ width: 0, done: true }), 1000)    
        } 
        else
            this.setState({ width: this.state.width + 1 })
    }

    render() {

        let progressBar = {
            width: String(this.state.width) + 'px',
            backgroundColor: 'rgba(144, 238, 144, 0.9)',
            height: '30px'
        }

        let box = this.state.done ? 
            <div className='filledBox'>
                <div className='fill'></div>
            </div> : <div className='emptyBox'></div>


        return (
            <div className='loadingContainer'>
                <div className='loadingHeader'>
                    <h1>OPTIMIZE</h1>
                    <h3>Destiny Bounty Optimizer</h3>
                </div>
                <div className='loadingBody'>
                    <h3><i>Wait for the application to grab bounties, optimize the bounties, and create instructions.</i></h3>
                    <div className='objectiveContainer'>                   
                        {box}
                        <div className='objectiveBox'>
                            <div className='bar1' style={progressBar}></div>
                            <h2>Grabbing bounties</h2>
                        </div>
                    </div>
                    <div className='objectiveContainer'>
                        <div className='emptyBox'></div>
                        <div className='objectiveBox'>
                            <div className='bar2'></div>
                            <h2>Optimizing route</h2>                       
                        </div>
                    </div>
                    <div className='objectiveContainer'>
                        <div className='emptyBox'></div>
                        <div className='objectiveBox'>
                            <div className='bar3'></div>
                            <h2>Writing instructions</h2>
                        </div>
                    </div>
                </div>
                <div className='loadingFooter'>
                    <h3><i>"Work smarter not harder, let Destiny Bounty Optimzer help you." &mdash; DBO Team</i></h3>
                </div> 

                <div className='loadingActions'>
                    <h3>Track</h3>
                    <h3>Abandon</h3>
                </div>     
            </div>
    )
  }
} 

Loading.protoTypes = {
    load: PropTypes.object.isRequired,
    loadPage: PropTypes.func.isRequired
}
  
const mapStateToProps = state => ({
    load: state
})
  
export default connect(mapStateToProps, { loadPage })(Loading);