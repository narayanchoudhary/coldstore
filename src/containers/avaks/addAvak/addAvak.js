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
import Aux from '../../../components/Auxilary/Auxilary';
import SaveButton from '../../../components/UI/saveButton/saveButton';
import DateField from '../../../components/dateField/dateField';

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

    componentDidMount() {
        this.props.fetchLastAvak((lastAvak) => {
            this.props.filterPartiesByAddress(this.props.parties, { value: lastAvak.address.value });
            this.props.fetchNewReceiptNumber(lastAvak.type.value, () => {
            });
        });
    }

    submit = (values) => {
        values.address = values.address.value;
        values.type = values.type.value;
        values.party = values.party.value;
        values.size = values.size.value;
        values.item = values.item.value;
        values.variety = values.variety.value;
        values.yearId = this.props.currentYear.value; // Add current year 

        // doing this shit so that we dont face any problem while editing the avaks
        if (!values.privateMarka) values.privateMarka = '';
        if (!values.motorNumber) values.motorNumber = '';

        this.props.saveAvak(values, () => {
            this.setState({ redirectToAvaks: true })
        });
    };

    render() {
        return (
            <Aux>
                <form onSubmit={this.handleSubmit(this.submit)} className="avakForm">
                    {this.state.redirectToAvaks ? <Redirect to="/avaks" /> : null}
                    <p className="newReceiptNumber">Reciept Number: {parseInt(this.props.newReceiptNumber, 10) + 1}</p>
                    <div className="grid-container">
                        <DateField />
                        <Field name="type" component={renderSelectField} placeholder="Type" options={this.props.type} validate={[required()]} onChange={(type) => this.props.fetchNewReceiptNumber(type.value, () => { })} />
                        <Field name="item" component={renderSelectField} placeholder="Item" options={this.props.items} validate={[required()]} />
                        <Field name="address" component={renderSelectField} placeholder="Address" options={this.props.addresses} onChange={(address) => this.props.filterPartiesByAddress(this.props.parties, address)} validate={[required()]} autoFocus />
                        <Field name="party" component={renderSelectField} placeholder="Party" options={this.props.filteredParties} validate={[required()]} />
                        <Field name="variety" component={renderSelectField} placeholder="Variety" options={this.props.varieties} validate={[required()]} />
                        <Field name="size" component={renderSelectField} placeholder="Size" options={this.props.sizes} validate={[required()]} />
                        <Field type="text" name="privateMarka" component={renderField} placeholder="Priavate Marka" />
                        <Field type="number" name="packet" component={renderField} placeholder="Packet" min="0" validate={[required()]} warn={overWeight} />
                        <Field type="number" name="weight" component={renderField} placeholder="Weight" min="0" validate={[required()]} />
                        <Field type="text" name="motorNumber" component={renderField} placeholder="Motor Number" className="uppercase form-control" />
                        <Field type="text" name="remark" component={renderField} placeholder="Remark" />
                        <Field type="number" name='chamber' component={renderField} placeholder="Chamber" validate={[required()]} />
                        <Field type="number" name='floor' component={renderField} placeholder="Floor" validate={[required()]} />
                        <Field type="text" name='rack' component={renderField} placeholder="Racks" validate={[required()]} />
                        <div className="grid-item">
                            <SaveButton disabled={this.submitting} />
                        </div>
                    </div>
                </form>
            </Aux>
        )
    }
}

const Form = reduxForm({
    form: 'avakForm',// a unique identifier for this form
    keepDirtyOnReinitialize: true,
    enableReinitialize: true,
    updateUnregisteredFields: true,
})(addAvak);

const mapStateToProps = state => {
    return {
        parties: state.party.options,
        filteredParties: state.party.filteredPartiesOptions,
        currentYear: state.year.currentYear,
        items: state.item.options,
        varieties: state.variety.options,
        sizes: state.size.options,
        addresses: state.address.options,
        type: state.item.typeOptions,
        initialValues: state.avak.lastAvak,
        newReceiptNumber: state.avak.newReceiptNumber,

    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveAvak: (values, thenCallback) => dispatch(actions.saveAvak(values, thenCallback)),
        filterPartiesByAddress: (type, thenCallback) => dispatch(actions.filterPartiesByAddress(type, thenCallback)),
        fetchLastAvak: (thenCallback) => dispatch(actions.fetchLastAvak(thenCallback)),
        fetchNewReceiptNumber: (type, thenCallback) => dispatch(actions.fetchNewReceiptNumber(type, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);