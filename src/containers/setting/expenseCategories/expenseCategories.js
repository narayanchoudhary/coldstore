import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './expenseCategories.css';
import Button from '../../../components/UI/button/button';
import Aux from '../../../components/Auxilary/Auxilary';
import { rowClasses } from '../../../utils/utils';

class ExpenseCategories extends Component {

    componentDidMount() {
        this.props.fetchExpenseCategories(() => { });
    }

    handleClickOnDelete = (expenseCategoryId) => {
        this.props.deleteExpenseCategory(expenseCategoryId);
        this.props.fetchExpenseCategories(() => { });
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSvae: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editExpenseCategory(row);
        }
    });

    rowClasses = (row, rowIndex) => {
        return 'capitalize';
    };

    createActionCell = (cell, row) => {
        return (
            <Aux>
                <button
                    className="btn btn-danger btn-xs"
                    onClick={() => this.handleClickOnDelete(cell)}
                >
                    Delete
            </button>
            </Aux>
        );
    };

    render() {

        const columns = [{
            dataField: '_id',
            text: 'ID',
            hidden: true
        }, {
            dataField: 'expenseCategoryName',
            text: 'Name',
        }, {
            dataField: '_id',
            text: 'Action',
            formatter: this.createActionCell
        }];

        return (
            <div className="partiesContainer">
                <Link to='/settings/addExpenseCategory'>
                    <Button>  Add Expense Category </Button>
                </Link>
                <BootstrapTable
                    columns={columns}
                    keyField='_id'
                    data={this.props.expenseCategories}
                    wrapperClasses="partiesTableWrapper"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
                    filter={filterFactory()}
                    noDataIndication="No Expense Categories"
                    rowClasses={rowClasses}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        expenseCategories: state.expenseCategory.expenseCategories
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchExpenseCategories: (type, thenCallback) => dispatch(actions.fetchExpenseCategories(type, thenCallback)),
        deleteExpenseCategory: (expenseCategoryId) => dispatch(actions.deleteExpenseCategory(expenseCategoryId)),
        editExpenseCategory: (expenseCategory) => dispatch(actions.editExpenseCategory(expenseCategory))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseCategories);