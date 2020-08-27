import React from 'react';
import '../css/Navbar.css'

const Navbar = () => {

    return (
        <div className='navbar'>
            <a href='/'>Home</a>
            <a href='/bounties'>Bounties</a>
            <a href='/support'>Support</a>
            <a href='/info'>About</a>
        </div>
    )
}

export default Navbar