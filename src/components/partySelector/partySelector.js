import React, { Component } from 'react';
import Aux from '../Auxilary/Auxilary';
import { renderSelectField } from '../../utils/fields';
import { Field } from 'redux-form';
import { required } from 'redux-form-validators';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

class PartySelector extends Component {

    onChangeAddress = (address) => {
        this.props.filterPartiesByAddress(this.props.parties, address, (filteredParties) => {
            if (filteredParties.length === 1) {
                this.props.change('party', filteredParties[0]);
            } else {
                this.props.change('party', null);
            }

            if(this.props.rentType && this.props.rentType.value === 'cash') {
                this.props.change('addressOfMerchant', address);// Change addressOfMerchant to the  address
            }
        });
    }

    onPartyChange = (party) => {
        // Change merchant to the party
        if(this.props.rentType && this.props.rentType.value === 'cash') {
            this.props.change('merchant', party);
        }

        // Change the address also
        this.props.addresses.every((address, index) => {
            if (address.value === party.address) {
                this.props.change('address', address);
                this.onChangeAddress(address);
                return false;// break loop
            }
            return true;
        });

    }

    render() {
        return (
            <Aux>
                <Field
                    name="address"
                    component={renderSelectField}
                    placeholder="Address"
                    options={this.props.addresses}
                    onChange={this.onChangeAddress}
                />

                <Field
                    name="party"
                    component={renderSelectField}
                    placeholder="Party"
                    options={this.props.filteredParties}
                    validate={[required()]}
                    onChange={this.onPartyChange}
                />
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        parties: state.party.options,
        filteredParties: state.party.filteredPartiesOptions,
        addresses: state.address.options,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        filterPartiesByAddress: (parties, address, thenCallback) => dispatch(actions.filterPartiesByAddress(parties, address, thenCallback)),
        filterMerchantsByAddress: (parties, address, thenCallback) => dispatch(actions.filterMerchantsByAddress(parties, address, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PartySelector);