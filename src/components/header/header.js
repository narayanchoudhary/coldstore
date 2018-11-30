import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import './header.css';
import Select from 'react-select';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

class Header extends Component {

    handleChange = (selectedOption) => {
        this.props.changeCurrentYear(selectedOption);
    }

    componentDidMount() {
        this.props.fetchYears();
        this.props.fetchCurrentYear();
    }

    render() {
        return (
            <div className='header'>
                <div className='navigation'>
                    <NavLink exact={true} activeClassName="is-active" to='/'> Dashboard    </NavLink>
                    <NavLink activeClassName="is-active" to='/parties'>       Parties      </NavLink>
                    <NavLink activeClassName="is-active" to='/avaks'>         Avak         </NavLink>
                    <NavLink activeClassName="is-active" to='/javaks'>        Javak        </NavLink>
                    <NavLink activeClassName="is-active" to='/rents'>         Rent         </NavLink>
                    {/* <NavLink activeClassName="is-active" to='/transactions'>  Transactions </NavLink> */}
                    {/* <NavLink activeClassName="is-active" to='/expenses'>      Expenses     </NavLink> */}
                    <NavLink activeClassName="is-active" to='/banks'>         Banks        </NavLink>
                    <NavLink activeClassName="is-active" to='/settings'>      Settings     </NavLink>
                </div>
                <div className='year'>
                    <Select
                        value={this.props.currentYear}
                        onChange={this.handleChange}
                        options={this.props.years}
                        clearable={false}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentYear: state.year.currentYear,
        years: state.year.years
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeCurrentYear: (year) => dispatch(actions.changeCurrentYear(year)),
        fetchYears: () => dispatch(actions.fetchYears()),
        fetchCurrentYear: () => dispatch(actions.fetchCurrentYear())
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Header);