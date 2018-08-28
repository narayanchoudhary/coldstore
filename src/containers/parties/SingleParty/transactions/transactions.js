import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';
import './transactions.css';

class Transactions extends Component {

    state = {
        transactions: []
    };

    componentDidMount() {
        this.props.fetchTransactionsByPartyId(this.props.partyId, (transactionResponse) => {
            this.props.fetchParty(this.props.partyId, (response) => {
                // Insert total rent in the transactions
                let totalRent = {
                    _id: 'totalRent',
                    amount: this.props.totalRent,
                    remark: 'Total Rent',
                    side: 'debit'
                };
                transactionResponse.data.unshift(totalRent);
                // insert opening balance in the transactions
                let party = response.data;
                let openingBalance = {
                    _id: 'openingBalance',
                    amount: party.openingBalance,
                    remark: 'Opening Balance',
                    side: party.openingBalance > 0 ? 'credit' : 'debit',
                };
                transactionResponse.data.unshift(openingBalance);
                transactionResponse.data.push(this.getFooterData(transactionResponse.data));
                this.setState({ transactions: transactionResponse.data });
            });
        });

    }

    getFooterData = (transactions) => {
        // Do not create footer if no transactions
        if (transactions.length === 0) {
            return;
        }

        let side = 'credit';
        let totalCredit = 0;
        let totalDebit = 0;
        let balance = 0;
        transactions.forEach((transaction) => {
            if (transaction.side === 'credit') {
                totalCredit += parseInt(transaction.amount);
            } else {
                totalDebit += parseInt(transaction.amount);
            }
        });

        balance = totalDebit - totalCredit;
        if (balance >= 0) {
            side = 'debit';
        }
        // Make balance positive if it is negative
        if (balance < 0) balance *= -1;

        let footer = {
            _id: 'footer',
            date: 'Balance',
            amount: balance,
            side: side
        }
        return footer;
    }

    creditFormatter = (cell, row) => {
        // hariom se puchhe
        if (row.side === 'debit') {
            return cell;
        } else {
            return '';
        }
    };

    debitFormatter = (cell, row) => {
        if (row.side === 'credit') {
            return row.amount;
        } else {
            return '';
        }
    };

    createDeleteButton = (cell, row) => {
        if (cell === 'totalRent' || cell === 'openingBalance' || row._id === 'footer') {
            return '';
        }
        return (
            <button
                className="btn btn-danger btn-xs"
                onClick={() => this.handleClickOnDelete(cell)}
            >
                Delete
            </button>
        );
    }

    handleClickOnDelete = (javakId) => {
        this.props.deleteTransaction(javakId);
        this.props.fetchTransactions((response) => {
            this.setState({ transactions: response.data });
        });
    }

    rowClasses = (row, rowIndex) => {
        let rowClasses = 'capitalize';
        if (row._id === 'footer') {
            rowClasses += ' tableFooter';
        }
        return rowClasses;
    };

    headerSortingStyle = { backgroundColor: '#ccc' };

    render() {
        let columns = [
            {
                dataField: '_id',
                text: 'ID',
                hidden: true
            }, {
                dataField: 'receiptNumber',
                text: 'R No',
            }, {
                dataField: 'date',
                text: 'Date',
            }, {
                dataField: 'party',
                text: 'Party',
                classes: 'capitalize',
                hidden: true
            }, {
                dataField: 'amount',
                text: 'Credit',
                formatter: this.creditFormatter
            }, {
                dataField: 'debit',// debit key is not stored in the database it is give to just keep it unique
                text: 'Debit',
                formatter: this.debitFormatter,
            }, {
                dataField: 'checkNumber',
                text: 'CheckNo',
                classes: 'uppercase'
            }, {
                dataField: 'remark',
                text: 'Remark',
                classes: 'remark'
            }, {
                dataField: '_id',
                text: 'Action',
                formatter: this.createDeleteButton
            }];

        let cellEdit = cellEditFactory({
            mode: 'click',
            blurToSave: true,
            nonEditableRows: () => [0, 1, 2],
            // afterSaveCell: (oldValue, newValue, row, column) => {
            //     this.props.editTransaction(row);
            // },
        });

        return (
            <div className="avaksContainer">
                <h3 className="transactionHeading">Transactions</h3>
                <BootstrapTable
                    columns={columns}
                    keyField='_id'
                    data={this.state.transactions}
                    wrapperClasses="avaksTableWrapper"
                    bordered
                    hover
                    striped
                    cellEdit={cellEdit}
                    filter={filterFactory()}
                    noDataIndication="No items"
                    rowClasses={this.rowClasses}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        parties: state.party.parties.data,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTransactionsByPartyId: (partyId, thenCallback) => dispatch(actions.fetchTransactionsByPartyId(partyId, thenCallback)),
        fetchParties: (type, thenCallback) => dispatch(actions.fetchParties(type, thenCallback)),
        deleteTransaction: (transactionsId) => dispatch(actions.deleteTransaction(transactionsId)),
        editTransaction: (transaction) => dispatch(actions.editTransaction(transaction)),
        fetchParty: (partyId, thenCallback) => dispatch(actions.fetchParty(partyId, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);