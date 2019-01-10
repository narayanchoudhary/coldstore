import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

class Status extends Component {
    render() {
        return (
            <div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchStatus: (thenCallback) => dispatch(actions.fetchStatus(thenCallback)),

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Status);