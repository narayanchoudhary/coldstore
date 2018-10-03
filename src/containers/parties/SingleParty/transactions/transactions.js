import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';
import './transactions.css';
import { rowClasses, columnFormatter } from "../../../../utils/utils";

class Transactions extends Component {

    state = {
        transactions: []
    };
    
    iDontKnow = () => {
        this.props.fetchTransactionsByPartyId(this.props.partyId, (transactionResponse) => {
            this.props.fetchOpeningBalanceOfParty(this.props.partyId, (response) => {
                // Insert JavakHammali
                let javakHammali = {
                    _id: 'javakHammali',
                    amount: this.props.totalJavakHammali,
                    remark: 'Javak Hammali',
                    side: 'debit',
                    deleteButton: 'no'
                }
                transactionResponse.data.unshift(javakHammali);

                // Insert avak Hammali
                let avakHammali = {
                    _id: 'avakHammali',
                    amount: this.props.totalAvakHammali,
                    remark: 'Avak Hammali',
                    side: 'debit',
                    deleteButton: 'no'
                };
                transactionResponse.data.unshift(avakHammali);

                // Insert total rent in the transactions
                let totalRent = {
                    _id: 'totalRent',
                    amount: this.props.totalRent,
                    remark: 'Total Rent',
                    side: 'debit',
                    deleteButton: 'no'
                };
                transactionResponse.data.unshift(totalRent);

                // insert opening balance in the transactions
                let openingBalance = response.data;
                let openingBalanceRow = {
                    _id: 'openingBalance',
                    amount: openingBalance.openingBalance,
                    remark: 'Opening Balance',
                    side: openingBalance.side,
                    deleteButton: 'no',
                };
                transactionResponse.data.unshift(openingBalanceRow);
                transactionResponse.data.push(this.getFooterData(transactionResponse.data));
                this.setState({ transactions: transactionResponse.data });
            });
        });
    }

    componentDidMount() {
        this.iDontKnow();
    }

    componentWillReceiveProps(nextProps) {
        if(this.props !== nextProps) {
            this.iDontKnow();
        }
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
                totalCredit += parseInt(transaction.amount, 10);
            } else {
                totalDebit += parseInt(transaction.amount, 10);
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
            side: side,
            deleteButton: 'no'
        }
        return footer;
    }

    creditFormatter = (cell, row) => {
        if (row.side === 'credit') {
            return cell;
        } else {
            return '';
        }
    };

    debitFormatter = (cell, row) => {
        if (row.side === 'debit') {
            return row.amount;
        } else {
            return '';
        }
    };

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
                dataField: 'remark',
                text: 'Remark',
                classes: 'remark'
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
                dataField: 'bank',
                text: 'Bank',
                formatter: columnFormatter(this.props.banks)
            }];

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
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTransactionsByPartyId: (partyId, thenCallback) => dispatch(actions.fetchTransactionsByPartyId(partyId, thenCallback)),
        fetchParties: (type, thenCallback) => dispatch(actions.fetchParties(type, thenCallback)),
        deleteTransaction: (transactionsId) => dispatch(actions.deleteTransaction(transactionsId)),
        editTransaction: (transaction) => dispatch(actions.editTransaction(transaction)),
        fetchOpeningBalanceOfParty: (partyId, thenCallback) => dispatch(actions.fetchOpeningBalanceOfParty(partyId, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);