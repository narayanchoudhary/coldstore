import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import './addJavak.css';
import 'react-select/dist/react-select.css';
import validate from './validation';
import { renderField, renderSelectField } from './fields';
import 'react-datepicker/dist/react-datepicker.css';
import JavakLots from './javakLots/javakLots';
import Aux from '../.././../components/Auxilary/Auxilary';

class addJavak extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.submitting = this.props.submitting;
        this.state = { parties: [], addresses: [], avaks: [], lots: [], javakId: null, partyId: null };
    }

    componentDidMount = () => {
        // After fetching parties set parties and addresses
        this.props.fetchParties(() => {
            let parties = this.props.parties.map((party) => {
                return { label: party.name, value: party._id }
            });
            this.setState({ parties: parties });

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
        if (this.state.javakId !== null) { //Do not save javak again if saved once
            return false;
        }
        delete values.address;
        values.party = values.party.value;
        values.merchant = values.merchant.value;
        this.props.saveJavak(values, (result) => {
            this.setState({ javakId: result.data._id });
            this.props.fetchAvaksOfParty(this.state.partyId, (response) => {
                let avaks = response.data.filter((item) => {
                    if (item.packet <= item.sentPacket) {
                        return false;
                    } else {
                        return true;
                    }
                }).map((avak) => {
                    let remainingPacket = avak.packet - avak.sentPacket;
                    let label = avak.packet.toString() + '-' + remainingPacket.toString();
                    return { label: label, value: avak._id }
                });
                this.setState({ avaks: avaks });
            });
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

    onAvakSelect = (avakId) => {
        this.props.saveJavakLot(avakId, this.state.javakId, () => {
            this.props.fetchJavakLotsByJavakId(this.state.javakId, (response) => {
                let lots = response.data.map((lot) => {
                    return {
                        _id: lot._id,
                        packet: lot.packet,
                        chamber: lot.chamber,
                        floor: lot.floor,
                        rack: lot.rack,
                        avakId: lot.avakId,
                        javakId: lot.javakId
                    };
                });
                this.setState({ lots: lots });
            });
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit(this.submit)}>
                {this.state.redirectToJavaks ? <Redirect to="/javaks" /> : null}
                <div className="grid-container">
                    <Field type="number" name="receiptNumber" component={renderField} placeholder="Receipt Number" min="0" />
                    <Field type="date" name="date" component={renderField} placeholder="Date" />
                    <Field name="address" component={renderSelectField} placeholder="Address" options={this.state.addresses} onChange={this.filterPartiesByAddress} />
                    <Field name="merchant" component={renderSelectField} placeholder="Merchant" options={this.state.parties} />
                    <Field type="text" name="motorNumber" component={renderField} placeholder="Motor Number" className="uppercase form-control" />
                    <Field name="party" component={renderSelectField} placeholder="Party" options={this.state.parties} onChange={(party) => this.onPartySelect(party.value)} />
                    {
                        this.state.avaks.length !== 0
                            ?
                            <Aux>
                                <Field name="avaks" component={renderSelectField} placeholder="Avaks" options={this.state.avaks} onChange={(avak) => this.onAvakSelect(avak.value)} />
                                <JavakLots lots={this.state.lots} />
                            </Aux>
                            : null
                    }
                    <div className="grid-item">
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
        fetchParties: (thenCallback) => dispatch(actions.fetchParties(thenCallback)),
        fetchAvaksOfParty: (partyId, thenCallback) => dispatch(actions.fetchAvaksOfParty(partyId, thenCallback)),
        saveJavakLot: (avakId, javakId, thenCallback) => dispatch(actions.saveJavakLot(avakId, javakId, thenCallback)),
        fetchJavakLotsByJavakId: (javakId, thenCallback) => dispatch(actions.fetchJavakLotsByJavakId(javakId, thenCallback)),
        fetchJavakLotsByAvakId: (avakId, thenCallback) => dispatch(actions.fetchJavakLotsByAvakId(avakId, thenCallback))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);