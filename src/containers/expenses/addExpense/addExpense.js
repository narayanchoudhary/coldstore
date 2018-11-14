import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import 'react-select/dist/react-select.css';
import validate from './validation';
import { renderField, renderSelectField } from '../../../utils/fields';
import 'react-datepicker/dist/react-datepicker.css';
import './addExpense.css';
import { required, date } from 'redux-form-validators';

class addExpense extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.submitting = this.props.submitting;
        this.state = {};
    }

    submit = (values) => {
        values.expenseCategory = values.expenseCategory.value;
        values.bank = values.bank.value;
        values.yearId = this.props.currentYear.value;
        this.props.saveExpense(values, () => {
            this.setState({ redirectToExpenses: true });
        });
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit(this.submit)}>
                {this.state.redirectToExpenses ? <Redirect to="/expenses" /> : null}
                <div className="grid-container">
                    <Field type="text" name="date" component={renderField} placeholder="Date" validate={[required(), date({ format: 'dd-mm-yyyy', '<=': 'today' })]} autoFocus />
                    <Field name="expenseCategory" component={renderSelectField} placeholder="Expense Category" options={this.props.expenseCategories} />
                    <Field type="number" name="amount" component={renderField} placeholder="Amount" min="0" validate={[required()]} />
                    <Field type="text" name='remark' component={renderField} placeholder="Remark" validate={[required()]} />
                    <Field name='bank' component={renderSelectField} placeholder="Bank" options={this.props.banks} validate={[required()]} />
                    <Field type="text" name='checkNumber' component={renderField} placeholder="Check Number" validate={[required()]} />
                    <div className="grid-item">
                        <button type="submit" className="btn btn-primary" disabled={this.submitting} value="Save"> Save </button>`
                    </div>
                </div>
            </form>
        )
    }
}

const Form = reduxForm({
    form: 'expense',// a unique identifier for this form
    validate
})(addExpense);

const mapStateToProps = state => {
    return {
        expenseCategories: state.expenseCategory.options,
        banks: state.bank.options,
        currentYear: state.year.currentYear,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveExpense: (values, thenCallback) => dispatch(actions.saveExpense(values, thenCallback)),
        fetchParties: (type, thenCallback) => dispatch(actions.fetchParties(type, thenCallback)),
        filterPartiesByAddress: (parties, address, thenCallback) => dispatch(actions.filterPartiesByAddress(parties, address, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);