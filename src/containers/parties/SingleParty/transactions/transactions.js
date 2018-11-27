import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';
import './transactions.css';
import { rowClasses } from "../../../../utils/utils";
import commaNumber from 'comma-number';

class Transactions extends Component {

    iDontKnow = (props) => {
        props.fetchTransactionsOfSingleParty(props.partyId, () => { });
    }

    componentDidMount() { this.iDontKnow(this.props); }

    componentWillReceiveProps(nextProps) {
        if (this.props.partyId !== nextProps.partyId) {
            this.iDontKnow(nextProps);
        }
    }

    creditFormatter = (cell, row) => {
        if (row.side === 'credit') {
            return commaNumber(cell);
        } else {
            return '';
        }
    };

    debitFormatter = (cell, row) => {
        if (row.side === 'debit') {
            return commaNumber(row.amount);
        } else {
            return '';
        }
    };


    rowClasses = (row, rowIndex) => {
        let rowClasses = 'capitalize';
        if (row._id === 'footer') {
            rowClasses += ' tableFooter';
        }
        return rowClasses;
    };



    render() {
        let columns = [
            {
                dataField: '_id',
                text: 'ID',
                hidden: true
            }, {
                dataField: 'date',
                text: 'Date',
            }, {
                dataField: 'party',
                text: 'Party',
                classes: 'capitalize',
                hidden: true
            }, {
                dataField: 'particular',
                text: 'Particular',
                classes: 'remark'
            }, {
                dataField: 'amount',
                text: 'Credit',
                formatter: this.creditFormatter
            }, {
                dataField: 'debit',// debit key is not stored in the database it is give to just keep it unique
                text: 'Debit',
                formatter: this.debitFormatter,
            }];

        return (
            <div className="avaksContainer singlePartyTransactions">
                <BootstrapTable
                    columns={columns}
                    keyField='_id'
                    data={this.props.transactionsOfSingleParty}
                    wrapperClasses="avaksTableWrapper"
                    bordered
                    hover
                    striped
                    filter={filterFactory()}
                    noDataIndication="No items"
                    rowClasses={rowClasses}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        parties: state.party.parties.data,
        banks: state.bank.options,
        transactionsOfSingleParty: state.transaction.transactionsOfSingleParty,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTransactionsOfSingleParty: (partyId, thenCallback) => dispatch(actions.fetchTransactionsOfSingleParty(partyId, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);