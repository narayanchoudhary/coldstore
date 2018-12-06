import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { rowClasses } from '../../../utils/utils';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './varietyDescription.css';
class VarietyDescription extends Component {

    balanceFormatter = (cell, row) => {
        let balance = cell;

        if (row.varietyName !== 'total') {
            balance = <div
                onClick={() => this.props.showPartiesWithRemainingPackets(row)}
                className="balance"
            >
                {cell}
            </div>
        }

        return balance;
    }

    render() {
        let columns = [
            {
                dataField: 'varietyName',
                text: 'Variety',
            }, {
                dataField: 'totalAvakOfVariety',
                text: 'Avak',
                classes: (cell, row) => cell !== 0 ? 'hasSomething' : ''
            }, {
                dataField: 'totalJavakOfVariety',
                text: 'Javak',
                classes: (cell, row) => cell !== 0 ? 'hasSomething' : ''
            }, {
                dataField: 'balance',
                text: 'Balance',
                formatter: this.balanceFormatter,
                classes: (cell, row) => cell !== 0 ? 'hasSomething' : ''    
            }
        ];
        return (
            <BootstrapTable
                columns={columns}
                keyField='varietyName'
                data={this.props.data}
                wrapperClasses="tableWrapper"
                bordered
                hover
                striped
                noDataIndication="No Javak"
                rowClasses={rowClasses}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
        partiesWithRemainingPackets: state.dashboard.partiesWithRemainingPackets
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPartiesWithRemainingPackets: (data, thenCallback) => dispatch(actions.fetchPartiesWithRemainingPackets(data, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VarietyDescription);