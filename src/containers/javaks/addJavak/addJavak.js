import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './addJavak.css';
import 'react-select/dist/react-select.css';
import validate from './validation';
import 'react-datepicker/dist/react-datepicker.css';
import JavakLots from './javakLots/javakLots';
import { withRouter } from 'react-router';
import { required } from 'redux-form-validators';
import { renderField, renderSelectField } from '../../../utils/fields';
import SaveButton from '../../../components/UI/saveButton/saveButton';
import { formValueSelector } from "redux-form";
import DateField from '../../../components/dateField/dateField';
import MerchantSelector from '../../../components/merchantSelector/merchantSelector';
const selector = formValueSelector("javak");

class addJavak extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.submitting = this.props.submitting;
        this.change = this.props.change;
        this.state = { partyId: null, type: null };
    }

    componentDidMount() {
        this.props.removeTempJavakLots();
        this.props.fetchLastJavak((lastJavak) => {
            this.props.filterPartiesByAddress(this.props.parties, lastJavak.address, () => { 
                this.props.filterMerchantsByAddress(this.props.parties, lastJavak.addressOfMerchant, () => {
                    this.props.fetchNewReceiptNumberForJavak(lastJavak.type.value, () => {
                        this.onPartySelect(this.props.initialValues.party.value);
                    });
                 });
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.initialValues.party.value !== this.props.initialValues.party.value) {
            this.onPartySelect(nextProps.initialValues.party.value);
        }
    }

    componentWillUnmount() {
        this.props.removeTempJavakLots();
    }

    submit = (values) => {
        // Do not submit the form if there is no javakLots;
        if (this.props.sumOfJavakLots === 0) return false;

        // Get the values from dropdown
        values.type = values.type.value;
        values.address = values.address.value;
        values.addressOfMerchant = values.addressOfMerchant.value;
        values.party = values.party.value;
        values.merchant = values.merchant.value;
        values.yearId = this.props.currentYear.value; // Add current year 
        this.props.saveJavak(values, (result) => {
            this.setState({ redirectToJavaks: true });
        });
    };

    onPartySelect = (partyId) => {
        this.setState({ ...this.state, partyId: partyId });
    }

    onChangeAddress = (address) => {
        this.props.filterPartiesByAddress(this.props.parties, address, (filteredParties) => {

            if (filteredParties.length === 1) {
                this.props.change('party', filteredParties[0]);
                this.onPartyChange(filteredParties[0]);
            } else {
                this.props.change('party', null);
                this.onPartyChange({});
            }

            if (this.props.typeFieldValue.value !== 'chips') {
                this.change('addressOfMerchant', address);// Change addressOfMerchant to the  address
                this.props.filterMerchantsByAddress(this.props.parties, address, () => {});
            }
        });
    }

    onPartyChange = (party) => {
        this.onPartySelect(party.value);
        this.props.removeTempJavakLots();
        if (this.props.typeFieldValue.value !== 'chips')
            this.change('merchant', party);// Change merchant to the party

        // Change the address also
        this.props.addresses.every((address, index) => {
            if (address.value === party.address) {
                this.props.change('address', address);
                if (this.props.typeFieldValue.value !== 'chips') {
                    this.change('addressOfMerchant', address);// Change addressOfMerchant to the  address
                }
                return false;// break loop
            }
            return true;
        });
    }

    onChangeType = (type) => {// Aloo type chamber or rashan
        this.setState({ ...this.state, type: type.value });
        this.props.fetchNewReceiptNumberForJavak(type.value, () => { });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit(this.submit)} className="addJavakForm">
                {this.state.redirectToJavaks ? <Redirect to="/javaks" /> : null}
                <p className="newReceiptNumber">Reciept Number: {this.props.newReceiptNumber}</p>
                <div className="grid-container">
                    <DateField />
                    <Field name="type" component={renderSelectField} placeholder="Type" options={this.props.type} onChange={this.onChangeType} validate={[required()]} />
                    <Field name="address" component={renderSelectField} placeholder="Address" options={this.props.addresses} onChange={this.onChangeAddress} />
                    <Field name="party" component={renderSelectField} placeholder="Party" options={this.props.filteredParties} onChange={this.onPartyChange} validate={[required()]} />
                    <MerchantSelector change={this.props.change} />
                    <Field type="text" name="remark" component={renderField} placeholder="Remark" />
                    <JavakLots
                        partyId={this.state.partyId}
                        type={this.state.type ? this.state.type : this.props.initialValues.type.value}
                    />
                    <div className="grid-item totalOfJavaklots">Total: {this.props.sumOfJavakLots}  </div>
                    <div className="grid-item saveButton">
                        <SaveButton disabled={this.submitting} />
                    </div>
                </div>
            </form>
        )
    }
}

const Form = reduxForm({
    form: 'javak',// a unique identifier for this form
    validate,
    keepDirtyOnReinitialize: true,
    enableReinitialize: true,
    updateUnregisteredFields: true,
})(addJavak);

const mapStateToProps = state => {
    return {
        parties: state.party.options,
        filteredParties: state.party.filteredPartiesOptions,
        filteredMerchants: state.party.filteredMerchantsOptions,
        addresses: state.address.options,
        currentYear: state.year.currentYear,
        initialValues: state.javak.lastJavak,
        type: state.item.typeOptions,
        lots: state.javakLot.lots,
        sumOfJavakLots: state.javakLot.sumOfJavakLots,
        newReceiptNumber: state.javak.newReceiptNumber,
        typeFieldValue: selector(state, "type")
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveJavak: (values, thenCallback) => dispatch(actions.saveJavak(values, thenCallback)),
        filterPartiesByAddress: (parties, address, thenCallback) => dispatch(actions.filterPartiesByAddress(parties, address, thenCallback)),
        filterMerchantsByAddress: (parties, address, thenCallback) => dispatch(actions.filterMerchantsByAddress(parties, address, thenCallback)),
        fetchAvaksOfParty: (partyId, thenCallback) => dispatch(actions.fetchAvaksOfParty(partyId, thenCallback)),
        saveJavakLot: (avakId, javakId, thenCallback) => dispatch(actions.saveJavakLot(avakId, javakId, thenCallback)),
        fetchJavakLotsByJavakId: (javakId, thenCallback) => dispatch(actions.fetchJavakLotsByJavakId(javakId, thenCallback)),
        fetchJavakLotsByAvakIds: (avakId, thenCallback) => dispatch(actions.fetchJavakLotsByAvakIds(avakId, thenCallback)),
        removeTempJavakLots: () => dispatch(actions.removeTempJavakLots()),
        fetchLastJavak: (thenCallback) => dispatch(actions.fetchLastJavak(thenCallback)),
        fetchNewReceiptNumberForJavak: (type, thenCallback) => dispatch(actions.fetchNewReceiptNumberForJavak(type, thenCallback)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form));