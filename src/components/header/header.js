import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import './header.css';
import Select from 'react-select';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

class Header extends Component {

    handleChange = (selectedOption) => {
        if (selectedOption === null) {
            selectedOption = this.props.years[0]
        }
        this.props.changeYear(selectedOption.value);
    }

    componentDidMount() {
        this.props.fetchYears();
    }

    render() {
        return (
            <div className='header'>
                <div className='navigation'>
                    <NavLink exact={true} activeClassName="is-active" to='/'>   status    </NavLink>
                    <NavLink activeClassName="is-active" to='/parties'>      parties      </NavLink>
                    <NavLink activeClassName="is-active" to='/avaks'>        avak         </NavLink>
                    <NavLink activeClassName="is-active" to='/javaks'>       javak        </NavLink>
                    <NavLink activeClassName="is-active" to='/transactions'> Transactions </NavLink>
                    <NavLink activeClassName="is-active" to='/settings'>     Settings     </NavLink>
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
        changeYear: (year) => dispatch(actions.changeYear(year)),
        fetchYears: () => dispatch(actions.fetchYears())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);