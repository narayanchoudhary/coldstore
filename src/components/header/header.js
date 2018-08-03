import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import './header.css';
class Header extends Component {
    render() {
        return (
            <div className='header'>
                <Link to='/'>        status    </Link>
                <Link to='/parties'> parties </Link>
                <Link to='/avaks'>    avak    </Link>
                <Link to='/javaks'>   javak </Link>
                <a>Setting</a>
            </div>
        )
    }
}

export default Header 