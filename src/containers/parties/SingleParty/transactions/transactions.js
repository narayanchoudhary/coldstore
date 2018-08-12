import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';
import './transactions.css';

class Transactions extends Component {

    state = {
        transactions: [],
        parties: []
    };

    componentDidMount() {
        // PartyId pass karni he
        this.props.fetchTransactionsByPartyId(this.props.partyId, (response) => {
            this.setState({ transactions: response.data });
        });

        this.props.fetchParties(['party', 'expense'], () => {
            let parties = this.props.parties.map((party) => {
                return { label: party.name + ' ' + party.address, value: party._id }
            });
            this.setState({ parties: parties });
        });
    }

    partyFormatter = (cell, row) => {
        this.props.parties.forEach((party) => {
            if (party._id.toLowerCase() === cell.toLowerCase()) {
                cell = party.name
            }
        });
        return (
            <span>{cell}</span>
        );
    };

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

    createDeleteButton = (cell, row) => {
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

    headerSortingStyle = { backgroundColor: '#ccc' };

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editTransaction(row);
        },
    });

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
                formatter: this.partyFormatter,
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
                    cellEdit={this.cellEdit}
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
        editTransaction: (transaction) => dispatch(actions.editTransaction(transaction))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);