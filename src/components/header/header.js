import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import './header.css';
import Select from 'react-select';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

class Header extends Component {

    state = {
        selectedOption: { label: '2017-18', value: '2017-18' },
    }

    handleChange = (selectedOption) => {
        if (selectedOption === null) {
            selectedOption = { label: '2017-18', value: '2017-18' }
        }
        this.setState({ selectedOption });
        this.props.changeYear(selectedOption.value);
    }

    options = [
        { label: '2017-18', value: '2017-18' },
        { label: '2018-19', value: '2018-19' },
        { label: '2019-20', value: '2019-20' },
        { label: '2020-21', value: '2020-21' },
        { label: '2021-22', value: '2021-22' },
        { label: '2022-23', value: '2022-23' },
    ];

    render() {
        return (
            <div className='header'>
                <div className='navigation'>
                    <NavLink exact={true} activeClassName="is-active" to='/'>             status    </NavLink>
                    <NavLink activeClassName="is-active" to='/parties'>      parties      </NavLink>
                    <NavLink activeClassName="is-active" to='/avaks'>        avak         </NavLink>
                    <NavLink activeClassName="is-active" to='/javaks'>       javak        </NavLink>
                    <NavLink activeClassName="is-active" to='/transactions'> Transactions </NavLink>
                    <NavLink activeClassName="is-active" to='/settings'>     Settings     </NavLink>
                </div>
                <div className='year'>
                    <Select
                        value={this.state.selectedOption}
                        onChange={this.handleChange}
                        options={this.options}
                        clearable={false}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentYear: state.year.currentYear
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeYear: (year) => dispatch(actions.changeYear(year))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);