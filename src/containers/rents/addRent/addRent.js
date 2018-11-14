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
class addRent extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.submitting = this.props.submitting;
        this.change = this.props.change;
        this.state = {};
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

    onChangeAddress = (address) => {
        this.props.filterPartiesByAddress(this.props.parties, address);
        this.change('addressOfMerchant', address);// Change addressOfMerchant to the  address
    }

    submit = (values) => {
        values.address = values.address.value;
        values.addressOfMerchant = values.addressOfMerchant.value;
        values.party = values.party.value;
        values.bank = values.bank.value;
        values.yearId = this.props.currentYear.value;
        values.merchant = values.merchant.value;
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
                        <DateField />
                        <Field name="address" component={renderSelectField} placeholder="Address" options={this.props.addresses} onChange={this.onChangeAddress} />
                        <Field name="party" component={renderSelectField} placeholder="Party" options={this.props.filteredParties} validate={[required()]} onChange={this.onPartyChange} />
                        <Field name="amount" type="number" component={renderField} placeholder="Amount" min="0" validate={[required()]} />
                        <Field name="addressOfMerchant" component={renderSelectField} placeholder="Address of merchant" options={this.props.addresses} onChange={address => this.props.filterMerchantsByAddress(this.props.parties, address)} />
                        <Field name="merchant" component={renderSelectField} placeholder="Merchant" options={this.props.filteredMerchants} validate={[required()]} />
                        <Field name='remark' type="text" component={renderField} placeholder="Remark" validate={[required()]} />
                        <div className="grid-item">
                            <button type="submit" className="btn btn-primary" disabled={this.submitting} value="Save"> Save </button>`
                    </div>
                    </div>
                </form>
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