import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './addAvak.css';
import 'react-select/dist/react-select.css';
import validate from './validation';
import { renderField, renderSelectField, renderRacks } from '../../../fields';
import 'react-datepicker/dist/react-datepicker.css';
import CONST from '../../../constants';

class addAvak extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.submitting = this.props.submitting;
        this.state = { parties: [], addresses: [] };
    }

    componentDidMount = () => {
        // After fetching parties set parties and addresses
        this.props.fetchParties(['party'], () => {
            let parties = this.props.parties.map((party) => {
                return { label: party.name, value: party._id }
            });
            
            this.setState({ parties: parties });

            let addresses = this.props.parties.map((party) => {
                return { label: party.address, value: party.address }
            });

            let unique_addresses =  [];
            addresses = addresses.filter((address)=> {
                if(!unique_addresses.includes(address.value)) {
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
        values.size  = values.size.value;
        values.item  = values.item.value;
        values.variety = values.variety.value;
        this.props.saveAvak(values);
        if (this.props.addError === false) {
            this.setState({ redirectToAvaks: true })
        }
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

    render() {
        return (
            <form onSubmit={this.handleSubmit(this.submit)}>
                {this.state.redirectToAvaks ? <Redirect to="/avaks" /> : null}
                <div className="grid-container">
                    <Field type="number" name="receiptNumber" component={renderField} placeholder="Receipt Number" min="0" />
                    <Field type="date" name="date" component={renderField} placeholder="Date" />
                    <Field name="address" component={renderSelectField} placeholder="Address" options={this.state.addresses} onChange={this.filterPartiesByAddress} />
                    <Field name="party" component={renderSelectField} placeholder="Party" options={this.state.parties} />
                    <Field name="item" component={renderSelectField} placeholder="Item" options={CONST.ITEMS} />
                    <Field name="variety" component={renderSelectField} placeholder="Variety" options={CONST.VARIETIES} />
                    <Field name="size" component={renderSelectField} placeholder="Size" options={CONST.SIZES} />
                    <Field type="text" name="privateMarka" component={renderField} placeholder="Priavate Marka" />
                    <Field type="number" name="packet" component={renderField} placeholder="Packet" min="0" />
                    <Field type="number" name="weight" component={renderField} placeholder="Weight" min="0" />
                    <Field type="text" name="motorNumber" component={renderField} placeholder="Motor Number" className="uppercase form-control" />
                    <Field type="text" name="remark" component={renderField} placeholder="Remark" />
                    <Field type="number" name='chamber' component={renderField} placeholder="Chamber" />
                    <Field type="number" name='floor' component={renderField} placeholder="Floor" />
                    <Field type="text" name='rack' component={renderField} placeholder="Racks" />
                    <div className="grid-item">
                        <button type="submit" className="btn btn-primary" disabled={this.submitting} value="Save"> Save </button>`
                    </div>
                </div>
            </form>
        )
    }
}

const Form = reduxForm({
    form: 'avak',// a unique identifier for this form
    validate
})(addAvak);

const mapStateToProps = state => {
    return {
        parties: state.party.parties.data,
        addError: state.avak.addAvak.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveAvak: (values) => dispatch(actions.saveAvak(values)),
        fetchParties: (type, thenCallback) => dispatch(actions.fetchParties(type, thenCallback))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);