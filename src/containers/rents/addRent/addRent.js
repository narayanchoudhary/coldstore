import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import 'react-select/dist/react-select.css';
import { renderField, renderSelectField } from '../../../utils/fields';
import 'react-datepicker/dist/react-datepicker.css';
import './addRent.css';
import { required } from 'redux-form-validators';
import DateField from '../../../components/dateField/dateField';
import Aux from '../../../components/Auxilary/Auxilary';
import numWords from 'num-words';
class addRent extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.submitting = this.props.submitting;
        this.change = this.props.change;
        this.state = { amountInWords: null };
    }

    duplicateLogic = () => {
        this.props.fetchLastRent((lastRent) => {
            this.props.filterPartiesByAddress(this.props.parties, lastRent.address);
            this.props.filterMerchantsByAddress(this.props.parties, lastRent.addressOfMerchant);
            this.props.fetchNewReceiptNumberOfRent(() => { });
        });
    }

    componentDidMount = () => { 
        this.duplicateLogic();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.parties !== this.props.parties) {
            this.duplicateLogic();
        }
    }

    handleKeyPressOnAmount = (event) => {
        this.setState({ amountInWords: numWords(event.target.value) })
    };

    onChangeAddress = (address) => {
        this.props.filterPartiesByAddress(this.props.parties, address);
        this.change('addressOfMerchant', address);// Change addressOfMerchant to the  address
    }

    submit = (values) => {
        values.address = values.address.value;
        values.party = values.party.value;
        values.bank = values.bank.value;
        values.yearId = this.props.currentYear.value;
        this.props.saveRent(values, () => {
            this.setState({ redirectToRents: true });
        });
    };

    onPartyChange = (party) => {
        this.change('merchant', party);// Change merchant to the party
    }

    render() {
        return (
            <Aux>
                <form onSubmit={this.handleSubmit(this.submit)}>
                    {this.state.redirectToRents ? <Redirect to="/rents" /> : null}
                    <p className="newReceiptNumber">Reciept Number: {this.props.newReceiptNumberOfRent}</p>
                    <div className="grid-container">
                        <Field name='bank' component={renderSelectField} placeholder="Bank" options={this.props.banks} validate={[required()]} />
                        <div className="grid-item radioButtons">
                            <div><Field name="side" component="input" type="radio" value="credit" />Money In</div>
                            <div><Field name="side" component="input" type="radio" value="debit" />Money Out</div>
                        </div>
                        <DateField />
                        <Field name="address" component={renderSelectField} placeholder="Address" options={this.props.addresses} onChange={this.onChangeAddress} />
                        <Field name="party" component={renderSelectField} placeholder="Party" options={this.props.filteredParties} validate={[required()]} onChange={this.onPartyChange} />
                        <Field type="number" name="amount" component={renderField} placeholder="Amount" min="0" validate={[required()]} onChange={this.handleKeyPressOnAmount} />
                        <Field name="addressOfMerchant" component={renderSelectField} placeholder="Address of merchant" options={this.props.addresses} onChange={address => this.props.filterMerchantsByAddress(this.props.parties, address)} />
                        <Field name="merchant" component={renderSelectField} placeholder="Merchant" options={this.props.filteredMerchants} validate={[required()]} />
                        <Field type="text" name='checkNumber' component={renderField} placeholder="Check Number" validate={[required()]} />
                        <Field type="text" name='remark' component={renderField} placeholder="Remark" validate={[required()]} />
                        <div className="grid-item">
                            <button type="submit" className="btn btn-primary" disabled={this.submitting} value="Save"> Save </button>`
                    </div>
                    </div>
                </form>
                <div className="amountInWords">
                    {this.state.amountInWords}
                </div>
            </Aux>
        )
    }
}

const Form = reduxForm({
    form: 'rent',// a unique identifier for this form
    keepDirtyOnReinitialize: true,
    enableReinitialize: true,
    updateUnregisteredFields: true,
})(addRent);

const mapStateToProps = state => {
    return {
        parties: state.party.options,
        filteredParties: state.party.filteredPartiesOptions,
        filteredMerchants: state.party.filteredMerchantsOptions,
        addresses: state.address.options,
        banks: state.bank.options,
        currentYear: state.year.currentYear,
        initialValues: state.rent.lastRent,
        newReceiptNumberOfRent: state.rent.newReceiptNumberOfRent,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveRent: (values, thenCallback) => dispatch(actions.saveRent(values, thenCallback)),
        filterPartiesByAddress: (type, thenCallback) => dispatch(actions.filterPartiesByAddress(type, thenCallback)),
        fetchLastRent: (thenCallback) => dispatch(actions.fetchLastRent(thenCallback)),
        fetchNewReceiptNumberOfRent: (thenCallback) => dispatch(actions.fetchNewReceiptNumberOfRent(thenCallback)),
        filterMerchantsByAddress: (parties, address) => dispatch(actions.filterMerchantsByAddress(parties, address)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);