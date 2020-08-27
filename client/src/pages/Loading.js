import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadPage } from '../actions/loadingActions';
import loadscreen from '../loadscreen.json'
import '../css/Loading.css';

class Loading extends React.Component {

    state = {
        content: {
            title: 'OPTIMIZE',
            subTitle: 'Destiny Bounty Optimizer',
            desc: 'Wait for the application to grab bounties, optimize the bounties, and create instructions.',
            objectives: [
                {
                    name:'Grabbing bounties',
                    progressBar: {
                        width: 0,
                        backgroundColor: 'rgba(144, 238, 144, 0.9)',
                        height: '30px'
                    },
                    interval: 3,
                    done: false
                },
                {
                    name:'Optimzing routes',
                    progressBar: {
                        width: 0,
                        backgroundColor: 'rgba(144, 238, 144, 0.9)',
                        height: '30px'
                    },
                    interval: 2,
                    done: false
                },
                {
                    name:'Generating instructions',
                    progressBar: {
                        width: 0,
                        backgroundColor: 'rgba(144, 238, 144, 0.9)',
                        height: '30px'
                    },
                    interval: 1,
                    done: false        
                }
            ],
            footer: '"Work smarter not harder, let Destiny Bounty Optimzer help you."',
            author: 'DBO Team'
        }
    }

    componentDidMount() {
        this.setState({ content: loadscreen[Math.round(Math.random() * (loadscreen.length - 1))] })
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
        this.setState(prevState => ({
            content: {
                ...prevState.content,
                objectives: prevState.content.objectives.map(elem => {
                    if (elem.progressBar.width === 438)
                        return {
                            ...elem,
                            progressBar: {
                                ...elem.progressBar,
                                width: 0
                            },
                            interval: 0,
                            done: true
                        }

                    return {
                        ...elem,
                        progressBar: {
                            ...elem.progressBar,
                            width: elem.progressBar.width + elem.interval
                        }
                    }
                })                                         
            }
        }))

        if (!this.props.load.loading) {
            clearInterval(this.load)
            console.log('done loading')
            this.setState(prevState => ({
                content: {
                    ...prevState.content,
                    objectives: prevState.content.objectives.map(elem => {
                        if (!elem.done)
                            return {
                                ...elem,
                                progressBar: {
                                    ...elem.progressBar,
                                    width: 438
                                }               
                            }
                        return elem
                    })
                }
            }))
            setTimeout(() => this.setState(prevState => ({
                content: {
                    ...prevState.content,
                    objectives: prevState.content.objectives.map(elem => {
                        return {
                            ...elem,
                            progressBar: {
                                ...elem.progressBar,
                                width: 0
                            },
                            interval: 0,
                            done: true
                        }
                    })
                }
            }))
            , 100)
            setTimeout(() => this.props.loadPage(), 1000)
        }
    }

    render() {
        let objectives = this.state.content.objectives.map(elem =>
            <div className='objectiveContainer' key={elem.name}>                   
                {elem.done ? 
                <div className='filledBox'>
                    <div className='fill'></div>
                </div> : <div className='emptyBox'></div>}
                <div className='objectiveBox'>
                    <div style={elem.progressBar}></div>
                    <h2>{elem.name}</h2>
                </div>
            </div>
        )

        return (
            <div className='loadingContainer'>
                <div className='loadingHeader'>
                    <h1>{this.state.content.title}</h1>
                    <h3>{this.state.content.subTitle}</h3>
                </div>
                <div className='loadingBody'>
                    <h3>{this.state.content.desc}</h3>
                    {objectives}
                </div>
                <div className='loadingFooter'>
                    <h3>{this.state.content.footer} &mdash; {this.state.content.author}</h3>
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