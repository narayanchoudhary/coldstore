import React, { Component } from 'react';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import { rowClasses } from '../../../utils/utils';
import * as actions from '../../../store/actions';
import cellEditFactory from 'react-bootstrap-table2-editor';
import './counters.css';

class Counters extends Component {

    columns = [
        {
            dataField: 'counterName',
            text: 'Counter Name',
            editable: false,
        },
        {
            dataField: 'value',
            text: 'Counter Value'
        },
        {
            dataField: 'database', // For the purpose of editing the counters
            text: '',
            hidden: true,
        }
    ];

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editCounter(row, () => {
                this.props.fetchCounters(() => { });
            });
        }
    });

    componentDidMount() {
        this.props.fetchCounters(() => { });
    }

    render() {
        return (
            <BootstrapTable
                columns={this.columns}
                keyField='counterName'
                data={this.props.counters}
                wrapperClasses="tableWrapper"
                bordered
                hover
                striped
                cellEdit={this.cellEdit}
                rowClasses={rowClasses}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        counters: state.dashboard.counters,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCounters: (thenCallback) => dispatch(actions.fetchCounters(thenCallback)),
        editCounter: (data, thenCallback) => dispatch(actions.editCounter(data, thenCallback)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Counters);