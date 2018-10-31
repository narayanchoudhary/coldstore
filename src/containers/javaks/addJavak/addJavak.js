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
import { required, date } from 'redux-form-validators';
import { renderField, renderSelectField } from '../../../utils/fields';

class addJavak extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.submitting = this.props.submitting;
        this.state = { partyId: null };
    }

    componentDidMount() {
        this.props.fetchLastJavak((response) => {
            this.props.filterPartiesByAddress(this.props.parties, { value: response.data[0].address.value });
        });
    }

    componentWillUnmount() {
        this.props.removeTempJavakLots();
    }

    submit = (values) => {
        values.party = values.party.value;
        values.merchant = values.merchant.value;
        values.yearId = this.props.currentYear.value; // Add current year 
        this.props.saveJavak(values, (result) => {
            this.setState({ redirectToJavaks: true });
        });
    };

    onPartySelect = (partyId) => {
        this.setState({ partyId: partyId });
    }

    render() {
        console.log('this.props.filteredMerchants: ', this.props.filteredMerchants);
        return (
            <form onSubmit={this.handleSubmit(this.submit)} className="addJavakForm">
                {this.state.redirectToJavaks ? <Redirect to="/javaks" /> : null}
                <div className="grid-container">
                    <Field type="text" name="date" component={renderField} placeholder="Date" validate={[required(), date({ format: 'dd-mm-yyyy', '<=': 'today' })]} />
                    <Field name="address" component={renderSelectField} placeholder="Address" options={this.props.addresses} onChange={address => this.props.filterPartiesByAddress(this.props.parties, address)} autoFocus />
                    <Field name="party" component={renderSelectField} placeholder="Party" options={this.props.filteredParties} onChange={(party) => this.onPartySelect(party.value)} validate={[required()]} />
                    <Field name="addressOfMerchant" component={renderSelectField} placeholder="Address of merchant" options={this.props.addresses} onChange={address => this.props.filterMerchantsByAddress(this.props.parties, address)} />
                    <Field name="merchant" component={renderSelectField} placeholder="Merchant" options={this.props.filteredMerchants} validate={[required()]} />
                    <Field type="text" name="motorNumber" component={renderField} placeholder="Motor Number" className="uppercase form-control" />
                    <JavakLots partyId={this.state.partyId} />
                    <div className="grid-item saveButton">
                        <button type="submit" className="btn btn-primary" disabled={this.submitting} value="Save"> Save </button>`
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
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveJavak: (values, thenCallback) => dispatch(actions.saveJavak(values, thenCallback)),
        filterPartiesByAddress: (type, thenCallback) => dispatch(actions.filterPartiesByAddress(type, thenCallback)),
        filterMerchantsByAddress: (parties, address) => dispatch(actions.filterMerchantsByAddress(parties, address)),
        fetchAvaksOfParty: (partyId, thenCallback) => dispatch(actions.fetchAvaksOfParty(partyId, thenCallback)),
        saveJavakLot: (avakId, javakId, thenCallback) => dispatch(actions.saveJavakLot(avakId, javakId, thenCallback)),
        fetchJavakLotsByJavakId: (javakId, thenCallback) => dispatch(actions.fetchJavakLotsByJavakId(javakId, thenCallback)),
        fetchJavakLotsByAvakIds: (avakId, thenCallback) => dispatch(actions.fetchJavakLotsByAvakIds(avakId, thenCallback)),
        removeTempJavakLots: () => dispatch(actions.removeTempJavakLots()),
        fetchLastJavak: (thenCallback) => dispatch(actions.fetchLastJavak(thenCallback)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form));