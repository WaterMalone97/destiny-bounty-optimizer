import React from 'react';
import Navbar from '../components/Navbar'
import '../css/Support.css'

class Support extends React.Component {

    state = {
       name: '',
       email: '',
       subject: '',
       textbox: '',
       submit: false,
       error: ''
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleClick = async() => {
        let body = JSON.stringify({
            name: this.state.name,
            email: this.state.email,
            subject: this.state.subject,
            body: this.state.textbox
        });

        await fetch('/support', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })
        this.setState({ submit: true })
    }

    render() {

        return (
            <div className='support-page'>
                <Navbar /> 
                <div className="main"></div>
                <div className="main-title"></div>                             
                <div className="main-content">
                    {this.state.submit ? 
                    <div>
                        <h5><a href='/support'>Back to support</a></h5>
                        <h4>Thank you for your interest in our application.
                            We appreciate any feedback you can give us. 
                            We will try to reply back as soon as possible.
                        </h4>
                    </div> :
                    <div>                      
                        <h1>Support</h1>
                        <h3>Contact Us</h3>
                        <h4>Email: destinybountyoptimizer@gmail.com</h4>
                        <h4>Having trouble using our application? Is there a bug? 
                            Have a suggestion? Wanna let us know how we're doing? 
                            Contact us using the email above or the form below.
                            We'll reply back as soon as possible.
                        </h4>
                        {this.state.error? <h4>{this.state.error}</h4>: null}
                        <div className='form'>                                              
                            <h5>Name:</h5>
                            <input type='text' name='name' placeholder='Name' onChange={this.handleChange}/>
                            <h5>Email:</h5>
                            <input type='email' name='email' placeholder='Email' onChange={this.handleChange}/>
                            <h5>Subject:</h5>
                            <input type='text' name='subject' placeholder='Subject' onChange={this.handleChange}/>
                            <h5>Tell us about your problem/suggestion.</h5>
                            <textarea name='textbox' cols='40' rows='10' onChange={this.handleChange}></textarea>                                                       
                        </div>
                        <button onClick={this.handleClick}>Submit</button>                         
                    </div>}
                </div>
            </div>
        )
    }
} 

export default Support;