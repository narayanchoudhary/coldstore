import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import 'react-select/dist/react-select.css';
import validate from './validation';
import { renderField, renderSelectField } from '../../../fields';
import 'react-datepicker/dist/react-datepicker.css';
import './addTransaction.css';

class addTransaction extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.submitting = this.props.submitting;
        this.state = {
            parties: [],
            filteredParties: [],
            addresses: [],
            banks: []
        };
    }

    componentDidMount = () => {
        // After fetching parties set parties and addresses
        this.props.fetchParties(['party', 'expense'], (response) => {
            let parties = response.data;

            this.setState({ parties: parties });

            let addresses = response.data.map((party) => {
                return { label: party.address, value: party.address }
            });

            // fetch banks
            this.props.fetchParties(['bank'], (response) => {
                let banks = response.data.map((bank) => {
                    return { label: bank.name, value: bank._id }
                });
                this.setState({ banks: banks });
            });

            let unique_addresses = [];
            addresses = addresses.filter((address) => {
                if (!unique_addresses.includes(address.value)) {
                    unique_addresses.push(address.value);
                    return true;
                } else {
                    return false;
                }
            });
            this.setState({ addresses: addresses });

            //this.filterPartiesByAddress(null);
        });
    }

    submit = (values) => {
        delete values.address;
        values.party = values.party.value;
        values.bank = values.bank.value;
        this.props.saveTransaction(values, () => {
            this.setState({ redirectToTransactions: true });
        });
    };

    filterPartiesByAddress = (address) => {
        let filteredParties = [];
        if (address) {
            if (address.value) {
                filteredParties = this.state.parties.filter(function (party) {
                    return party.address === address.value;
                });
            }
        }

        filteredParties = filteredParties.map((party) => {
            return { label: party.name, value: party._id }
        });
        this.setState({ filteredParties: filteredParties });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit(this.submit)}>
                {this.state.redirectToTransactions ? <Redirect to="/transactions" /> : null}
                <div className="grid-container">
                    <Field type="number" name="receiptNumber" component={renderField} placeholder="Receipt Number" min="0" />
                    <Field type="date" name="date" component={renderField} placeholder="Date" />
                    <Field name="address" component={renderSelectField} placeholder="Address" options={this.state.addresses} onChange={this.filterPartiesByAddress} />
                    <Field name="party" component={renderSelectField} placeholder="Party" options={this.state.filteredParties} />
                    <Field type="number" name="amount" component={renderField} placeholder="Amount" min="0" />
                    <div className="grid-item radioButtons">
                        <div><Field name="side" component="input" type="radio" value="credit" />Credit</div>
                        <div><Field name="side" component="input" type="radio" value="debit" />Debit</div>
                    </div>
                    <Field name='bank' component={renderSelectField} placeholder="Bank" options={this.state.banks} />
                    <Field type="text" name='checkNumber' component={renderField} placeholder="Check Number" />
                    <Field type="text" name='remark' component={renderField} placeholder="Remark" />
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
        parties: state.party.parties.data,
        addError: state.avak.addAvak.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveTransaction: (values, thenCallback) => dispatch(actions.saveTransaction(values, thenCallback)),
        fetchParties: (type, thenCallback) => dispatch(actions.fetchParties(type, thenCallback))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);