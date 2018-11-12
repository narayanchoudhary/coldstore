import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import 'react-select/dist/react-select.css';
import validate from './validation';
import { renderField, renderSelectField } from '../../../utils/fields';
import 'react-datepicker/dist/react-datepicker.css';
import './addTransaction.css';
import { required } from 'redux-form-validators';
import DateField from '../../../components/dateField/dateField';

class addTransaction extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.submitting = this.props.submitting;
        this.state = {};
    }

    componentDidMount = () => {
        this.props.fetchLastTransaction(() => {
            this.props.fetchNewReceiptNumberOfTransaction(() => { });
        });
    }

    submit = (values) => {
        values.address = values.address.value;
        values.party = values.party.value;
        values.bank = values.bank.value;
        values.yearId = this.props.currentYear.value;
        this.props.saveTransaction(values, () => {
            this.setState({ redirectToTransactions: true });
        });
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit(this.submit)}>
                {this.state.redirectToTransactions ? <Redirect to="/transactions" /> : null}
                <p className="newReceiptNumber">Reciept Number: {parseInt(this.props.newReceiptNumberOfTransaction, 10) + 1}</p>
                <div className="grid-container">
                    <DateField />
                    <Field name="address" component={renderSelectField} placeholder="Address" options={this.props.addresses} onChange={(address) => this.props.filterPartiesByAddress(this.props.parties, address)} />
                    <Field name="party" component={renderSelectField} placeholder="Party" options={this.props.filteredParties} validate={[required()]} />
                    <Field type="number" name="amount" component={renderField} placeholder="Amount" min="0" validate={[required()]} />
                    <div className="grid-item radioButtons">
                        <div><Field name="side" component="input" type="radio" value="credit" />Money In</div>
                        <div><Field name="side" component="input" type="radio" value="debit" />Money Out</div>
                    </div>
                    <Field name='bank' component={renderSelectField} placeholder="Bank" options={this.props.banks} validate={[required()]} />
                    <Field type="text" name='checkNumber' component={renderField} placeholder="Check Number" validate={[required()]} />
                    <Field type="text" name='remark' component={renderField} placeholder="Remark" validate={[required()]} />
                    <div className="grid-item">
                        <button type="submit" className="btn btn-primary" disabled={this.submitting} value="Save"> Save </button>`
                    </div>
                </div>
            </form>
        )
    }
}

const Form = reduxForm({
    form: 'transaction',// a unique identifier for this form
    validate,
    keepDirtyOnReinitialize: true,
    enableReinitialize: true,
    updateUnregisteredFields: true,
})(addTransaction);

const mapStateToProps = state => {
    return {
        parties: state.party.options,
        filteredParties: state.party.filteredPartiesOptions,
        addresses: state.address.options,
        banks: state.bank.options,
        currentYear: state.year.currentYear,
        initialValues: state.transaction.lastTransaction,
        newReceiptNumberOfTransaction: state.transaction.newReceiptNumberOfTransaction,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveTransaction: (values, thenCallback) => dispatch(actions.saveTransaction(values, thenCallback)),
        filterPartiesByAddress: (type, thenCallback) => dispatch(actions.filterPartiesByAddress(type, thenCallback)),
        fetchLastTransaction: (thenCallback) => dispatch(actions.fetchLastTransaction(thenCallback)),
        fetchNewReceiptNumberOfTransaction: (thenCallback) => dispatch(actions.fetchNewReceiptNumberOfTransaction(thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);