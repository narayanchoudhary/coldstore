import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';
import './addExpenseCategory.css';
import 'react-select/dist/react-select.css';
import { renderField } from '../../../../utils/fields';
import 'react-datepicker/dist/react-datepicker.css';
import { required } from 'redux-form-validators';


class addExpenseCategory extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.submitting = this.props.submitting;
        this.state = {redirectToExpenseCategories: false};
    }

    submit = (values) => {
        this.props.saveExpenseCategory(values);
        this.setState({ redirectToExpenseCategories: true })
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit(this.submit)} className="avakForm">
                {this.state.redirectToExpenseCategories ? <Redirect to="/settings/expenseCategories" /> : null}
                <div className="grid-container setting">
                    <Field type="text" name="expenseCategoryName" component={renderField} placeholder="Expense Category Name" validate={[required()]} autoFocus/>
                    <div className="grid-item">
                        <button type="submit" className="btn btn-primary" disabled={this.submitting} value="Save"> Save </button>
                    </div>
                </div>
            </form>
        )
    }
}

const Form = reduxForm({
    form: 'addExpenseCategory',// a unique identifier for this form
})(addExpenseCategory);

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveExpenseCategory: (values) => dispatch(actions.saveExpenseCategory(values))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);