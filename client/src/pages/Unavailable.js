import React from 'react';
import Navbar from '../components/Navbar'

const Unavailable = () => {

    return (
        <div>
            <Navbar /> 
            <div className="main"></div>
            <div className="main-title"></div>
            <div className="main-content">
                <h4>
                    The Bungie API is currently down or is being slow due to a high volume of players. 
                    Please try agian at a later time.
                </h4>
            </div>
        </div>
    )
}

export default Unavailable 