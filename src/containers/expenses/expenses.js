import React, { Component, Fragment } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import Button from '../../components/UI/button/button';
import { Link } from 'react-router-dom';
import './expenses.css';
import { columnFormatter, createDeleteButton, rowClasses, paginationOptions, filterValue, dateValidater, headerSortingStyle } from '../../utils/utils';

class Expenses extends Component {

    componentDidMount() {
        this.props.fetchExpenses((response) => {
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
        this.props.deleteExpense(javakId);
        this.props.fetchExpenses((response) => {
        });
    }



    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editExpense(row);
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
                filter: textFilter(),
                editable: false,
            }, {
                dataField: 'date',
                text: 'Date',
                sort: true,
                headerSortingStyle: headerSortingStyle,
                filter: textFilter(),
                validator: dateValidater
            }, {
                dataField: 'expenseCategory',
                text: 'Category',
                sort: true,
                headerSortingStyle: headerSortingStyle,
                formatter: columnFormatter(this.props.expenseCategories),
                filter: textFilter(),
                classes: 'capitalize',
                filterValue: filterValue(this.props.expenseCategories),
                editor: {
                    type: Type.SELECT,
                    options: this.props.expenseCategories
                }
            }, {
                dataField: 'amount',
                text: 'Amount',
                sort: true,
                headerSortingStyle: headerSortingStyle,
                filter: textFilter()
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
                    options: this.props.banks
                }
            }, {
                dataField: 'checkNumber',
                text: 'Check Number',
                sort: true,
                headerSortingStyle: headerSortingStyle,
                filter: textFilter()
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
            <Fragment>
                <Link to='/expenses/addExpense'>
                    <Button>  Add Expense </Button>
                </Link>
                <BootstrapTable
                    columns={columns}
                    keyField='_id'
                    data={this.props.expenses}
                    wrapperClasses="tableWrapper"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
                    filter={filterFactory()}
                    noDataIndication="No items"
                    pagination={paginationFactory(paginationOptions(this.props.expenses))}
                    rowClasses={rowClasses}
                />
            </Fragment>    
        )
    }
}

const mapStateToProps = state => {
    return {
        expenses: state.expense.expenses,
        expenseCategories: state.expenseCategory.options,
        banks: state.bank.options
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchExpenses: (thenCallback) => dispatch(actions.fetchExpenses(thenCallback)),
        deleteExpense: (expensesId) => dispatch(actions.deleteExpense(expensesId)),
        editExpense: (expense) => dispatch(actions.editExpense(expense))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Expenses);