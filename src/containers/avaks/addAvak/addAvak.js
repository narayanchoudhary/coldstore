import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './addAvak.css';
import 'react-select/dist/react-select.css';
import { renderField, renderSelectField } from '../../../utils/fields';
import 'react-datepicker/dist/react-datepicker.css';
import { required, date } from 'redux-form-validators';
import moment from 'moment';

const overWeight = (value, allValues, props) => {
    let warning = undefined;
    if (value && allValues.weight) {
        warning = (allValues.weight / value) > 70 ? 'Over Weight' : undefined;
        warning = (allValues.weight / value) < 45 ? 'Under Weight' : undefined;
    }
    return warning;
}

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
        values.size = values.size.value;
        values.item = values.item.value;
        values.variety = values.variety.value;
        values.date = moment(values.date, 'YYYY-MM-DD').format('DD-MM-YYYY');
        this.props.saveAvak(values, () => {
            this.setState({ redirectToAvaks: true })
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

    render() {
        console.log('this.props.size', this.props.size);
        return (
            <form onSubmit={this.handleSubmit(this.submit)} className="avakForm">
                {this.state.redirectToAvaks ? <Redirect to="/avaks" /> : null}
                <div className="grid-container">
                    <Field type="text" name="date" component={renderField} placeholder="Date" validate={[required(), date({ format: 'dd-mm-yyyy', '<=': 'today' })]} autoFocus />
                    <Field name="address" component={renderSelectField} placeholder="Address" options={this.state.addresses} onChange={this.filterPartiesByAddress} />
                    <Field name="party" component={renderSelectField} placeholder="Party" options={this.state.parties} validate={[required()]} />
                    <Field name="item" component={renderSelectField} placeholder="Item" options={this.props.items} validate={[required()]} />
                    <Field name="variety" component={renderSelectField} placeholder="Variety" options={this.props.varieties} validate={[required()]} />
                    <Field name="size" component={renderSelectField} placeholder="Size" options={this.props.sizes} validate={[required()]} />
                    <Field type="text" name="privateMarka" component={renderField} placeholder="Priavate Marka" validate={[required()]} />
                    <Field type="number" name="packet" component={renderField} placeholder="Packet" min="0" validate={[required()]} warn={overWeight} />
                    <Field type="number" name="weight" component={renderField} placeholder="Weight" min="0" validate={[required()]} />
                    <Field type="text" name="motorNumber" component={renderField} placeholder="Motor Number" className="uppercase form-control" validate={[required()]} />
                    <Field type="text" name="remark" component={renderField} placeholder="Remark" />
                    <Field type="number" name='chamber' component={renderField} placeholder="Chamber" validate={[required()]} />
                    <Field type="number" name='floor' component={renderField} placeholder="Floor" validate={[required()]} />
                    <Field type="text" name='rack' component={renderField} placeholder="Racks" validate={[required()]} />
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
})(addAvak);

const mapStateToProps = state => {
    return {
        parties: state.party.parties.data,
        currentYear: state.year.currentYear,
        items: state.item.options,
        varieties: state.variety.options,
        sizes: state.size.options,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveAvak: (values, thenCallback) => dispatch(actions.saveAvak(values, thenCallback)),
        fetchParties: (type, thenCallback) => dispatch(actions.fetchParties(type, thenCallback))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);