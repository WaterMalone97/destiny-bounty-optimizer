import React from 'react';
import '../css/Loading.css';

class Info extends React.Component {

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
        clearInterval(this.load);  
    }

    progress() {
        if (this.state.width == 438) {
            clearInterval(this.load);
            return this.setState({ width: 0, done: true })
        }
            
        this.setState({ width: this.state.width + 1 })
    }

    clear() {
        this.setState({ width: 0 })
    }

    render() {

        console.log(this.state.width)
        let progressBar = {width: String(this.state.width) + 'px'}

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

export default Info;