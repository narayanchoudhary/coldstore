import React, { Component } from 'react';
import Aux from '../Auxilary/Auxilary';
import { renderSelectField } from '../../utils/fields';
import { Field } from 'redux-form';
import { required } from 'redux-form-validators';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

class MerchantSelector extends Component {

    onChangeAddressOfMerchant = (addressOfMerchant) => {
        this.props.filterMerchantsByAddress(this.props.parties, addressOfMerchant, (filteredMerchants) => {
            if (filteredMerchants.length === 1) {
                this.props.change('merchant', filteredMerchants[0]);
            } else {
                this.props.change('merchant', null);
            }
        });
    }

    onChangeMerchant = (merchant) => {
        // Change the address also
        this.props.addresses.every((address, index) => {
            if (address.value === merchant.address) {
                this.props.change('addressOfMerchant', address);
                return false;// break loop
            }
            return true;
        });

    }

    render() {
        return (
            <Aux>
                <Field
                    name="addressOfMerchant"
                    component={renderSelectField}
                    placeholder="Address of merchant"
                    options={this.props.addresses}
                    onChange={address => this.onChangeAddressOfMerchant(address)}
                />
                <Field
                    name="merchant"
                    component={renderSelectField}
                    placeholder="Merchant"
                    options={this.props.filteredMerchants}
                    validate={[required()]}
                    onChange={merchant => this.onChangeMerchant(merchant)}
                />
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        parties: state.party.options,
        filteredParties: state.party.filteredPartiesOptions,
        filteredMerchants: state.party.filteredMerchantsOptions,
        addresses: state.address.options,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        filterPartiesByAddress: (parties, address, thenCallback) => dispatch(actions.filterPartiesByAddress(parties, address, thenCallback)),
        filterMerchantsByAddress: (parties, address, thenCallback) => dispatch(actions.filterMerchantsByAddress(parties, address, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MerchantSelector);