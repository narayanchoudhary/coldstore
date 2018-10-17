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
        this.props.fetchLastAvak((response) => { 
            this.props.filterPartiesByAddress(this.props.parties, { value: response.data[0].address });
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
        this.props.saveAvak(values, () => {
            this.setState({ redirectToAvaks: true })
        });
    };
    
    render() {
        return (
            <form onSubmit={this.handleSubmit(this.submit)} className="avakForm">
                {this.state.redirectToAvaks ? <Redirect to="/avaks" /> : null}
                <div className="grid-container">
                    <Field name="type" component={renderSelectField} placeholder="Type" options={this.props.type} validate={[required()]} />
                    <Field name="item" component={renderSelectField} placeholder="Item" options={this.props.items} validate={[required()]} />
                    <Field type="text" name="date" component={renderField} placeholder="Date" validate={[required(), date({ format: 'dd-mm-yyyy', '<=': 'today' })]}  />
                    <Field name="variety" component={renderSelectField} placeholder="Variety" options={this.props.varieties} validate={[required()]} />
                    <Field name="size" component={renderSelectField} placeholder="Size" options={this.props.sizes} validate={[required()]} />
                    <Field name="address" component={renderSelectField} placeholder="Address" options={this.props.addresses} onChange={(address) => this.props.filterPartiesByAddress(this.props.parties, address)} autoFocus />
                    <Field name="party" component={renderSelectField} placeholder="Party" options={this.props.filteredParties} validate={[required()]} />
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
    form: 'avakForm',// a unique identifier for this form
    keepDirtyOnReinitialize: true,
    enableReinitialize: true
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
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveAvak: (values, thenCallback) => dispatch(actions.saveAvak(values, thenCallback)),
        filterPartiesByAddress: (type, thenCallback) => dispatch(actions.filterPartiesByAddress(type, thenCallback)),
        fetchLastAvak: (thenCallback) => dispatch(actions.fetchLastAvak(thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);