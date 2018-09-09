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
import { required, date } from 'redux-form-validators';

class addTransaction extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.submitting = this.props.submitting;
        this.state = {
            banks: []
        };
    }

    submit = (values) => {
        delete values.address;
        values.party = values.party.value;
        values.bank = values.bank.value;
        this.props.saveTransaction(values, () => {
            this.setState({ redirectToTransactions: true });
        });
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit(this.submit)}>
                {this.state.redirectToTransactions ? <Redirect to="/transactions" /> : null}
                <div className="grid-container">
                    <Field type="text" name="date" component={renderField} placeholder="Date" validate={[required(), date({ format: 'dd-mm-yyyy', '<=': 'today' })]} autoFocus />
                    <Field name="address" component={renderSelectField} placeholder="Address" options={this.props.addresses} onChange={(address) => this.props.filterPartiesByAddress(this.props.parties, address)} />
                    <Field name="party" component={renderSelectField} placeholder="Party" options={this.props.filteredParties} validate={[required()]} />
                    <Field type="number" name="amount" component={renderField} placeholder="Amount" min="0" validate={[required()]} />
                    <div className="grid-item radioButtons">
                        <div><Field name="side" component="input" type="radio" value="credit" />Credit</div>
                        <div><Field name="side" component="input" type="radio" value="debit" />Debit</div>
                    </div>
                    <Field name='bank' component={renderSelectField} placeholder="Bank" options={this.props.banks} validate={[required()]} />
                    <Field type="text" name='checkNumber' component={renderField} placeholder="Check Number" validate={[required()]} />
                    <Field type="text" name='remark' component={renderField} placeholder="Remark" validate={[required()]}/>
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
    validate
})(addTransaction);

const mapStateToProps = state => {
    return {
        parties: state.party.partiesOptions,
        filteredParties: state.party.filteredPartiesOptions,
        addresses: state.address.options,
        banks: state.party.banksOptions
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveTransaction: (values, thenCallback) => dispatch(actions.saveTransaction(values, thenCallback)),
        fetchParties: (type, thenCallback) => dispatch(actions.fetchParties(type, thenCallback)),
        filterPartiesByAddress: (type, thenCallback) => dispatch(actions.filterPartiesByAddress(type, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);