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
        this.state = { merchants: [], parties: [], addresses: [], avaks: [], lots: [], javakId: null, partyId: null };
    }

    componentWillUnmount() {
        this.props.removeTempJavakLots();
    }

    componentDidMount = () => {
        // After fetching parties set parties and addresses
        this.props.fetchParties(['party'], () => {

            let parties = this.props.parties.map((party) => {
                return { label: party.name, value: party._id }
            });
            this.setState({ parties: parties, merchants: parties });

            let addresses = this.props.parties.map((party) => {
                return { label: party.address, value: party.address }
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
        });
    }

    submit = (values) => {
        delete values.address;
        values.party = values.party.value;
        values.merchant = values.merchant.value;
        this.props.saveJavak(values, (result) => {
            this.setState({ javakId: result.data._id, redirectToJavaks: true });
        });
    };

    filterPartiesByAddress = (address) => {
        let filteredParties = this.props.parties;
        if (address.value) {
            filteredParties = this.props.parties.filter(function (party) {
                return party.address === address.value;
            });
        }

        filteredParties = filteredParties.map((party) => {
            return { label: party.name, value: party._id }
        });
        this.setState({ parties: filteredParties });
    }

    onPartySelect = (partyId) => {
        this.setState({ partyId: partyId });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit(this.submit)} className="addJavakForm">
                {this.state.redirectToJavaks ? <Redirect to="/javaks" /> : null}
                <div className="grid-container">
                    <Field type="text" name="date" component={renderField} placeholder="Date" autoFocus validate={[required(), date({ format: 'dd-mm-yyyy', '<=': 'today' })]} />
                    <Field name="address" component={renderSelectField} placeholder="Address" options={this.state.addresses} onChange={this.filterPartiesByAddress} />
                    <Field name="merchant" component={renderSelectField} placeholder="Merchant" options={this.state.merchants} validate={[required()]} />
                    <Field type="text" name="motorNumber" component={renderField} placeholder="Motor Number" className="uppercase form-control" validate={[required()]} />
                    <Field name="party" component={renderSelectField} placeholder="Party" options={this.state.parties} onChange={(party) => this.onPartySelect(party.value)} validate={[required()]} />
                    <JavakLots javakId={this.state.javakId} partyId={this.state.partyId} />
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
    validate
})(addJavak);

const mapStateToProps = state => {
    return {
        parties: state.party.parties.data,
        addError: state.javak.addJavak.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveJavak: (values, thenCallback) => dispatch(actions.saveJavak(values, thenCallback)),
        fetchParties: (type, thenCallback) => dispatch(actions.fetchParties(type, thenCallback)),
        fetchAvaksOfParty: (partyId, thenCallback) => dispatch(actions.fetchAvaksOfParty(partyId, thenCallback)),
        saveJavakLot: (avakId, javakId, thenCallback) => dispatch(actions.saveJavakLot(avakId, javakId, thenCallback)),
        fetchJavakLotsByJavakId: (javakId, thenCallback) => dispatch(actions.fetchJavakLotsByJavakId(javakId, thenCallback)),
        fetchJavakLotsByAvakIds: (avakId, thenCallback) => dispatch(actions.fetchJavakLotsByAvakIds(avakId, thenCallback)),
        removeTempJavakLots: () => dispatch(actions.removeTempJavakLots())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form));