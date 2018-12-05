import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

export default class Sidebar extends Component {
    render() {
        return (
            <div className="sidebar">
                <Link to='/settings/items'>     Item    </Link>
                <Link to='/settings/varieties'> Variety </Link>
                <Link to='/settings/sizes'>     Size    </Link>
                <Link to='/settings/years'>     Year    </Link>
                <Link to='/settings/addresses'> Address </Link>
                <Link to='/settings/setups'>    Setup   </Link>
                <Link to='/settings/expenseCategories'> Expense </Link>
                <Link to='/settings/counters'> Counters</Link>
            </div>
        )
    }
}
