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

    componentDidMount() {
        this.props.fetchTransactions(() => { });
    }

    handleClickOnDelete = (row) => {
        this.props.deleteTransaction(row._id, () => {
            this.props.fetchTransactions(() => { });
        });
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            // changing the row to save it in database correctly
            let rowTosave = {};
            if (column.dataField === 'debit') {
                rowTosave = { ...row, side: 'debit', amount: newValue }
            } else if (column.dataField === 'credit') {
                rowTosave = { ...row, side: 'credit', amount: newValue }
            } else {
                rowTosave = { ...row }
            }
            this.props.editTransaction(rowTosave, () => {
                this.props.fetchTransactions(() => { });
            });
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
                dataField: 'credit',
                text: 'Credit',
                sort: true,
                headerSortingStyle: headerSortingStyle,
                filter: textFilter(),
            }, {
                dataField: 'debit', // debit key is not stored in the database it is given to just keep it unique
                text: 'Debit',
                sort: true,
                headerSortingStyle: headerSortingStyle,
                filter: textFilter(),
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
                dataField: 'bank',
                text: 'Bank',
                sort: true,
                headerSortingStyle: headerSortingStyle,
                filter: textFilter(),
                formatter: columnFormatter(this.props.banks),
                filterValue: filterValue(this.props.banks),
                editor: {
                    type: Type.SELECT,
                    options: this.props.banks,
                },
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
                    data={this.props.transactions}
                    wrapperClasses="tableWrapper"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
                    filter={filterFactory()}
                    noDataIndication="No items"
                    pagination={paginationFactory(paginationOptions(this.props.transactions))}
                    rowClasses={rowClasses}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        parties: state.party.options,
        banks: state.bank.options,
        transactions: state.transaction.transactions,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTransactions: (thenCallback) => dispatch(actions.fetchTransactions(thenCallback)),
        deleteTransaction: (transactionsId, thenCallback) => dispatch(actions.deleteTransaction(transactionsId, thenCallback)),
        editTransaction: (transaction, thenCallback) => dispatch(actions.editTransaction(transaction, thenCallback))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);