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
import { columnFormatter, createDeleteButton, rowClasses, paginationOptions, filterValue, dateValidater, headerSortingStyle } from '../../utils/utils';

class Transactions extends Component {

    state = {
        transactions: [],
    };

    componentDidMount() {
        this.props.fetchTransactions((response) => {
            this.setState({ transactions: response.data });
        });
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
                sort: true,
                headerSortingStyle: headerSortingStyle,
                filter: textFilter()
            }, {
                dataField: 'date',
                text: 'Date',
                sort: true,
                headerSortingStyle: headerSortingStyle,
                filter: textFilter(),
                validator: dateValidater
            }, {
                dataField: 'party',
                text: 'Party',
                sort: true,
                headerSortingStyle: headerSortingStyle,
                formatter: columnFormatter(this.props.parties),
                filter: textFilter(),
                classes: 'capitalize',
                filterValue: filterValue(this.props.parties),
                editor: {
                    type: Type.SELECT,
                    options: this.props.parties
                }
            }, {
                dataField: 'amount',
                text: 'Credit',
                sort: true,
                headerSortingStyle: headerSortingStyle,
                filter: textFilter(),
                formatter: this.creditFormatter
            }, {
                dataField: 'debit',// debit key is not stored in the database it is give to just keep it unique
                text: 'Debit',
                sort: true,
                headerSortingStyle: headerSortingStyle,
                filter: textFilter(),
                formatter: this.debitFormatter,
            }, {
                dataField: 'checkNumber',
                text: 'CheckNo',
                sort: true,
                headerSortingStyle: headerSortingStyle,
                filter: textFilter(),
                classes: 'uppercase'
            }, {
                dataField: 'remark',
                text: 'Remark',
                sort: true,
                headerSortingStyle: headerSortingStyle,
                filter: textFilter(),
                classes: 'remark'
            }, {
                dataField: '_id',
                text: 'Action',
                formatter: createDeleteButton(this.handleClickOnDelete)
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
                    pagination={paginationFactory(paginationOptions(this.state.transactions))}
                    rowClasses={rowClasses}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        parties: state.party.options,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTransactions: (thenCallback) => dispatch(actions.fetchTransactions(thenCallback)),
        deleteTransaction: (transactionsId) => dispatch(actions.deleteTransaction(transactionsId)),
        editTransaction: (transaction) => dispatch(actions.editTransaction(transaction))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);