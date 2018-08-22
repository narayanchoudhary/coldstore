import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

export default class Sidebar extends Component {
    render() {
        return (
            <div className="sidebar">
                <Link activeClassName="is-active" to='/settings/items'>            Item    </Link>
                <Link activeClassName="is-active" to='/settings/varieties'>        Variety </Link>
                <Link activeClassName="is-active" to='/settings/size'>             Size    </Link>
                <Link activeClassName="is-active" to='/settings/year'>             Year    </Link>
            </div>
        )
    }
}
