import React, { Component, Fragment } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './singleBank.css';
import { rowClasses, headerSortingStyle, columnFormatter } from "../../../utils/utils";

class SingleBank extends Component {

    componentDidMount() {
        this.props.fetchTransactionsOfSingleBank(this.props.bank._id, () => {

        });
    }

    render() {
        const columns = [{
            dataField: '_id',
            text: 'ID',
            hidden: true
        }, {
            dataField: 'receiptNumber',
            text: 'R No',
            sort: true,
            headerSortingStyle,
        }, {
            dataField: 'date',
            text: 'Date',
            sort: true,
            headerSortingStyle,
        }, {
            dataField: 'party',
            text: 'Particular',
            sort: true,
            headerSortingStyle,
            formatter: columnFormatter(this.props.parties),
        }, {
            dataField: 'credit',
            text: 'Credit',
            sort: true,
            headerSortingStyle,
        }, {
            dataField: 'debit',
            text: 'Debit',
            sort: true,
            headerSortingStyle,
        }];

        return (
            <Fragment>
                <h3 className="partyName" >{this.props.bank ? this.props.bank.bankName + ' statement' : null}</h3>
                <BootstrapTable
                    columns={columns}
                    keyField='_id'
                    data={this.props.transactions}
                    wrapperClasses="tableWrapper"
                    bordered
                    hover
                    striped
                    noDataIndication="No Transactions"
                    rowClasses={rowClasses}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        transactions: state.bank.transactions,
        parties: state.party.options,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTransactionsOfSingleBank: (bankId, thenCallback) => dispatch(actions.fetchTransactionsOfSingleBank(bankId, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleBank);