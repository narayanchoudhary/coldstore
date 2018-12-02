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
import PartySelector from '../../../components/partySelector/partySelector';
import MerchantSelector from '../../../components/merchantSelector/merchantSelector';
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
            this.props.filterPartiesByAddress(this.props.parties, lastRent.address, () => { });
            this.props.filterMerchantsByAddress(this.props.parties, lastRent.addressOfMerchant, () => { });
            this.props.fetchNewReceiptNumberOfRent(lastRent.bank.value, () => { });
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

    submit = (values) => {
        values.yearId = this.props.currentYear.value;
        this.props.saveRent(values, () => {
            this.setState({ redirectToRents: true });
        });
    };

    render() {
        return (
            <Aux>
                <form onSubmit={this.handleSubmit(this.submit)}>
                    {this.state.redirectToRents ? <Redirect to="/rents" /> : null}
                    <p className="newReceiptNumber">Reciept Number: {this.props.newReceiptNumberOfRent}</p>
                    <div className="grid-container">
                        <Field name='bank' component={renderSelectField} placeholder="Bank" options={this.props.banks} validate={[required()]} onChange={(bank) => this.props.fetchNewReceiptNumberOfRent(bank.value, () => { })} />
                        <DateField />
                        <PartySelector change={this.props.change} rentType={this.props.cashOrBank} />
                        <Field name="amount" type="number" component={renderField} placeholder="Amount" min="0" validate={[required()]} />
                        <MerchantSelector change={this.props.change} />
                        <Field name='remark' type="text" component={renderField} placeholder="Remark" />
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
        filterPartiesByAddress: (parties, address, thenCallback) => dispatch(actions.filterPartiesByAddress(parties, address, thenCallback)),
        fetchLastRent: (thenCallback) => dispatch(actions.fetchLastRent(thenCallback)),
        fetchNewReceiptNumberOfRent: (bank, thenCallback) => dispatch(actions.fetchNewReceiptNumberOfRent(bank, thenCallback)),
        filterMerchantsByAddress: (parties, address, thenCallback) => dispatch(actions.filterMerchantsByAddress(parties, address, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);