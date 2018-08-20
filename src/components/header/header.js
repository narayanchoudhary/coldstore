import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import './header.css';

class Header extends Component {
    render() {
        return (
            <div className='header'>
                <NavLink exact={true} activeClassName="is-active" to='/'>             status    </NavLink>
                <NavLink activeClassName="is-active" to='/parties'>      parties      </NavLink>
                <NavLink activeClassName="is-active" to='/avaks'>        avak         </NavLink>
                <NavLink activeClassName="is-active" to='/javaks'>       javak        </NavLink>
                <NavLink activeClassName="is-active" to='/transactions'> Transactions </NavLink>
                <NavLink activeClassName="is-active" to='/settings'>     Settings     </NavLink>
            </div>
        )
    }
}

export default Header 