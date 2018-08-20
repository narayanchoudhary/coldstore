import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import Button from '../../components/UI/button/button';
import { Link } from 'react-router-dom';
import './transactions.css';

class Transactions extends Component {

    state = {
        transactions: [],
        parties: []
    };

    componentDidMount() {
        this.props.fetchTransactions((response) => {
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

    paginationOptions = {
        sizePerPageList: [{
            text: '11', value: 11
        }, {
            text: '12', value: 12
        }, {
            text: 'All', value: this.state.transactions ? this.state.transactions.length === 0 ? 1 : this.state.transactions.length : 1
        }]
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
                sort: true,
                headerSortingStyle: this.headerSortingStyle,
                filter: textFilter()
            }, {
                dataField: 'date',
                text: 'Date',
                sort: true,
                headerSortingStyle: this.headerSortingStyle,
                filter: textFilter()
            }, {
                dataField: 'party',
                text: 'Party',
                sort: true,
                headerSortingStyle: this.headerSortingStyle,
                formatter: this.partyFormatter,
                filter: textFilter(),
                classes: 'capitalize',
                filterValue: (cell, row) => {
                    this.props.parties.forEach((party) => {
                        if (party._id.toLowerCase() === cell.toLowerCase()) {
                            cell = party.name + ' ' + party.address
                        }
                    });

                    return cell
                },
                editor: {
                    type: Type.SELECT,
                    options: this.state.parties
                }
            }, {
                dataField: 'amount',
                text: 'Credit',
                sort: true,
                headerSortingStyle: this.headerSortingStyle,
                filter: textFilter(),
                formatter: this.creditFormatter
            }, {
                dataField: 'debit',// debit key is not stored in the database it is give to just keep it unique
                text: 'Debit',
                sort: true,
                headerSortingStyle: this.headerSortingStyle,
                filter: textFilter(),
                formatter: this.debitFormatter,
            }, {
                dataField: 'checkNumber',
                text: 'CheckNo',
                sort: true,
                headerSortingStyle: this.headerSortingStyle,
                filter: textFilter(),
                classes: 'uppercase'
            }, {
                dataField: 'remark',
                text: 'Remark',
                sort: true,
                headerSortingStyle: this.headerSortingStyle,
                filter: textFilter(),
                classes: 'remark'
            }, {
                dataField: '_id',
                text: 'Action',
                formatter: this.createDeleteButton
            }];

        return (
            <div className="avaksContainer">
                <Link to='/transactions/addTransaction'>
                    <Button>  Add Transaction </Button>
                </Link>
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
                    pagination={paginationFactory(this.paginationOptions)}
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
        fetchTransactions: (thenCallback) => dispatch(actions.fetchTransactions(thenCallback)),
        fetchParties: (type, thenCallback) => dispatch(actions.fetchParties(type, thenCallback)),
        deleteTransaction: (transactionsId) => dispatch(actions.deleteTransaction(transactionsId)),
        editTransaction: (transaction) => dispatch(actions.editTransaction(transaction))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);